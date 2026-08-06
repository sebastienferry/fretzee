# Data Model: Diagram Title

**Feature**: 008-diagram-title  
**Date**: 2026-08-06

## Entities

### FretboardOptions (modified)

Two new optional fields added to the existing `FretboardOptions` interface:

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `title` | `string \| undefined` | `undefined` | Optional title text to display above the fretboard |
| `titleAlignment` | `'center' \| 'left'` | `'center'` | Horizontal alignment of the title text |

### Constants (new)

| Constant | Value | Description |
|----------|-------|-------------|
| `DEFAULT_TITLE_ALIGNMENT` | `'center'` | Default title alignment |
| `TITLE_FONT_SIZE` | `16` | Font size for the title in pixels |
| `TITLE_PADDING` | `12` | Gap between title bottom and fretboard top in pixels |
| `CSS_CLASSES.title` | `'fretly-title'` | CSS class for the title text element |

### Rendering Behavior

```
When title is defined and non-empty:
  1. Calculate title height = TITLE_FONT_SIZE + TITLE_PADDING
  2. Shift viewBox origin upward by title height
  3. Increase total SVG height by title height
  4. Render <text> element at y = -(TITLE_PADDING) relative to fretboard origin
  5. Set x position based on alignment:
     - 'center': x = fretboard width / 2, text-anchor = 'middle'
     - 'left': x = 0, text-anchor = 'start'

When title is undefined or empty string:
  No changes to viewBox, height, or rendering (backward compatible)
```

## State Transitions

N/A — Title is a static configuration option with no state changes.

## Validation Rules

- `title`: No validation needed — any string is valid, empty string treated as no title
- `titleAlignment`: Must be `'center'` or `'left'` if provided; validated in `validateOptions()`
