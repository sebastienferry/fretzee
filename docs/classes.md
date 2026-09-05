# Class Reference Documentation

## `Fretboard`

Main class for managing and rendering fretboard diagrams.

### Constructor
```typescript
new Fretboard(options?: Partial<FretboardOptions>)
```

- `title?: string` - Optional title text rendered above the fretboard.
- `subtitle?: string` - Optional subtitle text rendered below title and above the fretboard.
- `titleAlignment?: 'center' | 'left'` - Alignment of title and subtitle text (default: `'center'`).
- `titleOffsetY?: number` - Optional vertical offset in pixels to adjust title position.
- `subtitleOffsetY?: number` - Optional vertical offset in pixels to adjust subtitle position.
- `startFret?: number` - Starting fret position (0-24).
- `fretCount?: number` - Number of frets (3-24).
- `stringCount?: number` - Number of strings (4-8).
- `orientation?: 'horizontal' | 'vertical'` - Fretboard orientation.
- `tuning?: string[]` - Optional tuning note labels (lowest string to highest string).

### Methods & Getters
- `render(): SVGSVGElement` - Returns rendered SVG element.
- `toPNGBlob(options?: PNGExportOptions): Promise<Blob>` - Exports SVG diagram as a PNG Blob.
- `toPNGDataURL(options?: PNGExportOptions): Promise<string>` - Exports SVG diagram as a PNG Data URL.
- `downloadPNG(filename?: string, options?: PNGExportOptions): Promise<void>` - Triggers a browser file download of the PNG.
- `getFingerings(): Fingering[]` - Returns array of fingering markers.
- `getOptions(): Required<FretboardOptions>` - Returns complete configuration.
- `startFret: number` - Returns configured starting fret number.
- `fretCount: number` - Returns configured fret count.
- `stringCount: number` - Returns configured string count.

## `Fingering`

Domain entity representing a fingering marker.

### Constructor
```typescript
new Fingering(options: FingeringInterface)
```

### Properties
- `string: number` - 1-based string number.
- `fret: number` - Fret position (-1 = muted string 'X', 0 = open string, 1..N = fretted position).
- `text: string` - Display text (defaults to 'X' for `fret: -1`).
- `color: string` - HTML fill color for marker circle.
- `textColor: string` - HTML font color for text.

## `Zone`

Interface defining highlighted regions (triads, scale boxes, hulls, paths, and curly braces).

### Properties
- `type?: 'box' | 'hull' | 'path' | 'brace'` - Shape type (default: `'box'`).
- `startString?: number` - Starting string (1-based) for `'box'` shape.
- `endString?: number` - Ending string (1-based) for `'box'` shape.
- `startFret?: number` - Starting fret for `'box'` or `'brace'`.
- `endFret?: number` - Ending fret for `'box'` or `'brace'`.
- `points?: Array<{ string: number; fret: number }>` - Sequence of points for `'hull'` or `'path'`.
- `fillColor?: string` - Background fill color.
- `strokeColor?: string` - Outline stroke color.
- `strokeWidth?: number` - Outline stroke width.
- `strokeStyle?: 'solid' | 'dashed' | 'dotted'` - Preset stroke line style.
- `strokeDashArray?: string` - Custom SVG stroke-dasharray (e.g. `'4 4'`).
- `borderRadius?: number` - Corner radius for `'box'` rectangles.
- `label?: string` - Text label/title (supports `\n` linebreaks).
- `labelFontSize?: number` - Font size in pixels for the label (default: 11).
- `labelFontWeight?: string` - Font weight for the label (default: `'bold'`).
- `labelOffsetX?: number` - Horizontal offset in pixels for label position.
- `labelOffsetY?: number` - Vertical offset in pixels for label position.
- `offsetY?: number` - Vertical offset in pixels for the entire zone or brace.
- `position?: 'top' | 'bottom'` - Placement side for curly braces.

### Zone Examples

#### Box Zone (Bounding Rect)
```typescript
const boxZone: Zone = {
  type: 'box',
  startString: 1,
  endString: 3,
  startFret: 2,
  endFret: 3,
  label: 'D Form Triad',
  fillColor: 'rgba(56, 189, 248, 0.15)',
  strokeColor: '#38bdf8',
  strokeStyle: 'dashed',
  labelOffsetY: -4
};
```

#### Hull Zone (Convex Polygon / Triangle)
```typescript
const hullZone: Zone = {
  type: 'hull',
  points: [
    { string: 5, fret: 7 },
    { string: 4, fret: 7 },
    { string: 3, fret: 6 }
  ],
  label: 'Triad Triangle',
  fillColor: 'rgba(168, 85, 247, 0.15)',
  strokeColor: '#a855f7',
  strokeWidth: 2,
  labelOffsetX: 10,
  labelOffsetY: -6
};
```

#### Path Zone (Connected Sequence)
```typescript
const pathZone: Zone = {
  type: 'path',
  points: [
    { string: 6, fret: 5 },
    { string: 5, fret: 7 },
    { string: 4, fret: 7 }
  ],
  label: 'Sweeping Sequence',
  strokeColor: '#f59e0b',
  strokeWidth: 3,
  strokeStyle: 'dotted',
  labelOffsetY: 8
};
```

#### Brace Zone (Fret Range Accolade)
```typescript
const braceZone: Zone = {
  type: 'brace',
  startFret: 5,
  endFret: 8,
  position: 'top',
  label: 'Position 1 Range',
  strokeColor: '#22c55e',
  labelOffsetY: -2
};
```


