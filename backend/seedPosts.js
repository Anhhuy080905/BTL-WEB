const mongoose = require("mongoose");
const Post = require("./models/Post");
const Event = require("./models/Event");
const User = require("./models/User");
require("dotenv").config();

const seedPosts = async () => {
  try {
    // Kết nối MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ Đã kết nối MongoDB");

    // Lấy một số events và users có sẵn
    const events = await Event.find().limit(3);
    const users = await User.find().limit(3);

    if (events.length === 0 || users.length === 0) {
      console.log("❌ Cần có ít nhất 1 event và 1 user trong database");
      process.exit(1);
    }

    console.log(`Tìm thấy ${events.length} events và ${users.length} users`);

    // Xóa posts cũ
    await Post.deleteMany({});
    console.log("🗑️  Đã xóa posts cũ");

    // Tạo posts mẫu
    const samplePosts = [
      {
        event: events[0]._id,
        user: users[0]._id,
        content:
          "Vừa tham gia hoạt động làm sạch bờ biển hôm nay! Cảm giác thật tuyệt với khi được đóng góp cho môi trường. Mọi người cùng tham gia nhé! 🏖️🌊",
        likes: [users[1]._id, users[2]._id],
        comments: [
          {
            user: users[1]._id,
            content: "Tuyệt vời quá! Mình cũng muốn tham gia lần sau!",
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 giờ trước
          },
          {
            user: users[2]._id,
            content: "Cảm ơn bạn đã đóng góp cho môi trường! 💚",
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 giờ trước
          },
        ],
        createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 giờ trước
      },
      {
        event: events[0]._id,
        user: users[1]._id,
        content:
          "Hôm nay thu gom được rất nhiều rác thải nhựa. Thật đau lòng khi thấy môi trường bị ô nhiễm như vậy. Chúng ta cần làm nhiều hơn nữa! 🌍",
        likes: [users[0]._id],
        comments: [
          {
            user: users[0]._id,
            content:
              "Đúng vậy! Hy vọng mọi người sẽ có ý thức hơn về môi trường.",
            createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
          },
        ],
        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 giờ trước
      },
      {
        event: events[1] ? events[1]._id : events[0]._id,
        user: users[2]._id,
        content:
          "Trồng cây xanh cho cộng đồng là một trải nghiệm tuyệt vời! Mỗi cái cây là một hy vọng cho tương lai xanh hơn. 🌳🌱",
        likes: [users[0]._id, users[1]._id],
        comments: [],
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 giờ trước
      },
      {
        event: events[0]._id,
        user: users[0]._id,
        content:
          "Cảm ơn tất cả mọi người đã nhiệt tình tham gia! Chúng ta đã làm sạch được hơn 200kg rác thải. Thành công rực rỡ! 🎉",
        likes: [users[1]._id, users[2]._id],
        comments: [
          {
            user: users[1]._id,
            content: "Tuyệt vời! Lần sau mình sẽ rủ thêm bạn bè tham gia!",
            createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 phút trước
          },
        ],
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 phút trước
      },
      {
        event: events[1] ? events[1]._id : events[0]._id,
        user: users[1]._id,
        content:
          "Đây là lần đầu tiên mình tham gia hoạt động tình nguyện. Cảm xúc thật khó tả, vừa mệt vừa vui. Ai cũng nên thử một lần! 😊",
        likes: [users[0]._id],
        comments: [
          {
            user: users[2]._id,
            content: "Chúc mừng bạn! Hy vọng bạn sẽ tiếp tục tham gia nhé!",
            createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 phút trước
          },
        ],
        createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 phút trước
      },
    ];

    // Populate user data cho posts
    const populatedPosts = [];
    for (const postData of samplePosts) {
      // Populate comments với user data
      const comments = [];
      for (const comment of postData.comments) {
        const user = await User.findById(comment.user);
        comments.push({
          user: comment.user,
          content: comment.content,
          createdAt: comment.createdAt,
        });
      }

      const post = new Post({
        event: postData.event,
        user: postData.user,
        content: postData.content,
        likes: postData.likes,
        comments: comments,
        createdAt: postData.createdAt,
      });

      await post.save();
      populatedPosts.push(post);
    }

    console.log(`✅ Đã tạo ${populatedPosts.length} posts mẫu`);

    // Hiển thị thông tin
    for (const post of populatedPosts) {
      const populatedPost = await Post.findById(post._id)
        .populate("user", "username fullName")
        .populate("event", "title");
      console.log(
        `- Post của ${
          populatedPost.user.username || populatedPost.user.fullName
        } trong event "${populatedPost.event.title}"`
      );
      console.log(
        `  Likes: ${post.likes.length}, Comments: ${post.comments.length}`
      );
    }

    console.log("\n🎉 Seed posts hoàn tất!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Lỗi:", error);
    process.exit(1);
  }
};

seedPosts();
