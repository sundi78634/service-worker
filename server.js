/**
 * @author Sun
 * @description express server
 */

const express = require('express');
const colors = require('colors');

const app = express();

app.use(express.static('dist'));

let server = app.listen(3333, function () {
  let port = server.address().port;
  console.log(colors.green(`server listening at http://localhost:${port}`));
});
