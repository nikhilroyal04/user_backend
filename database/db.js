const mysql = require("mysql2");
const consoleManager = require("../utils/consoleManager");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "user_management",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test the connection
pool.getConnection((err, connection) => {
  if (err) {
    consoleManager.error(`MySQL connection error: ${err.message}`);
    process.exit(1);
  } else {
    consoleManager.log("MySQL connected successfully");
    connection.release();
  }
});

module.exports = pool.promise();
