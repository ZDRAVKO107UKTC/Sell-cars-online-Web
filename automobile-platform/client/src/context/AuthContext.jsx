import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, loginUser, registerUser, updateCurrentUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('autobg_token');

      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.user);
      } catch (error) {
        localStorage.removeItem('autobg_token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    const response = await loginUser(credentials);
    localStorage.setItem('autobg_token', response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (payload) => {
    const response = await registerUser(payload);
    localStorage.setItem('autobg_token', response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem('autobg_token');
    setUser(null);
  };

  const refreshUser = async () => {
    const response = await getCurrentUser();
    setUser(response.user);
    return response.user;
  };

  const updateProfile = async (payload) => {
    const response = await updateCurrentUser(payload);
    setUser(response.user);
    return response.user;
  };

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider.');
  }

  return context;
}
