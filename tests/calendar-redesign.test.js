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

test('tablet planning keeps 3 to 5 relevant workdays visible and sticky names', () => {
  assert.match(admin, /relevantDays=\[[^\]]*2026-07-24[^\]]*\]/);
  assert.match(admin, /workdayScroller/);
  assert.match(admin, /matrixName sticky/);
  assert.match(css, /@media\(min-width:761px\) and \(max-width:1180px\)/);
  assert.match(css, /repeat\(5,138px\)/);
});

test('project cards expose assignment controls and occupancy', () => {
  assert.match(admin, /Belegung: \{assigned\.length\} \/ \{requiredEmployees\}/);
  assert.match(admin, /Mitarbeiter hinzufügen/);
  assert.match(admin, /Entfernen/);
  assert.match(admin, /Teamleiter/);
  assert.match(admin, /Drag-and-drop/);
});

test('status icons are svg based and internal names are not rendered as text', () => {
  assert.match(admin, /function Icon/);
  assert.match(admin, /aria-hidden="true"/);
  assert.doesNotMatch(admin, /<i>\{meta\.icon\}<\/i>/);
  assert.doesNotMatch(admin, /<i>\{s\[0\]\}<\/i>/);
});


test('project-centered workforce planning exposes monthly project cards and day details', () => {
  const planning = fs.readFileSync('app/einsatzplanung/page.tsx','utf8');
  assert.match(planning, /Projektzentrierte Einsatzplanung/);
  assert.match(planning, /projectMonthList/);
  assert.match(planning, /freigegebene Samstage, Brückentage, Sonderarbeitstage und Betriebsferien/);
  ['Kunde','Adresse','Beginn','Ende','Fahrzeug','Werkzeuge','Material','Geplante Stunden'].forEach(label => assert.match(planning, new RegExp(label)));
});

test('project-centered assignment supports drag drop, multi select, capacity bars and qualification badges', () => {
  const planning = fs.readFileSync('app/einsatzplanung/page.tsx','utf8');
  assert.match(planning, /assignmentColumns/);
  assert.match(planning, /draggable/);
  assert.match(planning, /Mehrfachauswahl/);
  assert.match(planning, /capacityBar/);
  assert.match(planning, /qualBadges/);
  assert.match(planning, /Fahrzeugführer/);
});

test('admin assignment workflow prevents duplicates and keeps a single team lead', () => {
  assert.match(admin, /assignEmployee/);
  assert.match(admin, /bereits eingeplant/);
  assert.match(admin, /setDragged\(null\)/);
  assert.match(admin, /makeTeamLead/);
  assert.match(admin, /teamLead:a\.id===assignment\.id/);
  assert.match(admin, /Keine weiteren verfügbaren Mitarbeiter/);
});
