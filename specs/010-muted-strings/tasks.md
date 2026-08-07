# Tasks: Muted Open Strings ('X')

**Input**: Design documents from `specs/010-muted-strings/`
**Prerequisites**: plan.md (required), spec.md (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: User story mapping (US1, US2, US3)

---

## Phase 1: Core Model & Validation (US1)

- [x] T001 [P] [US1] Update `src/fingering/Fingering.ts` and `src/fingering/types.ts` to accept `fret: -1` and set default `text` to `'X'` when `fret === -1`.
- [x] T002 [P] [US1] Update `src/utils/validation.ts` to allow `fret: -1` in `validateFingering()`.

---

## Phase 2: SVG Renderer & Geometry (US1 & US2)

- [x] T003 [US1] Update `src/renderers/svg.ts` to position `fret: -1` fingerings at the nut position (same visual x/y calculation as `fret: 0`) and render with class `fretly-fingering-muted` or `fretly-fingering`.
- [x] T004 [P] [US1] Add unit tests in `tests/unit/MutedStrings.test.ts` verifying `fret: -1` renders 'X' at nut position in both horizontal and vertical modes.

---

## Phase 3: Demos, Documentation & Verification (US3)

- [x] T005 [P] [US3] Update `demo.html` and `editor.html` to showcase muted string chord diagrams (e.g. C Major `x32010`).
- [x] T006 [P] Update `README.md`, `docs/design.md`, `docs/classes.md` documenting `fret: -1` usage.
- [x] T007 Run automated verification (`npm run build`, `npm run lint`, `npm test`).
