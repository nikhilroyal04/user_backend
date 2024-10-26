// routes/auth/login.js

const express = require("express");
const LoginService = require("../../services/auth_services");
const ResponseManager = require("../../utils/responseManager");
const consoleManager = require("../../utils/consoleManager");

const router = express.Router();

// User login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate request body
    if (!email || !password) {
      return ResponseManager.handleBadRequestError(
        res,
        "Email and password are required"
      );
    }

    // Attempt to log in the user
    const token = await LoginService.loginUser(email, password);

    // Send success response with token only
    return ResponseManager.sendSuccess(res, { token }, 200, "Login successful");
  } catch (err) {
    // Log the specific error and respond accordingly
    consoleManager.error(`Login error: ${err.message}`);
    
    if (err.message === "User not found") {
      return ResponseManager.sendError(res, 404, "USER_NOT_FOUND", "User not found");
    } 
    if (err.message === "Invalid password") {
      return ResponseManager.sendError(res, 401, "INVALID_PASSWORD", "Invalid password");
    }

    // For any other errors
    return ResponseManager.sendError(res, 500, "INTERNAL_ERROR", "Error logging in user");
  }
});

module.exports = router;
