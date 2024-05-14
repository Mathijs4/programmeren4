const express = require('express');
const userRoutes = require('./src/routes/user.routes');
const authRoutes = require('./src/routes/authentication.routes').routes;
const bodyParser = require('body-parser');


const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.all('*', (req, res, next) => {
  const method = req.method;
  console.log('Method:', method);
  next();
});


app.use(userRoutes);
app.use('/api/auth', authRoutes);

app.all('/'), (req, res) =>{
  res.status(200).json({
    status: 200,
    message: 'Welcome to the API',
  });
};

app.all('*', (req, res) => {
  res.status(404).json({
    status: 404,
    message: 'Page not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  res.status(err.status).json(err)
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app