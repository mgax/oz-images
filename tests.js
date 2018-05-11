var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

var app = require('./server.js').default;
app.set('oz-image-path', '/app/testimages');
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
  it('should respond with 200 and content', (done) => {
    chai.request(server)
    .get('/image/640px-Savannah_Cat_closeup.jpg')
    .end((err, res) => {
      expect(err).to.be.null;
      expect(res.status).to.equal(200);
      expect(res).to.have.header('content-type', 'image/jpeg');
      expect(res).to.have.header('content-length', '37430');
    });
    done();
  });
});
