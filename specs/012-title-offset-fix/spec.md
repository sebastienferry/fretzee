# Feature Specification: Title Offset Fix

**Feature Branch**: `feat/034-title-offset-fix`  
**Created**: 2026-08-07  
**Status**: Draft  
**Input**: User description & issue #34: "Fix title off-set when orientation is vertical or there are finger on the highest string"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Dynamic Title Padding for Top String & Nut Fingerings (Priority: P1)

When fingerings are rendered on the highest string (string 1) or as open/muted markers (`fret: 0` or `fret: -1`), the title must dynamically shift upward so it never overlaps or collides with fingering markers.

**Why this priority**: Prevents visual overlap and unreadable title text on fretboards with top string markers.

**Independent Test**: Render a fretboard with a title and a fingering on string 1 (`string: 1, fret: 1`). Verify that the title element `y` coordinate is offset above the top edge of the fingering marker circle.

**Acceptance Scenarios**:

1. **Given** a fretboard with a title and fingerings on string 1 (or open string 1), **When** `fretboard.render()` is called, **Then** the SVG `viewBox` extends upward to accommodate top string fingerings and the title renders clearly above all markers.
2. **Given** a fretboard without string 1 fingerings, **When** rendered, **Then** title spacing remains clean and standard.

---

### User Story 2 - Consistent Title Layout in Vertical Orientation (Priority: P1)

When a fretboard is rendered in `vertical` orientation, the title header should be positioned above the top nut line matching the top margin layout convention of `horizontal` mode.

**Why this priority**: Ensures visual consistency and symmetry across both horizontal and vertical fretboard orientations.

**Independent Test**: Render a vertical fretboard with a title and verify the title element is centered above the top nut bounding width.

**Acceptance Scenarios**:

1. **Given** a vertical fretboard with a title (`orientation: 'vertical'`), **When** rendered, **Then** the title text is positioned above the top nut line without overlapping frets or string labels.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST dynamically calculate top viewBox padding in `SvgRenderer` based on whether fingerings exist on string 1 or open nut markers.
- **FR-002**: System MUST adjust title `y` coordinate calculation so the title header is rendered above all string 1 markers and nut markers with standard padding (`TITLE_PADDING`).
- **FR-003**: System MUST position title header in vertical orientation above the top nut line consistently.
- **FR-004**: System MUST maintain full backward compatibility for diagrams without titles or top-string fingerings.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Titles rendered on fretboards with top-string fingerings (`string: 1`) have zero visual collision or text overlap.
- **SC-002**: Vertical fretboard titles render cleanly above the top nut line.
- **SC-003**: Code passes `npm run build`, `npm run lint`, and `npm test`.
