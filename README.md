# Fretly

[![CI](https://github.com/sebastienferry/fretly/actions/workflows/ci.yml/badge.svg)](https://github.com/sebastienferry/fretly/actions/workflows/ci.yml)

A zero-dependency TypeScript library for rendering customizable guitar and bass fretboards as SVG graphics. Supports both horizontal and vertical orientations, position markers, inlays, and fingering diagrams.

## 🚀 Interactive Live Editor

Try the direct live code editor online or open [`editor.html`](file:///Users/sferry/Sources/fretly/editor.html) locally to edit JSON/JS configurations and preview SVG diagrams in real-time!

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

### Fingering Options

| Parameter | Type | Default | Description |
| --- | --- | --- | --- |
| `string` | `number` | Required | 1-based string index (1 = top string / high E) |
| `fret` | `number` | Required | Fret number (0 = open string, 1..N = fretted position) |
| `text` | `string` | `""` | Optional label displayed inside marker circle |
| `color` | `string` | `'#000000'` | Optional HTML/CSS background fill color |
| `textColor` | `string` | `'#ffffff'` | Optional HTML/CSS font color for text |

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
