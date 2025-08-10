const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  role: { type: String, enum: ['voter', 'admin', 'auditor'], required: true },
  registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
