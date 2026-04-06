// database.js
import mysql from 'mysql2/promise';

const db = await mysql.createPool({
  host: 'localhost',       // tu host, normalmente localhost
  user: 'root',            // tu usuario
  password: '', // reemplaza con tu contraseña
  database: 'celulares_shop',     // la base de datos que creaste
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default db;
