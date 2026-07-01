# ISO 22301 Audit-Tool

Webapp für das Audit eines Business Continuity Management Systems (BCMS)
nach DIN EN ISO 22301:2020-06. Aufgebaut nach derselben Architektur und im
selben Stil wie das ISO 27001/27002 Audit-Tool: Next.js + React, Deployment auf Vercel.

## Funktionen

- **51 Anforderungen** aus den Abschnitten 4–10 der Norm, bis auf
  Unterklausel-Ebene (z. B. 4.2.1, 8.4.4.b, 9.3.2) erfasst.
- **Reifegradskala 0–5 + N/A** (COBIT-inspiriert: Not existing → Optimized),
  farblich codiert.
- **7 Bereiche** (Klausel 4–10) mit eigener Akzentfarbe und
  Fortschrittsanzeige in der Sidebar.
- **KI-Analyse** je Anforderung: generiert KI-Reifegrad, Begründung, Risiko
  und Empfehlung auf Basis von Antwort/Nachweis (Anthropic-API,
  serverseitiger Proxy unter `pages/api/claude.js`).
- **Dashboard** mit Donut-Chart, Balkendiagramm pro Bereich und filterbarer
  Detailliste.
- **Bericht**-Ansicht inkl. PDF-Export (Browser-Druck, eigenes Druckfenster).
- **Action Plan** mit automatischer Priorisierung (1 = kritisch, 2 = mittel,
  3 = niedrig), manuell überschreibbar, inkl. Word-Export (.docx).
- **Session-Persistenz**: JSON-Export/Import sowie automatisches
  Zwischenspeichern im Browser (localStorage).

## Lokale Entwicklung

```bash
npm install
cp .env.local.example .env.local   # ANTHROPIC_API_KEY eintragen
npm run dev
```

Die App läuft danach unter `http://localhost:3000`.

## Deployment auf Vercel

1. Repository auf GitHub/GitLab/Bitbucket pushen (oder Ordner direkt per
   `vercel` CLI deployen).
2. In Vercel ein neues Projekt aus diesem Repository erstellen – Next.js
   wird automatisch erkannt, keine weitere Konfiguration nötig.
3. Unter **Project Settings → Environment Variables** den Schlüssel
   `ANTHROPIC_API_KEY` mit eurem Anthropic-API-Key hinterlegen (für
   Production **und** Preview).
4. Deploy auslösen. Ohne gesetzten API-Key funktioniert die App weiterhin
   vollständig für die Erfassung von Antworten/Reifegraden – lediglich der
   Button "KI-Analyse generieren" liefert dann eine Fehlermeldung.

## Eigene Daten ergänzen / anpassen

Alle Anforderungen, Bereiche und Farben befinden sich in `lib/data.js`.
Struktur je Anforderung:

```js
{ id, domain, title, q, hint }
```

`DOMAINS`, `DC` (Bereichsfarbe) und `DC_BG` (helle Hintergrundvariante)
steuern die Sidebar- und Dashboard-Darstellung.

## Hinweis zur Architektur

`pages/index.jsx` lädt `AuditApp.jsx` ausschliesslich client-seitig
(`next/dynamic`, `ssr:false`), um React-Hydration-Fehler zu vermeiden. Alle Hooks (`useState`,
`useEffect`) sowie gemeinsam genutzte `const`-Berechnungen stehen in
`AuditApp.jsx` an einer zentralen Stelle vor den view-spezifischen
`render…()`-Funktionen.
