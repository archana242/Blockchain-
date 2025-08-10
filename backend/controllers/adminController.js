const VoteModel = require('../models/Vote');
const User = require('../models/User');

exports.getAllVotes = async (req, res) => {
  try {
    const votes = await VoteModel.find();
    res.json(votes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

