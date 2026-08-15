# Changelog

All notable changes to the **Fretzee** core library will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
