const mysql = require('mysql2');
const keys = require('../keys');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);

const pool = mysql.createPool({ // Подключение к базе данных
  connectionLimit: keys.DB_CONNLIMIT,
  host: keys.DB_HOST, // Берётся из !!! файла keys
  user: keys.DB_USERNAME,
  password: keys.DB_PASSWORD,
  database: keys.DB_NAME,
  waitForConnections: true,
});

const db = pool.promise();

const sessionStore = new MySQLStore({}, db); // Создаём хранилище в БД для данных сессий

module.exports = {
  db,
  sessionStore
}
