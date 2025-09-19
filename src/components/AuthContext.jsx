// Fixed AuthContext.jsx with email-based login

import React, { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

const LS_USER = 'user';
const LS_TOKEN = 'token';
const LS_BRANCH = 'ui.branch';
const LS_REGISTERED_USERS = 'registered_users';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(LS_USER);
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem(LS_TOKEN));
  const [branch, setBranch] = useState(() => localStorage.getItem(LS_BRANCH) || 'Main');

  // Initialize with default demo users
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    const stored = localStorage.getItem(LS_REGISTERED_USERS);
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default demo users with email as login
    const defaultUsers = [
      { 
        id: 1, 
        username: 'admin', 
        email: 'admin@demo.com', 
        password: 'admin', 
        role: 'admin', 
        fullName: 'Admin User', 
        phone: '1234567890' 
      },
      { 
        id: 2, 
        username: 'consultant', 
        email: 'consultant@demo.com', 
        password: 'consultant', 
        role: 'consultant', 
        fullName: 'Consultant User', 
        phone: '1234567890' 
      },
      { 
        id: 3, 
        username: 'student', 
        email: 'student@demo.com', 
        password: 'student', 
        role: 'student', 
        fullName: 'Student User', 
        phone: '1234567890' 
      }
    ];
    
    localStorage.setItem(LS_REGISTERED_USERS, JSON.stringify(defaultUsers));
    return defaultUsers;
  });

  // Persist branch selection
  useEffect(() => {
    localStorage.setItem(LS_BRANCH, branch);
  }, [branch]);

  // Persist registered users
  useEffect(() => {
    localStorage.setItem(LS_REGISTERED_USERS, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  // Keep state in sync with localStorage changes across tabs
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === LS_USER) {
        setUser(e.newValue ? JSON.parse(e.newValue) : null);
      }
      if (e.key === LS_TOKEN) {
        setToken(e.newValue || null);
      }
      if (e.key === LS_BRANCH) {
        setBranch(e.newValue || 'Main');
      }
      if (e.key === LS_REGISTERED_USERS) {
        setRegisteredUsers(e.newValue ? JSON.parse(e.newValue) : []);
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // LOGIN with email/password
  const login = (emailOrUserData, passwordOrToken) => {
    let userData;
    let userToken;
    
    // If passed user object directly (for backward compatibility), use it
    if (typeof emailOrUserData === 'object') {
      userData = emailOrUserData;
      userToken = passwordOrToken;
    } else {
      // Email/password login
      const email = emailOrUserData.toLowerCase();
      const password = passwordOrToken;
      
      // Find user by email OR username (for demo accounts)
      const foundUser = registeredUsers.find(user => 
        user.email.toLowerCase() === email || 
        user.username.toLowerCase() === email
      );
      
      if (!foundUser || foundUser.password !== password) {
        throw new Error('Invalid email or password');
      }
      
      userData = foundUser;
      userToken = `jwt-token-${foundUser.role}-${foundUser.id}-${Date.now()}`;
    }
    
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(LS_USER, JSON.stringify(userData));
    localStorage.setItem(LS_TOKEN, userToken);
  };

  // REGISTER new user
  const register = async (registrationData) => {
    const { fullName, username, email, phone, password, role } = registrationData;
    
    // Check if email already exists
    const existingEmail = registeredUsers.find(user => 
      user.email.toLowerCase() === email.toLowerCase()
    );
    
    if (existingEmail) {
      throw new Error('Email already registered');
    }
    
    // Check if username already exists
    const existingUsername = registeredUsers.find(user => 
      user.username.toLowerCase() === username.toLowerCase()
    );
    
    if (existingUsername) {
      throw new Error('Username already taken');
    }
    
    // Create new user
    const newUser = {
      id: Date.now() + Math.random(), // Better ID generation
      username: username.trim(),
      email: email.toLowerCase().trim(),
      password, // In real app, this would be hashed
      role,
      fullName: fullName.trim(),
      phone: phone.trim(),
      createdAt: new Date().toISOString()
    };
    
    // Add to registered users
    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    
    return { 
      success: true, 
      email: newUser.email,
      username: newUser.username,
      message: 'Registration successful! You can now login with your email and password.' 
    };
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(LS_USER);
    localStorage.removeItem(LS_TOKEN);
  };

  const updateUser = (patch = {}) => {
    setUser((prev) => {
      const next = { ...(prev || {}), ...patch };
      localStorage.setItem(LS_USER, JSON.stringify(next));
      return next;
    });
  };

  const refresh = () => {
    const u = localStorage.getItem(LS_USER);
    const t = localStorage.getItem(LS_TOKEN);
    const b = localStorage.getItem(LS_BRANCH);
    const ru = localStorage.getItem(LS_REGISTERED_USERS);
    setUser(u ? JSON.parse(u) : null);
    setToken(t || null);
    setBranch(b || 'Main');
    setRegisteredUsers(ru ? JSON.parse(ru) : []);
  };

  const value = {
    user,
    token,
    branch,
    setBranch,
    setUser,
    updateUser,
    refresh,
    login,
    logout,
    register,
    registeredUsers,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}