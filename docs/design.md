# Architecture & Design Documentation

## Architecture Overview

Fretly is designed as a zero-dependency SVG renderer for guitar and bass fretboard diagrams.

```
+-------------------------------------------------------+
|                       Fretboard                       |
|   (Main entry point, handles configuration & state)   |
+--------------------------+----------------------------+
                           |
            +--------------+--------------+
            |                             |
            v                             v
+-----------------------+     +------------------------+
|      SvgRenderer      |     |  Fingering / String /  |
|  (Renders SVG DOM)    |     |  Fret / Inlay Entities |
+-----------------------+     +------------------------+
            |
            v
  SVG Output Element
```

## Fingering Marker Sizing & Layout Design

- **Positioning**: Fret position 0 centers the fingering marker outside the nut. Fretted positions (1..N) center the marker between fret wire $f-1$ and fret wire $f$.
- **Non-Overlapping Sizing**: Radius is dynamically scaled: $r = \min(\text{stringSpacing} \times 0.4, \text{fretSpacing} \times 0.4)$, guaranteeing that circles on adjacent strings leave a minimum gap of $20\%$ string spacing.

## Configurable Starting Fret & Position Mapping

- **Window Mapping**: Setting `startFret` displays a visible window of `fretCount` frets starting at `startFret` (range 0–24, 0 treated as 1).
- **Absolute Coordinate Mapping**: Fingerings specify absolute fret numbers. Relative visual position on screen is computed as $\text{relativeFret} = \text{fret} - \text{startFret} + 1$. Fingerings outside the visible range $\text{startFret} \dots \text{startFret} + \text{fretCount} - 1$ are omitted. Open strings (`fret: 0`) are only shown when `startFret \le 1`.
- **Absolute Inlay Labels**: Inlay numbers show actual physical fret numbers (e.g. 5, 7) rather than relative positions.
- **Starting Fret Indicator**: When `startFret > 1`, a starting fret indicator text element (`.fretly-start-fret`) is rendered at the top/left of the first fret line.

## Diagram Title Rendering

- **Positioning**: The title string is rendered as an SVG `<text>` element with CSS class `.fretly-title` above the top edge of the fretboard diagram.
- **Alignment**: Supports `'center'` (`text-anchor: middle`, positioned at fretboard midpoint) and `'left'` (`text-anchor: start`, positioned at 0).
- **Dynamic ViewBox Adjustment**: When a title is specified (`title` non-empty string), `viewBoxY` is reduced by `TITLE_FONT_SIZE + TITLE_PADDING` (16 + 8 = 24px) and SVG total height is expanded accordingly, preserving diagram geometry without clipping text.
