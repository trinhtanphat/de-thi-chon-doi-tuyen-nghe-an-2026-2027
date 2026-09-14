from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
EXAM=(ROOT/'de-bai.html').read_text(encoding='utf-8-sig')

def canonical_statement(i):
    m=re.search(rf'<section class="statement q{i}">(.*?)</section>',EXAM,re.S)
    if not m:
        raise SystemExit(f'missing canonical statement q{i}')
    body=m.group(1)
    body=re.sub(r'^<span class="label">.*?</span>','<span class="label">Đề bài</span>',body,count=1,flags=re.S)
    body=re.sub(r'<p><a href="solutions/q\d+\.html">.*?</p>\s*$','',body,flags=re.S)
    return f'<section class="statement">{body}</section>'

for i in range(1,8):
    path=ROOT/f'solutions/q{i}.html'
    text=path.read_text(encoding='utf-8-sig')
    section=canonical_statement(i)
    new,count=re.subn(r'<section class="statement">.*?</section>',lambda _m:section,text,count=1,flags=re.S)
    if count!=1: raise SystemExit(f'expected one statement in q{i}, got {count}')
    path.write_text(new,encoding='utf-8')
    print(f'updated q{i} from de-bai.html')