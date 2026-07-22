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
const { changeProjectStatus, calculateOpenCustomerPayment, calculateOpenSupplierPayment, calculateProjectMargin } = require('../lib/models/project-helpers.ts');
const { loadPersistedState, migrateToV09 } = require('../lib/store.tsx');

test('migrates v0.7 projects without deleting legacy data', () => {
  const legacy = { projects: [{ id: 'P-OLD', customer: 'Altbestand', title: 'Altes Projekt', value: 1190, status: 'Material bestellt', montage: '2026-08-01' }], customers: [] };
  const state = migrateToV09(legacy);
  assert.equal(state.schemaVersion, 9);
  assert.equal(state.projects[0].id, 'P-OLD');
  assert.equal(state.projects[0].status, 'Bestellung Lieferant');
  assert.equal(state.projects[0].customer, 'Altbestand');
  assert.equal(state.projects[0].financials.expectedRevenueGross, 1190);
});

test('loads v0.7 storage as fallback', () => {
  const storage = { getItem: (key) => key === 'kastonia-erp-v07' ? JSON.stringify({ projects: [{ id: 'P-1', customer: 'C', title: 'T' }] }) : null };
  assert.equal(loadPersistedState(storage).projects[0].id, 'P-1');
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
