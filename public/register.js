/**
 * @author Sun
 * @description service worker
 */

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js', { scope: './' }).then(function (registration) {
    
    if (registration.installing) {
      console.log('Service worker installing');
    } else if (registration.waiting) {
      console.log('Service worker installed');
    } else if (registration.active) {
      console.log('Service worker active');
    } else {
      console.log(registration);
    }
    
    
    if ('PushManager' in window) {
      return Promise.all([
        registration,
        askPermission()
      ]).then(function (result) {
        let registration = result[0];
        document.querySelector('#cerebrum').addEventListener('click', function () {
          let title = '通知啦啦啦';
          let options = {
            body: '主动通知消息啦啦啦',
            icon: 'https://sundi.oss-cn-beijing.aliyuncs.com/image/panda.jpg',
            actions: [{
              action: 'show-book',
              title: '去看看'
            }, {
              action: 'contact-me',
              title: '联系我'
            }],
            tag: 'pwa-starter',
            renotify: true
          };
          registration.showNotification(title, options);
        });
        let publicKey = 'BF_wBwCDED0PXbLu5AEh4Ck_txsIUCNssTqBvKPD90ljzZcw7MGE7E3rPbbSkdusc2GlvOL_qRxDtsw720K_l1k';
        return subscribeUserToPush(registration, publicKey);
      }).then(function (subscription) {
        let body = { subscription: subscription };
        
        // 为了方便之后的推送，为每个客户端简单生成一个标识
        body.uniqueId = new Date().getTime();
        console.log('uniqueId', body.uniqueId);
        
        // 将生成的客户端订阅信息存储在自己的服务器上
        return sendSubscriptionToServer(JSON.stringify(body));
      }).then(function (res) {
        console.log(res);
      }).catch(function (err) {
        console.log(err);
      });
    } else {
      // Safari Notification
      return askPermission().then(function () {
        document.querySelector('#cerebrum').addEventListener('click', function () {
          let title = 'Safari通知啦啦啦';
          let options = {
            body: '主动通知消息啦啦啦',
            icon: 'https://sundi.oss-cn-beijing.aliyuncs.com/image/panda.jpg',
            actions: [{
              action: 'show-book',
              title: '去看看'
            }, {
              action: 'contact-me',
              title: '联系我'
            }],
            tag: 'pwa-starter',
            renotify: true
          };
          let notification = new Notification(title, options);
          notification.addEventListener('click', function (e) {
            console.log('Safari Notification Click');
          });
        });
      }).catch(function (err) {
        console.log(err);
      });
    }
  }).catch(function (error) {
    // registration failed
    console.log('Registration failed with ' + error);
  });
}

function askPermission() {
  return new Promise(function (resolve, reject) {
    let permissionResult = Notification.requestPermission(function (result) {
      resolve(result);
    });
    
    if (permissionResult) {
      permissionResult.then(resolve, reject);
    }
  }).then(function (permissionResult) {
    if (permissionResult !== 'granted') {
      throw new Error('We weren\'t granted permission.');
    }
  });
}

/**
 * 用户订阅相关的push信息
 * 会生成对应的pushSubscription数据，用于标识用户与安全验证
 * @param {ServiceWorker Registration} registration
 * @param {string} publicKey 公钥
 * @return {Promise}
 */
function subscribeUserToPush(registration, publicKey) {
  let subscribeOptions = {
    userVisibleOnly: true,
    applicationServerKey: urlBase64ToUint8Array(publicKey)
  };
  return registration.pushManager.subscribe(subscribeOptions).then(function (pushSubscription) {
    console.log('Received PushSubscription: ', JSON.stringify(pushSubscription));
    return pushSubscription;
  });
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * 将浏览器生成的subscription信息提交到服务端
 * 服务端保存该信息用于向特定的客户端用户推送
 * @param {string} body 请求体
 * @param {string} url 提交的api路径，默认为/subscription
 * @return {Promise}
 */
function sendSubscriptionToServer(body) {
  let url = '/subscription';
  return new Promise(function (resolve, reject) {
    let xhr = new XMLHttpRequest();
    xhr.timeout = 60000;
    xhr.onreadystatechange = function () {
      let response = {};
      if (xhr.readyState === 4 && xhr.status === 200) {
        try {
          response = JSON.parse(xhr.responseText);
        } catch (e) {
          response = xhr.responseText;
        }
        resolve(response);
      } else if (xhr.readyState === 4) {
        resolve();
      }
    };
    xhr.onabort = reject;
    xhr.onerror = reject;
    xhr.ontimeout = reject;
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(body);
  });
}
