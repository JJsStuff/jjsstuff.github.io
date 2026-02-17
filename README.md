# JJ's Stuff

Website für **JJ's Stuff** – Indie-Software-Entwicklung.  
Statisches HTML/CSS/TypeScript, gehostet auf [GitHub Pages](https://jjsstuff.github.io).

## Setup

```bash
npm install
npm run build
```

## Architektur

- **Kein Framework** – bewusst statisch (HTML/CSS/TypeScript)
- **i18n** – Texte in `locales/de.json` und `locales/en.json`, HTML nutzt `data-i18n`-Attribute
- **Englische Version** – wird automatisch aus `index.html` generiert:
  - `scripts/generate-en.ts` liest `index.html`, setzt `lang="en"`, passt Pfade an (z.B. `css/` → `../css/`) und schreibt das Ergebnis nach `en/index.html`
  - Aufruf: `npm run generate-en` (läuft auch bei `npm run build` mit)
- **TypeScript** – Quelle in `src/main.ts`, kompiliert nach `dist/main.js`
- **`dist/` wird committed** – kein CI nötig, GitHub Pages served direkt

## Projektstruktur

| Pfad | Beschreibung |
|------|-------------|
| `index.html` | Hauptseite (Deutsch) |
| `en/index.html` | Englische Version (auto-generiert) |
| `datenschutz.html` | Datenschutzerklärung der Website |
| `impressum.html` | Impressum |
| `apps/bleigiessen/` | Datenschutzerklärung der Bleigießen App |
| `apps/launcher-for-good/` | Datenschutzerklärung der Launcher for Good App |
| `locales/` | Übersetzungsdateien (DE/EN) |
| `src/` | TypeScript-Quellcode |
| `css/` | Stylesheets |
| `assets/` | Fonts und App-Icons |

## Scripts

| Befehl | Beschreibung |
|--------|-------------|
| `npm run build` | TypeScript kompilieren + EN-Seite generieren |
| `npm run watch` | TypeScript im Watch-Modus |
| `npm run generate-en` | Nur EN-Seite neu generieren |

## Konventionen

- **App-Icons** (`assets/icons/`) sollten als PNG in **512×512 px** vorliegen. Größere Bilder vor dem Commit skalieren:
  ```bash
  magick assets/icons/ICON.png -resize 512x512 -strip assets/icons/ICON.png
  ```

## Lizenz

© 2026 JJ's Stuff. Alle Rechte vorbehalten.
