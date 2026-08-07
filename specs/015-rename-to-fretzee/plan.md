# Implementation Plan: Rename Library to Fretzee

**Branch**: `feat/042-rename-to-fretzee` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

## Summary

Rename all occurrences of `Fretly` / `fretly` to `Fretzee` / `fretzee` across package definitions, UMD global exports, SVG CSS class constants (`fretzee-*`), unit tests, web application pages, and documentation.

## Technical Context

**Files to modify**:
- `package.json` — package name `fretzee`
- `rollup.config.js` — UMD exports `Fretzee` and `FretzeeMusic`
- `src/fretboard/constants.ts` — CSS class constants `fretzee-*`
- `src/renderers/svg.ts` — SVG class rendering
- `index.html`, `demo.html`, `editor.html`, `studio.html` — Web application branding & JS scripts
- `README.md`, `CHANGELOG.md`, `AGENTS.md`, `docs/` — Documentation
- Unit tests under `tests/unit/`
