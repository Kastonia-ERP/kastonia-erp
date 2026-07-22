# KASTONIA ERP Roadmap

## Projektvision

KASTONIA ERP soll den vollständigen Geschäftsprozess eines projektorientierten Unternehmens digital, nachvollziehbar und auswertbar abbilden. Das Zielsystem verbindet Vertrieb, Projektabwicklung, Einkauf, Montage, Finanzen, Steuerprozesse, DATEV-Vorbereitung und Management-Auswertungen in einer modularen Anwendung.

Der langfristig abzubildende Prozess lautet:

```text
Lead → Kunde → Projekt → Angebot → Auftrag → Einkauf → Lieferanten → Lieferung → Dokumente → Montage → Abnahme → Rechnung → Zahlung → Steuern & Abgaben → DATEV → Auswertungen
```

## Leitprinzipien

- Keine isolierten Insellösungen: Jedes Modul nutzt gemeinsame Datenmodelle und eindeutige Beziehungen.
- Projektzentrierung: Projekte sind der zentrale Anker für Angebote, Aufträge, Einkauf, Montage, Dokumente, Rechnungen und Zahlungen.
- Nachvollziehbarkeit: Statuswechsel, Nummernkreise, Dokumente und finanzielle Vorgänge müssen revisionsfähig vorbereitet werden.
- Erweiterbarkeit: Neue Module werden modular ergänzt, ohne bestehende Stores oder Datenmodelle zu duplizieren.
- Mobile Nutzbarkeit: Alle Kernprozesse müssen langfristig auf Desktop, Tablet und Smartphone nutzbar sein.

## Modul-Roadmap

| Modul | Zweck | Beziehungen | Abhängigkeiten | Aktueller Stand | Geplanter Endstand | Priorität |
|---|---|---|---|---|---|---|
| CRM | Verwaltung von Leads, Kunden, Kontakten und Vertriebsaktivitäten. | Verknüpft Leads/Kunden mit Projekten, Angeboten, Dokumenten und Rechnungen. | Gemeinsames Kontakt- und Adressmodell, Nummernkreise, Statusmodell. | Basisziel dokumentiert; bestehender Funktionsumfang wird nicht verändert. | Vollständiger Lead-zu-Kunde-Prozess mit Historie, Aktivitäten und Projektübergabe. | Hoch |
| Projekte | Zentrale Klammer für operative und kaufmännische Vorgänge. | Verbindet Kunden, Angebote, Aufträge, Einkauf, Montage, Dokumente, Rechnungen, Zahlungen und Reporting. | CRM, Nummernkreise, Statusmodelle, Dokumentenverwaltung. | Projektmodell ist als Kernobjekt vorgesehen. | Projektakte mit Status, Aufgaben, Budget, Dokumenten, Terminen und Kennzahlen. | Sehr hoch |
| Angebote | Erstellung und Nachverfolgung von Angeboten. | Verknüpft Kunden, Projekte, Positionen, Dokumente und spätere Aufträge. | CRM, Projekte, Berechnungslogik, Nummernkreise, Dokumente. | Zielmodul geplant. | Versionierte Angebote mit Kalkulation, PDF-Erzeugung, Status und Auftragsübergabe. | Hoch |
| Einkauf | Bedarfsermittlung und Bestellprozess für Projekte. | Verknüpft Projekte, Lieferanten, Lieferungen, Lager und Rechnungen. | Projekte, Lieferanten, Lager, Nummernkreise, Statusmodelle. | In v1.5 geplant. | Projektbezogene Bestellungen, Bestellstatus, Wareneingang und Kostenkontrolle. | Sehr hoch |
| Lieferanten | Verwaltung von Lieferantenstammdaten und Konditionen. | Verknüpft Einkauf, Lieferungen, Dokumente, Rechnungen und Reporting. | Adressmodell, Dokumente, Einkauf. | In v1.5 geplant. | Lieferantenakte mit Kontakten, Konditionen, Bestellungen, Dokumenten und Auswertungen. | Hoch |
| Lieferungen | Verwaltung von Lieferterminen, Wareneingängen und Lieferstatus. | Verknüpft Einkauf, Projekte, Lieferanten, Lager und Dokumente. | Einkauf, Lieferanten, Lager, Statusmodelle. | Zielmodul geplant. | Transparente Lieferkette mit Teillieferungen, Lieferscheinen und Abweichungen. | Hoch |
| Dokumente | Zentrale Ablage und Zuordnung aller Projekt- und Geschäftsdokumente. | Verknüpft alle Fachmodule über eindeutige Referenzen. | Persistenz, Projektverknüpfungen, Dateispeicher, Metadaten. | In v1.5 geplant. | Dokumentenakte mit Kategorien, Versionen, Belegen, Exportfähigkeit und Aufbewahrungslogik. | Sehr hoch |
| Montage | Planung, Durchführung und Dokumentation von Montageleistungen. | Verknüpft Projekte, Monteure, Termine, Dokumente, Abnahmen und Rechnungen. | Projekte, Dokumente, Statusmodelle, später Monteur-App. | In v1.5 geplant. | Montageplanung mit Einsatzdaten, Checklisten, Fotos, Abnahmeprotokollen und Rückmeldungen. | Sehr hoch |
| Rechnungen | Erstellung und Verwaltung von Ausgangsrechnungen. | Verknüpft Kunden, Projekte, Aufträge, Dokumente, Zahlungen, Steuern und DATEV. | Projekte, Angebote/Aufträge, Berechnungen, Nummernkreise, Steuern. | In v1.5 geplant. | Abschlags-, Teil- und Schlussrechnungen mit Status, PDF, Zahlungsabgleich und DATEV-Daten. | Sehr hoch |
| Zahlungen | Erfassung und Abgleich von Zahlungseingängen und offenen Posten. | Verknüpft Rechnungen, Kunden, Projekte, Dashboard und Reporting. | Rechnungen, Bank-/Importdaten, Statusmodelle. | In v1.5 geplant. | OPOS-Übersicht, Zahlungsstatus, Mahnvorbereitung und Liquiditätsauswertung. | Hoch |
| Steuern & Abgaben | Abbildung steuerrelevanter Fälligkeiten und Auswertungen. | Verknüpft Rechnungen, Zahlungen, DATEV, Dashboard und Reporting. | Rechnungen, Zahlungen, DATEV-Vorbereitung, Berechnungslogik. | In v1.5 geplant. | Steuerübersichten, Fälligkeiten, Umsatzsteuer-Auswertung und vorbereitende Buchhaltungsdaten. | Hoch |
| DATEV | Export und langfristige Anbindung an DATEV-Prozesse. | Verknüpft Rechnungen, Zahlungen, Steuern, Lieferanten und Dokumente. | Einheitliche Belegdaten, Kontierung, Exportformate, Dokumentenverwaltung. | DATEV-Export in v1.5 geplant; vollständige Anbindung in v3.0. | Validierte Exporte, Belegreferenzen, Buchungsvorschläge und perspektivisch vollständige DATEV-Anbindung. | Sehr hoch |
| Dashboard | Management-Übersicht über operative und finanzielle Kennzahlen. | Liest Daten aus Projekten, Rechnungen, Zahlungen, Steuern, Einkauf und Reporting. | Gemeinsame Selektoren, Reporting-Datenmodell. | Business-Cockpit ist aktueller Projektstand. | Rollenbasierte Cockpits mit Live-KPIs, Warnungen und Drilldowns. | Hoch |
| Reporting | Auswertungen für Umsatz, Gewinn, Liquidität, Projekte, Einkauf und Steuern. | Nutzt aggregierte Daten aus allen Kernmodulen. | Gemeinsame Datenmodelle, Berechnungen, Statusmodelle. | In v1.5 geplant. | Standardberichte, Filter, Exportmöglichkeiten und Management-Auswertungen. | Hoch |
| Automatisierungen | Regelbasierte Prozessunterstützung und Erinnerungen. | Verknüpft Statusmodelle, Aufgaben, Dokumente, Rechnungen und Kundenportal. | Stabile Modulereignisse, Benachrichtigungen, Rollenmodell. | In v2.0 geplant. | Automatisierte Workflows, Erinnerungen, Statusaktionen und Folgeaufgaben. | Mittel |
| KI | Assistenzfunktionen für Analyse, Dokumente, Kommunikation und Planung. | Nutzt strukturierte Daten aus CRM, Projekten, Dokumenten und Reporting. | Datenschutzkonzept, klare Datenzugriffe, Automatisierungsbasis. | In v2.0 geplant. | KI-Assistenz für Zusammenfassungen, Vorschläge, Auswertungen und Prozesshinweise. | Mittel |
| Kundenportal | Externer Zugang für Kunden zu Projektinformationen und Dokumenten. | Verknüpft Kunden, Projekte, Angebote, Dokumente, Abnahmen und Rechnungen. | Rollen/Rechte, Dokumente, Statusmodelle, sichere Authentifizierung. | In v2.0 geplant. | Portal für Freigaben, Dokumente, Projektstatus, Kommunikation und Rechnungsinformationen. | Mittel |
| Monteur-App | Mobile Anwendung für Montageeinsätze. | Verknüpft Montage, Projekte, Dokumente, Abnahmen und Cloud-Synchronisation. | Montage, mobile Optimierungen, Offline-/Sync-Konzept. | In v3.0 geplant. | Mobile App für Einsätze, Zeiten, Fotos, Checklisten, Material und Abnahmen. | Mittel |
| Lager | Verwaltung von Material, Beständen und Bewegungen. | Verknüpft Einkauf, Lieferungen, Projekte, Montage und Reporting. | Einkauf, Lieferungen, Materialstammdaten, Nummernkreise. | In v2.5 geplant. | Materialverwaltung mit Beständen, Reservierungen, Projektverbrauch und Inventurgrundlage. | Mittel |

## Empfohlene Reihenfolge

1. Gemeinsame Datenmodelle, Statusmodelle, Nummernkreise und Migrationsregeln stabilisieren.
2. Projektakte als zentrale Verknüpfungsebene schärfen.
3. v1.5-Kernmodule Einkauf, Lieferanten, Dokumente, Montage, Rechnungen, Zahlungen, Steuern, DATEV, Dashboard und Reporting planen und nacheinander umsetzen.
4. Automatisierungen, KI und Kundenportal erst nach stabilen Daten- und Prozessgrundlagen starten.
5. Lager, mobile Optimierungen und Monteur-App auf Basis der operativen Module ausbauen.
