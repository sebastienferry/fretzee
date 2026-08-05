# Public Interface Contract: Fretboard Fingering

## API Export Surface

The following types and option fields are exported as part of Fretly's public surface API:

```typescript
// Exported from 'src/index.ts' and 'src/fretboard/types.ts'

export interface Fingering {
  string: number;
  fret: number;
  text?: string;
  color?: string;
  textColor?: string;
}

export interface FretboardOptions {
  // ... existing fields ...
  fingerings?: Fingering[];
}
```

## Fretboard Usage Example

```typescript
import { Fretboard } from 'fretly';

const fretboard = new Fretboard({
  stringCount: 6,
  fretCount: 5,
  orientation: 'horizontal',
  fingerings: [
    { string: 1, fret: 0, text: 'O' }, // Open string
    { string: 2, fret: 1, text: '1', color: 'red', textColor: 'white' },
    { string: 3, fret: 2, text: '2' }, // Default black background, white text
    { string: 4, fret: 3, text: '3', color: '#3498db' }
  ]
});

const svgElement = fretboard.render();
```

## Rendered SVG Structure Contract

```xml
<svg class="fretly-fretboard" ...>
  <!-- strings -->
  <!-- frets -->
  <!-- inlays -->
  <g class="fretly-fingerings">
    <g class="fretly-fingering fretly-fingering-s2-f1">
      <circle class="fretly-fingering-circle" cx="45" cy="20" r="8" fill="red" />
      <text class="fretly-fingering-text" x="45" y="20" fill="white" text-anchor="middle" dominant-baseline="central" font-size="12" font-family="sans-serif">1</text>
    </g>
  </g>
</svg>
```
