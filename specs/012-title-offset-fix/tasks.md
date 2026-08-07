# Tasks: Title Offset Fix

**Input**: Design documents from `specs/012-title-offset-fix/`

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Implementation & Verification

- [ ] T001 [US1] Update `src/renderers/svg.ts` title offset and top viewBox height math when fingerings on string 1 or nut markers exist
- [ ] T002 [US1] Add unit test cases in `tests/unit/DiagramTitle.test.ts` verifying title position with string 1 fingerings in horizontal and vertical modes
- [ ] T003 Run automated verification (`npm run build`, `npm run lint`, `npm test`)
