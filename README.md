# Fretly

[![CI](https://github.com/sebastienferry/fretly/actions/workflows/ci.yml/badge.svg)](https://github.com/sebastienferry/fretly/actions/workflows/ci.yml)
[![GitHub Pages](https://github.com/sebastienferry/fretly/actions/workflows/deploy-pages.yml/badge.svg)](https://sebastienferry.github.io/fretly/)

A zero-dependency TypeScript library for rendering customizable guitar and bass fretboards as SVG graphics. Supports both horizontal and vertical orientations, position markers, inlays, and fingering diagrams.

## 🚀 Interactive Live Editor & Web Site

Try the live online configurator on [GitHub Pages](https://sebastienferry.github.io/fretly/) or open [`editor.html`](editor.html) locally to edit JSON/JS configurations and preview SVG diagrams in real-time!

## Installation

```bash
npm install fretly
```

## Basic Usage

```typescript
import { Fretboard } from 'fretly';

// Create a standard 6-string guitar fretboard with 12 frets
const fretboard = new Fretboard({
  stringCount: 6,
  fretCount: 12,
  orientation: 'horizontal'
});

const svg = fretboard.render();
document.body.appendChild(svg);
```

## Fingering Diagrams

Pass an array of fingering position objects to display finger numbers, note names, and custom colors on the fretboard:

```typescript
import { Fretboard } from 'fretly';

// C Major Chord Diagram
const fretboard = new Fretboard({
  stringCount: 6,
  fretCount: 4,
  orientation: 'vertical',
  fingerings: [
    { string: 1, fret: 0, text: 'O' },              // Open High E
    { string: 2, fret: 1, text: '1' },              // B string 1st fret
    { string: 3, fret: 0, text: 'O' },              // Open G
    { string: 4, fret: 2, text: '2' },              // D string 2nd fret
    { string: 5, fret: 3, text: '3', color: '#e74c3c', textColor: '#ffffff' } // Root note in red
  ]
});

document.body.appendChild(fretboard.render());
```

### Configurable Starting Fret

Render chord diagrams at higher neck positions using the `startFret` option (1-based fret number, range 0–24):

```typescript
import { Fretboard } from 'fretly';

// A Minor Barre Chord at 5th Fret
const fretboard = new Fretboard({
  stringCount: 6,
  fretCount: 4,
  startFret: 5,
  orientation: 'vertical',
  fingerings: [
    { string: 1, fret: 5, text: '1' },
    { string: 2, fret: 5, text: '1' },
    { string: 3, fret: 5, text: '1' },
    { string: 4, fret: 7, text: '3' },
    { string: 5, fret: 7, text: '2', color: '#e74c3c' },
    { string: 6, fret: 5, text: '1' }
  ]
});

document.body.appendChild(fretboard.render());
```

### Configuration Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `undefined` | Optional title text header displayed above diagram |
| `titleAlignment` | `'center' \| 'left'` | `'center'` | Title alignment relative to fretboard width |
| `fretCount` | `number` | `12` | Number of frets to display (4–16) |
| `stringCount` | `number` | `6` | Number of strings (4–8) |
| `startFret` | `number` | `1` | Starting fret number to display (0–24, 0 treated as 1) |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Layout direction |
| `showInlays` | `boolean` | `true` | Display fret position numbers/inlays |
| `inlayPositions` | `number[]` | `[3, 5, 7, 9, 12, ...]` | Fret positions for inlays |
| `tuning` | `string[]` | `undefined` | Optional tuning note labels (lowest string to highest string, e.g. `['E', 'A', 'D', 'G', 'B', 'E']`) |

### Fingering Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `string` | `number` | Required | 1-based string index (1 = top string / high E) |
| `fret` | `number` | Required | Fret number (-1 = muted string 'X', 0 = open string, 1..N = fretted position) |
| `text` | `string` | `""` (or `'X'` if `fret: -1`) | Optional label displayed inside marker circle |
| `color` | `string` | `'#000000'` | Optional HTML/CSS background fill color |
| `textColor` | `string` | `'#ffffff'` | Optional HTML/CSS font color for text |

### PNG Export

Export fretboard diagrams as high-resolution PNG images natively using HTML5 Canvas with zero runtime dependencies:

```typescript
// Export to PNG Blob
const pngBlob = await fretboard.toPNGBlob({ scale: 2 });

// Export to PNG Data URL
const dataUrl = await fretboard.toPNGDataURL({ scale: 2 });

// Trigger direct browser file download
await fretboard.downloadPNG('fretboard.png', { scale: 2 });
```

## Development & Releases

```bash
# Install dependencies
npm ci

# Run build, lint, and test suite
npm run build
npm run lint
npm test
```

Releases are automatically published to GitHub Releases and NPM whenever a maintainer pushes a version tag (e.g. `v1.0.0`).

## License

MIT
