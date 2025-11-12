import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import Notification from "../components/Notification";
import { adminService } from "../services/adminService";
import { eventsService } from "../services/eventsService";
import { authAPI } from "../services/api";
import "./admin-dashboard.css";

const AdminDashboard = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // overview, users, events
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    message: "",
    onConfirm: null,
  });

  const showConfirm = (message, onConfirm) => {
    setConfirmDialog({ show: true, message, onConfirm });
  };

  const handleConfirm = () => {
    if (confirmDialog.onConfirm) {
      confirmDialog.onConfirm();
    }
    setConfirmDialog({ show: false, message: "", onConfirm: null });
  };

  const handleCancel = () => {
    setConfirmDialog({ show: false, message: "", onConfirm: null });
  };

  useEffect(() => {
    checkAdminAccess();
    fetchData();
  }, []);

  const checkAdminAccess = () => {
    const user = authAPI.getUserData();
    if (user?.role !== "admin") {
      setNotification({
        type: "error",
        title: "Lỗi!",
        message: "Bạn không có quyền truy cập trang này!",
      });
      setTimeout(() => history.push("/"), 2000);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch statistics
      const statsData = await adminService.getUserStats();
      setStats(statsData.data);

      // Fetch users
      const usersData = await adminService.getAllUsers();
      setUsers(usersData.data);

      // Fetch events
      const eventsData = await eventsService.getAllEvents();
      setEvents(eventsData.data || eventsData);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        setNotification({
          type: "error",
          title: "Lỗi!",
          message: "Phiên đăng nhập hết hạn hoặc không có quyền truy cập!",
        });
        setTimeout(() => history.push("/login"), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLockUser = async (userId) => {
    showConfirm("Bạn có chắc muốn khóa tài khoản này?", async () => {
      try {
        await adminService.lockUser(userId);

        // Cập nhật state users thay vì reload - sử dụng isActive
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isActive: false } : user
          )
        );

        setNotification({
          type: "success",
          title: "Thành công!",
          message: "Đã khóa tài khoản thành công!",
        });
      } catch (error) {
        setNotification({
          type: "error",
          title: "Lỗi!",
          message: error.response?.data?.message || "Không thể khóa tài khoản",
        });
      }
    });
  };

  const handleUnlockUser = async (userId) => {
    showConfirm("Bạn có chắc muốn mở khóa tài khoản này?", async () => {
      try {
        await adminService.unlockUser(userId);

        // Cập nhật state users thay vì reload - sử dụng isActive
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === userId ? { ...user, isActive: true } : user
          )
        );

        setNotification({
          type: "success",
          title: "Thành công!",
          message: "Đã mở khóa tài khoản thành công!",
        });
      } catch (error) {
        setNotification({
          type: "error",
          title: "Lỗi!",
          message:
            error.response?.data?.message || "Không thể mở khóa tài khoản",
        });
      }
    });
  };

  const handleResetPassword = async (userId) => {
    showConfirm(
      "Bạn có chắc muốn reset mật khẩu tài khoản này về 000000?",
      async () => {
        try {
          await adminService.resetUserPassword(userId);

          setNotification({
            type: "success",
            title: "Thành công!",
            message: "Đã reset mật khẩu về 000000!",
          });
        } catch (error) {
          setNotification({
            type: "error",
            title: "Lỗi!",
            message:
              error.response?.data?.message || "Không thể reset mật khẩu",
          });
        }
      }
    );
  };

  const handleDeleteUser = async (userId) => {
    showConfirm(
      "Bạn có chắc muốn XÓA tài khoản này? Hành động này không thể hoàn tác!",
      async () => {
        try {
          await adminService.deleteUser(userId);

          // Xóa user khỏi state thay vì reload
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user._id !== userId)
          );

          // Cập nhật stats
          setStats((prevStats) => ({
            ...prevStats,
            totalUsers: (prevStats.totalUsers || 0) - 1,
          }));

          setNotification({
            type: "success",
            title: "Thành công!",
            message: "Đã xóa tài khoản thành công!",
          });
        } catch (error) {
          setNotification({
            type: "error",
            title: "Lỗi!",
            message: error.response?.data?.message || "Không thể xóa tài khoản",
          });
        }
      }
    );
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);

      // Cập nhật role trong state thay vì reload
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, role: newRole } : user
        )
      );

      setNotification({
        type: "success",
        title: "Thành công!",
        message: "Đã cập nhật vai trò thành công!",
      });
      setShowUserModal(false);
    } catch (error) {
      setNotification({
        type: "error",
        title: "Lỗi!",
        message: error.response?.data?.message || "Không thể cập nhật vai trò",
      });
    }
  };

  const handleExportUsers = async (format) => {
    try {
      const result = await adminService.exportUsers(format);
      if (format === "csv") {
        setNotification({
          type: "success",
          title: "Thành công!",
          message: "Đã tải xuống file CSV!",
        });
      } else if (format === "json") {
        // Download JSON file
        const blob = new Blob([JSON.stringify(result, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `users_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setNotification({
          type: "success",
          title: "Thành công!",
          message: "Đã tải xuống file JSON!",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        title: "Lỗi!",
        message: "Không thể xuất dữ liệu: " + error.message,
      });
    }
  };

  const handleExportEvents = async (format) => {
    try {
      const result = await adminService.exportEvents(format);
      if (format === "csv") {
        setNotification({
          type: "success",
          title: "Thành công!",
          message: "Đã tải xuống file CSV!",
        });
      } else if (format === "json") {
        // Download JSON file
        const blob = new Blob([JSON.stringify(result, null, 2)], {
          type: "application/json",
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `events_${Date.now()}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        setNotification({
          type: "success",
          title: "Thành công!",
          message: "Đã tải xuống file JSON!",
        });
      }
    } catch (error) {
      setNotification({
        type: "error",
        title: "Lỗi!",
        message: "Không thể xuất dữ liệu: " + error.message,
      });
    }
  };

  const handleDeleteEvent = async (eventId) => {
    showConfirm("Bạn có chắc muốn xóa sự kiện này?", async () => {
      try {
        await eventsService.deleteEvent(eventId);

        // Xóa event khỏi state thay vì reload
        setEvents((prevEvents) =>
          prevEvents.filter(
            (event) => event._id !== eventId && event.id !== eventId
          )
        );

        setNotification({
          type: "success",
          title: "Thành công!",
          message: "Đã xóa sự kiện thành công!",
        });
      } catch (error) {
        setNotification({
          type: "error",
          title: "Lỗi!",
          message: error.response?.data?.message || "Không thể xóa sự kiện",
        });
      }
    });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRoleBadgeClass = (role) => {
    const roleMap = {
      admin: "role-admin",
      event_manager: "role-manager",
      volunteer: "role-volunteer",
    };
    return roleMap[role] || "role-volunteer";
  };

  const getRoleName = (role) => {
    const roleNames = {
      admin: "Quản trị viên",
      event_manager: "Quản lý sự kiện",
      volunteer: "Tình nguyện viên",
    };
    return roleNames[role] || role;
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <Navigation />
        <div className="admin-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <Helmet>
        <title>Admin Dashboard - VolunteerHub</title>
      </Helmet>

      <Navigation />

      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <div className="modal-overlay" onClick={handleCancel}>
          <div
            className="modal-content confirm-dialog"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="confirm-title">Xác nhận</h3>
            <p className="confirm-message">{confirmDialog.message}</p>
            <div className="confirm-actions">
              <button className="btn btn-secondary" onClick={handleCancel}>
                Hủy
              </button>
              <button className="btn btn-primary" onClick={handleConfirm}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="admin-dashboard-wrapper">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-content">
            <h1>🎛️ Bảng Điều Khiển Admin</h1>
            <p>Quản lý người dùng, sự kiện và hệ thống</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`admin-tab ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
          >
            📊 Tổng quan
          </button>
          <button
            className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Người dùng ({users.length})
          </button>
          <button
            className={`admin-tab ${activeTab === "events" ? "active" : ""}`}
            onClick={() => setActiveTab("events")}
          >
            📅 Sự kiện ({events.length})
          </button>
        </div>

        {/* Content */}
        <div className="admin-content">
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <div className="overview-section">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon">👥</div>
                  <div className="stat-info">
                    <h3>{stats.totalUsers || 0}</h3>
                    <p>Tổng người dùng</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <h3>{stats.activeUsers || 0}</h3>
                    <p>Tài khoản hoạt động</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🔒</div>
                  <div className="stat-info">
                    <h3>{stats.lockedUsers || 0}</h3>
                    <p>Tài khoản bị khóa</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <h3>{events.length}</h3>
                    <p>Tổng sự kiện</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">🆕</div>
                  <div className="stat-info">
                    <h3>{stats.newUsers || 0}</h3>
                    <p>Người dùng mới (30 ngày)</p>
                  </div>
                </div>
                <div className="stat-card">
                  <div className="stat-icon">👨‍💼</div>
                  <div className="stat-info">
                    <h3>{stats.usersByRole?.event_manager || 0}</h3>
                    <p>Quản lý sự kiện</p>
                  </div>
                </div>
              </div>

              <div className="export-section">
                <h2>📤 Xuất Dữ Liệu</h2>
                <div className="export-buttons">
                  <button
                    className="btn btn-export"
                    onClick={() => handleExportUsers("csv")}
                  >
                    📥 Xuất Người Dùng (CSV)
                  </button>
                  <button
                    className="btn btn-export"
                    onClick={() => handleExportEvents("csv")}
                  >
                    📥 Xuất Sự Kiện (CSV)
                  </button>
                  <button
                    className="btn btn-export"
                    onClick={() => handleExportUsers("json")}
                  >
                    📥 Xuất Người Dùng (JSON)
                  </button>
                  <button
                    className="btn btn-export"
                    onClick={() => handleExportEvents("json")}
                  >
                    📥 Xuất Sự Kiện (JSON)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* USERS TAB */}
          {activeTab === "users" && (
            <div className="users-section">
              <div className="section-header">
                <input
                  type="text"
                  className="search-input"
                  placeholder="🔍 Tìm kiếm người dùng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-export-sm"
                  onClick={() => handleExportUsers("csv")}
                >
                  📥 Xuất CSV
                </button>
              </div>

              <div className="users-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Tên đăng nhập</th>
                      <th>Họ tên</th>
                      <th>Email</th>
                      <th>Vai trò</th>
                      <th>Trạng thái</th>
                      <th>Sự kiện tạo</th>
                      <th>Sự kiện tham gia</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id}>
                        <td>{user.username}</td>
                        <td>{user.fullName}</td>
                        <td>{user.email}</td>
                        <td>
                          <span
                            className={`role-badge ${getRoleBadgeClass(
                              user.role
                            )}`}
                          >
                            {getRoleName(user.role)}
                          </span>
                        </td>
                        <td>
                          <span
                            className={`status-badge ${
                              user.isActive ? "active" : "locked"
                            }`}
                          >
                            {user.isActive ? "Hoạt động" : "Bị khóa"}
                          </span>
                        </td>
                        <td>{user.stats?.eventsCreated || 0}</td>
                        <td>{user.stats?.eventsJoined || 0}</td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn-action btn-edit"
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              title="Chỉnh sửa"
                            >
                              ✏️
                            </button>
                            {user.isActive ? (
                              <button
                                className="btn-action btn-lock"
                                onClick={() => handleLockUser(user._id)}
                                title="Khóa"
                              >
                                🔒
                              </button>
                            ) : (
                              <button
                                className="btn-action btn-unlock"
                                onClick={() => handleUnlockUser(user._id)}
                                title="Mở khóa"
                              >
                                🔓
                              </button>
                            )}
                            {user.role !== "admin" && (
                              <>
                                <button
                                  className="btn-action btn-reset-password"
                                  onClick={() => handleResetPassword(user._id)}
                                  title="Reset mật khẩu về 000000"
                                >
                                  🔑
                                </button>
                                <button
                                  className="btn-action btn-delete"
                                  onClick={() => handleDeleteUser(user._id)}
                                  title="Xóa"
                                >
                                  🗑️
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* EVENTS TAB */}
          {activeTab === "events" && (
            <div className="events-section">
              <div className="section-header">
                <input
                  type="text"
                  className="search-input"
                  placeholder="🔍 Tìm kiếm sự kiện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  className="btn btn-export-sm"
                  onClick={() => handleExportEvents("csv")}
                >
                  📥 Xuất CSV
                </button>
              </div>

              <div className="events-grid">
                {filteredEvents.map((event) => (
                  <div key={event._id} className="event-admin-card">
                    <div className="event-admin-header">
                      <h3>{event.title}</h3>
                      <span className={`status-badge status-${event.status}`}>
                        {event.status === "upcoming"
                          ? "Sắp diễn ra"
                          : event.status === "completed"
                          ? "Đã hoàn thành"
                          : event.status}
                      </span>
                    </div>
                    <div className="event-admin-body">
                      <p>📍 {event.location}</p>
                      <p>
                        📅 {new Date(event.date).toLocaleDateString("vi-VN")}
                      </p>
                      <p>
                        👥 {event.registered || event.participants?.length || 0}{" "}
                        / {event.maxParticipants} người
                      </p>
                      <p>
                        👨‍💼 Người tạo:{" "}
                        {event.creator?.fullName || event.creator?.username}
                      </p>
                    </div>
                    <div className="event-admin-actions">
                      <button
                        className="btn btn-danger-sm"
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        🗑️ Xóa
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Edit Modal */}
      {showUserModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowUserModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Chỉnh sửa người dùng</h2>
              <button
                className="modal-close-btn"
                onClick={() => setShowUserModal(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Tên đăng nhập:</label>
                <input type="text" value={selectedUser.username} disabled />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input type="text" value={selectedUser.email} disabled />
              </div>
              <div className="form-group">
                <label>Vai trò:</label>
                <select
                  value={selectedUser.role}
                  onChange={(e) =>
                    handleUpdateRole(selectedUser._id, e.target.value)
                  }
                >
                  <option value="volunteer">Tình nguyện viên</option>
                  <option value="event_manager">Quản lý sự kiện</option>
                  <option value="admin">Quản trị viên</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default AdminDashboard;
