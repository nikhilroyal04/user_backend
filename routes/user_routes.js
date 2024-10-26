const express = require("express");
const UserService = require("../services/user_services");
const ResponseManager = require("../utils/responseManager");
const ConsoleManager = require("../utils/consoleManager");

const router = express.Router();

// Centralized validation function
const validateUserData = (data) => {
  const { name, email, password, phone, status } = data;
  if (!name) return "Name is required";
  if (!email) return "Email is required";
  if (!password) return "Password is required";
  if (!phone) return "Primary phone is required";
  if (!status) return "Status is required";
  return null;
};

// Add a new user
router.post("/addUser", async (req, res) => {
  try {
    const validationError = validateUserData(req.body);
    if (validationError) {
      return ResponseManager.handleBadRequestError(res, validationError);
    }

    // Prepare user data with timestamps
    const userData = {
      ...req.body,
      createdOn: Date.now(),
      updatedOn: Date.now(),
    };

    // Create user
    const user = await UserService.createUser(userData);
    ResponseManager.sendSuccess(res, user, 201, "User created successfully");
  } catch (err) {
    ConsoleManager.error(`Error creating user: ${err.message}`);
    ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error creating user"
    );
  }
});

// Update an existing user by ID
router.put("/updateUser/:id", async (req, res) => {
  try {
    const validationError = validateUserData(req.body);
    if (validationError) {
      return ResponseManager.handleBadRequestError(res, validationError);
    }

    // Prepare user data with updated timestamp
    const userData = {
      ...req.body,
      updatedOn: Date.now(),
    };

    // Update user
    const user = await UserService.updateUser(req.params.id, userData);
    if (user) {
      ResponseManager.sendSuccess(res, user, 200, "User updated successfully");
    } else {
      ResponseManager.sendSuccess(res, [], 404, "User not found for update");
    }
  } catch (err) {
    ConsoleManager.error(`Error updating user: ${err.message}`);
    ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error updating user"
    );
  }
});

// Delete a user by ID
router.delete("/deleteUser/:id", async (req, res) => {
  try {
    const user = await UserService.deleteUser(req.params.id);
    if (user) {
      ResponseManager.sendSuccess(res, user, 200, "User deleted successfully");
    } else {
      ResponseManager.sendSuccess(res, [], 404, "User not found for deletion");
    }
  } catch (err) {
    ConsoleManager.error(`Error deleting user: ${err.message}`);
    ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error deleting user"
    );
  }
});

// Retrieve all users with optional pagination and filtering
router.get("/getAllUsers", async (req, res) => {
  try {
    const { name, email, page = 1, limit = 10 } = req.query;

    // Convert to integers
    const pageNumber = parseInt(page, 10) || 1; 
    const limitNumber = parseInt(limit, 10) || 10;

    const result = await UserService.getAllUsers(
      { name, email },
      pageNumber,
      limitNumber
    );

    if (result.users.length === 0) {
      return ResponseManager.sendSuccess(res, [], 200, "No users found");
    }

    // Send paginated user data
    ResponseManager.sendSuccess(
      res,
      {
        users: result.users,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        totalUsers: result.totalUsers,
      },
      200,
      "Users retrieved successfully"
    );
  } catch (err) {
    ConsoleManager.error(`Error fetching users: ${err.message}`);
    ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error fetching users"
    );
  }
});

// Get a single user by ID
router.get("/getUser/:id", async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return ResponseManager.sendSuccess(res, [], 404, "User not found");
    }
    ResponseManager.sendSuccess(res, user, 200, "User retrieved successfully");
  } catch (err) {
    ConsoleManager.error(`Error fetching user by ID: ${err.message}`);
    ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error fetching user"
    );
  }
});

module.exports = router;
