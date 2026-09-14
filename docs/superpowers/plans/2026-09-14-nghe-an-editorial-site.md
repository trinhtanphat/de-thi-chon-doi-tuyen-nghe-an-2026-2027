# Nghệ An Editorial Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Publish the complete exam and seven verified solutions as a visually rich GitHub Pages site.

**Architecture:** Dependency-light static HTML/CSS/JS with shared assets and individual solution pages. Mathematical verification lives in Python scripts and deployment uses the public GitHub repository's `main` branch root.

**Tech Stack:** HTML5, CSS, vanilla JavaScript, KaTeX CDN, Python verification, GitHub Pages.

**Spec:** `docs/superpowers/specs/2026-09-14-nghe-an-editorial-site-design.md`

## Global Constraints
- Full Vietnamese statements and solutions.
- No placeholder proof steps.
- Responsive dark/light interface with reduced-motion fallback.
- GitHub Pages must serve from `main` root.

### Task 1: Editorial content
- [x] Transcribe the complete exam.
- [x] Write and manually review solutions q1–q7.
- [x] Add self-contained Câu 4 construction.

### Task 2: Site experience
- [x] Build shared CSS/JS, navigation, KaTeX, SVG diagrams and lamp simulator.
- [x] Repair UTF-8 encoding and verify relative links.

### Task 3: Verification and release
- [x] Run `python scripts/verify_site.py`.
- [x] Run `python scripts/math_sanity.py`.
- [ ] Commit and push `main`.
- [ ] Enable GitHub Pages and probe the published site.