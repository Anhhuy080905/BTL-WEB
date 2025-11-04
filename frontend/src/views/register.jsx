import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import { authAPI } from "../services/api";
import "./register.css";

const Register = (props) => {
  const history = useHistory();
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    nationality: "👤 Tình nguyện viên",
    password: "",
    confirmPassword: "",
    birthDate: "",
    interests: {
      environment: false,
      education: false,
      youth: false,
      elderly: false,
      disabled: false,
      healthcare: false,
    },
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showInfoNotification, setShowInfoNotification] = useState(false);

  // Real-time validation khi user blur khỏi field
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          error = "Vui lòng nhập họ và tên";
        } else if (value.length < 3) {
          error = "Họ và tên phải có ít nhất 3 ký tự";
        } else if (value.length > 50) {
          error = "Họ và tên không được vượt quá 50 ký tự";
        }
        break;

      case "username":
        if (!value.trim()) {
          error = "Vui lòng nhập tên đăng nhập";
        } else if (value.length < 3) {
          error = "Tên đăng nhập phải có ít nhất 3 ký tự";
        } else if (value.length > 30) {
          error = "Tên đăng nhập không được vượt quá 30 ký tự";
        }
        break;

      case "email":
        if (!value) {
          error = "Vui lòng nhập email";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Email không hợp lệ";
        }
        break;

      case "phone":
        if (!value) {
          error = "Vui lòng nhập số điện thoại";
        } else if (!/^[0-9]{10,11}$/.test(value)) {
          error = "Số điện thoại không hợp lệ (10-11 số)";
        }
        break;

      case "password":
        if (!value) {
          error = "Vui lòng nhập mật khẩu";
        } else if (value.length < 6) {
          error = "Mật khẩu phải có ít nhất 6 ký tự";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Mật khẩu phải có ít nhất 1 chữ thường";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Mật khẩu phải có ít nhất 1 chữ hoa";
        } else if (!/(?=.*[0-9])/.test(value)) {
          error = "Mật khẩu phải có ít nhất 1 số";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Vui lòng xác nhận mật khẩu";
        } else if (value !== formData.password) {
          error = "Mật khẩu xác nhận không khớp";
        }
        break;

      case "birthDate":
        if (!value) {
          error = "Vui lòng chọn ngày sinh";
        } else {
          const age = new Date().getFullYear() - new Date(value).getFullYear();
          if (age < 13) {
            error = "Bạn phải từ 13 tuổi trở lên";
          }
        }
        break;

      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};

    // Full name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập tên đăng nhập";
    } else if (formData.fullName.length < 3) {
      newErrors.fullName = "Tên đăng nhập phải có ít nhất 3 ký tự";
    }

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập họ và tên";
    }

    // Email validation
    if (!formData.email) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone)) {
      newErrors.phone = "Số điện thoại không hợp lệ (10-11 số)";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // Birth date validation
    if (!formData.birthDate) {
      newErrors.birthDate = "Vui lòng chọn ngày sinh";
    }

    // Terms validation
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    if (!formData.agreePrivacy) {
      newErrors.agreePrivacy = "Bạn phải đồng ý với chính sách bảo mật";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Real-time validation khi đã touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({
      ...prev,
      [name]: true,
    }));

    const error = validateField(name, value);
    setErrors((prev) => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await authAPI.register(formData);

      if (response.success) {
        // Xóa token vì chưa đăng nhập
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        // Hiển thị notification success
        setShowSuccessNotification(true);

        // Chuyển trang sau 2 giây
        setTimeout(() => {
          history.push("/login");
        }, 2000);
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else if (error.response?.data?.errors) {
        setErrors({ general: error.response.data.errors.join(", ") });
      } else {
        setErrors({ general: "Đăng ký thất bại. Vui lòng thử lại!" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    setShowInfoNotification(true);

    // Tự động đóng sau 2 giây
    setTimeout(() => {
      setShowInfoNotification(false);
    }, 2000);
  };

  return (
    <div className="register-container">
      <Helmet>
        <title>Đăng Ký Tài Khoản - VolunteerHub</title>
        <meta property="og:title" content="Đăng Ký Tài Khoản - VolunteerHub" />
      </Helmet>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="register-success-notification">
          <div className="register-success-notification-content">
            <div className="register-success-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h3>Đăng ký thành công!</h3>
            <p>Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        </div>
      )}

      {/* Info Notification for Google Register */}
      {showInfoNotification && (
        <div className="register-info-notification">
          <div className="register-info-notification-content">
            <div className="register-info-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
            </div>
            <h3>Thông báo</h3>
            <p>Tính năng đăng ký với Google sẽ được cập nhật sớm!</p>
          </div>
        </div>
      )}

      <div className="register-wrapper">
        {/* Left Side - Form */}
        <div className="register-form-section">
          <Link to="/" className="back-button">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Về trang chủ
          </Link>

          <div className="register-form-container">
            <h1 className="register-title">Đăng Ký Tài Khoản</h1>
            <p className="register-subtitle">
              Tham gia cộng đồng tình nguyện VolunteerHub
            </p>

            {errors.general && (
              <div className="alert alert-error">{errors.general}</div>
            )}

            <form onSubmit={handleSubmit} className="register-form">
              {/* Tên đăng nhập */}
              <div className="form-group">
                <label htmlFor="username" className="form-label">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`form-input ${errors.username ? "error" : ""}`}
                  placeholder="Nhập tên đăng nhập (3-30 ký tự)"
                  value={formData.username}
                  onChange={handleInputChange}
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              {/* Họ và tên */}
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  Họ và tên
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className={`form-input ${errors.fullName ? "error" : ""}`}
                  placeholder="Nhập họ và tên đầy đủ"
                  value={formData.fullName}
                  onChange={handleInputChange}
                />
                {errors.fullName && (
                  <span className="error-message">{errors.fullName}</span>
                )}
              </div>

              {/* Email */}
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`form-input ${errors.email ? "error" : ""}`}
                  placeholder="Nhập địa chỉ email của bạn"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && (
                  <span className="error-message">{errors.email}</span>
                )}
              </div>

              {/* Số điện thoại */}
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Số điện thoại (tùy chọn)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className={`form-input ${errors.phone ? "error" : ""}`}
                  placeholder="Nhập số điện thoại (10-11 số)"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && (
                  <span className="error-message">{errors.phone}</span>
                )}
              </div>

              {/* Vai trò */}
              <div className="form-group">
                <label htmlFor="nationality" className="form-label">
                  Vai trò
                </label>
                <div className="select-wrapper">
                  <select
                    id="nationality"
                    name="nationality"
                    className="form-input form-select"
                    value={formData.nationality}
                    onChange={handleInputChange}
                  >
                    <option value="👤 Tình nguyện viên">
                      👤 Tình nguyện viên
                    </option>
                    <option value="📋 Quản lý sự kiện">
                      📋 Quản lý sự kiện
                    </option>
                    <option value="⚙️ Admin">⚙️ Admin</option>
                  </select>
                </div>
                <p className="form-hint">
                  Chọn vai trò của bạn để hợp với mục đích sử dụng của bạn
                </p>
              </div>

              {/* Mật khẩu */}
              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Mật khẩu
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="Tạo mật khẩu"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              {/* Xác nhận mật khẩu */}
              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  Xác nhận lại mật khẩu
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    className={`form-input ${
                      errors.confirmPassword ? "error" : ""
                    }`}
                    placeholder="Nhập lại mật khẩu"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <span className="error-message">
                    {errors.confirmPassword}
                  </span>
                )}
              </div>

              {/* Ngày sinh */}
              <div className="form-group">
                <label htmlFor="birthDate" className="form-label">
                  Ngày sinh
                </label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  className={`form-input ${errors.birthDate ? "error" : ""}`}
                  placeholder="dd/mm/yyyy"
                  value={formData.birthDate}
                  onChange={handleInputChange}
                />
                {errors.birthDate && (
                  <span className="error-message">{errors.birthDate}</span>
                )}
              </div>

              {/* Lĩnh vực quan tâm */}
              <div className="form-group">
                <label className="form-label">Lĩnh vực quan tâm</label>
                <div className="interest-grid">
                  <label className="interest-checkbox">
                    <input
                      type="checkbox"
                      name="environment"
                      checked={formData.interests.environment}
                      onChange={handleInterestChange}
                    />
                    <span>Môi trường</span>
                  </label>
                  <label className="interest-checkbox">
                    <input
                      type="checkbox"
                      name="education"
                      checked={formData.interests.education}
                      onChange={handleInterestChange}
                    />
                    <span>Giáo dục</span>
                  </label>
                  <label className="interest-checkbox">
                    <input
                      type="checkbox"
                      name="youth"
                      checked={formData.interests.youth}
                      onChange={handleInterestChange}
                    />
                    <span>Y tế</span>
                  </label>
                  <label className="interest-checkbox">
                    <input
                      type="checkbox"
                      name="elderly"
                      checked={formData.interests.elderly}
                      onChange={handleInterestChange}
                    />
                    <span>Người cao tuổi</span>
                  </label>
                  <label className="interest-checkbox">
                    <input
                      type="checkbox"
                      name="disabled"
                      checked={formData.interests.disabled}
                      onChange={handleInterestChange}
                    />
                    <span>Người khuyết tật</span>
                  </label>
                  <label className="interest-checkbox">
                    <input
                      type="checkbox"
                      name="healthcare"
                      checked={formData.interests.healthcare}
                      onChange={handleInterestChange}
                    />
                    <span>Trẻ em</span>
                  </label>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleCheckboxChange}
                  />
                  <span>
                    Tôi đồng ý với{" "}
                    <Link to="/terms" className="link-primary">
                      Điều khoản sử dụng
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <span className="error-message">{errors.agreeTerms}</span>
                )}
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleCheckboxChange}
                  />
                  <span>
                    Tôi đồng ý với{" "}
                    <Link to="/privacy" className="link-primary">
                      Chính sách bảo mật
                    </Link>
                  </span>
                </label>
                {errors.agreePrivacy && (
                  <span className="error-message">{errors.agreePrivacy}</span>
                )}
              </div>

              <button
                type="submit"
                className="register-button"
                disabled={loading}
              >
                {loading ? "Đang đăng ký..." : "Đăng Ký"}
                {!loading && (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                )}
              </button>
            </form>

            <div className="divider">
              <span>hoặc</span>
            </div>

            <button
              onClick={handleGoogleRegister}
              className="google-register-button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Đăng ký với Google
            </button>

            <p className="login-link">
              Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="register-illustration-section">
          <div className="illustration-content">
            <div className="illustration-graphics">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="user-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="120"
                  height="120"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>
            <h2 className="illustration-title">
              Bắt đầu hành trình tình nguyện
            </h2>
            <p className="illustration-text">
              Đăng ký để tham gia các hoạt động tình nguyện và gặp gỡ những
              người cùng chí hướng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
