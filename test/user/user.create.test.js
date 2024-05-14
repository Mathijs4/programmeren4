const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../index');
const tracer = require('tracer');

const { expect } = chai;

chai.should();
chai.use(chaiHttp);
tracer.setLevel('warn');

const endpointToTest = '/api/user';

describe('UC201 Registreren als nieuwe user', () => {
  /**
   * Voorbeeld van een beforeEach functie.
   * Hiermee kun je code hergebruiken of initialiseren.
   */
  beforeEach((done) => {
    console.log('Before each test');
    done();
  });

  /**
   * Hier starten de testcases
   */
  it('TC-201-1 Verplicht veld ontbreekt', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send({
        // firstName: 'Hendrik', ontbreekt
        lastName: 'van Dam',
        emailAdress: 'x.xxxx@server.nl',
        isActive: true,
        password: 'Secret12',
        phoneNumber: '0612345678',
        roles: ['admin', 'user'],
        street: 'Kerkstra 1',
        city: 'Amsterdam',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('firstName should not be empty');

        done();
      });
  });

  it('TC-201-2 Niet-valide email adres', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send({
        firstName: 'Hendrik',
        lastName: 'van Dam',
        isActive: true,
        password: 'Secret12',
        phoneNumber: '0612345678',
        roles: ['admin', 'user'],
        street: 'Kerkstra 1',
        city: 'Amsterdam',
        emailAdress: 'vakantie%%%server.nl', // invalide mailadres
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal(
          'emailAddress should match the pattern'
        );

        done();
      });
  });

  it('TC-201-3 Niet-valide password', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send({
        firstName: 'Hendrik',
        lastName: 'van Dam',
        emailAdress: 'h.dd@server.nl',
        isActive: true,
        password: '!',
        phoneNumber: '0612345678',
        roles: ['admin', 'user'],
        street: 'Kerkstra 1',
        city: 'Amsterdam',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal('password should match the pattern');

        done();
      });
  });

  it('TC-201-4 Gebruiker bestaat al', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send(
        {
          firstName: 'Hendrik',
          lastName: 'van Dam',
          emailAdress: 'h.dd@server.nl',
          isActive: true,
          password: 'Secret12!',
          phoneNumber: '0612345678',
          roles: ['admin', 'user'],
          street: 'Kerkstra 1',
          city: 'Amsterdam',
        },
        {
          firstName: 'Hendrik',
          lastName: 'van Dam',
          emailAdress: 'h.dd@server.nl',
          isActive: true,
          password: 'Secret12!',
          phoneNumber: '0612345678',
          roles: ['admin', 'user'],
          street: 'Kerkstra 1',
          city: 'Amsterdam',
        }
      )
      .end((err, res) => {
        expect(res).to.have.status(400); // Assuming 400 is the expected status for duplicate user
        expect(res.body).to.be.an('object');
        expect(res.body.status).to.equal(400);
        expect(res.body.message).to.equal(
          `Email address 'h.dd@server.nl' already exists.`
        );
        expect(res.body.data).to.be.an('object').that.is.empty;
        done();
      });
  });

  it('TC-201-5 Gebruiker succesvol geregistreerd', (done) => {
    chai
      .request(server)
      .post(endpointToTest)
      .send({
        firstName: 'Voornaam',
        lastName: 'Achternaam',
        // emailAdress: 's.testmailsss@server.nl',
        password: 'Sdecret1234!',
        phoneNumber: '0612345678',
        isActive: true,
        roles: ['user'],
        street: 'Kerkstra 1',
        city: 'Amsterdam',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body.message).to.equal('User registered successfully');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.firstName).to.equal('Voornaam');
        expect(res.body.data.lastName).to.equal('Achternaam');
        // expect(res.body.data.emailAdress).to.equal('s.testmailsss@server.nl');
        expect(res.body.data).to.have.property('id').that.is.a('number');
        done();

      });
  });
});
