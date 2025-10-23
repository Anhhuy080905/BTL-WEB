import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import Notification from "../components/Notification";
import { postsService } from "../services/postsService";
import { eventsService } from "../services/eventsService";
import "./discussion-channel.css";

const DiscussionChannel = () => {
  const { eventId } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [commentImages, setCommentImages] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchEventAndPosts();
  }, [eventId]);

  const fetchEventAndPosts = async () => {
    try {
      setLoading(true);
      const [eventData, postsData] = await Promise.all([
        eventsService.getEventById(eventId),
        postsService.getEventPosts(eventId),
      ]);
      setEvent(eventData);
      setPosts(postsData);
      setError(null);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Bạn không có quyền truy cập kênh trao đổi này"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      await postsService.deletePost(postId);
      setPosts(posts.filter((post) => post._id !== postId));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa bài viết");
    }
  };

  const handleToggleLike = async (postId) => {
    try {
      const updatedPost = await postsService.toggleLike(postId);
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      // Silently fail for like operations
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      const images = commentImages[postId] || [];
      const updatedPost = await postsService.addComment(
        postId,
        content,
        images
      );
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
      setCommentInputs({ ...commentInputs, [postId]: "" });
      setCommentImages({ ...commentImages, [postId]: [] });
    } catch (err) {
      alert(err.response?.data?.message || "Không thể thêm bình luận");
    }
  };

  const handleCommentImageUpload = (postId, e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const imageUrls = [];
    let loadedCount = 0;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        imageUrls.push(reader.result);
        loadedCount++;
        if (loadedCount === files.length) {
          const currentImages = commentImages[postId] || [];
          setCommentImages({
            ...commentImages,
            [postId]: [...currentImages, ...imageUrls],
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeCommentImage = (postId, index) => {
    const currentImages = commentImages[postId] || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setCommentImages({ ...commentImages, [postId]: newImages });
  };

  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa bình luận này?")) return;

    try {
      await postsService.deleteComment(postId, commentId);
      const updatedPosts = await postsService.getEventPosts(eventId);
      setPosts(updatedPosts);
    } catch (err) {
      alert(err.response?.data?.message || "Không thể xóa bình luận");
    }
  };

  const canDeletePost = (post) => {
    if (!post || !post.user) return false;
    return (
      post.user._id === currentUser?._id ||
      currentUser?.role === "admin" ||
      currentUser?.role === "event_manager"
    );
  };

  const canDeleteComment = (comment) => {
    if (!comment || !comment.user) return false;
    return (
      comment.user._id === currentUser?._id ||
      currentUser?.role === "admin" ||
      currentUser?.role === "event_manager"
    );
  };

  const isLiked = (post) => {
    if (!post || !post.likes) return false;
    return post.likes.some((like) => like._id === currentUser?._id);
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

  const getUserName = (user) => {
    return user?.username || user?.fullName || user?.name || "Unknown";
  };

  const getUserInitial = (user) => {
    const name = getUserName(user);
    return name.charAt(0).toUpperCase();
  };

  if (loading) {
    return (
      <div className="discussion-loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="discussion-error">
        <div className="error-icon">⚠️</div>
        <h2>Không thể truy cập</h2>
        <p>{error}</p>
        <button
          onClick={() => history.push("/my-events")}
          className="back-button"
        >
          Quay lại sự kiện của tôi
        </button>
      </div>
    );
  }

  return (
    <div className="discussion-channel">
      <div className="discussion-header">
        <button onClick={() => history.push("/my-events")} className="back-btn">
          ← Quay lại
        </button>
        <div className="discussion-title">
          <h1>Kênh Trao Đổi</h1>
          <p className="event-name">{event?.title}</p>
        </div>
      </div>

      <div className="discussion-container">
        {/* Posts List */}
        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>Chưa có bài viết nào trong sự kiện này.</p>
            </div>
          ) : (
            posts.map((post) => (
              <div key={post._id} className="post-card">
                {/* Post Header */}
                <div className="post-header">
                  <div className="post-author">
                    <div className="user-avatar">
                      {getUserInitial(post.user)}
                    </div>
                    <div className="author-info">
                      <h4>{getUserName(post.user)}</h4>
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
                          onClick={() => setSelectedImage(image)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="post-actions">
                  <button
                    onClick={() => handleToggleLike(post._id)}
                    className={`like-btn ${isLiked(post) ? "liked" : ""}`}
                  >
                    {isLiked(post) ? "❤️" : "🤍"} {post.likes?.length || 0}
                  </button>
                  <span className="comment-count">
                    💬 {post.comments?.length || 0} bình luận
                  </span>
                </div>

                {/* Comments Section */}
                <div className="comments-section">
                  {post.comments &&
                    post.comments.map((comment) => (
                      <div key={comment._id} className="comment">
                        <div className="comment-avatar">
                          {getUserInitial(comment.user)}
                        </div>
                        <div className="comment-content">
                          <div className="comment-header">
                            <strong>{getUserName(comment.user)}</strong>
                            <span className="comment-time">
                              {formatDate(comment.createdAt)}
                            </span>
                          </div>
                          <p>{comment.content}</p>
                          {/* Comment Images */}
                          {comment.images && comment.images.length > 0 && (
                            <div className="comment-images">
                              {comment.images.map((image, index) => (
                                <img
                                  key={index}
                                  src={image}
                                  alt={`Comment image ${index + 1}`}
                                  className="comment-image"
                                  onClick={() => setSelectedImage(image)}
                                />
                              ))}
                            </div>
                          )}
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
                      {getUserInitial(currentUser)}
                    </div>
                    <div className="comment-input-wrapper">
                      {/* Preview uploaded images */}
                      {commentImages[post._id] &&
                        commentImages[post._id].length > 0 && (
                          <div className="comment-image-preview">
                            {commentImages[post._id].map((image, index) => (
                              <div
                                key={index}
                                className="preview-image-container"
                              >
                                <img
                                  src={image}
                                  alt={`Preview ${index + 1}`}
                                  className="preview-image"
                                />
                                <button
                                  onClick={() =>
                                    removeCommentImage(post._id, index)
                                  }
                                  className="remove-preview-btn"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      <div className="comment-input-group">
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
                        <label
                          htmlFor={`comment-image-${post._id}`}
                          className="image-upload-btn"
                          title="Thêm ảnh"
                        >
                          📷
                        </label>
                        <input
                          type="file"
                          id={`comment-image-${post._id}`}
                          accept="image/*"
                          multiple
                          onChange={(e) =>
                            handleCommentImageUpload(post._id, e)
                          }
                          style={{ display: "none" }}
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
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="image-modal" onClick={() => setSelectedImage(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Full size" className="modal-image" />
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

      {/* Access Denied Modal */}
      {showAccessDenied && (
        <div
          className="access-denied-modal"
          onClick={() => setShowAccessDenied(false)}
        >
          <div
            className="access-denied-content"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="access-denied-icon">🔒</div>
            <h2>Bạn cần tham gia sự kiện này để đăng bài</h2>
            <p>
              Vui lòng đăng ký tham gia sự kiện và chờ được phê duyệt để có thể
              tham gia thảo luận.
            </p>
            <div className="access-denied-buttons">
              <button
                className="btn-view-event"
                onClick={() => history.push("/events")}
              >
                Tìm sự kiện
              </button>
              <button
                className="btn-close"
                onClick={() => setShowAccessDenied(false)}
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiscussionChannel;
