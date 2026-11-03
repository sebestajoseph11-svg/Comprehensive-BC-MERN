import { useEffect, useRef, useState } from 'react';
import { amountPresets, cashoutPresets, trenballSides } from '../../config/game';
import { money } from '../../config/format';
import { useAuth } from '../../store/AuthProvider';
import { useGame, useLiveFrame } from '../../store/GameProvider';
import { useUi } from '../../store/UiProvider';
import Icon from '../icons/Icon';

export default function BetPanel() {
  const { user } = useAuth();
  const { openAuth, pushToast } = useUi();
  const {
    connected, phase, roundId, mode, myBet, myQueue, placeBet, cancelBet, cashout, commitHash, reveal,
  } = useGame();
  const frame = useLiveFrame();
  const [amount, setAmount] = useState('0.01');
  const [autoCashout, setAutoCashout] = useState('2');
  const [tab, setTab] = useState('manual');
  const [side, setSide] = useState('green');
  const [busy, setBusy] = useState(false);
  const [settings, setSettings] = useState(false);
  const [fair, setFair] = useState(false);
  const autoRound = useRef(null);
  const submitRef = useRef(null);
  const userRef = useRef(user);
  userRef.current = user;

  const target = Number(autoCashout);
  const chance = mode === 'classic' && target >= 1.01 ? Math.min(99, 99 / target).toFixed(1) : '—';
  const liveBet = myBet && myBet.status === 'in-play' && phase !== 'crashed';
  const queued = Boolean(myQueue);

  const setAmountValue = (value) => {
    const next = Math.max(0.01, Math.round(Number(value) * 100) / 100);
    setAmount(next.toFixed(2));
  };

  const submit = async () => {
    if (!connected) return;
    if (!user) {
      openAuth('login');
      return;
    }
    setBusy(true);
    try {
      if (liveBet && phase === 'running' && myBet.kind === 'classic') {
        await cashout();
      } else if (queued || liveBet) {
        await cancelBet();
      } else {
        await placeBet({
          amount: Number(amount),
          autoCashout: mode === 'classic' && autoCashout !== '' ? Number(autoCashout) : null,
          kind: mode === 'trenball' ? 'trenball' : 'classic',
          side: mode === 'trenball' ? side : null,
        });
      }
    } catch (error) {
      pushToast(error.message, 'bad');
    } finally {
      setBusy(false);
    }
  };

  submitRef.current = submit;

  useEffect(() => {
    if (tab !== 'auto' || !connected || phase !== 'waiting' || liveBet || queued) return undefined;
    if (autoRound.current === roundId) return undefined;
    const timer = setTimeout(() => {
      if (autoRound.current === roundId || !userRef.current) return;
      autoRound.current = roundId;
      submitRef.current?.();
    }, 700);
    return () => clearTimeout(timer);
  }, [tab, phase, roundId, connected, liveBet, queued]);

  let label = 'Bet (Next Round)';
  if (!connected) label = 'Connecting...';
  else if (liveBet && phase === 'running' && myBet.kind === 'classic') {
    label = `Cash Out ${money(myBet.amount * frame.multiplier)}`;
  } else if (queued || liveBet) label = phase === 'waiting' ? 'Cancel' : 'Cancel (Next Round)';

  return (
    <div className="bet-panel">
      <div className="bet-tabs">
        <button type="button" className={tab === 'manual' ? 'on' : ''} onClick={() => setTab('manual')}>Manual</button>
        <button type="button" className={tab === 'auto' ? 'on' : ''} onClick={() => setTab('auto')}>Auto</button>
      </div>
      <button type="button" className="bet-go" disabled={busy || !connected} onClick={submit}>{label}</button>
      <div className="bet-grid">
        <div>
          <div className="field-label"><span>Amount</span><span>≈ {money(amount || 0)}</span></div>
          <div className="field-row">
            <label className="amount-box">
              <span>$</span>
              <input value={amount} inputMode="decimal" onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ''))} />
            </label>
            <button type="button" onClick={() => setAmountValue(Number(amount) / 2)}>1/2</button>
            <button type="button" onClick={() => setAmountValue(Number(amount) * 2)}>2×</button>
          </div>
          <div className="presets">
            {amountPresets.map((preset) => (
              <button key={preset.label} type="button" className={Number(amount) === preset.value ? 'on' : ''} onClick={() => setAmountValue(preset.value)}>
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        {mode === 'classic' ? (
          <div>
            <div className="field-label">
              <span>Auto cash out</span>
              <span>Chance {chance}{chance === '—' ? '' : '%'}</span>
            </div>
            <div className="field-row">
              <label className="amount-box grow">
                <input value={autoCashout} inputMode="decimal" onChange={(event) => setAutoCashout(event.target.value.replace(/[^\d.]/g, ''))} />
              </label>
              <button type="button" aria-label="Clear auto cash out" onClick={() => setAutoCashout('')}><Icon name="close" size={16} /></button>
              <button type="button" aria-label="Decrease" onClick={() => setAutoCashout((Number(autoCashout || 1.01) - 0.1).toFixed(2))}>‹</button>
              <button type="button" aria-label="Increase" onClick={() => setAutoCashout((Number(autoCashout || 1) + 0.1).toFixed(2))}>›</button>
            </div>
            <div className="presets">
              {cashoutPresets.map((preset) => (
                <button key={preset.label} type="button" className={Number(autoCashout) === preset.value ? 'on' : ''} onClick={() => setAutoCashout(String(preset.value))}>
                  {preset.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="tren-sides">
            {trenballSides.map((item) => (
              <button key={item.id} type="button" className={side === item.id ? 'on' : ''} style={{ '--side': item.color }} onClick={() => setSide(item.id)}>
                <strong>{item.label}</strong>
                <span>{item.payout.toFixed(2)}×</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <button type="button" className="settings-btn" onClick={() => setSettings((value) => !value)}>
        Settings
        <em>New</em>
      </button>
      {settings && (
        <div className="settings-box">
          <p>Auto mode repeats your bet when a round is waiting. Cash out is manual unless an auto cash out is set.</p>
          <button type="button" onClick={() => setFair(true)}>Provably fair</button>
        </div>
      )}
      <div className="crash-meta">
        <button type="button" aria-label="Fairness" onClick={() => setFair(true)}><Icon name="shield" size={16} /></button>
        <button type="button" aria-label="Favorite"><Icon name="star" size={16} /></button>
        <span><Icon name="heart" size={16} /> 927</span>
        <button type="button" aria-label="Share"><Icon name="share" size={16} /></button>
      </div>
      {fair && (
        <div className="fair-box">
          <strong>Round commit</strong>
          <p>{commitHash || 'Waiting for the next commit hash.'}</p>
          {reveal?.serverSeed && (
            <>
              <strong>Last reveal {reveal.multiplier?.toFixed?.(2) || reveal.multiplier}×</strong>
              <p>Seed {reveal.serverSeed}</p>
            </>
          )}
          <button type="button" onClick={() => setFair(false)}>Close</button>
        </div>
      )}
    </div>
  );
}
