'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
const items = [
  ['🏠','Dashboard','/dashboard'],
  ['📁','Projekte','/projekte'],
  ['📐','Aufmaß','/projekte?ansicht=aufmass'],
  ['📥','Eingangsrechnungen','/rechnungen?typ=Eingang'],
  ['📤','Ausgangsrechnungen','/rechnungen?typ=Ausgang'],
  ['💶','Liquidität','/finanzen'],
  ['📅','Steuerkalender','/steuern'],
  ['👷','Mitarbeiter','/mitarbeiter'],
  ['🗓','Kalender','/kalender'],
  ['⏱','Arbeitsstunden','/operations'],
  ['⚙','Einstellungen','/einstellungen']
];
export default function Nav(){
 const p=usePathname();
 const [currentSearch,setCurrentSearch]=useState('');
 const [open,setOpen]=useState(false);
 const drawer=useRef<HTMLElement>(null);
 useEffect(()=>setOpen(false),[p]);
 useEffect(()=>setCurrentSearch(window.location.search),[p]);
 useEffect(()=>{document.body.classList.toggle('drawerOpen',open);return()=>document.body.classList.remove('drawerOpen');},[open]);
 useEffect(()=>{if(open)drawer.current?.querySelector('nav')?.scrollTo({top:0});},[open]);
 return <>
  <header className="mobileTopbar"><Link className="brand mobileBrand" href="/dashboard"><span>K</span><div><b>KASTONIA ERP</b><small>Business Cockpit</small></div></Link><button className="hamburger" type="button" aria-controls="primary-navigation" aria-expanded={open} onClick={()=>setOpen(!open)}><span></span><span></span><span></span><b>Menü</b></button></header>
  <button className={`drawerScrim ${open?'show':''}`} type="button" aria-label="Navigation schließen" onClick={()=>setOpen(false)}/>
  <aside ref={drawer} className={`nav ${open?'open':''}`} id="primary-navigation" aria-label="Hauptnavigation"><div className="drawerHead"><div className="brand fullBrand"><span>K</span><div><b>KASTONIA ERP</b><small>Business Cockpit</small></div></div><button className="drawerClose" type="button" aria-label="Navigation schließen" onClick={()=>setOpen(false)}>×</button></div><nav>{items.map(([icon,n,h])=>{const [path,query]=h.split('?');const targetSearch=query?`?${query}`:'';const active=p===path&&(targetSearch?currentSearch===targetSearch:(path!=='/projekte'&&path!=='/rechnungen')||!currentSearch);return <Link className={active?'active':''} href={h} onClick={()=>setCurrentSearch(targetSearch)} key={`${n}-${h}`}><span aria-hidden="true">{icon}</span><b>{n}</b></Link>})}</nav><div className="user"><b>Gökhan Karayel</b><small>Administrator</small></div></aside>
 </>;
}
