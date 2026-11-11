import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isDonor: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; user?: User; error?: string }>;
  register: (data: any) => Promise<{ success: boolean; user?: User; error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; user?: User; error?: string }>;
  quickDemoLogin: (role: 'patient' | 'donor') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => authService.getCurrentUser());

  useEffect(() => {
    const handleStorageUpdate = () => {
      setCurrentUser(authService.getCurrentUser());
    };
    window.addEventListener('bloodbridge_storage_update', handleStorageUpdate);
    return () => window.removeEventListener('bloodbridge_storage_update', handleStorageUpdate);
  }, []);

  const login = async (email: string, pass: string) => {
    const res = authService.loginUser(email, pass);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const register = async (data: any) => {
    const res = authService.registerUser(data);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authService.logoutUser();
    setCurrentUser(null);
  };

  const updateProfile = async (updates: Partial<User>) => {
    if (!currentUser) return { success: false, error: 'Not logged in' };
    const res = authService.updateProfile(currentUser.id, updates);
    if (res.success && res.user) {
      setCurrentUser(res.user);
    }
    return res;
  };

  const quickDemoLogin = (role: 'patient' | 'donor') => {
    if (role === 'donor') {
      login('pooja.d@example.com', 'demo123');
    } else {
      login('arjun.sharma@example.com', 'demo123');
    }
  };

  const isDonor = !!currentUser?.isDonor || currentUser?.role === 'donor';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isDonor,
        login,
        register,
        logout,
        updateProfile,
        quickDemoLogin
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
