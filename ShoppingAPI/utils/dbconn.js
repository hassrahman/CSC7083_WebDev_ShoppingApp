const mysql = require("mysql2");

//creates the database connection object
const db = mysql
  .createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
  })
  .promise(); //The .promise() method enables the use of async/await



module.exports = db;