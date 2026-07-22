# Rollen und Berechtigungen

KASTONIA ERP v1.6 kennt zunächst zwei Rollen: `ADMIN` und `MITARBEITER`.

## ADMIN

Admins haben Vollzugriff auf Projekte, Angebote, Einkauf, Lieferungen, Benutzer, Baustellenmeldungen, Bilder und Auswertungen. Demo-Admins sind Gökhan Karayel und Seda Karayel mit anonymisierten Demo-Logins und ohne echte Passwörter.

## MITARBEITER

Mitarbeiter sehen nur zugewiesene Projekte, erstellen Meldungen, Notizen und Bildreferenzen und sehen Status sowie eigene Meldungen. Angebote, Einkaufs-/Lieferantenpreise, Rechnungen, Zahlungen, Auswertungen, Benutzerverwaltung und Projektlöschung sind technisch blockiert.

## Zentralisierung

Die Berechtigungslogik liegt in `lib/models/permissions.ts`. UI-Ausblendungen sind nur Ergänzung; geschützte Aktionen müssen diese zentralen Prüfungen verwenden.


## v1.7 · Operations Center

KASTONIA ERP v1.7 ergänzt Montageplanung, Mitarbeiterzuweisung, mobile Arbeitszeiterfassung, Baustellenmeldungen, zentrale Einkaufsliste, Materialbedarfe aus angenommenen Angeboten, Verbrauchsmaterial, Werkzeugverwaltung, Fahrzeug-/TÜV-/Serviceüberwachung, interne Benachrichtigungen und zentrale Berechtigungsprüfungen. Bestellungen werden weiterhin im bestehenden Einkaufsmodul erzeugt.


## v1.8 · Cloud Foundation

KASTONIA ERP ist für Supabase Auth, PostgreSQL Row Level Security, Supabase Storage, kontrollierte lokale Datenmigration und Vercel-Deployments vorbereitet. Mitarbeiter sehen ausschließlich eigene, zugewiesene, vergangene oder durch eigene Zeiten/Meldungen/Bilder belegte Baustellen; Preise, Margen, Rechnungen und Lieferantenkonditionen bleiben für Mitarbeiter serverseitig gesperrt.

## Finance-Control-Berechtigungen v1.9

ADMIN erhält vollständigen Zugriff auf Finanzen, Dokumente und Steuerkalender. MITARBEITER erhält keinen Zugriff auf Rechnungen, Zahlungen, offene Posten, Umsatz-/Kostenwerte, Steuerdaten oder Finanzauswertungen; freigegebene Baustellendokumente und Bilder bleiben separat zu behandeln.


## v1.9.1 · Field Operations, Documents & Finance Workflow

Der aktuelle Stand ergänzt projektbezogene Arbeitszeiterfassung, Mitarbeiter-Mobile-Ansicht, Meldungszentrale, Material-/Werkzeug-/Fahrzeugmeldungen, mobile Uploads, Projektgalerie, zentrales Dokumentenmanagement, manuelle Eingangsbelege, manuelle Ausgangsrechnungsreferenzen, Zahlungen, offene Posten, Steuerkalender, vorläufige Umsatzsteuerübersicht und DATEV-Eingangsbelegexport als strukturierte Buchhaltungsübergabe. Lexoffice/DATEV bleiben führend; keine direkte API, keine automatischen Buchungen, keine Steueranmeldungen.
