const userService = require('../services/user.services');
const logger = require('../util/logger');

let users = [];
let id = 0;

let controller = {
  addUser: (req, res, next) => {
    const user = req.body;

    logger.info('Creating user', user.firstName, user.lastName);

    userService.create(user, (err, data) => {
      if (err) {
        const error = {
          status: err.status || 500,
          message: err.message || 'Unknown error',
        };

        return next(error);
      }

      res.status(201).json({
        status: 201,
        message: 'User created',
        data,
      });
    });
  },

  getAllUsers: (req, res, next) => {
    logger.info('Showing all users');
  
    const isActive = req.body.isActive;
  
    userService.getAll(isActive, (err, data) => {
      if (err) {
        const error = {
          status: 500,
          result: err.message,
        };
  
        return next(error);
      }
      res.status(200).json({
        status: 200,
        message: 'List of users',
        data,
      });
    });
  },
  getUserById: (req, res, next) => {
    const userId = parseInt(req.params.userId);

    logger.info('Get user by id', userId);

    userService.getById(userId, (err, user) => {
      if (err) {
        const error = {
          status: err.status || 500,
          result: err.message,
        };

        return next(error);
      }

      res.status(200).json({
        status: 200,
        message: 'User found',
        user,
      });
    });
  },

  editUserById: (req, res, next) => {
    const userId = req.params.userId;
    const updatedData = req.body;

    logger.info('Updating user by ID:', userId);

    userService.updateUserById(userId, updatedData, (err, updatedUser) => {
      if (err) {
        const error = {
          status: err.status || 404,
          message: err.message || `User with ID ${userId} not found`,
        };
        logger.error('Error updating user by ID:', error);
        return next(error); // Pass the error to the error-handling middleware
      }

      res.status(200).json({
        status: 200,
        message: 'User updated',
        user: updatedUser,
      });
    });
  },

  deleteUserById: (req, res, next) => {
    const userId = parseInt(req.params.userId);
  
    userService.deleteUserById(userId, (err, deletedUser) => {
      if (err) {
        const error = {
          status: err.status || 404,
          message: err.message || `User with ID ${userId} not found`,
        };
        logger.error('Error deleting user:', error);
        return next(error); // Pass the error to the error-handling middleware
      }
  
      // Deleted user successfully, send the deleted user data in the response
      res.status(200).json({
        status: 200,
        message: 'User deleted',
        deletedUser: deletedUser,
      });
    });
  },

  getProfile: (req, res, next) => {
    const userId = req.userId
    console.log(typeof userId)
    logger.trace('Getting profile for userId', userId)

    userService.getProfile(userId, (error, success) => {
        if (error) {

            return next({
                status: error.status,
                message: error.message,
                data: {}
            })
        }

        if (success) {
            res.status(200).json({
                status: 200,
                message: success.message,
                data: success.data
            })
        }
    })
}
  
};

module.exports = controller;
