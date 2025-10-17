import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import Navigation from "../components/navigation.jsx";
import Footer from "../components/footer.jsx";
import { authAPI } from "../services/api";
import { eventsService } from "../services/eventsService";
import { postsService } from "../services/postsService";
import "./discussion-list.css";

const DiscussionList = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);
  const [events, setEvents] = useState({});
  const [error, setError] = useState(null);
  const [newPostContent, setNewPostContent] = useState("");
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedEventForPost, setSelectedEventForPost] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!authAPI.isAuthenticated()) {
      history.push("/login");
      return;
    }
    fetchAllPosts();
  }, []);

  const fetchAllPosts = async () => {
    try {
      setLoading(true);

      // Lấy tất cả sự kiện
      const allEvents = await eventsService.getAllEvents();

      // Lọc các sự kiện mà user có quyền truy cập
      const accessibleEvents = allEvents.filter((event) => {
        if (event.creator?._id === currentUser?._id) return true;
        if (event.registrationStatus === "approved") return true;
        return false;
      });

      // Tạo map eventId -> event
      const eventsMap = {};
      accessibleEvents.forEach((event) => {
        eventsMap[event._id] = event;
      });
      setEvents(eventsMap);

      // Set event đầu tiên làm default cho create post
      if (accessibleEvents.length > 0) {
        setSelectedEventForPost(accessibleEvents[0]._id);
      }

      // Lấy tất cả posts từ các sự kiện này
      const allPosts = [];
      for (const event of accessibleEvents) {
        try {
          const eventPosts = await postsService.getEventPosts(event._id);
          console.log("Event posts received:", eventPosts);
          if (eventPosts.length > 0) {
            console.log("First post user data:", eventPosts[0].user);
          }
          // Thêm eventId vào mỗi post để biết post thuộc event nào
          eventPosts.forEach((post) => {
            post.eventId = event._id;
          });
          allPosts.push(...eventPosts);
        } catch (err) {
          console.error(`Error fetching posts for event ${event._id}:`, err);
        }
      }

      // Sắp xếp posts theo thời gian mới nhất
      allPosts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setPosts(allPosts);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Không thể tải bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim() || !selectedEventForPost) return;

    try {
      const newPost = await postsService.createPost(selectedEventForPost, {
        content: newPostContent,
      });
      newPost.eventId = selectedEventForPost;
      setPosts([newPost, ...posts]);
      setNewPostContent("");
    } catch (err) {
      console.error("Error creating post:", err);
      alert(err.response?.data?.message || "Không thể tạo bài viết");
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      await postsService.deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error("Error deleting post:", err);
      alert(err.response?.data?.message || "Không thể xóa bài viết");
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const updatedPost = await postsService.toggleLike(postId);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...updatedPost, eventId: post.eventId } : post
        )
      );
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      const updatedPost = await postsService.addComment(postId, content);
      setPosts(
        posts.map((post) =>
          post._id === postId ? { ...updatedPost, eventId: post.eventId } : post
        )
      );
      setCommentInputs({ ...commentInputs, [postId]: "" });
    } catch (err) {
      console.error("Error adding comment:", err);
      alert(err.response?.data?.message || "Không thể thêm bình luận");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      await postsService.deleteComment(postId, commentId);
      await fetchAllPosts();
    } catch (err) {
      console.error("Error deleting comment:", err);
      alert(err.response?.data?.message || "Không thể xóa bình luận");
    }
  };

  const canDeletePost = (post) => {
    return (
      post.user._id === currentUser?._id ||
      currentUser?.role === "admin" ||
      currentUser?.role === "event_manager"
    );
  };

  const canDeleteComment = (comment) => {
    return (
      comment.user._id === currentUser?._id ||
      currentUser?.role === "admin" ||
      currentUser?.role === "event_manager"
    );
  };

  const isLiked = (post) => {
    return post.likes.some((like) => like._id === currentUser?._id);
  };

  // Lấy chữ cái đầu của tên để làm avatar (giống UserDropdown)
  const getInitials = (name) => {
    if (!name) return "?";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  // Lấy tên hiển thị từ user object
  const getDisplayName = (user) => {
    return user?.username || user?.fullName || "Unknown";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Vừa xong";
    if (minutes < 60) return `${minutes} phút trước`;
    if (hours < 24) return `${hours} giờ trước`;
    if (days < 7) return `${days} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "upcoming":
        return { text: "Sắp diễn ra", class: "status-upcoming" };
      case "ongoing":
        return { text: "Đang diễn ra", class: "status-ongoing" };
      case "completed":
        return { text: "Đã kết thúc", class: "status-completed" };
      default:
        return { text: "Không rõ", class: "status-unknown" };
    }
  };

  return (
    <div className="discussion-list-container">
      <Navigation />
      <div className="discussion-list-wrapper">
        {/* Hero Section */}
        <div className="discussion-list-hero">
          <div className="hero-content">
            <h1>Kênh Trao Đổi</h1>
            <p>
              Kết nối và trao đổi với các tình nguyện viên khác trong các sự
              kiện bạn đã tham gia
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="discussion-feed-content">
          {loading ? (
            <div className="discussion-list-loading">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : error ? (
            <div className="discussion-list-error">
              <div className="error-icon">⚠️</div>
              <p>{error}</p>
            </div>
          ) : Object.keys(events).length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h2>Chưa có sự kiện nào</h2>
              <p>
                Bạn chưa tham gia sự kiện nào hoặc chưa được phê duyệt. Hãy đăng
                ký tham gia sự kiện để truy cập kênh trao đổi!
              </p>
              <button
                onClick={() => history.push("/events")}
                className="btn-primary"
              >
                Khám phá sự kiện
              </button>
            </div>
          ) : (
            <>
              {/* Create Post Form */}
              <div className="create-post-card">
                <div className="user-avatar">
                  {currentUser?.name?.charAt(0).toUpperCase()}
                </div>
                <form onSubmit={handleCreatePost} className="create-post-form">
                  <select
                    value={selectedEventForPost}
                    onChange={(e) => setSelectedEventForPost(e.target.value)}
                    className="event-select"
                  >
                    {Object.values(events).map((event) => (
                      <option key={event._id} value={event._id}>
                        {event.title}
                      </option>
                    ))}
                  </select>
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={`${currentUser?.name}, bạn nghĩ gì về sự kiện này?`}
                    rows="3"
                  />
                  <button
                    type="submit"
                    disabled={!newPostContent.trim()}
                    className="submit-post-btn"
                  >
                    Đăng bài
                  </button>
                </form>
              </div>

              {/* Posts List */}
              <div className="posts-list">
                {posts.length === 0 ? (
                  <div className="no-posts">
                    <p>Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div key={post._id} className="post-card">
                      {/* Event Badge */}
                      {events[post.eventId] && (
                        <div className="post-event-badge">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <rect x="3" y="4" width="18" height="18" rx="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                          <span>{events[post.eventId].title}</span>
                        </div>
                      )}

                      {/* Post Header */}
                      <div className="post-header">
                        <div className="post-author">
                          <div className="user-avatar">
                            {getInitials(getDisplayName(post.user))}
                          </div>
                          <div className="author-info">
                            <h4>{getDisplayName(post.user)}</h4>
                            <span className="post-time">
                              {formatDate(post.createdAt)}
                            </span>
                          </div>
                        </div>
                        {canDeletePost(post) && (
                          <button
                            onClick={() => handleDeletePost(post._id)}
                            className="delete-post-btn"
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      {/* Post Content */}
                      <div className="post-content">
                        <p>{post.content}</p>
                      </div>

                      {/* Post Actions */}
                      <div className="post-actions">
                        <button
                          onClick={() => handleToggleLike(post._id)}
                          className={`like-btn ${isLiked(post) ? "liked" : ""}`}
                        >
                          {isLiked(post) ? "❤️" : "🤍"} {post.likes.length}
                        </button>
                        <span className="comment-count">
                          💬 {post.comments.length} bình luận
                        </span>
                      </div>

                      {/* Comments Section */}
                      <div className="comments-section">
                        {post.comments.map((comment) => (
                          <div key={comment._id} className="comment">
                            <div className="comment-avatar">
                              {getInitials(getDisplayName(comment.user))}
                            </div>
                            <div className="comment-content">
                              <div className="comment-header">
                                <strong>{getDisplayName(comment.user)}</strong>
                                <span className="comment-time">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p>{comment.content}</p>
                            </div>
                            {canDeleteComment(comment) && (
                              <button
                                onClick={() =>
                                  handleDeleteComment(post._id, comment._id)
                                }
                                className="delete-comment-btn"
                              >
                                ×
                              </button>
                            )}
                          </div>
                        ))}

                        {/* Add Comment Input */}
                        <div className="add-comment">
                          <div className="user-avatar small">
                            {currentUser?.name?.charAt(0).toUpperCase()}
                          </div>
                          <input
                            type="text"
                            value={commentInputs[post._id] || ""}
                            onChange={(e) =>
                              setCommentInputs({
                                ...commentInputs,
                                [post._id]: e.target.value,
                              })
                            }
                            placeholder="Viết bình luận..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment(post._id);
                              }
                            }}
                          />
                          <button
                            onClick={() => handleAddComment(post._id)}
                            className="send-comment-btn"
                            disabled={!commentInputs[post._id]?.trim()}
                          >
                            ➤
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DiscussionList;
