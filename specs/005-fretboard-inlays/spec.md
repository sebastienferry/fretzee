# Feature Specification: Fretboard Inlay Position Markers

**Feature Branch**: `feat/11-fretboard-inlays`  
**Created**: 2026-08-05  
**Status**: Draft  
**Input**: Issue #11: "Add inlays as small grey dots on the fretboard on standard frets (3, 5, 7, 9, 12, ...). Just like on a guitar fretboard. This might deactivated through an option in the library. The default is true."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automatic Fretboard Inlay Position Markers (Priority: P1)

As a guitar player or music student, I want standard position marker dots displayed on the fretboard (frets 3, 5, 7, 9, 12, 15, 17, 19, 21, 24), so that I can quickly orient positions when reading rendered SVG diagrams.

**Why this priority**: Enhances visual readability of rendered fretboards matching real-world guitar necks.

**Independent Test**: Render a fretboard with 12 frets and default options. Verify grey dot inlays appear at frets 3, 5, 7, 9, and double dots appear at fret 12.

**Acceptance Scenarios**:

1. **Given** a fretboard is rendered with default options (`showInlays` omitted or `true`), **When** rendered, **Then** single grey dot inlays are drawn at frets 3, 5, 7, 9, 15, 17, 19, 21 and double dot inlays are drawn at frets 12 and 24.
2. **Given** a user initializes `new Fretboard({ showInlays: false })`, **When** rendered, **Then** no inlay dots are drawn on the fretboard.
3. **Given** a fretboard in either `horizontal` or `vertical` orientation, **When** inlays are rendered, **Then** dots scale and position correctly along the neck center without overlapping strings or frets.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST render inlay position markers as subtle grey dots on standard fret positions (3, 5, 7, 9, 12, 15, 17, 19, 21, 24).
- **FR-002**: System MUST render double dots at octave frets (12 and 24) and single dots at single-inlay frets (3, 5, 7, 9, 15, 17, 19, 21).
- **FR-003**: System MUST provide a `showInlays?: boolean` option defaulting to `true`.
- **FR-004**: System MUST render inlays correctly in both `horizontal` and `vertical` neck orientations.
- **FR-005**: System MUST assign semantic CSS class names (`fretly-inlay`, `fretly-inlays`) to rendered SVG elements.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of rendered fretboards display inlays by default when `showInlays` is true or omitted.
- **SC-002**: Setting `showInlays: false` eliminates 100% of inlay SVG elements.
- **SC-003**: 100% of unit tests pass for both horizontal and vertical modes with and without inlays.
