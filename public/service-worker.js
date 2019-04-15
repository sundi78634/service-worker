/**
 * @author Sun
 * @description service worker event
 */

const SW_VERSION = 'v2';

// TODO path 递归
this.addEventListener('install', function (event) {
  console.log('addEventListener install');
  event.waitUntil(
    caches.open(SW_VERSION)
      .then(function (cache) {
        return cache.addAll([
          '/dist/index.css',
          '/dist/index.html',
          '/dist/index.js',
        ]);
      })
      .catch(function (err) {
        console.log(err);
      })
  );
});

this.addEventListener('fetch', function (event) {
  console.log('addEventListener fetch');
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
        return caches.match('/src/assets/cerebrum.jpg');
      });
    }
  }));
});

this.addEventListener('activate', function (event) {
  console.log('addEventListener activate');
  let cacheWhitelist = [SW_VERSION];
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
