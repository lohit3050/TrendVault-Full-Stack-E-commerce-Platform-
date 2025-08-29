import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }

    // Cleanup function
    return () => {
      // Any cleanup needed
    };
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/verify`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (error) {
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/login`, { email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Login failed' };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/register`, { name, email, password });
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      setUser(user);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Registration failed' };
    }
  };

  // Safe logout with proper cleanup
  const logout = () => {
    return new Promise((resolve) => {
      // Clear local storage
      localStorage.removeItem('token');
      
      // Clear user state
      setUser(null);
      
      // Small delay to ensure state updates complete
      setTimeout(() => {
        resolve();
      }, 50);
    });
  };

  // ✅ FIXED: Use PUT method and correct endpoint
  const enableSeller = async (shopName) => {
    try {
      const token = localStorage.getItem('token');
      
      // ✅ Use PUT method to match your backend route
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/auth/enable-seller`, 
        { shopName },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      
      // ✅ Update user context immediately with response data
      setUser(response.data.user);
      
      return { success: true };
    } catch (error) {
      console.error('EnableSeller error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to enable seller account' 
      };
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    enableSeller, // ✅ Fixed function
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
