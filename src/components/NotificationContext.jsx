  // src/components/NotificationContext.jsx
 import React, { createContext, useContext, useState, useEffect } from 'react';
 import styles from '@styles/Notifications.module.css';
 import navStyles from '@styles/Navbar.module.css';
 import Icon from '@/components/Icon.jsx';

 const NotificationContext = createContext();

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  
  // Load notifications from localStorage on mount
  useEffect(() => {
    // Seed with some example data if the store is empty
    const stored = localStorage.getItem('cms_notifications');
    if (stored) {
      setNotifications(JSON.parse(stored));
    } else {
      const seeded = [
        { id: 1, title: 'New lead assigned', message: 'John Doe from Acme Inc.', type: 'success', category: 'leads', read: false, timestamp: new Date(Date.now() - 3600000).toISOString() },
        { id: 2, title: 'Project Update', message: 'Phase 2 has been completed.', type: 'info', category: 'projects', read: false, timestamp: new Date(Date.now() - 86400000).toISOString() },
        { id: 3, title: 'Invoice Paid', message: 'Invoice #INV-1043 has been paid.', type: 'success', category: 'billing', read: true, timestamp: new Date(Date.now() - 172800000).toISOString() },
      ];
      setNotifications(seeded);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cms_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now() + Math.random(),
      timestamp: new Date().toISOString(),
      read: false,
      type: 'info', // info, success, warning, error
      category: 'general',
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev.slice(0, 49)]); // Keep max 50
  };

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };
  
  const clearReadNotifications = () => {
    setNotifications(prev => prev.filter(n => !n.read));
  };

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearReadNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}

// Notification Bell Component
export function NotificationBell() {
  const { unreadCount } = useNotifications();
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <div className={styles['notification-bell']}>
      <button
        className={navStyles['topbar__bell']}
        onClick={() => setShowDropdown(!showDropdown)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Icon name="bell" size={18} />
        {unreadCount > 0 && (
          <span className={navStyles['topbar__badge']}>
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {showDropdown && (
        <NotificationDropdown onClose={() => setShowDropdown(false)} />
      )}
    </div>
  );
}

// Notification Dropdown Component
function NotificationDropdown({ onClose }) {
  const { 
    notifications, 
    unreadCount,
    markAsRead, 
    markAllAsRead, 
    clearNotification,
    clearReadNotifications 
  } = useNotifications();
  const recentNotifications = notifications.slice(0, 10);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      default: return 'ℹ️';
    }
  };

  return (
    <>
      <div className={styles['notification-overlay']} onClick={onClose} />
      <div className={styles['notification-dropdown']}>
        <div className={styles['notification-dropdown__header']}>
          <h3>Notifications</h3>
          <div className={styles['notification-dropdown__actions']}>
            <button onClick={markAllAsRead} disabled={unreadCount === 0}>
              Mark all read
            </button>
            <button onClick={clearReadNotifications}>
              Clear read
            </button>
          </div>
        </div>

        <div className={styles['notification-dropdown__body']}>
          {recentNotifications.length === 0 ? (
            <div className={styles['notification-dropdown__empty']}>
              <p>No new notifications</p>
            </div>
          ) : (
            <ul className={styles['notification-list']}>
              {recentNotifications.map(notification => (
                <li
                  key={notification.id}
                  className={`${styles['notification-item']} ${!notification.read ? styles['notification-item--unread'] : ''}`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className={styles['notification-item__icon']}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className={styles['notification-item__content']}>
                    <div className={styles['notification-item__title']}>{notification.title}</div>
                    {notification.message && <div className={styles['notification-item__message']}>{notification.message}</div>}
                    <div className={styles['notification-item__meta']}>{formatNotificationTime(notification.timestamp)}</div>
                  </div>
                   <button
                     className={styles['notification-item__close']}
                     onClick={(e) => {
                       e.stopPropagation();
                       clearNotification(notification.id);
                     }}
                     aria-label="Dismiss"
                   >
                     ✕
                   </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}

// Helper to format time
function formatNotificationTime(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMs / 3600000);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}