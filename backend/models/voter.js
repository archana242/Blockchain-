const mongoose = require('mongoose');

const voterSchema = new mongoose.Schema({
  address: { type: String, required: true, unique: true },
  hasVoted: { type: Boolean, default: false },
  vote: { type: mongoose.Schema.Types.ObjectId, ref: 'Vote' },
  zkProof: { type: String }, // Reference to the ZK proof or hash
});

module.exports = mongoose.model('Voter', voterSchema);
