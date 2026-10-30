const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const root = path.resolve(__dirname, '..');

test('static portfolio shell is local, semantic, and accessible', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<main[^>]+id="main-content"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<caption>/);
  assert.doesNotMatch(html, /<(?:script|link|img)[^>]+(?:src|href)="https?:/i);
});

test('design system exposes high-contrast operational tokens', () => {
  const css = fs.readFileSync(path.join(root, 'styles.css'), 'utf8');

  for (const token of ['--background: #020617', '--surface: #0e172a', '--text: #f8fafc', '--muted-text: #a8b3c5', '--accent: #2dd4bf', '--danger: #fb7185']) {
    assert.ok(css.includes(token), `missing ${token}`);
  }
  assert.match(css, /:focus-visible/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test('demo has no network or browser persistence integration', () => {
  const script = fs.readFileSync(path.join(root, 'app.js'), 'utf8');

  assert.doesNotMatch(script, /\bfetch\s*\(/);
  assert.doesNotMatch(script, /\bWebSocket\b/);
  assert.doesNotMatch(script, /\bXMLHttpRequest\b/);
  assert.doesNotMatch(script, /\blocalStorage\b/);
});
