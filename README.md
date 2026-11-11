# Wortjagd

Wörterspiel als Offline-PWA (iPad: in Safari öffnen → Teilen → „Zum Home-Bildschirm“).

- `public/` – die ausgelieferte Seite (statisch, keine Abhängigkeiten aus dem Netz)
- `public/sw.js` – Service Worker; **bei jeder Änderung `VERSION` hochzählen**
- `src-original.html` – die ursprüngliche Einzeldatei
- `icon-src/` – Quelle des App-Icons (Headless-Chromium-Screenshot)

Ausgeliefert über Vercel (`vercel.json`): https://wortjagd-sepia.vercel.app – neu ausrollen mit `vercel deploy --prod`. `Dockerfile`/`nginx.conf` sind die Alternative für Coolify.
