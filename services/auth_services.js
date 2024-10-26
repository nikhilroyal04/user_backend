const db = require("../database/db");
const jwt = require("jsonwebtoken");
const consoleManager = require("../utils/consoleManager");

class LoginService {
  async loginUser(email, password) {
    try {
      // Find the user by email
      const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0) {
        consoleManager.error("User not found");
        throw new Error("User not found");
      }

      const user = rows[0];

      // Compare the provided password with the stored password
      if (user.password !== password) {
        consoleManager.error("Invalid password");
        throw new Error("Invalid password");
      }

      // Generate a JWT token with user details
      const payload = {
        userId: user.userId,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        createdOn: user.createdOn,
        updatedOn: user.updatedOn,
      };

      // Use environment variables for secret and expiration time
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      consoleManager.log("User logged in successfully");

      return token; // Return only the token
    } catch (err) {
      consoleManager.error(`Error logging in user: ${err.message}`);
      throw err;
    }
  }
}

module.exports = new LoginService();
