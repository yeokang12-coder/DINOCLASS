const CACHE_NAME = 'dinoclass-v5.5';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css?v=5.5',
  './js/app.js',
  './js/sound.js',
  './js/storage.js',
  './js/dino_data.js',
  './js/confetti.js',
  './js/firebase_sync.js',
  './icon.jpg',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  console.log('[ServiceWorker v4.0] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          console.log('[ServiceWorker] Clearing cache key:', key);
          return caches.delete(key);
        })
      );
    })
  );
  self.clients.claim();
});

// Network/Disk First Strategy: ALWAYS try to load newest file from disk/USB first!
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});
