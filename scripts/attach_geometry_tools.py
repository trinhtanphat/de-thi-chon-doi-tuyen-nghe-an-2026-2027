from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
for n in (3,5):
    p=ROOT/f'solutions/q{n}.html'
    t=p.read_text(encoding='utf-8-sig')
    host=f'<section id="q{n}GeometryTool" class="geometry-tool"></section><script type="module" src="../tools/q{n}-interactive.js"></script>'
    pattern=r'<div class="diagram"><svg.*?</div>\s*(?=<h2>)'
    t,count=re.subn(pattern,lambda _m:host,t,count=1,flags=re.S)
    if count!=1:
        raise SystemExit(f'could not replace static diagram q{n}: {count}')
    p.write_text(t,encoding='utf-8')
    print(f'attached q{n} tool')
