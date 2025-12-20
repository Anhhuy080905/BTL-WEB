// Migration script để cập nhật approvalStatus cho các sự kiện cũ
// Chạy file này một lần để migrate data

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
const mongoose = require("mongoose");
const Event = require("../models/Event");

const migrateEventApprovalStatus = async () => {
  try {
    // Lấy MONGODB_URI từ environment
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!mongoUri) {
      console.error("❌ MONGODB_URI not found in environment variables");
      console.log(
        "Please make sure you have set MONGODB_URI in your environment or .env file"
      );
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("MongoDB Connected for migration");

    // Tìm tất cả sự kiện không có approvalStatus hoặc approvalStatus = null
    const eventsToUpdate = await Event.find({
      $or: [{ approvalStatus: { $exists: false } }, { approvalStatus: null }],
    });

    console.log(`Found ${eventsToUpdate.length} events to update`);

    if (eventsToUpdate.length === 0) {
      console.log(
        "No events to migrate. All events already have approvalStatus."
      );
      process.exit(0);
    }

    // Cập nhật tất cả sự kiện cũ với approvalStatus = "approved"
    const result = await Event.updateMany(
      {
        $or: [{ approvalStatus: { $exists: false } }, { approvalStatus: null }],
      },
      {
        $set: {
          approvalStatus: "approved",
          approvedAt: new Date(), // Set approved time
        },
      }
    );

    console.log(`✅ Migration completed successfully!`);
    console.log(`Updated ${result.modifiedCount} events`);
    console.log(`All existing events are now marked as "approved"`);

    // In ra một số thông tin về các sự kiện đã update
    const sampleUpdated = await Event.find({
      approvalStatus: "approved",
    })
      .limit(5)
      .select("title approvalStatus approvedAt");

    console.log("\nSample updated events:");
    sampleUpdated.forEach((event) => {
      console.log(`- ${event.title} (approvalStatus: ${event.approvalStatus})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }
};

// Chạy migration
migrateEventApprovalStatus();
