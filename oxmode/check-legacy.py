#!/usr/bin/env python3
"""Verify that each baseline page and every former main-content id remain reachable."""
from html.parser import HTMLParser
from pathlib import Path
import sys
old=Path(sys.argv[1]); site=Path(sys.argv[2]); failures=[]; pages=anchors=0
class Ids(HTMLParser):
 def __init__(self): super().__init__(); self.main=False; self.ids=[]
 def handle_starttag(self,tag,attrs):
  if tag=='main': self.main=True
  if self.main: self.ids.extend(v for k,v in attrs if k=='id' and v)
 def handle_endtag(self,tag):
  if tag=='main': self.main=False
def ids(file):
 p=Ids();p.feed(file.read_text());return p.ids
for source in old.rglob('index.html'):
 rel=source.relative_to(old); current=site/rel; archive=site/'legacy'/rel; pages+=1
 if not current.exists() or not archive.exists(): failures.append(f'missing page {rel}');continue
 before=set(ids(source)); after=ids(current); retained=set(after); archiveids=set(ids(archive))
 for anchor in before:
  anchors+=1
  if anchor not in retained or anchor not in archiveids: failures.append(f'missing id {rel} #{anchor}')
 if len(after)!=len(set(after)): failures.append(f'duplicate id in {rel}')
print(f'Checked {pages} legacy pages and {anchors} IDs; failures: {len(failures)}')
for failure in failures[:30]: print(failure)
sys.exit(bool(failures))
