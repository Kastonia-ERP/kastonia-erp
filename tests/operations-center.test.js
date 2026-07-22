const assert = require('node:assert/strict');
const test = require('node:test');

const {buildCalendarEvents, materialCheckForProject, operationsDemoData, todayWorkload} = require('../dist-tests/operations-center.cjs');

const project = {id:'P-1',customer:'Kunde',montage:'2026-07-22',plannedInstallationDate:'2026-07-22'};
const appointment = {id:'A-1',title:'Termin',date:'2026-07-22',type:'Kundentermin',projectId:'P-1'};
const delivery = {id:'D-1',deliveryNoteNumber:'LS-1',deliveryDate:'2026-07-22',status:'Teilweise geliefert',items:[]};

test('calendar merges customer appointments, installations, and deliveries', () => {
  const events = buildCalendarEvents([appointment], [delivery], [project]);
  assert.equal(events.length, 3);
  assert.deepEqual(events.map(event => event.type).sort(), ['Kundentermin', 'Lieferung', 'Montage']);
});

test('tasks are included in callback workload', () => {
  const work = todayWorkload({date:'2026-07-22', projects:[project], appointments:[appointment], tasks:[{id:'T', title:'Rückruf', due:'2026-07-22', priority:'Hoch', done:false, category:'Kunde', status:'Offen'}], offers:[{status:'Versendet'}], purchaseOrders:[{status:'Bestellt'}], deliveries:[delivery], invoices:[{status:'Offen'}], siteReports:[{status:'Neu'}]});
  assert.equal(work.installations.length, 1);
  assert.equal(work.customerAppointments.length, 1);
  assert.equal(work.callbacks.length, 1);
});

test('installation planning assigns team and vehicle', () => {
  const plan = operationsDemoData.installationPlans[0];
  assert.ok(plan.teamIds.length >= 1);
  assert.ok(operationsDemoData.vehicles.some(vehicle => vehicle.id === plan.vehicleId));
});

test('material check reports missing items', () => {
  const check = materialCheckForProject('P-003', operationsDemoData.materialChecks);
  assert.equal(check.complete, false);
  assert.ok(check.missingItems.length > 0);
});

test('checklists cover all installation phases', () => {
  const phases = new Set(operationsDemoData.installationChecklists[0].items.map(item => item.phase));
  assert.deepEqual([...phases].sort(), ['Nach Montage', 'Vor Montage', 'Während Montage']);
});
