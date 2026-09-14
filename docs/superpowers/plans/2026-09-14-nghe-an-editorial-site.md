# Nghệ An Editorial Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the published exam site so its Vietnamese text is source-faithful, its typography is Vietnamese-safe, and Câu 3/Câu 5 use exact interactive geometry tools.

**Architecture:** Keep the static HTML/CSS/JS deployment. Add a reusable geometry core plus per-problem controllers; replace hand-drawn geometry SVGs with generated SVG driven by mathematically constructed points and residual checks.

**Tech Stack:** Static HTML5, CSS, vanilla ES modules, KaTeX CDN, Python verification scripts, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-14-nghe-an-editorial-site-design.md`

## Global Constraints
- Publish from `main` root; no framework/build step.
- All visible prose must use Vietnamese-capable font stacks.
- Original problem wording must not be shortened in `de-bai.html` or solution statement boxes.
- Geometry diagrams must be computed from definitions; UI perspective must never transform the metric drawing itself.
- Verification must run before commit/push and production must be probed after Pages deploy.

---

### Task 1: Source-fidelity and typography audit
**Files:** modify `de-bai.html`, `solutions/q1.html`…`q7.html`, `assets/styles.css`, page `<head>` font imports.
- [ ] Compare every problem statement against the two source images and restore omitted wording/conditions.
- [ ] Replace UI and prose font stacks with Be Vietnam Pro / Noto Serif plus safe fallbacks.
- [ ] Extend `scripts/verify_site.py` with required full-statement phrases and font checks.
- [ ] Run verifier and confirm the new checks pass.

### Task 2: Reusable geometry engine
**Files:** create `tools/geometry-core.js`, `scripts/geometry_sanity.mjs`.
- [ ] Write failing tests for vector operations, projections, intersections, circumcenter, orthocenter, and residual helpers.
- [ ] Implement the smallest geometry core that passes those tests.
- [ ] Run geometry tests and confirm zero failures.

### Task 3: Exact interactive Câu 3 tool
**Files:** create `tools/q3-interactive.js`; modify `solutions/q3.html`, `assets/styles.css`.
- [ ] Build the triangle, circumcenter, orthocenter, moving exterior point `P`, then derive `Q,R,Y,Z,S,X,M` from the statement.
- [ ] Render SVG from computed coordinates, allow `P` motion, show `dist(M,YZ)` and normalized `|AX·XP|` residuals.
- [ ] Add current-view SVG export.
- [ ] Add deterministic Câu 3 configurations to `scripts/geometry_sanity.mjs` and verify residuals are below tolerance.

### Task 4: Exact interactive Câu 5 tool
**Files:** create `tools/q5-interactive.js`; modify `solutions/q5.html`, `assets/styles.css`.
- [ ] Construct the unit incircle model and derive `A,B,C,D,E,F,K,S,T,R` plus the Euler line of `KBC`.
- [ ] Render computed SVG, expose a shape parameter, show orthogonality and concurrence/parallel residuals.
- [ ] Add current-view SVG export.
- [ ] Add deterministic Câu 5 configurations to `scripts/geometry_sanity.mjs` and verify residuals.

### Task 5: Editorial proof re-audit and release
**Files:** modify any `solutions/q*.html`, `README.md`, verification scripts as evidence requires.
- [ ] Re-read every solution against its exact statement and correct any hidden assumption or ambiguous edge case.
- [ ] Run `python scripts/verify_site.py`, `python scripts/math_sanity.py`, and `node scripts/geometry_sanity.mjs`.
- [ ] Inspect `git diff --check` and repository status, then commit and push `main`.
- [ ] Trigger GitHub Pages build if needed and probe homepage, exam page, assets, and all seven solutions for HTTP 200 plus key Vietnamese content.
