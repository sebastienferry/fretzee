# Quickstart Guide: Maintaining Fretly CI/CD

## Overview

This guide explains how maintainers interact with the GitHub CI/CD setup for **Fretly**.

---

## 1. Local Pre-flight Verification

Before creating a Pull Request or Tagging a release, run local verification commands:

```bash
# Install dependencies cleanly
npm ci

# Run lint checks
npm run lint

# Build ESM & UMD bundles
npm run build

# Run unit tests
npm test
```

---

## 2. Triggering Continuous Integration (CI)

- CI runs automatically whenever you open or update a **Pull Request** targeting `main`, or push directly to `main`.
- You can view the status directly in the GitHub PR interface under "Checks".

---

## 3. Creating an Official Release

To publish a new version release:

1. Update the `version` field in `package.json` (e.g. `"version": "1.1.0"`).
2. Commit the change:
   ```bash
   git commit -am "chore: bump version to 1.1.0"
   ```
3. Tag the commit and push the tag to GitHub:
   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```
4. GitHub Actions will automatically:
   - Run full build and test checks.
   - Generate a GitHub Release with changelog notes.
   - Publish the updated package to NPM (if `NPM_TOKEN` secret is configured).

---

## 4. Configuring Repository Secrets

To enable automated NPM publishing:

1. Generate an Automation Access Token on [npmjs.com](https://www.npmjs.com/).
2. Navigate to your GitHub repository: `Settings -> Secrets and variables -> Actions`.
3. Add a new repository secret named `NPM_TOKEN` containing your token.
