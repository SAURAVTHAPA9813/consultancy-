import React, { useState } from 'react';
import { useAuth } from '../components/AuthContext.jsx';

function LoginPage() {
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      login({ id: 1, username: 'admin', role: 'admin' }, 'mock-jwt-token-admin');
    } else if (loginData.username === 'user' && loginData.password === 'user') {
      login({ id: 2, username: 'user', role: 'user' }, 'mock-jwt-token-user');
    } else {
      setError('Invalid credentials. Try admin/admin or user/user');
    }
    setLoginData({ username: '', password: '' });
  };

  return (
    <div>
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div><input type="text" placeholder="Username" value={loginData.username} onChange={(e) => setLoginData({ ...loginData, username: e.target.value })} required /></div>
        <div><input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required /></div>
        <button type="submit">Login</button>
      </form>
      {error && <p>{error}</p>}
    </div>
  );
}

export default LoginPage;