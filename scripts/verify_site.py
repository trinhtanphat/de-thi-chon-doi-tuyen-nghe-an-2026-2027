from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]
REQUIRED = [ROOT/'index.html', ROOT/'de-bai.html', ROOT/'assets/styles.css', ROOT/'assets/app.js'] + [ROOT/f'solutions/q{i}.html' for i in range(1, 8)]
BAD = ('Ã', 'Â', 'Ä', 'Æ', 'á»', 'áº', '\ufffd', 'TODO', 'TBD')

class Links(HTMLParser):
    def __init__(self):
        super().__init__(); self.hrefs=[]; self.ids=[]
    def handle_starttag(self, tag, attrs):
        d=dict(attrs)
        if 'href' in d: self.hrefs.append(d['href'])
        if 'id' in d: self.ids.append(d['id'])

errors=[]
for p in REQUIRED:
    if not p.exists(): errors.append(f'MISSING {p.relative_to(ROOT)}')

for p in ROOT.rglob('*'):
    if p.suffix.lower() not in {'.html','.css','.js','.md'} or not p.is_file(): continue
    text=p.read_text(encoding='utf-8')
    for token in BAD:
        if token in text: errors.append(f'BAD_TOKEN {token!r} in {p.relative_to(ROOT)}')
    if p.suffix.lower()=='.html':
        parser=Links(); parser.feed(text)
        if len(parser.ids)!=len(set(parser.ids)): errors.append(f'DUPLICATE_ID {p.relative_to(ROOT)}')
        for href in parser.hrefs:
            if href.startswith(('#','http://','https://','mailto:','javascript:')): continue
            target=(p.parent / urlparse(href).path).resolve()
            if not target.exists(): errors.append(f'BROKEN_LINK {p.relative_to(ROOT)} -> {href}')
for i in range(1,8):
    p=ROOT/f'solutions/q{i}.html'
    if not p.exists(): continue
    t=p.read_text(encoding='utf-8')
    if 'Đề bài' not in t: errors.append(f'NO_STATEMENT q{i}')
    if 'class="answer"' not in t: errors.append(f'NO_ANSWER_BOX q{i}')

if errors:
    print('SITE VERIFY: FAIL')
    for e in errors: print(' -',e)
    raise SystemExit(1)
print(f'SITE VERIFY: PASS ({len(REQUIRED)} required files, 7 solution pages, links/UTF-8 clean)')
