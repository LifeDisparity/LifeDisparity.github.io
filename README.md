# FQE Website

This project uses React + TypeScript + Vite and is configured to deploy automatically to GitHub Pages.

## GitHub Pages Setup

1. Open repository settings on GitHub.
2. Go to `Settings > Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.
4. Push to `main`. The workflow `.github/workflows/deploy-pages.yml` will build and deploy the site.

For this repository (`LifeDisparity.github.io`), the site is served from the root domain:

- `https://lifedisparity.github.io/`

## Local Development

- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build production files: `npm run build`
- Preview build locally: `npm run preview`
