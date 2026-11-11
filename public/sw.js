// Offline-first: alles beim Installieren in den Cache, danach aus dem Cache spielen.
// Bei jeder inhaltlichen Änderung VERSION hochzählen, damit Geräte die neue Fassung holen.
const VERSION = "wortjagd-v2";
const FILES = [
  "./",
  "index.html",
  "manifest.webmanifest",
  "fonts/fonts.css",
  "fonts/alfa-slab-one-latin.woff2",
  "fonts/alfa-slab-one-latin-ext.woff2",
  "fonts/nunito-latin.woff2",
  "fonts/nunito-latin-ext.woff2",
  "icons/favicon-32.png",
  "icons/icon-180.png",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: "reload" })))).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  if (req.mode === "navigate") {
    // Seite: erst Netz (damit Updates ankommen), sonst Cache.
    // Zeitlimit, damit ein WLAN ohne Internet nicht ewig hängt.
    const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 3000));
    e.respondWith(
      Promise.race([fetch(req), timeout]).then((res) => {
        if (!res.ok) throw new Error("status " + res.status);
        const copy = res.clone();
        caches.open(VERSION).then((c) => c.put("./", copy));
        return res;
      }).catch(() => caches.match("./", { ignoreSearch: true }).then((r) => r || caches.match("index.html")))
    );
    return;
  }
  e.respondWith(caches.match(req, { ignoreSearch: true }).then((r) => r || fetch(req)));
});
