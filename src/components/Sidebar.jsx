// src/components/Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Icon from './Icon.jsx';
import { projectApi } from '@/lib/projectApi.js';
import styles from '@styles/Sidebar.module.css';

export default function Sidebar({ isCollapsed, onToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const [projectsInProgress, setProjectsInProgress] = useState(0);

  // Load in-progress projects count for badge
  useEffect(() => {
    const loadProjectsCount = async () => {
      try {
        const projects = await projectApi.getProjects({
          status: 'in-progress',
          userId: user?.id,
          userRole: user?.role
        });
        setProjectsInProgress(projects.length);
      } catch (err) {
        console.error('Failed to load projects count:', err);
      }
    };

    if (user) {
      loadProjectsCount();
    }
  }, [user]);

  const navigationItems = [
    { 
      path: '/', 
      label: 'Dashboard', 
      icon: 'dashboard', 
      roles: ['admin', 'consultant', 'client', 'student'] 
    },
    { 
      path: '/projects', 
      label: 'Projects', 
      icon: 'documents', 
      roles: ['admin', 'consultant', 'client', 'student'], 
      badge: projectsInProgress > 0 ? projectsInProgress : null 
    },
    { 
      path: '/students', 
      label: 'Students', 
      icon: 'users', 
      roles: ['admin', 'consultant'] // 🔒 Privacy: Only admin/consultant can see student data
    },
    { 
      path: '/consultants', 
      label: 'Consultants', 
      icon: 'briefcase', 
      roles: ['admin', 'consultant', 'client', 'student'] // 👥 All users can view consultants
    },
    {
      path: '/applications',
      label: 'Applications',
      icon: 'clipboard-document-list',
      roles: ['admin', 'consultant', 'client', 'student'] // 📋 All users track applications
    },
    {
      path: '/university-apps',
      label: 'University Apps',
      icon: 'academic-cap',
      roles: ['admin', 'consultant', 'client', 'student'] // 🎓 All users need university access
    },
    {
      path: '/visa-applications',
      label: 'Visa Applications',
      icon: 'identification',
      roles: ['admin', 'consultant', 'client', 'student'] // 🛂 All users need visa access
    },
    { 
      path: '/documents', 
      label: 'Documents', 
      icon: 'documents', 
      roles: ['admin', 'consultant', 'client', 'student'] // 📄 All users manage documents
    },
    { 
      path: '/messages', 
      label: 'Messages', 
      icon: 'messages', 
      roles: ['admin', 'consultant', 'client', 'student'] // 💬 All users need messaging
    },
    { 
      path: '/admin', 
      label: 'Admin', 
      icon: 'admin', 
      roles: ['admin'] // 🔒 Admin only
    }
  ];

  // 🔧 FIXED: Proper filtering - check if user role is included in allowed roles
  const filteredItems = navigationItems.filter(item => 
    item.roles.includes(user?.role || 'student')
  );

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles['sidebar--collapsed'] : ''}`}>
      <div className={styles['sidebar__header']}>
        <Link to="/" className={styles['sidebar__brand']}>
          <Icon name="building" className={styles['sidebar__brandicon']} />
          {!isCollapsed && <span className={styles['sidebar__brandtext']}>Consultancy</span>}
        </Link>

        <button
          className={styles['sidebar__toggle']}
          onClick={onToggle}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand' : 'Collapse'}
          type="button"
        >
          <Icon
            name={isCollapsed ? 'chevron-right' : 'chevron-left'}
            className={styles['sidebar__toggleIcon']}
          />
        </button>
      </div>

      <nav className={styles['sidebar__nav']}>
        <div className={styles['sidebar__section']}>
          {!isCollapsed && <h3 className={styles['sidebar__title']}>Navigation</h3>}
          {filteredItems.map(item => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`${styles['sidebar__link']} ${isActive ? styles['sidebar__link--active'] : ''}`}
                title={isCollapsed ? item.label : ''}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} className={styles['sidebar__icon']} />
                {!isCollapsed && (
                  <span className={styles['sidebar__label']}>
                    {item.label}
                    {item.badge && (
                      <span className={styles['nav-badge']}>
                        {item.badge}
                      </span>
                    )}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {!isCollapsed && (
        <div className={styles['sidebar__footer']}>
          <div className={styles['sidebar__whoami']}>
            Logged in as<br />
            <strong>{user?.username || 'User'}</strong> ({user?.role || 'student'})
          </div>
        </div>
      )}
    </aside>
  );
}