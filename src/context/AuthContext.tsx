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
  login: (credentials: {
    email: string;
    password?: string;
    requestAdminAccess?: boolean;
    adminPasscode?: string;
    role?: 'member' | 'admin' | 'superadmin';
    idToken?: string;
  }) => Promise<{ success: boolean; requiresAdmin2FA?: boolean; message?: string; error?: string }>;
  register: (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    department?: string;
    academicYear?: string;
    phone?: string;
    rollNumber?: string;
  }) => Promise<{ success: boolean; error?: string; message?: string }>;
  logout: () => Promise<void>;
  quickDemoLogin: (role: 'member' | 'admin' | 'superadmin') => Promise<void>;
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
    requestAdminAccess?: boolean;
    adminPasscode?: string;
    role?: 'member' | 'admin' | 'superadmin';
    idToken?: string;
  }) => {
    setIsLoading(true);
    const res = await api.auth.login(credentials);
    setIsLoading(false);

    // If 2FA challenge requested by backend
    if (res.requiresAdmin2FA) {
      return {
        success: false,
        requiresAdmin2FA: true,
        message: res.message || 'Admin 2FA verification required.',
      };
    }

    if (res.success && res.data?.token && res.data?.user) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.collegeId && res.data.user.role !== 'superadmin') {
        setCollegeId(res.data.user.collegeId);
      }
      return { success: true };
    }
    return {
      success: false,
      error: res.error || 'Login failed. Please check your credentials.',
    };
  };

  const register = async (formData: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    department?: string;
    academicYear?: string;
    phone?: string;
    rollNumber?: string;
  }) => {
    setIsLoading(true);
    const res = await api.auth.register(formData);
    setIsLoading(false);

    if (res.success && res.data?.token && res.data?.user) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.collegeId && res.data.user.role !== 'superadmin') {
        setCollegeId(res.data.user.collegeId);
      }
      return { success: true, message: res.message };
    }
    return {
      success: false,
      error: res.error || 'Registration failed. Please review your input.',
    };
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

  const quickDemoLogin = async (role: 'member' | 'admin' | 'superadmin') => {
    const email =
      role === 'superadmin'
        ? 'superadmin@nss-portal.gov.in'
        : role === 'admin'
        ? 'programme.officer@college.edu.in'
        : 'student@college.edu.in';
    await login({ email, role, requestAdminAccess: role === 'admin' || role === 'superadmin' });
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
        register,
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
