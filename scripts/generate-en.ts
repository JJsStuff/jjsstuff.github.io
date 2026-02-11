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

// 3. Update meta description
html = html.replace(
    /(<meta name="description" content=").*?(")/,
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

// 5. Fix relative paths for /en/ subdirectory
// Assets that are referenced from root need ../ prefix
html = html.replace('href="favicon.svg"', 'href="../favicon.svg"');
html = html.replace('href="css/style.css"', 'href="../css/style.css"');
html = html.replace('src="dist/main.js"', 'src="../dist/main.js"');
html = html.replace('href="impressum.html"', 'href="../impressum.html"');
html = html.replace('href="datenschutz.html"', 'href="../datenschutz.html"');

// 6. Insert "DO NOT EDIT" warning after <!DOCTYPE html>
const warning = `<!--
  ╔══════════════════════════════════════════════════════════════╗
  ║  ⚠️  AUTO-GENERATED FILE – DO NOT EDIT DIRECTLY!            ║
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
