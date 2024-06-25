const express = require('express');
const assert = require('assert');
const chai = require('chai');
chai.should();
const router = express.Router();
const mealController = require('../controllers/meal.controller');
const logger = require('../util/logger');
const validateToken = require('./authentication.routes').validateToken;

const validateMealCreate = (req, res, next) => {
    try {
        const {
            isVega,
            isVegan,
            isToTakeHome,
            maxAmountOfParticipants,
            price,
            imageUrl,
            name,
            description,
            allergenes,
        } = req.body;

        assert.strictEqual(typeof isVega, 'boolean', 'isVega should be a boolean');

        assert.strictEqual(typeof isVegan, 'boolean', 'isVegan should be a boolean');

        assert.strictEqual(typeof isToTakeHome, 'boolean', 'isToTakeHome should be a boolean');

        assert.ok(maxAmountOfParticipants, 'maxAmountOfParticipants should not be empty');
        assert.strictEqual(typeof maxAmountOfParticipants, 'number', 'maxAmountOfParticipants should be a number');
        assert.strictEqual(maxAmountOfParticipants > 0, true, 'maxAmountOfParticipants should be a positive number');

        assert.ok(price, 'price should not be empty');
        assert.strictEqual(typeof price, 'number', 'price should be a number');
        assert.strictEqual(price > 0, true, 'price should be a positive number');

        assert.strictEqual(typeof imageUrl, 'string', 'imageUrl should be a string');

        assert.ok(name, 'name should not be empty');
        assert.strictEqual(typeof name, 'string', 'name should be a string');

        assert.ok(description, 'description should not be empty');
        assert.strictEqual(typeof description, 'string', 'description should be a string');

        assert.ok(Array.isArray(allergenes), 'allergenes should be an array');
        const validAllergenes = new Set(['gluten', 'lactose', 'noten']);
        assert.ok(
            allergenes.every(allergen => validAllergenes.has(allergen)),
            'allergenes should only accept values "gluten", "lactose", or "noten"'
        );

        next();
    } catch (err) {
        return res.status(400).json({
            status: 400,
            message: 'Invalid user data',
            error: err.toString(),
        });
    }
};

const validateMealId = (req, res, next) => {
    try {
        const mealId = parseInt(req.params.mealId, 10);
        assert(!isNaN(mealId), 'Invalid mealId');
        assert.strictEqual(typeof mealId, 'number', 'mealId must be a number');

        logger.info('mealId successfully validated:', mealId);
        next();
    } catch (err) {
        logger.error('mealId validation failed:', err.message);
        return res.status(400).json({
            status: 400,
            message: err.message || 'Invalid mealId',
        });
    }
};

router.post(
    '/api/meal',
    validateToken,
    validateMealCreate,
    mealController.addMeal
);

router.get('/api/meal', mealController.getAllMeals);

router.get('/api/meal/:mealId', validateMealId, mealController.getMealById);

router.put('/api/meal/:mealId', validateToken, validateMealId, mealController.updateMealById);

router.delete('/api/meal/:mealId', validateToken, validateMealId, mealController.deleteMealById);

module.exports = router;
