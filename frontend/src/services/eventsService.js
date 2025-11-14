// Events Service - Kết nối với MongoDB thông qua backend API
import axios from "axios";

const API_URL = "http://localhost:5000/api/events";

// Lấy token từ localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Listeners để notify khi data thay đổi
const listeners = new Set();

// Notify tất cả listeners
const notifyListeners = () => {
  listeners.forEach((callback) => callback());
};

export const eventsService = {
  // Lấy tất cả sự kiện
  getAllEvents: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters.status) {
        params.append("status", filters.status);
      }
      if (filters.search) {
        params.append("search", filters.search);
      }
      if (filters.timeRange && filters.timeRange !== "all") {
        params.append("timeRange", filters.timeRange);
      }
      if (filters.startDate) {
        params.append("startDate", filters.startDate);
      }
      if (filters.endDate) {
        params.append("endDate", filters.endDate);
      }

      const response = await axios.get(`${API_URL}?${params.toString()}`, {
        headers: getAuthHeader(),
      });
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Lấy sự kiện theo ID
  getEventById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
      });
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo sự kiện mới
  createEvent: async (eventData) => {
    try {
      const response = await axios.post(`${API_URL}`, eventData, {
        headers: getAuthHeader(),
      });
      notifyListeners();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Cập nhật sự kiện
  updateEvent: async (id, updatedData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, updatedData, {
        headers: getAuthHeader(),
      });
      notifyListeners();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa sự kiện
  deleteEvent: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
      });
      notifyListeners();
      return true;
    } catch (error) {
      throw error;
    }
  },

  // Đăng ký tham gia sự kiện
  registerForEvent: async (id) => {
    try {
      const response = await axios.post(
        `${API_URL}/${id}/register`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      notifyListeners();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Hủy đăng ký sự kiện
  unregisterFromEvent: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}/unregister`, {
        headers: getAuthHeader(),
      });
      notifyListeners();
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy các sự kiện đã đăng ký
  getMyRegisteredEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/my/registered`, {
        headers: getAuthHeader(),
      });
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Lấy các sự kiện do mình tạo
  getMyCreatedEvents: async () => {
    try {
      const response = await axios.get(`${API_URL}/my/created`, {
        headers: getAuthHeader(),
      });
      return response.data.data || [];
    } catch (error) {
      throw error;
    }
  },

  // Lấy danh sách đăng ký chờ phê duyệt
  getPendingRegistrations: async (eventId) => {
    try {
      const response = await axios.get(
        `${API_URL}/${eventId}/registrations/pending`,
        {
          headers: getAuthHeader(),
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lấy tất cả đăng ký của event
  getEventRegistrations: async (eventId) => {
    try {
      const response = await axios.get(`${API_URL}/${eventId}/registrations`, {
        headers: getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Phê duyệt đăng ký
  approveRegistration: async (eventId, userId) => {
    try {
      const response = await axios.put(
        `${API_URL}/${eventId}/registrations/${userId}/review`,
        { status: "approved" },
        {
          headers: getAuthHeader(),
        }
      );
      notifyListeners();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Từ chối đăng ký
  rejectRegistration: async (eventId, userId) => {
    try {
      const response = await axios.put(
        `${API_URL}/${eventId}/registrations/${userId}/review`,
        { status: "rejected" },
        {
          headers: getAuthHeader(),
        }
      );
      notifyListeners();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Check-in tình nguyện viên
  checkInParticipant: async (eventId, userId) => {
    try {
      const response = await axios.put(
        `${API_URL}/${eventId}/participants/${userId}/checkin`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      notifyListeners();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Hủy check-in
  undoCheckIn: async (eventId, userId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${eventId}/participants/${userId}/checkin`,
        {
          headers: getAuthHeader(),
        }
      );
      notifyListeners();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Đánh dấu hoàn thành
  markAsCompleted: async (eventId, userId) => {
    try {
      const response = await axios.put(
        `${API_URL}/${eventId}/participants/${userId}/complete`,
        {},
        {
          headers: getAuthHeader(),
        }
      );
      notifyListeners();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Hủy hoàn thành
  undoCompleted: async (eventId, userId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${eventId}/participants/${userId}/complete`,
        {
          headers: getAuthHeader(),
        }
      );
      notifyListeners();
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Subscribe để nhận thông báo khi data thay đổi
  subscribe: (callback) => {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },
};
