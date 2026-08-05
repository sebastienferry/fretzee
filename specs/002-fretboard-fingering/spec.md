# Feature Specification: Fretboard Fingering

**Feature Branch**: `002-fretboard-fingering`  
**Created**: 2026-08-05  
**Status**: Draft  
**Input**: User description: "I want a way to now pass fingering on the fretboard. A fingering is position of the string and the fret, a color (html color) and a text displayed inside the finder representation which is itself a circle of the specified color. By default the color is background color is black and the font color is white (for text). The circle must be of a size that can allow to have one on each string of the same fret without covering one with the other."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Render Basic Fingering Markers (Priority: P1)

As a library consumer, I want to define and render fingering markers on specific string and fret positions so that users can visually identify finger placements on the guitar/bass fretboard.

**Why this priority**: Core value of the feature. Without basic fingering markers on string/fret positions, the feature provides no utility.

**Independent Test**: Can be tested independently by supplying a list of fingerings with string and fret coordinates and verifying that circle markers with default black background and white text appear on the expected fretboard positions.

**Acceptance Scenarios**:

1. **Given** a fretboard configuration with fingering markers specified by string and fret numbers, **When** the SVG is rendered, **Then** a circular marker is drawn at each specified string and fret intersection.
2. **Given** a fingering marker specified without explicit color or font color, **When** rendered, **Then** the marker circle defaults to a black background and the text inside defaults to white.
3. **Given** a fingering marker with text (e.g. finger numbers "1", "2", "3", "4", "T" or note names), **When** rendered, **Then** the text is centered horizontally and vertically inside the marker circle.

---

### User Story 2 - Custom Fingering Styling (Priority: P2)

As a library consumer, I want to specify custom background and text colors for individual fingering markers so that I can highlight root notes, scale degrees, or distinct finger roles visually.

**Why this priority**: Enhances visual distinction for chord diagrams, scales, and instructional material.

**Independent Test**: Can be tested independently by creating fingerings with custom HTML colors (e.g. `#FF0000`, `blue`, `rgba(...)`) and custom font colors, verifying the rendered SVG elements reflect the specified colors.

**Acceptance Scenarios**:

1. **Given** a fingering marker with a custom background HTML color (e.g., `#E74C3C`), **When** rendered, **Then** the circle fill color matches the specified HTML color.
2. **Given** a fingering marker with a custom text HTML color (e.g., `#000000`), **When** rendered, **Then** the text fill color inside the circle matches the specified HTML color.

---

### User Story 3 - Non-overlapping Responsive Fingering Sizing (Priority: P3)

As a library consumer, I want fingering marker circles to be sized dynamically based on fretboard geometry so that adjacent fingerings on the same fret across all strings never overlap or obscure each other.

**Why this priority**: Ensures visual clarity regardless of string count, fret width, fretboard dimensions, or layout orientation (horizontal or vertical).

**Independent Test**: Can be tested independently by placing fingerings on every adjacent string on the exact same fret and asserting that the distance between adjacent circle centers is strictly greater than the circle diameter.

**Acceptance Scenarios**:

1. **Given** fingerings placed on every string of the same fret, **When** rendered in horizontal or vertical orientation, **Then** no two fingering circles overlap or touch each other.
2. **Given** fretboards with varying string counts (e.g., 4, 6, 7, 8 strings), **When** fingerings are rendered, **Then** marker circle radii scale appropriately to fit within string spacing limits.

---

### Edge Cases

- What happens when a fingering is placed on an open string (fret 0)? The marker should be displayed appropriately above/behind the nut according to fretboard orientation without overlapping adjacent open string markers.
- What happens when a string or fret number is out of bounds for the current fretboard configuration? The invalid fingering should be safely ignored or handled gracefully without crashing the SVG generator.
- What happens when empty text is provided for a fingering marker? The circle is rendered cleanly with specified/default colors without text or text errors.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST allow passing a collection of fingering definitions to the fretboard renderer.
- **FR-002**: System MUST place each fingering marker circle precisely centered on the specified string line and fret location.
- **FR-003**: System MUST render each fingering as a circle containing the specified text string.
- **FR-004**: System MUST default the fingering circle background color to black (`#000000`) if no background color is provided.
- **FR-005**: System MUST default the fingering text font color to white (`#ffffff`) if no font color is provided.
- **FR-006**: System MUST calculate the maximum allowable radius/diameter for fingering circles such that fingerings on adjacent strings on the same fret do not overlap in either horizontal or vertical orientation.
- **FR-007**: System MUST support custom HTML color strings (hex, rgb/rgba, named colors) for both fingering marker background fill and text font color.
- **FR-008**: System MUST support rendering fingering text in both horizontal and vertical fretboard layout modes with correct text orientation and centering.

### Key Entities

- **Fingering**: Represents a single finger marker on the fretboard.
  - *Attributes*: `string` (number, 1-indexed string index), `fret` (number, 0 for open or fret number), `text` (optional string, text to display inside circle), `color` (optional string, HTML color for circle background), `textColor` (optional string, HTML color for text inside circle).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of rendered fingering markers are correctly positioned at their specified string/fret coordinates in both horizontal and vertical modes.
- **SC-002**: 0% overlap between fingering circle bounds when fingerings are placed on adjacent strings of the same fret across 4, 6, 7, and 8-string fretboards.
- **SC-003**: 100% compliance with default color rules (black background, white text) when custom styling is omitted.
- **SC-004**: SVG output compiles and passes standard DOM validation tests with zero console warnings or errors.

## Assumptions

- String numbers follow the standard 1-indexed convention established in the fretly library.
- Fret 0 represents open strings, situated outside the fret nut.
- HTML colors accept any standard CSS color representation (hex codes like `#000000`, named colors like `black`, `rgb()`, `hsl()`, etc.).
- Text inside fingering circles is typically short (1-3 characters, e.g., finger numbers "1"-"4", "T", or note names "C#").
