const express = require("express");
const router = express.Router();
const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/auth");

// Tất cả routes đều cần đăng nhập
router.use(protect);

// Lấy tất cả thông báo
router.get("/", getMyNotifications);

// Lấy số lượng chưa đọc
router.get("/unread-count", getUnreadCount);

// Đánh dấu tất cả đã đọc
router.put("/mark-all-read", markAllAsRead);

// Đánh dấu một thông báo đã đọc
router.put("/:id/read", markAsRead);

// Xóa thông báo
router.delete("/:id", deleteNotification);

module.exports = router;
