const express = require('express');
const router = express.Router();
const { getAllVotes, verifyVoter, createElection } = require('../controllers/adminController');
const { verifyToken, isAdmin } = require('../middleware/authMiddleware');

router.get('/votes', verifyToken, isAdmin, getAllVotes);
router.post('/verify-voter', verifyToken, isAdmin, verifyVoter);
router.post('/election', verifyToken, isAdmin, createElection);

module.exports = router;