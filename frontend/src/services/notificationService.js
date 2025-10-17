import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const notificationService = {
  // Lấy tất cả thông báo
  getAll: async () => {
    try {
      const response = await axios.get(API_URL, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Lấy số lượng chưa đọc
  getUnreadCount: async () => {
    try {
      const response = await axios.get(`${API_URL}/unread-count`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching unread count:", error);
      throw error;
    }
  },

  // Đánh dấu đã đọc
  markAsRead: async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/${id}/read`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error marking as read:", error);
      throw error;
    }
  },

  // Đánh dấu tất cả đã đọc
  markAllAsRead: async () => {
    try {
      const response = await axios.put(
        `${API_URL}/mark-all-read`,
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
  },

  // Xóa thông báo
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },
};

export default notificationService;
