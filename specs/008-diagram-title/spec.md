# Feature Specification: Diagram Title

**Feature Branch**: `008-diagram-title`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User description: "Being able to add a title to a diagram / fretboard. Title is always at the top. Can be aligned to the left or centered. demo/studio should be changed accordingly."

## User Scenarios & Testing

### User Story 1 - Add a centered title to a chord diagram (Priority: P1)

A user creating a chord diagram wants to display the chord name (e.g., "Am", "G7") as a title above the fretboard so viewers immediately know which chord is shown.

**Why this priority**: The most common use case — displaying a chord or scale name above a diagram is foundational for any fretboard visualization tool.

**Independent Test**: Can be fully tested by creating a Fretboard with a `title` option and verifying the rendered SVG contains the title text element positioned above the fretboard, centered horizontally by default.

**Acceptance Scenarios**:

1. **Given** a Fretboard created with `{ title: 'Am' }`, **When** it is rendered, **Then** the SVG contains a text element with content "Am" positioned above the fretboard, horizontally centered.
2. **Given** a Fretboard created without a `title` option, **When** it is rendered, **Then** no title text element is present and no extra space is allocated above the fretboard.
3. **Given** a Fretboard with `{ title: 'Am' }` in vertical orientation, **When** it is rendered, **Then** the title appears above the fretboard, horizontally centered over the vertical diagram.

---

### User Story 2 - Left-align a title on a fretboard diagram (Priority: P2)

A user wants to left-align the title text instead of centering it, for cases where diagrams are stacked or embedded in text content where left alignment is preferred.

**Why this priority**: Alignment flexibility is important but secondary to having the title displayed at all.

**Independent Test**: Can be fully tested by creating a Fretboard with `{ title: 'C Major Scale', titleAlignment: 'left' }` and verifying the text is anchored to the left edge of the fretboard.

**Acceptance Scenarios**:

1. **Given** a Fretboard with `{ title: 'C Major Scale', titleAlignment: 'left' }`, **When** it is rendered, **Then** the title text is left-aligned with the left edge of the fretboard.
2. **Given** a Fretboard with `{ title: 'Pentatonic', titleAlignment: 'center' }`, **When** it is rendered, **Then** the title is horizontally centered (same as default).

---

### User Story 3 - Demo and Studio pages display titles (Priority: P3)

The demo page (`demo.html`) and the studio page (`studio.html`) are updated to showcase the title feature, allowing users to see examples and interactively configure titles.

**Why this priority**: Documentation and discoverability — important but depends on the core feature being implemented first.

**Independent Test**: Can be verified by opening `demo.html` and `studio.html` in a browser and confirming that at least one fretboard displays a title, and studio allows toggling/editing the title.

**Acceptance Scenarios**:

1. **Given** a user opens `demo.html`, **When** the page loads, **Then** at least one fretboard example displays a title above it.
2. **Given** a user opens `studio.html`, **When** they type a title in the title input field, **Then** the rendered fretboard updates to display the entered title.
3. **Given** a user opens `studio.html`, **When** they select "left" alignment, **Then** the rendered fretboard title shifts to left alignment.

---

### Edge Cases

- What happens when the title is an empty string (`title: ''`)? No title element should be rendered and no extra space allocated.
- What happens with a very long title? The title text should not be clipped; it may overflow the diagram width. No wrapping is applied.
- What happens with special characters in the title (e.g., `<`, `&`, `"`)? Characters must be properly escaped in the SVG output.
- What happens when `titleAlignment` is provided but `title` is not set? The alignment option is ignored silently.

## Requirements

### Functional Requirements

- **FR-001**: The library MUST support an optional `title` property in `FretboardOptions` that accepts a string.
- **FR-002**: When a title is provided, the library MUST render a text element above the fretboard in the SVG output.
- **FR-003**: The title MUST always appear at the top of the diagram, above all fretboard elements (strings, frets, inlays, fingerings).
- **FR-004**: The library MUST support a `titleAlignment` option with values `'center'` (default) and `'left'`.
- **FR-005**: When `titleAlignment` is `'center'`, the title text MUST be horizontally centered relative to the fretboard width.
- **FR-006**: When `titleAlignment` is `'left'`, the title text MUST be left-aligned with the left edge of the fretboard.
- **FR-007**: When no title is provided (undefined or empty string), no title element MUST be rendered and no extra vertical space MUST be allocated.
- **FR-008**: The title MUST work correctly in both horizontal and vertical orientations.
- **FR-009**: The SVG viewBox MUST adjust to accommodate the title when present, adding space above the fretboard.
- **FR-010**: The title element MUST have a dedicated CSS class (`fretly-title`) for external styling.
- **FR-011**: The `demo.html` page MUST include at least one example with a title.
- **FR-012**: The `studio.html` page MUST allow users to enter a title and choose alignment interactively.

### Key Entities

- **Title**: A text label displayed above the fretboard. Has a text value (string) and alignment ('center' | 'left').

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can add a title to any fretboard by providing a single string option, with the title visible on first render.
- **SC-002**: Title alignment (center or left) is configurable and visually correct in both orientations.
- **SC-003**: Existing fretboards without titles render identically to before the feature was added (no visual regression).
- **SC-004**: All new functionality has corresponding unit test coverage (100% of new code paths covered).
- **SC-005**: Demo and studio pages are updated to showcase the title feature.

## Assumptions

- The title uses a reasonable default font (sans-serif) and size consistent with existing SVG text elements in the library.
- No custom font or font-size option is needed for the initial implementation — the CSS class allows external styling overrides.
- The title does not support multi-line text; it is always a single line.
- Right alignment is not included in this iteration (only center and left as specified in the issue).
- The title spacing above the fretboard uses a sensible default gap (not configurable in v1).
