const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Vui lòng nhập họ và tên"],
      trim: true,
      minlength: [3, "Họ và tên phải có ít nhất 3 ký tự"],
      maxlength: [50, "Họ và tên không được vượt quá 50 ký tự"],
    },
    username: {
      type: String,
      required: [true, "Vui lòng nhập tên đăng nhập"],
      trim: true,
      unique: true,
      minlength: [3, "Tên đăng nhập phải có ít nhất 3 ký tự"],
      maxlength: [30, "Tên đăng nhập không được vượt quá 30 ký tự"],
    },
    email: {
      type: String,
      required: [true, "Vui lòng nhập email"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Email không hợp lệ"],
    },
    password: {
      type: String,
      required: [true, "Vui lòng nhập mật khẩu"],
      minlength: [6, "Mật khẩu phải có ít nhất 6 ký tự"],
      select: false, // Không trả về password khi query
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^[0-9]{10,11}$/.test(v);
        },
        message: "Số điện thoại không hợp lệ (10-11 số)",
      },
    },
    role: {
      type: String,
      enum: ["volunteer", "event_manager", "admin"],
      default: "volunteer",
    },
    nationality: {
      type: String,
      default: "👤 Tình nguyện viên",
    },
    birthDate: {
      type: Date,
    },
    interests: {
      environment: { type: Boolean, default: false },
      education: { type: Boolean, default: false },
      youth: { type: Boolean, default: false },
      elderly: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      healthcare: { type: Boolean, default: false },
    },
    avatar: {
      type: String,
      default: "https://via.placeholder.com/150",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
    },
  },
  {
    timestamps: true, // Tự động tạo createdAt và updatedAt
  }
);

// Hash password trước khi save
userSchema.pre("save", async function (next) {
  // Chỉ hash nếu password được modify
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method để so sánh password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method để ẩn sensitive data khi trả về
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
