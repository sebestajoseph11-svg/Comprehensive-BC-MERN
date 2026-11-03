require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const { PORT } = require('./config/constants');
const { connectDB, getDbMode } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const gameRoutes = require('./routes/gameRoutes');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorMiddleware } = require('./middlewares/errorMiddleware');
const { initGame } = require('./game/sockets');

async function main() {
  await connectDB();
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, database: getDbMode() });
  });
  app.use('/api/auth', authRoutes);
  app.use('/api/game', gameRoutes);
  app.use('/api/users', userRoutes);
  app.use(notFound);
  app.use(errorMiddleware);

  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: '*' } });
  initGame(io);

  server.listen(PORT, () => {
    console.log(`API listening on http://localhost:${PORT} (${getDbMode()})`);
  });
}

main();
