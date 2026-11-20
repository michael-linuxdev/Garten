# Nachbargarten

Ein ruhiges Garten-Rätselspiel als PWA: Jede Pflanze beeinflusst ihre Nachbarn. Setze alle Pflanzen so, dass jede zufrieden ist. Jedes gelöste Beet wandert in deinen Garten.

**Online:** https://garten.micana.de

## Pflanzen

| Pflanze | Regel |
|---|---|
| Sonnenblume | Wirft Schatten auf die 4 Nachbarfelder, braucht selbst Sonne |
| Farn | Braucht Schatten (Sonnenblume daneben) |
| Tulpe | Braucht Sonne (keine Sonnenblume daneben) |
| Lavendel | Braucht mindestens 2 Blüten (Sonnenblume oder Tulpe) daneben |
| Minze | Keine andere Pflanze direkt daneben |
| Pilz | Braucht Schatten und einen Stein daneben |

## Aufbau

- `index.html`: das komplette Spiel (HTML, CSS, JS und die 30 Beete als JSON)
- `sw.js`: Service Worker für Offline-Betrieb. Nach Änderungen `VERSION` erhöhen.
- `manifest.webmanifest`, `icons/`: PWA-Installation
- `tools/build.js`: setzt `tools/levels.json` in `index.html` ein
- `tools/gen.js`: Levelgenerator. Erzeugt Beete, zählt die Lösungen und setzt feste Pflanzen, bis nur wenige Lösungen übrig sind.

```bash
node tools/gen.js     # erzeugt tools/levels.json
node tools/build.js   # setzt die Level in index.html ein
```

Danach in `sw.js` die `VERSION` erhöhen.

Hosting: GitHub Pages mit eigener Domain (`CNAME`).
