# KASTONIA ERP – Procurement Workflow

Der Beschaffungsprozess erweitert die bestehende Projektakte, Angebots-Engine und Roadmap ohne Austausch vorhandener Modelle oder Stores. Alle Daten laufen weiter über den zentralen Store und werden beim Laden migriert.

```text
Projekt → Bestellung → Lieferant → Lieferung → Wareneingang → Projektfortschritt
```

## Lieferanten

Lieferanten enthalten Stammdaten, Ansprechpartner, Adressen, Zahlungsbedingungen, übliche Lieferzeiten, Kategorien, Kontaktinformationen, Historie und Projektzuordnungen. Legacy-Daten werden normalisiert: alte Felder wie `name`, `contact` und `category` bleiben auswertbar und werden in die erweiterten Stammdaten übernommen.

## Bestellungen

Bestellungen verwenden den Nummernkreis `BEYYYYNNNN` und enthalten Lieferant, Projektverknüpfung, Positionen, Rabatte, MwSt., automatische Netto-/USt-/Bruttosummen, Bestellstatus und Zahlungsstatus. Beim Speichern werden Summen zentral neu berechnet und projektbezogene Kosten fortgeschrieben.

## Lieferungen und Wareneingang

Wareneingänge referenzieren Bestellungen und übernehmen deren Projektbezug. Positionen erfassen gelieferte, beschädigte und fehlende Mengen. Der Lieferstatus wird aus den Mengen berechnet:

- `Erwartet` ohne gelieferte Menge
- `Teilweise geliefert` bei Teilmenge
- `Vollständig geliefert` bei kompletter Lieferung
- `Beschädigt` bei beschädigter Ware
- `Reklamation offen` bei beschädigter Ware mit Restmenge

## Automatische Prozesse

Beim Speichern eines Wareneingangs aktualisiert die Store-Logik:

1. den Bestellstatus (`Teilweise geliefert` oder `Geliefert`),
2. den Projektfortschritt (`Material ausstehend` oder `Montage geplant`),
3. die Projektkosten aus Bestellungen,
4. die Dashboard-KPIs aus den aktuellen Store-Daten.

## Dashboard-KPIs

Das Dashboard zeigt offene Bestellungen, aktive Lieferanten, Lieferungen heute, überfällige Lieferungen und offene Reklamationen. Zusätzlich bleiben Einkaufswerte, Zahlungsstatus und Bestellungen nach Status sichtbar.

## Projektintegration

Jede Projektakte bündelt Bestellungen, Lieferungen, Wareneingänge und die beteiligten Lieferanten indirekt über Bestellungen und Wareneingänge. Finanzkennzahlen übernehmen erwartete Beschaffungskosten aus projektbezogenen Bestellungen.

## Tests

Automatisierte Tests decken Nummernkreis, Bestellberechnungen, Statuswechsel, Projektverknüpfungen, Migration, Lieferstatus und Projektfortschritt ab.
