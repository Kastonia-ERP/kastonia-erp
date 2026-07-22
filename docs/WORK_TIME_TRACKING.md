# KASTONIA ERP v1.7 · Operations Center

Dieses Dokument beschreibt die v1.7-Funktionen für Montageplanung, Mitarbeiterzuweisung, mobile Zeiterfassung, Baustellenmeldungen, zentrale Einkaufsliste, Verbrauchsmaterial, Werkzeugverwaltung sowie Fahrzeug-, TÜV- und Serviceüberwachung.

## Grundsätze

- Bestehende Projekt-, Einkaufs-, Lieferanten-, Bestell- und Liefermodule bleiben führend.
- Die zentrale Einkaufsliste ist eine Vorstufe und erzeugt Bestellentwürfe im bestehenden Einkaufsmodul, aber keine parallele Bestelllogik.
- Mitarbeiter sehen nur zugewiesene Projekte und keine Preise, Margen, Rechnungen oder Lieferantenkonditionen.
- Admins Gökhan Karayel und Seda Karayel haben vollständigen Operations-Zugriff.
- Meldungen, Einkaufsliste, Bestellung und Lieferung bleiben über Referenzfelder verknüpft.

## Arbeitszeiterfassung

Zeiteinträge enthalten Mitarbeiter, Projekt, Baustelle, Datum, Arbeitsbeginn, Arbeitsende, Pause, Nettoarbeitszeit, Fahrtzeit, Tätigkeit, Bemerkung, Status und Zeitstempel. Nettoarbeitszeit, Tagesstunden, Wochenstunden, Projektstunden, Fahrtzeiten und Pausen werden in der Geschäftslogik berechnet. Mitarbeiter dürfen eigene Einträge bis zur Freigabe bearbeiten; Admins prüfen, korrigieren, geben frei oder lehnen ab.
