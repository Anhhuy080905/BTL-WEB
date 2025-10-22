import axios from "axios";

const API_URL = "http://localhost:5000/api/posts";

// Helper để lấy token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const postsService = {
  // Lấy tất cả posts của sự kiện
  getEventPosts: async (eventId) => {
    try {
      const response = await axios.get(
        `${API_URL}/event/${eventId}`,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Tạo post mới
  createPost: async (eventId, postData) => {
    try {
      const response = await axios.post(
        `${API_URL}/event/${eventId}`,
        postData,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa post
  deletePost: async (postId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${postId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Like/Unlike post
  toggleLike: async (postId) => {
    try {
      const response = await axios.post(
        `${API_URL}/${postId}/like`,
        {},
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Thêm comment
  addComment: async (postId, commentData) => {
    try {
      const response = await axios.post(
        `${API_URL}/${postId}/comments`,
        commentData,
        getAuthHeader()
      );
      return response.data.data;
    } catch (error) {
      throw error;
    }
  },

  // Xóa comment
  deleteComment: async (postId, commentId) => {
    try {
      const response = await axios.delete(
        `${API_URL}/${postId}/comments/${commentId}`,
        getAuthHeader()
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};
