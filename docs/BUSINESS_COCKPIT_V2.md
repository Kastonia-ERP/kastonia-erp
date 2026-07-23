# Business-Cockpit v2

## Sprint 1

Sprint 1 bündelt die Geschäftsführer-Sicht in einer priorisierten v2-Zone auf dem bestehenden Dashboard. Der Fokus liegt auf belastbaren Kennzahlen, einem sortierten Handlungsbedarf und wiederverwendbarer Businesslogik.

### Enthalten

- Zentrale KPI-Berechnung für Liquidität, Forderungen, offene Steuern, aktive Projekte und Angebots-Abschlussquote.
- Priorisierung überfälliger Forderungen, naher Steuertermine und kurzfristig fälliger Aufgaben.
- Wiederverwendbares Modell in `lib/models/business-cockpit.ts` mit Node-Testabdeckung.
- Responsive Dashboard-Sektion für Desktop, Tablet und Smartphone.

### Noch nicht enthalten

- Rollenabhängige Cockpit-Varianten.
- Persistierte Cockpit-Konfiguration je Nutzer.
- Drilldown-Filter über mehrere Berichtsperioden.
