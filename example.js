
var koa = require('koa');
var robotstxt = require('./');

var app = koa();

app.use(robotstxt());

app.use(function *response (next){
  this.body = 'Hello World';
});

app.listen(3000);
