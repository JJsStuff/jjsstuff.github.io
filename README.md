# JJ's Stuff

Website für **JJ's Stuff** – Indie-Software-Entwicklung.  
Statische Seite mit Eleventy (11ty), gehostet auf [GitHub Pages](https://jjsstuff.github.io).

## Setup

```bash
npm install
npm run build
```

## Architektur

- **Eleventy (11ty)** – Statischer Site-Generator, baut alle Seiten aus Nunjucks-Templates
- **i18n** – Build-Time-Übersetzung via `_data/i18n/{de,en}.json`. Templates greifen auf `i18n[lang].section.key` zu.
- **Client JS** – `assets/js/main.js` (committed, kein Build-Schritt). Zuständig für Navigation, Scroll-Animationen, Parallax.
- **App-Daten** – Zentral in `_data/apps.json`. Datenschutzseiten (DE+EN) werden per Eleventy-Pagination generiert.
- **CI/CD** – GitHub Actions baut die Seite und deployed `_site/` auf GitHub Pages.

## Projektstruktur

| Pfad | Beschreibung |
|------|-------------|
| `pages/` | Eleventy-Seitenvorlagen (Nunjucks) |
| `_includes/` | Layouts (`base.njk`, `home.njk`) und Partials |
| `_includes/partials/privacy/` | Gemeinsame Datenschutz-Abschnitte |
| `_data/` | Globale Daten (`site.json`, `apps.json`, `i18n/`) |
| `_site/` | Build-Output (gitignored) |
| `css/` | Stylesheets |
| `assets/` | Fonts, App-Icons und Client-JS (`assets/js/`) |
| `.github/workflows/` | GitHub Actions Deployment |

## Scripts

| Befehl | Beschreibung |
|--------|-------------|
| `npm run build` | Eleventy-Build → `_site/` |
| `npm run serve` | Eleventy Dev-Server mit Live-Reload |

## Konventionen

- **App-Icons** (`assets/icons/`) sollten als PNG in **512×512 px** vorliegen. Größere Bilder vor dem Commit skalieren:
  ```bash
  magick assets/icons/ICON.png -resize 512x512 -strip assets/icons/ICON.png
  ```
- **Neue App hinzufügen:** Eintrag in `_data/apps.json` ergänzen + App-Card in `_includes/home.njk` + Locale-Keys in `_data/i18n/*.json`
- **Datenschutztexte:** Zentral in `_data/apps.json` (pro App, bilingual). Gemeinsame Abschnitte in `_includes/partials/privacy/`

## Lizenz

© 2026 JJ's Stuff. Alle Rechte vorbehalten.
