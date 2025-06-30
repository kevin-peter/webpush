const mysql = require("mysql2/promise");
const pool = require("./db/connect.js");

(async () => {
  const host = process.env.MYSQL_HOST || 'localhost';
  const user = process.env.MYSQL_USER || 'root';
  const password = process.env.MYSQL_PASSWORD || 'mysql';
  const database = process.env.MYSQL_DB || 'webpush';

  // 🔹 1) Connect without database, to create it if needed
  const serverConnection = await mysql.createConnection({ host, user, password });
  console.log(`✅ Connected to MySQL server at ${host}`);

  await serverConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  console.log(`✅ Database '${database}' ensured`);
  await serverConnection.end();
  await pool.query(`
    CREATE TABLE IF NOT EXISTS push_subscriptions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      endpoint VARCHAR(2048) NOT NULL,
      p256dh VARCHAR(255) NOT NULL,
      auth VARCHAR(255) NOT NULL,
      expirationTime BIGINT NULL,
      UNIQUE KEY endpoint_unique (endpoint(255))
    );
  `);

  console.log("✅ Migration completed: push_subscriptions table is ready.");
  await pool.end();
})();
