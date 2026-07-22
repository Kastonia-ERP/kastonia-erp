'use client';
import Link from 'next/link';
import {useParams} from 'next/navigation';
import Shell from '../../../components/Shell';
import {eur,useStore} from '../../../lib/store';

export default function SupplierDetailPage(){
 const {id}=useParams<{id:string}>();
 const {state}=useStore();
 const supplier=state.suppliers.find(s=>s.id===id);
 if(!supplier)return <Shell><section className="panel"><h1>Lieferant nicht gefunden</h1><Link href="/lieferanten">Zurück zur Übersicht</Link></section></Shell>;
 const orders=state.purchaseOrders.filter(o=>o.supplierId===supplier.id);
 const deliveries=state.deliveries.filter(d=>orders.some(o=>o.id===d.purchaseOrderId));
 const projects=state.projects.filter(p=>orders.some(o=>o.projectId===p.id));
 return <Shell><div className="pageHead"><div><p className="eyebrow">LIEFERANTENAKTE</p><h1>{supplier.companyName}</h1><p>{supplier.active?'Aktiver':'Inaktiver'} Lieferant · {supplier.categories.join(', ')}</p></div><Link className="primary" href="/lieferanten">Zur Übersicht</Link></div>
  <section className="twoCol"><article className="panel"><h2>Stammdaten</h2><dl><div><dt>Ansprechpartner</dt><dd>{supplier.contactPerson||'—'}</dd></div><div><dt>Adresse</dt><dd>{supplier.address||'—'} · {supplier.country}</dd></div><div><dt>E-Mail</dt><dd>{supplier.email||'—'}</dd></div><div><dt>Telefon</dt><dd>{supplier.phone||'—'}</dd></div><div><dt>Website</dt><dd>{supplier.website||'—'}</dd></div></dl></article><article className="panel"><h2>Konditionen</h2><dl><div><dt>Kundennummer</dt><dd>{supplier.supplierCustomerNumber||'—'}</dd></div><div><dt>Zahlungsbedingungen</dt><dd>{supplier.paymentTerms||'—'}</dd></div><div><dt>Lieferzeit</dt><dd>{supplier.usualDeliveryTime||'—'}</dd></div><div><dt>Notizen</dt><dd>{supplier.notes||'—'}</dd></div></dl></article></section>
  <section className="panel"><h2>Projektverknüpfungen</h2><div className="tableWrap"><table><thead><tr><th>Projekt</th><th>Titel</th><th>Status</th></tr></thead><tbody>{projects.map(p=><tr key={p.id}><td>{p.projectNumber}</td><td>{p.title}</td><td>{p.status}</td></tr>)}</tbody></table></div></section>
  <section className="panel"><h2>Bestellungen und Lieferungen</h2><div className="tableWrap"><table><thead><tr><th>Bestellung</th><th>Projekt</th><th>Status</th><th>Zahlung</th><th>Wert</th><th>Lieferungen</th></tr></thead><tbody>{orders.map(o=><tr key={o.id}><td>{o.orderNumber}</td><td>{o.projectNumber||'—'}</td><td>{o.status}</td><td>{o.paymentStatus}</td><td>{eur(o.grossTotal)}</td><td>{deliveries.filter(d=>d.purchaseOrderId===o.id).length}</td></tr>)}</tbody></table></div></section>
 </Shell>;
}
