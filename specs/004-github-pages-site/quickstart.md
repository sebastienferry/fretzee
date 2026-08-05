# Quickstart Guide: Testing & Deploying GitHub Pages Site

## Local Development & Preview

To preview the interactive configurator locally:

```bash
# 1. Build distribution bundles
npm run build

# 2. Start local static server
npx serve .
```

Open `http://localhost:3000/editor.html` or `http://localhost:3000/demo.html` in your browser.

---

## Enabling GitHub Pages in Repository Settings

1. Open your GitHub Repository: `https://github.com/sebastienferry/fretly`.
2. Navigate to **Settings -> Pages**.
3. Under **Build and deployment -> Source**, select **GitHub Actions**.

---

## Automatic Deployment

Once configured, pushing to the primary branch automatically runs `.github/workflows/deploy-pages.yml` and publishes your live site to `https://sebastienferry.github.io/fretly/`.
