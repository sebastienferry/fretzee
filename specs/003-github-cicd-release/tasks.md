# Tasks: GitHub CI/CD Build, Test & Release Pipeline

**Input**: Design documents from `/specs/003-github-cicd-release/`  
**Prerequisites**: [plan.md](file:///Users/sferry/Sources/fretly/specs/003-github-cicd-release/plan.md), [spec.md](file:///Users/sferry/Sources/fretly/specs/003-github-cicd-release/spec.md), [research.md](file:///Users/sferry/Sources/fretly/specs/003-github-cicd-release/research.md), [data-model.md](file:///Users/sferry/Sources/fretly/specs/003-github-cicd-release/data-model.md), [quickstart.md](file:///Users/sferry/Sources/fretly/specs/003-github-cicd-release/quickstart.md)

---

## Format: `- [ ] [ID] [P?] [Story?] Description with file path`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: User story label (US1, US2, US3)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create GitHub configuration directories

- [x] T001 Create `.github/workflows` directory structure at repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Verify repository lifecycle scripts and target environments

- [x] T002 Verify package.json build, test, and lint scripts in [package.json](file:///Users/sferry/Sources/fretly/package.json)

---

## Phase 3: User Story 1 - Continuous Integration (Priority: P1) 🎯 MVP

**Goal**: Automatically run linting, building, and unit tests on every pull request and main branch push.

**Independent Test**: Push a commit or PR and verify `.github/workflows/ci.yml` runs all checks.

- [x] T003 [P] [US1] Create CI workflow for build, lint, and test validation in [.github/workflows/ci.yml](file:///Users/sferry/Sources/fretly/.github/workflows/ci.yml)
- [x] T004 [US1] Validate workflow syntax and step execution for [.github/workflows/ci.yml](file:///Users/sferry/Sources/fretly/.github/workflows/ci.yml)

---

## Phase 4: User Story 2 - Automated GitHub Release on Tag Creation (Priority: P1)

**Goal**: Automatically trigger a release workflow on `v*` tag push to compile distribution assets and create a GitHub Release.

**Independent Test**: Push a git version tag (`v*`) and verify `.github/workflows/release.yml` builds `/dist` and creates a GitHub Release.

- [x] T005 [P] [US2] Create Release workflow structure for `v*` tags with build and test checks in [.github/workflows/release.yml](file:///Users/sferry/Sources/fretly/.github/workflows/release.yml)
- [x] T006 [US2] Add GitHub Release action step (`softprops/action-gh-release@v2`) in [.github/workflows/release.yml](file:///Users/sferry/Sources/fretly/.github/workflows/release.yml)

---

## Phase 5: User Story 3 - Automated NPM Package Release (Priority: P2)

**Goal**: Automatically publish the compiled library package to NPM when a release tag is pushed.

**Independent Test**: Verify NPM publish step is executed conditionally with `NPM_TOKEN` in `.github/workflows/release.yml`.

- [x] T007 [US3] Add conditional NPM publish step with setup-node registry configuration in [.github/workflows/release.yml](file:///Users/sferry/Sources/fretly/.github/workflows/release.yml)

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Update documentation and validate overall workflow integration

- [x] T008 [P] Add CI workflow status badge and release instructions to [README.md](file:///Users/sferry/Sources/fretly/README.md)
- [x] T009 Validate release workflow configuration against [quickstart.md](file:///Users/sferry/Sources/fretly/specs/003-github-cicd-release/quickstart.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies
- **Phase 2 (Foundational)**: Depends on Phase 1
- **Phase 3 (User Story 1)**: Depends on Phase 2
- **Phase 4 (User Story 2)**: Depends on Phase 2
- **Phase 5 (User Story 3)**: Depends on Phase 4
- **Phase 6 (Polish)**: Depends on Phase 3, 4, 5

### Parallel Opportunities

- T003 [US1] and T005 [US2] can be drafted in parallel if editing different workflow files.
- T008 [Polish] can run independently after workflows are created.

---

## Implementation Strategy

### MVP Scope (User Story 1 Only)
1. Complete Setup (T001) & Foundational (T002).
2. Implement US1 CI Workflow (T003, T004).
3. Verify PR check automation.

### Full Delivery
1. Add US2 Release Workflow (T005, T006).
2. Add US3 NPM publishing step (T007).
3. Complete Polish tasks (T008, T009).
