'use client';

import {useEffect,useState} from 'react';
import Shell from '../../components/Shell';
import {eur,useStore,type Invoice} from '../../lib/store';
import {PAYMENT_METHODS,simpleInvoiceGross,simpleInvoiceOpen,simpleInvoicePaid,simpleInvoicePaymentStatus,type PaymentMethod} from '../../lib/models/finance';

const today=()=>new Date().toISOString().slice(0,10);
const emptyInvoice=()=>({number:'',partner:'',project:'',date:today(),due:'',net:0,vatRate:19});
const emptyPayment=()=>({amount:0,date:today(),method:'Überweisung' as PaymentMethod,reference:'',note:''});

export default function Page(){
 const {state,add,update,remove}=useStore();
 const [tab,setTab]=useState<'Ausgang'|'Eingang'>('Ausgang');
 const [show,setShow]=useState(false);
 const [paymentInvoiceId,setPaymentInvoiceId]=useState<string|null>(null);
 const [message,setMessage]=useState('');
 const [f,setF]=useState(emptyInvoice);
 const [payment,setPayment]=useState(emptyPayment);
 const rows=state.invoices.filter(invoice=>invoice.direction===tab);
 const paymentInvoice=state.invoices.find(invoice=>invoice.id===paymentInvoiceId);

 useEffect(()=>{
  const requested=new URLSearchParams(window.location.search).get('typ');
  if(requested==='Eingang'||requested==='Ausgang')setTab(requested);
 },[]);

 const saveInvoice=()=>{
  if(!f.number||!f.partner||f.net<=0){setMessage('Bitte Rechnungsnummer, Kunde/Lieferant und Nettobetrag ausfüllen.');return;}
  add('invoices',{id:`R${Date.now()}`,direction:tab,...f,status:'Offen',paidAmount:0,payments:[]});
  setF(emptyInvoice());setShow(false);setMessage('');
 };

 const openPayment=(invoice:Invoice)=>{
  setPaymentInvoiceId(invoice.id);
  setPayment({...emptyPayment(),amount:simpleInvoiceOpen(invoice)});
  setMessage('');
 };

 const savePayment=()=>{
  if(!paymentInvoice)return;
  const open=simpleInvoiceOpen(paymentInvoice);
  if(payment.amount<=0){setMessage('Bitte einen Zahlungsbetrag größer als 0 eingeben.');return;}
  if(payment.amount>open){setMessage(`Der Betrag darf den offenen Rest von ${eur(open)} nicht überschreiten.`);return;}
  const nextPayments=[...(paymentInvoice.payments||[]),{
   id:`Z${Date.now()}`,date:payment.date,amount:payment.amount,
   direction:paymentInvoice.direction==='Ausgang'?'Kunde' as const:'Lieferant' as const,
   reference:[payment.method,payment.reference].filter(Boolean).join(' · '),note:payment.note
  }];
  const next={...paymentInvoice,payments:nextPayments,paidAmount:nextPayments.reduce((sum,item)=>sum+item.amount,0)};
  update('invoices',paymentInvoice.id,{...next,status:simpleInvoicePaymentStatus(next)});
  setPaymentInvoiceId(null);setPayment(emptyPayment());setMessage('');
 };

 return <Shell>
  <div className="pageHead"><div><p className="eyebrow">RECHNUNGSÜBERSICHT</p><h1>Eingangs- & Ausgangsrechnungen</h1><p>Rechnungen, vollständige Zahlungen und Teilzahlungen erfassen.</p></div><button className="primary" onClick={()=>setShow(!show)}>+ Rechnung erfassen</button></div>
  <div className="tabs"><button className={tab==='Ausgang'?'tab active':'tab'} onClick={()=>{setTab('Ausgang');setPaymentInvoiceId(null)}}>Ausgangsrechnungen</button><button className={tab==='Eingang'?'tab active':'tab'} onClick={()=>{setTab('Eingang');setPaymentInvoiceId(null)}}>Eingangsrechnungen</button></div>
  {message&&<p className="dangerAlert">{message}</p>}
  {show&&<article className="panel"><h2>Rechnung erfassen</h2><div className="formgrid">
   <input aria-label="Rechnungsnummer" placeholder="Rechnungsnummer" value={f.number} onChange={e=>setF({...f,number:e.target.value})}/>
   <input aria-label={tab==='Ausgang'?'Kunde':'Lieferant'} placeholder={tab==='Ausgang'?'Kunde':'Lieferant'} value={f.partner} onChange={e=>setF({...f,partner:e.target.value})}/>
   <input aria-label="Projekt" placeholder="Projekt" value={f.project} onChange={e=>setF({...f,project:e.target.value})}/>
   <label>Rechnungsdatum<input type="date" value={f.date} onChange={e=>setF({...f,date:e.target.value})}/></label>
   <label>Fällig am<input type="date" value={f.due} onChange={e=>setF({...f,due:e.target.value})}/></label>
   <input aria-label="Nettobetrag" type="number" min="0" step="0.01" placeholder="Netto" value={f.net||''} onChange={e=>setF({...f,net:+e.target.value})}/>
   <select aria-label="Umsatzsteuer" value={f.vatRate} onChange={e=>setF({...f,vatRate:+e.target.value})}><option value="19">19 %</option><option value="7">7 %</option><option value="0">0 %</option><option value="16">16 % historisch</option><option value="5">5 % historisch</option><option value="-1">steuerfrei / §13b</option></select>
   <button onClick={saveInvoice}>Speichern</button>
  </div></article>}
  {paymentInvoice&&<article className="panel"><h2>Zahlung zu {paymentInvoice.number} erfassen</h2><p>Offener Restbetrag: <b>{eur(simpleInvoiceOpen(paymentInvoice))}</b></p><div className="formgrid">
   <label>Zahlungsbetrag<input type="number" min="0.01" max={simpleInvoiceOpen(paymentInvoice)} step="0.01" value={payment.amount||''} onChange={e=>setPayment({...payment,amount:+e.target.value})}/></label>
   <label>Zahlungsdatum<input type="date" value={payment.date} onChange={e=>setPayment({...payment,date:e.target.value})}/></label>
   <label>Zahlungsart<select value={payment.method} onChange={e=>setPayment({...payment,method:e.target.value as PaymentMethod})}>{PAYMENT_METHODS.map(method=><option key={method}>{method}</option>)}</select></label>
   <input placeholder="Referenz / Buchungstext" value={payment.reference} onChange={e=>setPayment({...payment,reference:e.target.value})}/>
   <input placeholder="Notiz (optional)" value={payment.note} onChange={e=>setPayment({...payment,note:e.target.value})}/>
   <button onClick={savePayment}>{payment.amount<simpleInvoiceOpen(paymentInvoice)?'Teilzahlung speichern':'Zahlung vollständig speichern'}</button>
   <button className="ghost" onClick={()=>setPaymentInvoiceId(null)}>Abbrechen</button>
  </div></article>}
  <article className="panel"><div className="tableWrap"><table><thead><tr><th>Nr.</th><th>{tab==='Ausgang'?'Kunde':'Lieferant'}</th><th>Projekt</th><th>Brutto</th><th>Bezahlt</th><th>Offen</th><th>Fällig</th><th>Status</th><th>Aktionen</th></tr></thead><tbody>{rows.map(invoice=>{
   const status=simpleInvoicePaymentStatus(invoice);
   return <tr key={invoice.id}><td>{invoice.number}</td><td>{invoice.partner}</td><td>{invoice.project||'—'}</td><td>{eur(simpleInvoiceGross(invoice))}</td><td>{eur(simpleInvoicePaid(invoice))}</td><td><b>{eur(simpleInvoiceOpen(invoice))}</b></td><td>{invoice.due?new Date(`${invoice.due}T12:00:00`).toLocaleDateString('de-DE'):'—'}</td><td><span className={`status ${status==='Bezahlt'?'green':status==='Teilweise bezahlt'?'amber':status==='Überfällig'?'red':'blue'}`}>{status}</span></td><td><button onClick={()=>openPayment(invoice)} disabled={simpleInvoiceOpen(invoice)<=0}>Zahlung erfassen</button><button className="ghost" onClick={()=>remove('invoices',invoice.id)}>Löschen</button></td></tr>
  })}</tbody></table></div>
  {rows.some(invoice=>invoice.payments?.length)&&<div className="paymentHistory"><h2>Zahlungsverlauf</h2>{rows.flatMap(invoice=>(invoice.payments||[]).map(item=><div className="task" key={item.id}><b>{new Date(`${item.date}T12:00:00`).toLocaleDateString('de-DE')}</b><div><strong>{invoice.number}: {eur(item.amount)}</strong><small>{item.reference||'Zahlung'}{item.note?` · ${item.note}`:''}</small></div></div>))}</div>}
  </article>
 </Shell>;
}
