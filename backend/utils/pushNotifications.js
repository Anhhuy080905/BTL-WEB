const webpush = require('web-push')

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.end.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
)

const sendPushNotification = async(subscription, payload) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload))
        return { success: true}
    } catch (error) {
        console.error(error)
        if (error.statusCode === 410 || error.statusCode === 404) {
            return { success: False, expired: True }
        }

        return { success: false }
    }
}

const sendPushToUser = async (userId, notification) => {
  try {
    const User = require("../models/User")
    const user = await User.getUserById(userId)

    if (!user || !user.pushSubscriptions || user.pushSubscriptions.length === 0) {
      return { success: false, message: "Không tìm thấy đăng ký" }
    }

    // Check settings
    const notificationType = notification.type;
    if (!user.pushSettings.enabled || !user.pushSettings[notificationType]) {
      return {
        success: false,
        message: "Đã tắt cho loại thông báo này",
      }
    }

    const payload = {
      title: notification.title,
      body: notification.message,
      icon: "frontend/public/bell.png",
      data: {
        url: notification.link || "/",
        type: notification.type,
        ...notification.data,
      },
    };

    const results = await Promise.all(
      user.pushSubscriptions.map(async (subscription) => {
        const result = await sendPushNotification(subscription, payload);

        // Nếu subscription expired, xóa khỏi database
        if (result.expired) {
          user.pushSubscriptions = user.pushSubscriptions.filter(
            (sub) => sub.endpoint !== subscription.endpoint
          );
        }

        return result;
      })
    );

    // Lưu nếu có subscription bị xóa
    if (results.some((r) => r.expired)) {
      await user.save();
    }

    return {
      success: true,
      sent: results.filter((r) => r.success).length,
      failed: results.filter((r) => !r.success).length,
    };
  } catch (error) {
    console.log(error);
    return { success: false, error: error.message };
  }
};

const sendPushToUsers = async (userIds, notification) => {
  const results = await Promise.all(
    userIds.map(userId => sendPushToUser(userId, notification))
  );
  
  return {
    total: userIds.length,
    sent: results.filter(r => r.success).length,
    failed: results.filter(r => !r.success).length
  };
};

module.exports = {
  sendPushNotification,
  sendPushToUser,
  sendPushToUsers
};