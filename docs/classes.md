# Class Reference Documentation

## `Fretboard`

Main class for managing and rendering fretboard diagrams.

### Constructor
```typescript
new Fretboard(options?: Partial<FretboardOptions>)
```

### FretboardOptions
- `title?: string` - Optional title text rendered above the fretboard.
- `titleAlignment?: 'center' | 'left'` - Alignment of title text (default: `'center'`).
- `startFret?: number` - Starting fret position (0-24).
- `fretCount?: number` - Number of frets (4-16).
- `stringCount?: number` - Number of strings (4-8).
- `orientation?: 'horizontal' | 'vertical'` - Fretboard orientation.

### Methods & Getters
- `render(): SVGSVGElement` - Returns rendered SVG element.
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
- `fret: number` - Fret position (0 = open).
- `text: string` - Display text.
- `color: string` - HTML fill color for marker circle.
- `textColor: string` - HTML font color for text.
