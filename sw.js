/**
 * sw.js - Service Worker for Vision3D Assistive Detector
 * Implements CacheStorage strategy for AI model weights and assets.
 * Enables instant offline & cached sub-second reloads.
 */

const CACHE_NAME = 'vision3d-models-cache-v1';

// Static assets and patterns to cache
const CACHE_URL_PATTERNS = [
  'storage.googleapis.com/tfjs-models/',
  'cdn.jsdelivr.net/',
  'huggingface.co/'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isCachableAsset = CACHE_URL_PATTERNS.some((pattern) => url.includes(pattern)) ||
                          url.endsWith('.onnx') ||
                          url.endsWith('.tflite') ||
                          url.endsWith('.wasm');

  if (isCachableAsset && event.request.method === 'GET') {
    event.respondWith(
      caches.open(CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(event.request);
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        } catch (fetchErr) {
          console.warn('[SW] Network fetch failed for cached asset:', url, fetchErr);
          throw fetchErr;
        }
      })
    );
  }
});
