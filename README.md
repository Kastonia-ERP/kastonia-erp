# KASTONIA ERP Web-App v0.8

KASTONIA ERP ist eine projektorientierte ERP-Web-App. Der aktuelle Stand fokussiert sich auf ein Geschäftsführer-Business-Cockpit und die technische Planung für den Ausbau zur vollständigen ERP-Suite.

## Aktueller Projektstand

Die Anwendung enthält in v0.8 ein Business-Cockpit als Startpunkt für operative und kaufmännische Transparenz.

### Neu in v0.8

- Geschäftsführer-Business-Cockpit als neue Startseite
- Live-KPIs für Liquidität, Forderungen, Lieferanten, Steuern, Umsatz und Gewinn
- 30-/60-/90-Tage-Liquiditätsprognose
- Liquiditätskurve und Umsatz-/Gewinnvergleich
- Automatischer Handlungsbedarf aus Rechnungen, Steuern und Aufgaben
- Aluprof-Rechnung und Gewerbesteuertermine ergänzt
- Responsive für Desktop, iPad und Smartphone

## Projektvision

Das ERP soll langfristig den vollständigen Geschäftsprozess digital abbilden:

```text
Lead → Kunde → Projekt → Angebot → Auftrag → Einkauf → Lieferanten → Lieferung → Dokumente → Montage → Abnahme → Rechnung → Zahlung → Steuern & Abgaben → DATEV → Auswertungen
```

Die technische Planung ist in den folgenden Dokumenten beschrieben:

- [ERP Roadmap](docs/ERP_ROADMAP.md)
- [ERP Architektur](docs/ERP_ARCHITECTURE.md)
- [ERP Releaseplan](docs/ERP_RELEASE_PLAN.md)

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
