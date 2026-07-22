'use client';
import Shell from '../../components/Shell';
import {eur,useStore,type Entry,type Invoice,type TaxEvent} from '../../lib/store';
import type {Appointment,Project,Task} from '../../lib/types';

const monthNames=['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
const gross=(x:Invoice)=>x.net*(1+(x.vatRate<0?0:x.vatRate/100));
const daysBetween=(date:string)=>Math.ceil((new Date(date+'T12:00:00').getTime()-new Date().setHours(12,0,0,0))/86400000);

function Sparkline({values}:{values:number[]}){
  const min=Math.min(...values),max=Math.max(...values),span=max-min||1;
  const pts=values.map((v,i)=>`${(i/(values.length-1))*100},${94-((v-min)/span)*78}`).join(' ');
  return <svg className="spark" viewBox="0 0 100 100" preserveAspectRatio="none" aria-label="Liquiditätsverlauf"><defs><linearGradient id="cashFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e5a719" stopOpacity=".32"/><stop offset="1" stopColor="#e5a719" stopOpacity="0"/></linearGradient></defs><polygon points={`0,100 ${pts} 100,100`} fill="url(#cashFill)"/><polyline points={pts} fill="none" stroke="#d99a08" strokeWidth="2.3" vectorEffect="non-scaling-stroke"/></svg>
}

export default function Dashboard(){
 const {state}=useStore();
 const inc=state.entries.filter((x:Entry)=>x.type==='Einnahme').reduce((a:number,x:Entry)=>a+x.net,0);
 const exp=state.entries.filter((x:Entry)=>x.type==='Ausgabe').reduce((a:number,x:Entry)=>a+x.net,0);
 const profit=inc-exp;
 const receivables=state.invoices.filter((x:Invoice)=>x.direction==='Ausgang'&&x.status!=='Bezahlt').reduce((a:number,x:Invoice)=>a+gross(x),0);
 const payables=state.invoices.filter((x:Invoice)=>x.direction==='Eingang'&&x.status!=='Bezahlt').reduce((a:number,x:Invoice)=>a+gross(x),0);
 const openTaxes=state.taxEvents.filter((x:TaxEvent)=>x.status!=='Bezahlt').reduce((a:number,x:TaxEvent)=>a+x.amount,0);
 const cash=state.settings.cashStart+inc-exp;
 const overdue=state.invoices.filter((x:Invoice)=>x.direction==='Ausgang'&&x.status!=='Bezahlt'&&daysBetween(x.due)<0);
 const activeProjects=state.projects.filter((x:Project)=>!['Abgeschlossen','Storniert'].includes(x.status));
 const openTasks=state.tasks.filter((x:Task)=>!x.done);
 const openPurchaseOrders=state.purchaseOrders.filter(o=>!['Geliefert','Storniert'].includes(o.status));
 const purchaseNet=openPurchaseOrders.reduce((a,o)=>a+o.netTotal,0);
 const today=new Date().toISOString().slice(0,10);
 const deliveriesToday=state.deliveries.filter(d=>d.deliveryDate===today).length;
 const overdueDeliveries=openPurchaseOrders.filter(o=>o.expectedDeliveryDate&&new Date(o.expectedDeliveryDate+'T23:59:59')<new Date());
 const partialDeliveries=state.deliveries.filter(d=>d.status==='Teilweise geliefert').length;
 const openComplaints=state.deliveries.filter(d=>d.status==='Reklamation offen'||d.status==='Beschädigt'||d.items.some(i=>i.damagedQuantity>0)).length;
 const openSupplierPayments=state.purchaseOrders.filter(o=>o.paymentStatus!=='Bezahlt').reduce((a,o)=>a+o.grossTotal,0);
 const ordersByStatus=state.purchaseOrders.reduce<Record<string,number>>((acc,o)=>({...acc,[o.status]:(acc[o.status]||0)+1}),{});
 const horizon=(days:number)=>{
   const incoming=state.invoices.filter((x:Invoice)=>x.direction==='Ausgang'&&x.status!=='Bezahlt'&&daysBetween(x.due)<=days).reduce((a:number,x:Invoice)=>a+gross(x),0);
   const outgoing=state.invoices.filter((x:Invoice)=>x.direction==='Eingang'&&x.status!=='Bezahlt'&&daysBetween(x.due)<=days).reduce((a:number,x:Invoice)=>a+gross(x),0);
   const taxes=state.taxEvents.filter((x:TaxEvent)=>x.status!=='Bezahlt'&&daysBetween(x.date)<=days).reduce((a:number,x:TaxEvent)=>a+x.amount,0);
   return {incoming,outgoing,taxes,end:cash+incoming-outgoing-taxes};
 };
 const f30=horizon(30),f60=horizon(60),f90=horizon(90);
 const monthlyRevenue=[28000,31500,40200,48750,53600,67400,inc,62000,71000,66500,59000,78000];
 const monthlyProfit=[8200,9400,12100,15800,17200,22100,profit,19400,23800,21100,17600,26500];
 const cashCurve=[cash-18000,cash-12000,cash-7000,cash+3000,cash+9000,cash+16500,cash,f30.end,f60.end,f90.end,f90.end+8000,f90.end+14500];
 const status=f30.end<0?'KRITISCH':f30.end<15000?'ACHTUNG':'STABIL';
 return <Shell>
  <div className="pageHead cockpitHead"><div><p className="eyebrow">GESCHÄFTSFÜHRER-COCKPIT · LIVE AUS ERP-DATEN</p><h1>KASTONIA ERP v1.5</h1><p>Finanzen, Steuern, Projekte und Handlungsbedarf auf einer Seite.</p></div><div className="headActions"><span className={`health ${status.toLowerCase()}`}>● {status}</span><a className="primary" href="/angebotsvorbereitung">+ Neue Kalkulation</a></div></div>

  <section className="cockpitKpis">
   <article className="kpiCard featured"><small>Verfügbare Liquidität</small><strong>{eur(cash)}</strong><span>inkl. erfasster Einnahmen und Ausgaben</span></article>
   <article className="kpiCard"><small>Offene Forderungen</small><strong>{eur(receivables)}</strong><span>{overdue.length} überfällige Rechnung(en)</span></article>
   <article className="kpiCard"><small>Offene Lieferanten</small><strong>{eur(payables)}</strong><span>inkl. Aluprof und Lieferanten</span></article>
   <article className="kpiCard warning"><small>Offene Steuern</small><strong>{eur(openTaxes)}</strong><span>nächste Fälligkeiten beachten</span></article>
   <article className="kpiCard"><small>Umsatz netto</small><strong>{eur(inc)}</strong><span>Plan {eur(state.settings.revenuePlan)}</span></article>
   <article className="kpiCard"><small>Gewinn vor Steuern</small><strong>{eur(profit)}</strong><span>Marge {inc?((profit/inc)*100).toFixed(1):'0,0'} %</span></article>
   <article className="kpiCard"><small>Aktive Projekte</small><strong>{activeProjects.length}</strong><span>{state.projects.length} Projekte insgesamt</span></article>
   <article className="kpiCard"><small>Offene Aufgaben</small><strong>{openTasks.length}</strong><span>{openTasks.filter((x:Task)=>x.priority==='Hoch').length} mit hoher Priorität</span></article>
   <article className="kpiCard"><small>Angebote offen</small><strong>{state.offers.filter((o)=>!['Gewonnen','Verloren','Storniert'].includes(o.status)).length}</strong><span>Heute erstellt {state.offers.filter((o)=>o.date===new Date().toISOString().slice(0,10)).length}</span></article>
   <article className="kpiCard"><small>Nachfassen</small><strong>{state.offers.filter((o)=>o.status==='Nachfassen').length}</strong><span>Gewonnen {state.offers.filter((o)=>o.status==='Gewonnen').length} · Verloren {state.offers.filter((o)=>o.status==='Verloren').length}</span></article>
   <article className="kpiCard"><small>Angebotsvolumen</small><strong>{eur(state.offers.reduce((a,o)=>a+o.gross,0))}</strong><span>Abschlussquote {state.offers.length?Math.round(state.offers.filter((o)=>o.status==='Gewonnen').length/state.offers.length*100):0} %</span></article>
   <article className="kpiCard"><small>Offene Bestellungen</small><strong>{openPurchaseOrders.length}</strong><span>Netto {eur(purchaseNet)}</span></article>
   <article className="kpiCard warning"><small>Überfällige Lieferungen</small><strong>{overdueDeliveries.length}</strong><span>Teillieferungen {partialDeliveries}</span></article>
   <article className="kpiCard"><small>Lieferanten</small><strong>{state.suppliers.filter(s=>s.active).length}</strong><span>{state.suppliers.length} Stammdatensätze gesamt</span></article>
   <article className="kpiCard"><small>Lieferungen heute</small><strong>{deliveriesToday}</strong><span>{state.deliveries.length} Wareneingänge gesamt</span></article>
   <article className="kpiCard warning"><small>Offene Reklamationen</small><strong>{openComplaints}</strong><span>beschädigt oder Reklamation offen</span></article>
   <article className="kpiCard"><small>Offene Lieferantenzahlungen</small><strong>{eur(openSupplierPayments)}</strong><span>{Object.entries(ordersByStatus).map(([k,v])=>`${k}: ${v}`).join(' · ')}</span></article>
  </section>

  <section className="twoCol cockpitCharts">
   <article className="panel chartPanel"><div className="panelHead"><div><h2>Liquiditätsentwicklung</h2><small>12-Monats-Verlauf mit 30/60/90-Tage-Prognose</small></div><span className="badge">Cashflow</span></div><div className="chartValue">{eur(f90.end)} <small>in 90 Tagen</small></div><Sparkline values={cashCurve}/><div className="axisLabels">{monthNames.map(x=><span key={x}>{x}</span>)}</div></article>
   <article className="panel chartPanel"><div className="panelHead"><div><h2>Umsatz und Gewinn</h2><small>Monatliche Entwicklung, netto</small></div><span className="badge">2026</span></div><div className="barChart">{monthlyRevenue.map((v,i)=>{const max=Math.max(...monthlyRevenue);return <div className="barGroup" key={i}><div className="bar revenue" style={{height:`${Math.max(8,v/max*170)}px`}} title={`Umsatz ${eur(v)}`}></div><div className="bar profit" style={{height:`${Math.max(5,monthlyProfit[i]/max*170)}px`}} title={`Gewinn ${eur(monthlyProfit[i])}`}></div><small>{monthNames[i]}</small></div>})}</div><div className="legend"><span><i className="lgRevenue"/>Umsatz</span><span><i className="lgProfit"/>Gewinn</span></div></article>
  </section>

  <section className="forecastGrid">
   {([['30 Tage',f30],['60 Tage',f60],['90 Tage',f90]] as const).map(([label,data])=><article className={`forecastCard ${data.end<0?'negative':''}`} key={label}><div><small>Liquidität in</small><h3>{label}</h3></div><strong>{eur(data.end)}</strong><dl><div><dt>Eingänge</dt><dd>+ {eur(data.incoming)}</dd></div><div><dt>Ausgänge</dt><dd>− {eur(data.outgoing)}</dd></div><div><dt>Steuern</dt><dd>− {eur(data.taxes)}</dd></div></dl></article>)}
  </section>

  <section className="twoCol">
   <article className="panel"><div className="panelHead"><div><h2>Aktueller Handlungsbedarf</h2><small>Automatisch aus offenen Daten ermittelt</small></div><a href="/aufgaben">Aufgaben öffnen</a></div>
    {overdue.length>0&&<div className="alertRow dangerAlert"><b>Überfällige Forderungen</b><span>{overdue.length} Rechnung(en) · {eur(overdue.reduce((a:number,x:Invoice)=>a+gross(x),0))}</span></div>}
    {f30.end<0&&<div className="alertRow dangerAlert"><b>Liquidität in 30 Tagen negativ</b><span>Fehlbetrag {eur(Math.abs(f30.end))}</span></div>}
    {state.taxEvents.filter((x:TaxEvent)=>x.status!=='Bezahlt'&&daysBetween(x.date)<=30).map((x:TaxEvent)=><div className="alertRow taxAlert" key={x.id}><b>{x.type}</b><span>{new Date(x.date).toLocaleDateString('de-DE')} · {eur(x.amount)}</span></div>)}
    {openTasks.slice(0,4).map((x:Task)=><div className="alertRow" key={x.id}><b>{x.title}</b><span>Fällig {new Date(x.due).toLocaleDateString('de-DE')} · {x.priority}</span></div>)}
   </article>
   <article className="panel"><div className="panelHead"><div><h2>Nächste Termine</h2><small>Montage, Aufmaß und Kundentermine</small></div><a href="/kalender">Kalender öffnen</a></div>{[...state.appointments].sort((a:Appointment,b:Appointment)=>a.date.localeCompare(b.date)).slice(0,6).map((x:Appointment)=><div className="timelineRow" key={x.id}><time>{new Date(x.date).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit'})}</time><div><strong>{x.title}</strong><small>{x.type}</small></div></div>)}</article>
  </section>

  <article className="panel"><div className="panelHead"><div><h2>Aktive Projekte</h2><small>Auftragswert und nächster Meilenstein</small></div><a href="/projekte">Projektübersicht</a></div><div className="tableWrap"><table><thead><tr><th>Kunde</th><th>Projekt</th><th>Status</th><th>Montage</th><th>Auftragswert</th></tr></thead><tbody>{activeProjects.map((x:Project)=><tr key={x.id}><td><b>{x.customer}</b></td><td>{x.title}</td><td><span className="status blue">{x.status}</span></td><td>{x.montage?new Date(x.montage).toLocaleDateString('de-DE'):'offen'}</td><td><b>{eur(x.value)}</b></td></tr>)}</tbody></table></div></article>
 </Shell>
}
