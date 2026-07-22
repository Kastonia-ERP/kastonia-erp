'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
const items = [
  ['Dashboard','/dashboard'],['Kunden','/kunden'],['Angebote','/angebote'],['Angebotsvorbereitung','/angebotsvorbereitung'],['Kalkulationsarchiv','/kalkulationsarchiv'],['Projekte','/projekte'],['Operations Center','/operations'],['Einsatzplanung','/einsatzplanung'],['Personalplanung','/personalplanung'],['Mitarbeiter Mobile','/mitarbeiter-mobile'],['Baustellenmeldungen','/baustellenmeldungen'],['Mitarbeiter','/mitarbeiter'],['Benutzer','/benutzer'],['Cloud Setup','/admin/cloud-setup'],['Einkauf','/einkauf'],['Lieferanten','/lieferanten'],['Lieferungen','/lieferungen'],
  ['Kalender','/kalender'],['Aufgaben','/aufgaben'],['Rechnungsübersicht','/rechnungen'],['Finanzen','/finanzen'],['Steuern','/steuern'],['Daten & Backup','/daten'],['Einstellungen','/einstellungen']
];
export default function Nav(){
 const p=usePathname();
 const [open,setOpen]=useState(false);
 useEffect(()=>setOpen(false),[p]);
 useEffect(()=>{document.body.classList.toggle('drawerOpen',open);return()=>document.body.classList.remove('drawerOpen');},[open]);
 return <>
  <header className="mobileTopbar"><Link className="brand mobileBrand" href="/dashboard"><span>K</span><div><b>KASTONIA ERP</b><small>Business Cockpit</small></div></Link><button className="hamburger" type="button" aria-controls="primary-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}><span></span><span></span><span></span><b>Menü</b></button></header>
  <button className={`drawerScrim ${open?'show':''}`} type="button" aria-label="Navigation schließen" onClick={()=>setOpen(false)}/>
  <aside className={`nav ${open?'open':''}`} id="primary-navigation" aria-label="Hauptnavigation"><div className="brand fullBrand"><span>K</span><div><b>KASTONIA ERP</b><small>v1.9.3 · Responsive Operations</small></div></div><nav>{items.map(([n,h])=><Link className={p===h?'active':''} href={h} key={h}>{n}</Link>)}</nav><div className="user"><b>Gökhan Karayel</b><small>Administrator · Cloud-ready · Supabase vorbereitet</small></div></aside>
 </>;
}
