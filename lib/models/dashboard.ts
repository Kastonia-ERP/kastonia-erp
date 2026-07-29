import type {State} from '../store';
import {createOpenItems,updateIncomingInvoicePayment,updateOutgoingInvoicePayment,vatSummary} from './finance';

export function financeSnapshot(state:State,asOf=new Date()){
  const outgoing=state.outgoingInvoices.map(invoice=>updateOutgoingInvoicePayment(invoice,state.invoicePayments,asOf));
  const incoming=state.incomingInvoices.map(invoice=>updateIncomingInvoicePayment(invoice,state.invoicePayments,asOf));
  const openItems=createOpenItems(outgoing,incoming,asOf);
  const taxes=state.taxCalendarEntries.filter(entry=>!['Erledigt','Bezahlt'].includes(entry.status));
  return {
    outgoing,incoming,openItems,taxes,
    receivablesCents:openItems.filter(item=>item.direction==='Forderung').reduce((sum,item)=>sum+item.openAmount.cents,0),
    payablesCents:openItems.filter(item=>item.direction==='Verbindlichkeit').reduce((sum,item)=>sum+item.openAmount.cents,0),
    taxesCents:taxes.reduce((sum,item)=>sum+(item.amount?.cents||0),0),
    vat:vatSummary(outgoing,incoming,`${asOf.getFullYear()}-${String(asOf.getMonth()+1).padStart(2,'0')}-01`,`${asOf.getFullYear()}-${String(asOf.getMonth()+1).padStart(2,'0')}-31`)
  };
}

export function openItemsCsv(state:State,asOf=new Date()){
  const {openItems}=financeSnapshot(state,asOf);
  const rows=[['Art','Nummer','Partner','Projekt','Fällig','Status','Offen EUR'],...openItems.map(item=>[item.direction,item.invoiceId,item.partnerName,item.projectId||'',item.dueDate,item.paymentStatus,(item.openAmount.cents/100).toFixed(2).replace('.',',')])];
  return '\uFEFF'+rows.map(row=>row.map(cell=>`"${String(cell).replaceAll('"','""')}"`).join(';')).join('\r\n');
}

export function downloadCsv(csv:string,fileName:string){
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');link.href=url;link.download=fileName;document.body.appendChild(link);link.click();link.remove();URL.revokeObjectURL(url);
}
