const db = require("../database/db");
const consoleManager = require("../utils/consoleManager");

class UserService {
  // Get all users with optional filtering
  static async getAllUsers(filters, page, limit) {
    try {
      const { name, email } = filters;
      const offset = (page - 1) * limit;

      let query = "SELECT * FROM user WHERE 1=1";
      const queryParams = [];

      // Apply filters
      if (name) {
        query += " AND name LIKE ?";
        queryParams.push(`%${name}%`);
      }
      if (email) {
        query += " AND email = ?";
        queryParams.push(email);
      }

      query += " LIMIT ? OFFSET ?"; // Add pagination
      queryParams.push(limit, offset);

      const [users] = await db.query(query, queryParams);

      // Get total count for pagination
      const [[{ totalCount }]] = await db.query(
        "SELECT COUNT(*) AS totalCount FROM user WHERE 1=1" +
          (name ? " AND name LIKE ?" : "") +
          (email ? " AND email = ?" : ""),
        queryParams.slice(0, -2) 
      );

      return {
        users,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: page,
        totalUsers: totalCount,
      };
    } catch (error) {
      consoleManager.error("Error fetching all users:", error);
      throw new Error("Could not retrieve users");
    }
  }

  // Get a user by ID
  static async getUserById(id) {
    try {
      const [user] = await db.query("SELECT * FROM user WHERE id = ?", [id]);
      return user.length ? user[0] : null;
    } catch (error) {
      consoleManager.error(`Error fetching user by ID (${id}):`, error);
      throw new Error("Could not retrieve user");
    }
  }

  // Create a new user
  static async createUser(userData) {
    const { name, email, password, phone, status } = userData; // Expecting an object
    const createdOn = Date.now();
    const updatedOn = Date.now();

    try {
      const result = await db.query(
        "INSERT INTO user (name, email, password, phone, status, createdOn, updatedOn) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [name, email, password, phone, status, createdOn, updatedOn]
      );
      consoleManager.log(`User created with ID: ${result[0].insertId}`);
      return {
        id: result[0].insertId,
        name,
        email,
        phone,
        status,
        createdOn,
        updatedOn,
      };
    } catch (error) {
      consoleManager.error("Error creating user:", error);
      throw new Error("Could not create user");
    }
  }

  // Update an existing user
  static async updateUser(id, userData) {
    const { name, email, password, phone, status } = userData;
    const updatedOn = Date.now();

    try {
      const result = await db.query(
        "UPDATE user SET name = ?, email = ?, password = ?, phone = ?, status = ?, updatedOn = ? WHERE id = ?",
        [name, email, password, phone, status, updatedOn, id]
      );
      const updated = result[0].affectedRows > 0;
      consoleManager.log(`User updated with ID: ${id}, success: ${updated}`);
      return updated; // Return true if user was updated, false otherwise
    } catch (error) {
      consoleManager.error(`Error updating user with ID (${id}):`, error);
      throw new Error("Could not update user");
    }
  }

  // Delete a user by ID
  static async deleteUser(id) {
    try {
      const result = await db.query("DELETE FROM user WHERE id = ?", [id]);
      const deleted = result[0].affectedRows > 0;
      consoleManager.log(`User deleted with ID: ${id}, success: ${deleted}`);
      return deleted; // Return true if user was deleted, false otherwise
    } catch (error) {
      consoleManager.error(`Error deleting user with ID (${id}):`, error);
      throw new Error("Could not delete user");
    }
  }
}

module.exports = UserService;
