"""usage: crawl.py http://127.0.0.1:PORT
Crawl every page and asset under the prefix; report broken links and requests escaping the prefix."""
import re, sys, urllib.request, urllib.parse, collections, html
BASE = sys.argv[1].rstrip('/'); P = '/tai-lieu-nocobase/'
start = [BASE + P, BASE + P + 'sitemap.xml']
src_of = {}
seen, broken, escaping, external = set(), [], [], collections.Counter()
q = list(start)
pat = re.compile(r'''(?:\s(?:href|src|poster)=["']([^"']+)["'])|(?:\scontent=["']((?:/|https?:)[^"']*)["'])|(?:\ssrcset=["']([^"']+)["'])|(?:url\(["']?([^)"']+))''')
def get(u):
    try:
        r = urllib.request.urlopen(u); return r.status, r.headers.get('Content-Type', ''), r.read()
    except urllib.error.HTTPError as e: return e.code, '', b''
while q:
    u = q.pop()
    if u in seen: continue
    seen.add(u)
    st, ct, body = get(u)
    if st != 200: broken.append((st, u, src_of.get(u))); continue
    if not any(t in ct for t in ('html', 'css', 'xml')): continue
    text = body.decode('utf8', 'replace')
    refs = []
    for m in pat.finditer(text):
        if m.group(3): refs += [p.strip().split(' ')[0] for p in m.group(3).split(',')]
        else: refs.append(m.group(1) or m.group(2) or m.group(4))
    if 'xml' in ct: refs += re.findall(r'<loc>([^<]+)</loc>', text)
    for r in refs:
        r = html.unescape(r.strip())
        if not r or r.startswith(('#', 'data:', 'mailto:', 'javascript:')) or ' ' in r and not r.startswith('/'): continue
        if '{' in r or r.startswith('width='): continue  # meta viewport etc
        absu = urllib.parse.urljoin(u, r); pu = urllib.parse.urlsplit(absu)
        if pu.scheme not in ('http', 'https'): continue
        if absu.startswith('https://oxmode.ai/tai-lieu-nocobase/'):
            absu = BASE + absu[len('https://oxmode.ai'):]; pu = urllib.parse.urlsplit(absu)
        if absu.startswith(BASE):
            if not pu.path.startswith(P): escaping.append((absu, u)); continue
            clean = urllib.parse.urlunsplit(pu._replace(fragment=''))
            src_of.setdefault(clean, u); q.append(clean)
        else:
            external[pu.netloc + (pu.path if pu.netloc == 'oxmode.ai' else '')] += 1
print('fetched', len(seen), 'broken', len(broken), 'escaping', len(escaping))
for b in broken[:30]: print('BROKEN', b)
for e in escaping[:30]: print('ESCAPE', e)
print('external hosts:'); [print(' ', k, v) for k, v in external.most_common()]

sys.exit(1 if broken or escaping else 0)
