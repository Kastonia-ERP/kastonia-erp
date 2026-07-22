'use client';
import React,{createContext,useContext,useEffect,useMemo,useState} from 'react';
import type {Appointment,Customer,Invoice,Offer,Project,Task} from './types';
import {demoProjects} from './models/demo-data';
import {PROJECT_STATUSES} from './types';
import {LEGACY_STORAGE_KEY_V07,PERSISTENCE_SCHEMA_VERSION,STORAGE_KEY_V09,createProjectNumber} from './models/project-helpers';

export type {Appointment,Customer,Invoice,Offer,Project,Task} from './types';
export type Supplier={id:string,name:string,category:string,contact:string};
export type Entry={id:string,date:string,type:'Einnahme'|'Ausgabe',category:string,text:string,net:number,vat:number,paid:boolean};
export type TaxEvent={id:string,date:string,type:string,amount:number,status:string,note:string};
export type CalcItem={id:string;supplier:string;description:string;quantity:number;purchaseNet:number;rule:string;customFactor:number;transportFactor:number;assemblyNet:number;otherNet:number;vatRate:number};
export type Calculation={id:string;number:string;customer:string;project:string;createdAt:string;status:string;notes:string;items:CalcItem[]};
export type Settings={revenuePlan:number;taxReserve:number;cashStart:number};
export type State={schemaVersion:number;customers:Customer[];offers:Offer[];projects:Project[];suppliers:Supplier[];entries:Entry[];tasks:Task[];appointments:Appointment[];invoices:Invoice[];taxEvents:TaxEvent[];calculations:Calculation[];settings:Settings};
type CollectionKey={ [K in keyof State]: State[K] extends Array<unknown> ? K : never }[keyof State];
type Api={state:State;setState:React.Dispatch<React.SetStateAction<State>>;add:<K extends CollectionKey>(key:K,item:State[K][number] | Record<string, unknown>)=>void;update:<K extends CollectionKey>(key:K,id:string,item:State[K][number] | Record<string, unknown>)=>void;remove:(key:CollectionKey,id:string)=>void;reset:()=>void;exportData:()=>void};

export const initial:State={
 schemaVersion:PERSISTENCE_SCHEMA_VERSION,
 customers:[{id:'K-1001',name:'Heidi Wenger',email:'',phone:'',city:'',status:'Aktiv'},{id:'K-1002',name:'Martin Rau',email:'',phone:'',city:'',status:'Aktiv'},{id:'K-1003',name:'Gebhard',email:'',phone:'',city:'',status:'Aktiv'}],
 offers:[{id:'AG12553',customer:'Heidi Wenger',title:'Pultdach + Markise',net:20882.35,status:'Auftrag',date:'2026-05-09'}],
 projects:demoProjects,
 suppliers:[{id:'L-01',name:'MB Veranda',category:'Terrassendächer',contact:''},{id:'L-02',name:'Lewens',category:'Markisen',contact:''},{id:'L-03',name:'SELT',category:'Sonnenschutz',contact:''},{id:'L-04',name:'Stores Marquises',category:'Lamellendächer',contact:''},{id:'L-05',name:'PF Gruppe',category:'Carports',contact:''},{id:'L-06',name:'Sonstiges',category:'Zubehör / Fremdleistung',contact:''}],
 entries:[{id:'E-1',date:'2026-07-01',type:'Einnahme',category:'Umsatz',text:'Kundenrechnungen',net:128440,vat:24403.6,paid:true},{id:'A-1',date:'2026-07-05',type:'Ausgabe',category:'Wareneinsatz',text:'Lieferanten',net:66420,vat:12619.8,paid:true},{id:'A-2',date:'2026-07-10',type:'Ausgabe',category:'Betriebskosten',text:'Laufende Kosten',net:19840,vat:3769.6,paid:true}],
 tasks:[{id:'T1',title:'Angebot Hartmann überarbeiten',due:'2026-07-20',priority:'Hoch',done:false},{id:'T2',title:'OBI-Leads nachfassen',due:'2026-07-21',priority:'Hoch',done:false},{id:'T3',title:'Wenger Senkrechtmarkise aufmessen',due:'2026-07-22',priority:'Mittel',done:false}],
 appointments:[{id:'KA1',title:'Aufmaß Rau',date:'2026-07-20',type:'Aufmaß'},{id:'KA2',title:'Fuchs Termin',date:'2026-07-23',type:'Kundentermin'},{id:'KA3',title:'Montage Gebhard',date:'2026-07-27',type:'Montage'}],
 invoices:[{id:'R1',direction:'Ausgang',number:'RE12763',partner:'Nadja & Julian',project:'Terrassendach',date:'2026-05-02',due:'2026-07-30',net:6550,vatRate:19,status:'Offen'},{id:'R2',direction:'Eingang',number:'ER-2026-44',partner:'Lewens',project:'Rau',date:'2026-07-12',due:'2026-08-05',net:4200,vatRate:19,status:'Offen'},{id:'R3',direction:'Eingang',number:'2026/4/070228',partner:'Aluprof',project:'Rau',date:'2026-07-20',due:'2026-08-03',net:1793.30,vatRate:0,status:'Offen'}],
 taxEvents:[{id:'S1',date:'2026-08-14',type:'ESt-Nachzahlung 2024',amount:10162.48,status:'Offen',note:''},{id:'S2',date:'2026-08-15',type:'Gewerbesteuer',amount:435,status:'Offen',note:'Quartalszahlung'},{id:'S3',date:'2026-08-20',type:'Gewerbesteuer Nachzahlung',amount:2616,status:'Offen',note:''},{id:'S4',date:'2026-09-10',type:'USt-VA Juli 2026',amount:1680.32,status:'Offen',note:''},{id:'S5',date:'2026-11-15',type:'Gewerbesteuer',amount:435,status:'Offen',note:'Quartalszahlung'}],
 calculations:[],settings:{revenuePlan:420000,taxReserve:46448,cashStart:18420}
};

type LegacyProject = Partial<Omit<Project, 'status'>> & {id:string;customer?:string;title?:string;value?:number;status?:string;montage?:string};
export function normalizeProject(raw:LegacyProject, index=0):Project{
 const now=new Date().toISOString();
 const legacyStatusMap: Record<string, Project['status']> = {'Lead':'Neue Anfrage','Angebot':'Angebot in Vorbereitung','Auftrag':'Auftrag erhalten','Material bestellt':'Bestellung Lieferant','Rechnung offen':'Rechnung gestellt'};
 const mappedStatus = raw.status && PROJECT_STATUSES.includes(raw.status as Project['status']) ? raw.status as Project['status'] : legacyStatusMap[raw.status || ''] || 'Neue Anfrage';
 const base: Project = {projectNumber:raw.projectNumber||createProjectNumber(new Date(),index+1),title:raw.title||'Unbenanntes Projekt',customer:raw.customer||'Unbekannt',contactPersons:raw.contactPersons||[],projectAddress:raw.projectAddress||{street:'',postalCode:'',city:'',country:'DE'},billingAddress:raw.billingAddress||{street:'',postalCode:'',city:'',country:'DE'},leadSource:raw.leadSource||'Sonstiges',isObiLead:raw.isObiLead||false,projectType:raw.projectType||'Sonstiges',status:mappedStatus,phase:raw.phase||'Lead',priority:raw.priority||'Mittel',responsible:raw.responsible||'',createdAt:raw.createdAt||now,updatedAt:raw.updatedAt||now,measurements:raw.measurements||[],offers:raw.offers||[],orderConfirmations:raw.orderConfirmations||[],supplierOrders:raw.supplierOrders||[],installations:raw.installations||[],invoices:raw.invoices||[],payments:raw.payments||[],documents:raw.documents||[],notes:raw.notes||[],communication:raw.communication||[],tasks:raw.tasks||[],appointments:raw.appointments||[],financials:raw.financials||{currency:'EUR',expectedRevenueNet:raw.value||0,expectedRevenueGross:raw.value||0,expectedCostNet:0,expectedCostGross:0,customerPaid:0,supplierPaid:0},tags:raw.tags||[],archived:raw.archived||false,value:raw.value||raw.financials?.expectedRevenueGross||0,montage:raw.montage||raw.installations?.[0]?.plannedStart||'',id:raw.id};
 return {...base,...raw,status:mappedStatus,value:base.value,montage:base.montage};
}
export function migrateToV09(raw:unknown):State{const parsed=typeof raw==='string'?JSON.parse(raw):raw;if(!parsed||typeof parsed!=='object')throw new Error('Invalid persisted state');const legacy=parsed as Partial<State>;return {...initial,...legacy,schemaVersion:PERSISTENCE_SCHEMA_VERSION,projects:(legacy.projects||initial.projects).map((p,index)=>normalizeProject(p as Parameters<typeof normalizeProject>[0],index))};}
export function loadPersistedState(storage:Pick<Storage,'getItem'>):State{const current=storage.getItem(STORAGE_KEY_V09);if(current)return migrateToV09(current);const legacy=storage.getItem(LEGACY_STORAGE_KEY_V07);if(legacy)return migrateToV09(legacy);return initial;}
const C=createContext<Api|null>(null);
export function StoreProvider({children}:{children:React.ReactNode}){const [state,setState]=useState<State>(initial);useEffect(()=>{try{setState(loadPersistedState(localStorage))}catch(error){console.warn('KASTONIA ERP migration failed; existing localStorage data was left untouched.',error)}},[]);useEffect(()=>{try{localStorage.setItem(STORAGE_KEY_V09,JSON.stringify(state))}catch{}},[state]);const api=useMemo<Api>(()=>({state,setState,add:(key,item)=>setState(s=>({...s,[key]:[...(s[key] as unknown[]),item]})),update:(key,id,item)=>setState(s=>({...s,[key]:(s[key] as Array<{id:string}>).map(x=>x.id===id?item:x)})),remove:(key,id)=>setState(s=>({...s,[key]:(s[key] as Array<{id:string}>).filter(x=>x.id!==id)})),reset:()=>setState(initial),exportData:()=>{const b=new Blob([JSON.stringify(state,null,2)],{type:'application/json'});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download='KASTONIA_ERP_Backup_v09.json';a.click();URL.revokeObjectURL(u)}}),[state]);return <C.Provider value={api}>{children}</C.Provider>}
export const useStore=()=>{const store=useContext(C);if(!store)throw new Error('useStore must be used within StoreProvider');return store};
export const eur=(n:number)=>new Intl.NumberFormat('de-DE',{style:'currency',currency:'EUR'}).format(n||0);
