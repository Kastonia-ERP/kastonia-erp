# Baustellenmeldungen

Baustellenmeldungen bündeln Kommunikation von Montage, Admin und Einkauf.

## Kategorien, Prioritäten und Status

Kategorien: Material nachbestellen, Werkzeug benötigt, Sonstiges, Abnahmebilder, Zustandsbilder, Mangel, Beschädigung, Kundenwunsch, Nacharbeit und Sicherheitsproblem.

Prioritäten: Normal, Wichtig, Dringend, Baustopp. Status: Neu, Gesehen, In Bearbeitung, Bestellt, Termin geplant, Erledigt, Abgelehnt.

## Bilder und Storage

Bilder werden als Dateireferenz/URL mit Dateiname, Dateityp, Uploadzeit, Benutzer, Beschreibung, Kategorie und optionalem Bildzeitpunkt gespeichert. Base64-Bilder werden nicht im Projekt-Datensatz abgelegt. Die Storage-Referenz ist abstrahiert, damit Vercel Blob, Supabase Storage oder S3 später angeschlossen werden können.

## Material und Werkzeug

Materialmeldungen enthalten Artikel, Menge, Einheit, Liefertermin, Lieferort, möglichen Lieferanten und Bemerkung. Admins verknüpfen sie mit dem bestehenden Einkaufsmodul statt ein separates Bestellsystem zu verwenden.

Werkzeugmeldungen enthalten Werkzeugbezeichnung, Anzahl, Kauf/Ausleihe, Einsatzdatum, Baustelle und Bemerkung.
