const mongoose = require("mongoose");
const slugify = require('slugify')

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Vui lòng nhập tiêu đề sự kiện"],
      trim: true,
      minlength: [10, "Tiêu đề phải có ít nhất 10 ký tự"],
      maxlength: [200, "Tiêu đề không được vượt quá 200 ký tự"],
    },
    organization: {
      type: String,
      required: [true, "Vui lòng nhập tên tổ chức"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Vui lòng chọn ngày tổ chức"],
      validate: {
        validator: function (v) {
          return v > new Date();
        },
        message: "Ngày tổ chức phải là ngày trong tương lai",
      },
    },
    location: {
      type: String,
      required: [true, "Vui lòng nhập địa điểm"],
      trim: true,
      minlength: [5, "Địa điểm phải có ít nhất 5 ký tự"],
      maxlength: [200, "Địa điểm không được vượt quá 200 ký tự"],
    },
    description: {
      type: String,
      required: [true, "Vui lòng nhập mô tả sự kiện"],
      minlength: [50, "Mô tả phải có ít nhất 50 ký tự"],
      maxlength: [2000, "Mô tả không được vượt quá 2000 ký tự"],
    },
    maxParticipants: {
      type: Number,
      required: [true, "Vui lòng nhập số lượng tình nguyện viên"],
      min: [5, "Số lượng tối thiểu là 5 người"],
      max: [1000, "Số lượng tối đa là 1000 người"],
    },
    registered: {
      type: Number,
      default: 0,
      min: 0,
    },
    hours: {
      type: Number,
      required: [true, "Vui lòng nhập số giờ hoạt động"],
      min: [1, "Số giờ tối thiểu là 1"],
      max: [100, "Số giờ tối đa là 100"],
    },
    category: {
      type: String,
      required: [true, "Vui lòng chọn danh mục"],
      enum: [
        "environment",
        "education",
        "youth",
        "elderly",
        "healthcare",
        "other",
      ],
    },
    status: {
      type: String,
      enum: ["upcoming", "ongoing", "completed", "cancelled"],
      default: "upcoming",
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    benefits: [
      {
        type: String,
        trim: true,
      },
    ],
    image: {
      type: String,
      // Default image sẽ được set theo category trong controller
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    slug: {
      type: String,
      unique: true,  // Đảm bảo không trùng (MongoDB tạo index unique)
      lowercase: true,
    },
    participants: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        registeredAt: {
          type: Date,
          default: Date.now,
        },
        status: {
          type: String,
          enum: ["pending", "approved", "rejected"],
          default: "pending",
        },
        reviewedAt: {
          type: Date,
        },
        reviewedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        checkedIn: {
          type: Boolean,
          default: false,
        },
        checkInTime: {
          type: Date,
        },
        completed: {
          type: Boolean,
          default: false,
        },
        completedAt: {
          type: Date,
        },
      },
    ],
    reminderSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index để tăng performance
eventSchema.index({ category: 1, status: 1 });
eventSchema.index({ date: 1 });
eventSchema.index({ createdBy: 1 });

// Virtual để check xem event đã đầy chưa
eventSchema.virtual("isFull").get(function () {
  return this.registered >= this.maxParticipants;
});

// Đảm bảo virtuals được include khi convert to JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
