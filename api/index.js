const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("../database/db");
const consoleManager = require("../utils/consoleManager");

dotenv.config();
const app = express();

// Connect to MongoDB (cached connection)
connectDB().catch((error) => {
  consoleManager.error(`Database connection failed: ${error.message}`);
  process.exit(1);
});

// CORS Configuration for credentialed requests
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow all origins for development
      callback(null, true);
    },
    methods: "GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true, // Allow credentials (cookies, HTTP authentication)
  })
);

// Middleware
app.use(express.json());

// Import routes

const loginRoute = require("../routes/auth/login");
const profileRoute = require("../routes/auth/profile");
const userRoute = require("../routes/user_routes");

app.use("/v1/auth", loginRoute);
app.use("/v1/get", profileRoute);
app.use("/v1/user", userRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  consoleManager.error(`Server error: ${err.stack}`);
  res.status(err.status || 500).send(err.message || "Something went wrong!");
});

// Start the server

// const PORT = process.env.PORT || 2310;
// app.listen(PORT, () => {
//   consoleManager.log(`Server is running on port ${PORT}`);
// });

module.exports = app;
