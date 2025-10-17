import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { postsService } from "../services/postsService";
import { eventsService } from "../services/eventsService";
import "./discussion-channel.css";

const DiscussionChannel = () => {
  const { eventId } = useParams();
  const history = useHistory();
  const [event, setEvent] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
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
      console.error("Error fetching data:", err);
      setError(
        err.response?.data?.message ||
          "Bạn không có quyền truy cập kênh trao đổi này"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    try {
      const newPost = await postsService.createPost(eventId, {
        content: newPostContent,
      });
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
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };

  const handleAddComment = async (postId) => {
    const content = commentInputs[postId];
    if (!content?.trim()) return;

    try {
      const updatedPost = await postsService.addComment(postId, content);
      setPosts(posts.map((post) => (post._id === postId ? updatedPost : post)));
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
      const updatedPosts = await postsService.getEventPosts(eventId);
      setPosts(updatedPosts);
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
        {/* Create Post Form */}
        <div className="create-post-card">
          <div className="user-avatar">
            {currentUser?.name?.charAt(0).toUpperCase()}
          </div>
          <form onSubmit={handleCreatePost} className="create-post-form">
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
                {/* Post Header */}
                <div className="post-header">
                  <div className="post-author">
                    <div className="user-avatar">
                      {post.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="author-info">
                      <h4>{post.user.name}</h4>
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
                        {comment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="comment-content">
                        <div className="comment-header">
                          <strong>{comment.user.name}</strong>
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
      </div>
    </div>
  );
};

export default DiscussionChannel;
