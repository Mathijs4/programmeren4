const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const assert = require('assert');
const validateToken = require('./authentication.routes').validateToken;

const validateUserCreate = (req, res, next) => {
  try {
    const {
      firstName,
      lastName,
      emailAdress,
      password,
      isActive,
      street,
      city,
      phoneNumber,
      roles,
    } = req.body;

    assert.ok(firstName, 'firstName should not be empty');
    assert.strictEqual(
      typeof firstName,
      'string',
      'firstName should be a string'
    );

    assert.ok(lastName, 'lastName should not be empty');
    assert.strictEqual(
      typeof lastName,
      'string',
      'lastName should be a string'
    );

    assert.ok(emailAdress, 'emailAddress should not be empty');
    assert.strictEqual(
      typeof emailAdress,
      'string',
      'emailAddress should be a string'
    );
    assert.ok(
      /^[a-zA-Z]{1}[.]{1}[a-zA-Z]{2,}\@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/.test(
        emailAdress
      ),
      'emailAddress should match the pattern'
    );

    assert.ok(password, 'password should not be empty');
    assert.strictEqual(
      typeof password,
      'string',
      'password should be a string'
    );
    assert.ok(
      /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password),
      'password should match the pattern'
    );

    assert.ok(isActive !== undefined, 'isActive should not be empty');
    assert.strictEqual(
      typeof isActive,
      'boolean',
      'isActive should be a boolean'
    );

    assert.ok(street, 'street should not be empty');
    assert.strictEqual(typeof street, 'string', 'street should be a string');

    assert.ok(city, 'city should not be empty');
    assert.strictEqual(typeof city, 'string', 'city should be a string');

    assert.ok(phoneNumber, 'phoneNumber should not be empty');
    assert.strictEqual(
      typeof phoneNumber,
      'string',
      'phoneNumber should be a string'
    );
    assert.ok(
      /^06[-\s]?\d{8}$/.test(phoneNumber),
      'phoneNumber should match the pattern'
    );

    assert.ok(Array.isArray(roles), 'roles should be an array');

    // Move to the next middleware if validation passes
    next();
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: 'Invalid user data',
    });
  }
};

const validateUserId = (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    assert.ok(userId, 'userId should not be empty');
    assert.strictEqual(typeof userId, 'number', 'userId should be a number');
    logger.info('validated userId');
    next();
  } catch (err) {
    return res.status(400).json({
      status: 400,
      message: err.message || 'Invalid user id',
    });
  }
}

router.get('/api/info', (req, res) => {
  res.status(200).json({
    status: 200,
    message:
      'Naam: Mathijs van Engelen, Studentnummer: 2217806, Beschrijving: Dit is mijn API voor programmeren 4',
  });
});

router.post('/api/user', validateUserCreate, userController.addUser);

router.get('/api/user', validateToken, userController.getAllUsers);

router.get('/api/user/:userId', userController.getUserById);

router.put('/api/user/:userId', userController.editUserById);

router.delete('/api/user/:userId', userController.deleteUserById);

router.get('/api/user/profile', validateToken, userController.getProfile)

module.exports = router;
