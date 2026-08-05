# Implementation Plan: Fretboard Inlay Position Markers

**Feature**: [spec.md](spec.md)  
**Branch**: `feat/11-fretboard-inlays`

---

## User Review Required

> [!NOTE]
> `showInlays` defaults to `true`. Developers can disable inlays by setting `showInlays: false` in `FretboardOptions`.

---

## Proposed Changes

### Core Library (`src/`)

#### [MODIFY] [Fretboard.ts](../../src/fretboard/Fretboard.ts)
- Support `showInlays?: boolean` in `FretboardOptions`.
- Render `<g class="fretly-inlays">` group with single or double grey dot `<circle>` elements at standard fret positions (3, 5, 7, 9, 12, 15, 17, 19, 21, 24).
- Support both horizontal and vertical positioning calculations.

#### [MODIFY] [types.ts](../../src/fretboard/types.ts)
- Add `showInlays?: boolean` to `FretboardOptions` interface.

### Tests (`tests/`)

#### [NEW] [Inlays.test.ts](../../tests/unit/Inlays.test.ts)
- Unit tests verifying inlay rendering for default `showInlays: true`, explicit `showInlays: false`, horizontal & vertical orientations, and double-dot frets.

---

## Verification Plan

### Automated Tests
```bash
npm run build
npm run lint
npm test
```
