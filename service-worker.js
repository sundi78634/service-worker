/**
 * @author Sun
 * @description service worker event
 */
const SW_VERSION = 'v3';

// TODO path 递归 || node 生成配置文件再读取
self.addEventListener('install', function (event) {
  console.log('event install');
  event.waitUntil(
    caches.open(SW_VERSION)
      .then(function (cache) {
        return cache.addAll([
          '/service-worker/',
          '/service-worker/index.css',
          '/service-worker/index.html',
          '/service-worker/index.js',
          '/service-worker/manifest.json',
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

self.addEventListener('fetch', function (event) {
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
        return caches.match('/service-worker/static/cerebrum.a2321df3.jpg');
      });
    }
  }));
});

self.addEventListener('push', function (event) {
  console.log(event.data.text());
  console.log(event.data.json());
  if (event.data) {
    let data = event.data.json();
    let title = '通知啦啦啦';
    let options = {
      body: data.message,
      icon: 'https://sundi.oss-cn-beijing.aliyuncs.com/image/panda.jpg',
      actions: [{
        action: 'show-book',
        title: '去看看'
      }, {
        action: 'contact-me',
        title: '联系我'
      }],
      tag: 'push_message',
      renotify: true
    };
    self.registration.showNotification(title, options);
  } else {
    console.log('push没有任何数据');
  }
});

self.addEventListener('notificationclick', function (event) {
  let action = event.action;
  console.log(`action tag: ${event.notification.tag}`, `action: ${action}`);
  
  switch (action) {
    case 'show-book':
      console.log('show-book');
      break;
    case 'contact-me':
      console.log('contact-me');
      break;
    default:
      console.log(`未处理的action: ${event.action}`);
      action = 'default';
      break;
  }
  event.notification.close();
  
  event.waitUntil(
    // 获取所有clients
    self.clients.matchAll().then(function (clients) {
      console.log(self.clients);
      console.log(clients);
      if (clients && clients.length) {
        // 切换到该站点的tab
        clients[0].focus && clients[0].focus();
      } else {
        // 当不存在client时，打开该网站
        self.clients.openWindow('http://localhost:3000');
      }
      
      clients.forEach(function (client) {
        // 使用postMessage进行通信
        client.postMessage(action);
      });
    })
  );
});

self.addEventListener('sync', function (event) {
  console.log(`service worker需要进行后台同步，tag: ${event.tag}`);
  let tag = event.tag;
  const options = {
    method: 'POST'
  };
  switch (tag) {
    case 'first_sync':
      let request = new Request(`sync?name=Sun&age=18`, options);
      event.waitUntil(
        fetch(request).then(function (response) {
          response.json().then(console.log.bind(console));
          return response;
        })
      );
      break;
    default:
      console.log(`unexpected tag: ${tag}`);
  }
});

self.addEventListener('activate', function (event) {
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
