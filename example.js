
var koa = require('koa');
var robotstxt = require('./');

var app = koa();

app.use(robotstxt('./test/fixtures/robots.txt'));

app.use(function *response (next){
  this.body = 'Hello World';
});

app.listen(3000);
