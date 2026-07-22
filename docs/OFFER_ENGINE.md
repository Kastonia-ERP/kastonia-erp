# Kastonia Angebots-Engine v1.1

Die Angebots-Engine erstellt und verwaltet Angebote vollständig in der Projektakte. Angebote besitzen automatische Angebotsnummern im Schema `AGYYYYNNNN`, unveränderliche Versionen (`V1`, `V2`, ...), Statushistorie, Positionen und eine Live-Kalkulation.

## Funktionen

- Angebotsliste mit Nummer, Version, Datum, Status, Netto, Brutto, Marge und Bearbeiter.
- Editorbereiche: Kopf, Projektdaten, Kundendaten, Angebotspositionen, Kalkulation und Zusammenfassung.
- Positionstypen für Terrassendach, Wintergarten, Lamellendach, Carport, Pergola, Markisen, ZIP, Glasschiebeelemente, LED, Montage, Fundament, Sonderposition und Freitext.
- Live-Berechnung von Netto, Brutto, MwSt, Rabatt, Material, Montage, Lieferung, Sonstiges, Deckungsbeitrag, Marge und Projektgewinn.
- Status: Entwurf, In Bearbeitung, Versendet, Nachfassen, Gewonnen, Verloren, Storniert.
- Projektintegration mit letztem Angebot, aktuellem Angebot, Anzahl, Gesamtwert und Angebotsstatus.
- Druckansicht als PDF-Vorbereitung über Browser-Druck.

## Persistenz und Migration

Die Engine nutzt den bestehenden lokalen Store weiter. Alte Angebotsdaten werden beim Laden normalisiert, sodass Bestandsangebote erhalten bleiben.
