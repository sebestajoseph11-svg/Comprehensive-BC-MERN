import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useUi } from '../../store/UiProvider';
import AuthModal from '../auth/AuthModal';
import DepositModal from '../wallet/DepositModal';
import SearchModal from '../search/SearchModal';
import BottomNav from './BottomNav';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppShell() {
  const { pathname } = useLocation();
  const { sidebarCompact, drawerOpen, setDrawerOpen, authMode, depositOpen, searchOpen } = useUi();
  const locked = drawerOpen || authMode || depositOpen || searchOpen;

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname, setDrawerOpen]);

  useEffect(() => {
    document.body.style.overflow = locked ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [locked]);

  return (
    <div className={`app ${sidebarCompact ? 'compact' : ''}`}>
      <Header />
      <div className="app-body">
        <Sidebar />
        <main className="main">
          <Outlet />
        </main>
      </div>
      <BottomNav />
      {drawerOpen && (
        <>
          <button type="button" className="drawer-backdrop" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />
          <Sidebar variant="drawer" />
        </>
      )}
      <AuthModal />
      <DepositModal />
      <SearchModal />
    </div>
  );
}
