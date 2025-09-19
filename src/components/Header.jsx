// src/components/Header.jsx


import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import { NotificationBell } from './NotificationContext.jsx';
import styles from '@styles/Navbar.module.css';

const titles = {
  '/': 'Dashboard',
  '/leads': 'Leads',
  '/documents': 'Documents',
  '/messages': 'Messages',
  '/admin': 'Admin',
  '/login': 'Sign in',
};

export default function Header() {
  const { isAuthenticated, user, logout, branch, setBranch } = useAuth();
  const location = useLocation();
  const pageTitle = titles[location.pathname] || 'Dashboard';

  // ALL the old notification logic (useState, useEffects, handlers) has been removed.

  return (
    <header className={styles.topbar}>
      <div className={styles['topbar__container']}>
        <div className={styles['topbar__left']}>
          <h1 className={styles['topbar__title']}>{pageTitle}</h1>

          <div className={styles['topbar__branch']}>
            <label htmlFor="branch" className={styles['topbar__branch-label']}>Branch</label>
            <select
              id="branch"
              className={styles['topbar__branch-select']}
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
            >
              <option value="Main">Main</option>
              <option value="East">East</option>
              <option value="West">West</option>
            </select>
          </div>
        </div>

        <div className={styles['topbar__right']}>
          {/* REPLACED: The old complex notification UI is now just one clean component */}
          {isAuthenticated && <NotificationBell />}

          {/* User menu (no changes needed here) */}
          {isAuthenticated && (
            <div className={styles['topbar__user']}>
              <div className={styles['topbar__user-avatar']} title={`${user?.username} (${user?.role})`}>
                {String(user?.username || '?').slice(0,1).toUpperCase()}
              </div>
              <div className={styles['topbar__user-info']}>
                <div className={styles['topbar__user-name']}>{user?.username}</div>
                <div className={styles['topbar__user-role']}>{user?.role}</div>
              </div>
              <button className={styles['topbar__logout']} onClick={logout} title="Sign out">Sign-out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}