from pathlib import Path
import re
ROOT=Path(__file__).resolve().parents[1]
legacy=[]
for p in list(ROOT.rglob('*.html'))+[ROOT/'assets/styles.css']:
    t=p.read_text(encoding='utf-8-sig')
    if re.search(r'family=Inter|font-family\s*:\s*["\']?Inter',t,re.I):
        legacy.append(str(p.relative_to(ROOT)))
css=(ROOT/'assets/styles.css').read_text(encoding='utf-8-sig')
assert not legacy, f'legacy Inter font references: {legacy}'
assert 'Be Vietnam Pro' in css and 'Noto Serif' in css and 'JetBrains Mono' in css
print('FONT SANITY: PASS (Vietnamese-capable stacks only)')
