# Implementation Plan: PNG Export

**Branch**: `feat/030-png-export` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `specs/011-png-export/spec.md`

## Summary

Add zero-dependency PNG export capabilities to `Fretboard` (`toPNGBlob()`, `toPNGDataURL()`, `downloadPNG()`) and standalone utility `exportSvgToPngBlob()` using native HTML5 `<canvas>`, `Blob`, and `Image` object URLs. Add "Export PNG" button to `editor.html`.

## Technical Context

**Language/Version**: TypeScript (strict mode) / ES2021+  
**Primary Dependencies**: None (Zero runtime dependencies)  
**Testing**: Jest + jsdom  

## Constitution Check

- [x] **Zero Runtime Dependencies**: Uses browser-native Canvas, Blob, and Image APIs.
- [x] **DRY / Utility Reuse**: Core rasterization implemented in reusable utility function.
- [x] **Backward Compatibility**: Fully additive API on `Fretboard`.

## Project Structure

```text
src/
├── utils/
│   └── export.ts         # Native Canvas SVG -> PNG rasterization & download helpers
├── fretboard/
│   ├── Fretboard.ts      # Add toPNGBlob(), toPNGDataURL(), downloadPNG() methods
│   └── types.ts          # Add PNGExportOptions interface
└── index.ts              # Export PNGExportOptions and exportSvgToPngBlob utility

editor.html               # Add "Export PNG" toolbar button
tests/
└── unit/
    └── PNGExport.test.ts # Unit tests for PNG export utilities
```
