const Module=require('node:module');
const ts=require('typescript');
require.extensions['.ts']=(module,filename)=>{const source=require('fs').readFileSync(filename,'utf8');const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;module._compile(output,filename);};
const test=require('node:test');
const assert=require('node:assert/strict');
const ops=require('../lib/models/operations.ts');

test('Mitarbeiterzuweisung, Rollenänderung und Entfernen aus Projekt',()=>{let assignments=[];assignments=ops.upsertEmployeeAssignment(assignments,{id:'A1',projectId:'P1',montageId:'M1',employeeId:'E1',date:'2026-07-22',startTime:'08:00',plannedEndTime:'16:00',teamRole:'Monteur',teamLead:false,plannedHours:8,note:''});assert.equal(assignments.length,1);assignments=ops.changeAssignmentRole(assignments,'A1','Teamleiter');assert.equal(assignments[0].teamLead,true);assert.equal(assignments[0].teamRole,'Teamleiter');assignments=ops.removeEmployeeAssignment(assignments,'A1');assert.equal(assignments.length,0);});

test('Mobile Navigation synchronisiert Heute, kommende und vergangene Baustellen',()=>{const projects=[{id:'P0',plannedInstallationDate:'2026-07-21'},{id:'P1',plannedInstallationDate:'2026-07-22'},{id:'P2',plannedInstallationDate:'2026-07-23'}];const assignments=projects.map((p,i)=>({id:`A${i}`,projectId:p.id,employeeId:'E1',date:p.plannedInstallationDate}));const sections=ops.employeeProjectSections(projects,assignments,'E1','2026-07-22');assert.deepEqual(sections.today.map(p=>p.id),['P1']);assert.deepEqual(sections.upcoming.map(p=>p.id),['P2']);assert.deepEqual(sections.past.map(p=>p.id),['P0']);});

test('Drag-&-Drop-Zuweisung verschiebt Mitarbeiter zwischen Baustellen und erkennt Konflikte',()=>{let assignments=[{id:'A1',projectId:'P1',employeeId:'E1',date:'2026-07-22'},{id:'A2',projectId:'P2',employeeId:'E1',date:'2026-07-22'}];assert.equal(ops.detectEmployeeDoubleBookings(assignments).length,1);assignments=ops.moveAssignmentToProject(assignments,'A2','P1');assert.equal(assignments[1].projectId,'P1');assert.equal(ops.detectEmployeeDoubleBookings(assignments).length,0);});

test('Berechtigungen: Mitarbeiter buchen nur zugewiesene Projekte, Admins ausgenommen',()=>{const assignments=[{projectId:'P1',employeeId:'E1'}];assert.equal(ops.canEmployeeTrackProject('E1','P1',assignments,'Demo Monteur'),true);assert.equal(ops.canEmployeeTrackProject('E1','P2',assignments,'Demo Monteur'),false);assert.equal(ops.canEmployeeTrackProject('ADMIN','P2',assignments,'Gökhan Karayel'),true);});

test('Dashboard-Kennzahlen decken Teamleiter und unbesetzte Baustellen ab',()=>{const projects=[{id:'P1',status:'Montage geplant',plannedInstallationDate:'2026-07-22'},{id:'P2',status:'Montage geplant',plannedInstallationDate:'2026-07-22'}];const assignments=[{projectId:'P1',employeeId:'E1',date:'2026-07-22',teamRole:'Monteur',teamLead:false}];const m=ops.workforcePlanningMetrics(projects,assignments,'2026-07-22');assert.equal(m.unassignedProjects,1);assert.equal(m.projectsWithoutTeamLead,1);assert.equal(m.unstaffedSitesToday,1);});
