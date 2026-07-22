const test = require('node:test');
const assert = require('node:assert/strict');
const {canRequestTimeOff,createAvailabilityEntry,decideAvailability,employeePlanningAvailability} = require('../lib/models/field-operations-191.ts');

test('Freiwunsch requires existing Anwesenheit coverage', () => {
  const existing = [{id:'AV-1',employeeId:'EMP-1',startDate:'2026-07-01',endDate:'2026-07-31',kind:'Anwesend',status:'Eingetragen',createdBy:'EMP-1',createdAt:'x',updatedBy:'EMP-1',updatedAt:'x'}];
  assert.equal(canRequestTimeOff(existing, 'EMP-1', '2026-07-10', '2026-07-12'), true);
  assert.throws(() => createAvailabilityEntry({employeeId:'EMP-2',startDate:'2026-07-10',endDate:'2026-07-12',kind:'Freiwunsch',createdBy:'EMP-2'}, existing, new Date('2026-07-01T08:00:00Z')));
});

test('planning treats open and approved time off differently', () => {
  const entries = [
    {id:'AV-1',employeeId:'EMP-1',startDate:'2026-07-01',endDate:'2026-07-31',kind:'Anwesend',status:'Eingetragen',createdBy:'EMP-1',createdAt:'x',updatedBy:'EMP-1',updatedAt:'x'},
    {id:'AV-2',employeeId:'EMP-1',startDate:'2026-07-10',endDate:'2026-07-10',kind:'Freiwunsch',status:'Beantragt',createdBy:'EMP-1',createdAt:'x',updatedBy:'EMP-1',updatedAt:'x'}
  ];
  assert.deepEqual(employeePlanningAvailability('EMP-1','2026-07-10',entries,[],[]), {available:true,level:'warning',reason:'Offener Freiwunsch'});
  const approved = entries.map(e => e.id === 'AV-2' ? decideAvailability(e, 'Genehmigt', 'ADMIN', 'ok', new Date('2026-07-01T09:00:00Z')) : e);
  assert.deepEqual(employeePlanningAvailability('EMP-1','2026-07-10',approved,[],[]), {available:false,level:'blocked',reason:'Genehmigter Freiwunsch'});
});
