import fetch from 'dva/fetch';
import querystring from 'querystring';
import { message } from 'antd';

function parseJSON(response) {
  return response.json();
}

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

function getDataFromCaches(url) {
  if ('caches' in window) {
    return caches.match(url).then(function (cache) {
      if (!cache) {
        console.log(`cache无匹配数据，请求网络数据: ${url}`);
        return null;
      }
      return cache.json();
    });
  } else {
    console.log('cache不可用');
    return Promise.resolve();
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => ({ data }))
    .catch(err => ({ err }));
}

/**
 * fetch post请求封装
 * @param action 接口名称
 * @param params 接口参数
 * @returns {Promise<{data: Response} | {err: any}>}
 */
export async function post(action, params) {
  let url = '/api/' + action;
  let options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    credentials: 'include',
    body: querystring.stringify(params)
  };
  return fetch(url, options)
    .then(checkStatus)
    .then(parseJSON)
    .then(data => (data))
    .catch(err => ({ err }));
  
  // let cacheData = null;
  // // 首先使用缓存数据渲染
  // getDataFromCaches(url)
  //   .then(function (data) {
  //     cacheData = data || {};
  //     return remotePromise;
  //   })
  //   .then(function (data) {
  //     if (JSON.stringify(data) !== JSON.stringify(cacheData)) {
  //       message.success('已加载最新数据');
  //       console.log(data);
  //       return data;
  //     }
  //   })
  //   .then(data => (data))
  //   .catch(err => ({ err }));
}
