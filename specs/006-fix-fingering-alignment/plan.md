# Implementation Plan: Fix Fingering Circle Alignment

**Branch**: `fix/13-fingering-alignment` | **Date**: 2026-08-05 | **Spec**: [spec.md](spec.md)
**Input**: GitHub Issue #13

## Summary

Fix fingering marker circles that are not aligned with string visual centers. The misalignment grows with string index because string thickness varies (`stringThickness × (index + 1)`), but `getFingeringPosition()` doesn't account for the thickness offset.

## Technical Context

**Root Cause**: In horizontal orientation, strings are rendered at `y = str.y + thickness/2` (visual center), but fingering circles are placed at `y = stringIndex × stringSpacing` (top edge). The offset is `thickness/2` per string, which is noticeable on thicker bass strings.

**Fix**: Pass `stringThickness` to `getFingeringPosition()` and add the per-string thickness offset to center the circle on the string line.

## Proposed Changes

### Geometry Utilities

#### [MODIFY] [geometry.ts](file:///Users/sferry/Sources/fretly/src/utils/geometry.ts)

- Update `getFingeringPosition()` to accept `stringThickness` parameter
- Add `stringThickness * stringNum / 2` offset to Y (horizontal) or X (vertical)

---

### SVG Renderer

#### [MODIFY] [svg.ts](file:///Users/sferry/Sources/fretly/src/renderers/svg.ts)

- Pass `this.options.stringThickness` to `getFingeringPosition()` call

---

### Tests

#### [MODIFY] [Fingering.test.ts](file:///Users/sferry/Sources/fretly/tests/unit/Fingering.test.ts) or new test file

- Add test verifying fingering circle center matches string visual center for varying thickness strings

## Verification Plan

### Automated Tests
- `npm test` — all existing + new tests pass
- `npm run build` — clean build
- `npm run lint` — no warnings
