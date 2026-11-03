const messages = require('../config/messages');

function notFound(req, res) {
  res.status(404).json({ message: messages.general.notFound });
}

function errorMiddleware(err, req, res, next) {
  const status = err.status || 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    message: status >= 500 ? messages.general.serverError : err.message || messages.general.serverError,
    ...(err.errors ? { errors: err.errors } : {}),
  });
}

module.exports = { notFound, errorMiddleware };
