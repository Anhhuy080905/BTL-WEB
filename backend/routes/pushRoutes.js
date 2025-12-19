const express = require('express');
const router = express.Router();
const { subscribePush, unsubscribePush } = require('../controllers/pushController')
const { protect } = require('../middleware/auth')

router.use(protect)

router.post('/subscribe', subscribePush)

router.delete('/unsubscribe', unsubscribePush)

router.get('/vapid-public', (req, res) => {
  res.json({
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY
  })
})

router.post('/test', async (req, res) => {
  const { userId } = req.body;
  try {
    const payload = {
      title: 'Test Push Notification',
      body: '🎉 Push notification từ VolunteerHub đang hoạt động!',
      icon: '/logo192.png'
    };
    await sendPushNotification(userId, payload, 'test');
    res.json({ message: 'Test notification sent' });
  } catch (err) {
    console.error('Test push error:', err);
    res.status(500).json({ error: 'Test failed' });
  }
});

module.exports = router;