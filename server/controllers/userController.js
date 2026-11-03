const { DEMO_PACKS } = require('../config/constants');
const messages = require('../config/messages');
const userStore = require('../services/userStore');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { createError } = require('../middlewares/httpError');

const demoCredit = asyncHandler(async (req, res) => {
  const amount = Number(req.body.amount);
  if (!DEMO_PACKS.includes(amount)) {
    throw createError(400, messages.wallet.invalidPack, { amount: messages.wallet.invalidPack });
  }
  const user = await userStore.adjustBalance(req.user.id, amount);
  res.json({ user, message: messages.wallet.demoAdded });
});

module.exports = { demoCredit };
