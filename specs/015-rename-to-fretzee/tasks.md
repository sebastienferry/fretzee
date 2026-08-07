# Tasks: Rename Library to Fretzee

**Input**: Design documents from `specs/015-rename-to-fretzee/`

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Implementation & Verification

- [ ] T001 [P] [US1] Update `package.json` package name to `fretzee`
- [ ] T002 [P] [US1] Update `rollup.config.js` UMD export names to `Fretzee` and `FretzeeMusic`
- [ ] T003 [P] [US1] Rename CSS class constants in `src/fretboard/constants.ts` and `src/renderers/svg.ts` from `fretly-*` to `fretzee-*`
- [ ] T004 [P] [US1] Update web application pages (`index.html`, `demo.html`, `editor.html`, `studio.html`) script tags and branding references
- [ ] T005 [P] [US1] Update unit tests under `tests/unit/` to check for `fretzee-*` CSS classes and `Fretzee` global references
- [ ] T006 [P] [US1] Update `README.md`, `CHANGELOG.md`, `AGENTS.md`, and `docs/` references
- [ ] T007 Run automated verification (`npm run build`, `npm run lint`, `npm test`)
