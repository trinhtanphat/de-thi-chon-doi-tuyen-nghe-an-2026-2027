from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import sys
import re

if hasattr(sys.stdout,'reconfigure'):sys.stdout.reconfigure(encoding='utf-8')
ROOT=Path(__file__).resolve().parents[1]
REQUIRED=[ROOT/'index.html',ROOT/'de-bai.html',ROOT/'assets/styles.css',ROOT/'assets/app.js',ROOT/'tools/geometry-core.js',ROOT/'tools/q3-interactive.js',ROOT/'tools/q5-interactive.js']+[ROOT/f'solutions/q{i}.html' for i in range(1,8)]
BAD=('Ã','Â','Ä','Æ','á»','áº','\ufffd','TODO','TBD')

class Links(HTMLParser):
    def __init__(self): super().__init__();self.hrefs=[];self.ids=[]
    def handle_starttag(self,tag,attrs):
        d=dict(attrs)
        if 'href' in d:self.hrefs.append(d['href'])
        if 'id' in d:self.ids.append(d['id'])

errors=[]
for p in REQUIRED:
    if not p.exists():errors.append(f'MISSING {p.relative_to(ROOT)}')
for p in ROOT.rglob('*'):
    if p.suffix.lower() not in {'.html','.css','.js','.md'} or not p.is_file():continue
    text=p.read_text(encoding='utf-8-sig')
    for token in BAD:
        if token in text:errors.append(f'BAD_TOKEN {token!r} in {p.relative_to(ROOT)}')
    if p.suffix.lower()=='.html':
        for pat in (r'\\\((.*?)\\\)',r'\\\[(.*?)\\\]'):
            for m in re.finditer(pat,text,re.S):
                if '<' in m.group(1): errors.append(f'RAW_LT_IN_TEX {p.relative_to(ROOT)}: {m.group(0)[:80]}')
        parser=Links();parser.feed(text)
        if len(parser.ids)!=len(set(parser.ids)):errors.append(f'DUPLICATE_ID {p.relative_to(ROOT)}')
        for href in parser.hrefs:
            if href.startswith(('#','http://','https://','mailto:','javascript:')):continue
            target=(p.parent/urlparse(href).path).resolve()
            if not target.exists():errors.append(f'BROKEN_LINK {p.relative_to(ROOT)} -> {href}')

for i in range(1,8):
    p=ROOT/f'solutions/q{i}.html'
    if not p.exists():continue
    t=p.read_text(encoding='utf-8-sig')
    if 'Đề bài' not in t:errors.append(f'NO_STATEMENT q{i}')
    if 'class="answer"' not in t:errors.append(f'NO_ANSWER_BOX q{i}')

css=(ROOT/'assets/styles.css').read_text(encoding='utf-8-sig')
for font in ('Be Vietnam Pro','Noto Serif'):
    if font not in css:errors.append(f'MISSING_FONT {font}')
exam=(ROOT/'de-bai.html').read_text(encoding='utf-8-sig')
exam_checks={
    'q7-fixed-state':'Trong mỗi lượt ghi, trạng thái của các ngọn đèn được giữ cố định.',
    'q7-wrap':r'sau ngọn đèn thứ \(n\) lại đến ngọn đèn thứ \(1\)',
    'q7-si':r'Gọi số ghi được tại ngọn đèn thứ \(i\) là \(s_i\).'}
for label,phrase in exam_checks.items():
    if phrase not in exam:errors.append(f'EXAM_MISSING_{label}')
q2=(ROOT/'solutions/q2.html').read_text(encoding='utf-8-sig')
q3=(ROOT/'solutions/q3.html').read_text(encoding='utf-8-sig')
q5=(ROOT/'solutions/q5.html').read_text(encoding='utf-8-sig')
for marker in ('id="part-a"','id="part-b"'):
    if marker not in q2:errors.append(f'Q2_PART_MISSING {marker}')
if q2.count('class="solution-part"') != 2:errors.append('Q2_PART_COUNT')
if 'id="q3GeometryTool"' not in q3 or '../tools/q3-interactive.js' not in q3:errors.append('Q3_TOOL_MISSING')
if 'id="q5GeometryTool"' not in q5 or '../tools/q5-interactive.js' not in q5:errors.append('Q5_TOOL_MISSING')
statement_checks={
    1:r'n\ge1',2:'với mọi',3:r'Điểm \(P\) di động trên đường thẳng \(BC\)',
    4:r'với mọi \(i\ge1\)',5:'đồng quy hoặc đôi một song song',
    6:'nhỏ nhất là bao nhiêu',7:'Trong mỗi lượt ghi, trạng thái của các ngọn đèn được giữ cố định.'}
for i,phrase in statement_checks.items():
    t=(ROOT/f'solutions/q{i}.html').read_text(encoding='utf-8-sig')
    if phrase not in t:errors.append(f'INCOMPLETE_STATEMENT_q{i}')

if errors:
    print('SITE VERIFY: FAIL')
    for e in errors:print(' -',e)
    raise SystemExit(1)
print(f'SITE VERIFY: PASS ({len(REQUIRED)} required files, source-fidelity/font/tool checks clean)')
