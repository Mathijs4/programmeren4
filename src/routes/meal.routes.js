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
  
      assert.strictEqual(typeof isVega, 'number', 'isVega should be a number');
      assert.strictEqual(
        isVega === 0 || isVega === 1,
        true,
        'isVega should be either 0 or 1'
      );
  
      assert.strictEqual(typeof isVegan, 'number', 'isVegan should be a number');
      assert.strictEqual(
        isVegan === 0 || isVegan === 1,
        true,
        'isVegan should be either 0 or 1'
      );
  
      assert.strictEqual(
        typeof isToTakeHome,
        'number',
        'isToTakeHome should be a number'
      );
      assert.strictEqual(
        isToTakeHome === 0 || isToTakeHome === 1,
        true,
        'isToTakeHome should be either 0 or 1'
      );
  
      assert.ok(
        maxAmountOfParticipants,
        'maxAmountOfParticipants should not be empty'
      );
      assert.strictEqual(
        typeof maxAmountOfParticipants,
        'number',
        'maxAmountOfParticipants should be a number'
      );
      assert.strictEqual(
        maxAmountOfParticipants > 0,
        true,
        'maxAmountOfParticipants should be a positive number'
      );
  
      assert.ok(price, 'price should not be empty');
      assert.strictEqual(typeof price, 'number', 'price should be a number');
      assert.strictEqual(price > 0, true, 'price should be a positive number');
  
      assert.strictEqual(
        typeof imageUrl,
        'string',
        'imageUrl should be a string'
      );
  
      assert.ok(name, 'name should not be empty');
      assert.strictEqual(typeof name, 'string', 'name should be a string');
  
      assert.ok(description, 'description should not be empty');
      assert.strictEqual(
        typeof description,
        'string',
        'description should be a string'
      );
  
      assert.ok(Array.isArray(allergenes), 'allergenes should be an array');
      const validAllergenes = new Set(['gluten', 'lactose', 'noten']);
      assert.ok(
        allergenes.every((allergen) => validAllergenes.has(allergen)),
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
  

router.post(
  '/api/meal',
  validateToken,
  validateMealCreate,
  mealController.addMeal
);
router.get('/api/meal', validateToken, mealController.getAllMeals);
router.get('/api/meal/:mealId', mealController.getMealById);
// // router.put('/api/meal/:mealId', mealController.update)
router.delete('/api/meal/:mealId', mealController.deleteMealById);

module.exports = router;
