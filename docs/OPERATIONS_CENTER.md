# KASTONIA ERP v1.7 · Operations Center

Dieses Dokument beschreibt die v1.7-Funktionen für Montageplanung, Mitarbeiterzuweisung, mobile Zeiterfassung, Baustellenmeldungen, zentrale Einkaufsliste, Verbrauchsmaterial, Werkzeugverwaltung sowie Fahrzeug-, TÜV- und Serviceüberwachung.

## Grundsätze

- Bestehende Projekt-, Einkaufs-, Lieferanten-, Bestell- und Liefermodule bleiben führend.
- Die zentrale Einkaufsliste ist eine Vorstufe und erzeugt Bestellentwürfe im bestehenden Einkaufsmodul, aber keine parallele Bestelllogik.
- Mitarbeiter sehen nur zugewiesene Projekte und keine Preise, Margen, Rechnungen oder Lieferantenkonditionen.
- Admins Gökhan Karayel und Seda Karayel haben vollständigen Operations-Zugriff.
- Meldungen, Einkaufsliste, Bestellung und Lieferung bleiben über Referenzfelder verknüpft.

## Dashboard

Kennzahlen zeigen heutige Baustellen, aktive Mitarbeiter, heutige Nettoarbeitszeit, offene Meldungen, defekte Werkzeuge, Fahrzeugwarnungen, offene Einkaufsliste, Baustopp-Meldungen, Abnahmen und Nacharbeiten. Schnellzugriffe führen zu Mitarbeiterzuweisung, Montageplanung, Einkaufsliste, Bestellung, Zeitprüfung, TÜV-Prüfung und Meldungsbearbeitung.


## v1.8 · Cloud Foundation

KASTONIA ERP ist für Supabase Auth, PostgreSQL Row Level Security, Supabase Storage, kontrollierte lokale Datenmigration und Vercel-Deployments vorbereitet. Mitarbeiter sehen ausschließlich eigene, zugewiesene, vergangene oder durch eigene Zeiten/Meldungen/Bilder belegte Baustellen; Preise, Margen, Rechnungen und Lieferantenkonditionen bleiben für Mitarbeiter serverseitig gesperrt.


## v1.9.1 · Field Operations, Documents & Finance Workflow

Der aktuelle Stand ergänzt projektbezogene Arbeitszeiterfassung, Mitarbeiter-Mobile-Ansicht, Meldungszentrale, Material-/Werkzeug-/Fahrzeugmeldungen, mobile Uploads, Projektgalerie, zentrales Dokumentenmanagement, manuelle Eingangsbelege, manuelle Ausgangsrechnungsreferenzen, Zahlungen, offene Posten, Steuerkalender, vorläufige Umsatzsteuerübersicht und DATEV-Eingangsbelegexport als strukturierte Buchhaltungsübergabe. Lexoffice/DATEV bleiben führend; keine direkte API, keine automatischen Buchungen, keine Steueranmeldungen.
