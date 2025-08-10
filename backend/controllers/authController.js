const User = require('../models/User');

exports.register = async (req, res) => {
  const { address, role } = req.body;
  try {
    let existingUser = await User.findOne({ address });
    if (existingUser) {
      return res.status(400).json({ message: 'User already registered' });
    }
    const user = new User({ address, role });
    await user.save();
    res.status(201).json({ message: 'Registration successful', user });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

exports.getUserRole = async (req, res) => {
  const { address } = req.params;
  try {
    const user = await User.findOne({ address });
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ role: user.role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
