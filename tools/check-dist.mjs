// Sanity checks on the production build, run locally and in CI after
// `npm run build`. Fails if anything would break on GitHub Pages.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const dist = 'dist';
const errors = [];
const fail = (msg) => errors.push(msg);

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html is missing — run `npm run build` first.');
  process.exit(1);
}

const html = readFileSync(join(dist, 'index.html'), 'utf8');

// 1. No root-relative URLs: they break on a project site (/<repo>/).
for (const m of html.matchAll(/(?:src|href|content)="([^"]+)"/g)) {
  const url = m[1];
  if (url.startsWith('/') && !url.startsWith('//')) fail(`root-relative URL in index.html: ${url}`);
}

// 2. Every local file index.html references must exist.
for (const m of html.matchAll(/(?:src|href)="\.\/([^"#?]+)"/g)) {
  if (!existsSync(join(dist, m[1]))) fail(`index.html references missing file: ${m[1]}`);
}

// 3. Required static assets are present.
for (const f of [
  'favicon.png',
  'apple-touch-icon.png',
  'og-image.png',
  'resume/Kunjal_Mahajan_Resume.pdf',
  'art/creative-dance-640.webp',
  'art/creative-art-640.webp',
  'art/creative-fashion-640.webp',
  'art/creative-modeling-640.webp',
]) {
  if (!existsSync(join(dist, f))) fail(`missing asset: ${f}`);
}

// 4. CSS must not point fonts/images at the domain root.
const walk = (dir) =>
  readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
for (const file of walk(dist).filter((f) => f.endsWith('.css'))) {
  const css = readFileSync(file, 'utf8');
  for (const m of css.matchAll(/url\((['"]?)(\/[^)'"]+)\1\)/g)) fail(`root-relative url() in ${file}: ${m[2]}`);
}

// 5. Nothing secret-looking slipped into the bundle.
for (const file of walk(dist).filter((f) => /\.(js|html|css)$/.test(f))) {
  const text = readFileSync(file, 'utf8');
  if (/(api[_-]?key|secret[_-]?key|access[_-]?token|client[_-]?secret)\s*[:=]\s*["'`][A-Za-z0-9_\-]{12,}|BEGIN [A-Z ]*PRIVATE KEY|sk-[A-Za-z0-9]{20,}/i.test(text)) fail(`possible secret in ${file}`);
}

if (errors.length) {
  console.error(`✗ ${errors.length} problem(s):\n  ` + errors.join('\n  '));
  process.exit(1);
}
console.log(`✓ dist looks good for GitHub Pages (${walk(dist).length} files, relative paths only).`);
