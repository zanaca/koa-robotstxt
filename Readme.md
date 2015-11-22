# koa-robotstxt [![Build Status](https://travis-ci.org/koajs/robotstxt.svg)](https://travis-ci.org/koajs/robotstxt)

 Koa middleware for serving the robots.txt file..

## Installation

```js
$ npm install koa-robotstxt
```

## Example

```js
var koa = require('koa');
var robotstxt = require('koa-robotstxt');
var app = koa();

app.use(robotstxt(__dirname + '/public/robots.txt'));
```

## API

### robotstxt(path, [options])

Returns a middleware serving the robots.txt found on the given `path`.

#### options

- `maxAge` cache-control max-age directive in ms, defaulting to 1 day.

## License

  MIT
