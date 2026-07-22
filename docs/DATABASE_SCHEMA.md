# KASTONIA ERP v1.8 · Cloud Foundation – DATABASE_SCHEMA

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

## Tabellen

- `user_profiles`: Rollen, Aktivstatus, Mitarbeiterprofil und letzte Anmeldung.
- `erp_records`: kontrollierte Cloud-Ablage für zentrale ERP-Collections aus dem bestehenden Datenmodell.
- `file_assets`: Metadaten für Supabase Storage ohne Base64-Dateispeicherung.
- `migration_runs`: protokollierte Dry Runs und bewusste Admin-Migrationen.
