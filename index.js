const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

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

app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Page not found',
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
