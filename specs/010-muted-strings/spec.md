# Feature Specification: Unplayed / Muted Open Strings ('X')

**Feature Branch**: `feat/019-muted-strings`  
**Created**: 2026-08-06  
**Status**: Draft  
**Input**: User description & feedback from issue #19: "Being able to add a cross for not played open strings. In the JSON/options payload, setting fret: -1 indicates an unplayed/muted string rendered with an 'X' marker at the nut/open string position."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Specify Muted String with `fret: -1` (Priority: P1)

A user defining chord fingerings wants to indicate that certain strings are unplayed/muted (e.g. string 6 on a C Major chord `x32010`) by setting `fret: -1`, rendering an 'X' symbol at the nut position.

**Why this priority**: Core requirement for accurate chord diagram notation.

**Independent Test**: Create a Fretboard with a fingering `{ string: 6, fret: -1 }` (or 1-indexed string identifier) and verify an 'X' text/path element renders at the nut / open string position.

**Acceptance Scenarios**:

1. **Given** a fingering defined with `fret: -1`, **When** rendered, **Then** an 'X' marker is displayed at the open string / nut position instead of a circle dot or open 'O' symbol.
2. **Given** a chord with multiple muted strings (e.g., strings 5 and 6 with `fret: -1`), **When** rendered, **Then** both strings display 'X' markers at their open string positions.
3. **Given** horizontal or vertical orientation, **When** rendered with `fret: -1`, **Then** the 'X' marker is correctly positioned aligned with the respective string line at the nut position.

---

### User Story 2 - Custom Muted Marker Text / Styling (Priority: P2)

A user wants muted string markers to use consistent styling with other fingering markers, supporting custom text (default `'X'`), custom colors, or standard CSS classes (`.fretly-muted-marker` / `.fretly-fingering`).

**Why this priority**: Maintains consistency with existing Fingering marker customization features.

**Independent Test**: Create a Fretboard with `{ string: 6, fret: -1, text: 'X', color: '#ff0000' }` and verify custom colors apply.

**Acceptance Scenarios**:

1. **Given** a fingering with `fret: -1`, **When** no text is provided, **Then** the marker displays `'X'` by default.
2. **Given** a fingering with `fret: -1` and custom text (e.g. `'x'`), **Then** that text displays at the nut position.

---

### User Story 3 - Interactive Demo & Editor Update (Priority: P3)

The interactive editor (`editor.html`) and showcase demos (`demo.html`) allow configuring muted strings (`fret: -1`).

**Why this priority**: Ensures discoverability and live demonstration of muted string feature.

**Independent Test**: Open `demo.html` and `editor.html` and verify chord diagrams showing muted open strings render correctly.

**Acceptance Scenarios**:

1. **Given** `demo.html` open in browser, **When** viewed, **Then** chord examples (e.g., C Major `x32010` or D Major `xx0232`) show 'X' for muted strings.

---

### Edge Cases

- What happens if `fret: -1` is provided when `startFret > 1`? Muted string markers at the nut (`fret: -1`) should be omitted or handled consistently with open string markers (`fret: 0`).
- What happens if invalid negative fret numbers (e.g. `fret: -2`) are passed? Throw a RangeError or validation exception.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept `fret: -1` in `FingeringOptions` / `Fingering` model to represent an unplayed / muted string.
- **FR-002**: System MUST render an 'X' marker at the open string / nut position when `fret: -1` is specified.
- **FR-003**: System MUST support `fret: -1` in both horizontal and vertical fretboard orientations.
- **FR-004**: System MUST validate `fret` values, allowing `-1` and integers from `0` to `24` while rejecting integers `< -1` or `> 24`.
- **FR-005**: System MUST assign a dedicated CSS class (`fretly-muted-marker` or `fretly-fingering-muted`) to rendered muted string markers.
- **FR-006**: System MUST update `demo.html` and `editor.html` to showcase muted string chord diagrams.

### Key Entities

- **Fingering**: Represents a marker on a string. `fret: -1` indicates a muted/unplayed string (rendered as 'X'), `fret: 0` indicates an un-retted open string, and `fret > 0` indicates a fretted note.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can specify muted strings with `fret: -1` and see 'X' markers rendered accurately in both horizontal and vertical orientations.
- **SC-002**: 100% pass rate on unit tests covering `fret: -1` rendering, validation, and layout logic.
- **SC-003**: Code passes `npm run build`, `npm run lint`, and `npm test`.

## Assumptions

- Muted string markers are displayed at `fret: 0` position (nut / open string margin).
- Default text for `fret: -1` is `'X'`.
