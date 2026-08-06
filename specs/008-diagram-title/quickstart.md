# Quickstart: Diagram Title

**Feature**: 008-diagram-title  
**Date**: 2026-08-06

## Basic Usage

### Add a centered title (default)

```typescript
const fretboard = new Fretboard({
  title: 'Am',
  fretCount: 5,
  orientation: 'vertical'
});

const svg = fretboard.render();
document.getElementById('container').appendChild(svg);
```

### Add a left-aligned title

```typescript
const fretboard = new Fretboard({
  title: 'C Major Scale',
  titleAlignment: 'left',
  fretCount: 12,
  orientation: 'horizontal'
});

const svg = fretboard.render();
document.getElementById('container').appendChild(svg);
```

### No title (backward compatible)

```typescript
// These are all equivalent - no title rendered:
const fb1 = new Fretboard();
const fb2 = new Fretboard({ title: undefined });
const fb3 = new Fretboard({ title: '' });
```

## Styling the Title via CSS

The title element has the CSS class `fretly-title`, allowing external customization:

```css
/* Custom title styling */
.fretly-title {
  fill: #333;
  font-size: 20px;
  font-family: 'Georgia', serif;
  font-weight: normal;
}
```

## API Reference

### New Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | `string` | `undefined` | Title text displayed above the fretboard |
| `titleAlignment` | `'center' \| 'left'` | `'center'` | Horizontal alignment of the title |
