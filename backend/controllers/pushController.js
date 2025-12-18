// backend/controllers/pushController.js
const User = require('../models/User');
const auth = require('../middleware/auth');

const subscribePush = async (req, res) => {
  try {
    const { subscription } = req.body;
    await User.findByIdAndUpdate(req.user.id, { pushSubscriptions: subscription });
    res.status(201).json({ message: 'Subscribed!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const unsubscribePush = async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { $set: { pushSubscriptions: null } });
    res.json({ message: 'Unsubscribed!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { subscribePush, unsubscribePush }; 