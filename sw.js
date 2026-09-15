// Service Worker مشترك بين الكتالوج ولوحة التحكم — الحد الأدنى المطلوب لتفعيل ميزة "تثبيت التطبيق"
const CACHE_NAME = 'android2-shell-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
