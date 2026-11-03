import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { extraPages } from './config/navigation';
import CrashPage from './pages/CrashPage';
import ExplorePage from './pages/ExplorePage';
import HomePage from './pages/HomePage';
import SimplePage from './pages/SimplePage';
import { useUi } from './store/UiProvider';

function Toasts() {
  const { toasts } = useUi();
  return (
    <div className="toasts" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.tone}`}>{toast.message}</div>
      ))}
    </div>
  );
}

export default function App() {
  return (
    <>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/crash" element={<CrashPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/game/:slug" element={<SimplePage />} />
          {extraPages.map((page) => (
            <Route key={page.path} path={page.path} element={<SimplePage />} />
          ))}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toasts />
    </>
  );
}
