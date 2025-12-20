// Admin route để migrate approvalStatus cho các sự kiện cũ
const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const { protect, authorize } = require("../middleware/auth");

// POST /api/admin/migrate-approval-status
// Migrate tất cả sự kiện cũ sang approvalStatus = 'approved'
router.post(
  "/migrate-approval-status",
  protect,
  authorize("admin"),
  async (req, res) => {
    try {
      // Tìm tất cả sự kiện không có approvalStatus
      const eventsToUpdate = await Event.find({
        $or: [{ approvalStatus: { $exists: false } }, { approvalStatus: null }],
      });

      console.log(`Found ${eventsToUpdate.length} events to update`);

      if (eventsToUpdate.length === 0) {
        return res.json({
          success: true,
          message:
            "No events to migrate. All events already have approvalStatus.",
          count: 0,
        });
      }

      // Cập nhật tất cả sự kiện cũ
      const result = await Event.updateMany(
        {
          $or: [
            { approvalStatus: { $exists: false } },
            { approvalStatus: null },
          ],
        },
        {
          $set: {
            approvalStatus: "approved",
            approvedAt: new Date(),
          },
        }
      );

      console.log(
        `Migration completed: Updated ${result.modifiedCount} events`
      );

      res.json({
        success: true,
        message: `Successfully migrated ${result.modifiedCount} events to approved status`,
        count: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error in migration:", error);
      res.status(500).json({
        success: false,
        message: "Failed to migrate events",
        error: error.message,
      });
    }
  }
);

module.exports = router;
