/**
 * @author Sun
 * @description service worker event
 */
const SW_VERSION = 'v3';

// TODO path 递归
this.addEventListener('install', function (event) {
  console.log('event install');
  event.waitUntil(
    caches.open(SW_VERSION)
      .then(function (cache) {
        return cache.addAll([
          '/service-worker/',
          '/service-worker/index.css',
          '/service-worker/index.html',
          '/service-worker/index.js',
          '/service-worker/register.js',
          '/service-worker/service-worker.js',
          '/service-worker/static/cerebrum.a2321df3.jpg',
        ]);
      })
      .catch(function (err) {
        console.log(err);
      })
  );
});

this.addEventListener('fetch', function (event) {
  console.log('event fetch ---> ' + event.request.url);
  event.respondWith(caches.match(event.request).then(function (response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        caches.open(SW_VERSION).then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        // 请求没有匹配到缓存中的任何资源的时候，以及网络不可用
        return caches.match('/src/assets/cerebrum.jpg');
      });
    }
  }));
});

this.addEventListener('activate', function (event) {
  console.log('event activate');
  let cacheWhitelist = ['v1', 'v2', 'v3'];
  event.waitUntil(
    caches.keys().then(function (keyList) {
      return Promise.all(keyList.map(function (key) {
        if (cacheWhitelist.indexOf(key) === -1) {
          return caches.delete(key);
        }
      }));
    })
  );
});
