const mongoose = require("mongoose");
const Event = require("../models/Event");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const clearAllEvents = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✓ Đã kết nối MongoDB");

    // Xóa tất cả sự kiện
    const result = await Event.deleteMany({});
    console.log(`✓ Đã xóa ${result.deletedCount} sự kiện`);

    // Đóng kết nối
    await mongoose.connection.close();
    console.log("✓ Hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("✗ Lỗi:", error);
    process.exit(1);
  }
};

clearAllEvents();
