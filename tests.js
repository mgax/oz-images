var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;
var imagemagick = require('imagemagick-native');

var app = require('./server.js').default;
app.set('oz-image-path', '/app/images');
var server = app.listen(3000);

describe('GET /', () => {
  it('should respond with 200', (done) => {
    chai.request(server)
    .get('/')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
    });
    done();
  });
});

describe('GET /image/640px-Savannah_Cat_closeup.jpg', () => {
  it('should respond with original image', (done) => {
    chai.request(server)
    .get('/image/640px-Savannah_Cat_closeup.jpg')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(res).to.have.header('content-type', 'image/jpeg');
      expect(res).to.have.header('content-length', '37430');
      let meta = imagemagick.identify({srcData: res.body});
      expect(meta.width).to.equal(640);
      expect(meta.height).to.equal(427);
      done();
    });
  });
});

describe('GET /image/640px-Savannah_Cat_closeup.jpg?size=100x100', () => {
  it('should respond with thumbnail', (done) => {
    chai.request(server)
    .get('/image/640px-Savannah_Cat_closeup.jpg?size=100x100')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(res).to.have.header('content-type', 'image/jpeg');
      let meta = imagemagick.identify({srcData: res.body});
      expect(meta.width).to.be.at.most(100);
      expect(meta.height).to.be.at.most(100);
      done();
    });
  });
});

describe('GET /image/no-such-file.jpg', () => {
  it('should respond with 404', (done) => {
    chai.request(server)
    .get('/image/no-such-file.jpg')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(404);
      done();
    });
  });
});

describe('GET /image/640px-Savannah_Cat_closeup.jpg?size=100000x100000', () => {
  it('should respond with 404', (done) => {
    chai.request(server)
    .get('/image/640px-Savannah_Cat_closeup.jpg?size=100000x100000')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(404);
      done();
    });
  });
});

describe('GET /image/640px-Savannah_Cat_closeup.jpg?size=invalid', () => {
  it('should respond with 404', (done) => {
    chai.request(server)
    .get('/image/640px-Savannah_Cat_closeup.jpg?size=invalid')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(404);
      done();
    });
  });
});
