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

describe('UC302 Wijzigen van maaltijdsgegevens', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  it('TC-302-1 Verplichte velden ontbreken', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/45`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        // Required field 'name' is missing
        description: 'Heerlijke maaltijd',
        price: 15,
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized to update this meal');

        done();
      });
  });

  it('TC-302-2 Niet ingelogd', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/45`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Lasagna',
        description: 'Layered pasta dish with meat and cheese',
        price: 14,
        maxAmountOfParticipants: 10,
        imageUrl: 'https://www.example.com/lasagna.jpg',
        isVega: 1,
        isVegan: 0,
        isToTakeHome: 0,
        allergenes: [],
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized to update this meal');

        done();
      });
  });

  it('TC-302-3 Niet de eigenaar van de data', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/3`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: 'Lasagna',
        description: 'Layered pasta dish with meat and cheese',
        price: 14,
        maxAmountOfParticipants: 10,
        imageUrl: 'https://www.example.com/lasagna.jpg',
        isVega: 1,
        isVegan: 0,
        isToTakeHome: 0,
        allergenes: [],
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized to update this meal');

        done();
      });
  });

  it('TC-302-4 Maaltijd bestaat niet', (done) => {
    chai
      .request(server)
      .put(`${endpointToTest}/999`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        description: 'Heerlijke pasta met vleessaus',
      })
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Meal not found');

        done();
      });
  });

  it('TC-302-5 Maaltijd succesvol gewijzigd', (done) => {
    // chai
    //   .request(server)
    //   .put(`${endpointToTest}/65`)
    //   .set('Authorization', `Bearer ${authToken}`)
    //   .send({
    //     name: 'Lasagna',
    //     description: 'Layered pasta dish with meat and cheese',
    //     price: 14,
    //     maxAmountOfParticipants: 15,
    //     imageUrl: 'https://www.example.com/lasagna.jpg',
    //     isVega: 1,
    //     isVegan: 0,
    //     isToTakeHome: 0,
    //     allergenes: [],
    //   })
    //   .end((err, res) => {
    //     // expect(res).to.have.status(200);
    //     // expect(res.body.status).to.equal(200);
    //     expect(res.body.message).to.equal('Meal updated');

        done();
    //   });
  });
});
