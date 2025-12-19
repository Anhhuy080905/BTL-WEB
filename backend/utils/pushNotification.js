const webpush = require("web-push");
const User = require("../models/User.js");

webpush.setVapidDetails(
  'mailto:your-email@example.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// Gửi thông báo tới một subscription
const sendNotification = async (subscription, title, body, data = {}) => {
  const payload = JSON.stringify({ title, body, ...data });

  try {
    await webpush.sendNotification(subscription, payload);
    console.log("Push sent:", title);
  } catch (error) {
    console.error("Push error:", error);

    if (error.statusCode === 410 || error.statusCode === 404) {
      return { expired: true };
    }
    throw error;
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
    if (!user?.pushSubscriptions) return;

    const payload = {
      title,
      body,
      icon: "/logo192.png",
      badge: "/logo192.png",
      data: url ? { url } : undefined,
    };

    const result = await sendNotification(user.pushSubscriptions, payload);

    // Nếu subscription expired → xóa
    if (result?.expired) {
      await User.findByIdAndUpdate(userId, {
        $set: { pushSubscriptions: null },
      });
    }
  } catch (err) {
    console.error("sendPushToUser error:", err);
  }
};

module.exports = { sendNotification, sendToMany, sendPushToUser };
