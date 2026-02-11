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

## Scripts

| Befehl | Beschreibung |
|--------|-------------|
| `npm run build` | TypeScript kompilieren + EN-Seite generieren |
| `npm run watch` | TypeScript im Watch-Modus |
| `npm run generate-en` | Nur EN-Seite neu generieren |

## Lizenz

© 2026 JJ's Stuff. Alle Rechte vorbehalten.
