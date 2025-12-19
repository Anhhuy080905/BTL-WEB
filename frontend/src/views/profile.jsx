import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import { adminService } from "../services/adminService";
import { profileUpdateSchema, changePasswordSchema } from "../validation/profileSchema";
import "./profile.css";

const Profile = () => {
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalHours: 0,
    achievements: 0,
    totalRegistrations: 0,
    completedEvents: 0,
    totalUsers: 0,
  });

  // Modal đổi mật khẩu
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    fetchUserProfile();
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      const allEvents = await eventsService.getAllEvents();
      const userResponse = await authAPI.getMe();
      const currentUser = userResponse.data.user;

      if (currentUser.role === "volunteer") {
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
          totalHours,
          achievements: completedCount,
        });
      } else if (currentUser.role === "event_manager") {
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
          totalRegistrations,
          completedEvents,
        });
      } else if (currentUser.role === "admin") {
        const totalRegistrations = allEvents.reduce(
          (sum, event) => sum + (event.registered || 0),
          0
        );

        let totalUsers = 0;
        try {
          const statsResponse = await adminService.getUserStats();
          totalUsers = statsResponse.data.totalUsers || 0;
        } catch (error) {
          console.error("Error fetching user stats:", error);
        }

        setStats({
          totalEvents: allEvents.length,
          totalUsers,
          totalRegistrations,
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

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: profileSubmitting, isDirty: profileDirty, isValid: profileValid },
    reset: resetProfile,
    trigger, // <-- thêm trigger
  } = useForm({
    resolver: yupResolver(profileUpdateSchema),
    mode: "onChange",
    defaultValues: {
      fullName: "",
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
    },
  });

  // Fill form khi user load xong
  useEffect(() => {
    if (user) {
      resetProfile({
        fullName: user.fullName || "",
        phone: user.phone || "",
        birthDate: user.birthDate ? user.birthDate.split("T")[0] : "",
        interests: {
          environment: user.interests?.environment || false,
          education: user.interests?.education || false,
          youth: user.interests?.youth || false,
          elderly: user.interests?.elderly || false,
          disabled: user.interests?.disabled || false,
          healthcare: user.interests?.healthcare || false,
        },
      });

      // Force validate ngay khi load data → nút submit sẽ bật nếu dữ liệu hợp lệ
      setTimeout(() => trigger(), 100); // nhỏ delay để chắc reset xong
    }
  }, [user, resetProfile, trigger]);

  const onProfileSubmit = async (data) => {
    try {
      const response = await authAPI.updateProfile(data);
      if (response.success) {
        setUser(response.data.user);
        setSuccessMessage("Cập nhật thông tin thành công!");
        setEditMode(false);
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Update error:", error);
      alert(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  // ==================== CHANGE PASSWORD FORM ====================
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors, isSubmitting: passwordSubmitting, isDirty: passwordDirty, isValid: passwordValid },
    reset: resetPassword,
  } = useForm({
    resolver: yupResolver(changePasswordSchema),
    mode: "onChange",
  });

  const onPasswordSubmit = async (data) => {
    try {
      const response = await authAPI.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      if (response.success) {
        setSuccessMessage("Đổi mật khẩu thành công!");
        setShowPasswordModal(false);
        resetPassword();
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (error) {
      console.error("Change password error:", error);
      alert(error.response?.data?.message || "Đổi mật khẩu thất bại!");
    }
  };

  const handleClosePasswordModal = () => {
    setShowPasswordModal(false);
    resetPassword();
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
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="spinner"></div>
          <p>Đang tải thông tin...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="profile-container">
      <Helmet>
        <title>Thông Tin Cá Nhân - VolunteerHub</title>
        <meta property="og:title" content="Thông Tin Cá Nhân - VolunteerHub" />
      </Helmet>

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
                <span className="profile-role-badge">{getRoleName(user.role)}</span>
              </div>
            </div>

            {!editMode && (
              <div className="profile-header-actions">
                <button
                  className="btn btn-primary edit-profile-btn"
                  onClick={() => setEditMode(true)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  Chỉnh sửa
                </button>

                <button onClick={() => setShowPasswordModal(true)} className="btn-change-password">
                  Đổi mật khẩu
                </button>
              </div>
            )}
          </div>

          {successMessage && <div className="alert alert-success">{successMessage}</div>}

          {/* Profile Details */}
          <div className="profile-details">
            {!editMode ? (
              <>
                {/* VIEW MODE - giữ nguyên như cũ */}
                <div className="profile-section">
                  <h2 className="section-title">Thông tin cơ bản</h2>
                  <div className="info-grid">
                    <div className="info-item"><label>Tên đăng nhập</label><p>{user.username}</p></div>
                    <div className="info-item"><label>Họ và tên</label><p>{user.fullName || "Chưa cập nhật"}</p></div>
                    <div className="info-item"><label>Email</label><p>{user.email}</p></div>
                    <div className="info-item"><label>Số điện thoại</label><p>{user.phone || "Chưa cập nhật"}</p></div>
                    <div className="info-item"><label>Ngày sinh</label><p>{formatDate(user.dateOfBirth)}</p></div>
                    <div className="info-item"><label>Vai trò</label><p>{getRoleName(user.role)}</p></div>
                  </div>
                </div>

                <div className="profile-section">
                  <h2 className="section-title">Lĩnh vực quan tâm</h2>
                  <div className="interests-display">
                    {user.interests?.environment && <span className="interest-tag">Môi trường</span>}
                    {user.interests?.education && <span className="interest-tag">Giáo dục</span>}
                    {user.interests?.youth && <span className="interest-tag">Y tế</span>}
                    {user.interests?.elderly && <span className="interest-tag">Người cao tuổi</span>}
                    {user.interests?.disabled && <span className="interest-tag">Người khuyết tật</span>}
                    {user.interests?.healthcare && <span className="interest-tag">Trẻ em</span>}
                    {!Object.values(user.interests || {}).some(v => v) && <p className="text-muted">Chưa chọn lĩnh vực quan tâm</p>}
                  </div>
                </div>

                {/* Stats - giữ nguyên */}
                <div className="profile-section">
                  <h2 className="section-title">Thống kê hoạt động</h2>
                  <div className="stats-grid">
                    {/* ... giữ nguyên phần stats như cũ của bạn */}
                  </div>
                </div>
              </>
            ) : (
              /* EDIT MODE */
              <form onSubmit={handleProfileSubmit(onProfileSubmit)} className="profile-edit-form" noValidate>
                <div className="profile-section">
                  <h2 className="section-title">Chỉnh sửa thông tin</h2>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Họ và tên *</label>
                      <input {...registerProfile("fullName")} className={profileErrors.fullName ? "error" : ""} />
                      {profileErrors.fullName && <span className="error-message">{profileErrors.fullName.message}</span>}
                    </div>

                    <div className="form-group">
                      <label>Số điện thoại *</label>
                      <input {...registerProfile("phone")} className={profileErrors.phone ? "error" : ""} />
                      {profileErrors.phone && <span className="error-message">{profileErrors.phone.message}</span>}
                    </div>

                    <div className="form-group">
                      <label>Ngày sinh *</label>
                      <input type="date" {...registerProfile("dateOfBirth")} className={profileErrors.birthDate ? "error" : ""} max={new Date().toISOString().split("T")[0]}/>
                      {profileErrors.birthDate && <span className="error-message">{profileErrors.birthDate.message}</span>}
                    </div>
                  </div>
                </div>

                <div className="profile-section">
                  <h2 className="section-title">Lĩnh vực quan tâm</h2>
                  <div className="interests-edit">
                    {["environment", "education", "youth", "elderly", "disabled", "healthcare"].map((key) => (
                      <label key={key} className="interest-checkbox">
                        <input type="checkbox" {...registerProfile(`interests.${key}`)} />
                        <span>
                          {key === "environment" && "Môi trường"}
                          {key === "education" && "Giáo dục"}
                          {key === "youth" && "Y tế"}
                          {key === "elderly" && "Người cao tuổi"}
                          {key === "disabled" && "Người khuyết tật"}
                          {key === "healthcare" && "Trẻ em"}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => {
                      setEditMode(false);
                      resetProfile();
                    }}
                    disabled={profileSubmitting}
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={profileSubmitting}
                  >
                    {profileSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Modal Đổi Mật Khẩu */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={handleClosePasswordModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Đổi mật khẩu</h2>
            </div>

            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="password-form" noValidate>
              <div className="form-group">
                <label>Mật khẩu hiện tại *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    {...registerPassword("currentPassword")}
                    className={passwordErrors.currentPassword ? "error" : ""}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                    {showCurrentPassword ? "" : ""}
                  </button>
                </div>
                {passwordErrors.currentPassword && <span className="error-message">{passwordErrors.currentPassword.message}</span>}
              </div>

              <div className="form-group">
                <label>Mật khẩu mới *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    {...registerPassword("newPassword")}
                    className={passwordErrors.newPassword ? "error" : ""}
                    placeholder="Nhập mật khẩu mới"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowNewPassword(!showNewPassword)}>
                    {showNewPassword ? "" : ""}
                  </button>
                </div>
                {passwordErrors.newPassword && <span className="error-message">{passwordErrors.newPassword.message}</span>}
              </div>

              <div className="form-group">
                <label>Xác nhận mật khẩu mới *</label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...registerPassword("confirmNewPassword")}
                    className={passwordErrors.confirmNewPassword ? "error" : ""}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? "" : ""}
                  </button>
                </div>
                {passwordErrors.confirmNewPassword && <span className="error-message">{passwordErrors.confirmNewPassword.message}</span>}
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={handleClosePasswordModal}>
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={passwordSubmitting || !passwordValid || !passwordDirty}
                >
                  {passwordSubmitting ? "Đang đổi..." : "Đổi mật khẩu"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;