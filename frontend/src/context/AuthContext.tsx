import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, LoginPayload, RegisterPayload } from '../types/auth.types.js';
import { authApi } from '../api/authApi.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const DEFAULT_USER: User = {
  id: '000000000000000000000001',
  name: 'Document Author',
  email: 'author@docpad.local',
  companyName: 'My Enterprise Ltd',
  companyAddress: '100 Business Parkway, Suite 500',
  companyPhone: '+1 (555) 234-5678',
  companyEmail: 'contact@enterprise.com',
  companyWebsite: 'www.enterprise.com',
  createdAt: new Date().toISOString(),
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('docpad_user');
    return saved ? JSON.parse(saved) : DEFAULT_USER;
  });
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('docpad_token')
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchCurrentUser = useCallback(async () => {
    const storedToken = localStorage.getItem('docpad_token');
    if (!storedToken) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('docpad_user', JSON.stringify(res.data.user));
      }
    } catch (error) {
      console.warn('Failed to verify session token:', error);
      localStorage.removeItem('docpad_token');
      localStorage.removeItem('docpad_user');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (payload: LoginPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(payload);
      if (res.success && res.data) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('docpad_token', newToken);
        localStorage.setItem('docpad_user', JSON.stringify(newUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (payload: RegisterPayload) => {
    setIsLoading(true);
    try {
      const res = await authApi.register(payload);
      if (res.success && res.data) {
        const { token: newToken, user: newUser } = res.data;
        setToken(newToken);
        setUser(newUser);
        localStorage.setItem('docpad_token', newToken);
        localStorage.setItem('docpad_user', JSON.stringify(newUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('docpad_token');
    localStorage.removeItem('docpad_user');
    setToken(null);
    setUser(null);
  };

  const updateUser = async (updatedData: Partial<User>) => {
    const res = await authApi.updateProfile(updatedData);
    if (res.success && res.data.user) {
      setUser(res.data.user);
      localStorage.setItem('docpad_user', JSON.stringify(res.data.user));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
