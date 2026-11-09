#!/usr/bin/env python3
"""Check same-site HTML fragment references in the generated documentation."""
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote,urlsplit
import sys
site=Path(sys.argv[1]); prefix='/tai-lieu-nocobase-3/'; parsed={}; links=[]
class Scan(HTMLParser):
 def __init__(self):super().__init__();self.ids=set();self.links=[]
 def handle_starttag(self,tag,attrs):
  for k,v in attrs:
   if k=='id' and v:self.ids.add(v)
   if k=='href' and v:self.links.append(v)
for f in site.rglob('index.html'):
 p=Scan();p.feed(f.read_text());parsed[f]=p
for f,p in parsed.items():
 for href in p.links:
  u=urlsplit(href)
  if not u.fragment or u.scheme or u.netloc:continue
  if u.path.startswith(prefix): target=site/u.path[len(prefix):]/'index.html'
  elif not u.path:target=f
  else:continue
  if target in parsed and unquote(u.fragment) not in parsed[target].ids:links.append((str(f.relative_to(site)),href))
print(f'Checked {len(parsed)} HTML pages; {len(links)} unresolved internal fragment links')
for f,h in links[:40]:print(f'{f}: {h}')
sys.exit(bool(links))
