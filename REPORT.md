# KASTONIA ERP v0.8 – Technischer Audit

## Umfang

Geprüft wurde das vollständige Repository im aktuellen Stand auf dem Branch `chore/technical-audit`. Ziel war eine technische Bestandsaufnahme vor der Entwicklung neuer Funktionen. Geschäftslogik und Design wurden nicht verändert.

## Vorhandene Seiten und Module

### App Router Seiten

- `/` – Login-/Startseite.
- `/dashboard` – Geschäftsführer-Cockpit mit KPIs, Liquiditätsprognose, Aufgaben und Terminen.
- `/angebote` – Angebotsübersicht und einfache Angebotserfassung.
- `/angebotsvorbereitung` – interne Kalkulation mit Positionen, Faktoren, USt und Übergabestatus.
- `/aufgaben` – Aufgabenverwaltung mit Priorität, Fälligkeit und Erledigt-Status.
- `/daten` – Datenexport/-import, Backup und Reset.
- `/einstellungen` – zentrale Einstellwerte wie Planumsatz, Steuerrücklage und Startliquidität.
- `/finanzen` – Einnahmen-/Ausgabenverwaltung.
- `/kalender` – Kalender- und Terminübersicht.
- `/kalkulation` – Kalkulations-/Angebotsrechner.
- `/kalkulationsarchiv` – Archiv gespeicherter interner Kalkulationen.
- `/kunden` – Kundenverwaltung.
- `/lieferanten` – Lieferantenübersicht.
- `/projekte` – Projektverwaltung.
- `/rechnungen` – Ein- und Ausgangsrechnungen.
- `/steuern` – Steuertermine und Zahlungsstatus.

### Gemeinsame Komponenten

- `components/Shell.tsx` stellt das Grundlayout mit Navigation und Hauptbereich bereit.
- `components/Nav.tsx` stellt die feste Seiten-/Mobile-Navigation bereit.
- `app/layout.tsx` bindet globale Styles und den StoreProvider ein.

### Datenhaltung

- Die Datenhaltung ist vollständig clientseitig in `lib/store.tsx` umgesetzt.
- Initialdaten werden im Code definiert.
- Persistenz erfolgt über `localStorage` unter dem Schlüssel `kastonia-erp-v07`.
- Export erfolgt als JSON-Datei über den Browser.
- Es gibt keine Server Actions, API Routes, Datenbankmigrationen oder externen Backend-Abhängigkeiten.

## Technischer Ist-Zustand

### Next.js-Struktur

- Das Projekt verwendet den Next.js App Router unter `app/`.
- Alle geprüften Seiten werden statisch prerendered.
- `next.config.ts` setzt sicherheitsrelevante HTTP-Header und deaktiviert den `X-Powered-By`-Header.
- Die Anwendung ist für Vercel grundsätzlich kompatibel, da keine nicht unterstützten Serverabhängigkeiten oder Dateisystem-Schreibzugriffe im Runtime-Code gefunden wurden.

### TypeScript

- `strict` ist in `tsconfig.json` aktiviert.
- `npm exec tsc -- --noEmit` läuft erfolgreich durch.
- Der Code verwendet aktuell an vielen Stellen `any`, insbesondere beim Zugriff auf Store-Daten in UI-Seiten. Das ist kein Build-Fehler, reduziert aber die Aussagekraft der Typprüfung.

### Build

- `npm run build` läuft erfolgreich durch.
- Next.js 16.0.10 kompiliert die Anwendung mit Turbopack und erzeugt statische Seiten für alle vorhandenen Routen.
- Der Build gibt Hinweise aus, dass `baseline-browser-mapping` älter als zwei Monate ist. Das ist eine Wartungswarnung und kein Fehler.

### ESLint

- Im Repository ist aktuell kein ESLint-Script und keine ESLint-Konfiguration vorhanden.
- Eine nachträgliche Installation von ESLint-Abhängigkeiten war in der Ausführungsumgebung durch Registry-/Policy-Fehler blockiert (`403 Forbidden`).
- ESLint konnte deshalb nicht als tatsächlicher Projektcheck ausgeführt werden.

### Routing

- Alle Navigationseinträge in `components/Nav.tsx` zeigen auf vorhandene App-Router-Seiten.
- Der Login leitet auf `/dashboard` weiter.
- Es wurden keine fehlenden statischen Routen in der Navigation gefunden.

### Komponenten

- Die gemeinsame Shell-/Nav-Struktur ist schlank und wiederverwendbar.
- Es gibt keine tiefe Komponentenstruktur; viele Seiten enthalten Formular-, Tabellen- und Geschäftsdarstellungslogik direkt in der jeweiligen `page.tsx`.
- Das ist für v0.8 technisch lauffähig, erschwert aber spätere Tests, Wiederverwendung und Wartung.

### Responsive Darstellung

- Die globalen Styles enthalten Breakpoints für Navigation, Grid-Layouts, Cockpit-KPIs, Tabellenumbruch und mobile Navigation.
- Breite Tabellen wie die Angebotsvorbereitung sind horizontal scrollbar gekapselt.
- Es wurde keine visuelle Änderung vorgenommen.

## Gefundene Fehler und behobene technische Punkte

### Behoben

- Es fehlte eine `.gitignore`. Dadurch wurden lokale Installations- und Build-Artefakte wie `node_modules/`, `.next/` und `*.tsbuildinfo` als unversionierte Dateien sichtbar. Eine projekttypische `.gitignore` wurde ergänzt.

### Nicht behoben, da keine technische Build-Blockade oder durch Umgebung blockiert

- ESLint ist nicht eingerichtet. Da die Registry-Installation in dieser Umgebung mit `403 Forbidden` blockiert wurde, wurde keine unvollständige ESLint-Konfiguration committed.
- Die App zeigt an einzelnen Stellen noch Versionshinweise mit `0.7` bzw. nutzt einen `localStorage`-Key mit `v07`. Das ist ein Konsistenzrisiko für v0.8, wurde aber nicht verändert, um keine Datenmigration oder Benutzer-Datenkompatibilität zu beeinflussen.
- Die Nutzung von `any` in Seiten und Store-API wurde nicht ersetzt, da dies eine größere Refaktorierung und potenziell funktionale Seiteneffekte hätte.

## Risiken

- Ausschließlich clientseitige Speicherung: Browserdaten können gelöscht werden, sind gerätegebunden und nicht mehrbenutzerfähig.
- Keine Authentifizierung: Die Login-Seite ist aktuell eine lokale Demo-Barriere und kein Sicherheitsmechanismus.
- Keine automatisierten Tests: Es gibt keine Unit-, Integration- oder E2E-Tests.
- Kein ESLint im Projekt: Codequalität und potenzielle React-/Next.js-Regelverstöße werden nicht automatisiert geprüft.
- Viele `any`-Typen: Fehler in Datenstrukturänderungen können unentdeckt bleiben.
- Harte Initialdaten im Store: Demo- und Produktivdaten sind nicht sauber getrennt.
- ZIP-Datei im Repository: Das Archiv `kastonia-erp-webapp-v0.8-business-cockpit.zip` erhöht Repository-Größe und kann zu Abweichungen zwischen Quellcode und Archiv führen.
- Fehlende CI: Build- und TypeScript-Prüfungen werden nicht automatisch vor Pull Requests erzwungen.

## Verbesserungsvorschläge

- ESLint mit Next.js-Konfiguration und einem `npm run lint`-Script einrichten, sobald Registry-Zugriff verfügbar ist.
- Einen `npm run typecheck`-Script ergänzen, der `tsc --noEmit` ausführt.
- Store-API typisieren und `any` schrittweise aus Seiten entfernen.
- Datenmodell aus `lib/store.tsx` in separate Typ-, Seed- und Persistenzmodule aufteilen.
- Eine echte Authentifizierung und serverseitige Datenhaltung für produktiven Betrieb planen.
- Basis-Tests für kritische Berechnungen, Store-Operationen und Routing hinzufügen.
- CI-Workflow für `npm ci`, TypeScript und Build ergänzen.
- Versionsanzeige und Persistenz-Key für v0.8/v0.9 bewusst migrieren.
- ZIP-Artefakte künftig außerhalb des Quellcode-Repositories bereitstellen oder eindeutig dokumentieren.

## Empfohlener Plan für Version 0.9

1. Projektqualität absichern:
   - ESLint und TypeScript-Check als Scripts ergänzen.
   - CI für Pull Requests einrichten.
   - Build auf Node-Version gemäß `engines` prüfen.
2. Datenmodell stabilisieren:
   - Zentrale Typen und Store-Methoden vollständig typisieren.
   - Persistenz-Versionierung und Migration für `localStorage` einführen.
3. Kritische Berechnungen testbar machen:
   - Kalkulationsfunktionen aus UI-Komponenten extrahieren.
   - Unit-Tests für Margen, USt, Brutto/Netto und Liquidität ergänzen.
4. Produktivfähigkeit vorbereiten:
   - Authentifizierungskonzept definieren.
   - Datenbank-/Backend-Strategie festlegen.
   - Backup-/Importformat versionieren.
5. UI-Wartbarkeit verbessern:
   - Wiederkehrende Tabellen, Formulare, KPI-Karten und Status-Badges in Komponenten auslagern.
   - Barrierefreiheit und Tastaturbedienung prüfen.
6. Release v0.9 verifizieren:
   - `npm ci`, TypeScript, Lint, Build und Smoke-Test auf Vercel Preview ausführen.
