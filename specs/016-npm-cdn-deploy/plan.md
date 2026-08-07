# Implementation Plan: CI/CD Deploy to Public NPM CDNs

**Branch**: `feat/044-npm-cdn-deploy` | **Date**: 2026-08-07 | **Spec**: [spec.md](spec.md)

## Summary

Configure GitHub Actions `.github/workflows/release.yml` for automated NPM publishing on tag creation (`v*`) and add CDN script import documentation (`unpkg` and `jsDelivr`) to `README.md`.

## Technical Context

**Files to modify**:
- `.github/workflows/release.yml` — Add npm publish step using `NPM_TOKEN` secret
- `README.md` — Add CDN installation section (`unpkg` & `jsDelivr`)
