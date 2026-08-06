# Quickstart: Configurable Starting Fret

**Date**: 2026-08-06  
**Feature**: [spec.md](spec.md)

## Basic Usage

```typescript
import { Fretboard } from 'fretly';

// Render a 4-fret diagram starting at the 5th fret
const fretboard = new Fretboard({
  fretCount: 4,
  startFret: 5
});

const svg = fretboard.render();
document.getElementById('container').appendChild(svg);
```

## With Fingerings (Chord Diagram)

```typescript
// A barre chord at the 5th position
const fretboard = new Fretboard({
  fretCount: 4,
  startFret: 5,
  fingerings: [
    { string: 1, fret: 5, text: '1' },  // Barre
    { string: 2, fret: 5, text: '1' },
    { string: 3, fret: 6, text: '2' },
    { string: 4, fret: 7, text: '3' },
    { string: 5, fret: 7, text: '4' },
    { string: 6, fret: 5, text: '1' }
  ]
});

const svg = fretboard.render();
```

## Vertical Orientation

```typescript
const fretboard = new Fretboard({
  fretCount: 4,
  startFret: 7,
  orientation: 'vertical'
});
```

## Default Behavior (Backward Compatible)

```typescript
// These are all equivalent — same as current behavior:
const fb1 = new Fretboard();                   // startFret defaults to 1
const fb2 = new Fretboard({ startFret: 1 });   // explicit startFret: 1
const fb3 = new Fretboard({ startFret: 0 });   // 0 is treated as 1
```
