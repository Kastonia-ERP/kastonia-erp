# KASTONIA ERP v0.9 – zentrale Projektakte

## Zielbild

v0.9 legt das technische Fundament für eine zentrale Projektakte, ohne die bestehende Oberfläche neu zu gestalten. Die vorhandenen Listen für Kunden, Angebote, Projekte, Rechnungen, Aufgaben und Termine bleiben erhalten; das Projektmodell kann diese Daten künftig strukturiert zusammenführen.

## Datenmodell

Die zentralen Typen liegen in `lib/types/project.ts` und werden über `lib/types/index.ts` exportiert. Das Modell umfasst:

- `Customer` mit optionaler Adresse und `ContactPerson[]`.
- `Address` für Projekt- und Rechnungsadresse.
- `Project` als Aggregate Root der Projektakte.
- Prozessobjekte: `Measurement`, `Offer`, `OrderConfirmation`, `SupplierOrder`, `Installation`, `Invoice`, `Payment`, `Document`, `ProjectNote`, `CommunicationEntry`, `Task`, `Appointment`.
- Finanzobjekt `ProjectFinancials` für Umsatz, Kosten und Zahlungsstände.

`Project` enthält weiterhin die alten UI-Felder `customer`, `title`, `value`, `status` und `montage`, damit bestehende Seiten mit minimalem Risiko weiter funktionieren.

## Beziehungen

- Ein `Project` referenziert den Kunden über `customer` und kann zusätzlich vollständige Kundendetails in `customerDetails` halten.
- Ansprechpartner sind projektbezogen als `contactPersons` eingebettet.
- Angebote, Auftragsbestätigungen, Lieferantenbestellungen, Rechnungen und Zahlungen sind als Arrays im Projekt enthalten.
- Aufgaben und Termine können projektbezogen eingebettet werden und behalten optional `projectId`, um später externe Übersichten sauber zu verknüpfen.

## Status und Phasen

Projektstatus (`ProjectStatus`) bildet operative Prozessschritte ab:

1. Neue Anfrage
2. Kontaktaufnahme
3. Termin vereinbart
4. Aufmaß
5. Angebot in Vorbereitung
6. Angebot versendet
7. Nachfassen
8. Auftrag erhalten
9. Auftragsbestätigung
10. Bestellung Lieferant
11. Material ausstehend
12. Montage geplant
13. Montage läuft
14. Nacharbeit
15. Abnahme
16. Rechnung gestellt
17. Bezahlt
18. Abgeschlossen
19. Storniert
20. Archiviert

Projektphasen (`ProjectPhase`) sind bewusst gröber: Lead, Verkauf, Planung, Einkauf, Montage, Abrechnung und Abschluss. Dadurch kann ein Projekt z. B. in der Phase `Verkauf` mehrere Statuswechsel durchlaufen.

## Persistenzversion

- Neuer localStorage-Key: `kastonia-erp-v09`.
- Legacy-Key: `kastonia-erp-v07`.
- Schema-Version im Store: `schemaVersion: 9`.

## Migrationsablauf

1. Beim Laden wird zuerst `kastonia-erp-v09` gelesen.
2. Wenn kein v0.9-Backup vorhanden ist, wird `kastonia-erp-v07` gelesen.
3. Legacy-Projekte werden durch `normalizeProject` um fehlende v0.9-Felder ergänzt.
4. Alte Statuswerte werden sicher gemappt, z. B. `Material bestellt` zu `Bestellung Lieferant`.
5. Bei Fehlern wird eine Warnung ausgegeben und der alte localStorage-Inhalt bleibt unangetastet.
6. Persistiert wird ausschließlich in `kastonia-erp-v09`; der alte Key wird nicht automatisch gelöscht.

## Berechnungslogik

Die reinen Hilfsfunktionen liegen in `lib/models/project-helpers.ts`:

- `createProjectId` erzeugt neue Projekt-IDs.
- `createProjectNumber` erzeugt Projektnummern im Format `PR-JJJJ-0001`.
- `changeProjectStatus` setzt Status, aktualisiert `updatedAt` und markiert `Archiviert` als archiviert.
- `touchProject` aktualisiert Zeitstempel.
- `calculateProjectMargin` berechnet Umsatz netto minus Kosten netto.
- `calculateOpenCustomerPayment` berechnet offene Kundenzahlung brutto.
- `calculateOpenSupplierPayment` berechnet offene Lieferantenzahlung brutto.

## Beispielprojekt

Die Demo-Daten wurden aus dem Store in `lib/models/demo-data.ts` ausgelagert. Zusätzlich gibt es ein realistisches, nicht personenbezogenes Beispielprojekt `Musterkunde Nord` mit OBI-Lead, Aufmaß, Angebot, Lieferantenbestellung, geplanter Montage, Zahlung, Notiz, Kommunikation, Aufgabe und Termin.

## Erweiterungspunkte

- **CRM:** `Customer`, `ContactPerson`, `LeadSource`, Kommunikation und Notizen können in eine CRM-Detailansicht überführt werden.
- **Einkauf:** `SupplierOrder` kann um Lieferstatus, Dokumente, Bestellpositionen und Reklamationen erweitert werden.
- **Montage:** `Installation` kann später Teams, Checklisten, Fotodokumentation und Abnahmeprotokolle aufnehmen.
- **Finanzen:** `ProjectFinancials`, `Invoice` und `Payment` ermöglichen Deckungsbeitrag, offene Posten und Liquiditätsauswertungen.
- **Kundenportal:** `Document`, `Appointment`, Projektstatus und Kommunikation können selektiv für Kunden freigegeben werden.
