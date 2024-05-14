const userService = require('../services/user.services');
const logger = require('../util/logger');

let userController = {
  addUser: (req, res, next) => {
    const user = req.body;

    logger.info('creating user', user.firstName, user.lastName);

    userService.create(user, (error, success) => {
      if (error) {
        return next({
          status: error.status,
          message: error.message,
          data: {},
        });
      }
    
      if (success) {
        res.status(200).json({
          status: success.status,
          message: success.message,
          data: success.data,
        });
      }
    });
  },

  getAllUsers: (req, res, next) => {
    const isActive = req.query.isActive;

    logger.trace('getAll', isActive);
    logger.trace('getAll');
    
    userService.getAll(isActive, (error, success) => {
      if (error) {
        return next({
          status: error.status,
          message: error.message,
          data: {},
        });
    
      }
      if (success) {
        res.status(200).json({
          status: 200,
          message: success.message,
          data: success.data,
        });
      }
    });
  },

  getUserById: (req, res, next) => {
    const userId = req.params.userId;
    const creatorId = req.userId;
    
    logger.trace('Getting user by id', userId);
    
    userService.getById(userId, creatorId, (error, success) => {

      if (error) {
        return next({
          status: error.status,
          message: error.message,
          data: {},
        });
      }

      if (success) {
        res.status(200).json({
          status: 200,
          message: success.message,
          data: success.data,
        });
      }
    });
  },

  deleteUserById: (req, res, next) => {
    const userId = req.params.userId;
    const creatorId = req.userId;

    logger.info('deleting user by id', userId);

    userService.delete(userId, creatorId, (error, success) => {
      if (error) {
        return next({
          status: error.status,
          message: error.message,
          data: {},
        });
      }

      if (success) {
        res.status(200).json({
          status: 200,
          message: success.message,
          data: success.data,
        });
      }
    });
  },

  editUserById: (req, res, next) => {
    const userId = req.params.userId;
    const user = req.body;
    const creatorId = req.userId;

    logger.info('updating user by id', userId);

    userService.update(userId, creatorId, user, (error, success) => {
      if (error) {
        return next({
          status: error.status,
          message: error.message,
          data: {},
        });
      }

      if (success) {
        res.status(200).json({
          status: 200,
          message: success.message,
          data: success.data,
        });
      }
    });
  },

  getProfile: (req, res, next) => {
    const userId = req.userId;
    logger.trace('Getting profile for userid', userId);
    userService.getProfile(userId, (error, success) => {
      if (error) {
        return next({
          status: error.status,
          message: error.message,
          data: {},
        });
      }

      if (success) {
        res.status(200).json({
          status: 200,
          message: success.message,
          data: success.data,
        });
      }
    });
  },
};

module.exports = userController;
