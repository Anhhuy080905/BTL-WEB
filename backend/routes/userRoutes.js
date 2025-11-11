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

// Lock/Unlock user
router.put("/:id/lock", lockUser);
router.put("/:id/unlock", unlockUser);

// Update role
router.put("/:id/role", updateUserRole);

// Reset password
router.put("/:id/reset-password", resetUserPassword);

// Delete user
router.delete("/:id", deleteUser);

module.exports = router;
