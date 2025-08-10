const router = require('express').Router();
const { addCandidate } = require('../controllers/candidateController');

// Route: POST /api/candidate/add
router.post('/add', addCandidate);

module.exports = router;
