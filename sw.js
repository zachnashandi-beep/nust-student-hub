// sw.js
const CACHE_NAME = "student-hub-v13"; // <-- bump this on every deployment

const ASSETS = [
  "./",
  "./index.html",
  "./modules.html",
  "./personal.html",
  "./guides.html",
  "./guide-first-year.html",
  "./guide-study.html",
  "./guide-weekly.html",
  "./guide-mistakes.html",
  "./404.html",
  "./offline.html",

  "./style.css",
  "./manifest.json",

  "./nav.js",
  "./nav-auth.js",
  "./nav-mobile.js",
  "./page-transitions.js",
  "./icons.js",
  "./auth.js",
  "./personal.js",
  "./personal-inject.js",
  "./modules-data.js",
  "./updates.js",
  "./topbar-state.js",
  "./active-section.js",
  "./anchor-highlight.js",
  "./command-palette.js",
  "./contact.js",
  "./deep-link.js",
  "./theme.js",
  "./tip-of-day.js",
  "./back-to-top.js",
  "./sw-register.js",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

// Cache-first for same-origin assets, offline fallback for page navigations
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Don't cache Cloudflare Worker API calls
  if (url.hostname.includes("workers.dev") || url.hostname.includes("zach-nashandi.workers.dev")) {
    return;
  }

  // Only handle GET
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request).then((res) => {
        if (res.ok && url.origin === self.location.origin) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return res;
      }).catch(() => {
        // Network failed — serve offline page for navigation requests (HTML pages)
        if (event.request.mode === "navigate") {
          return caches.match("./offline.html");
        }
        // For other assets (CSS, JS, images) just fail silently
        return new Response("", { status: 408 });
      });
    })
  );
});
