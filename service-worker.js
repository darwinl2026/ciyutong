/**
 * Service Worker for 英语听写工具 PWA
 * 提供离线支持
 */

const CACHE_NAME = 'dictation-tool-v43';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/app.js',
  '/audio.js',
  '/data.js',
  '/ui.js',
  '/phonics.js',
  '/presets.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&display=swap'
];

// 安装事件 - 缓存资源
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching app assets');
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => {
        console.log('[SW] Skip waiting');
        return self.skipWaiting();
      })
  );
});

// 激活事件 - 清理旧缓存
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients');
        return self.clients.claim();
      })
  );
});

// 请求拦截 - 网络优先，降级到缓存
self.addEventListener('fetch', (event) => {
  // 跳过非GET请求
  if (event.request.method !== 'GET') return;
  
  // 跳过跨域请求
  if (!event.request.url.startsWith(self.location.origin)) {
    // 但要缓存Google Fonts
    if (event.request.url.includes('fonts.googleapis.com') || 
        event.request.url.includes('fonts.gstatic.com')) {
      event.respondWith(
        caches.match(event.request)
          .then((cached) => {
            if (cached) return cached;
            
            return fetch(event.request)
              .then((response) => {
                const clone = response.clone();
                caches.open(CACHE_NAME)
                  .then((cache) => cache.put(event.request, clone));
                return response;
              });
          })
      );
    }
    return;
  }
  
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 如果请求成功，克隆并缓存
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, clone));
        }
        return response;
      })
      .catch(() => {
        // 网络失败，从缓存获取
        return caches.match(event.request)
          .then((cached) => {
            if (cached) return cached;
            
            // 如果是导航请求，返回index.html
            if (event.request.mode === 'navigate') {
              return caches.match('/index.html');
            }
            
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// 后台同步（预留）
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
});

// 推送通知（预留）
self.addEventListener('push', (event) => {
  console.log('[SW] Push received:', event);
});