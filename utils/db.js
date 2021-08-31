const mysql = require('mysql2');
const keys = require('../keys');

const pool = mysql.createPool({ // Подключение к базе данных
  connectionLimit: keys.DB_CONNLIMIT,
  host: keys.DB_HOST, // Берётся из !!! файла keys
  user: keys.DB_USERNAME,
  password: keys.DB_PASSWORD,
  database: keys.DB_NAME,
  waitForConnections: true,
});

module.exports = pool.promise();
