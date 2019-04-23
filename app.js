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

app.use(router.routes()).use(router.allowedMethods());

app.listen(port, () => {
  console.log(colors.green(`server listening at http://localhost:${port}`));
});
