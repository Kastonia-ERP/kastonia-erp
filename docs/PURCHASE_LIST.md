# KASTONIA ERP v1.7 · Operations Center

Dieses Dokument beschreibt die v1.7-Funktionen für Montageplanung, Mitarbeiterzuweisung, mobile Zeiterfassung, Baustellenmeldungen, zentrale Einkaufsliste, Verbrauchsmaterial, Werkzeugverwaltung sowie Fahrzeug-, TÜV- und Serviceüberwachung.

## Grundsätze

- Bestehende Projekt-, Einkaufs-, Lieferanten-, Bestell- und Liefermodule bleiben führend.
- Die zentrale Einkaufsliste ist eine Vorstufe und erzeugt Bestellentwürfe im bestehenden Einkaufsmodul, aber keine parallele Bestelllogik.
- Mitarbeiter sehen nur zugewiesene Projekte und keine Preise, Margen, Rechnungen oder Lieferantenkonditionen.
- Admins Gökhan Karayel und Seda Karayel haben vollständigen Operations-Zugriff.
- Meldungen, Einkaufsliste, Bestellung und Lieferung bleiben über Referenzfelder verknüpft.

## Zentrale Einkaufsliste

Quellen sind Angebotspositionen, Projektmateriallisten, Baustellenmeldungen, Nachbestellungen, fehlende Schrauben, Silikon, Dichtband, Verbrauchsmaterial, defekte oder fehlende Werkzeuge, Fahrzeugbedarf, Mindestbestand und Admin-Eingaben. Gleiche Artikel können gruppiert, Mengen summiert und Lieferanten- oder Projektgruppen vorbereitet werden. Freigegebene Positionen werden als Bestellentwurf an das bestehende Einkaufsmodul übergeben.
