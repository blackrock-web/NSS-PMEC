import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, getActiveCollegeId, setActiveCollegeId } from '../lib/api';
import type { User, Role } from '../types';

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isSuperadmin: boolean;
  collegeId: string;
  setCollegeId: (id: string) => void;
  login: (credentials: { email: string; password?: string; role?: 'admin' | 'superadmin'; idToken?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: 'admin' | 'superadmin') => Promise<void>;
  isLoading: boolean;
  isLoginOpen: boolean;
  openLogin: () => void;
  closeLogin: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getStoredToken());
  const [collegeId, setCollegeIdState] = useState<string>(getActiveCollegeId());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const openLogin = () => setIsLoginOpen(true);
  const closeLogin = () => setIsLoginOpen(false);

  const setCollegeId = (id: string) => {
    setCollegeIdState(id);
    setActiveCollegeId(id);
  };

  useEffect(() => {
    async function loadUser() {
      if (token) {
        try {
          const res = await api.auth.getMe();
          if (res.success && res.data?.user) {
            setUser(res.data.user);
            if (res.data.user.collegeId && res.data.user.role !== 'superadmin') {
              setCollegeId(res.data.user.collegeId);
            }
          } else {
            // Expired or invalid token
            setStoredToken(null);
            setToken(null);
            setUser(null);
          }
        } catch {
          setStoredToken(null);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    }
    loadUser();
  }, [token]);

  const login = async (credentials: {
    email: string;
    password?: string;
    role?: 'admin' | 'superadmin';
    idToken?: string;
  }) => {
    setIsLoading(true);
    const res = await api.auth.login(credentials);
    setIsLoading(false);

    if (res.success && res.data) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.collegeId && res.data.user.role !== 'superadmin') {
        setCollegeId(res.data.user.collegeId);
      }
      return { success: true };
    }
    return { success: false, error: res.error || 'Login failed' };
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      // ignore
    }
    setStoredToken(null);
    setToken(null);
    setUser(null);
  };

  const quickDemoLogin = async (role: 'admin' | 'superadmin') => {
    const email = role === 'superadmin' ? 'superadmin@nss-portal.gov.in' : 'programme.officer@college.edu.in';
    await login({ email, role });
  };

  const role: Role = user ? user.role : 'public';
  const isAuthenticated = Boolean(user && token);
  const isAdmin = role === 'admin' || role === 'superadmin';
  const isSuperadmin = role === 'superadmin';

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isAdmin,
        isSuperadmin,
        collegeId,
        setCollegeId,
        login,
        logout,
        quickDemoLogin,
        isLoading,
        isLoginOpen,
        openLogin,
        closeLogin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
