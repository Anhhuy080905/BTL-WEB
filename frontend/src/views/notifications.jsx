import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useHistory } from "react-router-dom";
import notificationService from "../services/notificationService";
import "./notifications.css";

const Notifications = () => {
  const history = useHistory();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getAll();
      setNotifications(response.data);
      setUnreadCount(response.unreadCount);
    } catch (error) {
      console.error("Error loading notifications:", error);
      if (error.response?.status === 401) {
        history.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      await loadNotifications();
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead();
      await loadNotifications();
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa thông báo này?")) {
      try {
        await notificationService.delete(id);
        await loadNotifications();
      } catch (error) {
        console.error("Error deleting notification:", error);
      }
    }
  };

  const getNotificationIcon = (type) => {
    const icons = {
      registration_received: "👤",
      registration_pending: "⏳",
      registration_approved: "✅",
      registration_rejected: "❌",
      checked_in: "✓",
      completed: "🎉",
    };
    return icons[type] || "📢";
  };

  const getNotificationClass = (type) => {
    if (
      type === "registration_approved" ||
      type === "checked_in" ||
      type === "completed"
    ) {
      return "success";
    }
    if (type === "registration_rejected") {
      return "error";
    }
    if (type === "registration_pending" || type === "registration_received") {
      return "warning";
    }
    return "info";
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return "Vừa xong";
    if (diff < 3600) return `${Math.floor(diff / 60)} phút trước`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} giờ trước`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="notifications-container">
        <div className="notifications-loading">
          <div className="spinner"></div>
          <p>Đang tải thông báo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notifications-container">
      <Helmet>
        <title>Thông Báo - VolunteerHub</title>
      </Helmet>

      <div className="notifications-wrapper">
        <div className="notifications-header">
          <div className="header-content">
            <h1>Thông Báo</h1>
            <p className="subtitle">
              {unreadCount > 0
                ? `Bạn có ${unreadCount} thông báo chưa đọc`
                : "Bạn đã đọc hết thông báo"}
            </p>
          </div>
          {unreadCount > 0 && (
            <button className="btn-mark-all-read" onClick={handleMarkAllAsRead}>
              Đánh dấu tất cả đã đọc
            </button>
          )}
        </div>

        <div className="notifications-content">
          {notifications.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔔</div>
              <h3>Chưa có thông báo</h3>
              <p>Các thông báo mới sẽ xuất hiện ở đây</p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  } ${getNotificationClass(notification.type)}`}
                  onClick={() => {
                    if (!notification.read) {
                      handleMarkAsRead(notification._id);
                    }
                    // If notification has postId, navigate to discussion-list with modal
                    if (notification.post) {
                      history.push(
                        `/discussion-list?postId=${notification.post}`
                      );
                    } else if (notification.link) {
                      history.push(notification.link);
                    }
                  }}
                >
                  <div className="notification-icon">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="notification-content">
                    <div className="notification-header">
                      <h3 className="notification-title">
                        {notification.title}
                      </h3>
                      {!notification.read && (
                        <span className="unread-badge"></span>
                      )}
                    </div>
                    <p className="notification-message">
                      {notification.message}
                    </p>
                    <div className="notification-meta">
                      <span className="notification-event">
                        {notification.event?.title}
                      </span>
                      <span className="notification-time">
                        {formatTime(notification.createdAt)}
                      </span>
                    </div>
                  </div>
                  <button
                    className="notification-delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(notification._id);
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
