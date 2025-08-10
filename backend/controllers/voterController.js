const Voter = require('../models/Voter');
const Vote = require('../models/Vote');
const contract = require('../utils/contract'); // <-- Import smart contract

exports.getVoter = async (req, res) => {
  try {
    const voter = await Voter.findOne({ address: req.params.address });
    if (!voter) return res.status(404).json({ message: 'Voter not found' });
    res.json(voter);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.castVote = async (req, res) => {
  const { address, candidateId } = req.body;
  try {
    let voter = await Voter.findOne({ address });
    if (!voter || voter.hasVoted) {
      return res.status(403).json({ message: 'Vote not allowed' });
    }

    // ✅ Interact with Smart Contract here
    const tx = await contract.vote(candidateId);  // <- Call smart contract function
    await tx.wait(); // Wait for transaction to be confirmed

    // ✅ Save off-chain vote data
    const vote = new Vote({ candidateId, castBy: address });
    await vote.save();
    voter.vote = vote._id;
    voter.hasVoted = true;
    await voter.save();

    res.json({ message: 'Vote cast successfully', txHash: tx.hash });
  } catch (err) {
    console.error("Smart contract vote failed:", err);
    res.status(500).json({ error: err.message });
  }
};
