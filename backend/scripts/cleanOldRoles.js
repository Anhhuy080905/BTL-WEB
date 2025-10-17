/**
 * Script to clean up old user roles
 * - Delete users with role "USER" or "ORGANIZER"
 * - Keep only users with: volunteer, event_manager, admin
 */

require("dotenv").config();
const mongoose = require("mongoose");
const User = require("../models/User");

const cleanOldRoles = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected\n");

    // Find all users with old roles
    const oldRoleUsers = await User.find({
      role: { $in: ["USER", "ORGANIZER", "user", "organizer"] },
    });

    console.log(`📋 Found ${oldRoleUsers.length} users with old roles:\n`);

    if (oldRoleUsers.length > 0) {
      oldRoleUsers.forEach((user, index) => {
        console.log(
          `${index + 1}. ${user.username} (${user.email}) - Role: ${user.role}`
        );
      });

      console.log("\n🗑️  Deleting users with old roles...\n");

      const result = await User.deleteMany({
        role: { $in: ["USER", "ORGANIZER", "user", "organizer"] },
      });

      console.log(`✅ Deleted ${result.deletedCount} users with old roles\n`);
    } else {
      console.log("✨ No users with old roles found!\n");
    }

    // Show remaining users
    const remainingUsers = await User.find().select("username email role");
    console.log(`\n📊 Remaining users (${remainingUsers.length}):\n`);

    remainingUsers.forEach((user, index) => {
      const roleIcon =
        user.role === "admin"
          ? "👑"
          : user.role === "event_manager"
          ? "👨‍💼"
          : "🙋";
      console.log(
        `${index + 1}. ${roleIcon} ${user.username} (${user.email}) - ${
          user.role
        }`
      );
    });

    console.log("\n✅ Cleanup completed successfully!\n");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error cleaning old roles:", error);
    process.exit(1);
  }
};

cleanOldRoles();
