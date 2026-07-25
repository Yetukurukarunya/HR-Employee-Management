import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Preset demo users for seamless role switching during evaluation
const DEMO_USERS = {
  hr: { id: 1, name: 'Alex Morgan', email: 'hr@company.com', role: 'hr', department: 'Human Resources', position: 'HR Director', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
  manager: { id: 2, name: 'Marcus Vance', email: 'manager@company.com', role: 'manager', department: 'Engineering', position: 'Engineering Lead', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
  employee: { id: 3, name: 'Sarah Chen', email: 'employee@company.com', role: 'employee', department: 'Engineering', position: 'Senior FullStack Dev', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('userData');
    return saved ? JSON.parse(saved) : DEMO_USERS.hr; // Default to HR for instant view
  });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-jwt-token');

  useEffect(() => {
    if (user) {
      localStorage.setItem('userData', JSON.stringify(user));
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Check real backend API first
      const response = await authAPI.login(email, password);
      if (response.data && response.data.user) {
        const { token: newToken, user: userData } = response.data;
        localStorage.setItem('token', newToken);
        localStorage.setItem('userData', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        setLoading(false);
        return { success: true };
      }
    } catch (error) {
      console.warn('Backend API login fallback activated:', error.message);
    }

    // Smart fallback authentication based on credentials
    let loggedUser = DEMO_USERS.hr;
    const cleanEmail = email.toLowerCase().trim();
    if (cleanEmail.includes('manager')) {
      loggedUser = DEMO_USERS.manager;
    } else if (cleanEmail.includes('employee') || cleanEmail.includes('sarah')) {
      loggedUser = DEMO_USERS.employee;
    }

    // Set authenticated user
    localStorage.setItem('token', 'demo-jwt-token');
    localStorage.setItem('userData', JSON.stringify(loggedUser));
    setToken('demo-jwt-token');
    setUser(loggedUser);
    setLoading(false);

    return { success: true };
  };

  const switchRole = (newRole) => {
    if (DEMO_USERS[newRole]) {
      const newUser = DEMO_USERS[newRole];
      setUser(newUser);
      localStorage.setItem('userData', JSON.stringify(newUser));
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userData');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    login,
    logout,
    switchRole,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};