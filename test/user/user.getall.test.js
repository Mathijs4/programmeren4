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

const endpointToTest = '/api/user';

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

describe('UC202 Opvragen van overzicht van users', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  /**
   * Hier starten de testcases
   */
  it('TC-202-1 Toon alle gebruikers', (done) => {
    chai
      .request(server)
      .get(endpointToTest)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);

        done();
      });
  });

  it('TC-202-2 Toon gebruikers met zoekterm op niet bestaande velden', (done) => {
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

  it('TC-202-3 Toon gebruikers met zoekterm op isActive=false', (done) => {
    chai
      .request(server)
      .get(`${endpointToTest}?isActive=false}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);

        done();
      });
  });

  it('TC-202-4 Toon gebruikers met zoekterm op isActive=true', (done) => {
    chai
      .request(server)
      .get(`${endpointToTest}?isActive=true}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);

        done();
      });
  });

  it('TC-202-5 Toon gebruikers met zoekterm op bestaande velden', (done) => {
    chai
      .request(server)
      .get(`${endpointToTest}?firstName=Mathijs`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);

        done();
      });
  });
});
