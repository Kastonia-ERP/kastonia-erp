const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const employee = fs.readFileSync('app/mitarbeiter-mobile/page.tsx','utf8');
const admin = fs.readFileSync('app/personalplanung/page.tsx','utf8');
const css = fs.readFileSync('app/globals.css','utf8');

test('mobile employee view uses touch day cards and no horizontal year matrix', () => {
  assert.match(employee, /Meine Verfügbarkeit/);
  assert.match(employee, /dayCards/);
  assert.match(employee, /bottomSheet/);
  assert.doesNotMatch(employee, /yearMatrix/);
  assert.match(css, /overflow-x:hidden/);
});

test('employee list, month and compact year switches exist', () => {
  assert.match(employee, /Monat/);
  assert.match(employee, /Liste/);
  assert.match(employee, /Jahr kompakt/);
  assert.match(employee, /relevantDays/);
});

test('admin has four separated planning views', () => {
  ['Jahresübersicht','Monatsplanung','Tagesplanung','Offene Anträge'].forEach(label => assert.match(admin, new RegExp(label)));
  assert.match(admin, /ohne 365-Tage-Matrix/);
});

test('monthly matrix prioritizes relevant workdays and filters', () => {
  assert.match(admin, /Monatsmatrix nur für relevante KASTONIA-Arbeitstage/);
  assert.match(admin, /Team/);
  assert.match(admin, /Status/);
  assert.match(admin, /Projekt/);
  assert.match(css, /position:sticky/);
});

test('day planning links capacity, conflicts, vehicles and project assignment', () => {
  assert.match(admin, /assignmentBoard/);
  assert.match(admin, /draggable/);
  assert.match(admin, /Fahrzeug/);
  assert.match(admin, /detectWorkforceConflicts/);
});

test('status chips include icon, text label and tooltip not only color', () => {
  assert.match(admin, /statusMeta/);
  assert.match(admin, /title=\{meta\.tip\}/);
  assert.match(admin, /aria-label/);
  assert.match(css, /\.statusChip i/);
});

test('responsive empty states conflict and keyboard styling are present', () => {
  assert.match(css, /@media\(max-width:760px\)/);
  assert.match(admin + employee, /emptyState/);
  assert.match(admin, /dangerAlert/);
  assert.match(css, /focus-visible/);
});
