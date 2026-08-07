# Feature Specification: Tuning Labels

**Feature Branch**: `feat/024-tuning-labels`  
**Created**: 2026-08-07  
**Status**: Draft  
**Input**: User description & issue #24: "Add the tuning on the left (horizontal) or top (vertical) orientations"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render Custom Tuning Labels (Priority: P1)

A developer wants to display custom tuning note labels (e.g. `tuning: ['E', 'A', 'D', 'G', 'B', 'E']`) on the fretboard diagram outside the nut margin.

**Why this priority**: Core requirement for musical chord & scale diagram clarity.

**Independent Test**: Render a Fretboard with `tuning: ['E', 'A', 'D', 'G', 'B', 'E']` and verify `<text>` elements with class `fretly-tuning` are rendered outside the nut margin.

**Acceptance Scenarios**:

1. **Given** `tuning: ['E', 'A', 'D', 'G', 'B', 'E']` in horizontal mode, **When** rendered, **Then** tuning note labels are rendered to the left of the nut aligned vertically with each string.
2. **Given** `tuning: ['E', 'A', 'D', 'G', 'B', 'E']` in vertical mode, **When** rendered, **Then** tuning note labels are rendered above the top nut line aligned horizontally with each string.
3. **Given** `tuning` is omitted, **When** rendered, **Then** no tuning labels are displayed (explicit opt-in).

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept optional `tuning?: string[]` array in `FretboardOptions` ordered from lowest string (string N) to highest string (string 1).
- **FR-002**: System MUST render tuning text labels only when `tuning` option is explicitly provided.
- **FR-003**: System MUST position tuning text labels to the left of the nut in horizontal orientation and above the nut in vertical orientation.
- **FR-004**: System MUST dynamically extend SVG `viewBox` padding to accommodate tuning text labels without clipping.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Tuning labels render cleanly without clipping or text collision.
- **SC-002**: Code passes `npm run build`, `npm run lint`, and `npm test`.
