/**
 * Thrift by Musk - Service Worker
 *
 * This service worker enables Progressive Web App (PWA) functionality,
 * including offline access and caching of application assets.
 */

const CACHE_NAME = 'thrift-by-musk-v1';

// This list includes the core files needed for the app to start.
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/site.webmanifest',
  // Existing App icons referenced in index.html
  '/favicon-96x96.png',
  '/apple-touch-icon.png',
  '/favicon.svg',
  '/favicon.ico'
  // Other assets like JS modules from CDNs will be cached on-the-fly.
];

// Install the service worker and cache the app shell.
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(URLS_TO_CACHE);
      })
      .then(() => self.skipWaiting()) // Activate the new service worker immediately
  );
});

// Clean up old caches on activation.
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => cacheName !== CACHE_NAME)
                  .map(cacheName => {
                    console.log('Service Worker: Deleting old cache', cacheName);
                    return caches.delete(cacheName);
                  })
      );
    }).then(() => self.clients.claim()) // Take control of all open clients
  );
});

// Intercept fetch requests.
self.addEventListener('fetch', event => {
  const { request } = event;

  // For navigation requests, try the network first to get the latest version.
  // If the network fails (offline), fall back to the cached index.html.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        return caches.match('/index.html');
      })
    );
    return;
  }

  // For all other requests (JS, CSS, images), use a "cache-first" strategy.
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      // If a cached version is available, return it immediately.
      if (cachedResponse) {
        return cachedResponse;
      }

      // If not in cache, fetch from the network.
      return fetch(request).then(networkResponse => {
        // If the fetch is successful, clone the response, cache it, and return it.
        // We only cache successful GET requests.
        if (networkResponse && networkResponse.status === 200 && request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(error => {
        // This catch block handles network failures for non-navigation requests.
        console.error('Service Worker: Fetch failed for asset.', error);
        // You could return a placeholder/offline asset here if needed.
      });
    })
  );
});
