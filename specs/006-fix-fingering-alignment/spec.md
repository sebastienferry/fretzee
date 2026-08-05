# Feature Specification: Fix Fingering Circle Alignment

**Feature Branch**: `fix/13-fingering-alignment`  
**Created**: 2026-08-05  
**Status**: Draft  
**Input**: GitHub Issue #13 — Fingering circles not aligned with string center on thicker strings

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fingering markers visually align with strings (Priority: P1)

When a user renders a fretboard with fingering markers, each marker circle must be perfectly centered on the visual center of its corresponding string line, regardless of the string's thickness.

**Why this priority**: This is the only user story — the core visual alignment must be correct for the library to render accurate fretboard diagrams.

**Independent Test**: Render a 6-string guitar fretboard with fingerings on strings of varying thickness. Verify that each fingering circle's center Y (horizontal) or center X (vertical) matches the string line's visual center.

**Acceptance Scenarios**:

1. **Given** a horizontal 6-string fretboard with varying string thickness, **When** fingerings are placed on each string, **Then** the circle center aligns with the string's visual center line (y + thickness/2)
2. **Given** a vertical 6-string fretboard with varying string thickness, **When** fingerings are placed on each string, **Then** the circle center aligns with the string's visual center line (x + thickness/2)
3. **Given** a fretboard with uniform string thickness (e.g., stringThickness=1), **When** fingerings are rendered, **Then** alignment is maintained (regression test)

---

### Edge Cases

- Fretboards with extreme string thickness values
- Open string fingerings (fret=0) must also align correctly
- Bass guitars (4-string) with different thickness scaling

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Fingering marker circles MUST be vertically centered on the string's visual center in horizontal orientation
- **FR-002**: Fingering marker circles MUST be horizontally centered on the string's visual center in vertical orientation
- **FR-003**: The fix MUST account for per-string varying thickness (thickness = stringThickness × (stringIndex + 1))
- **FR-004**: Open string markers (fret=0) MUST also align correctly with string centers

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Fingering circle center coordinates match string visual center coordinates within 0px tolerance for all strings
- **SC-002**: All existing unit tests continue to pass
- **SC-003**: Both horizontal and vertical orientations render correctly

## Assumptions

- String thickness varies linearly by string index: `stringThickness * (index + 1)`
- The fix is localized to the geometry utility and renderer — no public API changes
- No breaking changes to existing behavior for fretboards with uniform or minimal thickness
