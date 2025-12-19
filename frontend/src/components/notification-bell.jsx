import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import notificationService from "../services/notificationService";
import "./notification-bell.css";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    loadNotifications();

    // Poll for new notifications every 60 seconds (giảm từ 30s để tránh rate limit)
    const interval = setInterval(loadNotifications, 60000);

    // Lắng nghe message từ Service Worker khi có push notification mới
    const handleServiceWorkerMessage = (event) => {
      if (event.data && event.data.type === "NEW_NOTIFICATION") {
        console.log("🔔 Nhận được push notification, đang reload...");
        loadNotifications();
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener(
        "message",
        handleServiceWorkerMessage
      );
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      isMountedRef.current = false;
      document.removeEventListener("mousedown", handleClickOutside);
      clearInterval(interval);
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.removeEventListener(
          "message",
          handleServiceWorkerMessage
        );
      }
    };
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getAll();
      // Chỉ update state nếu component vẫn mounted
      if (isMountedRef.current) {
        // Chỉ lấy 5 thông báo mới nhất
        setNotifications(response.data.slice(0, 5));
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Error loading notifications:", error);
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      if (isMountedRef.current) {
        await loadNotifications();
      }
    } catch (error) {
      if (isMountedRef.current) {
        console.error("Error marking as read:", error);
      }
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getNotificationIcon = (type) => {
    const icons = {
      registration_received: "👤",
      registration_pending: "⏳",
      registration_approved: "✅",
      registration_rejected: "❌",
      checked_in: "✓",
      completed: "🎉",
      post_like: "❤️",
      post_comment: "💬",
    };
    return icons[type] || "📢";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ`;
    return `${Math.floor(diff / 86400)} ngày`;
  };

  const getNotificationLink = (notification) => {
    // If notification has postId, use new modal format
    if (notification.post) {
      return `/discussion-list?postId=${notification.post}`;
    }
    // Otherwise use the default link
    return notification.link || "/notifications";
  };

  return (
    <div className="notification-bell-container" ref={dropdownRef}>
      <button className="notification-bell-button" onClick={toggleDropdown}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
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
        {unreadCount > 0 && (
          <span className="notification-badge">{unreadCount}</span>
        )}
      </button>

      {isOpen && (
        <div className="notification-bell-dropdown">
          <div className="notification-bell-header">
            <h3>Thông báo</h3>
            {unreadCount > 0 && (
              <span className="unread-count">{unreadCount} mới</span>
            )}
          </div>

          <div className="notification-bell-list">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <span className="empty-icon">🔔</span>
                <p>Chưa có thông báo</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <Link
                  key={notification._id}
                  to={getNotificationLink(notification)}
                  className={`notification-bell-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  onClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification._id);
                    }
                    setIsOpen(false);
                  }}
                >
                  <div className="notification-bell-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-bell-content">
                    <div className="notification-bell-title">
                      {notification.title}
                      {!notification.read && (
                        <span className="unread-dot"></span>
                      )}
                    </div>
                    <div className="notification-bell-message">
                      {notification.message}
                    </div>
                    <div className="notification-bell-time">
                      {formatTime(notification.createdAt)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {notifications.length > 0 && (
            <Link
              to="/notifications"
              className="notification-bell-footer"
              onClick={() => setIsOpen(false)}
            >
              Xem tất cả thông báo
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
