import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Lấy tất cả thông báo
export const getNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
      headers: getAuthHeader(),
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Đánh dấu thông báo đã đọc
export const markAsRead = async (notificationId) => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error);
    throw error;
  }
};

// Đánh dấu tất cả đã đọc
export const markAllAsRead = async () => {
  try {
    const response = await axios.put(
      `${API_URL}/notifications/read-all`,
      {},
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error marking all as read:", error);
    throw error;
  }
};

// Xóa thông báo
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/notifications/${notificationId}`,
      {
        headers: getAuthHeader(),
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};

export const notificationsService = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
