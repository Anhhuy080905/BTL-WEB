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
        "post_like", // Ai đó đã thích bài viết
        "post_comment", // Ai đó đã bình luận bài viết
        "event_approval_request", // Admin nhận yêu cầu phê duyệt sự kiện
        "event_approved", // Event Manager: sự kiện được phê duyệt
        "event_rejected", // Event Manager: sự kiện bị từ chối
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
      required: false, // Không bắt buộc vì một số notification không liên quan event
    },
    post: {
      // Bài viết liên quan (cho like, comment)
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
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
