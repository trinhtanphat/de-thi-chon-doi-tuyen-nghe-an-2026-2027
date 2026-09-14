# Nghệ An 2026–2027 Editorial Site Design

## Goal
Publish the complete two-day 7-problem exam together with independently checked full solutions in a polished static GitHub Pages site.

## Content
- Preserve the full Vietnamese problem statements in `de-bai.html`.
- One detailed solution page per problem, `solutions/q1.html` through `q7.html`.
- Keep difficult algebra explicit or collapsible rather than hiding it.
- Use self-contained proof for Câu 4.

## Presentation
- Static HTML/CSS/JS, KaTeX from CDN.
- Distinct accent color per problem, responsive dark/light UI.
- SVG geometry diagrams for Câu 3 and Câu 5.
- Interactive lamp simulator for Câu 7.
- Subtle perspective/3D card motion with reduced-motion fallback.

## Quality gates
- UTF-8 clean, no broken relative links, no placeholders.
- Mathematical sanity checks for Câu 4, 5, 7 plus manual proof review for all seven.
- Publish from `main` root on GitHub Pages.