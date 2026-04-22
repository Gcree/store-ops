const CACHE_NAME = 'p-ops-cache-v4';
// 這裡放你要讓手機「離線下載」的檔案清單
const urlsToCache = [
  './',
  './index.html',
  './style.css?v=4'
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

// 2. 攔截請求階段 (Network First 網路優先策略)
self.addEventListener('fetch', event => {
  // 👇 加入這行：只允許快取 GET 請求，放行所有 Firebase 的 POST API 請求
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        console.log('目前處於離線狀態，載入快取檔案');
        return caches.match(event.request);
      })
  );
});

// 啟動階段：清除舊版本的快取 (Cache Busting)
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          // 如果手機裡的快取名稱跟現在的 CACHE_NAME 不一樣，就刪除舊的
          if (cacheName !== CACHE_NAME) {
            console.log('刪除舊快取:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});