# KASTONIA ERP v1.8 · Cloud Foundation – PRODUCTION_CHECKLIST

Diese Dokumentation beschreibt die Cloud-Grundlage für den sicheren Onlinebetrieb mit Supabase, Vercel und rollenbasiertem Zugriff.

## Status

- Grundlage: aktuell gemergtes Operations Center im HEAD.
- Zielversion: v1.8 · Cloud Foundation.
- Keine echten Secrets werden im Repository gespeichert; .env.example enthält nur Platzhalter.

## Supabase

- Supabase Auth für E-Mail/Passwort, Logout, Passwort-Reset, Session-Wiederherstellung und deaktivierte Benutzer.
- PostgreSQL-Migration: supabase/migrations/20260722000000_cloud_foundation.sql.
- Row Level Security: ADMIN erhält Vollzugriff; MITARBEITER erhalten nur eigene Profile, eigene Zeiten/Meldungen/Bilder und zugewiesene operative Datensätze.

## Betrieb

- Vercel-Variablen aus .env.example setzen.
- Storage Bucket über NEXT_PUBLIC_STORAGE_BUCKET / SUPABASE_STORAGE_BUCKET konfigurieren.
- Migrationen bewusst durch Admin starten; kein automatischer Produktivimport beim App-Start.

## Checkliste

- [ ] Supabase-Projekt erstellt
- [ ] Auth Redirect URLs für Preview, Production und Passwort-Reset gesetzt
- [ ] Migration ausgeführt
- [ ] RLS in Supabase geprüft
- [ ] Storage Bucket erstellt
- [ ] Admin-Benutzer Gökhan Karayel und Seda Karayel angelegt
- [ ] Mindestens sechs Mitarbeiterprofile aktiv
- [ ] Vercel Production Build erfolgreich

## Finance-Control-Produktionsprüfung v1.9

- Lexoffice/DATEV als führendes System bestätigen.
- Keine automatische Rechnungsnummernvergabe im ERP aktivieren.
- Dateiablage für Dokumentenpfade prüfen.
- Steuertermine durch Admins/Steuerberatung konfigurieren.
- CSV-Vorbereitung nicht als zertifizierten DATEV-Import kommunizieren.
- Mitarbeiterzugriff auf Finanz- und Steuerdaten testen.


## v1.9.1 · Field Operations, Documents & Finance Workflow

Der aktuelle Stand ergänzt projektbezogene Arbeitszeiterfassung, Mitarbeiter-Mobile-Ansicht, Meldungszentrale, Material-/Werkzeug-/Fahrzeugmeldungen, mobile Uploads, Projektgalerie, zentrales Dokumentenmanagement, manuelle Eingangsbelege, manuelle Ausgangsrechnungsreferenzen, Zahlungen, offene Posten, Steuerkalender, vorläufige Umsatzsteuerübersicht und DATEV-Eingangsbelegexport als strukturierte Buchhaltungsübergabe. Lexoffice/DATEV bleiben führend; keine direkte API, keine automatischen Buchungen, keine Steueranmeldungen.
