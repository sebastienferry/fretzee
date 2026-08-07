# Feature Specification: PNG Export

**Feature Branch**: `feat/030-png-export`  
**Created**: 2026-08-07  
**Status**: Draft  
**Input**: User description & issue #30: "Add a export to PNG. Export SVG fretboard diagrams as high-resolution PNG images in browser environments using native HTML5 Canvas rasterization."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Export Fretboard to PNG Blob / Data URL (Priority: P1)

A developer using Fretly wants to export a rendered fretboard diagram directly to a PNG Blob or Data URL so it can be saved, displayed in an `<img>` tag, or sent to a server.

**Why this priority**: Foundational API requirement for PNG export capability.

**Independent Test**: Create a Fretboard, call `await fretboard.toPNGDataURL()`, and verify it returns a `data:image/png;base64,...` string.

**Acceptance Scenarios**:

1. **Given** a rendered Fretboard diagram in a browser DOM environment, **When** `await fretboard.toPNGDataURL()` is called, **Then** it returns a valid PNG Data URL string.
2. **Given** a rendered Fretboard diagram, **When** `await fretboard.toPNGBlob()` is called, **Then** it returns a `Blob` with type `image/png`.
3. **Given** a non-browser / Node.js environment without Canvas DOM support, **When** PNG export is called, **Then** it throws a descriptive `Error` indicating Canvas DOM support is required.

---

### User Story 2 - Configurable Resolution & Scaling (Priority: P2)

A user wants PNG export to produce high-DPI (Retina) diagrams by specifying a scale factor (e.g., `scale: 2` default or `scale: 3`), ensuring crisp graphics without blurriness.

**Why this priority**: Standard vector-to-raster export quality requirement for modern displays.

**Independent Test**: Call `toPNGDataURL({ scale: 2 })` and verify the exported canvas dimensions match `2 * svgWidth` by `2 * svgHeight`.

**Acceptance Scenarios**:

1. **Given** `scale: 2` (default), **When** exported, **Then** the rasterized PNG canvas width/height are exactly double the SVG logical pixel dimensions.
2. **Given** custom `scale: 3`, **When** exported, **Then** the rasterized PNG dimensions scale by 3x.

---

### User Story 3 - Interactive Editor Download Button (Priority: P3)

A user on the live editor page (`editor.html`) wants to click an "Export PNG" button in the top toolbar to automatically download `fretboard.png`.

**Why this priority**: Enhances usability in the interactive configurator.

**Independent Test**: Open `editor.html`, click "Export PNG", and verify a browser file download is triggered with filename `fretboard.png`.

**Acceptance Scenarios**:

1. **Given** `editor.html` open in a browser, **When** the "Export PNG" button is clicked, **Then** `fretboard.downloadPNG('fretboard.png')` is executed and triggers a browser download.

---

### Edge Cases

- What happens if the SVG contains external CSS font references? The Canvas rasterizer uses browser default fonts or embedded CSS gracefully.
- What happens if `quality` parameter is passed? Supported for lossy formats or ignored gracefully for standard PNG blobs.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide `toPNGBlob(options?: PNGExportOptions): Promise<Blob>` on `Fretboard` instances and as a standalone utility `exportSvgToPngBlob()`.
- **FR-002**: System MUST provide `toPNGDataURL(options?: PNGExportOptions): Promise<string>` on `Fretboard` instances.
- **FR-003**: System MUST provide `downloadPNG(filename?: string, options?: PNGExportOptions): Promise<void>` on `Fretboard` instances to trigger a browser file download.
- **FR-004**: System MUST support `scale?: number` in `PNGExportOptions` defaulting to `2` (2x scaling for Retina clarity).
- **FR-005**: System MUST maintain zero runtime external dependencies by utilizing native HTML5 `<canvas>`, `URL.createObjectURL`, and `Image`.
- **FR-006**: System MUST update `editor.html` toolbar to add an "Export PNG" button.

### Key Entities

- **PNGExportOptions**: Configuration object containing `scale?: number` (default 2) and `quality?: number` (default 1.0).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Developers can export any Fretboard diagram to PNG Data URL or Blob using zero external dependencies.
- **SC-002**: Editor users can download crisp 2x PNG diagrams with a single click in `editor.html`.
- **SC-003**: Code passes `npm run build`, `npm run lint`, and `npm test`.

## Assumptions

- HTML5 `<canvas>` and `Image` object URLs are available in target browser environments.
- Node/jsdom testing environment handles mock canvas or throws expected DOM environment error gracefully.
