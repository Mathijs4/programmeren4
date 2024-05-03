const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.json());

let database = [];
let id = 0;

app.all('*', (req, res, next) => {
  const method = req.method;
  console.log('Method:', method);
  next();
});

app.get('/', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'Hello World!',
  });
});

app.post('/api/user', (req, res) => {
  let user = req.body;
  id++;

  console.log('User:', user);

  user = {
    id,
    ...user,
  };
  
  database.push(user);
  console.log('Database:', database)

  res.status(201).json({
    status: 201,
    message: 'User created',
    user,
  });
});

app.get('/api/user', (req, res) => {
  res.status(200).json({
    status: 200,
    message: 'List of users',
    database,
  });
});

app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Page not found',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
