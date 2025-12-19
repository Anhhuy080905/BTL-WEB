const Event = require("../models/Event");
const { createNotification } = require("./notificationController");
const {
  sendPushToUser,
  sendPushToEventParticipants,
  NotificationTemplates,
} = require("../utils/pushNotification");

// Helper: Lấy ảnh mặc định theo category
const getDefaultImageByCategory = (category) => {
  const defaultImages = {
    environment:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400",
    education:
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400",
    youth: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400",
    elderly:
      "https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=400",
    disabled:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400",
    healthcare:
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400",
    other: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400",
  };
  return defaultImages[category] || defaultImages.other;
};

// Lấy tất cả sự kiện
exports.getAllEvents = async (req, res) => {
  try {
    const { category, status, search, timeRange, startDate, endDate } =
      req.query;
    let query = {};

    // Filter theo category
    if (category && category !== "all") {
      query.category = category;
    }

    // Filter theo status
    if (status) {
      query.status = status;
    }

    // Filter theo thời gian
    if (timeRange || startDate || endDate) {
      const now = new Date();
      let dateQuery = {};

      if (timeRange) {
        switch (timeRange) {
          case "today":
            const startOfToday = new Date(now.setHours(0, 0, 0, 0));
            const endOfToday = new Date(now.setHours(23, 59, 59, 999));
            dateQuery = {
              date: {
                $gte: startOfToday,
                $lte: endOfToday,
              },
            };
            break;

          case "week":
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);
            endOfWeek.setHours(23, 59, 59, 999);
            dateQuery = {
              date: {
                $gte: startOfWeek,
                $lte: endOfWeek,
              },
            };
            break;

          case "month":
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const endOfMonth = new Date(
              now.getFullYear(),
              now.getMonth() + 1,
              0,
              23,
              59,
              59,
              999
            );
            dateQuery = {
              date: {
                $gte: startOfMonth,
                $lte: endOfMonth,
              },
            };
            break;

          case "quarter":
            const currentQuarter = Math.floor(now.getMonth() / 3);
            const startOfQuarter = new Date(
              now.getFullYear(),
              currentQuarter * 3,
              1
            );
            const endOfQuarter = new Date(
              now.getFullYear(),
              (currentQuarter + 1) * 3,
              0,
              23,
              59,
              59,
              999
            );
            dateQuery = {
              date: {
                $gte: startOfQuarter,
                $lte: endOfQuarter,
              },
            };
            break;

          case "upcoming":
            dateQuery = {
              date: { $gte: now },
            };
            break;

          case "past":
            dateQuery = {
              date: { $lt: now },
            };
            break;
        }
      }

      // Custom date range
      if (startDate && endDate) {
        dateQuery = {
          date: {
            $gte: new Date(startDate),
            $lte: new Date(endDate),
          },
        };
      } else if (startDate) {
        dateQuery = {
          date: { $gte: new Date(startDate) },
        };
      } else if (endDate) {
        dateQuery = {
          date: { $lte: new Date(endDate) },
        };
      }

      query = { ...query, ...dateQuery };
    }

    // Search theo title, location, hoặc description
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const events = await Event.find(query)
      .populate("createdBy", "username email")
      .sort({ createdAt: -1 });

    // Nếu user đã đăng nhập, thêm thông tin trạng thái đăng ký
    let eventsWithRegistrationStatus = events;
    if (req.user) {
      eventsWithRegistrationStatus = events.map((event) => {
        const eventObj = event.toObject();
        const userRegistration = event.participants.find(
          (p) => p.user.toString() === req.user._id.toString()
        );

        if (userRegistration) {
          eventObj.userRegistrationStatus = userRegistration.status;
        } else {
          eventObj.userRegistrationStatus = null;
        }

        return eventObj;
      });
    }

    res.json({
      success: true,
      count: events.length,
      data: eventsWithRegistrationStatus,
    });
  } catch (error) {
    console.error("Error in getAllEvents:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện",
      error: error.message,
    });
  }
};

// Lấy sự kiện theo ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("createdBy", "username email")
      .populate("participants.user", "username email");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Thêm thông tin trạng thái đăng ký của user nếu đã đăng nhập
    let eventData = event.toObject();
    if (req.user) {
      const userRegistration = event.participants.find(
        (p) => p.user._id.toString() === req.user._id.toString()
      );

      if (userRegistration) {
        eventData.userRegistrationStatus = userRegistration.status;
      } else {
        eventData.userRegistrationStatus = null;
      }
    }

    res.json({
      success: true,
      data: eventData,
    });
  } catch (error) {
    console.error("Error in getEventById:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy thông tin sự kiện",
      error: error.message,
    });
  }
};

// Tạo sự kiện mới (chỉ event_manager và admin)
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user._id,
      organization: req.user.username,
    };

    // Nếu không có image, set default image theo category
    if (!eventData.image || eventData.image.trim() === "") {
      eventData.image = getDefaultImageByCategory(eventData.category);
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: "Tạo sự kiện thành công",
      data: event,
    });
  } catch (error) {
    console.error("Error in createEvent:", error);

    // Validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi tạo sự kiện",
      error: error.message,
    });
  }
};

// Cập nhật sự kiện
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền: chỉ người tạo hoặc admin mới được sửa
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền sửa sự kiện này",
      });
    }

    // Không cho phép thay đổi số người đã đăng ký và participants qua API này
    delete req.body.registered;
    delete req.body.participants;
    delete req.body.createdBy;

    // Nếu không có image hoặc rỗng, set default image theo category
    if (!req.body.image || req.body.image.trim() === "") {
      req.body.image = getDefaultImageByCategory(
        req.body.category || event.category
      );
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    await sendPushToEventParticipants(
      event._id,
      NotificationTemplates.eventCompleted(event)
    );

    res.json({
      success: true,
      message: "Cập nhật sự kiện thành công",
      data: updatedEvent,
    });
  } catch (error) {
    console.error("Error in updateEvent:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Dữ liệu không hợp lệ",
        errors: messages,
      });
    }

    res.status(500).json({
      success: false,
      message: "Lỗi khi cập nhật sự kiện",
      error: error.message,
    });
  }
};

// Xóa sự kiện
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền: chỉ người tạo hoặc admin mới được xóa
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa sự kiện này",
      });
    }

    await Event.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Xóa sự kiện thành công",
    });
  } catch (error) {
    console.error("Error in deleteEvent:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xóa sự kiện",
      error: error.message,
    });
  }
};

// Đăng ký tham gia sự kiện
exports.registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check xem user có đủ thông tin không
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Vui lòng đăng nhập để đăng ký sự kiện",
      });
    }

    // Check xem user có phải là creator không
    if (
      event.createdBy &&
      event.createdBy.toString() === req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message: "Bạn không thể đăng ký sự kiện do mình tạo ra",
      });
    }

    // Check xem đã đăng ký chưa
    const alreadyRegistered = event.participants.some(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (alreadyRegistered) {
      return res.status(400).json({
        success: false,
        message: "Bạn đã đăng ký sự kiện này rồi",
      });
    }

    // Check xem event đã đầy chưa
    if (event.registered >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: "Sự kiện đã đủ số lượng người tham gia",
      });
    }

    // Check status - chỉ cho phép đăng ký sự kiện sắp diễn ra
    if (event.status !== "upcoming") {
      return res.status(400).json({
        success: false,
        message: "Sự kiện đã kết thúc hoặc đang diễn ra, không thể đăng ký",
      });
    }

    // Check ngày sự kiện - không cho đăng ký nếu đã qua
    const eventDate = new Date(event.date);
    const now = new Date();
    if (eventDate < now) {
      return res.status(400).json({
        success: false,
        message: "Sự kiện đã hoàn thành, không thể đăng ký",
      });
    }

    // Thêm người dùng vào danh sách participants
    event.participants.push({
      user: req.user._id,
      registeredAt: new Date(),
    });
    event.registered += 1;

    // Save với validateBeforeSave: false để bỏ qua validation date
    await event.save({ validateBeforeSave: false });

    // Tạo thông báo cho tình nguyện viên (không block nếu lỗi)
    try {
      await createNotification({
        userId: req.user._id,
        type: "registration_pending",
        title: "Đăng ký sự kiện thành công",
        message: `Bạn đã đăng ký sự kiện "${event.title}". Vui lòng chờ quản lý phê duyệt.`,
        eventId: event._id,
        link: `/my-events`,
      });
    } catch (notifError) {
      // Bỏ qua lỗi notification
    }

    // Tạo thông báo cho quản lý sự kiện (không block nếu lỗi)
    try {
      if (event.createdBy) {
        await createNotification({
          userId: event.createdBy,
          type: "registration_received",
          title: "Có người đăng ký sự kiện",
          message: `${
            req.user.username || req.user.fullName || "Một người dùng"
          } đã đăng ký tham gia sự kiện "${event.title}"`,
          eventId: event._id,
          relatedUserId: req.user._id,
          link: `/event-management`,
        });

        // Gửi Web Push Notification cho Manager
        await sendPushToUser(
          event.createdBy,
          "👤 Có đăng ký mới!",
          `${
            req.user.username || req.user.fullName || "Một người dùng"
          } đã đăng ký tham gia sự kiện "${event.title}"`,
          `/event-management`
        );
      }
    } catch (notifError) {
      // Bỏ qua lỗi notification
    }

    res.json({
      success: true,
      message: "Đăng ký tham gia sự kiện thành công",
      data: event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng ký sự kiện",
      error: error.message,
    });
  }
};

// Hủy đăng ký sự kiện
exports.unregisterFromEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check xem đã đăng ký chưa
    const participantIndex = event.participants.findIndex(
      (p) => p.user.toString() === req.user._id.toString()
    );

    if (participantIndex === -1) {
      return res.status(400).json({
        success: false,
        message: "Bạn chưa đăng ký sự kiện này",
      });
    }

    // Xóa khỏi danh sách participants
    event.participants.splice(participantIndex, 1);
    event.registered -= 1;

    await sendPushToUser(userId, {
      title: "Đã hủy đăng ký",
      body: "Bạn đã hủy đăng ký sự kiện này",
      url: `/event/${eventId}`,
    });

    await event.save();

    res.json({
      success: true,
      message: "Hủy đăng ký thành công",
      data: event,
    });
  } catch (error) {
    console.error("Error in unregisterFromEvent:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy đăng ký",
      error: error.message,
    });
  }
};

// Lấy các sự kiện đã đăng ký của user
exports.getMyRegisteredEvents = async (req, res) => {
  try {
    const events = await Event.find({
      "participants.user": req.user._id,
    })
      .populate("createdBy", "username email")
      .sort({ date: 1 });

    // Thêm registrationStatus cho mỗi event
    const eventsWithStatus = events.map((event) => {
      const eventObj = event.toObject();
      const userParticipant = event.participants.find(
        (p) => p.user.toString() === req.user._id.toString()
      );

      if (userParticipant) {
        eventObj.registrationStatus = userParticipant.status;
        eventObj.registeredAt = userParticipant.registeredAt;
        eventObj.checkedIn = userParticipant.checkedIn || false;
        eventObj.completed = userParticipant.completed || false;
      }

      return eventObj;
    });

    res.json({
      success: true,
      count: eventsWithStatus.length,
      data: eventsWithStatus,
    });
  } catch (error) {
    console.error("Error in getMyRegisteredEvents:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện đã đăng ký",
      error: error.message,
    });
  }
};

// Lấy các sự kiện do user tạo (cho event_manager)
exports.getMyCreatedEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user._id }).sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    console.error("Error in getMyCreatedEvents:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách sự kiện đã tạo",
      error: error.message,
    });
  }
};

// Lấy danh sách đăng ký chờ phê duyệt cho event của manager
exports.getPendingRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("participants.user", "username email phone")
      .populate("createdBy", "username");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền: chỉ người tạo hoặc admin mới xem được
    if (
      event.createdBy._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem danh sách đăng ký này",
      });
    }

    // Lọc ra những đăng ký đang chờ phê duyệt
    const pendingRegistrations = event.participants.filter(
      (p) => p.status === "pending"
    );

    res.json({
      success: true,
      count: pendingRegistrations.length,
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        maxParticipants: event.maxParticipants,
        registered: event.registered,
      },
      data: pendingRegistrations,
    });
  } catch (error) {
    console.error("Error in getPendingRegistrations:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đăng ký",
      error: error.message,
    });
  }
};

// Phê duyệt hoặc từ chối đăng ký
exports.reviewRegistration = async (req, res) => {
  try {
    const { eventId, userId } = req.params;
    const { status } = req.body; // 'approved' hoặc 'rejected'

    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Trạng thái không hợp lệ. Chỉ chấp nhận 'approved' hoặc 'rejected'",
      });
    }

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền: chỉ người tạo hoặc admin mới phê duyệt được
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền phê duyệt đăng ký này",
      });
    }

    // Tìm participant
    const participant = event.participants.find(
      (p) => p.user.toString() === userId
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy đăng ký này",
      });
    }

    if (participant.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: `Đăng ký này đã được ${
          participant.status === "approved" ? "phê duyệt" : "từ chối"
        } rồi`,
      });
    }

    // Cập nhật trạng thái
    participant.status = status;
    participant.reviewedAt = new Date();
    participant.reviewedBy = req.user._id;

    await event.save();

    // Tạo thông báo cho tình nguyện viên
    await createNotification({
      userId: userId,
      type:
        status === "approved"
          ? "registration_approved"
          : "registration_rejected",
      title:
        status === "approved" ? "Đăng ký được phê duyệt" : "Đăng ký bị từ chối",
      message:
        status === "approved"
          ? `Đăng ký của bạn cho sự kiện "${event.title}" đã được phê duyệt. Hãy tham gia đúng giờ!`
          : `Rất tiếc, đăng ký của bạn cho sự kiện "${event.title}" đã bị từ chối.`,
      eventId: event._id,
      link: `/my-events`,
    });

    // Gửi Web Push Notification
    await sendPushToUser(
      userId,
      status === "approved"
        ? "✅ Đăng ký được phê duyệt!"
        : "❌ Đăng ký bị từ chối",
      status === "approved"
        ? `Đăng ký của bạn cho sự kiện "${event.title}" đã được phê duyệt. Hãy tham gia đúng giờ!`
        : `Rất tiếc, đăng ký của bạn cho sự kiện "${event.title}" đã bị từ chối.`,
      `/my-events`
    );

    // Populate để trả về thông tin đầy đủ
    await event.populate("participants.user", "username email");

    res.json({
      success: true,
      message:
        status === "approved"
          ? "Đã phê duyệt đăng ký thành công"
          : "Đã từ chối đăng ký",
      data: participant,
    });
  } catch (error) {
    console.error("Error in reviewRegistration:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi xử lý phê duyệt",
      error: error.message,
    });
  }
};

// Lấy tất cả đăng ký của một event (cho manager)
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate("participants.user", "username email phone")
      .populate("participants.reviewedBy", "username")
      .populate("createdBy", "username");

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền
    if (
      event.createdBy._id.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xem danh sách đăng ký này",
      });
    }

    // Phân loại theo trạng thái
    const pending = event.participants.filter((p) => p.status === "pending");
    const approved = event.participants.filter((p) => p.status === "approved");
    const rejected = event.participants.filter((p) => p.status === "rejected");

    // Thêm thống kê check-in và hoàn thành
    const checkedIn = event.participants.filter((p) => p.checkedIn);
    const completed = event.participants.filter((p) => p.completed);

    res.json({
      success: true,
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        location: event.location,
        hours: event.hours,
        maxParticipants: event.maxParticipants,
        registered: event.registered,
      },
      statistics: {
        total: event.participants.length,
        pending: pending.length,
        approved: approved.length,
        rejected: rejected.length,
        checkedIn: checkedIn.length,
        completed: completed.length,
      },
      data: {
        pending,
        approved,
        rejected,
        checkedIn,
        completed,
        all: event.participants,
      },
    });
  } catch (error) {
    console.error("Error in getEventRegistrations:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách đăng ký",
      error: error.message,
    });
  }
};

// Check-in cho participant
exports.checkInParticipant = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền check-in cho sự kiện này",
      });
    }

    // Tìm participant
    const participant = event.participants.find(
      (p) => p.user.toString() === userId
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người tham gia này",
      });
    }

    // Chỉ cho phép check-in nếu đã được phê duyệt
    if (participant.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Chỉ có thể check-in cho người đã được phê duyệt",
      });
    }

    if (participant.checkedIn) {
      return res.status(400).json({
        success: false,
        message: "Người này đã check-in rồi",
      });
    }

    // Check-in
    participant.checkedIn = true;
    participant.checkInTime = new Date();

    await event.save();

    // Tạo thông báo cho tình nguyện viên
    await createNotification({
      userId: userId,
      type: "checked_in",
      title: "Đã check-in thành công",
      message: `Bạn đã check-in thành công cho sự kiện "${event.title}". Chúc bạn có trải nghiệm tốt!`,
      eventId: event._id,
      link: `/my-events`,
    });

    await event.populate("participants.user", "username email");

    res.json({
      success: true,
      message: "Check-in thành công",
      data: participant,
    });
  } catch (error) {
    console.error("Error in checkInParticipant:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi check-in",
      error: error.message,
    });
  }
};

// Hủy check-in
exports.undoCheckIn = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền hủy check-in",
      });
    }

    const participant = event.participants.find(
      (p) => p.user.toString() === userId
    );

    if (!participant || !participant.checkedIn) {
      return res.status(400).json({
        success: false,
        message: "Người này chưa check-in",
      });
    }

    participant.checkedIn = false;
    participant.checkInTime = null;

    await event.save();

    res.json({
      success: true,
      message: "Đã hủy check-in",
    });
  } catch (error) {
    console.error("Error in undoCheckIn:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy check-in",
      error: error.message,
    });
  }
};

// Đánh dấu hoàn thành
exports.markAsCompleted = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền đánh dấu hoàn thành",
      });
    }

    const participant = event.participants.find(
      (p) => p.user.toString() === userId
    );

    if (!participant) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người tham gia này",
      });
    }

    // Phải check-in trước khi hoàn thành
    if (!participant.checkedIn) {
      return res.status(400).json({
        success: false,
        message: "Người này chưa check-in",
      });
    }

    if (participant.completed) {
      return res.status(400).json({
        success: false,
        message: "Người này đã hoàn thành rồi",
      });
    }

    // Đánh dấu hoàn thành
    participant.completed = true;
    participant.completedAt = new Date();

    await event.save();

    // Tạo thông báo cho tình nguyện viên
    await createNotification({
      userId: userId,
      type: "completed",
      title: "Hoàn thành sự kiện",
      message: `Chúc mừng! Bạn đã hoàn thành sự kiện "${event.title}". Cảm ơn sự đóng góp của bạn!`,
      eventId: event._id,
      link: `/my-events`,
    });

    // Gửi Web Push Notification
    await sendPushToUser(
      userId,
      "🎉 Hoàn thành sự kiện!",
      `Chúc mừng! Bạn đã hoàn thành sự kiện "${event.title}". Cảm ơn sự đóng góp của bạn!`,
      `/my-events`
    );

    await event.populate("participants.user", "username email");

    res.json({
      success: true,
      message: "Đã đánh dấu hoàn thành",
      data: participant,
    });
  } catch (error) {
    console.error("Error in markAsCompleted:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đánh dấu hoàn thành",
      error: error.message,
    });
  }
};

// Hủy hoàn thành
exports.undoCompleted = async (req, res) => {
  try {
    const { eventId, userId } = req.params;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy sự kiện",
      });
    }

    // Check quyền
    if (
      event.createdBy.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền hủy hoàn thành",
      });
    }

    const participant = event.participants.find(
      (p) => p.user.toString() === userId
    );

    if (!participant || !participant.completed) {
      return res.status(400).json({
        success: false,
        message: "Người này chưa hoàn thành",
      });
    }

    participant.completed = false;
    participant.completedAt = null;

    await event.save();

    res.json({
      success: true,
      message: "Đã hủy hoàn thành",
    });
  } catch (error) {
    console.error("Error in undoCompleted:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy hoàn thành",
      error: error.message,
    });
  }
};

// @desc    Export events data (Admin only)
// @route   GET /api/events/export
// @access  Private/Admin
exports.exportEvents = async (req, res) => {
  try {
    const { format = "json" } = req.query;

    const events = await Event.find()
      .populate("createdBy", "username fullName email")
      .sort({ createdAt: -1 })
      .lean();

    const eventsData = events.map((event) => ({
      id: event._id || "",
      title: event.title || "",
      description: event.description || "",
      location: event.location || "",
      date: event.date ? new Date(event.date).toISOString().split("T")[0] : "",
      endDate: event.endDate
        ? new Date(event.endDate).toISOString().split("T")[0]
        : "",
      time: event.time || "",
      category: event.category || "",
      status: event.status || "",
      organization: event.organization || "",
      hours: event.hours || 0,
      maxParticipants: event.maxParticipants || 0,
      registered: event.participants?.length || 0,
      creator:
        event.createdBy?.fullName || event.createdBy?.username || "Unknown",
      creatorEmail: event.createdBy?.email || "N/A",
      createdAt: event.createdAt ? new Date(event.createdAt).toISOString() : "",
    }));

    if (format === "csv") {
      // Generate CSV
      const csv = [
        [
          "ID",
          "Title",
          "Description",
          "Location",
          "Date",
          "End Date",
          "Time",
          "Category",
          "Status",
          "Organization",
          "Hours",
          "Max Participants",
          "Registered",
          "Creator",
          "Creator Email",
          "Created At",
        ].join(","),
        ...eventsData.map((event) =>
          [
            event.id,
            `"${(event.title || "").replace(/"/g, '""')}"`,
            `"${(event.description || "").replace(/"/g, '""')}"`,
            `"${(event.location || "").replace(/"/g, '""')}"`,
            event.date,
            event.endDate || "",
            event.time || "",
            event.category,
            event.status,
            `"${(event.organization || "").replace(/"/g, '""')}"`,
            event.hours,
            event.maxParticipants,
            event.registered,
            `"${(event.creator || "").replace(/"/g, '""')}"`,
            event.creatorEmail,
            event.createdAt,
          ].join(",")
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=events_${Date.now()}.csv`
      );
      res.send(csv);
    } else {
      // Return JSON
      res.json({
        success: true,
        count: eventsData.length,
        data: eventsData,
        exportedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error exporting events:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Không thể xuất dữ liệu sự kiện",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
