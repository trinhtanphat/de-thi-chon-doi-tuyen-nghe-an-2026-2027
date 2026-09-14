# Nghệ An 2026–2027 Editorial Site Design

## Goal
Publish the complete two-day, 7-problem exam with independently checked full solutions, Vietnamese-first typography, and exact interactive geometry diagrams.

## Source fidelity
- `de-bai.html` must preserve the full Vietnamese wording and all mathematical conditions from the two source images.
- Every `solutions/q*.html` page must repeat the complete corresponding problem statement before the solution.
- Do not silently simplify wording that changes interpretation, especially Câu 7's fixed-state-per-recording rule.

## Typography and presentation
- UI/headings: `Be Vietnam Pro`, then Vietnamese-safe system fallbacks.
- Long-form problem/solution prose: `Noto Serif`, then Vietnamese-safe serif fallbacks.
- KaTeX remains responsible only for mathematical glyphs.
- Distinct problem accent colors, dark/light themes, responsive layout, and reduced-motion fallback remain.

## Exact geometry tools
- Add `tools/geometry-core.js` for vector, line, projection, intersection, circumcenter, orthocenter, and residual utilities.
- Add interactive Câu 3 and Câu 5 tools built from the exact definitions, not hand-positioned decorative SVG.
- Geometry itself stays planar/metric-correct; 3D/perspective effects apply only to surrounding UI cards.
- Câu 3 shows numerical residuals for midpoint-on-`YZ` and `AX ⟂ XP`.
- Câu 5 shows numerical residuals for `IR ⟂ AK` and Euler-line concurrence/parallelism.
- Each geometry tool can export its current drawing as SVG.

## Quality gates
- UTF-8 clean, Vietnamese glyphs render correctly, no broken relative links or placeholders.
- Automated geometry tests cover the reusable core plus multiple nondegenerate Câu 3/Câu 5 configurations.
- Existing Câu 4/Câu 7 sanity checks remain green; proof text for all seven is manually re-audited against the original statements.
- Publish from `main` root on GitHub Pages and probe every public page after deployment.
