// Script to create an admin user
// Run: node scripts/createAdmin.js

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Admin credentials
    const adminData = {
      username: "admin",
      email: "admin@volunteerhub.com",
      password: "admin123", // Change this to a secure password
      fullName: "Administrator",
      role: "admin",
      isActive: true,
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log("Admin user already exists!");
      console.log("Email:", adminData.email);

      // Update to admin role if not already
      if (existingAdmin.role !== "admin") {
        existingAdmin.role = "admin";
        await existingAdmin.save();
        console.log("Updated user to admin role");
      }
    } else {
      // Create new admin user
      const admin = await User.create(adminData);
      console.log("Admin user created successfully!");
      console.log("Email:", admin.email);
      console.log("Username:", admin.username);
    }

    console.log("\n=================================");
    console.log("Admin Login Credentials:");
    console.log("=================================");
    console.log("Email:", adminData.email);
    console.log("Password:", adminData.password);
    console.log("=================================\n");

    process.exit(0);
  } catch (error) {
    console.error("Error creating admin:", error);
    process.exit(1);
  }
};

createAdmin();
