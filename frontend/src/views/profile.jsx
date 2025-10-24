import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import { adminService } from "../services/adminService";
import "./profile.css";

const Profile = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    phone: "",
    birthDate: "",
    interests: {
      environment: false,
      education: false,
      youth: false,
      elderly: false,
      disabled: false,
      healthcare: false,
    },
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalHours: 0,
    achievements: 0,
    totalRegistrations: 0,
    completedEvents: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      // Lấy tất cả events
      const allEvents = await eventsService.getAllEvents();

      // Lấy thông tin user hiện tại
      const userResponse = await authAPI.getMe();
      const currentUser = userResponse.data.user;

      if (currentUser.role === "volunteer") {
        // Tính thống kê cho tình nguyện viên
        const myEvents = allEvents.filter((event) =>
          event.participants?.some(
            (p) => p.user?._id === currentUser._id || p.user === currentUser._id
          )
        );

        const totalHours = myEvents.reduce((sum, event) => {
          const participant = event.participants.find(
            (p) => p.user?._id === currentUser._id || p.user === currentUser._id
          );
          return participant?.completed ? sum + (event.hours || 0) : sum;
        }, 0);

        const completedCount = myEvents.filter((event) =>
          event.participants.some(
            (p) =>
              (p.user?._id === currentUser._id || p.user === currentUser._id) &&
              p.completed
          )
        ).length;

        setStats({
          totalEvents: myEvents.length,
          totalHours: totalHours,
          achievements: completedCount,
        });
      } else if (currentUser.role === "event_manager") {
        // Tính thống kê cho quản lý sự kiện
        const myCreatedEvents = allEvents.filter(
          (event) =>
            event.createdBy?._id === currentUser._id ||
            event.createdBy === currentUser._id
        );

        const totalRegistrations = myCreatedEvents.reduce(
          (sum, event) => sum + (event.registered || 0),
          0
        );

        const completedEvents = myCreatedEvents.filter(
          (event) => new Date(event.date) < new Date()
        ).length;

        setStats({
          totalEvents: myCreatedEvents.length,
          totalRegistrations: totalRegistrations,
          completedEvents: completedEvents,
        });
      } else if (currentUser.role === "admin") {
        // Tính thống kê cho admin (tổng quan hệ thống)
        const totalRegistrations = allEvents.reduce(
          (sum, event) => sum + (event.registered || 0),
          0
        );

        // Lấy số lượng users từ API
        let totalUsers = 0;
        try {
          const statsResponse = await adminService.getUserStats();
          totalUsers = statsResponse.data.totalUsers || 0;
        } catch (error) {
          console.error("Error fetching user stats:", error);
          totalUsers = 0;
        }

        setStats({
          totalEvents: allEvents.length,
          totalUsers: totalUsers,
          totalRegistrations: totalRegistrations,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.success) {
        setUser(response.data.user);
        setFormData({
          username: response.data.user.username || "",
          phone: response.data.user.phone || "",
          birthDate: response.data.user.birthDate
            ? response.data.user.birthDate.split("T")[0]
            : "",
          interests: response.data.user.interests || {},
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      if (error.response?.status === 401) {
        history.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInterestChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      interests: {
        ...prev.interests,
        [name]: checked,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      const response = await authAPI.updateProfile(formData);
      if (response.success) {
        setUser(response.data.user);
        setSuccessMessage("Cập nhật thông tin thành công!");
        setEditMode(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Update error:", error);
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Cập nhật thất bại. Vui lòng thử lại!" });
      }
    }
  };

  const getRoleName = (role) => {
    const roleMap = {
      volunteer: "Tình nguyện viên",
      event_manager: "Quản lý sự kiện",
      admin: "Quản trị viên",
    };
    return roleMap[role] || role;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Navigation />
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-container">
      <Helmet>
        <title>Thông Tin Cá Nhân - VolunteerHub</title>
        <meta property="og:title" content="Thông Tin Cá Nhân - VolunteerHub" />
      </Helmet>

      <Navigation />

      <div className="profile-wrapper">
        <div className="profile-content">
          {/* Header */}
          <div className="profile-header">
            <div className="profile-avatar-section">
              <div className="profile-avatar-large">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <span className="avatar-placeholder">
                    {user.username?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="profile-info">
                <h1 className="profile-name">{user.username}</h1>
                <p className="profile-email">{user.email}</p>
                <span className="profile-role-badge">
                  {getRoleName(user.role)}
                </span>
              </div>
            </div>
            {!editMode && (
              <button
                className="btn btn-primary edit-profile-btn"
                onClick={() => setEditMode(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Chỉnh sửa
              </button>
            )}
          </div>

          {successMessage && (
            <div className="alert alert-success">{successMessage}</div>
          )}

          {errors.general && (
            <div className="alert alert-error">{errors.general}</div>
          )}

          {/* Profile Details */}
          <div className="profile-details">
            {!editMode ? (
              <>
                {/* View Mode */}
                <div className="profile-section">
                  <h2 className="section-title">Thông tin cơ bản</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Tên đăng nhập</label>
                      <p>{user.fullName}</p>
                    </div>
                    <div className="info-item">
                      <label>Họ và tên</label>
                      <p>{user.username}</p>
                    </div>
                    <div className="info-item">
                      <label>Email</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Số điện thoại</label>
                      <p>{user.phone || "Chưa cập nhật"}</p>
                    </div>
                    <div className="info-item">
                      <label>Ngày sinh</label>
                      <p>{formatDate(user.birthDate)}</p>
                    </div>
                    <div className="info-item">
                      <label>Vai trò</label>
                      <p>{getRoleName(user.role)}</p>
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h2 className="section-title">Lĩnh vực quan tâm</h2>
                  <div className="interests-display">
                    {user.interests?.environment && (
                      <span className="interest-tag">🌱 Môi trường</span>
                    )}
                    {user.interests?.education && (
                      <span className="interest-tag">📚 Giáo dục</span>
                    )}
                    {user.interests?.youth && (
                      <span className="interest-tag">❤️ Y tế</span>
                    )}
                    {user.interests?.elderly && (
                      <span className="interest-tag">👴 Người cao tuổi</span>
                    )}
                    {user.interests?.disabled && (
                      <span className="interest-tag">♿ Người khuyết tật</span>
                    )}
                    {user.interests?.healthcare && (
                      <span className="interest-tag">👶 Trẻ em</span>
                    )}
                    {!Object.values(user.interests || {}).some((v) => v) && (
                      <p className="text-muted">Chưa chọn lĩnh vực quan tâm</p>
                    )}
                  </div>
                </div>

                <div className="profile-section">
                  <h2 className="section-title">Thống kê hoạt động</h2>
                  <div className="stats-grid">
                    {user.role === "volunteer" ? (
                      // Thống kê cho Tình nguyện viên
                      <>
                        <div className="stat-card stat-volunteer">
                          <div className="stat-icon">📅</div>
                          <div className="stat-info">
                            <h3>{stats.totalEvents}</h3>
                            <p>Sự kiện tham gia</p>
                          </div>
                        </div>
                        <div className="stat-card stat-volunteer">
                          <div className="stat-icon">⏱️</div>
                          <div className="stat-info">
                            <h3>{stats.totalHours}</h3>
                            <p>Giờ tình nguyện</p>
                          </div>
                        </div>
                        <div className="stat-card stat-volunteer">
                          <div className="stat-icon">🏆</div>
                          <div className="stat-info">
                            <h3>{stats.achievements}</h3>
                            <p>Chứng nhận đạt được</p>
                          </div>
                        </div>
                      </>
                    ) : user.role === "event_manager" ? (
                      // Thống kê cho Quản lý sự kiện
                      <>
                        <div className="stat-card stat-manager">
                          <div className="stat-icon">📋</div>
                          <div className="stat-info">
                            <h3>{stats.totalEvents}</h3>
                            <p>Sự kiện đã tạo</p>
                          </div>
                        </div>
                        <div className="stat-card stat-manager">
                          <div className="stat-icon">👥</div>
                          <div className="stat-info">
                            <h3>{stats.totalRegistrations}</h3>
                            <p>Tổng người đăng ký</p>
                          </div>
                        </div>
                        <div className="stat-card stat-manager">
                          <div className="stat-icon">✅</div>
                          <div className="stat-info">
                            <h3>{stats.completedEvents}</h3>
                            <p>Sự kiện hoàn thành</p>
                          </div>
                        </div>
                      </>
                    ) : (
                      // Thống kê cho Admin
                      <>
                        <div className="stat-card stat-admin">
                          <div className="stat-icon">👤</div>
                          <div className="stat-info">
                            <h3>{stats.totalUsers}</h3>
                            <p>Tổng người dùng</p>
                          </div>
                        </div>
                        <div className="stat-card stat-admin">
                          <div className="stat-icon">📅</div>
                          <div className="stat-info">
                            <h3>{stats.totalEvents}</h3>
                            <p>Tổng sự kiện</p>
                          </div>
                        </div>
                        <div className="stat-card stat-admin">
                          <div className="stat-icon">⚙️</div>
                          <div className="stat-info">
                            <h3>{stats.totalRegistrations}</h3>
                            <p>Tổng đăng ký</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Edit Mode */}
                <form onSubmit={handleSubmit} className="profile-edit-form">
                  <div className="profile-section">
                    <h2 className="section-title">Chỉnh sửa thông tin</h2>
                    <div className="form-grid">
                      <div className="form-group">
                        <label htmlFor="username" className="form-label">
                          Họ và tên
                        </label>
                        <input
                          type="text"
                          id="username"
                          name="username"
                          className="form-input"
                          value={formData.username}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="phone" className="form-label">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          className="form-input"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="birthDate" className="form-label">
                          Ngày sinh
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          className="form-input"
                          value={formData.birthDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="profile-section">
                    <h2 className="section-title">Lĩnh vực quan tâm</h2>
                    <div className="interests-edit">
                      <label className="interest-checkbox">
                        <input
                          type="checkbox"
                          name="environment"
                          checked={formData.interests.environment}
                          onChange={handleInterestChange}
                        />
                        <span>🌱 Môi trường</span>
                      </label>
                      <label className="interest-checkbox">
                        <input
                          type="checkbox"
                          name="education"
                          checked={formData.interests.education}
                          onChange={handleInterestChange}
                        />
                        <span>📚 Giáo dục</span>
                      </label>
                      <label className="interest-checkbox">
                        <input
                          type="checkbox"
                          name="youth"
                          checked={formData.interests.youth}
                          onChange={handleInterestChange}
                        />
                        <span>❤️ Y tế</span>
                      </label>
                      <label className="interest-checkbox">
                        <input
                          type="checkbox"
                          name="elderly"
                          checked={formData.interests.elderly}
                          onChange={handleInterestChange}
                        />
                        <span>👴 Người cao tuổi</span>
                      </label>
                      <label className="interest-checkbox">
                        <input
                          type="checkbox"
                          name="disabled"
                          checked={formData.interests.disabled}
                          onChange={handleInterestChange}
                        />
                        <span>♿ Người khuyết tật</span>
                      </label>
                      <label className="interest-checkbox">
                        <input
                          type="checkbox"
                          name="healthcare"
                          checked={formData.interests.healthcare}
                          onChange={handleInterestChange}
                        />
                        <span>👶 Trẻ em</span>
                      </label>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => {
                        setEditMode(false);
                        setErrors({});
                      }}
                    >
                      Hủy
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Profile;
