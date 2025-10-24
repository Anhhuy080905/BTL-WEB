const Notification = require("../models/Notification");

// Tạo thông báo mới
const createNotification = async ({
  userId,
  type,
  title,
  message,
  eventId,
  relatedUserId = null,
  link = null,
}) => {
  try {
    const notification = await Notification.create({
      user: userId,
      type,
      title,
      message,
      event: eventId,
      relatedUser: relatedUserId,
      link,
    });
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

// Lấy tất cả thông báo của user
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id })
      .populate("event", "title date location")
      .populate("relatedUser", "username email")
      .sort({ createdAt: -1 })
      .limit(50);

    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.status(200).json({
      success: true,
      data: notifications,
      unreadCount,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Không thể tải thông báo",
    });
  }
};

// Đánh dấu thông báo đã đọc
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    // Kiểm tra quyền
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền truy cập thông báo này",
      });
    }

    notification.read = true;
    await notification.save();

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật thông báo",
    });
  }
};

// Đánh dấu tất cả đã đọc
const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { user: req.user.id, read: false },
      { read: true }
    );

    res.status(200).json({
      success: true,
      message: "Đã đánh dấu tất cả thông báo là đã đọc",
    });
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật thông báo",
    });
  }
};

// Xóa thông báo
const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông báo",
      });
    }

    // Kiểm tra quyền
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Không có quyền xóa thông báo này",
      });
    }

    await notification.deleteOne();

    res.status(200).json({
      success: true,
      message: "Đã xóa thông báo",
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa thông báo",
    });
  }
};

// Lấy số lượng thông báo chưa đọc
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      user: req.user.id,
      read: false,
    });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error getting unread count:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy số lượng thông báo",
    });
  }
};

module.exports = {
  createNotification,
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
