const CACHE_NAME = 'dinoclass-v4.3';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/style.css?v=4.3',
  './js/app.js?v=4.3',
  './js/sound.js?v=4.3',
  './js/storage.js?v=4.3',
  './js/dino_data.js?v=4.3',
  './js/confetti.js?v=4.3',
  './js/firebase_sync.js?v=4.3',
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
