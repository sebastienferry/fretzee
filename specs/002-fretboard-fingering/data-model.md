# Data Model: Fretboard Fingering

## Entities & Interfaces

### 1. Fingering

Represents a single fingering marker on the guitar or bass fretboard.

```typescript
/**
 * Configuration options for an individual fingering marker.
 */
export interface Fingering {
  /**
   * 1-indexed string position (1 = top string in current layout convention).
   */
  string: number;

  /**
   * Fret position (0 = open string position, 1..N = fretted position).
   */
  fret: number;

  /**
   * Optional text content displayed inside the fingering circle marker.
   * Typical values: finger numbers ("1", "2", "3", "4", "T") or note names ("C", "G#").
   */
  text?: string;

  /**
   * Optional background HTML color for the fingering circle marker.
   * Accepts hex codes, named colors, rgb/rgba strings.
   * @default 'black'
   */
  color?: string;

  /**
   * Optional font HTML color for the text inside the circle marker.
   * Accepts hex codes, named colors, rgb/rgba strings.
   * @default 'white'
   */
  textColor?: string;
}
```

### 2. Updated FretboardOptions

Extends `FretboardOptions` to include an optional list of fingerings:

```typescript
export interface FretboardOptions {
  // Existing options...
  fretCount?: number;
  stringCount?: number;
  orientation?: 'horizontal' | 'vertical';
  stringSpacing?: number;
  stringThickness?: number;
  fretSpacing?: number;
  fretThickness?: number;
  inlayPositions?: number[];
  showInlays?: boolean;

  /**
   * List of fingering markers to render on the fretboard.
   */
  fingerings?: Fingering[];
}
```

## Validation Rules

1. **String Index**: MUST be an integer $\ge 1$ and $\le$ `stringCount`. Out-of-bound string indices are silently omitted from SVG rendering.
2. **Fret Index**: MUST be an integer $\ge 0$ and $\le$ `fretCount`. Out-of-bound fret indices are silently omitted from SVG rendering.
3. **Color Defaults**:
   - `color`: If omitted or empty string, defaults to `'black'`.
   - `textColor`: If omitted or empty string, defaults to `'white'`.
4. **Circle Radius Calculation**:
   - `radius = Math.min(stringSpacing, fretSpacing) * 0.4`
   - Guarantees zero overlapping between adjacent circles on the same fret.
