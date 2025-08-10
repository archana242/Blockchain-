const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  candidateId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    maxlength: 50
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 120
  },
  dob: {
    type: Date,
    required: true
  },
  party: {
    type: String,
    required: true,
    maxlength: 40
  },
  symbol: {
    type: String,
    required: true,
    enum: ['lotus', 'star', 'leaf']  // You can add more if needed
  },
  constituency: {
    type: String,
    default: null  // Assigned later in admin flow
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
