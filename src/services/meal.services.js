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
              status: 200,
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
            logger.debug(results);
            callback(null, {
              data: results,
            });
          }
        }
      );
    });
  },

  delete: (mealId, callback) => {
    logger.info('delete meal', mealId);
    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      connection.query(
        'DELETE FROM `meal` WHERE id = ?',
        [mealId], // Provide mealId as a parameter to the query
        function (error, results, fields) {
          connection.release();

          if (error) {
            logger.error(
              'error deleting meal: ',
              error.message || 'unknown error'
            );
            callback(error, null);
          } else {
            logger.trace(`Meal deleted with id ${mealId}.`);
            callback(null, {
              message: `Maaltijd met ID ${mealId} is verwijderd`,
              data: results,
            });
          }
        }
      );
    });
  },

  update: (mealId, meal, callback) => {
    logger.info('update meal', mealId);

    const valuesToUpdate = [];
    const columnsToUpdate = Object.keys(meal)
      .filter((key) => meal[key] !== undefined && meal[key] !== null)
      .map((key) => {
        valuesToUpdate.push(meal[key]);
        return `${key}=?`;
      });

    if (columnsToUpdate.length === 0) {
      callback(new Error('No fields to update'), null);
      return;
    }

    const setClause = columnsToUpdate.join(', ');
    const sql = `UPDATE meal SET ${setClause} WHERE id = ?`;

    database.getConnection(function (err, connection) {
      if (err) {
        logger.error(err);
        callback(err, null);
        return;
      }

      const values = [...valuesToUpdate, mealId];

      connection.query(sql, values, function (error, results, fields) {
        connection.release();

        if (error) {
          logger.error(
            'Error updating meal:',
            error.message || 'unknown error'
          );
          callback(error, null);
        } else {
          logger.trace(`Meal updated with id ${mealId}.`);
          callback(null, {
            message: `Meal updated with id ${mealId}.`,
            data: results,
          });
        }
      });
    });
  },
};

module.exports = mealService;
