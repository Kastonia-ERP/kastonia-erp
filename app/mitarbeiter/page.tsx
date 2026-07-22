'use client';
import Shell from '../../components/Shell';
import {useStore} from '../../lib/store';
import {sanitizeProjectForUser} from '../../lib/models/permissions';

export default function EmployeePage(){
 const {state}=useStore();
 const user=state.users.find(u=>u.role==='MITARBEITER')||state.users[0];
 const assigned=state.projects.filter(p=>p.assignedEmployeeIds?.includes(user.id)||user.assignedProjectIds.includes(p.id)).map(p=>sanitizeProjectForUser(user,p));
 const today=new Date().toISOString().slice(0,10);
 return <Shell><div className="pageHead mobileHead"><div><p className="eyebrow">MITARBEITER · MOBILE BAUSTELLE</p><h1>Meine Baustellen</h1><p>Preisfreie Ansicht für Projekte, Meldungen, Notizen und Bildreferenzen.</p></div><button className="primary">+ Neue Meldung</button></div>
 <section className="employeeGrid"><article className="panel"><h2>Heute</h2>{assigned.filter(p=>p.montage===today||p.plannedInstallationDate===today).map(p=><a className="bigAction" href={`#${p.id}`} key={p.id}>{p.customer}<small>{p.projectAddress.street}, {p.projectAddress.city}</small></a>)}{assigned.filter(p=>p.montage===today||p.plannedInstallationDate===today).length===0&&<p>Keine Baustelle für heute geplant.</p>}</article><article className="panel"><h2>Nächste Baustellen</h2>{assigned.map(p=><a className="bigAction" href={`#${p.id}`} key={p.id}>{p.customer}<small>{p.montage||p.plannedInstallationDate||'Termin offen'} · {p.title}</small></a>)}</article><article className="panel"><h2>Offene Meldungen</h2>{state.siteReports.filter(r=>r.createdBy===user.id&&r.status!=='Erledigt').map(r=><div className="alertRow" key={r.id}><b>{r.title}</b><span>{r.category} · {r.status}</span></div>)}</article></section>
 {assigned.map(p=><article className="panel" id={p.id} key={p.id}><div className="panelHead"><div><h2>{p.customer}</h2><small>{p.projectAddress.street}, {p.projectAddress.postalCode} {p.projectAddress.city}</small></div><button className="primary">Bild hinzufügen</button></div><p><b>Ansprechpartner:</b> {p.contactPersons[0]?.name||'siehe Projektakte'} · <b>Telefon:</b> {p.contactPersons[0]?.phone||'nicht hinterlegt'}</p><p><b>Montage:</b> {p.montage||'offen'} · <b>Hinweise:</b> {p.installationNotes||'Keine Einkaufs- oder Verkaufspreise in dieser Ansicht.'}</p><div className="quickButtons"><button>Material melden</button><button>Werkzeug melden</button><button>Mangel melden</button><button>Abnahmebilder</button></div></article>)}
 </Shell>
}
