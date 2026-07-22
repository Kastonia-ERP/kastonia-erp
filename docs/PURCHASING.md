# KASTONIA ERP v1.5 Core Business Suite – Einkauf

Teil 1 der Core Business Suite bündelt Lieferantenverwaltung, Lieferantenbestellungen und Wareneingänge im bestehenden zentralen Datenmodell. Die Module arbeiten projektbezogen, nutzen den lokalen Store weiter und migrieren vorhandene Daten ohne zusätzliche Stores.

## Lieferantenverwaltung

Lieferanten enthalten Firmenname, Ansprechpartner, Adresse, Land, E-Mail, Telefon, Website, eigene Kundennummer, Zahlungsbedingungen, übliche Lieferzeit, Kategorien, Notizen, Aktivstatus sowie Erstell- und Änderungsdatum.

Die Übersicht unterstützt Suche, Kategorie-Filter, Aktiv/Inaktiv-Anzeige, Bearbeitung und Deaktivierung. Jede Lieferantenakte zeigt Stammdaten, Konditionen, Notizen, Projektverknüpfungen, Bestellungen und zugehörige Lieferungen.

## Einkauf und Bestellungen

Lieferantenbestellungen nutzen den Nummernkreis `BEYYYYNNNN`, zum Beispiel `BE20260001`. Die Nummer wird jährlich fortlaufend aus vorhandenen Bestellungen ermittelt; Timestamp-Nummern werden nicht verwendet.

Bestellungen enthalten Lieferant, optionale Projektzuordnung, Bestell- und Liefertermine, Lieferadresse, Positionen, Rabatte, Mehrwertsteuer, Netto-/USt-/Bruttosummen, Status, Zahlungsstatus, Notizen und Dokumentreferenzen.

Statuswerte: Entwurf, Angefragt, Bestellt, Teilweise geliefert, Geliefert, Storniert.

Zahlungsstatus: Offen, Teilweise bezahlt, Bezahlt.

## Lieferungen und Wareneingang

Wareneingänge referenzieren Bestellungen und optional Projekte. Positionen erfassen gelieferte, beschädigte und fehlende Mengen. Dadurch werden Teillieferungen, Restmengen, beschädigte Ware und Reklamationshinweise nachvollziehbar.

Beim Speichern eines Wareneingangs aktualisiert die zentrale Store-Logik den Bestellstatus automatisch. Vollständig gelieferte Bestellungen wechseln auf `Geliefert`; Teilmengen bleiben `Teilweise geliefert`.

## Dashboard-Kennzahlen

Das Dashboard zeigt offene Bestellungen, Lieferantenwerte, Bestellwert netto, überfällige Lieferungen, Teillieferungen, offene Lieferantenzahlungen und Bestellungen nach Status.

## Migration und Tests

Persistierte Daten werden beim Laden auf das aktuelle Schema migriert. Legacy-Lieferanten werden normalisiert, vorhandene Bestellungen werden neu berechnet und Projektverknüpfungen bleiben erhalten. Automatisierte Tests decken Nummernkreis, Lieferantenmigration, Berechnungen, Lieferstatus, Migration und Projektverknüpfungen ab.
