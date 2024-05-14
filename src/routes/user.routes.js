const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const assert = require('assert');
const validateToken = require('./authentication.routes').validateToken;
const logger = require('../util/logger');

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
      message: err.message || 'Invalid user data',
    });
  }
};

const validateUserUpdate = (req, res, next) => {
  try {
      const {
          firstName,
          lastName,
          emailAddress,
          password,
          isActive,
          street,
          city,
          phoneNumber,
          roles,
      } = req.body;

      if (firstName !== undefined) {
      assert.strictEqual(
          typeof firstName,
          'string',
          'firstName should be a string'
      )}

      if (lastName !== undefined) {
      assert.strictEqual(
          typeof lastName,
          'string',
          'lastName should be a string'
      )}

      assert.ok(emailAddress, 'emailAddress should not be empty');

      assert.strictEqual(
          typeof emailAddress,
          'string',
          'emailAddress should be a string'
      )

      assert.ok(
          /^[a-zA-Z][.][a-zA-Z]{2,}@[a-zA-Z]{2,}\.[a-zA-Z]{2,3}$/.test(
              emailAddress
          ),
          'emailAddress should match the pattern'
      )

      if (password !== undefined) {
      assert.strictEqual(
          typeof password,
          'string',
          'password should be a string'
      )
      assert.ok(
          /^(?=.*[A-Z])(?=.*[0-9]).{8,}$/.test(password),
          'password should match the pattern'
      )}


      if (isActive !== undefined) {
      assert.strictEqual(
          typeof isActive,
          'boolean',
          'isActive should be a boolean'
      )}

      if (street !== undefined) {
      assert.strictEqual(typeof street, 'string', 'street should be a string')}

      if (city !== undefined) {
      assert.strictEqual(typeof city, 'string', 'city should be a string')}

      if (phoneNumber !== undefined) {
      assert.strictEqual(
          typeof phoneNumber,
          'string',
          'phoneNumber should be a string'
      )
      assert.ok(
          /^06[-\s]?\d{8}$/.test(phoneNumber),
          'phoneNumber should match the pattern'
      )}
      if (roles !== undefined) {
      assert.ok(Array.isArray(roles), 'roles should be an array')}

      next();
  } catch (err) {
      return res.status(400).json({
          status: 400,
          message: err.message || 'Invalid user data',
          error: err.toString(),
      });
  }
};

const validateUserId = (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId, 10);
    assert(!isNaN(userId), 'Invalid userId');
    assert.strictEqual(typeof userId, 'number', 'userId must be a number');

    logger.info('User ID successfully validated:', userId);
    next();
  } catch (err) {
    logger.error('User ID validation failed:', err.message);
    return res.status(400).json({
      status: 400,
      message: err.message || 'Invalid user ID',
    });
  }
};

router.get('/api/info', (req, res) => {
  res.status(200).json({
    status: 200,
    message:
      'Naam: Mathijs van Engelen, Studentnummer: 2217806, Beschrijving: Dit is mijn API voor programmeren 4',
  });
});

router.post('/api/user', validateUserCreate, userController.addUser);

router.get('/api/user', validateToken, userController.getAllUsers);

router.get('/api/user/profile', validateToken, userController.getProfile);

router.get('/api/user/:userId', validateToken, userController.getUserById);

router.put(
  '/api/user/:userId',
  validateUserUpdate,
  validateToken,
  validateUserId,
  userController.editUserById
);

router.delete(
  '/api/user/:userId',
  validateToken,
  validateUserId,
  userController.deleteUserById
);

module.exports = router;
