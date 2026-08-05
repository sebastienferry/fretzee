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
