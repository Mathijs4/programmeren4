const express = require('express');
const router = express.Router();

let users = [];
let id = 0;

router.get('/', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'Hello World!',
    });
  });
  
  router.post('/api/user', (req, res) => {
    let user = req.body;
    id++;
  
    console.log('User:', user);
  
    user = {
      id,
      ...user,
    };
  
    users.push(user);
    console.log('Database:', users);
  
    res.status(201).json({
      status: 201,
      message: 'User created',
      user,
    });
  });
  
  router.get('/api/user', (req, res) => {
    res.status(200).json({
      status: 200,
      message: 'List of users',
      users,
    });
  });
  
  router.get('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));
  
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      res.status(200).json({
        status: 200,
        message: 'User found',
        user,
      });
    }
  });
  
  router.put('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));
    const updatedUser = req.body;
  
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      users[userId - 1] = {
        ...users[userId - 1],
        ...updatedUser,
      };
  
      res.status(200).json({
        status: 200,
        message: 'User updated',
        user: users[userId - 1],
      });
    }
  });
  
  router.delete('/api/user/:userId', (req, res) => {
    const userId = req.params.userId;
    const user = users.find((user) => user.id === Number(userId));
  
    if (!user) {
      return res.status(404).json({
        status: 404,
        message: `User with id ${userId} not found`,
      });
    } else {
      users = users.filter((user) => user.id !== Number(userId));
  
      res.status(200).json({
        status: 200,
        message: 'User deleted',
      });
    }
  });

  module.exports = router;