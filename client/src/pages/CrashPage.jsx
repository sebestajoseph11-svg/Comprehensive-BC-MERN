import BetPanel from '../components/crash/BetPanel';
import CrashChart from '../components/crash/CrashChart';
import CrashHistory from '../components/crash/CrashHistory';
import PlayersPanel from '../components/crash/PlayersPanel';
import { useGame } from '../store/GameProvider';

export default function CrashPage() {
  const { history, mode, setMode } = useGame();

  return (
    <div className="page crash-page">
      <section className="crash-board">
        <div className="crash-toolbar">
          <CrashHistory items={history} />
          <div className="mode-switch">
            <button type="button" className={mode === 'classic' ? 'on' : ''} onClick={() => setMode('classic')}>Classic</button>
            <button type="button" className={mode === 'trenball' ? 'on' : ''} onClick={() => setMode('trenball')}>Trenball</button>
          </div>
        </div>
        <CrashChart />
        <BetPanel />
      </section>
      <PlayersPanel />
    </div>
  );
}
