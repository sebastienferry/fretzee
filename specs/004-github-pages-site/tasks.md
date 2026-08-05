# Tasks: GitHub Pages Configuration Website

**Input**: Design documents from `specs/004-github-pages-site/`  
**Prerequisites**: [plan.md](plan.md), [spec.md](spec.md), [research.md](research.md), [data-model.md](data-model.md), [quickstart.md](quickstart.md)

---

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Prepare root web entry point

- [x] T001 Verify static web asset structure and root landing page in [index.html](../../index.html)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Ensure compiled distribution bundle is ready for web site inclusion

- [x] T002 Verify Rollup build script and UMD bundle output in [package.json](../../package.json)

---

## Phase 3: User Story 1 - Live Online Fretboard Configurator Website (Priority: P1) 🎯 MVP

**Goal**: Provide an interactive browser interface allowing users to configure fretboard parameters and view/copy SVG outputs.

**Independent Test**: Open `index.html` or `editor.html` in browser and verify live SVG preview updates on input changes.

- [x] T003 [P] [US1] Create landing page with configurator showcase and navigation in [index.html](../../index.html)
- [x] T004 [US1] Enhance interactive live editor controls, orientation toggles, and SVG export functionality in [editor.html](../../editor.html)
- [x] T005 [P] [US1] Verify visual showcases and chord diagram examples in [demo.html](../../demo.html)

---

## Phase 4: User Story 2 - Automated Deployment Workflow on Code Changes (Priority: P1)

**Goal**: Automatically deploy static site to GitHub Pages on every push to default branch.

**Independent Test**: Push to default branch and verify `.github/workflows/deploy-pages.yml` builds and deploys static site.

- [x] T006 [P] [US2] Create GitHub Pages deployment workflow using official Pages actions in [.github/workflows/deploy-pages.yml](../../.github/workflows/deploy-pages.yml)
- [x] T007 [US2] Configure workflow permissions (`pages: write`, `id-token: write`) and artifact upload step in [.github/workflows/deploy-pages.yml](../../.github/workflows/deploy-pages.yml)

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Documentation and release integration

- [x] T008 [P] Update [README.md](../../README.md) with live GitHub Pages URL and deployment badge
- [x] T009 Validate deployment instructions against [quickstart.md](quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1
- **Phase 3 (User Story 1)**: Depends on Phase 2
- **Phase 4 (User Story 2)**: Depends on Phase 2
- **Phase 5 (Polish)**: Depends on Phase 3 & 4

### Parallel Opportunities

- T003 [US1] and T006 [US2] can run in parallel (editing different files).
- T008 [Polish] can run independently once workflows are in place.

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)
1. Complete Setup (T001) & Foundational (T002).
2. Implement US1 Live Configurator (T003, T004, T005).
3. Test locally with `npx serve .`.

### Full Delivery
1. Add US2 Deployment Workflow (T006, T007).
2. Complete Polish tasks (T008, T009).
