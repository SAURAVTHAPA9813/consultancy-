import React from 'react';
import { useAuth } from '../components/AuthContext.jsx';

function AdminDashboard() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.username}! (Role: {user.role})</p>
      <h3>Admin-Only Controls:</h3>
      <button>Manage Users</button>
      <button>System Settings</button>
    </div>
  );
}

export default AdminDashboard;