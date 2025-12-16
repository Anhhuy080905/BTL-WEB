const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const { protect } = require("../middleware/auth");
const {
  loginLimiter,
  registerLimiter,
  strictLimiter,
} = require("../middleware/security");

// Public routes với rate limiting
router.post("/register", registerLimiter, register);
router.post("/login", loginLimiter, login);

// Protected routes (yêu cầu đăng nhập)
router.get("/me", protect, getMe);
router.put("/update", protect, updateProfile);
router.put("/change-password", protect, strictLimiter, changePassword);

module.exports = router;
