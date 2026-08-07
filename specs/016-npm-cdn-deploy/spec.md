# Feature Specification: CI/CD Deploy to Public NPM CDNs

**Feature Branch**: `feat/044-npm-cdn-deploy`  
**Created**: 2026-08-07  
**Status**: Draft  
**Input**: User description & issue #44: "CI/CD deploy to Public npm CDNs"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Automated NPM Publishing & Public CDN Integration (Priority: P1)

Developers want `fretzee` automatically published to the official NPM Registry upon tagged GitHub releases (`v*`) so that it becomes instantly available worldwide via public CDNs (unpkg, jsDelivr).

**Why this priority**: Enables effortless browser integration via `<script>` tag CDN links without manual publishing steps.

**Independent Test**: Verify GitHub Actions release workflow publishes package on release tag creation and check CDN documentation snippets.

**Acceptance Scenarios**:

1. **Given** a version release tag (e.g., `v1.0.0`), **When** pushed to GitHub, **Then** GitHub Actions workflow runs `npm publish` with NPM automation token.
2. **Given** published package on NPM, **When** requested via unpkg / jsDelivr, **Then** `dist/index.umd.js` is served globally.
3. **Given** `README.md` and documentation, **When** viewed, **Then** official unpkg and jsDelivr CDN script tag examples are clearly documented.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST configure `.github/workflows/release.yml` to build and publish the core `fretzee` package to NPM (`registry.npmjs.org`) on GitHub tag releases.
- **FR-002**: System MUST include only core build artifacts (`dist/index.umd.js`, `dist/index.esm.js`, `dist/index.d.ts`) in published package payload.
- **FR-003**: System MUST document unpkg (`https://unpkg.com/fretzee@latest/dist/index.umd.js`) and jsDelivr (`https://cdn.jsdelivr.net/npm/fretzee@latest/dist/index.umd.js`) script imports in `README.md`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: GitHub Actions release workflow builds and executes `npm publish` seamlessly.
- **SC-002**: CDN installation snippets documented in `README.md`.
