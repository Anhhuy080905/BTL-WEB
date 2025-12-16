const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  lockUser,
  unlockUser,
  updateUserRole,
  resetUserPassword,
  deleteUser,
  exportUsers,
  getUserStats,
} = require("../controllers/userController");
const { protect, authorize } = require("../middleware/auth");
const { strictLimiter } = require("../middleware/security");

// All routes require admin role
router.use(protect, authorize("admin"));

// Statistics route (must be before /:id)
router.get("/stats", getUserStats);

// Export route (must be before /:id)
router.get("/export", exportUsers);

// User list
router.get("/", getAllUsers);

// User details
router.get("/:id", getUserById);

// Lock/Unlock user - với strict rate limiting
router.put("/:id/lock", strictLimiter, lockUser);
router.put("/:id/unlock", strictLimiter, unlockUser);

// Update role - với strict rate limiting
router.put("/:id/role", strictLimiter, updateUserRole);

// Reset password - với strict rate limiting
router.put("/:id/reset-password", strictLimiter, resetUserPassword);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
