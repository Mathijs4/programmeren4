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

      const rolesString = roles.join(','); // Convert roles array to comma-separated string
      const values = [firstName, lastName, isActive, emailAdress, password, phoneNumber, rolesString, street, city];

      const sql = `INSERT INTO user (firstName, lastName, isActive, emailAdress, password, phoneNumber, roles, street, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;


      // Log the SQL query before executing
      logger.debug('Executing SQL query:', sql, 'with values:', values);

      connection.query(
        sql,
        values,
        function (error, results, fields) {
          connection.release();

          if (error) {
            if (error.code === 'ER_DUP_ENTRY') {
              const errorMessage = `Email address '${emailAdress}' already exists.`;
              const errorObject = new Error(errorMessage);
              errorObject.status = 400;
              callback(errorObject, null);
            } else {
              logger.error('Error creating user:', error.message || 'unknown error');
              const errorObject = new Error('Failed to create user');
              errorObject.status = 500;
              callback(errorObject, null);
            }
          } else {
            const userId = results.insertId; // Get the last insert ID
            logger.trace(`User created with ID: ${userId}`);

            const userDataWithId = { ...user, id: userId };
            callback(null, {
              status: 201,
              message: 'User registered successfully',
              data: userDataWithId,
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

  getById: (userId, creatorId, callback) => {
    logger.info('getById');
    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      connection.query(
        'SELECT id, emailAdress, firstName, lastName, phoneNumber, password FROM `user` WHERE id = ?',
        [userId],
        function (error, resultsUser, fields) {
          connection.release();

          if (error) {
            logger.error(error);
            callback(error, null);
          } else {
            logger.debug(resultsUser);
            userId = parseInt(userId, 10);
            creatorId = parseInt(creatorId, 10);
            if (resultsUser && resultsUser.length > 0) {
              if (userId !== creatorId) {
                resultsUser[0].password = undefined;
              }
              connection.query(
                'SELECT id, name, description FROM `meal` WHERE cookId = ?',
                [userId],
                function (error, resultsMeal, fields) {
                  connection.release();

                  if (error) {
                    logger.error(error);
                    callback(error, null);
                  } else {
                    logger.debug(resultsMeal);
                    callback(null, {
                      message: `Found ${resultsUser.length} user.`,
                      data: [resultsUser, resultsMeal],
                    });
                  }
                }
              );
            } else {
              const errorMessage = `User met ID ${userId} bestaat niet`;
              const errorObject = new Error(errorMessage);
              errorObject.status = 404;
              callback(errorObject, null);
            }
          }
        }
      );
    });
  },

  delete: (userId, creatorId, callback) => {
    logger.info('delete user', userId);

    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      userId = parseInt(userId, 10);
      if (creatorId === userId) {
        connection.query(
          'DELETE FROM `user` WHERE id = ?',
          (id = userId),
          function (error, results, fields) {
            connection.release();

            if (err) {
              logger.info(
                'error deleting user: ',
                err.message || 'unknown error'
              );
              callback(err, null);
            } else {
              logger.trace(`User deleted with id ${userId}.`);
              callback(null, {
                message: `User met ID ${userId} is verwijderd`,
                data: results,
              });
            }
          }
        );
      } else {
        logger.info('User not authorized to delete user');
        // callback(new Error('User not authorized to delete user'), null);
        const errorObject = new Error('User not authorized');
        errorObject.status = 403;
        callback(errorObject, null);
      }
    });
  },

  update: (userId, creatorId, user, callback) => {
    logger.info('update user', userId);
    userId = parseInt(userId, 10);

    if (userId === creatorId) {
      const { emailAddress } = user;

      logger.info('emailAddress:', emailAddress);

      if (!emailAddress) {
        const errorObject = new Error('Email address is required');
        errorObject.status = 400;
        return callback(errorObject, null);
      }

      database.getConnection(function (err, connection) {
        if (err) {
          logger.error(err);
          const errorObject = new Error('Database connection error');
          errorObject.status = 500;
          return callback(errorObject, null);
        }

        connection.query(
          'SELECT emailAdress FROM `user` WHERE id = ?',
          [userId],
          function (error, results, fields) {
            if (error) {
              connection.release();
              logger.error(error);
              const errorObject = new Error('Error querying database');
              errorObject.status = 500;
              return callback(errorObject, null);
            }

            const currentEmail = results[0].emailAdress;

            logger.debug('currentEmail:', currentEmail);

            if (currentEmail !== emailAddress) {
              connection.release();
              const errorObject = new Error(
                'Email address does not match the current email address of the user'
              );
              errorObject.status = 403;
              return callback(errorObject, null);
            }

            const valuesToUpdate = [];
            const columnsToUpdate = Object.keys(user)
              .filter(
                (key) =>
                  user[key] !== undefined &&
                  user[key] !== null &&
                  key !== 'emailAddress'
              )
              .map((key) => {
                valuesToUpdate.push(user[key]);
                return `${key}=?`;
              });

            if (columnsToUpdate.length === 0) {
              connection.release();
              const errorObject = new Error('No fields to update');
              errorObject.status = 400;
              return callback(errorObject, null);
            }

            const setClause = columnsToUpdate.join(', ');
            const sql = `UPDATE user SET ${setClause} WHERE id = ?`;

            const values = [...valuesToUpdate, userId];

            connection.query(sql, values, function (error, results, fields) {
              connection.release();

              if (error) {
                logger.error(
                  'Error updating user:',
                  error.message || 'unknown error'
                );
                const errorObject = new Error('Error updating user');
                errorObject.status = 500;
                return callback(errorObject, null);
              } else {
                logger.trace(`User updated with id ${userId}.`);
                callback(null, {
                  status: 200,
                  message: `User updated with id ${userId}.`,
                  data: user,
                });
              }
            });
          }
        );
      });
    } else {
      logger.info('User not authorized to update user');
      const errorObject = new Error('User not authorized to update user');
      errorObject.status = 403;
      callback(errorObject, null);
    }
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
