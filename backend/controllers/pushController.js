// backend/controllers/pushController.js
const User = require("../models/User");

const subscribePush = async (req, res) => {
  try {
    const { subscription } = req.body;

    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({
        success: false,
        message: "Subscription không hợp lệ",
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      pushSubscriptions: subscription,
    });

    console.log(`User ${req.user.id} subscribed to push notifications`);

    res.status(201).json({
      success: true,
      message: "Đã đăng ký nhận thông báo push!",
    });
  } catch (err) {
    console.error("Subscribe push error:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi đăng ký push notification",
      error: err.message,
    });
  }
};

const unsubscribePush = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, {
      $set: { pushSubscriptions: null },
    });

    console.log(`User ${req.user.id} unsubscribed from push notifications`);

    res.json({
      success: true,
      message: "Đã hủy đăng ký thông báo push!",
    });
  } catch (err) {
    console.error("Unsubscribe push error:", err);
    res.status(500).json({
      success: false,
      message: "Lỗi khi hủy push notification",
      error: err.message,
    });
  }
};

module.exports = { subscribePush, unsubscribePush };
