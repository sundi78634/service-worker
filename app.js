/**
 * @author Sun
 * @description koa server
 */

const path = require('path');
const Koa = require('koa');
const cors = require('@koa/cors');
const helmet = require('koa-helmet');
const bodyParser = require('koa-bodyparser');
const logger = require('koa-logger');
const Router = require('koa-router');
const serve = require('koa-static');
const proxy = require('koa-better-http-proxy');
const url = require('url');
const urlJoin = require('url-join');
const webpush = require('web-push');
const colors = require('colors');

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'production') {
  app.use(logger());
}

app.use(cors());
app.use(helmet());
app.use(bodyParser());
app.use(serve(path.resolve(__dirname, 'dist')));

// publicKey: 'BF_wBwCDED0PXbLu5AEh4Ck_txsIUCNssTqBvKPD90ljzZcw7MGE7E3rPbbSkdusc2GlvOL_qRxDtsw720K_l1k'
// privateKey: 'bhWX8uWzS1ivOqIigfZz7zDpAXqqakcPbMkCgUQc7R4'
const vapidKeys = webpush.generateVAPIDKeys();
webpush.setVapidDetails(
  'mailto:sundi78634@icloud.com',
  'BF_wBwCDED0PXbLu5AEh4Ck_txsIUCNssTqBvKPD90ljzZcw7MGE7E3rPbbSkdusc2GlvOL_qRxDtsw720K_l1k',
  'bhWX8uWzS1ivOqIigfZz7zDpAXqqakcPbMkCgUQc7R4'
);

let httpUrl = 'http://39.107.8.110:8080/stest';
app.use(proxy(httpUrl, {
  proxyReqPathResolver: function (ctx) {
    const path = url.parse(ctx.url).path.split('/').reverse();
    return urlJoin(httpUrl, path[0]);
  },
  preserveHostHdr: true,
  parseReqBody: true,
  filter: function (ctx) {
    return ctx.method === 'POST';
  }
}));

let subArray = [];
router.post('/subscription', async ctx => {
  let body = ctx.request.body;
  subArray.push(body);
  ctx.response.body = {
    code: 200,
    msg: '调用成功'
  };
});

router.post('/push', async ctx => {
  let { uniqueId, payload } = ctx.request.body;
  if (typeof payload !== 'string') {
    payload = JSON.stringify(payload);
  }
  for (let i = 0; i < subArray.length; i++) {
    let subscription = subArray[i];
    if (uniqueId === '' || uniqueId === subscription.uniqueId) {
      pushMessage(subscription.subscription, payload);
    }
  }
  
  ctx.response.body = {
    code: 200,
    msg: '调用成功',
    uniqueId: uniqueId,
    count: subArray.length,
  };
});

function pushMessage(subscription, payload = '') {
  webpush.sendNotification(subscription, payload, {}).then(data => {
    console.log('push service的相应数据:', JSON.stringify(data));
  }).catch(err => {
    // 判断状态码，410 404表示失效
    if (err.statusCode === 410 || err.statusCode === 404) {
      subArray.splice(subArray.indexOf(subscription), 1);
    } else {
      console.log(subscription);
      console.log(err);
    }
  })
}

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(colors.green(`server listening at http://localhost:${port}`));
});
