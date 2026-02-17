/**
 * Build script: generates en/index.html from index.html
 * Transforms the German source into the English version by adjusting
 * the <head> section and fixing relative paths for the /en/ subdirectory.
 */

import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { dirname, join } from 'path';

const ROOT = join(dirname(new URL(import.meta.url).pathname));
const SOURCE = join(ROOT, '..', 'index.html');
const TARGET = join(ROOT, '..', 'en', 'index.html');

// Read source
let html = readFileSync(SOURCE, 'utf-8');

// 1. Change lang attribute
html = html.replace('<html lang="de">', '<html lang="en">');

// 2. Update <title>
html = html.replace(
    /<title>.*?<\/title>/,
    '<title>JJ\'s Stuff – Software Development</title>'
);

// 3. Update meta description (using 's' flag to match across newlines)
html = html.replace(
    /(<meta name="description"\s+content=").*?(")/s,
    '$1JJ\'s Stuff – Indie software development. Apps that are fun and just work.$2'
);

// 4. Update OG tags
html = html.replace(
    /(<meta property="og:title" content=").*?(")/,
    '$1JJ\'s Stuff – Software Development$2'
);
html = html.replace(
    /(<meta property="og:description" content=").*?(")/,
    '$1Indie software development. Apps that are fun and just work.$2'
);
html = html.replace(
    /(<meta property="og:url" content=").*?(")/,
    '$1https://jjsstuff.github.io/en/$2'
);
html = html.replace(
    /(<meta property="og:locale" content=").*?(")/,
    '$1en_US$2'
);

// 5. Fix relative paths for /en/ subdirectory
// Only match standalone src/href attributes (preceded by whitespace)
// to avoid corrupting data-i18n-href and similar data attributes.
html = html.replace(
    /(\s(?:src|href)=")((?!https?:\/\/|\/\/|#|data:|mailto:|\.\.\/)[^"]+)/g,
    '$1../$2'
);

// 6. Fix absolute URLs that need /en/ path
html = html.replace(
    /(<link rel="canonical" href=")https:\/\/jjsstuff\.github\.io\/(")/,
    '$1https://jjsstuff.github.io/en/$2'
);

// 7. Update skip-link text
html = html.replace('Zum Inhalt springen', 'Skip to content');

// 8. Update hardcoded aria-label fallback
html = html.replace('aria-label="Menü"', 'aria-label="Menu"');

// 9. Insert "DO NOT EDIT" warning after <!DOCTYPE html>
const warning = `<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  AUTO-GENERATED FILE – DO NOT EDIT DIRECTLY!                ║
  ║                                                              ║
  ║  This file is generated from /index.html via:                ║
  ║    npm run generate-en                                       ║
  ║                                                              ║
  ║  Edit /index.html instead, then run: npm run build           ║
  ╚══════════════════════════════════════════════════════════════╝
-->`;
html = html.replace('<!DOCTYPE html>', `<!DOCTYPE html>\n${warning}`);

// Ensure target directory exists
mkdirSync(dirname(TARGET), { recursive: true });

// Write
writeFileSync(TARGET, html, 'utf-8');
console.log('✓ Generated en/index.html from index.html');
