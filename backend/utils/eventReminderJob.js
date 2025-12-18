const cron = require('node-cron');
const Event = require('../models/Event');
const { sendPushToUser } = require('./pushNotification');

/**
 * Job để gửi push notification nhắc nhở sự kiện sắp diễn ra
 * Chạy mỗi giờ kiểm tra sự kiện sắp bắt đầu trong vòng 24 giờ
 */
const startEventReminderJob = () => {
  // Chạy mỗi giờ vào phút thứ 0
  cron.schedule('0 * * * *', async () => {
    try {
      console.log('[Event Reminder Job] Starting at', new Date());

      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Tìm các sự kiện sắp diễn ra trong 24 giờ tới và chưa gửi reminder
      const upcomingEvents = await Event.find({
        date: {
          $gte: now,
          $lte: in24Hours,
        },
        reminderSent: { $ne: true },
        status: 'upcoming',
      }).populate('participants.user', '_id pushSubscriptions');

      console.log(`[Event Reminder Job] Found ${upcomingEvents.length} upcoming events`);

      for (const event of upcomingEvents) {
        try {
          // Gửi reminder cho tất cả approved participants
          const approvedParticipants = event.participants.filter(
            (p) => p.status === 'approved' && p.user?.pushSubscriptions
          );

          console.log(
            `[Event Reminder Job] Sending reminder to ${approvedParticipants.length} participants for event: ${event.title}`
          );

          const hoursUntilEvent = Math.round((event.date - now) / (1000 * 60 * 60));
          const reminderMessage =
            hoursUntilEvent <= 1
              ? `Sự kiện "${event.title}" sắp bắt đầu! Hãy đến đúng giờ.`
              : `Sự kiện "${event.title}" sẽ bắt đầu trong ${hoursUntilEvent} giờ nữa.`;

          // Gửi push cho từng participant
          for (const participant of approvedParticipants) {
            try {
              await sendPushToUser(
                participant.user._id,
                '📢 Nhắc nhở sự kiện',
                reminderMessage
              );
            } catch (userError) {
              console.error(
                `[Event Reminder Job] Error sending reminder to user ${participant.user._id}:`,
                userError
              );
            }
          }

          // Đánh dấu event đã gửi reminder
          event.reminderSent = true;
          await event.save();

          console.log(
            `[Event Reminder Job] Successfully sent reminder for event: ${event.title}`
          );
        } catch (eventError) {
          console.error(
            `[Event Reminder Job] Error processing event ${event._id}:`,
            eventError
          );
        }
      }

      console.log('[Event Reminder Job] Completed at', new Date());
    } catch (error) {
      console.error('[Event Reminder Job] Error:', error);
    }
  });

  console.log('[Event Reminder Job] Scheduler started');
};

module.exports = { startEventReminderJob };
