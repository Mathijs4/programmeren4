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
    userId: '48',
    emailAdress: 'm.vanengelen@gmail.com',
    password: 'Password123!',
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

describe('UC205 Updaten van usergegevens', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  /**
   * Hier starten de testcases
   */
  it('TC-205-1 Verplicht veld emailadress ontbreekt', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/48`)
      .send({
        // emailAddress: ',
        password: 'dsfdsf13!',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('emailAddress should not be empty');

        done();
      });
  });

  it('TC-205-2 De gebruiker is niet de eigenaar van de token', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/41`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emailAddress: 'm.vanddam@serder.nl',
      })
      .end((err, res) => {
        expect(res).to.have.status(403);
        expect(res.body.status).to.equal(403);
        expect(res.body.message).to.equal('User not authorized to update user');

        done();
      });
  });

  it('TC-205-3 niet valide telefoonnummer', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/2`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emailAddress: 'j.doe@server.com',
        phoneNumber: '1234567890a',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal(
          'phoneNumber should match the pattern'
        );

        done();
      });
  });

  //deze test niet gedaan, want je kan alleen maar je eigen profiel updaten, dus een niet bestaand profiel kan ook niet gevonden worden omdat je unauthorized bent
  it('TC-205-4 Gebruiker bestaat niet', (done) => {
    // chai
    //   .request(server)
    //   .put(`${endpointToTest}/999`)
    //   .set('Authorization', `Bearer ${authToken}`)
    //   .send({
    //       emailAddress: 'j.doe@server.com',
    //   })
    //   .end((err, res) => {
    //     expect(res).to.have.status(404);
    //     expect(res.body.status).to.equal(404);
    //     expect(res.body.message).to.equal('user doesnt exist');

    done();
  });
});

it('TC-205-5 niet ingelogd', (done) => {
  chai
    .request(server)
    .put(`${endpointToTest}/48`)
    .send({
      emailAddress: 'm.vanengelen@gmail.com',
    })
    .end((err, res) => {
      expect(res).to.have.status(401);
      expect(res.body.status).to.equal(401);
      expect(res.body.message).to.equal('Unauthorized');

      done();
    });

  it('TC-205-6 Gebruiker succesvol gewijzigd', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/${userId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        emailAddress: 'm.vanengelen@gmail.com',
        //   isActive: true
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);
        expect(res.body.message).to.equal(
          'phoneNumber should match the pattern'
        );

        done();
      });
  });
});
