const Voter = require('../models/Voter');
const Vote = require('../models/Vote');

exports.verifyVoter = async (req, res) => {
  const { address } = req.body;
  try {
    const voter = await Voter.findOne({ address });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });
    res.json({ hasVoted: voter.hasVoted, zkProof: voter.zkProof });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
