# Data Model: Configurable Starting Fret

**Date**: 2026-08-06  
**Feature**: [spec.md](spec.md)

## Modified Entities

### FretboardOptions (interface)

New field:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `startFret` | `number` (optional) | `1` | The first visible fret on the diagram (1-based). Range: 0–24. |

### Constants (new)

| Constant | Value | Description |
|----------|-------|-------------|
| `DEFAULT_START_FRET` | `1` | Default starting fret |
| `MIN_START_FRET` | `0` | Minimum valid startFret (treated as 1) |
| `MAX_START_FRET` | `24` | Maximum valid startFret |

### CSS Classes (new)

| Class | Description |
|-------|-------------|
| `fretly-start-fret` | Applied to the starting fret indicator text element |

## Position Mapping Logic

### Absolute → Relative Fret Mapping

```
relativeFret = absoluteFret - startFret + 1
```

- A fingering at absolute fret 7 on a fretboard with `startFret: 5` maps to relative position 3.
- Only fingerings where `relativeFret >= 1 && relativeFret <= fretCount` are rendered.
- Open strings (fret 0): only rendered when `startFret <= 1`.

### Inlay Filtering

```
visibleInlays = inlayPositions.filter(pos => pos >= startFret && pos <= startFret + fretCount - 1)
```

Each visible inlay is positioned at:
```
relativePosition = pos - startFret + 1  // 1-based position within the diagram
```

The label text uses the absolute fret number (`pos`), not the relative position.

### Inlay Dot Filtering

Same filtering as inlays. Dot position uses the relative position within the visible range.

## Validation Rules

| Rule | Error Type |
|------|------------|
| `startFret` must be an integer | `TypeError` |
| `startFret` must be in range [0, 24] | `RangeError` |
| `startFret` of 0 treated as 1 (no error) | N/A |
