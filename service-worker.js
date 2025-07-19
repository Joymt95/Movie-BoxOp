const CACHE_NAME = 'moviebox-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  'https://www.gstatic.com/firebasejs/8.6.8/firebase-app.js',
  'https://www.gstatic.com/firebasejs/8.6.8/firebase-auth.js',
  'https://www.gstatic.com/firebasejs/8.6.8/firebase-database.js',
  'https://assets.nflxext.com/ffe/siteui/vlv3/51e5354A-0268-4328-9943-7B83E3355555/8e33a571-0819-4566-9289-424a1e389e49/IN-en-20210315-popsignuptwoweeks-perspective_alpha_website_small.jpg'
];

// Install event: open a cache and add the core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve assets from cache if available
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response from cache
        if (response) {
          return response;
        }
        // Not in cache - fetch from network
        return fetch(event.request);
      }
    )
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});