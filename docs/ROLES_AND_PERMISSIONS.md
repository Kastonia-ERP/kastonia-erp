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
