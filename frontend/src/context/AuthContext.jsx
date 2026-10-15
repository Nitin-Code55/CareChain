import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('carechain_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('carechain_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      if (token) {
        try {
          const res = await api.get('/users/me');
          setUser(res.data);
          localStorage.setItem('carechain_user', JSON.stringify(res.data));
        } catch (err) {
          console.error("Failed to fetch authenticated user profile", err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchMe();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token: jwtToken, user: userData } = res.data;
    localStorage.setItem('carechain_token', jwtToken);
    localStorage.setItem('carechain_user', JSON.stringify(userData));
    setToken(jwtToken);
    setUser(userData);
    return userData;
  };

  const register = async (registrationData) => {
    const res = await api.post('/auth/register', registrationData);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('carechain_token');
    localStorage.removeItem('carechain_user');
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    if (token) {
      try {
        const res = await api.get('/users/me');
        setUser(res.data);
        localStorage.setItem('carechain_user', JSON.stringify(res.data));
        return res.data;
      } catch (err) {
        console.error("Refresh user failed", err);
      }
    }
    return null;
  };

  const isPatient = user?.role === 'PATIENT';
  const isDoctor = user?.role === 'DOCTOR';
  const isAdmin = user?.role === 'ADMIN';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        refreshUser,
        isPatient,
        isDoctor,
        isAdmin,
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
