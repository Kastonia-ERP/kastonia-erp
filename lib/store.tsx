'use client';
import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
export type Customer={id:string,name:string,email:string,phone:string,city:string,status:string};
export type Offer={id:string,customer:string,title:string,net:number,status:string,date:string};
export type Project={id:string,customer:string,title:string,value:number,status:string,montage:string};
export type Supplier={id:string,name:string,category:string,contact:string};
export type Entry={id:string,date:string,type:'Einnahme'|'Ausgabe',category:string,text:string,net:number,vat:number,paid:boolean};
export type Task={id:string,title:string,due:string,priority:'Hoch'|'Mittel'|'Niedrig',done:boolean};
export type Appointment={id:string,title:string,date:string,type:string};
export type Invoice={id:string,direction:'Ausgang'|'Eingang',number:string,partner:string,project:string,date:string,due:string,net:number,vatRate:number,status:string};
export type TaxEvent={id:string,date:string,type:string,amount:number,status:string,note:string};
export type CalcItem={id:string;supplier:string;description:string;quantity:number;purchaseNet:number;rule:string;customFactor:number;transportFactor:number;assemblyNet:number;otherNet:number;vatRate:number};
export type Calculation={id:string;number:string;customer:string;project:string;createdAt:string;status:string;notes:string;items:CalcItem[]};
type State={customers:Customer[];offers:Offer[];projects:Project[];suppliers:Supplier[];entries:Entry[];tasks:Task[];appointments:Appointment[];invoices:Invoice[];taxEvents:TaxEvent[];calculations:Calculation[];settings:{revenuePlan:number;taxReserve:number;cashStart:number}};
const initial:State={
 customers:[{id:'K-1001',name:'Heidi Wenger',email:'',phone:'',city:'',status:'Aktiv'},{id:'K-1002',name:'Martin Rau',email:'',phone:'',city:'',status:'Aktiv'},{id:'K-1003',name:'Gebhard',email:'',phone:'',city:'',status:'Aktiv'}],
 offers:[{id:'AG12553',customer:'Heidi Wenger',title:'Pultdach + Markise',net:20882.35,status:'Auftrag',date:'2026-05-09'}],
 projects:[{id:'P-001',customer:'Heidi Wenger',title:'Pultdach + Markise',value:24850,status:'Material bestellt',montage:'2026-09-12'},{id:'P-002',customer:'Martin Rau',title:'Cube + ZIP-Screens',value:31200,status:'Aufmaß',montage:'2026-07-31'}],
 suppliers:[{id:'L-01',name:'MB Veranda',category:'Terrassendächer',contact:''},{id:'L-02',name:'Lewens',category:'Markisen',contact:''},{id:'L-03',name:'SELT',category:'Sonnenschutz',contact:''},{id:'L-04',name:'Stores Marquises',category:'Lamellendächer',contact:''},{id:'L-05',name:'PF Gruppe',category:'Carports',contact:''},{id:'L-06',name:'Sonstiges',category:'Zubehör / Fremdleistung',contact:''}],
 entries:[{id:'E-1',date:'2026-07-01',type:'Einnahme',category:'Umsatz',text:'Kundenrechnungen',net:128440,vat:24403.6,paid:true},{id:'A-1',date:'2026-07-05',type:'Ausgabe',category:'Wareneinsatz',text:'Lieferanten',net:66420,vat:12619.8,paid:true},{id:'A-2',date:'2026-07-10',type:'Ausgabe',category:'Betriebskosten',text:'Laufende Kosten',net:19840,vat:3769.6,paid:true}],
 tasks:[{id:'T1',title:'Angebot Hartmann überarbeiten',due:'2026-07-20',priority:'Hoch',done:false},{id:'T2',title:'OBI-Leads nachfassen',due:'2026-07-21',priority:'Hoch',done:false},{id:'T3',title:'Wenger Senkrechtmarkise aufmessen',due:'2026-07-22',priority:'Mittel',done:false}],
 appointments:[{id:'KA1',title:'Aufmaß Rau',date:'2026-07-20',type:'Aufmaß'},{id:'KA2',title:'Fuchs Termin',date:'2026-07-23',type:'Kundentermin'},{id:'KA3',title:'Montage Gebhard',date:'2026-07-27',type:'Montage'}],
 invoices:[{id:'R1',direction:'Ausgang',number:'RE12763',partner:'Nadja & Julian',project:'Terrassendach',date:'2026-05-02',due:'2026-07-30',net:6550,vatRate:19,status:'Offen'},{id:'R2',direction:'Eingang',number:'ER-2026-44',partner:'Lewens',project:'Rau',date:'2026-07-12',due:'2026-08-05',net:4200,vatRate:19,status:'Offen'},{id:'R3',direction:'Eingang',number:'2026/4/070228',partner:'Aluprof',project:'Rau',date:'2026-07-20',due:'2026-08-03',net:1793.30,vatRate:0,status:'Offen'}],
 taxEvents:[{id:'S1',date:'2026-08-14',type:'ESt-Nachzahlung 2024',amount:10162.48,status:'Offen',note:''},{id:'S2',date:'2026-08-15',type:'Gewerbesteuer',amount:435,status:'Offen',note:'Quartalszahlung'},{id:'S3',date:'2026-08-20',type:'Gewerbesteuer Nachzahlung',amount:2616,status:'Offen',note:''},{id:'S4',date:'2026-09-10',type:'USt-VA Juli 2026',amount:1680.32,status:'Offen',note:''},{id:'S5',date:'2026-11-15',type:'Gewerbesteuer',amount:435,status:'Offen',note:'Quartalszahlung'}],
 calculations:[],settings:{revenuePlan:420000,taxReserve:46448,cashStart:18420}
};
const C=createContext<any>(null);
export function StoreProvider({children}:{children:React.ReactNode}){const [state,setState]=useState<State>(initial);useEffect(()=>{try{const x=localStorage.getItem('kastonia-erp-v07');if(x)setState({...initial,...JSON.parse(x)})}catch{}},[]);useEffect(()=>{try{localStorage.setItem('kastonia-erp-v07',JSON.stringify(state))}catch{}},[state]);const api=useMemo(()=>({state,setState,add:(key:keyof State,item:any)=>setState(s=>({...s,[key]:[...(s[key] as any[]),item]})),update:(key:keyof State,id:string,item:any)=>setState(s=>({...s,[key]:(s[key] as any[]).map(x=>x.id===id?item:x)})),remove:(key:keyof State,id:string)=>setState(s=>({...s,[key]:(s[key] as any[]).filter(x=>x.id!==id)})),reset:()=>setState(initial),exportData:()=>{const b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='KASTONIA_ERP_Backup_v07.json';a.click();URL.revokeObjectURL(u)}}),[state]);return <C.Provider value={api}>{children}</C.Provider>}
export const useStore=()=>useContext(C);
export const eur=(n:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(n||0);
