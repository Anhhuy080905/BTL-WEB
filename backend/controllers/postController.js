const Post = require("../models/Post");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const { sendPushToUser } = require("../utils/pushNotification");

// Kiểm tra quyền truy cập kênh trao đổi
const checkDiscussionAccess = async (userId, eventId, userRole) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error("Không tìm thấy sự kiện");
  }

  // Admin và event_manager có thể xem tất cả kênh trao đổi
  if (userRole === "admin" || userRole === "event_manager") {
    return true;
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
    await checkDiscussionAccess(req.user._id, eventId, req.user.role);

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

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    res
      .status(
        error.message.includes("quyền") || error.message.includes("phê duyệt")
          ? 403
          : 500
      )
      .json({
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
    await checkDiscussionAccess(req.user._id, eventId, req.user.role);

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

    res.status(201).json({
      success: true,
      message: "Đã tạo bài viết thành công",
      data: post,
    });
  } catch (error) {
    res
      .status(
        error.message.includes("quyền") || error.message.includes("phê duyệt")
          ? 403
          : 500
      )
      .json({
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

      // Tạo thông báo cho chủ bài viết (nếu không phải tự like)
      if (post.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: post.user,
          type: "post_like",
          title: "Bài viết mới được thích",
          message: `${
            req.user.username || req.user.fullName
          } đã thích bài viết của bạn`,
          event: post.event,
          post: post._id,
          relatedUser: req.user._id,
          link: `/discussion-list?postId=${post._id}`,
        });
      }
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
    const { content, images, parentCommentId } = req.body;

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

    const newComment = {
      user: req.user._id,
      content,
      images: images || [],
    };

    post.comments.push(newComment);

    await post.save();

    const justAddedComment = post.comments[post.comments.length - 1];
    console.log("Comment saved with images:", justAddedComment.images);

    // Tạo thông báo cho chủ bài viết (nếu không phải tự comment)
    if (post.user.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: post.user,
        type: "post_comment",
        title: "Bài viết mới có bình luận",
        message: `${
          req.user.username || req.user.fullName
        } đã bình luận: "${content.substring(0, 50)}${
          content.length > 50 ? "..." : ""
        }"`,
        event: post.event,
        post: post._id,
        relatedUser: req.user._id,
        link: `/discussion-list?postId=${post._id}`,
      });

      // Gửi Web Push Notification
      await sendPushToUser(
        post.user,
        "💬 Có bình luận mới!",
        `${
          req.user.username || req.user.fullName
        } đã bình luận: "${content.substring(0, 50)}${
          content.length > 50 ? "..." : ""
        }"`,
        `/discussion-list?postId=${post._id}`
      );
    }

    await post.populate([
      { path: "user", select: "fullName username email" },
      { path: "likes", select: "fullName username" },
      { path: "comments.user", select: "fullName username email" },
    ]);

    console.log(
      "Post before sending:",
      JSON.stringify(post.comments[post.comments.length - 1], null, 2)
    );

    // Convert to plain object to ensure all fields are serialized
    const postObject = post.toObject();

    res.json({
      success: true,
      message: "Đã thêm bình luận",
      data: postObject,
    });
  } catch (error) {
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
    res.status(500).json({
      success: false,
      message: "Không thể xóa bình luận",
    });
  }
};

// Like/Unlike comment
exports.toggleCommentLike = async (req, res) => {
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

    const userId = req.user._id.toString();
    const likeIndex = comment.likes.findIndex(
      (like) => like.toString() === userId
    );

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(req.user._id);
    }

    await post.save();
    await post.populate([
      { path: "user", select: "fullName username email" },
      { path: "likes", select: "fullName username" },
      { path: "comments.user", select: "fullName username email" },
      { path: "comments.likes", select: "fullName username" },
      { path: "comments.replies.user", select: "fullName username email" },
    ]);

    const postObject = post.toObject();

    res.json({
      success: true,
      message: likeIndex > -1 ? "Đã bỏ thích" : "Đã thích",
      data: postObject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể thực hiện",
    });
  }
};

// Add reply to comment
exports.addReply = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { content, images = [] } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Nội dung trả lời không được để trống",
      });
    }

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

    comment.replies.push({
      user: req.user._id,
      content,
      images,
    });

    await post.save();
    await post.populate([
      { path: "user", select: "fullName username email" },
      { path: "likes", select: "fullName username" },
      { path: "comments.user", select: "fullName username email" },
      { path: "comments.likes", select: "fullName username" },
      { path: "comments.replies.user", select: "fullName username email" },
    ]);

    const postObject = post.toObject();

    res.json({
      success: true,
      message: "Đã thêm trả lời",
      data: postObject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Không thể thêm trả lời",
    });
  }
};
