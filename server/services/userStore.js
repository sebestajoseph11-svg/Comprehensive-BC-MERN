const crypto = require('crypto');
const User = require('../models/User');
const { getDbMode } = require('../config/db');
const { STARTING_BALANCE } = require('../config/constants');
const messages = require('../config/messages');
const { createError } = require('../middlewares/httpError');

const COLORS = ['#f1323c', '#24ee89', '#ffad00', '#3c8aff', '#a855f7', '#ff7ab6'];
const users = new Map();
const byEmail = new Map();
const byUsername = new Map();

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function colorFor(username) {
  const sum = [...username].reduce((total, char) => total + char.charCodeAt(0), 0);
  return COLORS[sum % COLORS.length];
}

function toPublic(user) {
  if (!user) return null;
  return {
    id: String(user.id || user._id),
    username: user.username,
    email: user.email,
    balance: round2(user.balance),
    avatarColor: user.avatarColor,
  };
}

async function create({ username, email, passwordHash }) {
  const avatarColor = colorFor(username);
  const balance = STARTING_BALANCE;

  if (getDbMode() !== 'mongo') {
    if (byEmail.has(email)) {
      throw createError(409, messages.auth.emailExists, { email: messages.auth.emailExists });
    }
    if (byUsername.has(username.toLowerCase())) {
      throw createError(409, messages.auth.usernameTaken, { username: messages.auth.usernameTaken });
    }
    const user = {
      id: crypto.randomUUID(),
      username,
      email,
      passwordHash,
      balance,
      avatarColor,
    };
    users.set(user.id, user);
    byEmail.set(email, user.id);
    byUsername.set(username.toLowerCase(), user.id);
    return user;
  }

  try {
    return await User.create({ username, email, passwordHash, balance, avatarColor });
  } catch (error) {
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        throw createError(409, messages.auth.emailExists, { email: messages.auth.emailExists });
      }
      throw createError(409, messages.auth.usernameTaken, { username: messages.auth.usernameTaken });
    }
    throw error;
  }
}

async function findByEmail(email) {
  if (getDbMode() !== 'mongo') {
    const id = byEmail.get(email);
    return id ? users.get(id) : null;
  }
  return User.findOne({ email });
}

async function findById(id) {
  if (!id) return null;
  if (getDbMode() !== 'mongo') return users.get(String(id)) || null;
  return User.findById(id);
}

async function adjustBalance(id, delta) {
  const change = round2(delta);
  if (getDbMode() !== 'mongo') {
    const user = users.get(String(id));
    if (!user) throw createError(404, messages.auth.userNotFound);
    const next = round2(user.balance + change);
    if (next < 0) {
      throw createError(400, messages.game.insufficientBalance, { amount: messages.game.insufficientBalance });
    }
    user.balance = next;
    return toPublic(user);
  }

  const query = change < 0 ? { _id: id, balance: { $gte: round2(-change) } } : { _id: id };
  const user = await User.findOneAndUpdate(query, { $inc: { balance: change } }, { new: true });
  if (!user) {
    const exists = await User.findById(id);
    if (!exists) throw createError(404, messages.auth.userNotFound);
    throw createError(400, messages.game.insufficientBalance, { amount: messages.game.insufficientBalance });
  }
  return toPublic(user);
}

module.exports = { create, findByEmail, findById, adjustBalance, toPublic, round2 };
