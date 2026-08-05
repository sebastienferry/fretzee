# Feature Specification: GitHub Pages Configuration & Demo Website

**Feature Branch**: `004-github-pages-site`  
**Created**: 2026-08-05  
**Status**: Draft  
**Input**: User description: "let's create a static page configuration website for fretly on github pages. Is this possible ?"

## Clarifications

### Session 2026-08-05

- Q: Should editor.html and demo.html both be present on the site, and what design system should be used? → A: Both `editor.html` (interactive code configurator) and `demo.html` (visual showcase) MUST be included on the published site, sharing the unified dark-mode design system established in `editor.html`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Live Online Fretboard Configurator Website (Priority: P1)

As a guitar player, music student, or web developer, I want to access an interactive web application hosted on GitHub Pages, so that I can configure fretboard options (strings, frets, orientation, fingerings, colors) and view/copy the generated SVG graphics directly in my browser without installing anything locally.

**Why this priority**: Core value proposition enabling immediate visual exploration and interactive configuration for Fretly users.

**Independent Test**: Navigate to the published GitHub Pages URL (e.g., `https://<user>.github.io/fretly/`), adjust string count, orientation, or add fingering markers, and verify the rendered SVG updates instantly.

**Acceptance Scenarios**:

1. **Given** a user opens the public GitHub Pages URL, **When** the page loads, **Then** an interactive fretboard configuration interface is presented with live SVG preview.
2. **Given** a user modifies configuration options (such as string count, orientation, or fingering note labels), **When** inputs change, **Then** the SVG graphic renders the new layout in real-time.
3. **Given** a user completes a fretboard design, **When** they click "Copy SVG" or "Export Code", **Then** the raw SVG code or JS initialization snippet is copied to their clipboard.

---

### User Story 2 - Automated Deployment Workflow on Code Changes (Priority: P1)

As a maintainer, I want every update merged into the primary branch to automatically build and deploy the updated static website to GitHub Pages, so that the published configurator always matches the latest library features.

**Why this priority**: Eliminates manual build and deployment overhead while keeping public documentation in sync with code updates.

**Independent Test**: Push a commit to the default branch and verify the GitHub Pages deployment action triggers, compiles site bundle, and updates the live site.

**Acceptance Scenarios**:

1. **Given** a commit is merged to the default branch, **When** GitHub Actions executes the deployment pipeline, **Then** the static site is compiled and published to GitHub Pages.
2. **Given** a pull request or feature branch, **When** code changes occur, **Then** deployment to production GitHub Pages is skipped.

---

### Edge Cases

- How does the site behave on mobile/touch screens? (Ensure responsive layout that adapts to narrow screens).
- What happens if invalid configuration JSON or values are entered? (Provide user-friendly error messages rather than blank previews).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST provide an interactive, browser-based static web page allowing users to customize fretboard parameters (strings, frets, orientation, colors, fingerings).
- **FR-002**: System MUST render real-time SVG previews as configuration parameters are modified by the user.
- **FR-003**: System MUST support exporting the generated SVG graphic (copy SVG code or download SVG file) and JS initialization code.
- **FR-004**: System MUST include automated GitHub Actions deployment workflow (`deploy-pages.yml`) publishing the static website to GitHub Pages on pushes to the primary branch.
- **FR-005**: System MUST serve all web assets (HTML, CSS, JS bundle) with relative asset paths compatible with GitHub Pages subpath routing (`/fretly/`).
- **FR-006**: System MUST publish `editor.html` (interactive code editor) and `demo.html` (visual showcases) alongside `index.html`.
- **FR-007**: System MUST apply a unified dark-mode design system (Inter & JetBrains Mono typography, dark panel background `#0f172a`, glassmorphism headers) consistently across `index.html`, `editor.html`, and `demo.html`.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Live website loads interactive configurator in under 2 seconds on standard internet connections.
- **SC-002**: 100% of configuration changes update the SVG visual preview in under 100 milliseconds.
- **SC-003**: Automated GitHub Pages workflow completes deployment in under 3 minutes from push to default branch.

## Assumptions

- Site is hosted on free GitHub Pages infrastructure using standard `actions/deploy-pages@v4`.
- All web assets (HTML, CSS, JavaScript) are static files that require zero server-side backend execution.
