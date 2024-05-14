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

const endpointToTest = '/api/meal';

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

describe('UC305 Verwijderen van een maaltijd', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  it('TC-305-1 Niet ingelogd', (done) => {
    chai
      .request(server)
      .delete(`${endpointToTest}/999`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized');

        done();
      });

    it('TC-305-2 Gebruiker niet geautoriseerd', (done) => {
      chai
        .request(server)
        .delete(`${endpointToTest}/3`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(403);
          expect(res.body.status).to.equal(403);
          expect(res.body.message).to.equal(
            'Unauthorized to delete meal with ID 3'
          );

          done();
        });

      it('TC-305-3 Maaltijd bestaat niet', (done) => {
        chai
          .request(server)
          .delete(`${endpointToTest}/999`)
          .set('Authorization', `Bearer ${authToken}`)
          .send({})
          .end((err, res) => {
            expect(res).to.have.status(404);
            expect(res.body.status).to.equal(404);
            expect(res.body.message).to.equal('Meal with ID 999 not found');

            done();
          });

        it('TC-305-4 Maaltijd succesvol verwijderd', (done) => {
          // Make sure authToken is decoded to extract userId
          const decodedToken = jwt.decode(authToken);
          if (decodedToken && decodedToken.userId) {
            const userId = decodedToken.userId;
            console.log('userId from token:', userId); // Log the userId extracted from the token

            // Make the API request to delete the meal using the extracted userId
            chai
              .request(server)
              .delete(`${endpointToTest}/60`)
              .set('Authorization', `Bearer ${authToken}`)
              .send({})
              .end((err, res) => {
                expect(res).to.have.status(200);
                expect(res.body.status).to.equal(200);
                expect(res.body.message).to.equal('Meal successfully deleted');

                done();
              });
          } else {
            // Handle token decoding error (userId not found in token)
            console.error('Error decoding token or userId not found.');
            done(); // Complete the test case
          }
        });
      });
    });
  });
});
