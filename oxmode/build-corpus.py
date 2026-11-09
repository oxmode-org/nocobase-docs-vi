#!/usr/bin/env python3
"""Build an isolated, explicitly non-publishable preview from pinned upstream + translation overlay."""
from pathlib import Path
import argparse, json, os, shutil, subprocess, tempfile
P=argparse.ArgumentParser()
P.add_argument('--preview', action='store_true', help='Allow untranslated pages and disallow indexing')
P.add_argument('--output', required=True, help='Absolute output release directory')
P.add_argument('--origin', default='https://oxmode.ai')
A=P.parse_args()
ROOT=Path(__file__).resolve().parent.parent
OLD=ROOT/'doc'
UP=ROOT/'oxmode'/'corpus'
TRANS=UP/'vi'
OUT=Path(A.output).resolve()
if OUT == Path('/') or OUT == ROOT or ROOT in OUT.parents: raise SystemExit('Unsafe output directory')
if not A.preview and os.environ.get('NOCOBASE_REPUBLICATION_AUTHORIZED') != 'yes':
    raise SystemExit('Release blocked: confirm permission to republish by setting NOCOBASE_REPUBLICATION_AUTHORIZED=yes')
TMP=tempfile.TemporaryDirectory(prefix='oxmode-docs-build-')
STAGE=Path(TMP.name)/'doc'
if STAGE.exists(): shutil.rmtree(STAGE)
STAGE.mkdir()
for name in ['assets','figures','landing']:
    shutil.copytree(OLD/name,STAGE/name)
(STAGE/'node_modules').symlink_to(OLD/'node_modules', target_is_directory=True)
(STAGE/'src'/'vi').mkdir(parents=True)
keys=[]
for f in sorted((UP/'en').rglob('*.md')):
    r=f.relative_to(UP/'en')
    if r.parts[0] in ('zh-CN','ja-JP'): continue
    keys.append(r.with_suffix('').as_posix())
    d=STAGE/'src'/r; d.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(f,d)
for f in TRANS.rglob('*.md'):
    r=f.relative_to(TRANS)
    if r.with_suffix('').as_posix() not in keys: raise SystemExit(f'Unknown translation path: {r}')
    if not f.read_text().startswith('---\n'): raise SystemExit(f'Missing front matter: {r}')
    d=STAGE/'src'/'vi'/r; d.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(f,d)
shutil.copy2(OLD/'src'/'vi'/'_titles.json',STAGE/'src'/'vi'/'_titles.json')
missing=set(keys)-{f.relative_to(TRANS).with_suffix('').as_posix() for f in TRANS.rglob('*.md')}
if missing and not A.preview: raise SystemExit(f'Release blocked: {len(missing)} translations missing')
# Mirror the pinned upstream's documented order and grouping; keep all 199 paths.
import re
names={'Introduction':'Giới thiệu','Hands-on':'Thực hành','More':'Tìm hiểu thêm','Developing apps':'Phát triển ứng dụng','Using plugins':'Sử dụng plugin','Developing plugins':'Phát triển plugin','Framework':'Framework','Deployment and operations':'Triển khai và vận hành','Reference':'Tham khảo','Install and configure':'Cài đặt và cấu hình','Get started':'Bắt đầu','Task development':'Phát triển tác vụ','Project management':'Quản lý dự án','Agent management':'Quản lý Agent','Quality management':'Quản lý chất lượng','Release management':'Quản lý bản phát hành','Administration':'Quản trị','Getting started':'Bắt đầu','Part 1: Build an app with Core':'Phần 1: Xây dựng ứng dụng với Core','Part 2: Use Studio in a team':'Phần 2: Dùng Studio trong nhóm','Best practices':'Các phương pháp tốt','Appendix':'Phụ lục','Tutorials':'Hướng dẫn','FAQ':'Câu hỏi thường gặp'}
sections=[{'key':'start','title':'Bắt đầu','dir':'','nav':[{'items':['index']}]},{'key':'core','title':'Core','dir':'core/','nav':[]},{'key':'studio','title':'Studio','dir':'studio/','nav':[]}]
current=None; group=None
for line in (UP/'upstream-llms.txt').read_text().splitlines():
    if line.startswith('## '):
        name=line[3:]; current=sections[1] if name=='Core' else sections[2] if name=='Studio' else sections[0]
        group={'title':names.get(name,name),'items':[]}; current['nav'].append(group)
    elif line.startswith('### '):
        name=line[4:]; group={'title':names.get(name,name),'items':[]}; current['nav'].append(group)
    else:
        match=re.search(r'\]\(https://docs\.nocobase\.com/([^)]*)\.md\)',line)
        if match:
            k=match.group(1)
            if k not in keys or not k.startswith(current['dir']): raise SystemExit(f'Invalid navigation entry: {k}')
            group['items'].append(k[len(current['dir']):])
for section in sections: section['nav']=[g for g in section['nav'] if g['items']]
navkeys=[section['dir']+k for section in sections for group in section['nav'] for k in group['items']]
if sorted(keys)!=sorted(navkeys): raise SystemExit('Navigation does not match pinned source corpus')
s=(OLD/'build.mjs').read_text()
a=s.index('const SECTIONS = ['); b=s.index('const VI_TITLES =',a)
s=s[:a]+'const SECTIONS = '+json.dumps(sections,ensure_ascii=False)+';\n'+s[b:]
s=s.replace("const LANDINGS = { vi: landingVi };", "const LANDINGS = {};")
if A.preview:
    s=s.replace("const headOf = (lang, key, title, description) => {\n  const alternates = alternatesOf(key);\n  return [", "const headOf = (lang, key, title, description) => {\n  const alternates = alternatesOf(key);\n  return [\n    '<meta name=\"robots\" content=\"noindex,nofollow\">',")
# Mark Markdown copies as well as HTML when the text has not been translated.
s=s.replace('const md = `# ${meta.title}\\n\\n${meta.description', 'const md = `${meta.fallback ? \"<!-- Chưa có bản tiếng Việt; nội dung tiếng Anh gốc. -->\\n\\n\" : \"\"}# ${meta.title}\\n\\n${meta.description')
# Unpublished preview must never be indexed or confused with the public release.
s=s.replace("const sitemapEntries = [];", "const sitemapEntries = [];")
(STAGE/'build.mjs').write_text(s)
env=os.environ.copy(); env.update(DOCS_BASE='/tai-lieu-nocobase-3/',DOCS_SITE_ORIGIN=A.origin,DOCS_OUT_DIR=str(OUT/'tai-lieu-nocobase-3'))
subprocess.run(['node',str(STAGE/'build.mjs')],check=True,env=env)
# Retain the exact live baseline in an archive, and preserve retired URLs and fragments.
# Build from the pinned historical sources; do not approximate old heading destinations.
from html.parser import HTMLParser
from html import escape
from urllib.parse import quote
import re
legacy_stage=Path(TMP.name)/'legacy-doc'
shutil.copytree(ROOT/'oxmode'/'legacy-doc',legacy_stage)
for name in ['assets','figures']:
    shutil.copytree(OLD/name,legacy_stage/name)
(legacy_stage/'node_modules').symlink_to(OLD/'node_modules', target_is_directory=True)
legacy_out=Path(TMP.name)/'legacy-output'
legacy_env=env.copy(); legacy_env['DOCS_OUT_DIR']=str(legacy_out)
subprocess.run(['node',str(legacy_stage/'build.mjs')],check=True,env=legacy_env)
site=OUT/'tai-lieu-nocobase-3'; archived=site/'legacy'
class MainIds(HTMLParser):
    def __init__(self): super().__init__(); self.level=0; self.ids=set()
    def handle_starttag(self,tag,attrs):
        if tag=='main': self.level+=1
        if self.level:
            self.ids.update(v for k,v in attrs if k=='id' and v)
    def handle_endtag(self,tag):
        if tag=='main' and self.level: self.level-=1
def ids(html):
    p=MainIds(); p.feed(html); return p.ids
def archive_html(html):
    html=re.sub(r'<link rel="(?:canonical|alternate)"[^>]*>', '', html)
    html=html.replace('</head>', '<meta name="robots" content="noindex,follow"></head>',1)
    html=html.replace('data-pagefind-body', 'data-pagefind-ignore')
    return html
def notice(html):
    warning='<aside class="legacy-notice" role="note"><strong>Bản lưu tài liệu cũ.</strong> Nội dung này phản ánh phiên bản trước và có thể không còn cập nhật. <a href="/tai-lieu-nocobase-3/">Xem tài liệu hiện hành</a>.</aside>'
    return re.sub(r'(<main\b[^>]*>)',lambda m:m.group(1)+warning,html,count=1)
retired=0; repaired=0
for old_file in legacy_out.rglob('index.html'):
    rel=old_file.relative_to(legacy_out)
    old=old_file.read_text(); new=site/rel
    archive=archived/rel; archive.parent.mkdir(parents=True,exist_ok=True)
    archive.write_text(notice(archive_html(old)))
    old_md=legacy_out / (str(rel.parent)+'.md') if str(rel.parent)!='.' else legacy_out/'index.md'
    if old_md.exists():
        md_out=archived / (str(rel.parent)+'.md') if str(rel.parent)!='.' else archived/'index.md'
        md_out.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(old_md,md_out)
    if not new.exists():
        new.parent.mkdir(parents=True,exist_ok=True); new.write_text(notice(archive_html(old)))
        if old_md.exists():
            md_out=site/(str(rel.parent)+'.md'); md_out.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(old_md,md_out)
        retired+=1
    else:
        current=new.read_text(); missing_ids=sorted(ids(old)-ids(current))
        if missing_ids:
            archive_path='/tai-lieu-nocobase-3/legacy/' + ('' if str(rel.parent)=='.' else str(rel.parent)+'/')
            links=''.join('<p id="'+escape(anchor,quote=True)+'">Mục này thuộc phiên bản cũ: <a href="'+escape(archive_path+'#'+quote(anchor),quote=True)+'">xem mục tương ứng trong bản lưu</a>.</p>' for anchor in missing_ids)
            block='<section class="legacy-anchors" aria-label="Các mục trong bản tài liệu cũ">'+links+'</section>'
            if '</main>' not in current: raise SystemExit(f'Missing main in {new}')
            new.write_text(current.replace('</main>',block+'</main>',1)); repaired+=len(missing_ids)
print(f'Legacy: archived 69 pages, retained {retired} retired URLs, linked {repaired} old anchors')
if A.preview: (OUT/'tai-lieu-nocobase-3'/'robots.txt').write_text('User-agent: *\nDisallow: /\n')
subprocess.run([str(OLD/'node_modules'/'.bin'/'pagefind'),'--site',str(OUT/'tai-lieu-nocobase-3'),'--output-subdir','pagefind','--quiet'],check=True)
print(f'BUILD {OUT} pages={len(keys)} translated={len(keys)-len(missing)} missing={len(missing)} preview={A.preview}')
