# Research: GitHub CI/CD Build, Test & Release Pipeline

## Overview

This research evaluates options for adding automated Continuous Integration (CI) and Tag-based Release Automation (CD) for the **Fretly** TypeScript SVG library using GitHub Actions.

## Decision Log

### 1. Runner Environment & Node.js Versioning Strategy

- **Decision**: Use `ubuntu-latest` runner with `actions/setup-node@v4`, setting Node version `20.x` (LTS) and `cache: 'npm'`.
- **Rationale**: 
  - Fretly is a zero-runtime-dependency browser/DOM library compiled using standard Rollup and TypeScript.
  - Node 20 LTS provides reliable performance and supports all required tooling (Rollup, TypeScript, Jest, JSDOM, ESLint).
  - Built-in `cache: 'npm'` speeds up setup on sequential workflow runs.
- **Alternatives Considered**:
  - *Multi-Node Matrix (18, 20, 22)*: Overkill for a minimal CI/CD setup for a lightweight browser-targeted library.

### 2. GitHub Release Automation

- **Decision**: Use `softprops/action-gh-release@v2` triggered by `v*` tag pushes.
- **Rationale**:
  - Declarative, widely adopted action that builds GitHub Releases with auto-generated release notes.
  - Supports attaching pre-compiled release artifacts or tarballs if desired.
- **Alternatives Considered**:
  - *Manual `gh release create` via CLI script*: Requires writing inline shell scripts in the workflow. `softprops/action-gh-release` is cleaner and handles release note generation automatically.

### 3. NPM Publishing Mechanics

- **Decision**: Use standard `actions/setup-node@v4` with `registry-url: 'https://registry.npmjs.org'` and execute `npm publish --access public` using the `NPM_TOKEN` repository secret.
- **Rationale**:
  - Uses native NPM CLI directly supported by `setup-node`.
  - Avoids third-party action dependencies for sensitive credential operations.
- **Alternatives Considered**:
  - *Third-party NPM publish actions*: Introduces unnecessary security surfaces when `npm publish` is a single command.

### 4. Workflow File Separation

- **Decision**: Create two distinct workflow files:
  1. `.github/workflows/ci.yml` for pull requests and `main` branch pushes.
  2. `.github/workflows/release.yml` for `v*` tag pushes.
- **Rationale**:
  - Clean separation of concerns. CI runs frequently and fast; Release runs only on official version tags.
