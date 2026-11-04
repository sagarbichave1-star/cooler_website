const CACHE_VERSION = "trimurti-coolers-v5";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const OFFLINE_URL = "/offline.html";
const IMAGE_CACHE = `${CACHE_VERSION}-images`;
const IMAGE_LIMIT = 80;

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.add(OFFLINE_URL)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith("trimurti-coolers-") && key !== STATIC_CACHE && key !== IMAGE_CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/admin' || url.pathname.startsWith('/admin/')) return;
  if (url.pathname.startsWith("/api/")) return;

  if (request.mode === "navigate") {
    // Never persist HTML or session-bearing responses. Use a generic offline page.
    event.respondWith(
      fetch(request)
        .catch(async () => (await caches.match(OFFLINE_URL)) || Response.error()),
    );
    return;
  }

  // Product photos: serve from the device cache, refresh in the background,
  // and keep only the most recent IMAGE_LIMIT entries.
  if (url.pathname.startsWith("/_next/image") || url.pathname.startsWith("/products/") || url.pathname.startsWith("/brand/")) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then(async (response) => {
            if (response.ok && !response.redirected) {
              await cache.put(request, response.clone());
              const keys = await cache.keys();
              await Promise.all(keys.slice(0, Math.max(0, keys.length - IMAGE_LIMIT)).map((key) => cache.delete(key)));
            }
            return response;
          })
          .catch(() => cached || Response.error());
        if (cached) {
          event.waitUntil(network.catch(() => {}));
          return cached;
        }
        return network;
      }),
    );
    return;
  }

  if (!url.search && url.pathname.startsWith("/_next/static/")) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok && !response.redirected && !/private|no-store/i.test(response.headers.get("Cache-Control") || "")) {
            const copy = response.clone();
            event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy)).catch(() => {}));
          }
          return response;
        });
      }),
    );
  }
});
