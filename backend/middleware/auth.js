const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes - Yêu cầu đăng nhập
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Kiểm tra token có tồn tại không
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập để truy cập",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user từ token
      req.user = await User.findById(decoded.id);

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: "User không tồn tại",
        });
      }

      if (!req.user.isActive) {
        return res.status(401).json({
          success: false,
          message: "Tài khoản đã bị khóa",
        });
      }

      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi xác thực",
      error: error.message,
    });
  }
};

// Authorize roles - Kiểm tra quyền
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} không có quyền truy cập`,
      });
    }
    next();
  };
};

// Optional protect - Lấy user nếu có token nhưng không bắt buộc
exports.optionalProtect = async (req, res, next) => {
  try {
    let token;

    // Lấy token từ header Authorization
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // Nếu có token, verify và lấy user
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (user && user.isActive) {
          req.user = user;
        }
      } catch (error) {
        // Token không hợp lệ, bỏ qua và tiếp tục
      }
    }

    next();
  } catch (error) {
    // Lỗi bất ngờ, bỏ qua và tiếp tục
    console.error("Error in optionalProtect:", error);
    next();
  }
};
