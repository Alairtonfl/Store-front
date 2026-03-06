import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { login as loginService, logout as logoutService, fetchCurrentUser, User } from '../Services/AuthService';
import { useError } from './ErrorContext';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { showError } = useError();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      try {
        const currentUser = await fetchCurrentUser();
        setUser(currentUser);
      } catch (err: any) {
        const msg = err?.message || 'Erro ao carregar sessão';
        showError(msg);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginService(email, password);
      setUser(res);
    } catch (err: any) {
      setUser(null);
      const msg = err?.message || 'Erro ao fazer login';
      showError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutService();
      setUser(null);
    } catch (err: any) {
      const msg = err?.message || 'Erro ao sair';
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
