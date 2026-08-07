# Tasks: CI/CD Deploy to Public NPM CDNs

**Input**: Design documents from `specs/016-npm-cdn-deploy/`

## Format: `[ID] [P?] [Story] Description`

---

## Phase 1: Implementation & Verification

- [ ] T001 [P] [US1] Update `.github/workflows/release.yml` with NPM publishing step using `NODE_AUTH_TOKEN` secret
- [ ] T002 [P] [US1] Add unpkg and jsDelivr CDN script import snippets to `README.md`
- [ ] T003 Run automated verification (`npm run build`, `npm run lint`, `npm test`)
