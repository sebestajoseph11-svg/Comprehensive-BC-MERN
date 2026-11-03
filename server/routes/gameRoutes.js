const express = require('express');
const { state, placeBet, cashout, cancelBet } = require('../controllers/gameController');
const { protect, attachUser } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/state', attachUser, state);
router.post('/bet', protect, placeBet);
router.post('/cashout', protect, cashout);
router.post('/cancel', protect, cancelBet);

module.exports = router;
