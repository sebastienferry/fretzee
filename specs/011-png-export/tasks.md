# Tasks: PNG Export

**Input**: Design documents from `specs/011-png-export/`
**Prerequisites**: plan.md (required), spec.md (required)

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel
- **[Story]**: User story mapping (US1, US2, US3)

---

## Phase 1: Export Utilities & Types (US1 & US2)

- [ ] T001 [P] [US1] Add `PNGExportOptions` interface to `src/fretboard/types.ts`
- [ ] T002 [P] [US1] Create `src/utils/export.ts` with `exportSvgToPngBlob()`, `exportSvgToPngDataUrl()`, and `triggerDownload()` native Canvas utilities supporting `scale` (default: 2)
- [ ] T003 [US1] Wire `toPNGBlob()`, `toPNGDataURL()`, and `downloadPNG()` methods onto `Fretboard` class in `src/fretboard/Fretboard.ts` and export symbols in `src/index.ts`

---

## Phase 2: Tests & Editor Integration (US1, US2, US3)

- [ ] T004 [P] [US1] Add unit tests in `tests/unit/PNGExport.test.ts` for export options, scaling, and DOM error handling
- [ ] T005 [P] [US3] Add "Export PNG" button to toolbar in `editor.html` wired to `fretboard.downloadPNG('fretboard.png')`

---

## Phase 3: Documentation & Verification

- [ ] T006 [P] Update `README.md`, `docs/design.md`, `docs/classes.md` with PNG export documentation
- [ ] T007 Run automated verification (`npm run build`, `npm run lint`, `npm test`)
