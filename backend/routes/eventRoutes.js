const express = require("express");
const router = express.Router();
const {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  unregisterFromEvent,
  getMyRegisteredEvents,
  getMyCreatedEvents,
  getPendingRegistrations,
  reviewRegistration,
  getEventRegistrations,
  checkInParticipant,
  undoCheckIn,
  markAsCompleted,
  undoCompleted,
  exportEvents,
  getEvent
} = require("../controllers/eventController");
const { protect, authorize, optionalProtect } = require("../middleware/auth");
const { isValidSlug } = require('../utils/slugUtils');

// Public routes - không cần đăng nhập nhưng có thể có thông tin user
router.get("/", optionalProtect, getAllEvents);

// Protected routes - cần đăng nhập
// Routes cho tất cả user đã đăng nhập
router.get("/my/registered", protect, getMyRegisteredEvents);

// Export route (Admin only) - must be before other routes
router.get("/export", protect, authorize("admin"), exportEvents);

// Admin route to get ALL events (including other users' events)
router.get("/admin/all", protect, authorize("admin"), getAllEvents);

// Routes chỉ cho event_manager và admin
router.post("/", protect, authorize("event_manager", "admin"), createEvent);
router.get(
  "/my/created",
  protect,
  authorize("event_manager", "admin"),
  getMyCreatedEvents
);

// Routes check-in và hoàn thành (phải đặt trước /:id để tránh conflict)
router.put(
  "/:eventId/participants/:userId/checkin",
  protect,
  authorize("event_manager", "admin"),
  checkInParticipant
);
router.delete(
  "/:eventId/participants/:userId/checkin",
  protect,
  authorize("event_manager", "admin"),
  undoCheckIn
);
router.put(
  "/:eventId/participants/:userId/complete",
  protect,
  authorize("event_manager", "admin"),
  markAsCompleted
);
router.delete(
  "/:eventId/participants/:userId/complete",
  protect,
  authorize("event_manager", "admin"),
  undoCompleted
);

// Routes phê duyệt đăng ký (chỉ event_manager và admin)
router.get(
  "/:id/registrations",
  protect,
  authorize("event_manager", "admin"),
  getEventRegistrations
);
router.get(
  "/:id/registrations/pending",
  protect,
  authorize("event_manager", "admin"),
  getPendingRegistrations
);
router.put(
  "/:eventId/registrations/:userId/review",
  protect,
  authorize("event_manager", "admin"),
  reviewRegistration
);

router.get("/slug/:slug", optionalProtect, getEvent)
// Routes cho event cụ thể (phải đặt cuối cùng vì dùng /:id)
router.get("/:id", optionalProtect, getEvent);
router.post("/:id/register", protect, registerForEvent);
router.delete("/:id/unregister", protect, unregisterFromEvent);
router.put("/:id", protect, authorize("event_manager", "admin"), updateEvent);
router.delete(
  "/:id",
  protect,
  authorize("event_manager", "admin"),
  deleteEvent
);

module.exports = router;
