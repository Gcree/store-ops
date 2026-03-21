const CACHE_NAME = 'p-ops-cache-v1';
// 這裡放你要讓手機「離線下載」的檔案清單
const urlsToCache = [
  './',
  './index.html',
  './style.css'
];

// 1. 安裝階段：把上面的檔案通通下載到手機快取裡
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 攔截請求階段：當沒有網路時，就從快取拿檔案出來
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果快取裡有這個檔案，就直接給快取；沒有的話才去網路抓
        return response || fetch(event.request);
      })
  );
});