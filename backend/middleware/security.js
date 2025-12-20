const rateLimit = require("express-rate-limit");

// Rate limiter cho đăng nhập - 5 lần trong 15 phút
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // 5 requests
  message: {
    success: false,
    message: "Quá nhiều lần đăng nhập thất bại. Vui lòng thử lại sau 15 phút.",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip successful requests
  skipSuccessfulRequests: true,
});

// Rate limiter cho đăng ký - 3 lần trong 1 giờ
const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 giờ
  max: 3, // 3 requests
  message: {
    success: false,
    message: "Quá nhiều lần đăng ký. Vui lòng thử lại sau 1 giờ.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter cho API chung - 300 requests trong 15 phút
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 300, // 300 requests
  message: {
    success: false,
    message: "Quá nhiều requests. Vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter nghiêm ngặt hơn cho các endpoint nhạy cảm
const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 10, // 10 requests
  message: {
    success: false,
    message: "Quá nhiều requests đến endpoint này. Vui lòng thử lại sau.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  loginLimiter,
  registerLimiter,
  apiLimiter,
  strictLimiter,
};
