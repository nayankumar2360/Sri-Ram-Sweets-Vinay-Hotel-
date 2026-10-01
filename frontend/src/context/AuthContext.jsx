import React, { createContext, useState, useEffect, useContext } from 'react';
import { getProfile, login as loginApi, register as registerApi } from '../api/auth';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await getProfile();
          const profileData = res.data?.data || res.data;
          setUser(profileData);
        } catch (error) {
          console.error('Failed to authenticate token', error);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (phoneOrCredentials, maybePassword) => {
    let credentials;
    if (typeof phoneOrCredentials === 'object' && phoneOrCredentials !== null) {
      credentials = phoneOrCredentials;
    } else {
      credentials = { phone: phoneOrCredentials, password: maybePassword };
    }
    const res = await loginApi(credentials);
    const token = res.data?.token || res.data?.data?.token;
    const userData = res.data?.user || res.data?.data?.user || res.data?.data;
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
    return {
      token,
      user: userData,
      ...res.data
    };
  };

  const register = async (data) => {
    const res = await registerApi(data);
    const token = res.data?.token || res.data?.data?.token;
    const userData = res.data?.user || res.data?.data?.user;
    if (token) {
      localStorage.setItem('token', token);
    }
    setUser(userData);
    return {
      token,
      user: userData,
      ...res.data
    };
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    window.location.href = '/';
  };

  const updateProfileContext = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated: !!user,
      isOwner: user?.role === 'owner',
      login,
      register,
      logout,
      updateProfile: updateProfileContext
    }}>
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
