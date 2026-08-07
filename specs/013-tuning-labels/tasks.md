# Tasks: Tuning Labels

**Input**: Design documents from `specs/013-tuning-labels/`

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Implementation & Verification

- [ ] T001 [P] [US1] Add `tuning?: string[]` to `FretboardOptions` in `src/fretboard/types.ts` and tuning CSS classes in `src/fretboard/constants.ts`
- [ ] T002 [US1] Implement tuning label rendering and dynamic viewBox padding calculation in `src/renderers/svg.ts`
- [ ] T003 [P] [US1] Add unit tests in `tests/unit/TuningLabels.test.ts` verifying horizontal and vertical tuning label positioning
- [ ] T004 Run automated verification (`npm run build`, `npm run lint`, `npm test`)
