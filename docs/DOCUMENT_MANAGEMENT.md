# KASTONIA ERP v1.9.1 · Document Management

Diese Dokumentation beschreibt den Sprint **Field Operations, Documents & Finance Workflow**. Lexoffice beziehungsweise DATEV bleiben führend; KASTONIA ERP erfasst Referenzen, Belege, Zahlungen und Auswertungen nur betrieblich und erzeugt keine Steueranmeldung, keine automatischen Buchungen und keine rechtsverbindlichen Ausgangsrechnungen.

## Umsetzung

- Projektbezogene Arbeitszeiten sind Pflicht; interne Zeiten sind nur für Lager, Einkauf, Büro oder sonstige interne Tätigkeit zulässig.
- Meldungen aus Material, Werkzeug, Fahrzeug, Nacharbeit, Mangel, Sicherheit und Dokumenten laufen in der zentralen Meldungszentrale zusammen.
- Materialmeldungen erzeugen Einkaufslistenpositionen mit gruppierbarer Artikelmenge und sichtbarer Einzelherkunft.
- Mobile Uploads verwenden Storage-Pfade und Metadaten statt Base64-Produktivdaten. Unterstützt werden PDF, JPEG, PNG, HEIC/HEIF und WebP mit Größen-, Typ- und Projektprüfung.
- Dokumente, Projektbilder, Eingangsbelege, Ausgangsrechnungsreferenzen, Zahlungen, offene Posten, Steuertermine und vorläufige Umsatzsteuerübersichten bleiben über zentrale IDs projektverknüpft.
- Der DATEV-Eingangsbelegexport wird als Provider-/Adapter-Architektur vorbereitet und ist eine strukturierte Übergabe an die Buchhaltung, kein zertifizierter DATEV-Import und keine direkte API.
- Mitarbeiterrechte werden technisch geprüft: Mitarbeiter sehen eigene/zugewiesene Projekte, eigene Zeiten/Meldungen/Uploads und freigegebene Dokumente, aber keine Finanz-, Steuer- oder DATEV-Daten.

## Datenmodell und Tests

Die zentralen v1.9.1-Modelle und Provider liegen in `lib/models/field-operations-191.ts`; automatisierte Abdeckung liegt in `tests/field-operations-191.test.js`.
