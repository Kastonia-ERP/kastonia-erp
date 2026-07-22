'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
const items = [
  ['Dashboard','/dashboard'],['Kunden','/kunden'],['Angebote','/angebote'],['Angebotsvorbereitung','/angebotsvorbereitung'],['Kalkulationsarchiv','/kalkulationsarchiv'],['Projekte','/projekte'],['Operations Center','/operations'],['Einsatzplanung','/einsatzplanung'],['Personalplanung','/personalplanung'],['Mitarbeiter Mobile','/mitarbeiter-mobile'],['Baustellenmeldungen','/baustellenmeldungen'],['Mitarbeiter','/mitarbeiter'],['Benutzer','/benutzer'],['Cloud Setup','/admin/cloud-setup'],['Einkauf','/einkauf'],['Lieferanten','/lieferanten'],['Lieferungen','/lieferungen'],
  ['Kalender','/kalender'],['Aufgaben','/aufgaben'],['Rechnungsübersicht','/rechnungen'],['Finanzen','/finanzen'],['Steuern','/steuern'],['Daten & Backup','/daten'],['Einstellungen','/einstellungen']
];
export default function Nav(){const p=usePathname();return <aside className="nav"><details className="tabletNav" open><summary><span className="brand compact"><span>K</span><div><b>KASTONIA ERP</b><small>Menü</small></div></span></summary><div className="brand fullBrand"><span>K</span><div><b>KASTONIA ERP</b><small>v1.9.3 · Personnel Availability & Annual Workforce Planning</small></div></div><nav>{items.map(([n,h])=><Link className={p===h?'active':''} href={h} key={h}>{n}</Link>)}</nav><div className="user"><b>Gökhan Karayel</b><small>Administrator · Cloud-ready · Supabase vorbereitet</small></div></details></aside>}
