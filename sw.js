// Furimora Assist - Service Worker
const CACHE_NAME = 'furimora-v1';
const CACHE_URLS = [
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(CACHE_URLS);
    })
  );
  self.skipWaiting();
});

// 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// フェッチ: キャッシュ優先、なければネットワーク（Gemini APIはネットワーク直接）
self.addEventListener('fetch', event => {
  // Gemini API と generativelanguage はキャッシュしない
  if (event.request.url.includes('generativelanguage.googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // 同一オリジンのリソースのみキャッシュ
        if (
          response.ok &&
          response.type === 'basic' &&
          event.request.method === 'GET'
        ) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // オフライン時はキャッシュ済みのindex.htmlを返す
        return caches.match('./index.html');
      });
    })
  );
});
