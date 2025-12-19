import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useHistory } from "react-router-dom";
import Notification from "../components/Notification";
import { authAPI } from "../services/api";
import "./login.css";
import { loginSchema } from '../validation/authSchema';

const Login = (props) => {
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showErrorNotification, setShowErrorNotification] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notification, setNotification] = useState(null);
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!email) {
      newErrors.email = "Vui lòng nhập tên đăng nhập";
    }
    // Không validate format vì có thể là username hoặc email

    // Password validation
    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Nếu đã blur qua field thì validate realtime
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const validateField = async (name, value) => {
    try {
      await loginSchema.validateAt(name, { [name]: value });
      setErrors((prev) => ({ ...prev, [name]: "" }));
    } catch (err) {
      setErrors((prev) => ({ ...prev, [name]: err.message }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validation cơ bản (có thể dùng Yup nếu muốn)
    if (!formData.identifier.trim()) {
      setErrors({ identifier: "Tên đăng nhập hoặc Email là bắt buộc" });
      setLoading(false);
      return;
    }
    if (!formData.password) {
      setErrors({ password: "Mật khẩu là bắt buộc" });
      setLoading(false);
      return;
    }

    try {
      // Xác định đây là email hay username
      const isEmail = formData.identifier.includes("@");

      let loginPayload;
      if (isEmail) {
        loginPayload = {
          email: formData.identifier.trim(),
          password: formData.password,
        };
      } else {
        loginPayload = {
          username: formData.identifier.trim(),
          password: formData.password,
        };
      }

      // Gọi API login (giả sử authAPI.login nhận cả email hoặc username)
      const response = await authAPI.login(loginPayload);

      if (response.success) {
        // Lưu token và redirect
        localStorage.setItem("token", response.data.token);
        // Có thể lưu thêm user info nếu cần
        history.push("/"); // hoặc dashboard phù hợp
      }
    } catch (error) {
      console.error("Login error:", error);

      let errorMsg = "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin!";

      if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }

      setErrors({ general: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth login
    setNotification({
      type: "info",
      title: "Thông báo",
      message: "Tính năng đăng nhập với Google sẽ được cập nhật sớm!",
    });
  };

  return (
    <div className="login-container">
      <Helmet>
        <title>Đăng Nhập - VolunteerHub</title>
        <meta property="og:title" content="Đăng Nhập - VolunteerHub" />
      </Helmet>

      {/* Success Notification */}
      {showSuccessNotification && (
        <div className="success-notification">
          <div className="success-notification-content">
            <div className="success-icon">
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
            <h3>Đăng nhập thành công!</h3>
            <p>Đang chuyển hướng đến trang chủ...</p>
          </div>
        </div>
      )}

      {/* Error Notification */}
      {showErrorNotification && (
        <div className="error-notification">
          <div className="error-notification-content">
            <div className="error-icon">
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
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            </div>
            <h3>Đăng nhập thất bại!</h3>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="login-wrapper">
        {/* Left Side - Form */}
        <div className="login-form-section">
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

            <div className="login-form-container">
              <h1 className="login-title">Đăng Nhập</h1>
              <p className="login-subtitle">Chào mừng bạn trở lại với VolunteerHub</p>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label>Tên đăng nhập hoặc Email *</label>
                  <input
                    type="text"
                    name="identifier"
                    value={formData.identifier}
                    onChange={handleInputChange}
                    className={`form-input ${errors.identifier ? "error" : ""}`}
                    placeholder="Nhập username hoặc email"
                    autoFocus
                  />
                  {errors.identifier && <span className="error-text">{errors.identifier}</span>}
                </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Mật khẩu <span className="required">*</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`form-input ${errors.password ? "error" : ""}`}
                    placeholder="Mật khẩu"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                {errors.password && <span className="error-message">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span>Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Quên mật khẩu?
                </Link>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng Nhập"}
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

            <button onClick={handleGoogleLogin} className="google-login-button">
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
              Đăng nhập với Google
            </button>

            <p className="signup-link">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </p>
          </div>
        </div>

        {/* Right Side - Illustration */}
        <div className="login-illustration-section">
          <div className="illustration-content">
            <div className="illustration-graphics">
              <div className="circle circle-1"></div>
              <div className="circle circle-2"></div>
              <div className="search-icon">
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
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
            </div>
            <h2 className="illustration-title">
              Tham gia cộng đồng tình nguyện
            </h2>
            <p className="illustration-text">
              Kết nối với những người cùng chí hướng và tạo ra những thay đổi
              tích cực trong cộng đồng
            </p>
          </div>
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
    </div>
  );
};

export default Login;