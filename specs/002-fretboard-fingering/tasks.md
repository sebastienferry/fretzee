# Tasks: Fretboard Fingering

**Input**: Design documents from `/specs/002-fretboard-fingering/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- All descriptions include exact file paths.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Define core types and CSS class names required for fingering elements

- [x] T001 [P] Export Fingering interface and update FretboardOptions in src/fretboard/types.ts
- [x] T002 [P] Update SVG CSS class constants for fingerings in src/fretboard/constants.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core geometry calculation utilities and domain model foundation

**⚠️ CRITICAL**: Must be completed before user story implementation

- [x] T003 [P] Implement fingering position and radius helper functions in src/utils/geometry.ts
- [x] T004 Implement Fingering entity class with defaults and validation in src/fretboard/Fingering.ts

**Checkpoint**: Core types and geometry utilities ready - user story implementation can begin

---

## Phase 3: User Story 1 - Render Basic Fingering Markers (Priority: P1) 🎯 MVP

**Goal**: Render fingering markers on specified string and fret positions with default black background (`#000000`) and white text (`#ffffff`).

**Independent Test**: Supply a list of fingerings with string and fret coordinates and verify that circle markers with default black fill and white text appear on expected fretboard positions.

### Tests for User Story 1

- [x] T005 [P] [US1] Create unit tests for Fingering domain entity initialization and defaults in tests/unit/Fingering.test.ts
- [x] T006 [P] [US1] Create unit tests for default fingering marker SVG rendering in tests/unit/FretboardFingering.test.ts

### Implementation for User Story 1

- [x] T007 [US1] Update Fretboard class constructor and properties to parse and store Fingering instances in src/fretboard/Fretboard.ts
- [x] T008 [US1] Implement SVG group and circle/text rendering for fingerings in horizontal and vertical modes in src/renderers/svg.ts
- [x] T009 [US1] Export Fingering class and types from library entry point in src/index.ts

**Checkpoint**: User Story 1 fully functional and testable independently (MVP)

---

## Phase 4: User Story 2 - Custom Fingering Styling (Priority: P2)

**Goal**: Support custom background colors (`color`) and text font colors (`textColor`) per fingering marker.

**Independent Test**: Create fingerings with custom HTML colors (e.g. `#FF0000`, `blue`) and verify SVG `<circle>` and `<text>` fill attributes match the specified colors.

### Tests for User Story 2

- [x] T010 [P] [US2] Add unit tests for custom HTML background and text color rendering in tests/unit/FretboardFingering.test.ts

### Implementation for User Story 2

- [x] T011 [US2] Update SVG renderer to apply custom color and textColor fill attributes in src/renderers/svg.ts

**Checkpoint**: User Stories 1 AND 2 work independently

---

## Phase 5: User Story 3 - Non-overlapping Responsive Fingering Sizing (Priority: P3)

**Goal**: Automatically compute marker radius based on string/fret spacing so adjacent fingerings on the same fret never overlap.

**Independent Test**: Place fingerings on adjacent strings of the same fret and verify that distance between adjacent circle centers exceeds circle diameter.

### Tests for User Story 3

- [x] T012 [P] [US3] Add unit tests for non-overlapping fingering sizing across different string counts in tests/unit/FretboardFingering.test.ts

### Implementation for User Story 3

- [x] T013 [US3] Refine dynamic radius calculation logic based on string spacing in src/utils/geometry.ts and src/renderers/svg.ts

**Checkpoint**: All user stories functional and independently testable

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation updates, demo page examples, build, test, and lint validation

- [x] T014 [P] Update public API documentation and usage examples in README.md
- [x] T015 [P] Update architecture documentation in docs/design.md and docs/classes.md
- [x] T016 [P] Add interactive fingering examples and code snippets to demo.html
- [x] T017 Execute Rollup build to verify ESM, UMD, and .d.ts generation via npm run build
- [x] T018 Run test suite and linter to verify zero errors via npm test and npm run lint

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: Depend on Foundational phase completion
  - US1 (P1) → US2 (P2) → US3 (P3)
- **Polish (Phase 6)**: Depends on all user stories being complete

### Parallel Opportunities

- T001 and T002 can run in parallel
- T003 can run in parallel with T001/T002
- T005 and T006 (US1 tests) can run in parallel
- T010 (US2 test) can run in parallel with US1 work
- T014, T015, T016 (Docs & Demo) can run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001, T002)
2. Complete Phase 2: Foundational (T003, T004)
3. Complete Phase 3: User Story 1 (T005 - T009)
4. **STOP and VALIDATE**: Verify User Story 1 tests pass independently

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently (MVP!)
3. Add User Story 2 → Test custom colors
4. Add User Story 3 → Test non-overlapping geometry
5. Complete Polish phase (Docs, Demo, Build, Test, Lint)
