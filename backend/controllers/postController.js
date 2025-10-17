const Post = require("../models/Post");
const Event = require("../models/Event");

// Kiểm tra quyền truy cập kênh trao đổi
const checkDiscussionAccess = async (userId, eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Không tìm thấy sự kiện");
  }

  // Kiểm tra xem user có phải là người tạo event hoặc đã được approve
  const isCreator = event.createdBy.toString() === userId.toString();
  const participant = event.participants.find(
    (p) =>
      (p.user._id || p.user).toString() === userId.toString() &&
      p.status === "approved"
  );

  if (!isCreator && !participant) {
    throw new Error(
      "Bạn cần được phê duyệt tham gia sự kiện để truy cập kênh trao đổi"
    );
  }

  return true;
};

// Lấy tất cả posts của một sự kiện
exports.getEventPosts = async (req, res) => {
  try {
    const { eventId } = req.params;

    // Kiểm tra quyền truy cập
    await checkDiscussionAccess(req.user._id, eventId);

    const posts = await Post.find({ event: eventId })
      .populate({
        path: "user",
        select: "fullName username email",
      })
      .populate({
        path: "likes",
        select: "fullName username",
      })
      .populate({
        path: "comments.user",
        select: "fullName username email",
      })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    console.log("Posts found:", posts.length);
    if (posts.length > 0) {
      console.log("Sample post:", JSON.stringify(posts[0], null, 2));
    }

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error("Error getting event posts:", error);
    res.status(error.message.includes("quyền") ? 403 : 500).json({
      success: false,
      message: error.message || "Không thể tải bài viết",
    });
  }
};

// Tạo post mới
exports.createPost = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { content, images } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nội dung không được để trống",
      });
    }

    // Kiểm tra quyền truy cập
    await checkDiscussionAccess(req.user._id, eventId);

    const post = await Post.create({
      event: eventId,
      user: req.user._id,
      content,
      images: images || [],
    });

    await post.populate({
      path: "user",
      select: "fullName username email",
    });

    console.log("Created post with user:", post.user);

    res.status(201).json({
      success: true,
      message: "Đã tạo bài viết thành công",
      data: post,
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(error.message.includes("quyền") ? 403 : 500).json({
      success: false,
      message: error.message || "Không thể tạo bài viết",
    });
  }
};

// Xóa post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    // Chỉ người tạo hoặc admin/event_manager mới có thể xóa
    if (
      post.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "event_manager"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa bài viết này",
      });
    }

    await post.deleteOne();

    res.json({
      success: true,
      message: "Đã xóa bài viết",
    });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa bài viết",
    });
  }
};

// Like/Unlike post
exports.toggleLike = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    const likeIndex = post.likes.indexOf(req.user._id);

    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate([
      { path: "user", select: "fullName username email" },
      { path: "likes", select: "fullName username" },
      { path: "comments.user", select: "fullName username email" },
    ]);

    res.json({
      success: true,
      message: likeIndex > -1 ? "Đã bỏ thích" : "Đã thích",
      data: post,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Không thể thực hiện",
    });
  }
};

// Thêm comment
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nội dung comment không được để trống",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    post.comments.push({
      user: req.user._id,
      content,
    });

    await post.save();
    await post.populate([
      { path: "user", select: "fullName username email" },
      { path: "likes", select: "fullName username" },
      { path: "comments.user", select: "fullName username email" },
    ]);

    res.json({
      success: true,
      message: "Đã thêm bình luận",
      data: post,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    res.status(500).json({
      success: false,
      message: "Không thể thêm bình luận",
    });
  }
};

// Xóa comment
exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bài viết",
      });
    }

    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy bình luận",
      });
    }

    // Chỉ người tạo comment hoặc admin/event_manager mới có thể xóa
    if (
      comment.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "event_manager"
    ) {
      return res.status(403).json({
        success: false,
        message: "Bạn không có quyền xóa bình luận này",
      });
    }

    comment.deleteOne();
    await post.save();

    res.json({
      success: true,
      message: "Đã xóa bình luận",
    });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({
      success: false,
      message: "Không thể xóa bình luận",
    });
  }
};
