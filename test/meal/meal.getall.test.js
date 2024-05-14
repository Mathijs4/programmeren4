const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const tracer = require('tracer');

const { expect } = chai;

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/meal';

describe('UC303 Opvragen van alle maaltijden', () => {
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  it('TC-303-1 Lijst van maaltijden geretourneerd', (done) => {
    chai
      .request(server)
      .get(endpointToTest)
      .send({})
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal(200);

        done();
      });
  });
});
