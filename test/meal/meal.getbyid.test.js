const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const tracer = require('tracer');

const { expect } = chai;

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/meal';

describe('UC304 Opvragen van maaltijd bij ID', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  it('TC-304-1 Maaltijd bestaat niet', (done) => {
    chai
      .request(server)
      .get(`${endpointToTest}/999`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(404);
        expect(res.body.status).to.equal(404);
        expect(res.body.message).to.equal('Meal with ID 999 not found');

        done();
      });
  });

  it('TC-304-2 Details van maaltijd geretourneerd', (done) => {
    chai
      .request(server)
      .get(`${endpointToTest}/2`)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);

        done();
      });
  });


});
