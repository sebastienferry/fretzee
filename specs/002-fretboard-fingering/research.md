# Research & Technical Decisions: Fretboard Fingering

## Overview

This document captures the design decisions and technical research for adding fingering marker support to the Fretly fretboard renderer library.

## Research Decisions

### 1. Fingering Data Model & Coordinates

- **Decision**: Define a clean interface `Fingering` that accepts:
  - `string`: 1-based string number (1..N).
  - `fret`: Fret number (0 for open string, 1..N for fretted positions).
  - `text` (optional): Character string rendered inside the marker (e.g., finger number `"1"`, `"2"`, `"T"` or note name).
  - `color` (optional): HTML CSS fill color for the circle background (default: `'black'`).
  - `textColor` (optional): HTML CSS fill color for the text inside the circle (default: `'white'`).

- **Rationale**: 1-based string and fret coordinates align with musician expectations and existing Fretly public API conventions. Optional color properties allow individual marker customization while retaining sensible defaults.

- **Alternatives Considered**:
  - 0-based string indexing: Rejected to maintain consistency with standard music notation and user expectations (where string 1 is the high E string).

### 2. Marker Geometry & Non-Overlapping Sizing

- **Decision**: Calculate the circle radius based dynamically on the `stringSpacing` parameter:
  $$\text{radius} = \min\left(\frac{\text{stringSpacing}}{2} - \text{margin}, \frac{\text{fretSpacing}}{2} - \text{margin}\right)$$
  Using a default scaling factor $r = \text{stringSpacing} \times 0.4$, ensuring that adjacent fingering markers on the same fret leave a distinct gap of at least $0.2 \times \text{stringSpacing}$ between each circle.

- **Rationale**: String spacing is the constraining dimension for adjacent fingerings on the same fret. Sizing the radius to $40\%$ of string spacing guarantees $0.8 \times \text{stringSpacing}$ total diameter, leaving a clear $20\%$ gap so circles on adjacent strings never overlap or touch.

- **Alternatives Considered**:
  - Static pixel radius (e.g. fixed 10px): Rejected because on narrow string spacings (e.g., 8-string guitars or compact diagrams) fixed circles would overlap.

### 3. SVG DOM Hierarchy & Class Names

- **Decision**: Append a `<g class="fretly-fingerings">` group element inside the main SVG container after frets and strings, containing individual fingering groups:
  ```xml
  <g class="fretly-fingerings">
    <g class="fretly-fingering fretly-fingering-s1-f2">
      <circle cx="x" cy="y" r="r" fill="black" class="fretly-fingering-circle" />
      <text x="x" y="y" fill="white" text-anchor="middle" dominant-baseline="central" class="fretly-fingering-text">1</text>
    </g>
  </g>
  ```

- **Rationale**: Structured SVG groups with semantic BEM-like class names ensure styling flexibility via external CSS and full compliance with Fretly's SVG class conventions.
