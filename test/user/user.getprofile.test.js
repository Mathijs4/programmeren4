const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const tracer = require('tracer');
const jwt = require('jsonwebtoken');
const jwtSecretKey = require('../../src/util/config').secretkey;
const { expect } = chai;

chai.should();
chai.use(chaiHttp);

tracer.setLevel('warn');

const endpointToTest = '/api/user/profile';

let authToken = '';

before((done) => {
  const payload = {
    userId: '2',
  };

  jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' }, (err, token) => {
    if (err) {
      done(err);
    } else {
      authToken = token;
      done();
    }
  });
});

describe('UC202 Opvragen van gebruikersprofiel', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  /**
   * Hier starten de testcases
   */
  it('TC-203-1 Ongeldig token', (done) => {
    chai
      .request(server)
      .get(endpointToTest)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized');

        done();
      });
  });

  it('TC-203-2 Gebruiker is ingelogd met geldig token', (done) => {
    chai
      .request(server)
      .get(`${endpointToTest}?name=henk}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);

        done();
      });
  });

});
