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

describe('UC301 Toevoegen van maaltijd', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  // TC-301-1: Verplicht veld ontbreekt (400)
  it('TC-301-1 Verplicht veld ontbreekt', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        // Required field 'name' is missing
        description: 'Heerlijke maaltijd',
        price: 15.99,
        calories: 500,
        chef: 'Chef John',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('Invalid user data');

        done();
      });
  });

  // TC-301-2: Niet ingelogd (401)
  it('TC-301-2 Niet ingelogd', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send({
        name: 'Spaghetti Bolognese',
        description: 'Heerlijke pasta met vleessaus',
        price: 12.99,
        calories: 600,
        chef: 'Chef Maria',
      })
      .end((err, res) => {
        expect(res).to.have.status(401);
        expect(res.body.status).to.equal(401);
        expect(res.body.message).to.equal('Unauthorized');

        done();
      });
  });

  // TC-301-3: Maaltijd succesvol toegevoegd (201)
  it('TC-301-3 Maaltijd succesvol toegevoegd', (done) => {
    // Generate a token for a mock user
    const payload = {
      userId: '2',
    };
    const authToken = jwt.sign(payload, jwtSecretKey, { expiresIn: '1h' });

    chai
      .request(server)
      .post(endpointToTest)
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
        expect(res.body.status).to.equal(201);
        expect(res.body.message).to.equal('Meal created');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.name).to.equal('Lasagna');
        expect(res.body.data.description).to.equal(
          'Layered pasta dish with meat and cheese'
        );
        expect(res.body.data.price).to.equal(14);

        done();
      });
  });
});
