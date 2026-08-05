# Implementation Plan: Fretboard Fingering

**Branch**: `002-fretboard-fingering` | **Date**: 2026-08-05 | **Spec**: [spec.md](file:///Users/sferry/Sources/fretly/specs/002-fretboard-fingering/spec.md)  
**Input**: Feature specification from `/specs/002-fretboard-fingering/spec.md`

## Summary

Add support for rendering customizable fingering markers on the fretboard SVG. Each fingering specifies a string and fret position, optional text content inside the circle marker, and optional HTML background color (defaulting to black `#000000`) and text font color (defaulting to white `#ffffff`). The circle size is dynamically calculated based on string and fret spacing to guarantee zero overlap between adjacent fingerings on the same fret.

## Technical Context

**Language/Version**: TypeScript (strict mode)  
**Primary Dependencies**: Zero runtime dependencies. Tooling: TypeScript, Rollup, Jest, jsdom  
**Storage**: N/A (SVG rendering in-memory)  
**Testing**: Jest + jsdom  
**Target Platform**: Modern browsers and Node.js with DOM support  
**Project Type**: TypeScript Library  
**Performance Goals**: Rapid SVG generation (<10ms per fretboard)  
**Constraints**: Zero runtime dependencies; strict TypeScript types; responsive non-overlapping marker geometry  
**Scale/Scope**: Fretboard diagram rendering with 4-8 strings, 1-16 frets  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Zero Runtime Dependencies**: No npm runtime packages added.
- [x] **Strict Typing**: Export clean TypeScript interfaces (`Fingering`, `FretboardOptions`).
- [x] **DRY & Single Responsibility**: Shared geometry logic extracted to `utils/geometry.ts`.
- [x] **Immutability**: Readonly properties on `Fingering` class.
- [x] **Horizontal & Vertical Support**: Full positioning test coverage in both orientations.

All constitution gates passed.

## Project Structure

### Documentation (this feature)

```text
specs/002-fretboard-fingering/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   └── public-api.md
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
src/
├── fretboard/
│   ├── Fretboard.ts     # Main class updating options processing for fingerings
│   ├── Fingering.ts     # New domain entity class for fingering markers
│   ├── constants.ts     # Updated with CSS_CLASSES.fingerings and SVG class rules
│   └── types.ts         # Exported Fingering interface and updated FretboardOptions
├── renderers/
│   └── svg.ts           # SVG renderer updated to render fingering circles & text
├── utils/
│   └── geometry.ts      # Coordinate calculations for fret/string intersections and circle radius
└── index.ts             # Public exports

tests/
├── unit/
│   ├── Fingering.test.ts # Domain entity unit tests
│   └── Fretboard.test.ts # Rendering & positioning unit tests
```

**Structure Decision**: Standard single library project layout matching Fretly's existing design patterns.

## Complexity Tracking

*No violations.*
