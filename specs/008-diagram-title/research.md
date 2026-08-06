# Research: Diagram Title

**Feature**: 008-diagram-title  
**Date**: 2026-08-06

## Research Tasks

### 1. SVG Text Element Best Practices

**Decision**: Use standard SVG `<text>` element with `text-anchor` attribute for alignment.

**Rationale**: 
- Consistent with existing inlay text rendering in `svg.ts`
- `text-anchor: middle` for center alignment, `text-anchor: start` for left alignment
- `dominant-baseline: auto` with manual y-positioning gives predictable cross-browser results
- Font sizing via `font-size` attribute matches existing patterns

**Alternatives considered**:
- `<foreignObject>` with HTML: More flexible but breaks SVG-only portability and adds complexity
- Multi-line `<tspan>`: Not needed — spec states single-line only

### 2. ViewBox Adjustment Strategy

**Decision**: Add title height to the viewBox when a title is present by shifting the viewBox Y origin upward and increasing total height.

**Rationale**:
- Same approach used for inlays (bottom space) and open string fingerings (left/top space)
- Consistent with existing pattern in `SvgRenderer.render()` where viewBox is dynamically adjusted
- Title height = font size + padding gap from fretboard

**Alternatives considered**:
- Fixed viewBox with title inside existing space: Would shrink the fretboard, breaking existing layouts
- CSS-based title outside SVG: Would require HTML wrapper, breaking SVG-only output

### 3. Title Positioning in Both Orientations

**Decision**: Title is always above the fretboard, centered or left-aligned relative to the fretboard's visual width, in both orientations.

**Rationale**:
- In horizontal: fretboard width runs along X axis → title centered/left-aligned along X, positioned above (negative Y relative to fretboard top)
- In vertical: fretboard width runs along X axis (strings) → title still centered/left-aligned along X, positioned above
- Both orientations share the same title positioning logic (X alignment + Y above fretboard)

**Alternatives considered**:
- Different title positions per orientation (e.g., left side in vertical): Inconsistent UX, issue specifies "always at the top"

### 4. CSS Class Naming

**Decision**: Use `fretly-title` as the CSS class, added to `CSS_CLASSES` constant.

**Rationale**:
- Follows existing naming convention: `fretly-frets`, `fretly-strings`, `fretly-inlays`, `fretly-fingerings`
- Single class allows external styling (font, color, size overrides)

### 5. Default Font and Size

**Decision**: Use `sans-serif` font family, `16px` font size, `bold` weight.

**Rationale**:
- Slightly larger than inlay labels (14px) since titles are primary headings
- Bold weight distinguishes title from other text elements
- Sans-serif matches existing inlay font-family
- Black fill (#000000) for consistency
