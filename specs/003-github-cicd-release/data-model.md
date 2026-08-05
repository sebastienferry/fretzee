# Data Model & Workflow Entities: GitHub CI/CD Pipeline

## Entities Overview

This document specifies the structural entities, configurations, and environment secrets supporting the GitHub CI/CD automation.

---

### 1. CI Workflow Specification (`.github/workflows/ci.yml`)

Represents the Continuous Integration quality gate triggered on code changes.

- **Name**: `CI`
- **Triggers**:
  - `push` (branches: `[ main ]`)
  - `pull_request` (branches: `[ main ]`)
- **Jobs**:
  - **`build-and-test`**:
    - **Runner**: `ubuntu-latest`
    - **Steps**:
      1. Checkout repository (`actions/checkout@v4`)
      2. Setup Node.js 20.x with npm cache (`actions/setup-node@v4`)
      3. Install dependencies (`npm ci`)
      4. Verify code formatting / linting (`npm run lint`)
      5. Compile package bundles (`npm run build`)
      6. Run unit test suite (`npm test`)

---

### 2. Release Workflow Specification (`.github/workflows/release.yml`)

Represents the Release automation pipeline triggered when a maintainer pushes a version tag.

- **Name**: `Release`
- **Triggers**:
  - `push` (tags: `[ 'v*.*.*', 'v*' ]`)
- **Jobs**:
  - **`publish-release`**:
    - **Runner**: `ubuntu-latest`
    - **Permissions**: `contents: write`, `id-token: write`
    - **Steps**:
      1. Checkout repository (`actions/checkout@v4`)
      2. Setup Node.js 20.x with npm registry context (`actions/setup-node@v4`)
      3. Install dependencies (`npm ci`)
      4. Verify linting & run tests (`npm run lint`, `npm test`)
      5. Compile production build (`npm run build`)
      6. Create GitHub Release with auto-generated notes (`softprops/action-gh-release@v2`)
      7. Publish package to NPM (`npm publish --access public`) *[conditional on `NPM_TOKEN` presence]*

---

### 3. Environment & Security Entities

- **`GITHUB_TOKEN`**: Provided automatically by GitHub Actions runtime. Used by `action-gh-release` to create and attach assets to GitHub Releases.
- **`NPM_TOKEN`**: Repository Secret set by maintainer in GitHub settings (`Settings > Secrets and variables > Actions`). Used to authenticate package publishing to registry.npmjs.org.
