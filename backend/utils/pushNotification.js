const webpush = require("web-push");
const User = require("../models/User.js");

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Gửi thông báo tới một subscription
const sendNotification = async (subscription, title, body, data = {}) => {
  const payload = JSON.stringify({ title, body, ...data });

  try {
    await webpush.sendNotification(subscription, payload);
    // Bỏ log thành công
  } catch (error) {
    // Bỏ qua lỗi push notification (không log)
    if (error.statusCode === 410 || error.statusCode === 404) {
      return { expired: true };
    }
    // Không throw error nữa để tránh hiển thị lỗi
    return { expired: false, error: true };
  }
  return { expired: false };
};

// Gửi cho nhiều user
const sendToMany = async (subscriptions, title, body, data = {}) => {
  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      sendNotification(sub.subscription, title, body, data)
    )
  );

  const expiredIndices = results
    .map((r, i) => (r.status === "fulfilled" && r.value.expired ? i : -1))
    .filter((i) => i !== -1);

  return expiredIndices;
};

const sendPushToUser = async (userId, title, body, url = null) => {
  try {
    const user = await User.findById(userId).select("pushSubscriptions");
    if (!user?.pushSubscriptions) {
      console.log(`No push subscription for user ${userId}`);
      return;
    }

    const data = {
      icon: "/logo192.png",
      badge: "/logo192.png",
      url: url || undefined,
    };

    console.log(`Sending push to user ${userId}: ${title}`);
    const result = await sendNotification(user.pushSubscriptions, title, body, data);

    // Nếu subscription expired → xóa
    if (result?.expired) {
      await User.findByIdAndUpdate(userId, {
        $set: { pushSubscriptions: null },
      });
    }
  } catch (err) {
    console.error("Push notification error:", err.message);
  }
};

module.exports = { sendNotification, sendToMany, sendPushToUser };
