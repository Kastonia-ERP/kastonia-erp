'use client';
import Shell from '../../components/Shell';
import {useStore} from '../../lib/store';

export default function SiteReportsPage(){
 const {state}=useStore();
 const open=state.siteReports.filter(r=>!['Erledigt','Abgelehnt'].includes(r.status));
 return <Shell><div className="pageHead"><div><p className="eyebrow">ADMIN · BAUSTELLENKOMMUNIKATION</p><h1>Baustellenmeldungen</h1><p>Zentrale Übersicht für Material, Werkzeug, Mängel, Abnahme- und Zustandsbilder.</p></div><a className="primary" href="/mitarbeiter">Mobile Mitarbeiteransicht</a></div>
 <section className="cockpitKpis"><article className="kpiCard"><small>Offen</small><strong>{open.length}</strong><span>nicht abgeschlossen</span></article><article className="kpiCard warning"><small>Dringend</small><strong>{state.siteReports.filter(r=>r.priority==='Dringend').length}</strong><span>sofort prüfen</span></article><article className="kpiCard warning"><small>Baustopp</small><strong>{state.siteReports.filter(r=>r.priority==='Baustopp').length}</strong><span>hervorgehoben</span></article><article className="kpiCard"><small>Material</small><strong>{state.siteReports.filter(r=>r.category==='Material nachbestellen'&&r.status!=='Erledigt').length}</strong><span>über Einkauf abwickeln</span></article></section>
 <article className="panel"><div className="panelHead"><div><h2>Meldungsliste</h2><small>Filter: Projekt · Mitarbeiter · Kategorie · Status · Dringlichkeit · Datum</small></div></div><div className="tableWrap"><table><thead><tr><th>ID</th><th>Projekt</th><th>Kategorie</th><th>Titel</th><th>Priorität</th><th>Status</th><th>Bilder</th></tr></thead><tbody>{state.siteReports.map(r=>{const p=state.projects.find(x=>x.id===r.projectId);return <tr key={r.id} className={r.priority==='Baustopp'?'dangerAlert':''}><td>{r.id}</td><td>{p?.projectNumber}</td><td>{r.category}</td><td><b>{r.title}</b><br/><small>{r.internalResponse||'Noch keine interne Antwort'}</small></td><td><span className="status blue">{r.priority}</span></td><td>{r.status}</td><td>{r.images.length}</td></tr>})}</tbody></table></div></article></Shell>
}
