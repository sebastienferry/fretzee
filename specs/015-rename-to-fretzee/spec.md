# Feature Specification: Rename Library from Fretly to Fretzee

**Feature Branch**: `feat/042-rename-to-fretzee`  
**Created**: 2026-08-07  
**Status**: Draft  
**Input**: User description & issue #42: "Remove all reference to Fretly and replace it by Fretzee"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Full Library & Web Brand Rebranding (Priority: P1)

Developers, users, and web visitors should see `Fretzee` consistently across all package descriptors, UMD global exports, SVG element class names, and web application pages (`index.html`, `demo.html`, `editor.html`, `studio.html`).

**Why this priority**: Brand alignment to prevent naming collision with existing online services.

**Independent Test**: Load `demo.html` / `studio.html` and verify `window.Fretzee` is present, SVG classes use `fretzee-*` prefix, and web brand text displays `Fretzee`.

**Acceptance Scenarios**:

1. **Given** `package.json`, **When** inspected, **Then** `name` is `"fretzee"`.
2. **Given** UMD bundles (`dist/index.umd.js`, `dist/music.umd.js`), **When** loaded in a browser, **Then** global variables `window.Fretzee` and `window.FretzeeMusic` are exported.
3. **Given** rendered SVG elements, **When** inspected, **Then** all CSS classes use `fretzee-*` prefix (e.g. `fretzee-title`, `fretzee-fingering`).
4. **Given** web application pages (`index.html`, `demo.html`, `editor.html`, `studio.html`), **When** viewed, **Then** all visible headers, titles, and branding references display `Fretzee`.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST rename package name in `package.json` to `fretzee`.
- **FR-002**: System MUST update UMD global exports in `rollup.config.js` to `Fretzee` and `FretzeeMusic`.
- **FR-003**: System MUST update all SVG element class names in `src/fretboard/constants.ts` and `src/renderers/svg.ts` from `fretly-*` to `fretzee-*`.
- **FR-004**: System MUST update all web pages (`index.html`, `demo.html`, `editor.html`, `studio.html`), `README.md`, `CHANGELOG.md`, and documentation files to reference `Fretzee`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of references in source code, docs, and HTML files updated from Fretly to Fretzee.
- **SC-002**: `npm run build`, `npm run lint`, and `npm test` pass cleanly.
