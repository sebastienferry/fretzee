# Implementation Plan: Diagram Title

**Branch**: `008-diagram-title` | **Date**: 2026-08-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/008-diagram-title/spec.md`

## Summary

Add an optional `title` property and `titleAlignment` property to `FretboardOptions`, allowing users to render a title string above the fretboard diagram. The title is always positioned at the top, supports `'center'` (default) and `'left'` alignment, and works in both horizontal and vertical orientations. The SVG viewBox adjusts dynamically when a title is present.

## Technical Context

**Language/Version**: TypeScript (strict mode) / ES2021+  
**Primary Dependencies**: None (Zero runtime dependencies)  
**Storage**: N/A  
**Testing**: Jest + jsdom  
**Target Platform**: Modern browsers and Node.js with DOM support  
**Project Type**: Library (ESM + UMD bundles)  
**Performance Goals**: SVG render under 100ms  
**Constraints**: Zero runtime dependencies; backward compatible API  
**Scale/Scope**: ~3 files modified, ~2 new constants, 1 new test file

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Zero Runtime Dependencies**: No new dependencies needed. Feature uses existing TypeScript types and DOM APIs.
- [x] **DRY / Script Reuse**: Title rendering follows same SVG element creation patterns as inlays and fingerings. No duplicated logic.
- [x] **Dual Orientation & DOM Support**: Title positioning explicitly handles both horizontal and vertical orientations.
- [x] **Backward Compatibility**: `title` defaults to `undefined` and `titleAlignment` defaults to `'center'`. When no title is set, rendering is identical to current behavior.

## Project Structure

### Documentation (this feature)

```text
specs/008-diagram-title/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── fretboard/
│   ├── types.ts          # Add title, titleAlignment to FretboardOptions
│   ├── constants.ts      # Add CSS_CLASSES.title, DEFAULT_TITLE_ALIGNMENT, title font constants
│   └── Fretboard.ts      # Pass title options through to renderer
├── renderers/
│   └── svg.ts            # Title text rendering, viewBox adjustment for title space
└── utils/
    └── geometry.ts       # (no changes expected — title positioning is simpler than geometry)

tests/
└── unit/
    └── DiagramTitle.test.ts  # New test file for title rendering

demo.html                # Add titled fretboard example
studio.html              # Add title input and alignment selector
```

**Structure Decision**: Changes are localized to existing files with one new test file. Same pattern as the starting-fret feature.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| *None* | *Straightforward option addition* | *N/A* |
