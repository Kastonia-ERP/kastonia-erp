# EMPLOYEE QUALIFICATIONS

Version: v1.9.3 · Personnel Availability & Annual Workforce Planning

Dieses Dokument beschreibt die in PR #18 ergänzte Personalverfügbarkeit. Zentrale Modelle liegen in `lib/models/workforce-availability.ts`; die Admin-Oberfläche in `app/personalplanung/page.tsx`, die Integration in `app/einsatzplanung/page.tsx` und die mobile Mitarbeiteransicht in `app/mitarbeiter-mobile/page.tsx`.

## Regeln

- Mitarbeiter erfassen Anwesenheit, Freiwunsch und sonstige Abwesenheit für eigene Zeiträume.
- Freiwunsch ist nur nach vorhandener Anwesenheit zulässig und erzeugt eine interne Admin-Benachrichtigung.
- Genehmigte Freiwünsche, sonstige Abwesenheiten, Betriebsferien sowie gesperrte Samstage/Brückentage blockieren die reguläre Planung.
- Admin-Änderungen werden über Audit-Logs mit vorherigem Wert, neuem Wert, Admin, Zeitpunkt und Grund vorbereitet.
- Sensible Abwesenheitsgründe werden für andere Mitarbeiter auf „nicht verfügbar“ reduziert.
