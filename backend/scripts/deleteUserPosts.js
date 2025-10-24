const mongoose = require("mongoose");
const User = require("../models/User");
const Post = require("../models/Post");
require("dotenv").config();

const deleteUserPosts = async () => {
  try {
    // Kết nối database
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/volunteerhub"
    );
    console.log("✅ Đã kết nối database");

    // Tìm users với username là "unknown" hoặc "testuser"
    const users = await User.find({
      username: { $in: ["unknown", "testuser"] },
    });

    if (users.length === 0) {
      console.log(
        "❌ Không tìm thấy user nào với username 'unknown' hoặc 'testuser'"
      );
      process.exit(0);
    }

    const userIds = users.map((u) => u._id);
    console.log(
      `📋 Tìm thấy ${users.length} users:`,
      users.map((u) => u.username)
    );

    // Xóa tất cả bài viết của các users này
    const result = await Post.deleteMany({
      user: { $in: userIds },
    });

    console.log(
      `✅ Đã xóa ${result.deletedCount} bài viết của unknown và testuser`
    );

    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error.message);
    process.exit(1);
  }
};

deleteUserPosts();
