const CACHE_NAME = 'galagram-v3';
const STATIC_ASSETS = [
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
  '/offline.html',          // optional – create a simple offline page
  'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'
];

// 🔹 INSTALL – cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        // Cache each asset individually to avoid one failing the whole batch
        return Promise.allSettled(
          STATIC_ASSETS.map(url => 
            cache.add(url).catch(err => console.warn(`Failed to cache ${url}:`, err))
          )
        );
      })
  );
  self.skipWaiting();
});

// 🔹 FETCH – smart strategy
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip cross-origin requests that don't support CORS (like Firebase CDN)
  if (url.origin !== location.origin && !url.href.includes('unpkg.com')) {
    // For external resources, try network but don't cache aggressively
    event.respondWith(fetch(request).catch(() => caches.match(request)));
    return;
  }

  // For navigation (HTML pages) → NETWORK FIRST
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const cloned = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, cloned));
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('/offline.html');
        })
    );
    return;
  }

  // For static assets (images, CSS, JS) → CACHE FIRST, then network
  event.respondWith(
    caches.match(request)
      .then(cached => cached || fetch(request).then(networkResponse => {
        // Cache only successful responses
        if (networkResponse.ok) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return networkResponse;
      }))
  );
});

// 🔹 ACTIVATE – clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});
