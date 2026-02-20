const CACHE_NAME = "student-hub-v1";
const URLS = [
  "index.html",
  "modules.html",
  "style.css",
  "manifest.json",
  "topbar-state.js",
  "theme.js",
  "nav.js",
  "updates.js",
  "anchor-highlight.js",
  "active-section.js",
  "deep-link.js",
  "contact.js",
  "modules-data.js",
  "command-palette.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (u.origin !== self.location.origin) return;
  if (u.pathname.endsWith("sw.js")) return;
  e.respondWith(
    caches.match(e.request).then((cached) =>
      cached ? cached : fetch(e.request).then((r) => {
        const clone = r.clone();
        if (r.status === 200 && (e.request.method === "GET"))
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, clone));
        return r;
      })
    )
  );
});
