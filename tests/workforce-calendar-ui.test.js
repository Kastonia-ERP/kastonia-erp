const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>{const source=require('node:fs').readFileSync(filename,'utf8');module._compile(ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText,filename);};
const test=require('node:test');
const assert=require('node:assert/strict');
const ui=require('../lib/models/workforce-calendar-ui.ts');
const fs=require('node:fs');
const employees=[{id:'EMP-1',name:'A',active:true},{id:'EMP-2',name:'B',active:true}];
const workdays=[{id:'W1',date:'2026-07-25',status:'Arbeitstag freigegeben',workAllowed:true,label:'Samstag Montage',adminNote:'',createdBy:'A',createdAt:'x'},{id:'W2',date:'2026-07-26',status:'Sonderarbeitstag',workAllowed:true,label:'Sondertermin',adminNote:'',createdBy:'A',createdAt:'x'}];
const bridgeDays=[{id:'B1',date:'2026-07-24',title:'Brückentag',status:'Arbeitstag',workAllowed:true,note:'',createdBy:'A',createdAt:'x'}];
const holidays=[{id:'H1',title:'Betriebsferien',startDate:'2026-08-01',endDate:'2026-08-08',description:'',allEmployees:true,createdBy:'A',createdAt:'x'}];
const availabilities=[{id:'A1',employeeId:'EMP-1',type:'Anwesend',startDate:'2026-07-25',endDate:'2026-07-25',allDay:true,status:'Aktiv',employeeNote:'',createdBy:'EMP-1',createdAt:'x',updatedBy:'EMP-1',updatedAt:'x',changeHistory:[]},{id:'A2',employeeId:'EMP-2',type:'Freiwunsch',startDate:'2026-07-25',endDate:'2026-07-25',allDay:true,status:'Beantragt',employeeNote:'',createdBy:'EMP-2',createdAt:'x',updatedBy:'EMP-2',updatedAt:'x',changeHistory:[]}];
const assignments=[{id:'EA1',projectId:'P1',montageId:'M1',employeeId:'EMP-1',date:'2026-07-25',startTime:'8',plannedEndTime:'16',teamRole:'Montage',teamLead:false,note:''}];
const projects=[{id:'P1',title:'Projekt Fuchs',plannedInstallationDate:'2026-07-25'}];

test('mobile Monatsansicht und Listenansicht zeigen nur relevante KASTONIA-Arbeitstage',()=>{const days=ui.relevantWorkdays(2026,workdays,bridgeDays,holidays);assert.deepEqual(days.filter(d=>d.startsWith('2026-07')),['2026-07-04','2026-07-11','2026-07-18','2026-07-24','2026-07-25','2026-07-26']);assert.ok(!days.includes('2026-07-22'));});

test('Admin-Jahresübersicht fasst Arbeitstage, Betriebsferien und offene Anträge zusammen',()=>{const july=ui.monthSummary(2026,6,employees,availabilities,assignments,projects,workdays,bridgeDays,holidays);assert.equal(july.workdays,3);assert.equal(july.openRequests,1);const august=ui.monthSummary(2026,7,employees,availabilities,assignments,projects,workdays,bridgeDays,holidays);assert.equal(august.holidays,8);});

test('Monatsmatrix und Tagesplanung liefern Status-Chips, Konflikte und verknüpfte Einsatzzuweisung',()=>{assert.equal(ui.employeeStatusForDate(availabilities,assignments,'2026-07-25','EMP-1'),'planned');assert.equal(ui.employeeStatusForDate(availabilities,assignments,'2026-07-25','EMP-2'),'timeOffOpen');const day=ui.splitDayPlanning('2026-07-25',employees,availabilities,assignments,projects,[{id:'V1',licensePlate:'K-AS 1',status:'Verfügbar'}]);assert.equal(day.planned.length,1);assert.equal(day.openRequests.length,1);assert.equal(day.projects[0].title,'Projekt Fuchs');});

test('Status-Chips sind nicht nur Farbe: Icon, Textlabel, Tooltip und Screenreader-Label existieren',()=>{for(const status of ['present','timeOffOpen','timeOffApproved','timeOffRejected','absence','planned','companyHoliday','blocked','noResponse']){const item=ui.STATUS_PRESENTATION[status];assert.ok(item.icon);assert.ok(item.label);assert.ok(item.tooltip);assert.ok(item.tone);}});

test('responsive Darstellung, leere Zustände, Filter und Tastaturbedienung sind im Markup/CSS abgedeckt',()=>{const css=fs.readFileSync('app/globals.css','utf8');const employeePage=fs.readFileSync('app/mitarbeiter-mobile/page.tsx','utf8');const adminPage=fs.readFileSync('app/personalplanung/page.tsx','utf8');assert.match(css,/@media\(max-width:760px\)/);assert.match(css,/overflow-x:hidden/);assert.match(employeePage,/aria-label=.*öffnen/);assert.match(employeePage,/role="dialog"/);assert.match(adminPage,/filterPanel/);assert.match(adminPage,/emptyState/);assert.match(adminPage,/conflictBanner/);assert.equal(ui.hasEmployeeHorizontalOverflow(css),true);});
