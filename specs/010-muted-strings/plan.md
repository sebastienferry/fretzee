# Implementation Plan: Muted Open Strings ('X')

**Branch**: `feat/019-muted-strings` | **Date**: 2026-08-06 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/010-muted-strings/spec.md`

## Summary

Support `fret: -1` in fingering definitions to represent unplayed / muted open strings, rendering an 'X' symbol at the nut position in both horizontal and vertical orientations.

## Technical Context

**Language/Version**: TypeScript (strict mode) / ES2021+  
**Primary Dependencies**: None  
**Testing**: Jest + jsdom  
**Target Platform**: Modern browsers and Node.js with DOM support  

## Constitution Check

- [x] **Zero Runtime Dependencies**: No extra runtime dependencies.
- [x] **DRY / Script Reuse**: Extends existing fingering validation and SVG rendering methods (`renderFingering`).
- [x] **Dual Orientation & DOM Support**: Explicitly handles horizontal and vertical positioning at the nut offset.

## Project Structure

```text
src/
├── fingering/
│   ├── Fingering.ts      # Accept fret: -1 and set default text to 'X' for fret -1
│   └── types.ts          # Update type definitions to allow fret: -1
├── renderers/
│   └── svg.ts            # Handle fret: -1 rendering at nut position in horizontal and vertical modes
└── utils/
    └── validation.ts     # Allow fret === -1 in validateFingering

tests/
└── unit/
    └── MutedStrings.test.ts # Unit tests for fret: -1 muted string markers
```
