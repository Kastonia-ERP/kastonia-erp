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
const { calculateOffer, calculateOfferItem, changeOfferStatus: changeOfferEngineStatus, createEmptyOffer, createOfferNumber, duplicateOffer: duplicateOfferEngine, integrateOfferIntoProjects, summarizeProjectOffers } = require('../lib/models/offer-engine.ts');

test('creates unique offer numbers by year', () => {
  assert.equal(createOfferNumber([{ id: 'AG20260001', offerNumber: 'AG20260001' }], new Date('2026-07-22T00:00:00Z')), 'AG20260002');
});

test('versions offers without deleting older versions', () => {
  const base = createEmptyOffer(migrateToV09({ projects: [{ id: 'P-OFFER', customer: 'C', title: 'T', projectNumber: 'P20260001' }] }).projects[0], [], new Date('2026-07-22T00:00:00Z'));
  const copy = duplicateOfferEngine(base, [base], new Date('2026-07-23T00:00:00Z'));
  assert.equal(copy.offerNumber, base.offerNumber);
  assert.equal(copy.version, 2);
  assert.notEqual(copy.id, base.id);
});

test('calculates offer totals, discounts and margin', () => {
  const item = calculateOfferItem({ id: '1', type: 'Terrassendach', name: 'Dach', description: '', quantity: 2, unit: 'Stk.', purchasePrice: 300, salesPrice: 500, discount: 10, vatRate: 19, totalNet: 0, totalGross: 0, marginAmount: 0, marginPercent: 0 });
  assert.equal(item.totalNet, 900);
  assert.equal(item.totalGross, 1071);
  assert.equal(item.marginAmount, 300);
  assert.equal(item.marginPercent, 33.33);
  const calc = calculateOffer([item]);
  assert.equal(calc.discount, 100);
  assert.equal(calc.net, 900);
  assert.equal(calc.vat, 171);
  assert.equal(calc.marginAmount, 300);
});

test('supports offer CRUD-style project integration', () => {
  const project = migrateToV09({ projects: [{ id: 'P-INT', customer: 'C', title: 'T', projectNumber: 'P20260002' }] }).projects[0];
  const offer = createEmptyOffer(project, [], new Date('2026-07-22T00:00:00Z'));
  const projects = integrateOfferIntoProjects([project], { ...offer, net: 1000, gross: 1190 });
  assert.equal(projects[0].offers.length, 1);
  assert.equal(projects[0].financials.expectedRevenueNet, 1000);
  assert.equal(summarizeProjectOffers(projects[0], [{ ...offer, net: 1000, gross: 1190 }]).totalValue, 1190);
});

test('documents offer status changes', () => {
  const project = migrateToV09({ projects: [{ id: 'P-ST', customer: 'C', title: 'T' }] }).projects[0];
  const offer = createEmptyOffer(project, [], new Date('2026-07-22T00:00:00Z'));
  const updated = changeOfferEngineStatus(offer, 'Versendet', 'Tester', new Date('2026-07-22T10:00:00Z'));
  assert.equal(updated.status, 'Versendet');
  assert.equal(updated.statusHistory.at(-1).from, 'Entwurf');
  assert.equal(updated.statusHistory.at(-1).to, 'Versendet');
});

const { calculatePurchaseOrder, createPurchaseOrderNumber, normalizeSupplier, remainingQuantityForItem, updateOrderStatusFromDeliveries } = require('../lib/models/purchasing.ts');

test('purchasing number range is yearly sequential', () => {
  assert.equal(createPurchaseOrderNumber([{ id: 'BE20260001', orderNumber: 'BE20260001' }], new Date('2026-07-22T00:00:00Z')), 'BE20260002');
});

test('purchase order calculation includes discount and vat', () => {
  const order = calculatePurchaseOrder({ id:'BE20260001', orderNumber:'BE20260001', supplierId:'L1', supplierName:'Demo', orderDate:'2026-07-22', status:'Entwurf', paymentStatus:'Offen', deliveryAddress:'', note:'', documentReferences:[], createdAt:'', updatedAt:'', netTotal:0, vatTotal:0, grossTotal:0, items:[{ id:'I1', name:'Ware', description:'', quantity:2, unit:'Stk.', unitPriceNet:100, discount:10, vatRate:19, netTotal:0, vatTotal:0, grossTotal:0 }] });
  assert.equal(order.netTotal, 180);
  assert.equal(order.vatTotal, 34.2);
  assert.equal(order.grossTotal, 214.2);
});

test('supplier migration normalizes legacy supplier data', () => {
  const supplier = normalizeSupplier({ id:'L-OLD', name:'Altlieferant', category:'Markisen', contact:'Kontakt' });
  assert.equal(supplier.companyName, 'Altlieferant');
  assert.equal(supplier.categories[0], 'Markisen');
  assert.equal(supplier.active, true);
});

test('purchase order can be linked to a project', () => {
  const migrated = migrateToV09({ projects:[{ id:'P-LINK', customer:'C', title:'T', status:'Lead' }], purchaseOrders:[{ id:'BE20260003', orderNumber:'BE20260003', supplierId:'L1', supplierName:'Demo', projectId:'P-LINK', orderDate:'2026-07-22', status:'Bestellt', paymentStatus:'Offen', deliveryAddress:'', note:'', documentReferences:[], createdAt:'', updatedAt:'', netTotal:0, vatTotal:0, grossTotal:0, items:[] }] });
  assert.equal(migrated.purchaseOrders[0].projectId, migrated.projects[0].id);
});

test('partial deliveries calculate remaining quantities and status', () => {
  const order = calculatePurchaseOrder({ id:'BE20260004', orderNumber:'BE20260004', supplierId:'L1', supplierName:'Demo', orderDate:'2026-07-22', status:'Bestellt', paymentStatus:'Offen', deliveryAddress:'', note:'', documentReferences:[], createdAt:'', updatedAt:'', netTotal:0, vatTotal:0, grossTotal:0, items:[{ id:'I1', name:'Ware', description:'', quantity:5, unit:'Stk.', unitPriceNet:10, discount:0, vatRate:19, netTotal:0, vatTotal:0, grossTotal:0 }] });
  const deliveries = [{ id:'WE1', purchaseOrderId:order.id, deliveryNoteNumber:'LS1', deliveryDate:'2026-07-23', status:'Teilweise geliefert', notes:'', documentReferences:[], items:[{ id:'D1', orderItemId:'I1', name:'Ware', deliveredQuantity:2, damagedQuantity:0, missingQuantity:3, unit:'Stk.' }] }];
  assert.equal(remainingQuantityForItem(order.items[0], deliveries), 3);
  assert.equal(updateOrderStatusFromDeliveries(order, deliveries).status, 'Teilweise geliefert');
});

test('complete delivery automatically marks order delivered', () => {
  const order = calculatePurchaseOrder({ id:'BE20260005', orderNumber:'BE20260005', supplierId:'L1', supplierName:'Demo', orderDate:'2026-07-22', status:'Bestellt', paymentStatus:'Offen', deliveryAddress:'', note:'', documentReferences:[], createdAt:'', updatedAt:'', netTotal:0, vatTotal:0, grossTotal:0, items:[{ id:'I1', name:'Ware', description:'', quantity:1, unit:'Stk.', unitPriceNet:10, discount:0, vatRate:19, netTotal:0, vatTotal:0, grossTotal:0 }] });
  const updated = updateOrderStatusFromDeliveries(order, [{ id:'WE1', purchaseOrderId:order.id, deliveryNoteNumber:'LS1', deliveryDate:'2026-07-23', status:'Vollständig geliefert', notes:'', documentReferences:[], items:[{ id:'D1', orderItemId:'I1', name:'Ware', deliveredQuantity:1, damagedQuantity:0, missingQuantity:0, unit:'Stk.' }] }]);
  assert.equal(updated.status, 'Geliefert');
});
