# Tasks: Fix Fingering Circle Alignment

**Feature**: `specs/006-fix-fingering-alignment`
**Issue**: #13

## Task List

- [x] **Task 1**: Update `getFingeringPosition()` in `src/utils/geometry.ts` to accept `stringThickness` and apply per-string center offset
- [x] **Task 2**: Update `renderFingering()` call in `src/renderers/svg.ts` to pass `stringThickness`
- [x] **Task 3**: Add unit test verifying fingering alignment with varying string thickness
- [x] **Task 4**: Run `npm run build`, `npm run lint`, `npm test` — verify all pass
