const CACHE_NAME = "bersenandung-cache-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/dashboard.html",
  "/alat.html",
  "/sewa.html",
  "/riwayat.html",
  "/css/style.css",
  "/js/auth.js",
  "/js/navbar.js",
  "/js/dashboard.js",
  "/js/alat.js",
  "/js/sewa.js",
  "/js/riwayat.js",
  "/manifest.json"
];

/* INSTALL */
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

/* ACTIVATE */
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

/* FETCH */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
