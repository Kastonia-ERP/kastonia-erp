# KASTONIA ERP v1.5 – Einkauf, Lieferanten und Lieferungen

Teil 1 der Core Business Suite ergänzt projektbezogenen Einkauf, Lieferantenverwaltung und Wareneingang. Die Daten werden im bestehenden lokalen Store migriert; vorhandene Kunden-, Angebots- und Projektdaten bleiben erhalten.

## Lieferanten

Lieferanten enthalten ID, Firmenname, Ansprechpartner, Adresse, Land, E-Mail, Telefon, Website, eigene Kundennummer, Zahlungsbedingungen, übliche Lieferzeit, Kategorien, Notizen, Aktivstatus sowie Erstell- und Änderungsdatum. Die Übersicht bietet Suche, Kategorie-Filter, Anlage, Bearbeitung, Deaktivierung und zeigt zugehörige Bestellungen mit Bestellwert.

## Bestellungen

Bestellungen nutzen den eindeutigen fortlaufenden Nummernkreis `BEYYYYNNNN`, z. B. `BE20260001`. Enthalten sind Lieferant, optionales Projekt, Bestell- und Liefertermine, Status, Zahlungsstatus, Positionen, Netto-/USt-/Bruttosummen, Lieferadresse, Notiz, Dokumentenreferenzen und Zeitstempel.

Status: Entwurf, Angefragt, Bestellt, Teilweise geliefert, Geliefert, Storniert. Zahlungsstatus: Offen, Teilweise bezahlt, Bezahlt.

## Lieferungen / Wareneingang

Lieferungen referenzieren Bestellungen und Projekte, enthalten Lieferscheinnummer, Lieferdatum, gelieferte Positionen, gelieferte, beschädigte und fehlende Mengen, Status, Notizen und Dokumentenreferenzen. Teillieferungen berechnen Restmengen und aktualisieren den Bestellstatus automatisch.

## Dashboard

Das Dashboard zeigt offene Bestellungen, Bestellwert netto, überfällige Lieferungen, Teillieferungen, offene Lieferantenzahlungen und Bestellungen nach Status.
