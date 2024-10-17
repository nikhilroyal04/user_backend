const mongoose = require("mongoose");

// Define the user schema
const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  city: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive", "Banned"],
    default: "Active",
  },
  createdOn: {
    type: String,
    default: Date.now(),
  },
  updatedOn: {
    type: String,
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

// Export the User model
module.exports = User;
