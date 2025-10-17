const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getEventPosts,
  createPost,
  deletePost,
  toggleLike,
  addComment,
  deleteComment,
} = require("../controllers/postController");

// Tất cả routes đều cần authentication
router.use(protect);

// Posts
router.get("/event/:eventId", getEventPosts);
router.post("/event/:eventId", createPost);
router.delete("/:postId", deletePost);

// Likes
router.post("/:postId/like", toggleLike);

// Comments
router.post("/:postId/comments", addComment);
router.delete("/:postId/comments/:commentId", deleteComment);

module.exports = router;
