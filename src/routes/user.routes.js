const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Welcome!',
    });
  });
  
  router.post('/api/user', userController.addUser);
  
  router.get('/api/user', userController.getAllUsers);
  
  router.get('/api/user/:userId', userController.getUserById);
  
  router.put('/api/user/:userId', userController.editUserById);
    

  router.delete('/api/user/:userId', userController.deleteUserById);

  module.exports = router;