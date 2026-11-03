import { multiplier } from '../../config/format';

export default function CrashHistory({ items }) {
  return (
    <div className="history-row">
      {items.map((item) => (
        <div key={item.roundId} className={`history-chip ${item.multiplier >= 2 ? 'high' : 'low'}`}>
          <small>{item.roundId}</small>
          <strong>{multiplier(item.multiplier)}</strong>
        </div>
      ))}
    </div>
  );
}
