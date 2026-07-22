# KASTONIA ERP Architektur

## Zielarchitektur

Die Zielarchitektur ist eine modulare, projektzentrierte ERP-Anwendung. UI, Businesslogik, Datenmodelle und Persistenz werden klar getrennt. Fachmodule greifen nicht direkt auf voneinander abweichende Datenstrukturen zu, sondern nutzen gemeinsame Kernmodelle, Selektoren und Services.

## Domänenmodell

### Kernobjekte

- `Lead`: Vertriebschance vor Kundengewinnung.
- `Customer`: Kunde mit Kontakt-, Rechnungs- und Projektdaten.
- `Project`: zentraler Geschäftsfall und Primäranker für operative Prozesse.
- `Quote`: Angebot mit Positionen, Versionen, Kalkulation und Status.
- `Order`: beauftragte Leistung als Grundlage für Einkauf, Montage und Rechnung.
- `Supplier`: Lieferant mit Kontakten, Konditionen und Dokumenten.
- `PurchaseOrder`: Bestellung für projektbezogene oder lagerbezogene Bedarfe.
- `Delivery`: Lieferung, Teillieferung oder Wareneingang.
- `Document`: Datei- oder Belegreferenz mit Metadaten und Modulzuordnung.
- `Installation`: Montageeinsatz, Checkliste, Rückmeldung oder Abnahmevorbereitung.
- `Invoice`: Rechnung mit Positionen, Steuerdaten, Status und Belegnummer.
- `Payment`: Zahlungseingang, Teilzahlung oder Zahlungsabgleich.
- `TaxRecord`: steuerrelevanter Vorgang, Auswertung oder Fälligkeit.
- `DatevExport`: Exportlauf mit Buchungsdaten, Belegreferenzen und Validierungsstatus.
- `InventoryItem`: Material- oder Lagerartikel.

### Beziehungen

- Ein Kunde kann mehrere Projekte besitzen.
- Ein Projekt kann mehrere Angebote, Aufträge, Bestellungen, Lieferungen, Dokumente, Montageeinsätze, Rechnungen und Zahlungen bündeln.
- Ein Angebot gehört zu einem Kunden und optional zu einem Projekt; nach Annahme entsteht ein Auftrag.
- Eine Bestellung gehört zu einem Lieferanten und optional zu einem Projekt oder Lagerbedarf.
- Lieferungen referenzieren Bestellungen und können Materialbewegungen auslösen.
- Rechnungen referenzieren Projekte, Kunden, Aufträge und Dokumente.
- Zahlungen referenzieren Rechnungen und aktualisieren deren Zahlungsstatus.
- DATEV-Exporte referenzieren Rechnungen, Zahlungen, Steuerdaten und Belege.

## Store-Konzept

- Es gibt eine zentrale Quelle der Wahrheit je Fachdomäne.
- Stores dürfen keine vollständigen Kopien fremder Domänen halten.
- Abgeleitete Werte werden über Selektoren oder Berechnungsservices erzeugt.
- Modulübergreifende Ansichten verwenden IDs und Referenzen statt duplizierter Objekte.
- Neue Module erhalten klar abgegrenzte Store-Bereiche und dokumentierte Schnittstellen.

## Persistenz

Kurzfristig kann die bestehende lokale Browser-Persistenz weiter als Entwicklungsgrundlage dienen. Die Zielarchitektur muss jedoch eine austauschbare Persistenzschicht vorsehen:

- Repository-/Adapter-Schicht zwischen Businesslogik und Speichermedium.
- Serialisierbare Datenmodelle mit Versionierung.
- Validierung beim Laden und Speichern.
- Migrationspfad von lokaler Persistenz zu serverseitiger Datenbank.
- Trennung von Belegdaten und Binärdateien beziehungsweise Dokumentenspeicher.

## Migrationen

Jede Änderung an persistierten Daten benötigt eine Migration. Migrationen müssen:

- eine eindeutige Versionsnummer besitzen,
- rückwärtskompatible Lesepfade berücksichtigen,
- fehlende Felder mit sicheren Defaults ergänzen,
- entfernte Felder bewusst transformieren oder archivieren,
- testbar sein,
- in Release Notes dokumentiert werden.

## Nummernkreise

Nummernkreise werden zentral verwaltet und dürfen nicht pro Modul improvisiert werden. Geplante Nummernkreise:

- Kundennummern,
- Projektnummern,
- Angebotsnummern,
- Auftragsnummern,
- Bestellnummern,
- Lieferscheinnummern,
- Dokument-/Belegnummern,
- Rechnungsnummern,
- Zahlungslauf- oder Importnummern,
- DATEV-Exportlaufnummern,
- Lagerartikelnummern.

Nummernkreise müssen Präfixe, Jahresbezug, laufende Zähler, Kollisionsschutz und spätere Mandantenfähigkeit berücksichtigen.

## Berechnungen

Berechnungen werden in zentralen Businesslogik-Modulen geführt, nicht in UI-Komponenten dupliziert. Dazu gehören:

- Angebots- und Auftragswerte,
- Einkaufskosten,
- Deckungsbeitrag,
- Umsatzsteuer,
- Rechnungsbeträge,
- offene Posten,
- Zahlungsstatus,
- Liquiditätsprognosen,
- Steuerfälligkeiten,
- Projektmargen,
- Lagerwerte.

Alle Berechnungen müssen deterministisch und testbar sein.

## Statusmodelle

Statusmodelle werden pro Domäne definiert und als endliche Zustände mit erlaubten Übergängen dokumentiert.

Beispiele:

- Lead: `neu`, `qualifiziert`, `angebot_geplant`, `gewonnen`, `verloren`.
- Projekt: `geplant`, `aktiv`, `wartet`, `montage`, `abgenommen`, `abgerechnet`, `abgeschlossen`.
- Angebot: `entwurf`, `versendet`, `angenommen`, `abgelehnt`, `abgelaufen`.
- Bestellung: `entwurf`, `bestellt`, `teilgeliefert`, `geliefert`, `storniert`.
- Rechnung: `entwurf`, `gestellt`, `teilbezahlt`, `bezahlt`, `überfällig`, `storniert`.
- DATEV-Export: `vorbereitet`, `validiert`, `exportiert`, `fehlerhaft`.

Statuswechsel sollen langfristig Ereignisse für Automatisierungen und Reporting auslösen.

## Projektverknüpfungen

Das Projekt ist die zentrale Verknüpfungsebene. Jede projektbezogene Entität speichert eine `projectId`, sofern fachlich sinnvoll. Projektansichten aggregieren nur Referenzen und berechnete Zusammenfassungen, nicht vollständige Kopien fremder Datensätze.

## Dokumentenverwaltung

Dokumente werden als eigene Domäne behandelt. Ein Dokument besteht aus:

- technischer ID,
- Titel,
- Kategorie,
- Dateityp,
- Speicherreferenz,
- verknüpfter Entität,
- Projektbezug,
- Version,
- Erstellungs- und Änderungsdaten,
- optionalem Belegstatus,
- optionaler DATEV-Relevanz.

Dokumente müssen für Angebote, Aufträge, Lieferantenbelege, Lieferscheine, Montagefotos, Abnahmen, Rechnungen und DATEV-Exporte nutzbar sein.

## DATEV-Vorbereitung

Die DATEV-Vorbereitung benötigt strukturierte, validierte und exportfähige Daten:

- eindeutige Rechnungs- und Belegnummern,
- Rechnungsdatum und Leistungszeitraum,
- Kunden- und Lieferantenstammdaten,
- Brutto-, Netto- und Steuerbeträge,
- Steuersätze,
- Zahlungsinformationen,
- Belegreferenzen,
- Kontierungsfelder,
- Exportlauf mit Status und Fehlerprotokoll.

Die vollständige DATEV-Anbindung ist für v3.0 vorgesehen. Bis dahin ist v1.5 auf saubere Exportfähigkeit und Datenqualität auszurichten.

## Verbindliche Entwicklungsregeln

- TypeScript strict bleibt verbindlich aktiviert.
- `any` ist nicht zulässig; unbekannte Daten werden typisiert validiert.
- Keine doppelten Datenmodelle für dieselbe Fachdomäne.
- Keine redundanten Stores mit konkurrierenden Quellen der Wahrheit.
- Jede persistierte Datenänderung benötigt eine Migration.
- Neue Module benötigen Tests für Datenmodelle, Berechnungen und Migrationen.
- UI muss responsive für Desktop, Tablet und Smartphone sein.
- Architektur bleibt modular und fachlich getrennt.
- Erweiterbarkeit ist bei Datenmodellen, Statusmodellen und Nummernkreisen mitzudenken.
- UI, Businesslogik und Persistenz werden klar getrennt.
- Imports werden nicht durch `try/catch` abgesichert.
- Modulübergreifende Kommunikation erfolgt über stabile Schnittstellen, IDs und Services.
