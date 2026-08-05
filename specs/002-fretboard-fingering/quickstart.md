# Quickstart: Fretboard Fingering

## Basic Usage

To add fingering markers to a fretboard diagram using Fretly:

```typescript
import { Fretboard } from 'fretly';

// Create a C Major chord diagram
const C_MAJOR_CHORD = [
  { string: 1, fret: 0 },              // High E open
  { string: 2, fret: 1, text: '1' },    // B string 1st fret (Index)
  { string: 3, fret: 0 },              // G string open
  { string: 4, fret: 2, text: '2' },    // D string 2nd fret (Middle)
  { string: 5, fret: 3, text: '3' },    // A string 3rd fret (Ring)
];

const fretboard = new Fretboard({
  stringCount: 6,
  fretCount: 4,
  orientation: 'vertical',
  fingerings: C_MAJOR_CHORD
});

document.body.appendChild(fretboard.render());
```

## Custom Colors

Highlight root notes or scale degrees with custom HTML colors:

```typescript
const fretboard = new Fretboard({
  stringCount: 6,
  fretCount: 5,
  fingerings: [
    { string: 6, fret: 3, text: 'G', color: '#e74c3c', textColor: '#ffffff' }, // Root note in red
    { string: 5, fret: 2, text: 'B', color: '#3498db', textColor: '#ffffff' }, // 3rd in blue
    { string: 4, fret: 0, text: 'D', color: '#2ecc71', textColor: '#000000' }, // 5th in green with black text
  ]
});
```
