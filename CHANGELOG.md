# Changelog

All notable changes to the **Fretzee** core library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Next]

## [0.3.6] - 2026-09-05

### Changed
- Expand allowed `fretCount` range from `4..16` to `3..24` frets (#56).

## [0.3.5] - 2026-09-05

### Added
- Add diagram `subtitle?: string` and independent `subtitleOffsetY?: number` options (#55).
- Add CSS class `.fretzee-subtitle` with dedicated styling (12px, `#666666`, normal weight).
- Support multi-line diagram subtitles using `\n` linebreaks and `<tspan>` positioning.

## [0.3.4] - 2026-08-22

### Added
- Add `debugZones?: boolean` option to render transparent visual debug overlays for Fret 0 and Tuning clearance zones.
- Add `reserveNutClearance?: boolean` option to control headstock clearance for open and muted string markers.

### Fixed
- Statically reserve top string clearance in horizontal mode to eliminate SVG jumping and resizing when adding or removing fingerings on string 1.
- Stabilize vertical title positioning when open string fingerings are placed.

## [0.3.3] - 2026-08-22

### Added
- Add `labelOffsetX` and `labelOffsetY` (with `titleOffsetX` and `titleOffsetY` aliases) to `Zone` interface to customize zone label positioning on `box`, `hull`, `path`, and `brace` shapes (FRE-73).

### Fixed
- Fix viewBox clipping on the right and bottom boundaries for `box`, `hull`, and `path` zones.

### Changed
- Refine default `hull` stroke width to `2px`.

## [0.3.2] - 2026-08-17

### Added
- Add `titleOffsetY` option to shift diagram title vertically.
- Add `position` (`'top'` | `'bottom'`) option for zone and curly brace placement (top/bottom in horizontal, right/left in vertical).
- Add `offsetY` option to slide/stack zones and braces vertically.
- Add `labelFontWeight` option and multi-line support (`\n` linebreaks) for zone labels.
- Add white text stroke outline on zone labels for high-contrast legibility.

## [0.3.1] - 2026-08-17

### Fixed
- Fix horizontal orientation curly brace accolade label positioning and min/max coordinates calculation.

## [0.3.0] - 2026-08-17

### Added
- Add instructional fretboard zones (`zones?: Zone[]`) with support for `box`, `hull`, `path`, and `brace` (accolade) shape types (#51).
- Add advanced zone styling options: `strokeWidth`, `strokeStyle` (`solid`, `dashed`, `dotted`), and `labelFontSize` (#51).
- Add string color customization (`stringColor?: string | string[]`) supporting a single global color or per-string array (#50, #51).

### Build
- Add distribution bundle minification using `@rollup/plugin-terser` reducing bundle size to ~29 KB (#51).

## [0.2.1] - 2026-08-15

### Fixed
- Fix open string (`fret: 0`) and muted string (`fret: -1`) markers being hidden when `startFret > 1` (#47).
- Increase font size for open (`O`) and muted (`X`) nut markers (`radius * 1.5`) for better legibility (#47).
- Increase spacing offset for open and muted nut markers (`0.50 * fretSpacing`) to avoid overlap with nut line (#47).

## [0.2.0] - 2026-08-15

### Added
- Add support for unplayed / muted open strings using `fret: -1` rendered with an 'X' marker (#19).
- Add PNG export capabilities (`toPNGBlob()`, `toPNGDataURL()`, `downloadPNG()`) (#30).
- Add optional tuning note labels (`tuning?: string[]`) for horizontal and vertical orientations (#24).
- Rename library and branding from Fretly to **Fretzee** (`package.json`, UMD global `Fretzee`, `fretzee-*` CSS classes) (#42).
- Add npm OIDC Trusted Publishing with `--provenance` to `.github/workflows/release.yml` (#44).
- Add inlays as small grey dots on standard fretboard positions (#11).

### Changed / Refactored
- Remove decoupled music catalog module (`src/music`) to focus core library strictly on SVG/PNG fretboard rendering.

### Fixed
- Fixed title overlap when fingerings are placed on string 1 or open nut markers in horizontal and vertical modes (#34).
- Fixed fingering circles not aligned with string visual center on thicker strings (#13).
