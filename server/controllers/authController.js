const bcrypt = require('bcryptjs');
const { validateRegister, validateLogin } = require('../config/validators');
const messages = require('../config/messages');
const userStore = require('../services/userStore');
const { signToken } = require('../middlewares/authMiddleware');
const { asyncHandler } = require('../middlewares/asyncHandler');
const { createError } = require('../middlewares/httpError');

function reject(res, errors) {
  const message = Object.values(errors)[0];
  return res.status(400).json({ message, errors });
}

const register = asyncHandler(async (req, res) => {
  const { errors, value } = validateRegister(req.body);
  if (Object.keys(errors).length) return reject(res, errors);

  const passwordHash = await bcrypt.hash(value.password, 10);
  const user = await userStore.create({ ...value, passwordHash });
  const token = signToken(user);
  res.status(201).json({ token, user: userStore.toPublic(user) });
});

const login = asyncHandler(async (req, res) => {
  const { errors, value } = validateLogin(req.body);
  if (Object.keys(errors).length) return reject(res, errors);

  const user = await userStore.findByEmail(value.email);
  if (!user) {
    throw createError(401, messages.auth.userNotFound, { email: messages.auth.userNotFound });
  }
  const matches = await bcrypt.compare(value.password, user.passwordHash);
  if (!matches) {
    throw createError(401, messages.auth.passwordIncorrect, { password: messages.auth.passwordIncorrect });
  }
  const token = signToken(user);
  res.json({ token, user: userStore.toPublic(user) });
});

const me = asyncHandler(async (req, res) => {
  const user = await userStore.findById(req.user.id);
  if (!user) throw createError(401, messages.auth.tokenInvalid);
  res.json({ user: userStore.toPublic(user) });
});

module.exports = { register, login, me };
