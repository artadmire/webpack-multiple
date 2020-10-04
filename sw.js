// 当前缓存版本的唯一标示，以时间为基础
const cacheKey = new Date().toISOString();

// 需要被缓存的文件的url列别
const cacheList = global.serviceWorkerOption.assets;
console.log(cacheList, 'cacheList');
// 监听事件
// eslint-disable-next-line no-restricted-globals
self.addEventListener('install', (event) => {
  // Perform install steps
  event.waitUntil(
    caches.open(cacheKey)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(cacheList);
      }),
  );
});
// 拦截网络请求
// eslint-disable-next-line no-restricted-globals
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // 来来来，代理可以搞一些代理的事情

      // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
      if (response) {
        return response;
      }

      // 如果 service worker 没有返回，那就得直接请求真实远程服务
      const request = event.request.clone(); // 把原始请求拷过来
      return fetch(request).then((httpRes) => {
        // http请求的返回已被抓到，可以处置了。

        // 请求失败了，直接返回失败的结果就好了。。
        if (!httpRes || httpRes.status !== 200) {
          return httpRes;
        }

        // 请求成功的话，将请求缓存起来。
        const responseClone = httpRes.clone();
        caches.open(cacheKey).then((cache) => {
          cache.put(event.request, responseClone);
        });

        return httpRes;
      });
    }),
  );
});

// 代码的更新
// eslint-disable-next-line no-restricted-globals
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [cacheKey];

  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheWhitelist.indexOf(cacheName) === -1) {
          return caches.delete(cacheName);
        }
        return '';
      }),
    )),
  );
});
