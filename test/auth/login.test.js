const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const tracer = require('tracer');

const { expect } = chai;

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/auth/login';

describe('UC101 Inloggen', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  /**
   * Hier starten de testcases
   */
  it('TC-101-1 Verplicht veld ontbreekt', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send({
        emailAddress: 'm.vanengelen@gmail.com',
        // password: 'Password123!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('password should not be empty');

        done();
      });
  });

  it('TC-101-2 Niet-valide wachtwoord', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send({
        emailAddress: 'm.vanengelen@gmail.com',
        password: 'Secret',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal(
          'Invalid password'
        );

        done();
      });
  });

    it('TC-101-3 Gebruiker bestaat niet', (done) => {
      chai
        .request(server)
        .post(endpointToTest)
        .send({
          emailAddress: 'g.fdgdf@gmail.com',
          password: 'Password123!',
        })
        .end((err, res) => {
          expect(res).to.have.status(404);
          expect(res.body.status).to.equal(404);
          expect(res.body.message).to.equal('User not found');

          done();
        });
    });

    it('TC-101-4 Gebruiker succesvol ingelogd', (done) => {
      chai
        .request(server)
        .post(endpointToTest)
        .send({
          emailAddress: 'm.vanengelen@gmail.com',
          password: 'Password123!',
        })
        .end((err, res) => {
        //   expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.message).to.equal('User logged in');
          expect(res.body.data).to.be.an('object');
          expect(res.body.data.emailAdress).to.equal('m.vanengelen@gmail.com');
          done();

        });
    });
});
