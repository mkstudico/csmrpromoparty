const CACHE_NAME = 'galagram-v2';

// Core files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/home.html',
  '/profile.html',
  '/profile-edit.html',
  '/add-news.html',
  '/news.html',
  '/requests.html',
  '/user.html',
  '/admin.html',
  '/manifest.json',

  // External resources
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
  'https://cdn.jsdelivr.net/npm/emoji-picker-element@1.9.0/index.js',
  'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js'
];


// 🔹 INSTALL – cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting(); // activate immediately
});


// 🔹 FETCH – smart strategy
self.addEventListener('fetch', event => {

  // 🟢 For pages → NETWORK FIRST (always fresh)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => caches.match(event.request)) // offline fallback
    );
    return;
  }

  // 🔵 For other assets → CACHE FIRST
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request)
          .then(networkResponse => {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
      })
  );
});


// 🔹 ACTIVATE – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim(); // take control immediately
});
