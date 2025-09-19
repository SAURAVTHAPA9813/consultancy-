import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';

export default function Unauthorized() {
  const { isAuthenticated } = useAuth();

  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 600, width: '100%', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '2rem', boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}>
        <h1 style={{ margin: 0, fontSize: '1.75rem', fontWeight: 700, color: '#111827' }}>Access denied</h1>
        <p style={{ color: '#6b7280', marginTop: '0.75rem' }}>
          You are signed in but do not have permission to view this page with your current role.
        </p>

        <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem' }}>
          <Link
            to={isAuthenticated ? '/dashboard' : '/login'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1rem',
              background: '#6366f1',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 600
            }}
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Go to Login'}
          </Link>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem 1rem',
              background: '#f3f4f6',
              color: '#111827',
              textDecoration: 'none',
              borderRadius: 8,
              fontWeight: 600
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}