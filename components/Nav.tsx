'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const items = [
  ['Heute','/heute'],['Dashboard','/dashboard'],['Kunden','/kunden'],['Angebote','/angebote'],['Angebotsvorbereitung','/angebotsvorbereitung'],['Kalkulationsarchiv','/kalkulationsarchiv'],['Projekte','/projekte'],['Baustellenmeldungen','/baustellenmeldungen'],['Mitarbeiter','/mitarbeiter'],['Einkauf','/einkauf'],['Lieferanten','/lieferanten'],['Lieferungen','/lieferungen'],
  ['Kalender','/kalender'],['Aufgaben','/aufgaben'],['Montageplanung','/montageplanung'],['Team & Fahrzeuge','/teams-fahrzeuge'],['Rechnungsübersicht','/rechnungen'],['Finanzen','/finanzen'],['Steuern','/steuern'],['Daten & Backup','/daten'],['Einstellungen','/einstellungen']
];
export default function Nav(){const p=usePathname();return <aside className="nav"><div className="brand"><span>K</span><div><b>KASTONIA ERP</b><small>v1.7 · Operations Center</small></div></div><nav>{items.map(([n,h])=><Link className={p===h?'active':''} href={h} key={h}>{n}</Link>)}</nav><div className="user"><b>Gökhan Karayel</b><small>Administrator · Lokal gespeichert · Backup empfohlen</small></div></aside>}
