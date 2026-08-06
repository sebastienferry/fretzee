# Tasks: Configurable Starting Fret

**Input**: Design documents from `/specs/007-starting-fret/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Tests are included as this is a library feature requiring unit test coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add the `startFret` option to types, constants, and validation

- [ ] T001 [P] Add `startFret` to `FretboardOptions` interface and `DEFAULT_START_FRET`, `MIN_START_FRET`, `MAX_START_FRET` constants in `src/fretboard/types.ts` and `src/fretboard/constants.ts`
- [ ] T002 [P] Add `validateStartFret()` function and integrate into `validateOptions()` in `src/utils/validation.ts`
- [ ] T003 Wire `startFret` option into `Fretboard` constructor defaults and validation in `src/fretboard/Fretboard.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core logic for mapping absolute frets to relative positions, and filtering inlays/fingerings to the visible range

**⚠️ CRITICAL**: No user story rendering work can begin until this phase is complete

- [ ] T004 Update `initializeInlays()` in `src/fretboard/Fretboard.ts` to filter `inlayPositions` to only those in range `[startFret, startFret + fretCount - 1]`, use absolute fret numbers as labels, and compute relative visual positions
- [ ] T005 Update `initializeFrets()` in `src/fretboard/Fretboard.ts` to assign fret indices starting from `startFret` (for CSS class naming and identification)
- [ ] T006 Update inlay dot rendering in `renderHorizontalInlayDots()` and `renderVerticalInlayDots()` in `src/renderers/svg.ts` to filter and position dots using the `startFret` offset

**Checkpoint**: Foundation ready — inlays and frets render with correct absolute numbering for any startFret value

---

## Phase 3: User Story 1 — Render Fretboard Starting at Specific Fret (Priority: P1) 🎯 MVP

**Goal**: Users can create a `Fretboard` with `startFret > 1` and get correctly numbered frets and inlays

**Independent Test**: Create `Fretboard({ startFret: 5, fretCount: 4 })`, render, verify inlay labels show absolute fret numbers (e.g., 5, 7)

### Tests for User Story 1

- [ ] T007 [P] [US1] Write unit tests for `startFret` option defaults and validation in `tests/unit/StartingFret.test.ts`
- [ ] T008 [P] [US1] Write unit tests for inlay filtering and absolute numbering with various `startFret` values in `tests/unit/StartingFret.test.ts`

### Implementation for User Story 1

- [ ] T009 [US1] Update `getFingeringPosition()` in `src/utils/geometry.ts` to accept `startFret` parameter and map absolute fret numbers to relative visual positions
- [ ] T010 [US1] Update fingering rendering in `renderFingering()` in `src/renderers/svg.ts` to pass `startFret` to `getFingeringPosition()` and skip fingerings outside visible range
- [ ] T011 [US1] Update open string fingering viewBox adjustment in `render()` in `src/renderers/svg.ts` to only apply when `startFret <= 1`
- [ ] T012 [US1] Ensure backward compatibility: verify `Fretboard()` with no `startFret` (or `startFret: 0` / `startFret: 1`) renders identically to current behavior in `tests/unit/StartingFret.test.ts`

**Checkpoint**: Fretboard renders correctly with any `startFret` value, fingerings are positioned correctly

---

## Phase 4: User Story 2 — Inlay Numbers Reflect Actual Positions (Priority: P1)

**Goal**: Inlay text labels display absolute fret numbers regardless of `startFret` value

**Independent Test**: Create `Fretboard({ startFret: 7, fretCount: 5 })`, render, verify inlay text shows "7" and "9"

### Tests for User Story 2

- [ ] T013 [P] [US2] Write unit tests verifying inlay text content matches absolute fret numbers in `tests/unit/StartingFret.test.ts`

### Implementation for User Story 2

(Already implemented in Phase 2 T004 — inlay labels use absolute fret numbers. This phase validates correctness.)

- [ ] T014 [US2] Verify and fix inlay label rendering for edge cases (startFret at 12, 24, and ranges with no standard inlay positions) in `src/fretboard/Fretboard.ts`

**Checkpoint**: Inlay numbers correctly show absolute fret positions for all startFret values

---

## Phase 5: User Story 3 — Starting Fret Indicator (Priority: P2)

**Goal**: When `startFret > 1`, a text label is displayed at the beginning of the fretboard indicating the starting position

**Independent Test**: Create `Fretboard({ startFret: 6, fretCount: 3 })`, render in both orientations, verify a text element with "6" appears

### Tests for User Story 3

- [ ] T015 [P] [US3] Write unit tests for starting fret indicator presence/absence and positioning in `tests/unit/StartingFret.test.ts`

### Implementation for User Story 3

- [ ] T016 [P] [US3] Add `startFretIndicator` CSS class to `CSS_CLASSES` in `src/fretboard/constants.ts`
- [ ] T017 [US3] Implement `renderStartFretIndicator()` method in `src/renderers/svg.ts` for horizontal orientation (text label left of first fret line)
- [ ] T018 [US3] Implement `renderStartFretIndicator()` method in `src/renderers/svg.ts` for vertical orientation (text label above first fret line)
- [ ] T019 [US3] Call `renderStartFretIndicator()` from `renderHorizontal()` and `renderVertical()` when `startFret > 1`, and adjust viewBox to accommodate the label in `src/renderers/svg.ts`

**Checkpoint**: Starting fret indicator displays correctly in both orientations when startFret > 1

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, demo updates, and final validation

- [ ] T020 [P] Update `README.md` with `startFret` option documentation and usage examples
- [ ] T021 [P] Update `docs/design.md` and `docs/classes.md` with `startFret` design decisions and API changes
- [ ] T022 [P] Add starting fret examples to `demo.html` (chord diagrams at various positions)
- [ ] T023 [P] Add starting fret controls to `editor.html` (slider/input for startFret value)
- [ ] T024 Run `npm run build`, `npm run lint`, and `npm test` to validate all changes
- [ ] T025 Run quickstart.md validation — verify all code samples work correctly

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on T001, T002, T003 from Setup
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - US1 and US2 can proceed in parallel after Phase 2
  - US3 can proceed independently after Phase 2
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P1)**: Can start after Phase 2 — builds on inlay work from Phase 2, mostly validation
- **User Story 3 (P2)**: Can start after Phase 2 — independent new rendering feature

### Parallel Opportunities

- T001, T002 can run in parallel (different files)
- T007, T008 can run in parallel (different test groups)
- T016 can run in parallel with T015
- T020, T021, T022, T023 can all run in parallel (different files)

---

## Parallel Example: User Story 1

```bash
# Launch tests in parallel:
Task: "Write unit tests for startFret option defaults and validation in tests/unit/StartingFret.test.ts"
Task: "Write unit tests for inlay filtering and absolute numbering in tests/unit/StartingFret.test.ts"

# Then implement sequentially:
Task: "Update getFingeringPosition() to accept startFret in src/utils/geometry.ts"
Task: "Update fingering rendering to pass startFret in src/renderers/svg.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001–T003)
2. Complete Phase 2: Foundational (T004–T006)
3. Complete Phase 3: User Story 1 (T007–T012)
4. **STOP and VALIDATE**: Test `Fretboard({ startFret: 5, fretCount: 4 })` renders correctly
5. Run `npm test` — all tests must pass

### Incremental Delivery

1. Setup + Foundational → Foundation ready
2. Add User Story 1 → MVP (fretboards start at any fret)
3. Add User Story 2 → Inlay numbers verified
4. Add User Story 3 → Starting fret indicator added
5. Polish → Documentation and demo updates

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Total tasks: 25
- Tasks per story: US1=6, US2=2, US3=5
- Commit after each logical group of tasks
- All fingering coordinates use absolute fret numbers throughout
