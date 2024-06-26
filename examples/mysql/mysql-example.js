// Get the client
const mysql = require('mysql2');

// Create the connection to database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});

// A simple SELECT query
connection.query(
  'SELECT name, description FROM `meal` WHERE `isActive` = 1',
  function (err, results, fields) {
    console.log(results); // results contains rows returned by server
    console.log(fields); // fields contains extra meta data about results, if available
  }
);

// Using placeholders
connection.query(
  'SELECT * FROM `user` WHERE `firstName` = ? AND `id` > ?',
  ['Herman', 1],
  function (err, results) {
    console.log(results);
  }
);