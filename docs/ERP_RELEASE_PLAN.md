# KASTONIA ERP Releaseplan

## Release-Strategie

Die Entwicklung erfolgt in großen, fachlich zusammenhängenden Versionen. Jede Version erweitert die ERP-Grundlage, ohne die gemeinsame Datenarchitektur zu fragmentieren. Vor neuen Funktionen müssen Datenmodelle, Migrationen, Statusmodelle, Nummernkreise und Tests definiert sein.

## v1.5 – Core Business Suite

### Ziel

v1.5 schafft die kaufmännische und operative Basis für den digitalen Kernprozess vom Auftrag über Einkauf, Montage, Rechnung, Zahlung, Steuern und DATEV-Export bis zu Dashboard und Reporting.

### Umfang

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

### Technische Voraussetzungen

- Gemeinsame Kernmodelle für Projekt, Kunde, Lieferant, Dokument, Rechnung und Zahlung.
- Zentrale Nummernkreise.
- Definierte Statusmodelle.
- Migrationsmechanismus für persistierte Daten.
- Teststrategie für neue Module.
- Konsistente Projektverknüpfungen.

### Ergebnis

Nach v1.5 soll das System die wichtigsten operativen und kaufmännischen Abläufe intern abbilden und auswerten können. DATEV wird als Export vorbereitet, nicht als vollständige bidirektionale Integration.

## v2.0 – Intelligente Prozessunterstützung und Kundeninteraktion

### Ziel

v2.0 erweitert das ERP um Automatisierungen, KI-Assistenz und ein Kundenportal. Diese Funktionen setzen stabile Datenmodelle aus v1.5 voraus.

### Umfang

- KI
- Automatisierungen
- Kundenportal

### Technische Voraussetzungen

- Ereignis- oder Workflow-Basis für Statusänderungen.
- Rollen- und Rechtekonzept für externe Zugriffe.
- Datenschutz- und Berechtigungskonzept für KI-Nutzung.
- Dokumentenfreigaben und projektbezogene Sichtbarkeit.

### Ergebnis

Das System unterstützt Nutzer proaktiv, reduziert manuelle Folgeaufgaben und ermöglicht kontrollierte Kundenkommunikation über ein Portal.

## v2.5 – Lager, Materialverwaltung und mobile Optimierungen

### Ziel

v2.5 ergänzt die operative Materialbasis und verbessert mobile Nutzbarkeit für Außendienst- und Montageprozesse.

### Umfang

- Lager
- Materialverwaltung
- mobile Optimierungen

### Technische Voraussetzungen

- Materialstammdaten.
- Bestands- und Bewegungsmodell.
- Verknüpfung mit Einkauf, Lieferungen, Projekten und Montage.
- Responsive Optimierungen für häufige mobile Workflows.

### Ergebnis

Materialbestände, Reservierungen, Projektverbrauch und mobile Arbeitsabläufe werden transparent und auswertbar.

## v3.0 – Monteur-App, Cloud-Synchronisation und vollständige DATEV-Anbindung

### Ziel

v3.0 vollendet den mobilen und integrativen Ausbau des ERP.

### Umfang

- Monteur-App
- Cloud-Synchronisation
- vollständige DATEV-Anbindung

### Technische Voraussetzungen

- Offline-/Online-Synchronisationskonzept.
- Konfliktauflösung für mobile Daten.
- Sichere Authentifizierung und Rollenmodell.
- Ausgereifte DATEV-Datenqualität, Belegreferenzen und Exporthistorie.

### Ergebnis

Monteurprozesse laufen mobil, Daten werden synchronisiert, und DATEV-Prozesse sind vollständig in die kaufmännische Prozesskette eingebunden.

## Offene Punkte

- Entscheidung über langfristige Datenbank- und Backend-Architektur.
- Definition eines Rollen- und Rechtekonzepts.
- Detailkonzept für Dokumentenspeicher und Belegarchiv.
- Auswahl und Spezifikation des DATEV-Exportformats.
- Migrationskonzept für bestehende Browserdaten.
- Teststrategie für Fachmodule, Berechnungen und Migrationen.
- Datenschutz- und Sicherheitskonzept für KI, Kundenportal und Monteur-App.


## v1.5 – Teil 1 Einkauf, Lieferanten und Lieferungen

Implementiert sind Lieferantenstammdaten, projektbezogene Lieferantenbestellungen mit Nummernkreis `BEYYYYNNNN`, Wareneingang mit Teil-/Restmengen, automatische Bestellstatus-Aktualisierung und Dashboard-Kennzahlen für Einkauf und Lieferungen. Details: `docs/PURCHASING_AND_SUPPLIERS.md`.

## v1.6 · Project Lifecycle

Release-Schwerpunkt: praxistauglicher Projektablauf von Anfrage bis Abschluss, Rollen ADMIN/MITARBEITER, mobile Baustellenkommunikation, Material-/Werkzeugmeldungen und vorbereitete externe Benachrichtigungsschnittstelle.


## v1.7 · Operations Center

KASTONIA ERP v1.7 ergänzt Montageplanung, Mitarbeiterzuweisung, mobile Arbeitszeiterfassung, Baustellenmeldungen, zentrale Einkaufsliste, Materialbedarfe aus angenommenen Angeboten, Verbrauchsmaterial, Werkzeugverwaltung, Fahrzeug-/TÜV-/Serviceüberwachung, interne Benachrichtigungen und zentrale Berechtigungsprüfungen. Bestellungen werden weiterhin im bestehenden Einkaufsmodul erzeugt.


## v1.8 · Cloud Foundation

KASTONIA ERP ist für Supabase Auth, PostgreSQL Row Level Security, Supabase Storage, kontrollierte lokale Datenmigration und Vercel-Deployments vorbereitet. Mitarbeiter sehen ausschließlich eigene, zugewiesene, vergangene oder durch eigene Zeiten/Meldungen/Bilder belegte Baustellen; Preise, Margen, Rechnungen und Lieferantenkonditionen bleiben für Mitarbeiter serverseitig gesperrt.
