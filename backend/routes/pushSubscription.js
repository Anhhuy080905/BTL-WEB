const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
const bodyParser = require('body-parser')

router.use(bodyParser.json())

// Subscribe to push notifications
router.post('/subscribe', auth, async (req, res) => {
  try {
    const subscription = req.body;
    
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'Đối tượng đăng ký không hợp lệ' });
    }

    const user = await User.findById(req.user._id);
    
    const existingIndex = user.pushSubscriptions.findIndex(
      sub => sub.endpoint === subscription.endpoint
    );
    
    if (existingIndex !== -1) {
      user.pushSubscriptions[existingIndex] = {
        ...subscription,
        userAgent: req.get('user-agent'),
        subscribedAt: new Date()
      };
    } else {
      user.pushSubscriptions.push({
        ...subscription,
        userAgent: req.get('user-agent'),
        subscribedAt: new Date()
      });
    }
    
    await user.save();
    
    res.json({ 
      message: 'Đăng ký thông báo thành công',
      subscriptionCount: user.pushSubscriptions.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Đăng ký thông báo thất bại' });
  }
});

router.delete('/unsubscribe', auth, async (req, res) => {
  try {
    const { endpoint } = req.body;
    
    if (!endpoint) {
      return res.status(400).json({ error: 'Yêu cầu endpoint' });
    }

    const user = await User.findById(req.user._id);
    
    user.pushSubscriptions = user.pushSubscriptions.filter(
      sub => sub.endpoint !== endpoint
    );
    
    await user.save();
    
    res.json({ 
      message: 'Hủy đăng ký thông báo thành công',
      subscriptionCount: user.pushSubscriptions.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Hủy đăng ký thông báo thất bại' });
  }
});

// Update push settings
router.patch('/settings', auth, async (req, res) => {
  try {
    const { enabled, registrationApproved, eventCompleted, newComment, upcomingEvent } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (enabled !== undefined) user.pushSettings.enabled = enabled;
    if (registrationApproved !== undefined) user.pushSettings.registrationApproved = registrationApproved;
    if (eventCompleted !== undefined) user.pushSettings.eventCompleted = eventCompleted;
    if (newComment !== undefined) user.pushSettings.newComment = newComment;
    if (upcomingEvent !== undefined) user.pushSettings.upcomingEvent = upcomingEvent;
    
    await user.save();
    
    res.json({ 
      message: 'Cập nhật push settings thành công',
      settings: user.pushSettings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Cập nhật push settings thất bại' });
  }
});

// Get VAPID public key
// router.get('/vapid-public-key', (req, res) => {
//   res.json({ publicKey: process.env.VAPID_PUBLIC_KEY });
// });

module.exports = router;