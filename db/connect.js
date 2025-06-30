require("dotenv").config();
const mysql = require("mysql2/promise");

// Create a single pool instance that will be reused across the app
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'mysql',
  database: process.env.MYSQL_DB || 'webpush',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Immediately test the connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL using connection pool");
    connection.release();
  } catch (err) {
    console.error("❌ Failed to connect to MySQL:", err);
    process.exit(1);
  }
})();

module.exports = pool;
