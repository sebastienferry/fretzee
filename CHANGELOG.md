# Changelog

All notable changes to the **Fretly** project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Next]

### Added
- GitHub CI/CD build, test, and release workflows (`.github/workflows/ci.yml`, `.github/workflows/release.yml`).
- GitHub Pages static website with landing page, live interactive configurator, and showcase demos (`.github/workflows/deploy-pages.yml`, `index.html`, `editor.html`, `demo.html`).
- Slash command skills for automated PR creation (`/create-pr`) and issue orchestration (`/pick-issue`).
- Implement Project Board stage-gate workflow skills and label progression (`#27`).

### Fixed
- Add inlays as small grey dots on standard fretboard positions (#11).

### Fixed
- Fixed fingering circles not aligned with string visual center on thicker strings (#13).
- Fixed UMD global reference (`window.fretly` / `window.Fretly`) in `index.html` and `demo.html` (#9).
- Restricted GitHub Pages deployment workflow trigger to `main` branch (#7).
