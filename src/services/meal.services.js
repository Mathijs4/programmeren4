const logger = require('../util/logger');
const database = require('../dao/mysql-db.js');

const mealService = {
  create: (meal, userId, callback) => {
    logger.info('create meal', meal);
    logger.info(' aaa ', meal.isVegan);

    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      const isVega = meal.isVega === 1 ? 1 : 0;
      const isVegan = meal.isVegan === 1 ? 1 : 0;
      const isToTakeHome = meal.isToTakeHome === 0 ? 0 : 1;
      const maxAmountOfParticipants = meal.maxAmountOfParticipants || 6; // Use default value if not provided
      const price = meal.price;
      const imageUrl = meal.imageUrl;
      const name = meal.name;
      const description = meal.description;
      const allergenes = meal.allergenes;

      logger.trace(
        isVegan,
        isVega,
        isToTakeHome,
        maxAmountOfParticipants,
        price,
        imageUrl,
        userId,
        name,
        description,
        allergenes
      );

      connection.query(
        'INSERT INTO meal (isVega, isVegan, isToTakeHome, maxAmountOfParticipants, price, imageUrl, cookId, createDate, updateDate, name, description, allergenes) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), ?, ?, ?)',
        [
          isVega,
          isVegan,
          isToTakeHome,
          maxAmountOfParticipants,
          price,
          imageUrl,
          userId,
          name,
          description,
          allergenes.join(', '), // Convert allergenes array to comma-separated string
        ],
        function (error, results, fields) {
          connection.release();

          if (error) {
            logger.error(
              'error creating meal:',
              error.message || 'unknown error'
            );
            callback(error, null);
          } else {
            logger.trace('Meal created');
            callback(null, {
              status: 201,
              message: 'Meal created',
              data: meal,
            });
          }
        }
      );
    });
  },

  getAll: (callback) => {
    logger.info('getting all meals');
    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      connection.query(
        'SELECT * FROM `meal`',
        function (error, results, fields) {
          connection.release();

          if (error) {
            logger.error(error);
            callback(error, null);
          } else {
            logger.debug(results);
            callback(null, {
              message: `Found ${results.length} meals.`,
              data: results,
            });
          }
        }
      );
    });
  },

  getById: (mealId, callback) => {
    logger.info('getById', mealId);
    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      connection.query(
        'SELECT * FROM `meal` WHERE id = ?',
        [mealId], // Provide mealId as a parameter to the query
        function (error, results, fields) {
          connection.release();

          if (error) {
            logger.error(error);
            callback(error, null);
          } else {
            if (results && results.length > 0) {
              // Meal found, return the data
              logger.debug(results);
              callback(null, {
                data: results,
              });
            } else {
              // Meal not found, return a 404 error
              const notFoundError = {
                status: 404,
                message: `Meal with ID ${mealId} not found`,
              };
              logger.error(notFoundError.message);
              callback(notFoundError, null);
            }
          }
        }
      );
    });
  },

  delete: (mealId, userId, callback) => {
    logger.info('deleting meal', mealId);

    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        if (callback) {
          callback({
            status: 500,
            message: 'Database connection error',
          });
        }
        return;
      }

      connection.query(
        'SELECT cookId FROM meal WHERE id = ?',
        [mealId],
        function (selectError, selectResults, selectFields) {
          connection.release(); // Release connection after query

          if (selectError) {
            const error = {
              status: 500,
              message: 'Error selecting meal',
            };
            logger.error(
              'Error selecting meal:',
              selectError.message || 'unknown error'
            );
            if (callback) {
              callback(error);
            }
            return;
          }

          if (selectResults && selectResults.length === 0) {
            const error = {
              status: 404,
              message: `Meal with ID ${mealId} not found`,
            };
            logger.error(error.message);
            if (callback) {
              callback(error);
            }
            return;
          }

          const cookId = selectResults[0].cookId;

          if (cookId !== userId) {
            const unauthorizedError = {
              status: 403,
              message: `Unauthorized to delete meal with ID ${mealId}`,
            };
            logger.error(unauthorizedError.message);
            if (callback) {
              callback(unauthorizedError);
            }
            return;
          }

          connection.query(
            'DELETE FROM `meal` WHERE id = ?',
            [mealId],
            function (deleteError, deleteResults, deleteFields) {
              if (deleteError) {
                const error = {
                  status: 500,
                  message: 'Error deleting meal',
                };
                logger.error(
                  'Error deleting meal:',
                  deleteError.message || 'unknown error'
                );
                if (callback) {
                  callback(error);
                }
              } else {
                if (deleteResults && deleteResults.affectedRows > 0) {
                  logger.trace(`Meal deleted with id ${mealId}.`);
                  if (callback) {
                    callback(null, {
                      status: 200,
                      message: `Meal with ID ${mealId} is deleted successfully`,
                      data: deleteResults,
                    });
                  }
                } else {
                  const error = {
                    status: 404,
                    message: `Meal with ID ${mealId} not found`, // This check is redundant; see the section below.
                  };
                  logger.error(error.message);
                  if (callback) {
                    callback(error);
                  }
                }
              }
              connection.release(); // Release connection after delete operation
            }
          );
        }
      );
    });
  },

  update: (mealId, meal, userId, callback) => {
    logger.info('Updating meal', mealId);
    mealId = parseInt(mealId, 10);

    if (!meal || typeof meal !== 'object' || Object.keys(meal).length === 0) {
      const errorObject = new Error('Meal data is required for update');
      errorObject.status = 400;
      return callback(errorObject, null);
    }

    // Retrieve the cookId associated with the mealId from the database
    database.getConnection((err, connection) => {
      if (err) {
        logger.error(
          'Error getting database connection:',
          err.message || 'unknown error'
        );
        const errorObject = new Error('Database connection error');
        errorObject.status = 500;
        return callback(errorObject, null);
      }

      const selectCookIdQuery = 'SELECT cookId FROM meal WHERE id = ?';
      connection.query(
        selectCookIdQuery,
        [mealId],
        (error, results, fields) => {
          connection.release(); // Release the connection after executing the query

          if (error) {
            logger.error(
              'Error retrieving cookId:',
              error.message || 'unknown error'
            );
            const errorObject = new Error('Error querying database');
            errorObject.status = 500;
            return callback(errorObject, null);
          }

          if (results.length === 0) {
            const notFoundError = new Error('Meal not found');
            notFoundError.status = 404;
            return callback(notFoundError, null);
          }

          const cookId = results[0].cookId;

          // Check if the retrieved cookId matches the userId
          if (cookId !== userId) {
            const unauthorizedError = new Error(
              'Unauthorized to update this meal'
            );
            unauthorizedError.status = 401;
            return callback(unauthorizedError, null);
          }

          const columnsToUpdate = Object.keys(meal).filter(
            (key) =>
              meal[key] !== undefined && meal[key] !== null && key !== 'cookId'
          );

          if (columnsToUpdate.length === 0) {
            const noFieldsError = new Error('No valid fields to update');
            noFieldsError.status = 400;
            return callback(noFieldsError, null);
          }

          const setClause = columnsToUpdate.map((key) => `${key}=?`).join(', ');
          const valuesToUpdate = columnsToUpdate.map((key) => {
            if (key === 'allergenes') {
              // Convert allergenes array to JSON string (or other suitable format)
              return JSON.stringify(meal[key]);
            } else {
              return meal[key];
            }
          });
          valuesToUpdate.push(mealId); // Add mealId at the end for WHERE clause
          

          const updateQuery = `UPDATE meal SET ${setClause} WHERE id = ?`;

          logger.debug('Update Query:', updateQuery);
          logger.debug('Values to Update:', valuesToUpdate);

          // Execute the UPDATE query with the prepared values
          connection.query(
            updateQuery,
            valuesToUpdate,
            (updateError, updateResults, updateFields) => {
              if (updateError) {
                logger.error(
                  'Error updating meal:',
                  updateError.message || 'unknown error'
                );
                const errorObject = new Error('Error updating meal');
                errorObject.status = 500;
                return callback(errorObject, null);
              }

              logger.trace(`Meal updated with id ${mealId}.`);
              callback(null, {
                message: `Meal updated with id ${mealId}.`,
                data: meal,
              });
            }
          );
        }
      );
    });
  },
};

module.exports = mealService;
