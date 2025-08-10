const express = require('express');
const router = express.Router();
const { getAuditLogs, validateZKP } = require('../controllers/auditorController');
const { verifyToken, isAuditor } = require('../middleware/authMiddleware');

router.get('/logs', verifyToken, isAuditor, getAuditLogs);
router.post('/validate-zkp', verifyToken, isAuditor, validateZKP);

module.exports = router;