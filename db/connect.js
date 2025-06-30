require("dotenv").config();

const mysql = require("mysql2/promise");
async function getDbConnection() {
  const db = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'mysql',
    database: process.env.MYSQL_DB || 'webpush'
  });
  console.log("✅ Connected to MySQL");
  return db;
}

module.exports = getDbConnection;
