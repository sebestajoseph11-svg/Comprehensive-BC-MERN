const { GameEngine } = require('./engine');
const { userFromToken } = require('../middlewares/authMiddleware');
const messages = require('../config/messages');

let engine;

function getEngine() {
  if (!engine) {
    const error = new Error(messages.game.gameNotReady);
    error.status = 503;
    throw error;
  }
  return engine;
}

function initGame(io) {
  engine = new GameEngine(io);

  io.use(async (socket, next) => {
    socket.user = await userFromToken(socket.handshake.auth?.token);
    next();
  });

  io.on('connection', (socket) => {
    if (socket.user) {
      socket.join(`user:${socket.user.id}`);
      engine.track(socket.user.id, socket.id);
    }
    socket.emit('game:state', engine.publicState());
    socket.emit('game:mine', engine.mine(socket.user?.id));

    socket.on('game:bet', async (payload, ack) => {
      try {
        if (!socket.user) {
          ack?.({ ok: false, message: messages.auth.unauthorized });
          return;
        }
        const result = await engine.placeBet(socket.user, payload || {});
        ack?.({ ok: true, ...result });
      } catch (error) {
        ack?.({ ok: false, message: error.message, errors: error.errors });
      }
    });

    socket.on('game:cancel', async (_payload, ack) => {
      try {
        if (!socket.user) {
          ack?.({ ok: false, message: messages.auth.unauthorized });
          return;
        }
        const result = await engine.cancelBet(socket.user);
        ack?.({ ok: true, ...result });
      } catch (error) {
        ack?.({ ok: false, message: error.message, errors: error.errors });
      }
    });

    socket.on('game:cashout', async (_payload, ack) => {
      try {
        if (!socket.user) {
          ack?.({ ok: false, message: messages.auth.unauthorized });
          return;
        }
        const result = await engine.cashout(socket.user);
        ack?.({ ok: true, ...result });
      } catch (error) {
        ack?.({ ok: false, message: error.message, errors: error.errors });
      }
    });

    socket.on('disconnect', () => {
      if (socket.user) engine.untrack(socket.user.id, socket.id);
    });
  });

  engine.start();
  return engine;
}

module.exports = { initGame, getEngine };
