const mealService = require('../services/meal.services')
const logger = require('../util/logger')
const userService = require("../services/user.services");

let userController = {
    addMeal: (req, res, next) => {
        const meal = req.body
        const userId = req.userId

        logger.info('creating meal ', meal.name, meal.id, ' for userId: ', userId)

        mealService.create(meal, userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                })
            }
            if (success) {
                res.status(200).json({
                    status: success.status,
                    message: success.message,
                    data: success.data
                })
            }
        })
    },

    getAllMeals: (req, res, next) => {
        logger.trace('Getting all users')
        mealService.getAll((error, success) => {
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
    },

    getMealById: (req, res, next) => {
        const mealId = req.params.mealId;
        
        logger.trace('Getting meal by id', mealId);

        mealService.getById(mealId, (error, success) => {

            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
        
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    deleteMealById: (req, res, next) => {
        const mealId = req.params.mealId;
        const userId = req.userId;

        logger.info('deleting meal by id', mealId);

        mealService.delete(mealId, userId, (error, success) => {

            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }
            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                });
            }
        });
    },

    updateMealById: (req, res, next) => {
        const mealId = req.params.mealId;
        const userId = req.userId;

        const meal = req.body;
        logger.info('updating meal by id', mealId);
        mealService.update(mealId, meal, userId, (error, success) => {
            if (error) {
                return next({
                    status: error.status,
                    message: error.message,
                    data: {}
                });
            }

            if (success) {
                res.status(200).json({
                    status: 200,
                    message: success.message,
                    data: success.data
                });
            }
        });
    }

}
module.exports = userController