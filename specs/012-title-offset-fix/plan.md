# Implementation Plan: Title Offset Fix

**Branch**: `feat/034-title-offset-fix` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

## Summary

Fix title offset calculation in `SvgRenderer` (`src/renderers/svg.ts`) to dynamically account for top string fingerings (`string: 1`) and open/muted nut markers (`fret: 0`, `fret: -1`), ensuring title text never collides with markers in either horizontal or vertical orientation.

## Technical Context

**File to modify**: `src/renderers/svg.ts`  
**Testing**: Jest + jsdom (`tests/unit/DiagramTitle.test.ts`)  

## Project Structure

```text
src/
└── renderers/
    └── svg.ts            # Adjust viewBox top offset and title rendering position math

tests/
└── unit/
    └── DiagramTitle.test.ts # Unit tests verifying title offset with string 1 fingerings
```
