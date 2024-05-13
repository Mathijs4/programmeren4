const database = require('../dao/mysql-db');
const logger = require('../util/logger');

const userService = {
  create: (user, callback) => {
    logger.info('creating user', user);

    database.getConnection(function (err, connection) {
      if (err) {
        logger.error('Error creating user', err);
        callback(err, null);
        return;
      }

      const {
        firstName,
        lastName,
        isActive,
        emailAdress,
        password,
        phoneNumber,
        roles,
        street,
        city,
      } = user;

      connection.query(
        `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES ('${firstName}', '${lastName}', ${isActive}, '${emailAdress}', '${password}', '${phoneNumber}', '${roles}', '${street}', '${city}')`,

        function (error, results, fields) {
          connection.release();

          if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              const errorMessage = `Email address '${emailAdress}' already exists.`;
              const errorObject = new Error(errorMessage);

              errorObject.status = 400;
              callback(errorObject, null);
            } else {
              logger.error(
                'Error creating user:',
                error.message || 'unknown error'
              );

              callback(error, null);
            }
          } else {
            logger.trace('User created.');

            callback(null, {
              status: 201,
              message: 'User created.',
              data: user,
            });
          }
        }
      );
    });
  },

  getAll: (isActive, callback) => {
    logger.info('Getting all users');

    database.getConnection((err, connection) => {
      if (err) {
        logger.error('Error getting database connection:', err);
        callback(err, null);
      }

      let sql = 'SELECT * FROM `user`';
      const values = [];

      if (isActive !== undefined) {
        sql = 'SELECT * FROM `user` WHERE isActive = ?';
        values.push(isActive);
      }

      connection.query(sql, values, (error, results, fields) => {
        connection.release();

        if (error) {
          logger.error('Error executing SQL query:', error);
          return callback(error, null);
        }

        logger.debug('Query results:', results);

        const responseData = {
          message: `Found ${results.length} users.`,
          data: results,
        };

        callback(null, responseData);
      });
    });
  },

  getById: (userId, callback) => {
    logger.info('Getting user with id:', userId);

    database.getConnection((err, connection) => {
      if (err) {
        logger.error('Error getting database connection:', err);
        callback(err, null);
      }

      let sql = `SELECT * FROM user WHERE id = ${userId}`;
      const values = [];

      connection.query(sql, values, (error, results, fields) => {
        connection.release();

        if (error) {
          logger.error('Error executing SQL query:', error);
          return callback(error, null);
        }

        if (results.length === 0) {
          const error = {
            status: 404,
            message: `User with ID ${userId} not found`,
          };

          logger.warn(`User with ID ${userId} not found`);
          return callback(error, null);
        }

        logger.debug('Query results:', results);

        const responseData = {
          message: `Found user with id ${userId}`,
          data: results,
        };

        callback(null, responseData);
      });
    });
  },

  updateUserById: (userId, updatedData, callback) => {
    logger.info('Updating user with ID:', userId);

    // Call the database method to update a user by ID
    database.updateById(userId, updatedData, (err, updatedUser) => {
      if (err) {
        logger.error(
          `Error updating user with ID ${userId}:`,
          err.message || 'Unknown error'
        );
        return callback(err, null);
      }

      if (!updatedUser) {
        const error = {
          status: 404,
          message: `User with ID ${userId} not found`,
        };
        logger.warn(`User with ID ${userId} not found for update`);
        return callback(error, null);
      }

      logger.info('User updated:', updatedUser);
      callback(null, updatedUser);
    });
  },

  deleteUserById: (userId, callback) => {
    logger.info('Deleting user with ID:', userId);

    // Call the database method to delete a user by ID
    database.deleteUserById(userId, (err, deletedUser) => {
      if (err) {
        logger.error(
          `Error deleting user with ID ${userId}:`,
          err.message || 'Unknown error'
        );
        return callback(err, null);
      }

      if (!deletedUser) {
        const error = {
          status: 404,
          message: `User with ID ${userId} not found`,
        };
        logger.warn(`User with ID ${userId} not found for delete`);
        return callback(error, null);
      }

      // Deleted user successfully, pass the deleted user data to the callback
      callback(null, deletedUser);
    });
  },

  getProfile: (userId, callback) => {
    logger.info('getting profile userId:', userId);

    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      connection.query(
        `SELECT id, firstName, lastName FROM user WHERE id = ${userId}`,
    
        function (error, results, fields) {
          connection.release();

          if (error) {
            logger.error(error);
            callback(error, null);
          } else {
            logger.debug(results);
            callback(null, {
              message: `Found ${results.length} user.`,
              data: results,
            });
          }
        }
      );
    });
  },
};

module.exports = userService;
