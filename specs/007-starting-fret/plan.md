# Implementation Plan: Configurable Starting Fret

**Branch**: `007-starting-fret` | **Date**: 2026-08-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/007-starting-fret/spec.md`

## Summary

Add a `startFret` option to the `FretboardOptions` interface, allowing users to render a "window" of the fretboard starting at any position (fret 1–24). This changes inlay numbering to absolute fret numbers, filters fingerings to only those within the visible range, maps fingering coordinates from absolute to relative positions, and adds a starting fret indicator when `startFret > 1`.

## Technical Context

**Language/Version**: TypeScript (strict mode) / ES2021+  
**Primary Dependencies**: None (Zero runtime dependencies)  
**Storage**: N/A  
**Testing**: Jest + jsdom  
**Target Platform**: Modern browsers and Node.js with DOM support  
**Project Type**: Library (ESM + UMD bundles)  
**Performance Goals**: SVG render under 100ms  
**Constraints**: Zero runtime dependencies; backward compatible API  
**Scale/Scope**: ~6 files modified, ~2 new constants

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Zero Runtime Dependencies**: No new dependencies needed. Feature uses existing TypeScript types and DOM APIs.
- [x] **DRY / Script Reuse**: Reuses existing geometry utilities. Position mapping logic added as single utility, consumed by both renderer and Fretboard class.
- [x] **Dual Orientation & DOM Support**: All changes explicitly handle both horizontal and vertical orientations.
- [x] **Backward Compatibility**: `startFret` defaults to `1`, making the new code path a no-op for existing users.

## Project Structure

### Documentation (this feature)

```text
specs/007-starting-fret/
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
│   ├── types.ts          # Add startFret to FretboardOptions
│   ├── constants.ts      # Add DEFAULT_START_FRET, MIN/MAX_START_FRET, CSS class for fret indicator
│   └── Fretboard.ts      # startFret option handling, inlay filtering, fingering filtering
├── renderers/
│   └── svg.ts            # Starting fret indicator rendering, adjusted inlay dot positions
└── utils/
    ├── geometry.ts       # Offset-aware position calculations
    └── validation.ts     # validateStartFret()

tests/
└── unit/
    └── StartingFret.test.ts  # New test file for starting fret behavior
```

**Structure Decision**: Changes are localized to existing files with one new test file. No structural changes needed.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| *None* | *Straightforward option addition* | *N/A* |
