# Data Model & Workflow Entities: GitHub Pages Configuration Website

## Entities Overview

This document specifies the structural entities, web app components, and deployment workflow for the GitHub Pages static website.

---

### 1. Web Configurator State (`editor.html`)

Represents the interactive state managed in the browser.

- **Attributes**:
  - `stringCount`: `number` (1..12)
  - `fretCount`: `number` (1..24)
  - `orientation`: `'horizontal' | 'vertical'`
  - `fingerings`: `Array<{ string: number, fret: number, text?: string, color?: string, textColor?: string }>`
  - `inlays`: `Array<{ fret: number, position?: string }>`
- **Export Formats**:
  - `SVG String`: Clean `<svg>...</svg>` XML string for download or clipboard copy.
  - `TypeScript / JS Snippet`: Code required to instantiate `new Fretboard(...)`.

---

### 2. GitHub Pages Deployment Workflow (`.github/workflows/deploy-pages.yml`)

Represents the deployment workflow triggered on default branch pushes.

- **Name**: `Deploy GitHub Pages`
- **Triggers**:
  - `push` (branches: `[ main ]`)
  - `workflow_dispatch` (manual run)
- **Permissions**:
  - `contents: read`
  - `pages: write`
  - `id-token: write`
- **Jobs**:
  - **`deploy`**:
    - **Runner**: `ubuntu-latest`
    - **Steps**:
      1. Checkout repository (`actions/checkout@v4`)
      2. Setup Node.js 24.x (`actions/setup-node@v4`)
      3. Install dependencies & Build library (`npm ci`, `npm run build`)
      4. Assemble static site directory (`editor.html`, `demo.html`, `dist/`)
      5. Upload artifact to GitHub Pages (`actions/upload-pages-artifact@v3`)
      6. Deploy to GitHub Pages (`actions/deploy-pages@v4`)
