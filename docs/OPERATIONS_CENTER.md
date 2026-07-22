# Kastonia ERP v1.7 Operations Center

Das Operations Center bündelt die täglichen Arbeiten von Kastonia in einer zentralen Oberfläche, ohne bestehende Module zu ersetzen.

## Startseite „Heute“

Die Seite `/heute` aggregiert Montagen, Kundentermine, Rückrufe, Angebote, Bestellungen, Baustellenmeldungen, Materiallieferungen und Rechnungen aus den vorhandenen Stores. Jeder Eintrag verweist direkt auf das passende Modul oder die Projektakte. Die Wetter-Schnittstelle ist vorbereitet, indem Montageorte aus den Projektadressen strukturiert bereitgestellt werden.

## Aufgaben

Aufgaben behalten die vorhandene Ablage und wurden um Beschreibung, Projekt, Kunde, Verantwortlichen, Status, Kategorie, Anhänge und Kommentare erweitert. Unterstützte Kategorien sind Angebot, Einkauf, Montage, Büro, Buchhaltung, Nacharbeit, Kunde, Material und Sonstiges. Unterstützte Status sind Offen, In Bearbeitung, Wartet und Erledigt.

## Kalender

Der Projektkalender führt Kundentermine, Montagen, Lieferungen, Aufmaß, Abnahmen, Urlaub und interne Termine als gemeinsame Ereignisse zusammen. Die Datenbasis kommt weiterhin aus Terminen, Lieferungen und Projekten.

## Montageplanung

Die Seite `/montageplanung` verwaltet geplante Montagen mit Projekt, Kunde, Adresse, Team, Fahrzeug, Materialstatus, geplanter Dauer und Bemerkungen. Planungskarten sind bereits als draggable markiert, damit Drag & Drop später ohne Datenmodellbruch ergänzt werden kann.

## Ressourcen

Die Seite `/teams-fahrzeuge` verwaltet Monteure mit Telefon, Rolle, Fähigkeiten, Urlaub, Krankheit und Verfügbarkeit sowie Firmenfahrzeuge mit Kennzeichen, Typ, TÜV, Service, Werkzeugbestand und Anhänger.

## Materialcheck und Checklisten

Materialchecks zeigen vor einer Montage, ob Material vollständig ist. Fehlende Teile werden mit Soll-/Ist-Mengen angezeigt. Digitale Checklisten sind in die Phasen Vor Montage, Während Montage und Nach Montage gegliedert.

## Benachrichtigungen

Interne Operations-Hinweise decken Material fehlt, Monteur krank, Lieferung verspätet, neue Baustellenmeldung, Kunde wartet und Rechnung offen ab.

## Migration

Persistierte Daten werden beim Laden normalisiert. Bestehende Aufgaben erhalten Standardwerte für neue Felder, und neue Operations-Collections werden mit Demo-/Startdaten ergänzt, wenn sie in alten Backups fehlen.
