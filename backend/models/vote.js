const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
  candidateId: { type: String, required: true },
  castBy: { type: String, required: true }, // Address of voter
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Vote', voteSchema);
