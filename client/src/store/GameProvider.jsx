import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { GROWTH } from '../config/game';
import { useAuth } from './AuthProvider';

const GameContext = createContext(null);

export function GameProvider({ children }) {
  const { token, updateBalance } = useAuth();
  const updateBalanceRef = useRef(updateBalance);
  updateBalanceRef.current = updateBalance;
  const liveRef = useRef({
    phase: 'waiting',
    startedAt: 0,
    waitEndsAt: 0,
    crashPoint: null,
    skew: 0,
    roundId: 0,
  });
  const socketRef = useRef(null);
  const [mode, setMode] = useState('classic');
  const [snap, setSnap] = useState({
    connected: false,
    phase: 'waiting',
    roundId: 0,
    history: [],
    players: [],
    online: 0,
    wagered: 0,
    myBet: null,
    myQueue: null,
    commitHash: '',
    reveal: null,
  });

  const applyState = useCallback((payload) => {
    if (!payload) return;
    const hidePoint = payload.phase === 'running' || payload.phase === 'waiting';
    liveRef.current = {
      ...liveRef.current,
      phase: payload.phase ?? liveRef.current.phase,
      startedAt: payload.startedAt ?? liveRef.current.startedAt,
      waitEndsAt: payload.waitEndsAt ?? liveRef.current.waitEndsAt,
      crashPoint: hidePoint ? null : (payload.crashPoint ?? liveRef.current.crashPoint),
      skew: payload.serverNow ? payload.serverNow - Date.now() : liveRef.current.skew,
      roundId: payload.roundId ?? liveRef.current.roundId,
    };
    setSnap((prev) => ({
      ...prev,
      connected: true,
      phase: payload.phase ?? prev.phase,
      roundId: payload.roundId ?? prev.roundId,
      history: payload.history ?? prev.history,
      players: payload.players ?? prev.players,
      online: payload.online ?? prev.online,
      wagered: payload.wagered ?? prev.wagered,
      commitHash: payload.commitHash ?? prev.commitHash,
      reveal: payload.reveal ?? prev.reveal,
    }));
  }, []);

  useEffect(() => {
    const socket = io({ auth: { token }, transports: ['websocket', 'polling'] });
    socketRef.current = socket;
    socket.on('connect', () => setSnap((prev) => ({ ...prev, connected: true })));
    socket.on('disconnect', () => setSnap((prev) => ({ ...prev, connected: false })));
    socket.on('game:state', applyState);
    socket.on('game:crash', applyState);
    socket.on('game:tick', (payload) => {
      liveRef.current.skew = payload.serverNow - Date.now();
      liveRef.current.startedAt = payload.startedAt;
    });
    socket.on('game:mine', (payload) => {
      setSnap((prev) => ({ ...prev, myBet: payload.myBet, myQueue: payload.myQueue }));
    });
    socket.on('user:balance', ({ balance }) => updateBalanceRef.current(balance));
    return () => socket.disconnect();
  }, [token, applyState]);

  const emitAck = useCallback((event, payload) => new Promise((resolve, reject) => {
    const socket = socketRef.current;
    if (!socket?.connected) {
      reject(new Error('Connecting...'));
      return;
    }
    socket.timeout(8000).emit(event, payload ?? {}, (err, res) => {
      if (err || !res?.ok) reject(new Error(res?.message || 'Request failed'));
      else resolve(res);
    });
  }), []);

  const placeBet = useCallback((payload) => emitAck('game:bet', payload), [emitAck]);
  const cancelBet = useCallback(() => emitAck('game:cancel', {}), [emitAck]);
  const cashout = useCallback(() => emitAck('game:cashout', {}), [emitAck]);

  const value = useMemo(() => ({
    ...snap,
    mode,
    setMode,
    liveRef,
    placeBet,
    cancelBet,
    cashout,
  }), [snap, mode, placeBet, cancelBet, cashout]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}

export function useLiveFrame() {
  const { liveRef } = useGame();
  const [frame, setFrame] = useState({
    phase: 'waiting',
    multiplier: 1,
    countdown: 0,
    crashPoint: null,
  });

  useEffect(() => {
    let frameId;
    const loop = () => {
      const live = liveRef.current;
      const now = Date.now() + (live.skew || 0);
      let multiplier = 1;
      if (live.phase === 'running' && live.startedAt) {
        const elapsed = Math.max(0, now - live.startedAt);
        multiplier = Math.max(1, Math.exp(GROWTH * (elapsed / 1000)));
      } else if (live.phase === 'crashed' && live.crashPoint) {
        multiplier = live.crashPoint;
      }
      const countdown = live.phase === 'waiting' ? Math.max(0, (live.waitEndsAt - now) / 1000) : 0;
      const nextMultiplier = Math.floor(multiplier * 100) / 100;
      setFrame((prev) => {
        if (
          prev.phase === live.phase
          && prev.multiplier === nextMultiplier
          && Math.abs(prev.countdown - countdown) < 0.05
        ) return prev;
        return { phase: live.phase, multiplier: nextMultiplier, countdown, crashPoint: live.crashPoint };
      });
      frameId = requestAnimationFrame(loop);
    };
    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [liveRef]);

  return frame;
}
