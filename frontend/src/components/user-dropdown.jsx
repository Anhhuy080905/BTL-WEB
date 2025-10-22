import React, { useState, useEffect, useRef } from "react";
import { Link, useHistory } from "react-router-dom";
import { authAPI } from "../services/api";
import "./user-dropdown.css";

const UserDropdown = () => {
  const history = useHistory();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [showLogoutNotification, setShowLogoutNotification] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Lấy thông tin user từ localStorage
    const currentUser = authAPI.getCurrentUser();
    setUser(currentUser);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Show notification
    console.log("=== LOGOUT: Setting notification to TRUE ===");
    setShowLogoutNotification(true);
    authAPI.logout();

    // Redirect to login after 1.5 seconds
    setTimeout(() => {
      console.log("=== LOGOUT: Redirecting to /login ===");
      history.push("/login");
    }, 1500);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  if (!user) {
    return null;
  }

  // Lấy chữ cái đầu của tên để làm avatar
  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Lấy màu avatar dựa trên role
  const getAvatarColor = (role) => {
    switch (role) {
      case "admin":
        return "#dc2626"; // Red
      case "event_manager":
        return "#2563eb"; // Blue
      default:
        return "#8b5cf6"; // Purple (volunteer)
    }
  };

  return (
    <>
      {/* Logout Notification - Outside container for proper positioning */}
      {showLogoutNotification && (
        <div
          className="logout-notification-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 99999,
          }}
        >
          <div className="logout-notification-content">
            <div className="logout-icon">
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
            <h3>Đăng xuất thành công!</h3>
            <p>Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        </div>
      )}

      <div className="user-dropdown-container" ref={dropdownRef}>
        <button className="user-avatar-button" onClick={toggleDropdown}>
          {user.avatar && user.avatar !== "https://via.placeholder.com/150" ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="user-avatar-img"
            />
          ) : (
            <div
              className="user-avatar-initials"
              style={{ backgroundColor: getAvatarColor(user.role) }}
            >
              {getInitials(user.username)}
            </div>
          )}
        </button>

        {isOpen && (
          <div className="user-dropdown-menu">
            {/* User Info */}
            <div className="user-dropdown-header">
              <div
                className="user-dropdown-avatar"
                style={{ backgroundColor: getAvatarColor(user.role) }}
              >
                {getInitials(user.username)}
              </div>
              <div className="user-dropdown-info">
                <div className="user-dropdown-name">{user.username}</div>
                <div className="user-dropdown-email">{user.email}</div>
              </div>
            </div>

            <div className="user-dropdown-divider"></div>

            {/* Menu Items */}
            <div className="user-dropdown-items">
              <Link
                to="/profile"
                className="user-dropdown-item"
                onClick={() => setIsOpen(false)}
              >
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <span>Thông tin cá nhân</span>
              </Link>

              <Link
                to="/notifications"
                className="user-dropdown-item"
                onClick={() => setIsOpen(false)}
              >
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
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span>Thông báo</span>
              </Link>

              {/* Hiển thị menu dựa trên role */}
              {user.role === "volunteer" && (
                <Link
                  to="/my-events"
                  className="user-dropdown-item"
                  onClick={() => setIsOpen(false)}
                >
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  <span>Hoạt động & Sự kiện</span>
                </Link>
              )}

              {user.role === "event_manager" && (
                <Link
                  to="/event-management"
                  className="user-dropdown-item"
                  onClick={() => setIsOpen(false)}
                >
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
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <path d="M8 10v11M16 10v11" />
                  </svg>
                  <span>Quản lý sự kiện</span>
                </Link>
              )}

              {user.role === "admin" && (
                <>
                  <Link
                    to="/my-events"
                    className="user-dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
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
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Hoạt động & Sự kiện</span>
                  </Link>
                  <Link
                    to="/admin"
                    className="user-dropdown-item"
                    onClick={() => setIsOpen(false)}
                  >
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
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.25M15.54 15.54l4.24 4.25M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                    </svg>
                    <span>Quản trị hệ thống</span>
                  </Link>
                </>
              )}
            </div>

            <div className="user-dropdown-divider"></div>

            {/* Logout */}
            <button
              className="user-dropdown-item user-dropdown-logout"
              onClick={handleLogout}
            >
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
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Đăng xuất</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDropdown;
