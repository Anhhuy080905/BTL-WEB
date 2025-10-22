import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import Notification from "../components/Notification";
import { postsService } from "../services/postsService";
import { eventsService } from "../services/eventsService";
import "./discussion-list-fb.css";

const DiscussionListFB = () => {
  const history = useHistory();
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState({});
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedEventForPost, setSelectedEventForPost] = useState("");
  const [newCommentContent, setNewCommentContent] = useState({});
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);

  // New states for post creation features
  const [selectedImages, setSelectedImages] = useState([]);
  const [selectedFeeling, setSelectedFeeling] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [showFeelingPicker, setShowFeelingPicker] = useState(false);
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [selectedImageForModal, setSelectedImageForModal] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
      history.push("/login");
      return;
    }
    setCurrentUser(user);
    fetchAllPosts();
  }, [history]);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);
      const allEvents = await eventsService.getAllEvents();
      const currentUserId = JSON.parse(localStorage.getItem("user"))?._id;

      const eventsMap = {};
      const allPosts = [];

      // Chỉ fetch posts từ events mà user có khả năng cao có quyền truy cập
      for (const event of allEvents) {
        // Pre-filter: Chỉ thử fetch nếu:
        // 1. User là creator, hoặc
        // 2. Event có registrationStatus = 'approved' (backend trả về)
        const isCreator =
          event.creator?._id === currentUserId ||
          event.createdBy === currentUserId;
        const hasApprovedStatus = event.registrationStatus === "approved";

        if (!isCreator && !hasApprovedStatus) {
          // Bỏ qua các events mà user rõ ràng không có quyền
          continue;
        }

        try {
          const eventPosts = await postsService.getEventPosts(event._id);
          // Nếu fetch thành công, nghĩa là user có quyền truy cập
          eventsMap[event._id] = event;
          eventPosts.forEach((post) => {
            post.eventId = event._id;
          });
          allPosts.push(...eventPosts);
        } catch (err) {
          // Nếu lỗi 403, nghĩa là không có quyền -> bỏ qua event này
          // Silently skip
        }
      }

      setEvents(eventsMap);

      const accessibleEventIds = Object.keys(eventsMap);
      if (accessibleEventIds.length > 0) {
        setSelectedEventForPost(accessibleEventIds[0]);
      }

      allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(allPosts);
    } catch (err) {
      // Silently handle
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !selectedEventForPost) return;

    try {
      // Convert images to base64
      const imagePromises = selectedImages.map((img) => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.onerror = reject;
          reader.readAsDataURL(img.file);
        });
      });

      const base64Images = await Promise.all(imagePromises);

      const postData = {
        content: newPostContent,
        images: base64Images,
      };

      // Add feeling and location to content if selected
      let fullContent = newPostContent;
      if (selectedFeeling) {
        fullContent += `\n${selectedFeeling}`;
      }
      if (selectedLocation) {
        fullContent += `\n📍 ${selectedLocation}`;
      }
      postData.content = fullContent;

      const newPost = await postsService.createPost(
        selectedEventForPost,
        postData
      );
      newPost.eventId = selectedEventForPost;
      setPosts([newPost, ...posts]);

      // Reset all states
      setNewPostContent("");
      setSelectedImages([]);
      setSelectedFeeling("");
      setSelectedLocation("");
      setShowFeelingPicker(false);
      setShowLocationInput(false);
      setShowCreatePostModal(false);
    } catch (err) {
      setNotification({
        type: "error",
        title: "Lỗi!",
        message: err.response?.data?.message || "Không thể tạo bài viết",
      });
    }
  };

  // Handler for image selection
  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedImages.length > 10) {
      setNotification({
        type: "warning",
        title: "Cảnh báo!",
        message: "Chỉ có thể chọn tối đa 10 ảnh",
      });
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setSelectedImages([...selectedImages, ...newImages]);
  };

  // Handler for removing image
  const handleRemoveImage = (index) => {
    const newImages = [...selectedImages];
    URL.revokeObjectURL(newImages[index].preview);
    newImages.splice(index, 1);
    setSelectedImages(newImages);
  };

  // Feelings list
  const feelings = [
    "😊 đang cảm thấy vui vẻ",
    "😍 đang cảm thấy yêu thương",
    "😢 đang cảm thấy buồn",
    "😡 đang cảm thấy tức giận",
    "😴 đang cảm thấy buồn ngủ",
    "🤗 đang cảm thấy biết ơn",
    "🎉 đang cảm thấy phấn khích",
    "💪 đang cảm thấy mạnh mẽ",
    "🙏 đang cảm thấy may mắn",
    "❤️ đang yêu điều này",
  ];

  const handleToggleLike = async (postId) => {
    try {
      const updatedPost = await postsService.toggleLike(postId);

      // Use callback to ensure we have latest state
      setPosts((prevPosts) => {
        const eventId = prevPosts.find((p) => p._id === postId)?.eventId;
        const newPost = { ...updatedPost, eventId };

        const newPosts = prevPosts.map((p) => (p._id === postId ? newPost : p));
        return newPosts;
      });
    } catch (err) {
      console.error("Error toggling like:", err);
      setNotification({
        type: "error",
        title: "Lỗi!",
        message: "Không thể thích bài viết: " + err.message,
      });
    }
  };

  const handleAddComment = async (postId) => {
    const content = newCommentContent[postId];
    if (!content?.trim()) return;

    try {
      const updatedPost = await postsService.addComment(postId, { content });

      // Use callback to ensure we have latest state
      setPosts((prevPosts) => {
        const eventId = prevPosts.find((p) => p._id === postId)?.eventId;
        updatedPost.eventId = eventId;
        return prevPosts.map((p) => (p._id === postId ? updatedPost : p));
      });

      setNewCommentContent({ ...newCommentContent, [postId]: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
      setNotification({
        type: "error",
        title: "Lỗi!",
        message: "Không thể gửi bình luận: " + err.message,
      });
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      await postsService.deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      const updatedPost = await postsService.deleteComment(postId, commentId);
      updatedPost.eventId = posts.find((p) => p._id === postId)?.eventId;
      setPosts(posts.map((p) => (p._id === postId ? updatedPost : p)));
    } catch (err) {
      console.error("Error deleting comment:", err);
    }
  };

  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const getUserName = (user) => {
    return user?.username || user?.fullName || "Unknown";
  };

  const isLiked = (post) => {
    if (!currentUser) {
      return false;
    }

    // Get user ID - support both _id and id fields
    const userId = currentUser._id || currentUser.id;
    if (!userId) {
      return false;
    }

    const liked = post.likes?.some((like) => {
      if (typeof like === "string") {
        return like === userId;
      }
      return like._id === userId || like.id === userId;
    });

    return liked;
  };

  const canDeletePost = (post) => {
    return post.user?._id === currentUser?._id;
  };

  const canDeleteComment = (comment) => {
    return comment.user?._id === currentUser?._id;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Vừa xong";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} phút trước`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} giờ trước`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} ngày trước`;

    return date.toLocaleDateString("vi-VN");
  };

  // Show loading state until user is loaded
  if (!currentUser) {
    return (
      <div className="discussion-list-container">
        <Navigation />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            fontSize: "18px",
            color: "#65676b",
          }}
        >
          Đang tải...
        </div>
      </div>
    );
  }

  return (
    <div className="discussion-list-container">
      <Navigation />

      <div className="discussion-content">
        {/* Left Sidebar - Shortcuts */}
        <aside className="left-sidebar">
          <div className="sidebar-menu">
            <div className="sidebar-section-title">Shortcuts</div>

            <div
              className="sidebar-item"
              onClick={() => {
                setShowCreatePostModal(true);
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar-item-icon">
                <span>✏️</span>
              </div>
              <span>Tạo Bài Viết</span>
            </div>

            <div
              className="sidebar-item"
              onClick={() => {
                // Redirect based on user role
                if (
                  currentUser.role === "admin" ||
                  currentUser.role === "organizer"
                ) {
                  history.push("/event-management");
                } else {
                  history.push("/events");
                }
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar-item-icon">
                <span>�</span>
              </div>
              <span>Sự Kiện</span>
            </div>

            <div
              className="sidebar-item"
              onClick={() => {
                history.push("/profile");
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar-item-icon">
                <span>👤</span>
              </div>
              <span>Hồ Sơ Của Tôi</span>
            </div>

            <div className="sidebar-divider" />

            <div
              className="sidebar-item"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                history.push("/login");
              }}
              style={{ cursor: "pointer" }}
            >
              <div className="sidebar-item-icon">
                <span>🚪</span>
              </div>
              <span>Đăng Xuất</span>
            </div>
          </div>
        </aside>

        {/* Main Feed */}
        <main className="main-feed">
          {/* Stories */}
          <div className="stories-section">
            {Object.values(events)
              .slice(0, 5)
              .map((event) => (
                <div key={event._id} className="story-card">
                  <div className="story-avatar">
                    {event.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="story-name">{event.title}</div>
                </div>
              ))}
          </div>

          {/* Create Post Trigger */}
          <div className="create-post-box">
            <div className="create-post-top">
              <div className="create-post-avatar">
                {getInitials(getUserName(currentUser))}
              </div>
              <div
                className="create-post-trigger"
                onClick={() => setShowCreatePostModal(true)}
              >
                {`${getUserName(currentUser)} ơi, bạn đang nghĩ gì thế?`}
              </div>
            </div>

            <div className="create-post-actions">
              <div className="post-action-buttons">
                <button className="action-btn">
                  <span>📷</span>
                  <span>Ảnh/Video</span>
                </button>
                <button className="action-btn">
                  <span>😊</span>
                  <span>Cảm xúc</span>
                </button>
              </div>
            </div>
          </div>

          {/* Create Post Modal */}
          {showCreatePostModal && (
            <div
              className="modal-overlay"
              onClick={() => setShowCreatePostModal(false)}
            >
              <div
                className="create-post-modal"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <h2>Tạo bài viết</h2>
                  <button
                    className="modal-close"
                    onClick={() => setShowCreatePostModal(false)}
                  >
                    ✕
                  </button>
                </div>

                <div className="modal-body">
                  <div className="modal-user-info">
                    <div className="create-post-avatar">
                      {getInitials(getUserName(currentUser))}
                    </div>
                    <div>
                      <h4>{getUserName(currentUser)}</h4>
                      <select
                        className="event-selector-inline"
                        value={selectedEventForPost}
                        onChange={(e) =>
                          setSelectedEventForPost(e.target.value)
                        }
                      >
                        <option value="">📋 Chọn sự kiện</option>
                        {Object.values(events).map((event) => (
                          <option key={event._id} value={event._id}>
                            📅 {event.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <textarea
                    className="modal-textarea"
                    placeholder={`${getUserName(
                      currentUser
                    )} ơi, bạn đang nghĩ gì thế?`}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    rows="8"
                    autoFocus
                  />

                  {/* Image Preview */}
                  {selectedImages.length > 0 && (
                    <div className="image-preview-container">
                      {selectedImages.map((img, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={img.preview} alt={`Preview ${index + 1}`} />
                          <button
                            type="button"
                            className="remove-image-btn"
                            onClick={() => handleRemoveImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Feeling Display */}
                  {selectedFeeling && (
                    <div className="selected-feeling">
                      {selectedFeeling}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => setSelectedFeeling("")}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Location Display */}
                  {selectedLocation && (
                    <div className="selected-location">
                      📍 {selectedLocation}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => setSelectedLocation("")}
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Feeling Picker */}
                  {showFeelingPicker && (
                    <div className="feeling-picker">
                      <div className="feeling-picker-header">
                        <h4>Bạn đang cảm thấy thế nào?</h4>
                        <button
                          type="button"
                          onClick={() => setShowFeelingPicker(false)}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="feeling-options">
                        {feelings.map((feeling, index) => (
                          <button
                            key={index}
                            type="button"
                            className="feeling-option"
                            onClick={() => {
                              setSelectedFeeling(feeling);
                              setShowFeelingPicker(false);
                            }}
                          >
                            {feeling}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Location Input */}
                  {showLocationInput && (
                    <div className="location-input-container">
                      <input
                        type="text"
                        className="location-input"
                        placeholder="Bạn đang ở đâu?"
                        value={selectedLocation}
                        onChange={(e) => setSelectedLocation(e.target.value)}
                        autoFocus
                      />
                      <button
                        type="button"
                        className="location-done-btn"
                        onClick={() => setShowLocationInput(false)}
                      >
                        Xong
                      </button>
                    </div>
                  )}

                  <div className="modal-addons">
                    <div className="addons-label">
                      Thêm vào bài viết của bạn
                    </div>
                    <div className="addons-buttons">
                      <input
                        type="file"
                        id="image-upload"
                        accept="image/*,video/*"
                        multiple
                        style={{ display: "none" }}
                        onChange={handleImageSelect}
                      />
                      <button
                        type="button"
                        className="addon-btn"
                        title="Ảnh/Video"
                        onClick={() =>
                          document.getElementById("image-upload").click()
                        }
                      >
                        📷
                      </button>
                      <button
                        type="button"
                        className="addon-btn"
                        title="Gắn thẻ"
                        onClick={() =>
                          setNotification({
                            type: "info",
                            title: "Thông báo",
                            message: "Chức năng đang được phát triển",
                          })
                        }
                      >
                        👤
                      </button>
                      <button
                        type="button"
                        className="addon-btn"
                        title="Cảm xúc"
                        onClick={() => setShowFeelingPicker(!showFeelingPicker)}
                      >
                        😊
                      </button>
                      <button
                        type="button"
                        className="addon-btn"
                        title="Vị trí"
                        onClick={() => setShowLocationInput(!showLocationInput)}
                      >
                        �️
                      </button>
                      <button
                        type="button"
                        className="addon-btn"
                        title="GIF"
                        onClick={() =>
                          setNotification({
                            type: "info",
                            title: "Thông báo",
                            message: "Chức năng đang được phát triển",
                          })
                        }
                      >
                        GIF
                      </button>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    className="modal-submit-btn"
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim() || !selectedEventForPost}
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Posts Feed */}
          {loading ? (
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Đang tải bài viết...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <h3>Chưa có bài viết nào</h3>
              <p>Hãy là người đầu tiên chia sẻ trong sự kiện của bạn!</p>
            </div>
          ) : (
            <div className="posts-feed">
              {posts.map((post) => (
                <article key={post._id} className="post-card">
                  {/* Post Header */}
                  <div className="post-header">
                    <div className="post-author">
                      <div className="user-avatar">
                        {getInitials(getUserName(post.user))}
                      </div>
                      <div>
                        <div className="author-info">
                          <h4>{getUserName(post.user)}</h4>
                        </div>
                        <div className="post-meta">
                          <span className="post-time">
                            {formatDate(post.createdAt)}
                          </span>
                          {post.eventId && events[post.eventId] && (
                            <>
                              <span>·</span>
                              <span className="event-badge">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                                </svg>
                                {events[post.eventId].title}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    {canDeletePost(post) && (
                      <div
                        className="post-options"
                        onClick={() => handleDeletePost(post._id)}
                        title="Xóa bài viết"
                      >
                        ⋯
                      </div>
                    )}
                  </div>

                  {/* Post Content */}
                  <div className="post-content">
                    <p className="post-text">{post.content}</p>

                    {/* Post Images */}
                    {post.images && post.images.length > 0 && (
                      <div
                        className={`post-images post-images-${post.images.length}`}
                      >
                        {post.images.map((image, index) => (
                          <img
                            key={index}
                            src={image}
                            alt={`Post image ${index + 1}`}
                            className="post-image"
                            onClick={() => setSelectedImageForModal(image)}
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Stats */}
                  <div className="post-stats">
                    <div className="stats-left">
                      <span className="reaction-icon">👍</span>
                      <span>{post.likes?.length || 0}</span>
                    </div>
                    <div className="stats-right">
                      <span className="stat-item">
                        {post.comments?.length || 0} bình luận
                      </span>
                    </div>
                  </div>

                  {/* Post Actions */}
                  <div className="post-actions">
                    <button
                      className={`post-action ${isLiked(post) ? "liked" : ""}`}
                      onClick={() => handleToggleLike(post._id)}
                    >
                      {isLiked(post) ? (
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                        </svg>
                      ) : (
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M7 22V11M2 13v7c0 1.1.9 2 2 2h3V11H4c-1.1 0-2 .9-2 2zm20-4h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L15.17 2 8.59 8.59C8.22 8.95 8 9.45 8 10v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73V11c0-1.1-.9-2-2-2z" />
                        </svg>
                      )}
                      <span>{isLiked(post) ? "Thích" : "Thích"}</span>
                    </button>
                    <button
                      className="post-action"
                      onClick={() => {
                        const input = document.getElementById(
                          `comment-input-${post._id}`
                        );
                        if (input) input.focus();
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
                      </svg>
                      <span>Bình luận</span>
                    </button>
                    <button className="post-action">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" />
                      </svg>
                      <span>Chia sẻ</span>
                    </button>
                  </div>

                  {/* Comments */}
                  <div className="comments-wrapper">
                    {post.comments?.map((comment) => (
                      <div key={comment._id} className="comment">
                        <div className="comment-avatar">
                          {getInitials(getUserName(comment.user))}
                        </div>
                        <div className="comment-body">
                          <div className="comment-bubble">
                            <div className="comment-author">
                              {getUserName(comment.user)}
                            </div>
                            <div className="comment-text">
                              {comment.content}
                            </div>
                          </div>
                          <div className="comment-actions">
                            <span className="comment-action">Thích</span>
                            <span className="comment-action">Trả lời</span>
                            {canDeleteComment(comment) && (
                              <span
                                className="comment-action"
                                onClick={() =>
                                  handleDeleteComment(post._id, comment._id)
                                }
                              >
                                Xóa
                              </span>
                            )}
                            <span className="comment-time">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Comment */}
                    <div className="add-comment">
                      <div className="comment-avatar">
                        {getInitials(getUserName(currentUser))}
                      </div>
                      <div className="add-comment-input-wrapper">
                        <input
                          id={`comment-input-${post._id}`}
                          type="text"
                          placeholder="Viết bình luận..."
                          value={newCommentContent[post._id] || ""}
                          onChange={(e) =>
                            setNewCommentContent({
                              ...newCommentContent,
                              [post._id]: e.target.value,
                            })
                          }
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              handleAddComment(post._id);
                            }
                          }}
                        />
                        {newCommentContent[post._id]?.trim() && (
                          <button
                            className="comment-send-btn"
                            onClick={() => handleAddComment(post._id)}
                          >
                            ➤
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar */}
        <aside className="right-sidebar">
          <div className="sidebar-section">
            <h3>
              <span>Sự Kiện Của Bạn</span>
              <span style={{ color: "#1877f2", cursor: "pointer" }}>
                Xem tất cả
              </span>
            </h3>
            <div className="event-list">
              {Object.values(events).map((event) => (
                <div
                  key={event._id}
                  className="event-item"
                  onClick={() => history.push(`/discussion/${event._id}`)}
                >
                  <div className="event-icon">
                    {event.title.charAt(0).toUpperCase()}
                  </div>
                  <div className="event-details">
                    <h4>{event.title}</h4>
                    <span>
                      {new Date(event.date).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Image Modal */}
      {selectedImageForModal && (
        <div
          className="image-modal"
          onClick={() => setSelectedImageForModal(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImageForModal}
              alt="Full size"
              className="modal-image"
            />
          </div>
        </div>
      )}

      {/* Notification */}
      {notification && (
        <Notification
          type={notification.type}
          title={notification.title}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}

      <Footer />
    </div>
  );
};

export default DiscussionListFB;
