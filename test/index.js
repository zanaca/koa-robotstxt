var request = require('supertest');
var join = require('path').join;
var robotstxt = require('..');
var koa = require('koa');
var fs = require('fs');

describe('robotstxt()', function(){
  var path = join(__dirname, 'fixtures', 'robots.txt');

  it('should only respond on /robots.txt', function(done){
    var app = new koa();

    app.use(robotstxt(path));

    app.use(function *(next){
      (this.body == null).should.be.true;
      (this.get('Content-Type') == null).should.be.true;
      this.body = 'OK';
    });

    request(app.listen())
    .get('/robots.txt')
    .expect(/User-agent: */, done);
  });

  it('should 404 if `path` is missing', function(done){
    var app = new koa();
    app.use(robotstxt());
    request(app.listen())
    .post('/robots.txt')
    .expect(404, done);
  });

  it('should not accept POST requests', function(done){
    var app = new koa();
    app.use(robotstxt(path));

    request(app.listen())
    .post('/robots.txt')
    .expect('Allow', 'GET, HEAD, OPTIONS')
    .expect(405, done);
  });

  it('should set cache-control headers', function(done){
    var app = new koa();
    app.use(robotstxt(path));
    request(app.listen())
    .get('/robots.txt')
    .expect('Cache-Control', 'public, max-age=86400')
    .expect(200, done);
  });

  describe('options.maxAge', function(){
    it('should set max-age', function(done){
      var app = new koa();
      app.use(robotstxt(path, { maxAge: 5000 }));
      request(app.listen())
      .get('/robots.txt')
      .expect('Cache-Control', 'public, max-age=5')
      .expect(200, done);
    });

    it('should accept 0', function(done){
      var app = new koa();
      app.use(robotstxt(path, { maxAge: 0 }));
      request(app.listen())
      .get('/robots.txt')
      .expect('Cache-Control', 'public, max-age=0')
      .expect(200, done);
    });

    it('should be valid delta-seconds', function(done){
      var app = new koa();
      app.use(robotstxt(path, { maxAge: 1234 }));
      request(app.listen())
      .get('/robots.txt')
      .expect('Cache-Control', 'public, max-age=1')
      .expect(200, done);
    });

    it('should floor at 0', function(done){
      var app = new koa();
      app.use(robotstxt(path, { maxAge: -4000 }));
      request(app.listen())
      .get('/robots.txt')
      .expect('Cache-Control', 'public, max-age=0')
      .expect(200, done);
    });

    it('should ceil at 31556926', function(done){
      var app = new koa();
      app.use(robotstxt(path, { maxAge: 900000000000 }));
      request(app.listen())
      .get('/robots.txt')
      .expect('Cache-Control', 'public, max-age=31556926')
      .expect(200, done);
    });

    it('should accept Infinity', function(done){
      var app = new koa();
      app.use(robotstxt(path, { maxAge: Infinity }));
      request(app.listen())
      .get('/robots.txt')
      .expect('Cache-Control', 'public, max-age=31556926')
      .expect(200, done);
    });
  })
})
