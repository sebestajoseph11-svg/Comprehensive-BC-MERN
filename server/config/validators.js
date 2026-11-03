const messages = require('./messages');
const { PASSWORD_MIN } = require('./constants');

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9_]{3,16}$/;

function clean(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function passwordError(password) {
  if (!password) return messages.auth.passwordRequired;
  if (password.length < PASSWORD_MIN) return messages.auth.passwordShort;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  if (!hasUpper || !hasNumber || !hasSymbol) return messages.auth.passwordRules;
  return '';
}

function validateRegister(body = {}) {
  const errors = {};
  const username = clean(body.username);
  const email = clean(body.email).toLowerCase();
  const password = body.password || '';
  const confirmPassword = body.confirmPassword || '';

  if (!username) errors.username = messages.auth.usernameRequired;
  else if (!usernamePattern.test(username)) errors.username = messages.auth.usernameInvalid;

  if (!email) errors.email = messages.auth.emailRequired;
  else if (!emailPattern.test(email)) errors.email = messages.auth.emailInvalid;

  const pw = passwordError(password);
  if (pw) errors.password = pw;

  if (!confirmPassword) errors.confirmPassword = messages.auth.confirmRequired;
  else if (confirmPassword !== password) errors.confirmPassword = messages.auth.confirmMismatch;

  return { errors, value: { username, email, password } };
}

function validateLogin(body = {}) {
  const errors = {};
  const email = clean(body.email).toLowerCase();
  const password = body.password || '';

  if (!email) errors.email = messages.auth.emailRequired;
  else if (!emailPattern.test(email)) errors.email = messages.auth.emailInvalid;

  if (!password) errors.password = messages.auth.passwordRequired;

  return { errors, value: { email, password } };
}

module.exports = { validateRegister, validateLogin };
