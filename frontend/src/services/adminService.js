import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Helper function to get auth header
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const adminService = {
  // ========== USER MANAGEMENT ==========

  // Get all users
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/users`, getAuthHeader());
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/users/${userId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Lock user account
  lockUser: async (userId) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/lock`,
        {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Unlock user account
  unlockUser: async (userId) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/unlock`,
        {},
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update user role
  updateUserRole: async (userId, role) => {
    try {
      const response = await axios.put(
        `${API_URL}/users/${userId}/role`,
        { role },
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/users/${userId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/users/stats`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export users
  exportUsers: async (format = "json") => {
    try {
      const response = await axios.get(
        `${API_URL}/users/export?format=${format}`,
        {
          ...getAuthHeader(),
          responseType: format === "csv" ? "blob" : "json",
        }
      );

      if (format === "csv") {
        // Create download link for CSV
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `users_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: "Downloaded CSV file" };
      } else {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },

  // ========== EVENT MANAGEMENT ==========

  // Get all events (admin only)
  getAllEvents: async () => {
    try {
      const response = await axios.get(
        `${API_URL}/events/admin/all`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete event (admin only)
  deleteEvent: async (eventId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/events/${eventId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Export events
  exportEvents: async (format = "json") => {
    try {
      const response = await axios.get(
        `${API_URL}/events/export?format=${format}`,
        {
          ...getAuthHeader(),
          responseType: format === "csv" ? "blob" : "json",
        }
      );

      if (format === "csv") {
        // Create download link for CSV
        const blob = new Blob([response.data], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `events_${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        return { success: true, message: "Downloaded CSV file" };
      } else {
        return response.data;
      }
    } catch (error) {
      throw error;
    }
  },
};
