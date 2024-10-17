const express = require("express");
const UserService = require("../services/user_services");
const ResponseManager = require("../utils/responseManager");
const consoleManager = require("../utils/consoleManager");

const router = express.Router();

// Create a new user
router.post("/addUser", async (req, res) => {
  try {
    // Extract fields from the request body
    if (!req.body.userName) {
      return ResponseManager.handleBadRequestError(res, "User Name is required");
    }

    if (!req.body.email) {
      return ResponseManager.handleBadRequestError(res, "Email is required");
    }

    if (!req.body.password) {
      return ResponseManager.handleBadRequestError(res, "Password is required");
    }

    if (!req.body.phoneNumber) {
      return ResponseManager.handleBadRequestError(
        res,
        "Primary phone is required"
      );
    }

    if (!req.body.status) {
      return ResponseManager.handleBadRequestError(res, "Status is required");
    }

    // Create the user if all required fields are present
    const user = await UserService.createUser(req.body);
    return ResponseManager.sendSuccess(
      res,
      user,
      201,
      "User created successfully"
    );
  } catch (err) {
    return ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error creating user"
    );
  }
});

// Update a user by ID
router.put("/updateUser/:id", async (req, res) => {
  try {
    // Extract fields from the request body
    if (!req.body.userName) {
      return ResponseManager.handleBadRequestError(res, "User Name is required");
    }

    if (!req.body.email) {
      return ResponseManager.handleBadRequestError(res, "Email is required");
    }

    if (!req.body.password) {
      return ResponseManager.handleBadRequestError(res, "Password is required");
    }

    if (!req.body.phoneNumber) {
      return ResponseManager.handleBadRequestError(
        res,
        "Primary phone is required"
      );
    }

    if (!req.body.status) {
      return ResponseManager.handleBadRequestError(res, "Status is required");
    }

    // Update the user if all required fields are present
    const user = await UserService.updateUser(req.params.id, req.body);
    if (user) {
      return ResponseManager.sendSuccess(
        res,
        user,
        200,
        "User updated successfully"
      );
    } else {
      return ResponseManager.sendSuccess(
        res,
        [],
        200,
        "User not found for update"
      );
    }
  } catch (err) {
    return ResponseManager.sendError(
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
      ResponseManager.sendSuccess(res, [], 200, "User not found for deletion");
    }
  } catch (err) {
    ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error deleting user"
    );
  }
});

// Get all users
router.get("/getAllUsers", async (req, res) => {
  try {
    const { userName, email, page = 1, limit = 10 } = req.query;
    const result = await UserService.getAllUsers(
      { userName, email },
      page,
      limit
    );

    if (result.length == 0 || !result) {
      return ResponseManager.sendSuccess(res, [], 200, "No users found");
    }

    // Format the response as needed
    return ResponseManager.sendSuccess(
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
    consoleManager.error(`Error fetching users: ${err.message}`);
    return ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error fetching users"
    );
  }
});

  // Get a user by ID
router.get("/getUser/:id", async (req, res) => {
  try {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      return ResponseManager.sendSuccess(res, [], 200, "User not found");
    }
    return ResponseManager.sendSuccess(res, user, 200, "User retrieved successfully");
  } catch (err) {
    consoleManager.error(`Error fetching user by ID: ${err.message}`);
    return ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error fetching user"
    );
  }
});

module.exports = router;
