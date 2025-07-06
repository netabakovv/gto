import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

const API_BASE_URL = 'http://localhost:8080';

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Session expired');

      const userData = await response.json();
      setCurrentUser({
        ...userData,
        isAdmin: userData.role === 'ADMIN',
        isJudge: userData.role === 'JUDGE'
      });
    } catch (error) {
      console.error('Auth error:', error);
      logout();
    }
  };

  const login = async (email, password) => {  // Изменил параметр username на email
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),  // Теперь отправляем email вместо username
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const data = await response.json();
      console.log(data)
      const user = {
        ...data.user,
        isAdmin: data.role === 'ADMIN',
        isJudge: data.role === 'JUDGE',
      };
      setCurrentUser(user);
      localStorage.setItem('token', data.token);
      localStorage.setItem('isAdmin', user.isAdmin);
      localStorage.setItem('isJudge', user.isJudge);
      return user;
    } catch (error) {
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("isAdmin")
    localStorage.removeItem("isJudge")
    setCurrentUser(null);
    setError(null);
  };

  const value = {
    currentUser,
    login,
    logout,
    loading,
    error,
    refreshUser: () => {
      const token = localStorage.getItem('token');
      if (token) return fetchUserData(token);
    }
  };

  return (
      <AuthContext.Provider value={value}>
        {!loading && children}
      </AuthContext.Provider>
  );
};