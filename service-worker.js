const CACHE_NAME = 'galagram-v1';
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
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
  'https://cdn.jsdelivr.net/npm/emoji-picker-element@1.9.0/index.js',
  'https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js',
  'https://www.gstatic.com/firebasejs/12.11.0/firebase-firestore.js'
];

// Install event – cache core assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Fetch event – serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

// Activate event – clean up old caches
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
    }).then(() => self.clients.claim())
  );
});
