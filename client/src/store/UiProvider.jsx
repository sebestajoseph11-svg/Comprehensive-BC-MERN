import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const UiContext = createContext(null);

export function UiProvider({ children }) {
  const [authMode, setAuthMode] = useState(null);
  const [depositOpen, setDepositOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sidebarCompact, setSidebarCompact] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = useCallback((message, tone = 'info') => {
    const id = crypto.randomUUID();
    setToasts((current) => [...current, { id, message, tone }]);
    setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id));
    }, 3600);
  }, []);

  const value = useMemo(() => ({
    authMode,
    openAuth: setAuthMode,
    closeAuth: () => setAuthMode(null),
    depositOpen,
    setDepositOpen,
    searchOpen,
    setSearchOpen,
    drawerOpen,
    setDrawerOpen,
    sidebarCompact,
    toggleSidebar: () => setSidebarCompact((value) => !value),
    toasts,
    pushToast,
  }), [authMode, depositOpen, searchOpen, drawerOpen, sidebarCompact, toasts, pushToast]);

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error('useUi must be used within UiProvider');
  return ctx;
}
