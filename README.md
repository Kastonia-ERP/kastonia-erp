# KASTONIA ERP Web-App v1.5

KASTONIA ERP ist eine projektorientierte ERP-Web-App. Der aktuelle Stand fokussiert sich auf ein Geschäftsführer-Business-Cockpit und die technische Planung für den Ausbau zur vollständigen ERP-Suite.

## Aktueller Projektstand

Die Anwendung enthält in v1.5 den ersten Teil der Core Business Suite mit Business-Cockpit, Angebots-Engine, Lieferantenverwaltung, Einkauf und Lieferungen.

### Neu in v1.5 Core Business Suite

- Geschäftsführer-Business-Cockpit als neue Startseite
- Live-KPIs für Liquidität, Forderungen, Lieferanten, Steuern, Umsatz und Gewinn
- 30-/60-/90-Tage-Liquiditätsprognose
- Liquiditätskurve und Umsatz-/Gewinnvergleich
- Automatischer Handlungsbedarf aus Rechnungen, Steuern und Aufgaben
- Aluprof-Rechnung und Gewerbesteuertermine ergänzt
- Responsive für Desktop, iPad und Smartphone
- Lieferantenverwaltung mit Lieferantenakte, Suche, Filter, Kategorien und Projektverknüpfungen
- Einkauf mit Lieferantenbestellungen, Positionen, Rabatt-/Mehrwertsteuerberechnung und Nummernkreis `BEYYYYNNNN`
- Wareneingang mit Teillieferungen, Restmengen, beschädigter Ware, Reklamationsnotizen und automatischen Statuswechseln
- Dashboard-Kennzahlen für offene Bestellungen, Lieferanten, Bestellwert, überfällige Lieferungen und Lieferstatus

## Projektvision

Das ERP soll langfristig den vollständigen Geschäftsprozess digital abbilden:

```text
Lead → Kunde → Projekt → Angebot → Auftrag → Einkauf → Lieferanten → Lieferung → Dokumente → Montage → Abnahme → Rechnung → Zahlung → Steuern & Abgaben → DATEV → Auswertungen
```

Die technische Planung ist in den folgenden Dokumenten beschrieben:

- [ERP Roadmap](docs/ERP_ROADMAP.md)
- [ERP Architektur](docs/ERP_ARCHITECTURE.md)
- [ERP Releaseplan](docs/ERP_RELEASE_PLAN.md)
- [Einkauf, Lieferanten und Lieferungen](docs/PURCHASING.md)

## Roadmap-Überblick

Die Roadmap beschreibt Zweck, Beziehungen, Abhängigkeiten, aktuellen Stand, geplanten Endstand und Priorität der folgenden Module:

- CRM
- Projekte
- Angebote
- Einkauf
- Lieferanten
- Lieferungen
- Dokumente
- Montage
- Rechnungen
- Zahlungen
- Steuern & Abgaben
- DATEV
- Dashboard
- Reporting
- Automatisierungen
- KI
- Kundenportal
- Monteur-App
- Lager

## Architektur-Überblick

Die Zielarchitektur ist modular und projektzentriert. Zentrale Grundsätze sind:

- gemeinsame Datenmodelle statt doppelter Fachmodelle,
- eindeutige Beziehungen über IDs und Projektverknüpfungen,
- getrennte Schichten für UI, Businesslogik und Persistenz,
- zentrale Nummernkreise,
- dokumentierte Statusmodelle,
- Migrationen bei persistierten Datenänderungen,
- testbare Berechnungen,
- DATEV-Vorbereitung über strukturierte Beleg- und Buchungsdaten,
- responsive UI für Desktop, Tablet und Smartphone.

## Releaseplan

### v1.5 – Core Business Suite

Geplanter Schwerpunkt:

- Einkauf
- Lieferanten
- Dokumente
- Montage
- Rechnungen
- Zahlungen
- Steuern & Abgaben
- DATEV Export
- Dashboard
- Reporting

### v2.0

Geplanter Schwerpunkt:

- KI
- Automatisierungen
- Kundenportal

### v2.5

Geplanter Schwerpunkt:

- Lager
- Materialverwaltung
- mobile Optimierungen

### v3.0

Geplanter Schwerpunkt:

- Monteur-App
- Cloud-Synchronisation
- vollständige DATEV-Anbindung

## Entwicklungsregeln

- TypeScript strict ist verbindlich.
- `any` ist nicht zulässig.
- Keine doppelten Datenmodelle.
- Keine redundanten Stores.
- Persistierte Datenänderungen benötigen Migrationen.
- Neue Module benötigen Tests.
- UI bleibt responsive.
- Architektur bleibt modular und erweiterbar.
- UI, Businesslogik und Persistenz bleiben klar getrennt.

## Lokal starten

```bash
npm install
npm run dev
```

## Produktions-Build prüfen

```bash
npm run build
npm start
```

## Deployment

Das Projekt ist weiterhin mit Vercel kompatibel, kann aber genauso auf einem eigenen Node.js-/Docker-Server betrieben werden. Es enthält noch keine zentrale Datenbank; Daten werden aktuell lokal im Browser gespeichert.


## v1.5 – Teil 1 Einkauf, Lieferanten und Lieferungen

Implementiert sind Lieferantenstammdaten, projektbezogene Lieferantenbestellungen mit Nummernkreis `BEYYYYNNNN`, Wareneingang mit Teil-/Restmengen, automatische Bestellstatus-Aktualisierung und Dashboard-Kennzahlen für Einkauf und Lieferungen. Details: `docs/PURCHASING.md` und `docs/PURCHASING_AND_SUPPLIERS.md`.

## Procurement Workflow

Der vollständige Beschaffungsprozess `Projekt → Bestellung → Lieferant → Lieferung → Wareneingang → Projektfortschritt` ist in der bestehenden Projektakte und im zentralen Store integriert. Enthalten sind erweiterte Lieferantenstammdaten, Bestellungen mit Nummernkreis `BEYYYYNNNN`, Wareneingänge mit Teil-/Restmengen und Reklamationen, automatische Status- und Projektfortschrittsupdates sowie neue Dashboard-KPIs. Details stehen in [Procurement Workflow](docs/PROCUREMENT_WORKFLOW.md).

## Version v1.6 · Project Lifecycle

Diese Version ergänzt zentrale Rollen (`ADMIN`, `MITARBEITER`), Projekt-Lifecycle-Felder, Timeline, Baustellenmeldungen, interne Benachrichtigungen, mobile Mitarbeiteransicht und Admin-Übersicht für Baustellenkommunikation. Demo-Accounts sind anonymisierte Demo-Logins ohne echte Passwörter.


## v1.7 · Operations Center

KASTONIA ERP v1.7 ergänzt Montageplanung, Mitarbeiterzuweisung, mobile Arbeitszeiterfassung, Baustellenmeldungen, zentrale Einkaufsliste, Materialbedarfe aus angenommenen Angeboten, Verbrauchsmaterial, Werkzeugverwaltung, Fahrzeug-/TÜV-/Serviceüberwachung, interne Benachrichtigungen und zentrale Berechtigungsprüfungen. Bestellungen werden weiterhin im bestehenden Einkaufsmodul erzeugt.


## v1.8 · Cloud Foundation

KASTONIA ERP ist für Supabase Auth, PostgreSQL Row Level Security, Supabase Storage, kontrollierte lokale Datenmigration und Vercel-Deployments vorbereitet. Mitarbeiter sehen ausschließlich eigene, zugewiesene, vergangene oder durch eigene Zeiten/Meldungen/Bilder belegte Baustellen; Preise, Margen, Rechnungen und Lieferantenkonditionen bleiben für Mitarbeiter serverseitig gesperrt.

## v1.9 · Finance, Documents & Tax Control

KASTONIA ERP v1.9 ergänzt manuelle Ausgangs- und Eingangsrechnungen, Zahlungen, offene Posten, Dokumentenmanagement, Steuerkalender, Umsatzsteuerübersicht, DATEV-/Lexoffice-Vorbereitung und ein Finanz-Dashboard. Die externe Buchhaltung bleibt führend; das ERP erzeugt keine rechtsverbindlichen Rechnungen und keine Steueranmeldungen.


## v1.9.1 · Field Operations, Documents & Finance Workflow

Der aktuelle Stand ergänzt projektbezogene Arbeitszeiterfassung, Mitarbeiter-Mobile-Ansicht, Meldungszentrale, Material-/Werkzeug-/Fahrzeugmeldungen, mobile Uploads, Projektgalerie, zentrales Dokumentenmanagement, manuelle Eingangsbelege, manuelle Ausgangsrechnungsreferenzen, Zahlungen, offene Posten, Steuerkalender, vorläufige Umsatzsteuerübersicht und DATEV-Eingangsbelegexport als strukturierte Buchhaltungsübergabe. Lexoffice/DATEV bleiben führend; keine direkte API, keine automatischen Buchungen, keine Steueranmeldungen.

## v1.9.3 · Personnel Availability & Annual Workforce Planning

- Neue Admin-Seite „Personalplanung“ mit Jahres-, Monats-, Wochen- und Tageskonzept, Filtern, Legende, Kapazität, Konflikten und Qualifikationsübersicht.
- Einsatzplanung berücksichtigt Anwesenheit, offene/genehmigte Freiwünsche, sonstige Abwesenheiten, Betriebsferien, Samstags-/Brückentagsstatus, Doppelbelegung, Fahrzeugkonflikte und Qualifikationswarnungen.
- Mobile Mitarbeiteransicht enthält „Meine Verfügbarkeit“, Jahreskalender-Hinweise, Freiwunschstatus, kommende Einsätze, Samstage, Brückentage, Betriebsferien und interne Benachrichtigungen.
