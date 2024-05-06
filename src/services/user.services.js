const database = require('../dao/inmem-db');
const logger = require('../utils/logger');

const userService = {
  create: (user, callback) => {
    logger.info('Create user', user);

    database.add(user, (err, data) => {
      if (err) {
        logger.info('Error creating user', err.message || 'Unknown error');
        callback(err, null);
      } else {
        logger.trace(`User created with id ${user.id}`);
        callback(null, {
          message: `User created with id ${user.id}`,
          data: data,
        });
      }
    });
  },

  getAll: (callback) => {
    logger.info('Get all users');

    database.getAll((err, data) => {
      if (err) {
        logger.info('Error getting all users', err.message || 'Unknown error');
        callback(err, null);
      } else {
        logger.trace('All users returned');
        callback(null, data);
      }
    });
  },
  
  getById: (userId, callback) => {
    logger.info('Get user by id', userId);

    database.getById(userId, (err, user) => {
      if (err) {
        logger.info('Error getting user by id', err.message || 'Unknown error');
        callback(err, null);
      } else {
        logger.trace(`User with id ${userId} returned`);
        callback(null, user);
      }
    });
  },

  updateUserById: (userId, updatedData, callback) => {
    logger.info('Updating user with ID:', userId);

    // Call the database method to update a user by ID
    database.updateById(userId, updatedData, (err, updatedUser) => {
      if (err) {
        logger.error(`Error updating user with ID ${userId}:`, err.message || 'Unknown error');
        return callback(err, null);
      }

      if (!updatedUser) {
        const error = { status: 404, message: `User with ID ${userId} not found` };
        logger.warn(`User with ID ${userId} not found for update`);
        return callback(error, null);
      }

      logger.info('User updated:', updatedUser);
      callback(null, updatedUser);
    });
  },
};

module.exports = userService;
