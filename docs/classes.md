# Class Reference Documentation

## `Fretboard`

Main class for managing and rendering fretboard diagrams.

### Constructor
```typescript
new Fretboard(options?: Partial<FretboardOptions>)
```

### Methods
- `render(): SVGSVGElement` - Returns rendered SVG element.
- `getFingerings(): Fingering[]` - Returns array of fingering markers.
- `getOptions(): Required<FretboardOptions>` - Returns complete configuration.

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
