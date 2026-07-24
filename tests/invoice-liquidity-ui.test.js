const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const invoicePage = fs.readFileSync('app/rechnungen/page.tsx', 'utf8');
const css = fs.readFileSync('app/globals.css', 'utf8');

test('incoming and outgoing invoice payment form exposes partial and full payment choices', () => {
  assert.match(invoicePage, /Ausgangsrechnungen/);
  assert.match(invoicePage, /Eingangsrechnungen/);
  assert.match(invoicePage, /<option value="Teilzahlung">Teilzahlung<\/option>/);
  assert.match(invoicePage, /<option value="Vollständig">Vollständig bezahlen<\/option>/);
  assert.match(invoicePage, /Teilzahlung speichern/);
  assert.match(invoicePage, /Vollständige Zahlung speichern/);
});

test('white form and liquidity fields keep black readable text in dark mode', () => {
  assert.match(css, /input,select,textarea\{color:#14202b/);
  assert.match(css, /\.kpis>div\{background:#fff;color:#111/);
  assert.match(css, /\.kpis>div small,\.kpis>div b\{color:#111/);
  assert.match(css, /\.forecastCompact strong\{font-size:16px;color:#14202b/);
});
