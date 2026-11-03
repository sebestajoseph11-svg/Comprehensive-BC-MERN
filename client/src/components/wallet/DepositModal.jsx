import { useState } from 'react';
import { depositPacks } from '../../config/game';
import { money } from '../../config/format';
import { useAuth } from '../../store/AuthProvider';
import { useUi } from '../../store/UiProvider';
import Modal from '../common/Modal';

export default function DepositModal() {
  const { depositOpen, setDepositOpen, openAuth, pushToast } = useUi();
  const { user, creditDemo } = useAuth();
  const [busy, setBusy] = useState(false);

  const add = async (amount) => {
    setBusy(true);
    try {
      const result = await creditDemo(amount);
      pushToast(result.message, 'ok');
      setDepositOpen(false);
    } catch (error) {
      pushToast(error.message, 'bad');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={depositOpen} title="Wallet" onClose={() => setDepositOpen(false)}>
      {user ? (
        <div className="wallet">
          <p className="demo-note">Play-money demo. These buttons add credits. They do not take a real deposit.</p>
          <div className="wallet-balance">
            <span>Balance</span>
            <strong>{money(user.balance)}</strong>
          </div>
          <div className="pack-grid">
            {depositPacks.map((amount) => (
              <button key={amount} type="button" className="pack" disabled={busy} onClick={() => add(amount)}>
                +{money(amount)}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="wallet">
          <p>Sign in to use a play-money balance.</p>
          <button type="button" className="btn btn-primary btn-block" onClick={() => { setDepositOpen(false); openAuth('signup'); }}>
            Sign Up
          </button>
        </div>
      )}
    </Modal>
  );
}
