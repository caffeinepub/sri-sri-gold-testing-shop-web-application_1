const CACHE_NAME = 'sri-sri-gold-testing-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/generated/shop-background.dim_1920x1080.png',
  '/assets/generated/app-icon.dim_512x512.png',
  '/assets/generated/app-icon.dim_192x192.png',
  '/manifest.webmanifest'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
