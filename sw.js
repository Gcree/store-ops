const CACHE_NAME = 'p-ops-cache-v3';
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

// 2. 攔截請求階段 (改為 Network First 網路優先策略)
self.addEventListener('fetch', event => {
  event.respondWith(
    // 步驟一：先嘗試去網路上抓最新版本的檔案
    fetch(event.request)
      .then(networkResponse => {
        // 如果抓成功了，就把最新版「偷偷更新」到手機的快取裡
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse; // 然後把最新畫面呈現給使用者
        });
      })
      .catch(() => {
        // 步驟二：如果 catch 觸發（代表沒網路、離線），才從快取拿出舊檔案來應急
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
