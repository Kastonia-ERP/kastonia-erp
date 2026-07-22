const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
const ts = require('typescript');
const originalLoad = Module._load;
Module._load = function(request, parent, isMain) {
  if (request === 'react') {
    return { createContext: () => ({}), useContext: () => null, useEffect: () => {}, useMemo: (fn) => fn(), useState: (v) => [v, () => {}] };
  }
  return originalLoad.call(this, request, parent, isMain);
};
require.extensions['.ts'] = require.extensions['.tsx'] = (module, filename) => {
  const source = require('fs').readFileSync(filename, 'utf8');
  const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.React, esModuleInterop: true } }).outputText;
  module._compile(output, filename);
};
const { changeProjectStatus, calculateOpenCustomerPayment, calculateOpenSupplierPayment, calculateProjectMargin, calculateProjectMarginPercent, findProjectById, getProjectRecordStep, updateProjectBaseData } = require('../lib/models/project-helpers.ts');
const { loadPersistedState, migrateToV09 } = require('../lib/store.tsx');

test('migrates v0.7 projects without deleting legacy data', () => {
  const legacy = { projects: [{ id: 'P-OLD', customer: 'Altbestand', title: 'Altes Projekt', value: 1190, status: 'Material bestellt', montage: '2026-08-01' }], customers: [] };
  const state = migrateToV09(legacy);
  assert.equal(state.schemaVersion, 9);
  assert.equal(state.projects[0].id, 'P-OLD');
  assert.equal(state.projects[0].status, 'Bestellung Lieferant');
  assert.equal(state.projects[0].customer, 'Altbestand');
  assert.equal(state.projects[0].financials.expectedRevenueGross, 1190);
  assert.equal(migrateToV09({ projects: [{ id: 'P-BAD', status: 'Unbekannter Altstatus' }] }).projects[0].status, 'Neue Anfrage');
});

test('loads v0.9 first and v0.7 storage as fallback', () => {
  const fallbackStorage = { getItem: (key) => key === 'kastonia-erp-v07' ? JSON.stringify({ projects: [{ id: 'P-1', customer: 'C', title: 'T' }] }) : null };
  assert.equal(loadPersistedState(fallbackStorage).projects[0].id, 'P-1');

  const currentStorage = { getItem: (key) => key === 'kastonia-erp-v09' ? JSON.stringify({ projects: [{ id: 'P-9', customer: 'C9', title: 'T9' }] }) : JSON.stringify({ projects: [{ id: 'P-7' }] }) };
  assert.equal(loadPersistedState(currentStorage).projects[0].id, 'P-9');
});

test('updates status and timestamp safely', () => {
  const project = migrateToV09({ projects: [{ id: 'P-1', customer: 'C', title: 'T', status: 'Lead' }] }).projects[0];
  const updated = changeProjectStatus(project, 'Archiviert', '2026-07-22T12:00:00.000Z');
  assert.equal(updated.status, 'Archiviert');
  assert.equal(updated.archived, true);
  assert.equal(updated.updatedAt, '2026-07-22T12:00:00.000Z');
});

test('calculates margin and open payments', () => {
  assert.equal(calculateProjectMargin({ expectedRevenueNet: 10000, expectedCostNet: 7250.125 }), 2749.88);
  assert.equal(calculateOpenCustomerPayment({ expectedRevenueGross: 11900, customerPaid: 1900 }), 10000);
  assert.equal(calculateOpenSupplierPayment({ expectedCostGross: 5950, supplierPaid: 6000 }), 0);
});


test('finds project by id and returns undefined for unknown id', () => {
  const state = migrateToV09({ projects: [{ id: 'P-FIND', customer: 'C', title: 'T' }] });
  assert.equal(findProjectById(state.projects, 'P-FIND').title, 'T');
  assert.equal(findProjectById(state.projects, 'P-UNKNOWN'), undefined);
});

test('updates editable base data and touches updatedAt', () => {
  const project = migrateToV09({ projects: [{ id: 'P-EDIT', customer: 'C', title: 'T', updatedAt: '2026-01-01T00:00:00.000Z' }] }).projects[0];
  const updated = updateProjectBaseData(project, { status: 'Montage geplant', phase: 'Montage', priority: 'Hoch', responsible: 'Kastonia Team', montage: '2026-08-01' }, '2026-07-22T13:00:00.000Z');
  assert.equal(updated.status, 'Montage geplant');
  assert.equal(updated.phase, 'Montage');
  assert.equal(updated.priority, 'Hoch');
  assert.equal(updated.responsible, 'Kastonia Team');
  assert.equal(updated.montage, '2026-08-01');
  assert.equal(updated.updatedAt, '2026-07-22T13:00:00.000Z');
});

test('calculates margin percent', () => {
  assert.equal(calculateProjectMarginPercent({ expectedRevenueNet: 10000, expectedCostNet: 7500 }), 25);
  assert.equal(calculateProjectMarginPercent({ expectedRevenueNet: 0, expectedCostNet: 7500 }), 0);
});

test('maps project status to visible record step', () => {
  assert.equal(getProjectRecordStep('Kontaktaufnahme'), 'Kontakt');
  assert.equal(getProjectRecordStep('Angebot versendet'), 'Angebot');
  assert.equal(getProjectRecordStep('Material ausstehend'), 'Bestellung');
  assert.equal(getProjectRecordStep('Rechnung gestellt'), 'Rechnung');
});
