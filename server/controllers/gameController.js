const { asyncHandler } = require('../middlewares/asyncHandler');
const { getEngine } = require('../game/sockets');

const state = asyncHandler(async (req, res) => {
  const engine = getEngine();
  res.json({
    ...engine.publicState(),
    ...engine.mine(req.user?.id),
  });
});

const placeBet = asyncHandler(async (req, res) => {
  const result = await getEngine().placeBet(req.user, req.body);
  res.json(result);
});

const cashout = asyncHandler(async (req, res) => {
  const result = await getEngine().cashout(req.user);
  res.json(result);
});

const cancelBet = asyncHandler(async (req, res) => {
  const result = await getEngine().cancelBet(req.user);
  res.json(result);
});

module.exports = { state, placeBet, cashout, cancelBet };
