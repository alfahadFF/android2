// Service Worker مشترك بين الكتالوج ولوحة التحكم — تخزين الواجهة الأساسية + شبكة أولاً للباقي
const CACHE_NAME = 'android2-shell-v1';
const CORE_ASSETS = ['index.html', 'manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// شبكة أولاً، مع رجوع للكاش عند انقطاع الاتصال (لو كانت الصفحة محفوظة مسبقاً)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
