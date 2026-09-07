import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, getStoredToken, setStoredToken, getActiveCollegeId, setActiveCollegeId } from '../lib/api';
import type { User, Role } from '../types';

export interface Pending2FAState {
  email: string;
  role: Role;
  tempToken: string;
  isSuperAdmin2: boolean;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  role: Role;
  token: string | null;
  isAuthenticated: boolean;
  isCoordinator: boolean;
  isAdmin: boolean;
  isSuperAdmin1: boolean;
  isSuperAdmin2: boolean;
  canAccessAdminPortal: boolean;
  collegeId: string;
  setCollegeId: (id: string) => void;
  login: (credentials: {
    email: string;
    password: string;
  }) => Promise<{
    success: boolean;
    requiresAdmin2FA?: boolean;
    pending2FA?: Pending2FAState;
    message?: string;
    error?: string;
  }>;
  verify2FA: (data: {
    email: string;
    tempToken: string;
    totpCode: string;
    masterAuthKey?: string;
  }) => Promise<{ success: boolean; error?: string }>;
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
  demoSwitch: (role: Role) => Promise<boolean>;
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
            if (res.data.user.collegeId && !res.data.user.role.startsWith('super')) {
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

  const login = async (credentials: { email: string; password: string }) => {
    setIsLoading(true);
    const res = await api.auth.login(credentials);
    setIsLoading(false);

    // If 2FA challenge is issued for administrative accounts
    if (res.requiresAdmin2FA && res.data?.tempToken && res.data?.email) {
      return {
        success: false,
        requiresAdmin2FA: true,
        pending2FA: {
          email: res.data.email,
          role: res.data.role || 'admin',
          tempToken: res.data.tempToken,
          isSuperAdmin2: Boolean(res.data.isSuperAdmin2),
          message: res.message,
        },
        message: res.message || 'Two-factor TOTP authentication required.',
      };
    }

    if (res.success && res.data?.token && res.data?.user) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.collegeId && !res.data.user.role.startsWith('super')) {
        setCollegeId(res.data.user.collegeId);
      }
      return { success: true };
    }

    return {
      success: false,
      error: res.error || 'Login failed. Please verify your credentials.',
    };
  };

  const verify2FA = async (data: {
    email: string;
    tempToken: string;
    totpCode: string;
    masterAuthKey?: string;
  }) => {
    setIsLoading(true);
    const res = await api.auth.verify2FA(data);
    setIsLoading(false);

    if (res.success && res.data?.token && res.data?.user) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.collegeId && !res.data.user.role.startsWith('super')) {
        setCollegeId(res.data.user.collegeId);
      }
      return { success: true };
    }

    return {
      success: false,
      error: res.error || 'Invalid TOTP code or verification failed.',
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
      if (res.data.user.collegeId && !res.data.user.role.startsWith('super')) {
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

  const demoSwitch = async (targetRole: Role): Promise<boolean> => {
    setIsLoading(true);
    const res = await api.auth.demoSwitch(targetRole);
    setIsLoading(false);

    if (res.success && res.data?.token && res.data?.user) {
      setStoredToken(res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      if (res.data.user.collegeId && !res.data.user.role.startsWith('super')) {
        setCollegeId(res.data.user.collegeId);
      }
      return true;
    }
    return false;
  };

  const role: Role = user ? user.role : 'public';
  const isAuthenticated = Boolean(user && token);
  const isCoordinator = role === 'coordinator';
  const isAdmin = role === 'admin' || role === 'super_admin_1' || role === 'superadmin' || role === 'super_admin_2';
  const isSuperAdmin1 = role === 'super_admin_1' || role === 'superadmin' || role === 'super_admin_2';
  const isSuperAdmin2 = role === 'super_admin_2';
  const canAccessAdminPortal = isCoordinator || isAdmin || isSuperAdmin1 || isSuperAdmin2;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        token,
        isAuthenticated,
        isCoordinator,
        isAdmin,
        isSuperAdmin1,
        isSuperAdmin2,
        canAccessAdminPortal,
        collegeId,
        setCollegeId,
        login,
        verify2FA,
        register,
        logout,
        demoSwitch,
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
