const assert = require('assert');
const userService = require('../services/user.services');
const logger = require('../utils/logger');

let users = [];
let id = 0;

let controller = {
  validateUser: (req, res, next) => {
    let user = req.body;
    let {
      firstName,
      lastName,
      emailAdress,
      password,
      isActive,
      street,
      city,
      phoneNumber,
      roles,
    } = user;

    try {
      assert(typeof firstName === 'string', 'First name must be a string');
      assert(typeof lastName === 'string', 'Last name must be a string');
      assert(typeof emailAdress === 'string', 'Email address must be a string');
      assert(typeof password === 'string', 'Password must be a string');
      assert(typeof isActive === 'boolean', 'isActive must be a boolean');
      assert(typeof street === 'string', 'Street must be a string');
      assert(typeof city === 'string', 'City must be a string');
      assert(typeof phoneNumber === 'string', 'Phone number must be a string');
      assert(Array.isArray(roles), 'Roles must be an array');

      next();
    } catch (err) {
      const error = {
        status: 400,
        result: err.message,
      };

      next(error);
    }
  },

  addUser: (req, res) => {
    const user = req.body;

    logger.info('Created user', user.firstName, user.lastName);

    userService.create(user, (err, data) => {
      if (err) {
        const error = {
            status: 500,
            result: err.message,
            };
        
            next(error);
      }

      res.status(201).json({
        status: 201,
        message: 'User created',
        data,
      });
    });
  },

  getAllUsers: (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'List of users',
      users,
    });
  },

  getUserById: (req, res, next) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));

    if (!user) {
      const error = {
        status: 404,
        result: `User with id ${userId} not found`,
      };

      return next(error);
    } else {
      res.status(200).json({
        status: 200,
        message: 'User found',
        user,
      });
    }
  },

  editUserById: (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));
    const updatedUser = req.body;

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      users[userId - 1] = {
        ...users[userId - 1],
        ...updatedUser,
      };

      res.status(200).json({
        status: 200,
        message: 'User updated',
        user: users[userId - 1],
      });
    }
  },

  deleteUserById: (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));

    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      users = users.filter((user) => user.id !== Number(userId));

      res.status(200).json({
        status: 200,
        message: 'User deleted',
      });
    }
  },
};

module.exports = controller;
