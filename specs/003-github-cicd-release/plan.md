# Implementation Plan: GitHub CI/CD Build, Test & Release Pipeline

**Branch**: `003-github-cicd-release` | **Date**: 2026-08-05 | **Spec**: [spec.md](file:///Users/sferry/Sources/fretly/specs/003-github-cicd-release/spec.md)
**Input**: Feature specification from `/specs/003-github-cicd-release/spec.md`

## Summary

Add a minimal, automated GitHub Actions CI/CD configuration to **Fretly**. The setup consists of two workflow files: `.github/workflows/ci.yml` (validates code formatting, linting, building, and test suite on push/PRs) and `.github/workflows/release.yml` (builds distribution assets, creates a GitHub Release, and publishes package to NPM when a version tag like `v*` is pushed).

## Technical Context

**Language/Version**: TypeScript 5.x / Node.js 24.x  
**Primary Dependencies**: None (Zero runtime dependencies). Tooling: Rollup, Jest, JSDOM, ESLint  
**Storage**: N/A  
**Testing**: Jest + JSDOM (`npm test`)  
**Target Platform**: GitHub Actions (`ubuntu-latest`)  
**Project Type**: Open-source browser/DOM SVG rendering library  
**Performance Goals**: CI run execution under 2 minutes; Release workflow execution under 5 minutes  
**Constraints**: Zero runtime dependencies; zero third-party action risks for credentials  
**Scale/Scope**: 2 GitHub Workflow YAML files (`ci.yml`, `release.yml`)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Zero Runtime Dependencies**: Workflow configuration is infrastructure-only; library runtime remains 0 dependencies.
- [x] **DRY / Script Reuse**: Reuses existing `package.json` scripts (`npm run lint`, `npm run build`, `npm test`).
- [x] **Strict Typing & Build Integrity**: CI enforces `npm run build` which runs `tsc` and generates `.d.ts` definitions.
- [x] **Dual Orientation & DOM Support**: CI runs full Jest suite with JSDOM environment.

## Project Structure

### Documentation (this feature)

```text
specs/003-github-cicd-release/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit-tasks command)
```

### Source Code (repository root)

```text
.github/
└── workflows/
    ├── ci.yml           # CI Workflow: lint, build, test on push & PRs
    └── release.yml      # Release Workflow: build, GitHub release & NPM publish on tag push
```

**Structure Decision**: Standard GitHub Actions workflow layout inside `.github/workflows/`.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| *None* | *All requirements follow standard GitHub Actions patterns* | *N/A* |
