const User = require("../models/User");
const Event = require("../models/Event");

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const eventsCreated = await Event.countDocuments({
          creator: user._id,
        });
        const eventsJoined = await Event.countDocuments({
          "participants.user": user._id,
        });

        return {
          ...user.toObject(),
          stats: {
            eventsCreated,
            eventsJoined,
          },
        };
      })
    );

    res.json({
      success: true,
      count: usersWithStats.length,
      data: usersWithStats,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy danh sách người dùng",
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Get user statistics
    const eventsCreated = await Event.find({ creator: user._id })
      .select("title date status")
      .sort({ date: -1 });

    const eventsJoined = await Event.find({ "participants.user": user._id })
      .select("title date status participants")
      .sort({ date: -1 });

    res.json({
      success: true,
      data: {
        user,
        stats: {
          eventsCreated,
          eventsJoined,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thông tin người dùng",
    });
  }
};

// @desc    Lock user account (Admin only)
// @route   PUT /api/users/:id/lock
// @access  Private/Admin
exports.lockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Prevent locking admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Không thể khóa tài khoản Admin",
      });
    }

    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: "Đã khóa tài khoản người dùng",
      data: user,
    });
  } catch (error) {
    console.error("Error locking user:", error);
    res.status(500).json({
      success: false,
      message: "Không thể khóa tài khoản",
    });
  }
};

// @desc    Unlock user account (Admin only)
// @route   PUT /api/users/:id/unlock
// @access  Private/Admin
exports.unlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    user.isActive = true;
    await user.save();

    res.json({
      success: true,
      message: "Đã mở khóa tài khoản người dùng",
      data: user,
    });
  } catch (error) {
    console.error("Error unlocking user:", error);
    res.status(500).json({
      success: false,
      message: "Không thể mở khóa tài khoản",
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["volunteer", "event_manager", "admin"].includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Vai trò không hợp lệ",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: "Đã cập nhật vai trò người dùng",
      data: user,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    res.status(500).json({
      success: false,
      message: "Không thể cập nhật vai trò",
    });
  }
};

// @desc    Delete user (Admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy người dùng",
      });
    }

    // Prevent deleting admin accounts
    if (user.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Không thể xóa tài khoản Admin",
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: "Đã xóa người dùng",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa người dùng",
    });
  }
};

// @desc    Export users data (Admin only)
// @route   GET /api/users/export
// @access  Private/Admin
exports.exportUsers = async (req, res) => {
  try {
    const { format = "json" } = req.query;

    const users = await User.find().select("-password").sort({ createdAt: -1 });

    const usersData = await Promise.all(
      users.map(async (user) => {
        const eventsCreated = await Event.countDocuments({
          createdBy: user._id,
        });
        const eventsJoined = await Event.countDocuments({
          "participants.user": user._id,
        });

        return {
          id: user._id || "",
          username: user.username || "",
          fullName: user.fullName || "",
          email: user.email || "",
          role: user.role || "",
          isActive: user.isActive !== undefined ? user.isActive : true,
          eventsCreated: eventsCreated || 0,
          eventsJoined: eventsJoined || 0,
          createdAt: user.createdAt
            ? new Date(user.createdAt).toISOString()
            : "",
          lastLogin: user.lastLogin
            ? new Date(user.lastLogin).toISOString()
            : "",
        };
      })
    );

    if (format === "csv") {
      // Generate CSV
      const csv = [
        [
          "ID",
          "Username",
          "Full Name",
          "Email",
          "Role",
          "Active",
          "Events Created",
          "Events Joined",
          "Created At",
          "Last Login",
        ].join(","),
        ...usersData.map((user) =>
          [
            user.id,
            `"${(user.username || "").replace(/"/g, '""')}"`,
            `"${(user.fullName || "").replace(/"/g, '""')}"`,
            `"${(user.email || "").replace(/"/g, '""')}"`,
            user.role,
            user.isActive,
            user.eventsCreated,
            user.eventsJoined,
            user.createdAt,
            user.lastLogin || "",
          ].join(",")
        ),
      ].join("\n");

      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=users_${Date.now()}.csv`
      );
      res.send(csv);
    } else {
      // Return JSON
      res.json({
        success: true,
        count: usersData.length,
        data: usersData,
        exportedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Error exporting users:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Không thể xuất dữ liệu người dùng",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const lockedUsers = await User.countDocuments({ isActive: false });

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: "$role",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get new users in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsers = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        lockedUsers,
        newUsers,
        usersByRole: usersByRole.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
      },
    });
  } catch (error) {
    console.error("Error getting user stats:", error);
    res.status(500).json({
      success: false,
      message: "Không thể lấy thống kê người dùng",
    });
  }
};
