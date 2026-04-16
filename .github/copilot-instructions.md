# Copilot Instructions – JJ's Stuff Website

## Architecture

Static GitHub Pages site built with **Eleventy (11ty)** and **Nunjucks** templates. German is the source language; English pages are generated at build time.

- **Static Site Generator:** Eleventy 3.x – all HTML is generated from Nunjucks templates in `pages/` using layouts in `_includes/`.
- **i18n:** Build-time translation via `_data/i18n/{de,en}.json` (Eleventy auto-loads from data directory). Templates access translations as `i18n[lang].section.key`. No runtime i18n.
- **CSS:** Single file `css/style.css`, uses **BEM naming** (`block__element--modifier`).
- **Client JS:** `assets/js/main.js` is committed directly (no TypeScript compilation step). Handles nav, scroll animations, and parallax.
- **App data:** Centralized in `_data/apps.json` – per-app privacy pages (DE + EN) are generated via Eleventy pagination.

## Build & Workflow

```bash
npm run build    # Eleventy build → _site/
npm run serve    # Eleventy dev server with live reload
```

After editing templates, locale files, or app data, run `npm run build` to regenerate `_site/`. The CI pipeline (`deploy.yml`) runs the build automatically on push.

## Deployment

GitHub Actions builds the site and deploys `_site/` to GitHub Pages. Every push to `main` triggers a build+deploy.

## Key Conventions

- **Adding/changing UI text:** Update the corresponding key in both `_data/i18n/de.json` and `_data/i18n/en.json`. Templates reference translations via `{{ i18n[lang].section.key }}`.
- **Adding a new app:** Add an entry to `_data/apps.json` (name, slug, playStoreId, type, privacy texts in DE+EN). Eleventy auto-generates the privacy pages. Then add the app card to `_includes/home.njk` and locale keys for title, description, tags, and links to both `_data/i18n/*.json`.
- **App icons:** Place PNGs in `assets/icons/` at **512×512 px**. Resize before commit: `magick assets/icons/ICON.png -resize 512x512 -strip assets/icons/ICON.png`
- **Privacy pages:** Generated from `_data/apps.json` via templates in `pages/apps/`. Shared sections live in `_includes/partials/privacy/`. These are **legally binding documents** — never omit, summarize, or alter any information.
- **Scroll animations:** Add class `fade-in` to any element that should animate on scroll; `assets/js/main.js` handles the IntersectionObserver.
- **Legal pages (Impressum, Datenschutz):** German-only. Templates in `pages/impressum.njk` and `pages/datenschutz.njk`. EN gets a general privacy page at `pages/en/privacy.njk`.

## Path Handling

Each page template defines a `rootPath` variable (e.g. `""` for root pages, `"../"` for `/en/`, `"../../"` for nested pages). Asset references in templates use `{{ rootPath }}css/style.css` etc. For locale-specific links (e.g. privacy hrefs), the locale JSON already includes the correct path prefix — the template prepends `rootPath` on top.

**Important:** EN locale privacy hrefs must include the `en/` prefix (e.g. `en/apps/bleigiessen/privacy.html`) because `rootPath` (`../`) already navigates up from `/en/`.

## Project Structure

| Path | Role |
|------|------|
| `pages/` | Eleventy page templates (Nunjucks) |
| `pages/index.njk` | DE homepage |
| `pages/en/index.njk` | EN homepage |
| `pages/apps/datenschutz.njk` | DE app privacy (paginated from `apps.json`) |
| `pages/apps/privacy.njk` | EN app privacy (paginated from `apps.json`) |
| `_includes/` | Layouts (`base.njk`, `home.njk`, `legal.njk`) and partials |
| `_includes/partials/privacy/` | Shared privacy policy sections |
| `_data/apps.json` | App definitions (names, privacy texts, Play Store IDs) |
| `_data/site.json` | Global site data (owner, address, email) |
| `_data/i18n/de.json`, `_data/i18n/en.json` | UI translation strings |
| `css/style.css` | All styles (BEM, CSS custom properties) |
| `assets/js/main.js` | Client-side JS (**committed**, no build step) |
| `assets/` | Fonts (`assets/fonts/`) and app icons (`assets/icons/`) |
| `_site/` | Build output (**gitignored**) |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD pipeline |
