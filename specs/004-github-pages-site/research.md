# Research: GitHub Pages Configuration Website

## Overview

This research evaluates technical options for building and deploying a static configuration website for **Fretly** to GitHub Pages.

## Decision Log

### 1. GitHub Pages Deployment Method

- **Decision**: Use GitHub Actions with official `actions/upload-pages-artifact@v3` and `actions/deploy-pages@v4`.
- **Rationale**:
  - Direct workflow deployment without creating or managing a separate `gh-pages` branch.
  - Native integration with GitHub repository settings (`Settings > Pages > Source: GitHub Actions`).
  - Supports automated deployment on every commit pushed to default/release branches.
- **Alternatives Considered**:
  - *Legacy `gh-pages` branch deployment*: Requires pushing built HTML/JS assets to a separate branch. Extra git history noise and branch maintenance.

### 2. Web Application Bundling & Structure

- **Decision**: Bundle `editor.html` and `demo.html` along with compiled ESM/UMD library bundles from `/dist` into a `site/` or root static output folder during deployment.
- **Rationale**:
  - `editor.html` provides a live interactive code editor and visual preview.
  - `demo.html` provides visual examples of horizontal/vertical fretboards and chord diagrams.
  - Serving both static pages directly gives users instant access to live customization and comprehensive visual documentation.
- **Alternatives Considered**:
  - *Building a heavy React/Next.js app*: Unnecessary overhead for a lightweight zero-dependency SVG library. Vanilla JS/HTML with Fretly library bundle is faster (<100KB) and loads instantly.

### 3. Path & Base URL Compatibility

- **Decision**: Use relative paths (`./dist/index.umd.js`, `./index.css`) for all script and style imports.
- **Rationale**:
  - Ensures seamless compatibility whether hosted on `https://<user>.github.io/<repo>/` subpath or tested locally via `file://` or local dev server.
- **Alternatives Considered**:
  - *Hardcoded root-absolute paths (`/dist/index.js`)*: Breaks when hosted on GitHub Pages subpaths.
