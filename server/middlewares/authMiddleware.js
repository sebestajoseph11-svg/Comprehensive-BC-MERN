const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/constants');
const messages = require('../config/messages');
const userStore = require('../services/userStore');
const { createError } = require('./httpError');

function signToken(user) {
  return jwt.sign({ id: String(user.id || user._id) }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

async function userFromToken(token) {
  if (!token) return null;
  try {
    const decoded = verifyToken(token);
    const user = await userStore.findById(decoded.id);
    return user ? userStore.toPublic(user) : null;
  } catch (error) {
    return null;
  }
}

async function protect(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(createError(401, messages.auth.unauthorized));
  try {
    const decoded = verifyToken(token);
    const user = await userStore.findById(decoded.id);
    if (!user) return next(createError(401, messages.auth.tokenInvalid));
    req.user = userStore.toPublic(user);
    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') return next(createError(401, messages.auth.tokenExpired));
    return next(createError(401, messages.auth.tokenInvalid));
  }
}

async function attachUser(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  req.user = await userFromToken(token);
  next();
}

module.exports = { signToken, verifyToken, protect, attachUser, userFromToken };
