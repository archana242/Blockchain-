const express = require('express');
const router = express.Router();
const { castVote, getVoter } = require('../controllers/voterController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/cast', verifyToken, castVote);
router.get('/status', verifyToken, getVoter);

module.exports = router;