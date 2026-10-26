"""Package the Vietnamese pages of an Astro docs build for https://oxmode.ai/tai-lieu-nocobase/.

usage: package_vi.py <astro-dist> <out> [--prefix tai-lieu-nocobase] [--build-origin https://docs-build.invalid]
                     [--origin https://oxmode.ai] [--release <id>]

<out> is a release root: files land in <out>/<prefix>/..., the layout Caddy serves
(root /srv/oxmode/docs/current, try_files {path} {path}/index.html /<prefix>/404.html).
Vietnamese becomes the default language: dist/vi/x -> /<prefix>/x. Other locales are dropped;
shared assets (_astro) are kept only when a Vietnamese file references them. Pagefind is rebuilt
separately over <out> (see build.sh) so result URLs carry the prefix.
"""
import argparse, json, os, re, shutil, subprocess, time

ap = argparse.ArgumentParser()
ap.add_argument('src'); ap.add_argument('out')
ap.add_argument('--prefix', default='tai-lieu-nocobase')
ap.add_argument('--build-origin', default='https://docs-build.invalid')
ap.add_argument('--origin', default='https://oxmode.ai')
ap.add_argument('--release', default='')
a = ap.parse_args()
P = '/' + a.prefix.strip('/') + '/'
root = os.path.join(a.out, a.prefix.strip('/'))
if os.path.exists(a.out): shutil.rmtree(a.out)
shutil.copytree(os.path.join(a.src, 'vi'), root)

TEXT = ('html', 'css', 'js', 'xml', 'txt', 'md', 'json')

def rebase_path(path):
    """Root-relative path of the full build -> path under the prefix."""
    if path == '/vi' or path.startswith('/vi/') or path.startswith('/vi?') or path.startswith('/vi#'):
        return P + path[4:]
    return P + path[1:]

attr = re.compile(r'(\s(?:href|src|action|content|poster|data-[\w-]+)=")(/(?!/)[^"]*)"')
srcset = re.compile(r'(\ssrcset=")([^"]*)"')
cssurl = re.compile(r'url\((["\']?)(/(?!/)[^)"\']*)')
jsonstr = re.compile(r'(":\s*")(/(?!/)[^"]*)"')
jsonblk = re.compile(r'(<script type="application/(?:ld\+)?json"[^>]*>)(.*?)(</script>)', re.S)
mdlink = re.compile(r'\]\((/(?!/)[^)\s]*)')
B = a.build_origin.rstrip('/')
O = a.origin.rstrip('/') + P

from urllib.parse import quote
def rewrite(s, ext):
    for enc in (quote(B + '/vi/', safe=''), quote(B + '/vi/', safe='').lower()):
        s = s.replace(enc, quote(O, safe=''))
    s = s.replace(B + '/vi/', O).replace(B + '/vi"', O + '"').replace(B + '/', O)
    if ext == 'html':
        s = attr.sub(lambda m: m.group(1) + rebase_path(m.group(2)) + '"', s)
        s = srcset.sub(lambda m: m.group(1) + ', '.join(
            (rebase_path(p.strip()) if p.strip().startswith('/') and not p.strip().startswith('//') else p.strip())
            for p in m.group(2).split(',')) + '"', s)
        s = jsonblk.sub(lambda m: m.group(1) + jsonstr.sub(lambda n: n.group(1) + rebase_path(n.group(2)) + '"', m.group(2)) + m.group(3), s)
    if ext in ('html', 'css'):
        s = cssurl.sub(lambda m: 'url(' + m.group(1) + rebase_path(m.group(2)), s)
    if ext in ('md', 'txt'):
        s = mdlink.sub(lambda m: '](' + rebase_path(m.group(1)), s)
    return s

counts = {}
for d, _, files in os.walk(root):
    for f in files:
        ext = f.rsplit('.', 1)[-1]
        if ext not in TEXT: continue
        p = os.path.join(d, f); s = open(p, encoding='utf8').read(); n = rewrite(s, ext)
        if n != s: open(p, 'w', encoding='utf8').write(n); counts[ext] = counts.get(ext, 0) + 1

# Shared assets: copy every _astro file a Vietnamese file references, transitively (CSS fonts, JS chunks).
astro_src = os.path.join(a.src, '_astro'); astro_dst = os.path.join(root, '_astro'); os.makedirs(astro_dst)
ref = re.compile(r'_astro/([\w.\-@%]+)')
relimp = re.compile(r'["\'`]\./([\w.\-]+\.(?:js|css))')
queue = []
for d, _, files in os.walk(root):
    if d.startswith(astro_dst): continue
    for f in files:
        if f.rsplit('.', 1)[-1] in TEXT:
            queue += ref.findall(open(os.path.join(d, f), encoding='utf8').read())
seen = set()
while queue:
    name = queue.pop()
    if name in seen: continue
    seen.add(name); sp = os.path.join(astro_src, name)
    if not os.path.isfile(sp): continue
    dp = os.path.join(astro_dst, name); shutil.copy2(sp, dp)
    ext = name.rsplit('.', 1)[-1]
    if ext in ('css', 'js'):
        s = open(dp, encoding='utf8').read(); n = rewrite(s, ext)
        if n != s: open(dp, 'w', encoding='utf8').write(n)
        queue += ref.findall(n) + relimp.findall(n)

# sitemap: Vietnamese URLs only, rebuilt from the full sitemap.
sm = open(os.path.join(a.src, 'sitemap.xml'), encoding='utf8').read()
urls = re.findall(r'  <url>.*?</url>', sm, re.S)
keep = [rewrite(u, 'xml') for u in urls if (B + '/vi/') in u.split('</loc>')[0]]
head, _, _ = sm.partition('  <url>')
open(os.path.join(root, 'sitemap.xml'), 'w', encoding='utf8').write(head + '\n'.join(keep) + '\n</urlset>\n')

assert os.path.isfile(os.path.join(root, '404.html')), 'vi 404.html missing'
assert os.path.isfile(os.path.join(root, 'index.html')), 'vi index.html missing'
rel = a.release or 'local'
open(os.path.join(root, 'release.json'), 'w').write(json.dumps({'release': rel, 'built_at': int(time.time())}) + '\n')
print('rewritten', counts, '| _astro files', len(os.listdir(astro_dst)), '| sitemap urls', len(keep))
