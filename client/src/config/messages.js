export const messages = {
  auth: {
    emailRequired: 'Email is required',
    emailInvalid: 'Please enter a valid email address',
    passwordRequired: 'Password is required',
    passwordShort: 'Password must be at least 8 characters',
    passwordRules: 'Password must contain one upper letter, one number and one symbol',
    passwordIncorrect: 'Password is incorrect',
    confirmRequired: 'Please confirm your password',
    confirmMismatch: 'Passwords do not match',
    emailExists: 'An account with this email already exists',
    usernameRequired: 'Username is required',
    usernameInvalid: 'Username must be 3-16 characters and use letters or numbers',
    usernameTaken: 'Username is already taken',
    userNotFound: 'No account found with this email',
    unauthorized: 'Please sign in to continue',
    tokenExpired: 'Session expired. Please sign in again',
    tokenInvalid: 'Invalid session. Please sign in again',
  },
  game: {
    insufficientBalance: 'Insufficient balance',
    autoCashoutInvalid: 'Auto cash out must be at least 1.01',
    betAmountInvalid: 'Enter a valid bet amount',
  },
  wallet: {
    demoAdded: 'Play-money credited to your demo balance',
  },
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[A-Za-z0-9_]{3,16}$/;

export function validateRegister(body) {
  const errors = {};
  const username = (body.username || '').trim();
  const email = (body.email || '').trim();
  const password = body.password || '';
  const confirmPassword = body.confirmPassword || '';

  if (!username) errors.username = messages.auth.usernameRequired;
  else if (!usernamePattern.test(username)) errors.username = messages.auth.usernameInvalid;
  if (!email) errors.email = messages.auth.emailRequired;
  else if (!emailPattern.test(email)) errors.email = messages.auth.emailInvalid;
  if (!password) errors.password = messages.auth.passwordRequired;
  else if (password.length < 8) errors.password = messages.auth.passwordShort;
  else if (!/[A-Z]/.test(password) || !/\d/.test(password) || !/[^A-Za-z0-9]/.test(password)) {
    errors.password = messages.auth.passwordRules;
  }
  if (!confirmPassword) errors.confirmPassword = messages.auth.confirmRequired;
  else if (confirmPassword !== password) errors.confirmPassword = messages.auth.confirmMismatch;
  return errors;
}

export function validateLogin(body) {
  const errors = {};
  const email = (body.email || '').trim();
  const password = body.password || '';
  if (!email) errors.email = messages.auth.emailRequired;
  else if (!emailPattern.test(email)) errors.email = messages.auth.emailInvalid;
  if (!password) errors.password = messages.auth.passwordRequired;
  return errors;
}
