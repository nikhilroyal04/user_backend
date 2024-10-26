const express = require("express");
const jwt = require("jsonwebtoken");
const ResponseManager = require("../../utils/responseManager");
const consoleManager = require("../../utils/consoleManager");

const router = express.Router();

// Middleware to verify JWT token from the Authorization header
const authenticateToken = (req, res, next) => {
  // Get token from the Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return ResponseManager.handleUnauthorizedError(res, "No token provided");
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      consoleManager.error("Invalid token");
      return ResponseManager.handleUnauthorizedError(res, "Invalid token");
    }
    req.user = user; // Attach user info to the request object
    next();
  });
};

// Get profile route
router.get("/profile", authenticateToken, (req, res) => {
  try {
    // Retrieve user details from the decoded token
    const user = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phoneNumber: req.user.phoneNumber,
      role: req.user.role,
      status: req.user.status,
      createdOn: req.user.createdOn,
      updatedOn: req.user.updatedOn,
      reason: req.user.createdBy,
    };

    // Send success response with user profile details
    return ResponseManager.sendSuccess(
      res,
      user,
      200,
      "Profile details retrieved successfully"
    );
  } catch (err) {
    consoleManager.error(`Error fetching user profile: ${err.message}`);
    return ResponseManager.sendError(
      res,
      500,
      "INTERNAL_ERROR",
      "Error fetching user profile"
    );
  }
});

module.exports = router;
