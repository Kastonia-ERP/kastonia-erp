# KASTONIA ERP v0.9 Projektakte UI

## Neue Route

Die sichtbare Projektakte ist als dynamische Next.js-App-Router-Seite unter `/projekte/[id]` umgesetzt. Die ID wird aus der URL gelesen und gegen die vorhandenen Projekte im Store geprüft. Unbekannte IDs zeigen eine verständliche Fehlermeldung mit Link „Zurück zu Projekte“.

## Verwendete Komponenten

Die Seiten nutzen weiterhin das bestehende `Shell`-Layout mit dunkler Seitenleiste, heller Inhaltsfläche, Kartenoptik und goldener Akzentfarbe. Die Projektakte verwendet lokale, schlanke UI-Bausteine für Informationszeilen, Abschnitte, Listen und Leerzustände.

## Projektübersicht

Die bestehende Seite `/projekte` bleibt erhalten und wurde erweitert. Sie zeigt Projektnummer, Kunde, Projektbezeichnung, Projekttyp, Status, Phase, Priorität, Verantwortlicher, Projektwert, Montagetermin und zuletzt geändert. Projektnummer und Projektbezeichnung verlinken auf `/projekte/[id]`.

## Kopfbereich

Der Kopfbereich der Projektakte zeigt Projektnummer, Projektname, Kunde, Status, Phase, Priorität, Verantwortlicher, Erstellungsdatum und zuletzt geändert. Status, Phase und Priorität werden als Badges dargestellt. Zusätzlich gibt es „Zurück zu Projekte“ und „Projekt bearbeiten“.

## Fortschrittsanzeige

Der Projektfortschritt nutzt die Hauptschritte Neue Anfrage, Kontakt, Termin, Aufmaß, Angebot, Auftrag, Bestellung, Montage, Rechnung, Bezahlt und Abgeschlossen. Die Zuordnung erfolgt über `getProjectRecordStep()` in `lib/models/project-helpers.ts`. Bereits durchlaufene Schritte erscheinen erledigt, der aktuelle Schritt wird deutlich hervorgehoben.

## Finanzberechnungen

Die Finanzkarte verwendet die vorhandenen Helfer aus `lib/models/project-helpers.ts`: Marge netto, offene Kundenzahlung und offene Lieferantenzahlung. Ergänzt wurde ein Helfer für die Marge in Prozent, damit Geschäftslogik nicht direkt im JSX dupliziert wird.

## Bearbeitbare Felder

In diesem Sprint können Status, Phase, Priorität, Verantwortlicher und Montagetermin bearbeitet werden. Die Speicherung erfolgt über `updateProjectBase()` im Store. Dabei wird `updatedAt` aktualisiert und die bestehende localStorage-Persistenz schreibt weiterhin in `kastonia-erp-v09` mit `schemaVersion` 9.

## Store-Anbindung

Die Projektakte lädt Daten aus dem vorhandenen React-Store. Die Migration von `kastonia-erp-v07` und der Storage-Key `kastonia-erp-v09` bleiben unverändert. Bestehende Nutzerdaten werden beim Laden normalisiert, aber nicht gelöscht.

## Responsive Verhalten

Auf Desktop werden Übersichtskarten in Spalten dargestellt. Auf Tablet und Smartphone stapeln sich Karten und Metadaten untereinander. Tabellen und Fortschrittselemente bleiben horizontal scrollbar, damit Inhalte nicht abgeschnitten werden und Schaltflächen bedienbar bleiben.

## Bekannte Einschränkungen

Es gibt noch keine automatische Workflow-Logik zwischen Statuswechseln und Folgedokumenten. Angebote, Rechnungen, Lieferantenbestellungen, Dokumente und Kommunikation werden nur angezeigt; vollständige Erfassungsformulare sind bewusst nicht Bestandteil dieses Sprints.
