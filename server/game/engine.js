const crypto = require('crypto');
const {
  HOUSE_EDGE,
  GROWTH,
  WAIT_MS,
  CRASH_PAUSE_MS,
  MAX_CRASH,
  MIN_BET,
  MAX_BET,
  MIN_CASHOUT,
  MAX_CASHOUT,
  TRENBALL_PAYOUTS,
} = require('../config/constants');
const messages = require('../config/messages');
const userStore = require('../services/userStore');
const { createError } = require('../middlewares/httpError');

const BOT_NAMES = [
  'Comfortablytarn', 'Hidden', 'Zawii1010', 'agfrxonaaja', 'Obakalaka', 'Senku974',
  'NovaBite', 'LuckyMint', 'patilumesh', 'OrbitFox', 'QueenAce', 'MidnightBet',
  'GoldenPaw', 'Hidden', 'TurboMango', 'IvyStack', 'JokerLane', 'Hidden', 'CoralBet', 'PixelRind',
];

function round2(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

function multiplierFromElapsed(ms) {
  const next = Math.exp(GROWTH * (ms / 1000));
  return Math.max(1, Math.floor(next * 100) / 100);
}

function randomUnit() {
  return crypto.randomBytes(4).readUInt32BE(0) / 0xffffffff;
}

function nextCrashPoint() {
  const roll = randomUnit();
  if (roll <= HOUSE_EDGE) return 1;
  const raw = (1 - HOUSE_EDGE) / (1 - roll);
  return Math.min(MAX_CRASH, Math.max(1, Math.floor(raw * 100) / 100));
}

function commit(seed, roundId, crashPoint) {
  return crypto.createHash('sha256').update(`${seed}:${roundId}:${crashPoint}`).digest('hex');
}

class GameEngine {
  constructor(io) {
    this.io = io;
    this.roundId = 9756599;
    this.phase = 'waiting';
    this.crashPoint = 1;
    this.startedAt = 0;
    this.waitEndsAt = 0;
    this.multiplier = 1;
    this.history = [7.32, 1.17, 4.06, 1.39, 1.08, 1.14, 3.27, 2.19].map((multiplier, index) => ({
      roundId: 9756400 + index,
      multiplier,
      hash: null,
      serverSeed: null,
    }));
    this.bets = [];
    this.queue = [];
    this.serverSeed = '';
    this.commitHash = '';
    this.online = 1400;
    this.userSockets = new Map();
    this.locks = new Set();
    this.tickTimer = null;
    this.waitTimer = null;
    this.pauseTimer = null;
  }

  start() {
    this.beginWaiting();
  }

  track(userId, socketId) {
    if (!userId) return;
    if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
    this.userSockets.get(userId).add(socketId);
  }

  untrack(userId, socketId) {
    const set = this.userSockets.get(userId);
    if (!set) return;
    set.delete(socketId);
    if (!set.size) this.userSockets.delete(userId);
  }

  async withLock(userId, fn) {
    while (this.locks.has(userId)) {
      await new Promise((resolve) => setTimeout(resolve, 15));
    }
    this.locks.add(userId);
    try {
      return await fn();
    } finally {
      this.locks.delete(userId);
    }
  }

  beginWaiting() {
    this.phase = 'waiting';
    this.roundId += 1;
    this.crashPoint = nextCrashPoint();
    this.serverSeed = crypto.randomBytes(16).toString('hex');
    this.commitHash = commit(this.serverSeed, this.roundId, this.crashPoint);
    this.multiplier = 1;
    this.startedAt = 0;
    this.bets = this.queue.map((bet) => ({ ...bet, queued: false, status: 'in-play' }));
    this.queue = [];
    this.spawnBots();
    this.online = 1200 + Math.floor(Math.random() * 380);
    this.waitEndsAt = Date.now() + WAIT_MS;
    this.broadcast();
    clearTimeout(this.waitTimer);
    this.waitTimer = setTimeout(() => this.beginRunning(), WAIT_MS);
  }

  beginRunning() {
    if (this.phase !== 'waiting') return;
    this.phase = 'running';
    this.startedAt = Date.now();
    this.multiplier = 1;
    clearInterval(this.tickTimer);
    this.tickTimer = setInterval(() => this.tick(), 100);
    this.broadcast();
  }

  tick() {
    if (this.phase !== 'running') return;
    const multiplier = multiplierFromElapsed(Date.now() - this.startedAt);
    this.multiplier = multiplier;
    if (multiplier >= this.crashPoint || multiplier >= MAX_CRASH) {
      this.finishCrash();
      return;
    }
    let changed = false;
    for (const bet of this.bets) {
      if (bet.status !== 'in-play' || bet.kind !== 'classic' || !bet.autoCashout) continue;
      if (bet.autoCashout < this.crashPoint && multiplier >= bet.autoCashout) {
        this.markCashed(bet, bet.autoCashout);
        changed = true;
      }
    }
    this.io.emit('game:tick', {
      multiplier,
      startedAt: this.startedAt,
      serverNow: Date.now(),
      roundId: this.roundId,
    });
    if (changed) this.broadcast();
  }

  async finishCrash() {
    if (this.phase !== 'running') return;
    this.phase = 'crashed';
    clearInterval(this.tickTimer);
    this.multiplier = this.crashPoint;
    for (const bet of this.bets) {
      if (bet.status !== 'in-play') continue;
      if (bet.kind === 'trenball') {
        const win = this.trenballWins(bet.side, this.crashPoint);
        if (win) this.markCashed(bet, TRENBALL_PAYOUTS[bet.side]);
        else this.markLost(bet);
      } else {
        this.markLost(bet);
      }
    }
    const reveal = {
      roundId: this.roundId,
      multiplier: this.crashPoint,
      hash: this.commitHash,
      serverSeed: this.serverSeed,
    };
    this.history.unshift(reveal);
    this.history = this.history.slice(0, 20);
    this.io.emit('game:crash', { ...this.publicState(), reveal });
    this.broadcastMine();
    clearTimeout(this.pauseTimer);
    this.pauseTimer = setTimeout(() => this.beginWaiting(), CRASH_PAUSE_MS);
  }

  trenballWins(side, crashPoint) {
    if (side === 'red') return crashPoint < 2;
    if (side === 'green') return crashPoint >= 2;
    if (side === 'moon') return crashPoint >= 10;
    return false;
  }

  markCashed(bet, at) {
    bet.status = 'cashed';
    bet.cashedAt = round2(at);
    bet.payout = round2(bet.amount * at);
    bet.profit = round2(bet.payout - bet.amount);
    if (!bet.bot) {
      userStore.adjustBalance(bet.userId, bet.payout).then((user) => {
        this.io.to(`user:${bet.userId}`).emit('user:balance', { balance: user.balance });
      }).catch((error) => console.error('Payout failed', error.message));
    }
  }

  markLost(bet) {
    bet.status = 'lost';
    bet.cashedAt = null;
    bet.profit = round2(-bet.amount);
  }

  spawnBots() {
    const count = 12 + Math.floor(Math.random() * 5);
    for (let index = 0; index < count; index += 1) {
      const name = BOT_NAMES[Math.floor(Math.random() * BOT_NAMES.length)];
      const roll = Math.random();
      let amount = round2(Math.random() * 40 + 0.4);
      if (roll > 0.55) amount = round2(Math.random() * 280 + 20);
      if (roll > 0.86) amount = round2(Math.random() * 9000 + 400);
      this.bets.push({
        id: `bot-${this.roundId}-${index}`,
        userId: null,
        name,
        hidden: name === 'Hidden',
        amount,
        autoCashout: round2(1.15 + Math.random() * 6),
        kind: 'classic',
        side: null,
        status: 'in-play',
        cashedAt: null,
        profit: 0,
        bot: true,
      });
    }
  }

  publicPlayers() {
    return [...this.bets]
      .sort((a, b) => b.amount - a.amount)
      .map((bet) => ({
        id: bet.id,
        userId: bet.userId,
        name: bet.hidden ? 'Hidden' : bet.name,
        amount: bet.amount,
        cashedAt: bet.cashedAt,
        profit: bet.profit,
        status: bet.status,
        kind: bet.kind,
        side: bet.side,
      }));
  }

  wagered() {
    return round2(this.bets.reduce((sum, bet) => sum + bet.amount, 0));
  }

  publicState() {
    return {
      phase: this.phase,
      roundId: this.roundId,
      startedAt: this.startedAt,
      serverNow: Date.now(),
      waitEndsAt: this.waitEndsAt,
      multiplier: this.phase === 'crashed' ? this.crashPoint : this.multiplier,
      crashPoint: this.phase === 'crashed' ? this.crashPoint : null,
      history: this.history,
      players: this.publicPlayers(),
      online: this.online,
      wagered: this.wagered(),
      commitHash: this.commitHash,
    };
  }

  mine(userId) {
    if (!userId) return { myBet: null, myQueue: null };
    const current = this.bets.find((bet) => bet.userId === userId);
    const queued = this.queue.find((bet) => bet.userId === userId);
    return {
      myBet: current ? this.publicPlayers().find((bet) => bet.id === current.id) : null,
      myQueue: queued ? { id: queued.id, amount: queued.amount, autoCashout: queued.autoCashout, kind: queued.kind, side: queued.side } : null,
    };
  }

  broadcast() {
    this.io.emit('game:state', this.publicState());
    this.broadcastMine();
  }

  broadcastMine() {
    for (const [userId, sockets] of this.userSockets) {
      const payload = this.mine(userId);
      for (const socketId of sockets) this.io.to(socketId).emit('game:mine', payload);
    }
  }

  hasBet(userId) {
    const live = this.bets.find((bet) => bet.userId === userId);
    if (live && this.phase !== 'crashed') return true;
    return this.queue.some((bet) => bet.userId === userId);
  }

  normalizeBet(body = {}) {
    const amount = round2(body.amount);
    const kind = body.kind === 'trenball' ? 'trenball' : 'classic';
    const side = body.side || null;
    let autoCashout = body.autoCashout === null || body.autoCashout === '' || body.autoCashout === undefined
      ? null
      : round2(body.autoCashout);

    if (!Number.isFinite(amount)) {
      throw createError(400, messages.game.betAmountInvalid, { amount: messages.game.betAmountInvalid });
    }
    if (amount < MIN_BET) throw createError(400, messages.game.betTooSmall, { amount: messages.game.betTooSmall });
    if (amount > MAX_BET) throw createError(400, messages.game.betTooLarge, { amount: messages.game.betTooLarge });

    if (kind === 'classic' && autoCashout !== null) {
      if (!Number.isFinite(autoCashout) || autoCashout < MIN_CASHOUT || autoCashout > MAX_CASHOUT) {
        throw createError(400, messages.game.autoCashoutInvalid, { autoCashout: messages.game.autoCashoutInvalid });
      }
    } else {
      autoCashout = null;
    }

    if (kind === 'trenball' && !TRENBALL_PAYOUTS[side]) {
      throw createError(400, messages.game.trenballSideInvalid, { side: messages.game.trenballSideInvalid });
    }

    return { amount, kind, side: kind === 'trenball' ? side : null, autoCashout };
  }

  async placeBet(user, body) {
    return this.withLock(user.id, async () => {
      if (this.hasBet(user.id)) {
        throw createError(400, messages.game.alreadyBet, { amount: messages.game.alreadyBet });
      }
      const spec = this.normalizeBet(body);
      const fresh = await userStore.findById(user.id);
      if (!fresh) throw createError(401, messages.auth.unauthorized);
      if (fresh.balance < spec.amount) {
        throw createError(400, messages.game.insufficientBalance, { amount: messages.game.insufficientBalance });
      }
      const updated = await userStore.adjustBalance(user.id, -spec.amount);
      const bet = {
        id: crypto.randomUUID(),
        userId: user.id,
        name: fresh.username,
        hidden: false,
        amount: spec.amount,
        autoCashout: spec.autoCashout,
        kind: spec.kind,
        side: spec.side,
        status: 'in-play',
        cashedAt: null,
        profit: 0,
        bot: false,
      };
      const queued = this.phase !== 'waiting';
      if (queued) this.queue.push(bet);
      else this.bets.push(bet);
      this.io.to(`user:${user.id}`).emit('user:balance', { balance: updated.balance });
      this.broadcast();
      return { balance: updated.balance, queued, ...this.mine(user.id) };
    });
  }

  async cancelBet(user) {
    return this.withLock(user.id, async () => {
      const queueIndex = this.queue.findIndex((bet) => bet.userId === user.id);
      if (queueIndex >= 0) {
        const [bet] = this.queue.splice(queueIndex, 1);
        const updated = await userStore.adjustBalance(user.id, bet.amount);
        this.io.to(`user:${user.id}`).emit('user:balance', { balance: updated.balance });
        this.broadcast();
        return { balance: updated.balance, ...this.mine(user.id) };
      }
      if (this.phase !== 'waiting') throw createError(400, messages.game.cannotCancel);
      const index = this.bets.findIndex((bet) => bet.userId === user.id);
      if (index < 0) throw createError(400, messages.game.notInRound);
      const [bet] = this.bets.splice(index, 1);
      const updated = await userStore.adjustBalance(user.id, bet.amount);
      this.io.to(`user:${user.id}`).emit('user:balance', { balance: updated.balance });
      this.broadcast();
      return { balance: updated.balance, ...this.mine(user.id) };
    });
  }

  async cashout(user) {
    return this.withLock(user.id, async () => {
      if (this.phase !== 'running') throw createError(400, messages.game.roundNotRunning);
      const bet = this.bets.find((item) => item.userId === user.id);
      if (!bet) throw createError(400, messages.game.notInRound);
      if (bet.status !== 'in-play') throw createError(400, messages.game.alreadyCashed);
      if (bet.kind !== 'classic') throw createError(400, messages.game.roundNotRunning);
      const multiplier = multiplierFromElapsed(Date.now() - this.startedAt);
      if (multiplier >= this.crashPoint) throw createError(400, messages.game.roundNotRunning);
      if (multiplier < MIN_CASHOUT) throw createError(400, messages.game.cashoutTooEarly);
      this.markCashed(bet, multiplier);
      this.broadcast();
      const fresh = await userStore.findById(user.id);
      return { balance: userStore.toPublic(fresh).balance, ...this.mine(user.id) };
    });
  }
}

module.exports = { GameEngine };
