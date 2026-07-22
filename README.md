# KASTONIA ERP Web-App v0.8

## Neu in v0.8
- Geschäftsführer-Business-Cockpit als neue Startseite
- Live-KPIs für Liquidität, Forderungen, Lieferanten, Steuern, Umsatz und Gewinn
- 30-/60-/90-Tage-Liquiditätsprognose
- Liquiditätskurve und Umsatz-/Gewinnvergleich
- Automatischer Handlungsbedarf aus Rechnungen, Steuern und Aufgaben
- Aluprof-Rechnung und Gewerbesteuertermine ergänzt
- Responsive für Desktop, iPad und Smartphone

## Lokal starten
```bash
npm install
npm run dev
```

## Produktions-Build prüfen
```bash
npm run build
npm start
```

## Deployment
Das Projekt ist weiterhin mit Vercel kompatibel, kann aber genauso auf einem eigenen Node.js-/Docker-Server betrieben werden. Es enthält noch keine zentrale Datenbank; Daten werden aktuell lokal im Browser gespeichert.
