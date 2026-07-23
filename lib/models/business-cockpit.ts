export type CockpitSeverity='critical'|'warning'|'info'|'success';
export type CockpitAction={id:string;title:string;detail:string;severity:CockpitSeverity;href:string;dueDate?:string;amount?:number};
export type CockpitKpi={id:string;label:string;value:number;unit:'currency'|'count'|'percent';severity:CockpitSeverity;helper:string};
export type CockpitInvoice={id:string;direction:'Ausgang'|'Eingang';status:string;due:string;net:number;vatRate:number};
export type CockpitTaxEvent={id:string;type:string;date:string;status:string;amount:number};
export type CockpitTask={id:string;title:string;due:string;priority:string;done:boolean};
export type CockpitOffer={id:string;status:string;gross:number;date:string};
export type CockpitProject={id:string;status:string;value?:number};
export type CockpitInput={cashStart:number;revenuePlan:number;invoices:CockpitInvoice[];taxEvents:CockpitTaxEvent[];tasks:CockpitTask[];offers:CockpitOffer[];projects:CockpitProject[];incomeNet:number;expenseNet:number;today?:Date};

const dayMs=86400000;
export const invoiceGross=(invoice:CockpitInvoice)=>invoice.net*(1+(invoice.vatRate<0?0:invoice.vatRate/100));
export function daysUntil(date:string,today=new Date()){return Math.ceil((new Date(date+'T12:00:00').getTime()-new Date(today).setHours(12,0,0,0))/dayMs);}

export function buildCockpitActions(input:CockpitInput):CockpitAction[]{
 const today=input.today||new Date();
 const actions:CockpitAction[]=[];
 const overdueReceivables=input.invoices.filter(i=>i.direction==='Ausgang'&&i.status!=='Bezahlt'&&daysUntil(i.due,today)<0);
 const overdueAmount=overdueReceivables.reduce((sum,i)=>sum+invoiceGross(i),0);
 if(overdueReceivables.length)actions.push({id:'overdue-receivables',title:'Überfällige Forderungen mahnen',detail:`${overdueReceivables.length} Rechnung(en) überfällig`,severity:'critical',href:'/rechnungen',amount:overdueAmount});
 const dueTaxes=input.taxEvents.filter(t=>t.status!=='Bezahlt'&&daysUntil(t.date,today)<=14).sort((a,b)=>a.date.localeCompare(b.date));
 dueTaxes.slice(0,3).forEach(t=>actions.push({id:`tax-${t.id}`,title:t.type,detail:'Steuertermin innerhalb von 14 Tagen',severity:daysUntil(t.date,today)<0?'critical':'warning',href:'/steuern',dueDate:t.date,amount:t.amount}));
 input.tasks.filter(t=>!t.done&&daysUntil(t.due,today)<=7).sort((a,b)=>a.due.localeCompare(b.due)).slice(0,4).forEach(t=>actions.push({id:`task-${t.id}`,title:t.title,detail:`Priorität ${t.priority}`,severity:t.priority==='Hoch'?'warning':'info',href:'/aufgaben',dueDate:t.due}));
 return actions.sort((a,b)=>severityRank(a.severity)-severityRank(b.severity));
}
function severityRank(severity:CockpitSeverity){return {critical:0,warning:1,info:2,success:3}[severity];}

export function buildCockpitKpis(input:CockpitInput):CockpitKpi[]{
 const cash=input.cashStart+input.incomeNet-input.expenseNet;
 const receivables=input.invoices.filter(i=>i.direction==='Ausgang'&&i.status!=='Bezahlt').reduce((sum,i)=>sum+invoiceGross(i),0);
 const openTaxes=input.taxEvents.filter(t=>t.status!=='Bezahlt').reduce((sum,t)=>sum+t.amount,0);
 const activeProjects=input.projects.filter(p=>!['Abgeschlossen','Storniert'].includes(p.status)).length;
 const won=input.offers.filter(o=>o.status==='Gewonnen').length;
 const quote=input.offers.length?Math.round(won/input.offers.length*100):0;
 return [
  {id:'cash',label:'Verfügbare Liquidität',value:cash,unit:'currency',severity:cash<0?'critical':cash<15000?'warning':'success',helper:'Startbestand plus erfasster Netto-Cashflow'},
  {id:'receivables',label:'Offene Forderungen',value:receivables,unit:'currency',severity:receivables>50000?'warning':'info',helper:'Unbezahlte Ausgangsrechnungen brutto'},
  {id:'taxes',label:'Offene Steuern',value:openTaxes,unit:'currency',severity:openTaxes>0?'warning':'success',helper:'Noch nicht bezahlte Steuertermine'},
  {id:'active-projects',label:'Aktive Projekte',value:activeProjects,unit:'count',severity:'info',helper:'Nicht abgeschlossene Projektakten'},
  {id:'close-rate',label:'Abschlussquote Angebote',value:quote,unit:'percent',severity:quote>=35?'success':'info',helper:'Gewonnene Angebote im Verhältnis zu allen Angeboten'}
 ];
}
