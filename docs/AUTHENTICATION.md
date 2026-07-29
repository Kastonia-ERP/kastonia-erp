# KASTONIA ERP v1.8 · Cloud Foundation – AUTHENTICATION

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

## Sichere Ersteinrichtung der Administratorkonten

1. In Supabase **Authentication → Users → Invite user** je eine persönliche E-Mail-Adresse für Gökhan und Seda einladen. Keine gemeinsam genutzten Konten anlegen und kein Passwort in SQL, Vercel oder im Repository hinterlegen.
2. Nach Annahme der Einladungen die beiden UUIDs aus `auth.users` übernehmen und Profile anlegen:

   ```sql
   insert into public.user_profiles (id, name, email, role, active) values
     ('<UUID-GOEKHAN>', 'Gökhan Karayel', '<GOEKHAN-EMAIL>', 'ADMIN', true),
     ('<UUID-SEDA>', 'Seda Karayel', '<SEDA-EMAIL>', 'ADMIN', true);
   ```

3. In Supabase Auth E-Mail-Bestätigung aktivieren, eine Redirect-URL `https://<vercel-domain>/auth/reset-password` eintragen und Passwort-Mindestanforderungen sowie MFA nach Unternehmensvorgabe aktivieren.
4. Die Migration `20260729000000_secure_central_state.sql` anwenden. Der erste angemeldete Administrator initialisiert den zentralen Datensatz; danach lesen alle Geräte denselben PostgreSQL-Datensatz.

Die Anwendung akzeptiert ausschließlich von Supabase signierte, serverseitig geprüfte Sessions. Demo-Passwörter, Rollen-Cookies und clientseitig manipulierbare Demo-Sitzungen werden nicht mehr verwendet.
