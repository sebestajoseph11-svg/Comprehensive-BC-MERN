import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../config/api';

const TOKEN_KEY = 'bc_token';
const USER_KEY = 'bc_user';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  });
  const [ready, setReady] = useState(!token);

  const persist = useCallback((nextToken, nextUser) => {
    setToken(nextToken || '');
    setUser(nextUser);
    if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken);
    else localStorage.removeItem(TOKEN_KEY);
    if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    else localStorage.removeItem(USER_KEY);
  }, []);

  const logout = useCallback(() => persist('', null), [persist]);

  const updateBalance = useCallback((balance) => {
    setUser((current) => {
      if (!current) return current;
      const next = { ...current, balance };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  useEffect(() => {
    if (!token) {
      setReady(true);
      return undefined;
    }
    let ignore = false;
    api('/auth/me', { token })
      .then((data) => {
        if (!ignore) persist(token, data.user);
      })
      .catch(() => {
        if (!ignore) logout();
      })
      .finally(() => {
        if (!ignore) setReady(true);
      });
    return () => {
      ignore = true;
    };
  }, [token, logout, persist]);

  const login = useCallback(async (body) => {
    const data = await api('/auth/login', { method: 'POST', body });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const register = useCallback(async (body) => {
    const data = await api('/auth/register', { method: 'POST', body });
    persist(data.token, data.user);
    return data.user;
  }, [persist]);

  const creditDemo = useCallback(async (amount) => {
    const data = await api('/users/demo-credit', { method: 'POST', token, body: { amount } });
    persist(token, data.user);
    return data;
  }, [persist, token]);

  const value = useMemo(() => ({
    token, user, ready, login, register, logout, updateBalance, creditDemo,
  }), [token, user, ready, login, register, logout, updateBalance, creditDemo]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
