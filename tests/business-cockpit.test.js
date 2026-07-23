const Module=require('node:module');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>{const source=require('fs').readFileSync(filename,'utf8');const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;module._compile(output,filename);};
const test=require('node:test');
const assert=require('node:assert/strict');
const c=require('../lib/models/business-cockpit.ts');

const input={cashStart:10000,revenuePlan:100000,incomeNet:20000,expenseNet:5000,today:new Date('2026-07-23'),invoices:[{id:'R1',direction:'Ausgang',status:'Offen',due:'2026-07-20',net:1000,vatRate:19},{id:'E1',direction:'Eingang',status:'Bezahlt',due:'2026-07-20',net:500,vatRate:19}],taxEvents:[{id:'T1',type:'USt',date:'2026-07-30',status:'Offen',amount:900}],tasks:[{id:'A1',title:'Kunde anrufen',due:'2026-07-24',priority:'Hoch',done:false}],offers:[{id:'O1',status:'Gewonnen',gross:1000,date:'2026-07-01'},{id:'O2',status:'Nachfassen',gross:2000,date:'2026-07-02'}],projects:[{id:'P1',status:'Montage läuft'},{id:'P2',status:'Abgeschlossen'}]};

test('buildCockpitActions prioritizes overdue receivables, taxes and due tasks',()=>{const actions=c.buildCockpitActions(input);assert.equal(actions[0].id,'overdue-receivables');assert.equal(actions[0].amount,1190);assert.ok(actions.some(a=>a.id==='tax-T1'));assert.ok(actions.some(a=>a.id==='task-A1'));});

test('buildCockpitKpis calculates sprint 1 management metrics',()=>{const kpis=c.buildCockpitKpis(input);assert.equal(kpis.find(k=>k.id==='cash').value,25000);assert.equal(kpis.find(k=>k.id==='receivables').value,1190);assert.equal(kpis.find(k=>k.id==='active-projects').value,1);assert.equal(kpis.find(k=>k.id==='close-rate').value,50);});
