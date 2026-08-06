# Feature Specification: Configurable Starting Fret

**Feature Branch**: `007-starting-fret`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User description: "Being able to chose the starting fret > 0"
**Issue**: #17

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render a Chord Diagram Starting at a Specific Fret (Priority: P1)

A guitar educator wants to display a barre chord voicing that starts at fret 5. They create a fretboard with `startFret: 5` and `fretCount: 4`, and the rendered SVG shows frets 5 through 8 with inlay numbers starting at 5 instead of 1.

**Why this priority**: This is the core use case — rendering a "window" of the fretboard starting at any position. Without this, the library can only show diagrams from fret 1, making it impossible to display common chord shapes above position 1.

**Independent Test**: Can be fully tested by creating a `Fretboard` with `startFret: 5, fretCount: 4`, calling `render()`, and verifying the SVG contains fret numbers 5-8 in the inlays. Delivers immediate value for chord diagram creation.

**Acceptance Scenarios**:

1. **Given** a Fretboard with `startFret: 5` and `fretCount: 4`, **When** `render()` is called, **Then** the SVG shows 4 frets with inlay numbers 5, 7 (from the standard inlay positions visible in this range).
2. **Given** a Fretboard with `startFret: 1` (or no startFret), **When** `render()` is called, **Then** the fretboard renders identically to current behavior (backward compatible).
3. **Given** a Fretboard with `startFret: 5`, **When** a fingering is placed at `{ string: 1, fret: 5 }`, **Then** the fingering marker appears at the first fret position on the diagram.
4. **Given** a Fretboard with `startFret: 5`, **When** a fingering is placed at `{ string: 1, fret: 2 }`, **Then** the fingering is ignored or not rendered (fret 2 is outside the visible range).

---

### User Story 2 - Inlay Numbers Reflect Actual Fret Positions (Priority: P1)

When rendering a fretboard starting at fret 7, the inlay (fret position) numbers displayed alongside or below the fretboard must show the actual fret numbers (e.g., 7, 9) rather than relative numbers (e.g., 1, 3).

**Why this priority**: Without correct inlay numbering, the diagram is misleading and users cannot tell which position on the neck is being shown.

**Independent Test**: Create a Fretboard with `startFret: 7, fretCount: 5`, render it, and verify the inlay text elements in the SVG show "7" and "9" (standard inlay positions within frets 7–11).

**Acceptance Scenarios**:

1. **Given** a Fretboard with `startFret: 7` and `fretCount: 5`, **When** rendered, **Then** inlays display "7" and "9" (the standard inlay positions visible in the range 7–11).
2. **Given** a Fretboard with `startFret: 12` and `fretCount: 4`, **When** rendered, **Then** the inlay displays "12" (the 12th fret inlay, visible in the range 12–15).

---

### User Story 3 - Starting Fret Indicator (Priority: P2)

When the starting fret is greater than 1, the diagram should visually indicate the starting fret number at the top/left of the fretboard (depending on orientation) so users immediately know the position on the neck, even when no standard inlay falls within the displayed range.

**Why this priority**: This is important for usability — many chord diagrams use a small fret number label (e.g., "5fr") next to the first fret line to indicate position. However, the inlay numbers from US-2 already provide partial context.

**Independent Test**: Create a Fretboard with `startFret: 6, fretCount: 3`, render it, and verify an SVG text element with "6" (or "6fr") appears at the nut/first fret position.

**Acceptance Scenarios**:

1. **Given** a Fretboard with `startFret: 6` and `fretCount: 3`, **When** rendered in horizontal orientation, **Then** a text label showing the starting fret number appears to the left of the first fret line.
2. **Given** a Fretboard with `startFret: 6` and `fretCount: 3`, **When** rendered in vertical orientation, **Then** a text label showing the starting fret number appears above the first fret line.
3. **Given** a Fretboard with `startFret: 1`, **When** rendered, **Then** no starting fret indicator is displayed (the nut is at position 1, which is the default).

---

### Edge Cases

- What happens when `startFret` is 0? → Treated as 1 (the nut/default position).
- What happens when `startFret` is negative? → Validation error (RangeError).
- What happens when `startFret` exceeds a reasonable maximum (e.g., 24)? → Allowed — the library should not impose an arbitrary upper limit beyond the physical limits of a real instrument. A reasonable max is 24.
- What happens when `startFret + fretCount` exceeds 24? → Allowed — the library renders as requested. Inlays only appear for positions in the `inlayPositions` array.
- What happens when a fingering references a fret outside the visible range? → The fingering is silently omitted from rendering.
- What happens with `getMarkerPosition(fretIndex, stringIndex)` when `fretIndex` refers to an absolute fret that is within the visible range? → Fingerings use absolute fret numbers; the library internally maps them to positions relative to `startFret`.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept a `startFret` option in the `FretboardOptions` interface, specifying the first fret to display (1-based, default: 1).
- **FR-002**: System MUST render frets starting from `startFret` through `startFret + fretCount - 1` (displaying exactly `fretCount` frets).
- **FR-003**: Inlay numbers MUST reflect the actual fret position on the neck (absolute numbering), not relative positions.
- **FR-004**: Fingering markers MUST use absolute fret numbers. A fingering at `fret: 7` on a fretboard with `startFret: 5` MUST appear at the 3rd fret position in the diagram.
- **FR-005**: Fingerings referencing frets outside the visible range (`startFret` to `startFret + fretCount - 1`) MUST be silently omitted from rendering.
- **FR-006**: When `startFret` > 1, the system MUST display a starting fret number indicator at the beginning of the fretboard.
- **FR-007**: The feature MUST work identically in both horizontal and vertical orientations.
- **FR-008**: Setting `startFret` to 0 or omitting it MUST behave identically to `startFret: 1` (backward compatible).
- **FR-009**: System MUST validate `startFret` is within the range 0–24, throwing a RangeError for invalid values.
- **FR-010**: The `getMarkerPosition()`, `getFretPosition()`, and `getStringPosition()` methods MUST continue to work correctly with the `startFret` option, using absolute fret numbering.

### Key Entities

- **StartFret**: A numeric option (0–24) that defines the first visible fret on the rendered diagram. Defaults to 1. Determines the "window" of the fretboard being displayed.
- **Fret Range**: The visible fret range, computed as `[startFret, startFret + fretCount - 1]`. Only frets, inlays, and fingerings within this range are rendered.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can render a fretboard starting at any fret from 1 to 24 and see correct fret numbering in inlays.
- **SC-002**: Existing fretboards created without `startFret` render identically to current behavior (100% backward compatibility).
- **SC-003**: Both horizontal and vertical orientations produce correct layouts when `startFret` > 1.
- **SC-004**: Fingering markers placed at absolute fret positions are correctly positioned within the visible fret range.
- **SC-005**: All existing unit tests continue to pass without modification.

## Assumptions

- The `startFret` option uses 1-based numbering consistent with how musicians refer to fret positions (fret 1 is the first fret after the nut).
- Setting `startFret: 0` is treated as `startFret: 1` for convenience (no separate "nut" rendering mode).
- The nut (thick first-fret line) is only rendered when `startFret` is 0 or 1 — when starting at a higher fret, the first line is a regular fret line.
- The maximum valid `startFret` is 24, matching the highest commonly found fret on extended-range guitars.
- Open string fingerings (`fret: 0`) are only rendered when `startFret` is 0 or 1.
