# KASTONIA ERP v1.7 · Operations Center

Dieses Dokument beschreibt die v1.7-Funktionen für Montageplanung, Mitarbeiterzuweisung, mobile Zeiterfassung, Baustellenmeldungen, zentrale Einkaufsliste, Verbrauchsmaterial, Werkzeugverwaltung sowie Fahrzeug-, TÜV- und Serviceüberwachung.

## Grundsätze

- Bestehende Projekt-, Einkaufs-, Lieferanten-, Bestell- und Liefermodule bleiben führend.
- Die zentrale Einkaufsliste ist eine Vorstufe und erzeugt Bestellentwürfe im bestehenden Einkaufsmodul, aber keine parallele Bestelllogik.
- Mitarbeiter sehen nur zugewiesene Projekte und keine Preise, Margen, Rechnungen oder Lieferantenkonditionen.
- Admins Gökhan Karayel und Seda Karayel haben vollständigen Operations-Zugriff.
- Meldungen, Einkaufsliste, Bestellung und Lieferung bleiben über Referenzfelder verknüpft.

## Werkzeuge, Fahrzeuge, TÜV und Service

Werkzeuge speichern Zustand, Standort, Fahrzeug, Mitarbeiter, Prüf- und Servicefristen. Fahrzeuge speichern Kennzeichen, Kilometerstand, TÜV, Inspektion, Service-Kilometerstand, Versicherung, Werkzeugbestand und Status. Warnungen unterscheiden TÜV in 90 Tagen, TÜV in 30 Tagen, TÜV überfällig, Service bald fällig, Service überfällig, offenen Schaden und Sperre.
