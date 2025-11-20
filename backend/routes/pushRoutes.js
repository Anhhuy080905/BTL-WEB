const express = require('express');
const router = express.Router();
const { subscribePush, unsubscribePush } = require('../controllers/pushController')

router.post('/subscribe', subscribePush)

router.delete('/unsubscribe', unsubscribePush)

router.get('/vapid-public', (req, res) => {
  res.send.json({
    vapidPublicKey: process.env.VAPID_PUBLIC_KEY
  })
})

router.get('/test', (req, res) => {
  res.json({ message: 'Notification route is working!' });
});

module.exports = router;