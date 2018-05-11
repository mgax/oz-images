var mocha = require('mocha');
var chai = require('chai');
var chaiHttp = require('chai-http');
chai.use(chaiHttp);
var expect = chai.expect;

var app = require('./server.js').default;
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
