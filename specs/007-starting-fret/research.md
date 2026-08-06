# Research: Configurable Starting Fret

**Date**: 2026-08-06  
**Feature**: [spec.md](spec.md)

## Research Topics

### 1. How do existing guitar diagram tools handle starting fret?

**Decision**: Use a `startFret` option (1-based) that shifts the entire visible fret range.

**Rationale**: All major guitar chord diagram tools (ChordPro, guitar-chord-js, SVGuitar) use a concept of "position" or "starting fret" that is 1-based and shifts the displayed fret window. This is the universally understood convention among musicians.

**Alternatives considered**:
- Zero-based offset: Rejected — musicians think in 1-based fret numbers
- Fret range (start + end): Rejected — `startFret` + `fretCount` is more intuitive and consistent with existing API

### 2. How should fingering coordinates interact with startFret?

**Decision**: Fingerings use **absolute fret numbers**. The library internally maps them to visual positions relative to `startFret`.

**Rationale**: Users think in terms of absolute fret positions (e.g., "5th fret A string"). Making them specify relative positions would be confusing and error-prone.

**Alternatives considered**:
- Relative fret numbers: Rejected — users would need to mentally subtract startFret
- Both modes (relative + absolute flag): Rejected — YAGNI, adds complexity with no clear benefit

### 3. How should open strings (fret 0) behave with startFret > 1?

**Decision**: Open string fingerings (`fret: 0`) are only rendered when `startFret <= 1`. When `startFret > 1`, they are silently omitted.

**Rationale**: Open strings are physically only possible at the nut (fret 0). Showing them on a diagram starting at fret 5 makes no musical sense and would be visually confusing.

### 4. How should the starting fret indicator be displayed?

**Decision**: Render a text label showing the fret number at the beginning of the fretboard (left side in horizontal, top in vertical). Only shown when `startFret > 1`.

**Rationale**: This is the standard convention in guitar sheet music and chord books. It's simple and universally understood.

**Alternatives considered**:
- "fr" suffix (e.g., "5fr"): Considered but rejected for now — the numeric label alone is cleaner and consistent with how inlays display fret numbers. Can be added later.

### 5. Impact on existing geometry calculations

**Decision**: The internal fret geometry loop continues to use relative indices (1 to fretCount+1). The `startFret` offset is applied at two boundaries:
1. **Inlay generation**: Filter `inlayPositions` to only include those in range `[startFret, startFret + fretCount - 1]`, and label them with absolute fret numbers
2. **Fingering rendering**: Map absolute fret numbers to relative visual positions
3. **Inlay dots**: Offset dot positions to match the visible fret range

**Rationale**: Minimizes changes to the core geometry engine. The "window" concept is an outer-layer concern — the internal rendering always draws `fretCount` frets, just labeling and filtering differently.
