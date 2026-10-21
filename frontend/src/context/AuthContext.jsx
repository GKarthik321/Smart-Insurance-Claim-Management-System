import { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { login as loginApi, register as registerApi } from '../api/endpoints';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('role');
    return token ? { token, username, role } : null;
  });

  const applySession = useCallback((data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('username', data.username);
    localStorage.setItem('role', data.role);
    setAuth({ token: data.token, username: data.username, role: data.role });
  }, []);

  const login = useCallback(async (username, password) => {
    const { data } = await loginApi(username, password);
    applySession(data);
    return data;
  }, [applySession]);

  const register = useCallback(async (payload) => {
    const { data } = await registerApi(payload);
    applySession(data);
    return data;
  }, [applySession]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setAuth(null);
  }, []);

  const value = useMemo(() => ({ auth, login, register, logout }), [auth, login, register, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
