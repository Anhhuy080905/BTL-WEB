const cron = require('node-cron');
const { checkUpcomingEvents } = require('../controllers/eventController');

/**
 * Cron job để gửi reminder cho events sắp diễn ra
 * Chạy mỗi giờ
 */
function startEventReminderJob() {
  console.log('🕐 Starting event reminder cron job...');
  cron.schedule('0 0 * * *', async () => {
    const now = new Date();
    console.log(`\n⏰ [${now.toISOString()}] Checking for upcoming events...`);
    
    try {
      const count = await checkUpcomingEvents();
      console.log(`✅ Processed ${count} upcoming events\n`);
    } catch (error) {
      console.error('❌ Error in event reminder job:', error);
    }
  });
  
  console.log('✅ Event reminder cron job started (runs every hour)');
}

/**
 * Cron job bổ sung: Reminder trước 24 giờ
 */
function startDailyReminderJob() {
  console.log('📅 Starting daily event reminder cron job...');
  
  // Chạy lúc 9:00 AM mỗi ngày
  cron.schedule('0 9 * * *', async () => {
    console.log('\n📅 Checking for events starting tomorrow...');
    
    try {
      const Event = require('../models/Event');
      const Registration = require('../models/Registration');
      const { sendPushToMultipleUsers, notificationTemplates } = require('../utils/pushNotification');
      
      const now = new Date();
      const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      const dayAfterTomorrow = new Date(now.getTime() + 48 * 60 * 60 * 1000);
      
      const tomorrowEvents = await Event.find({
        startDate: {
          $gte: tomorrow,
          $lt: dayAfterTomorrow
        },
        dailyReminderSent: { $ne: true },
        status: 'published'
      });
      
      for (const event of tomorrowEvents) {
        const registrations = await Registration.find({
          eventId: event._id,
          status: 'approved'
        }).select('userId');
        
        if (registrations.length > 0) {
          const userIds = registrations.map(r => r.userId.toString());
          
          await sendPushToMultipleUsers(
            userIds,
            notificationTemplates.eventReminder(event.name, '24 giờ')
          );
          
          event.dailyReminderSent = true;
          await event.save();
          
          console.log(`✅ Đã gửi daily reminder cho event: ${event.name}`);
        }
      }
      
      console.log(`✅ Processed ${tomorrowEvents.length} tomorrow events\n`);
    } catch (error) {
      console.error('❌ Error in daily reminder job:', error);
    }
  });
  
  console.log('✅ Daily reminder cron job started (runs at 9:00 AM daily)');
}

/**
 * Khởi động tất cả cron jobs
 */
function startAllReminderJobs() {
  startEventReminderJob();    // Mỗi giờ
  startDailyReminderJob();     // Mỗi ngày lúc 9 AM
}

module.exports = {
  startEventReminderJob,
  startDailyReminderJob,
  startAllReminderJobs
};