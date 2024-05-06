const userService = require('../services/user.services');
const logger = require('../utils/logger');

let users = [];
let id = 0;

let controller = {
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
    logger.info('Showing all users');

    userService.getAll((err, data) => {
      res.status(200).json({
        status: 200,
        message: 'List of users',
        data,
      });
    });
  },

  getUserById: (req, res, next) => {
    const userId = req.params.userId;
  
    logger.info('Get user by id', userId);
  
    userService.getById(userId, (err, user) => {
      if (err) {
        const error = {
          status: err.status || 500,
          result: err.message,
        };
  
        next(error);
      }
  
      res.status(200).json({
        status: 200,
        message: 'User found',
        user,
      });
    });
  
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
