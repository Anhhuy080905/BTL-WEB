const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "registration_received", // Quản lý nhận được đăng ký
        "registration_pending", // Tình nguyện viên đã đăng ký chờ duyệt
        "registration_approved", // Đăng ký được phê duyệt
        "registration_rejected", // Đăng ký bị từ chối
        "checked_in", // Đã check-in
        "completed", // Đã hoàn thành
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: true,
    },
    relatedUser: {
      // User liên quan (ví dụ: tình nguyện viên đăng ký)
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    read: {
      type: Boolean,
      default: false,
    },
    link: {
      type: String, // Link để chuyển đến trang liên quan
    },
  },
  {
    timestamps: true,
  }
);

// Index để tìm kiếm nhanh
notificationSchema.index({ user: 1, read: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
