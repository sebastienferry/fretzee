# Implementation Plan: Tuning Labels

**Branch**: `feat/024-tuning-labels` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

## Summary

Add optional `tuning?: string[]` parameter to `FretboardOptions` (ordered 6th to 1st string). Render tuning text labels in `SvgRenderer` (`src/renderers/svg.ts`) left of nut (horizontal) or above nut (vertical). Extend `viewBox` padding dynamically.

## Technical Context

**Files to modify**:
- `src/fretboard/types.ts` — add `tuning?: string[]` to `FretboardOptions`
- `src/fretboard/constants.ts` — add `CSS_CLASSES.tuning` and `CSS_CLASSES.tuningLabel`
- `src/renderers/svg.ts` — render tuning labels and adjust `viewBox` margins
- `tests/unit/TuningLabels.test.ts` — unit tests

## Project Structure

```text
src/
├── fretboard/
│   ├── types.ts          # Add tuning?: string[] to FretboardOptions
│   └── constants.ts      # Add tuning CSS classes
└── renderers/
    └── svg.ts            # Render tuning labels and adjust viewBox math

tests/
└── unit/
    └── TuningLabels.test.ts # Unit tests for tuning labels
```
