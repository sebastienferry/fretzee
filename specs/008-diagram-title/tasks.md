# Tasks: Diagram Title

**Input**: Design documents from `specs/008-diagram-title/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, quickstart.md

**Tests**: Tests are included per project coding standards (Jest + jsdom).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Add title-related types, constants, and validation to the core library

- [x] T001 [P] Add `title` and `titleAlignment` properties to `FretboardOptions` interface in `src/fretboard/types.ts`
- [x] T002 [P] Add `DEFAULT_TITLE_ALIGNMENT`, `TITLE_FONT_SIZE`, `TITLE_PADDING` constants and `CSS_CLASSES.title` entry in `src/fretboard/constants.ts`
- [x] T003 Add `titleAlignment` validation to `validateOptions()` in `src/utils/validation.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Wire up title options in the Fretboard class so the renderer can access them

- [x] T004 Handle `title` and `titleAlignment` defaults in the `Fretboard` constructor and expose them through `getOptions()` in `src/fretboard/Fretboard.ts`

**Checkpoint**: Title options are accepted and validated. No rendering yet.

---

## Phase 3: User Story 1 - Centered title rendering (Priority: P1) 🎯 MVP

**Goal**: Render a centered title above the fretboard in both orientations

**Independent Test**: Create a Fretboard with `{ title: 'Am' }`, render it, and verify the SVG contains a `<text>` element with class `fretly-title`, correct text content, and position above the fretboard.

### Tests for User Story 1

- [x] T005 [P] [US1] Create test file `tests/unit/DiagramTitle.test.ts` with tests: title renders as SVG text element, title has correct CSS class, no title element when title is undefined, no title element when title is empty string, title is centered by default, title works in horizontal orientation, title works in vertical orientation

### Implementation for User Story 1

- [x] T006 [US1] Add title rendering method `renderTitle()` to `SvgRenderer` in `src/renderers/svg.ts` — creates a `<text>` element with class `fretly-title`, font-size 16, font-family sans-serif, font-weight bold, fill #000000, centered via `text-anchor: middle`
- [x] T007 [US1] Adjust SVG viewBox in `SvgRenderer.render()` to add space above the fretboard when a title is present (shift viewBoxY and increase height by `TITLE_FONT_SIZE + TITLE_PADDING`) in `src/renderers/svg.ts`
- [x] T008 [US1] Call `renderTitle()` from both `renderHorizontal()` and `renderVertical()` methods in `src/renderers/svg.ts` — title is the first element appended to SVG

**Checkpoint**: A centered title renders above fretboards in both orientations. All US1 tests pass.

---

## Phase 4: User Story 2 - Left-aligned title (Priority: P2)

**Goal**: Support `titleAlignment: 'left'` to left-align the title text

**Independent Test**: Create a Fretboard with `{ title: 'Scale', titleAlignment: 'left' }`, render it, and verify the text element has `text-anchor: start` and x position at 0 (left edge of fretboard).

### Tests for User Story 2

- [x] T009 [P] [US2] Add tests in `tests/unit/DiagramTitle.test.ts`: left-aligned title has `text-anchor: start`, left-aligned title x position is at fretboard left edge, explicitly centered title matches default behavior

### Implementation for User Story 2

- [x] T010 [US2] Update `renderTitle()` in `src/renderers/svg.ts` to accept alignment parameter and set `text-anchor` to `'start'` for left alignment and x position to `0` (or fretboard left edge)

**Checkpoint**: Title alignment works for both 'center' and 'left'. All US2 tests pass.

---

## Phase 5: User Story 3 - Demo and Studio pages (Priority: P3)

**Goal**: Showcase the title feature in demo.html and add interactive controls in studio.html

**Independent Test**: Open demo.html and verify at least one titled fretboard is visible. Open studio.html and verify the title input and alignment dropdown work.

### Implementation for User Story 3

- [x] T011 [P] [US3] Add a titled fretboard example (e.g., "Am Chord" with vertical orientation) to `demo.html`
- [x] T012 [P] [US3] Add title text input and alignment dropdown to the studio controls in `studio.html`, wiring them to the fretboard rendering function

**Checkpoint**: Demo and Studio pages showcase the title feature.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Documentation, edge case handling, and final verification

- [x] T013 [P] Update `README.md` with title usage examples and API reference for `title` and `titleAlignment` options
- [x] T014 [P] Update `docs/design.md` with title rendering design decisions
- [x] T015 [P] Update `docs/classes.md` with updated `FretboardOptions` documentation
- [x] T016 Run `npm run build`, `npm run lint`, `npm test` — all must pass

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — T001, T002 can run in parallel; T003 depends on T001
- **Foundational (Phase 2)**: Depends on Phase 1 completion
- **User Story 1 (Phase 3)**: Depends on Phase 2 — core title rendering
- **User Story 2 (Phase 4)**: Depends on Phase 3 — extends title with alignment
- **User Story 3 (Phase 5)**: Depends on Phase 4 — showcases complete feature
- **Polish (Phase 6)**: Depends on all user stories being complete

### Within Each User Story

- Tests written first (T005, T009)
- Implementation follows (T006–T008, T010)
- Verification at each checkpoint

### Parallel Opportunities

- T001 and T002 can run in parallel (different files)
- T005 (tests) can run in parallel with T001/T002 (different files)
- T011 and T012 can run in parallel (different files)
- T013, T014, T015 can all run in parallel (different files)

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Types + Constants + Validation
2. Complete Phase 2: Fretboard constructor wiring
3. Complete Phase 3: Centered title rendering
4. **STOP and VALIDATE**: Test centered title in both orientations
5. Proceed to alignment and demo/studio

### Incremental Delivery

1. Setup + Foundational → Types ready
2. User Story 1 → Centered title works → Test (MVP!)
3. User Story 2 → Left alignment works → Test
4. User Story 3 → Demo/Studio updated → Test
5. Polish → Docs updated, all checks pass

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story is independently completable and testable
- Commit after each task or logical group
- Total tasks: 16
- Tasks per story: US1=4, US2=2, US3=2, Setup=3, Foundation=1, Polish=4
