/**
 * TEMPORARY ROUTE - Make a user admin
 * Add this route to server.js temporarily to upgrade a user to admin
 * Remove after creating admin account
 */

const express = require("express");
const User = require("../models/User");

const makeAdminRoute = express.Router();

// @desc    Make a user admin (TEMPORARY - FOR DEVELOPMENT ONLY)
// @route   POST /api/make-admin
// @access  Public (REMOVE IN PRODUCTION!)
makeAdminRoute.post("/", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.role = "admin";
    await user.save();

    res.json({
      success: true,
      message: `User ${user.email} is now an admin`,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error making user admin:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

module.exports = makeAdminRoute;
