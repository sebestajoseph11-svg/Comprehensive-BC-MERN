const express = require('express');
const { demoCredit } = require('../controllers/userController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/demo-credit', protect, demoCredit);

module.exports = router;
