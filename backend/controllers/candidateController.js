const Candidate = require('../models/candidate');

// @desc    Add a new candidate
// @route   POST /api/candidate/add
// @access  Admin
const addCandidate = async (req, res) => {
  try {
    const { name, party, constituency } = req.body;

    // Basic validation
    if (!name || !party || !constituency) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create candidate
    const newCandidate = new Candidate({
      name,
      party,
      constituency
    });

    await newCandidate.save();

    return res.status(201).json({ message: 'Candidate added successfully', candidate: newCandidate });
  } catch (error) {
    console.error('Error adding candidate:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { addCandidate };
