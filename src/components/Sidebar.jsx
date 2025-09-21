// src/components/Sidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext.jsx';
import Icon from './Icon.jsx';
import { projectApi } from '@/lib/projectApi.js';
import styles from '@styles/Sidebar.module.css';

export default function Sidebar({ isCollapsed, onToggle }) {
  const { user } = useAuth();
  const location = useLocation();
  const [projectsInProgress, setProjectsInProgress] = useState(0);
  const brandRef = useRef(null);

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

  // Role-specific navigation items
  const getNavigationItems = (userRole) => {
    const commonItems = {
      projects: { 
        path: '/projects', 
        label: 'Projects', 
        icon: 'documents', 
        badge: projectsInProgress > 0 ? projectsInProgress : null 
      },
      applications: {
        path: '/applications',
        label: 'Applications',
        icon: 'clipboard-document-list'
      },
      universityApps: {
        path: '/university-apps',
        label: 'University Apps',
        icon: 'academic-cap'
      },
      visaApplications: {
        path: '/visa-applications',
        label: 'Visa Applications',
        icon: 'identification'
      },
      documents: { 
        path: '/documents', 
        label: 'Documents', 
        icon: 'documents'
      },
      messages: { 
        path: '/messages', 
        label: 'Messages', 
        icon: 'messages'
      }
    };

    const roleBasedItems = {
      admin: [
        { 
          path: '/admin', 
          label: 'Admin Dashboard', 
          icon: 'admin'
        },
        { 
          path: '/consultants', 
          label: 'Consultants', 
          icon: 'briefcase'
        },
        commonItems.projects,
        { 
          path: '/students', 
          label: 'Students', 
          icon: 'users'
        },
        commonItems.applications,
        commonItems.universityApps,
        commonItems.visaApplications,
        commonItems.documents,
        commonItems.messages
      ],
      consultant: [
        { 
          path: '/', 
          label: 'Dashboard', 
          icon: 'dashboard'
        },
        commonItems.projects,
        { 
          path: '/students', 
          label: 'Students', 
          icon: 'users'
        },
        { 
          path: '/consultants', 
          label: 'Consultants', 
          icon: 'briefcase'
        },
        commonItems.applications,
        commonItems.universityApps,
        commonItems.visaApplications,
        commonItems.documents,
        commonItems.messages
      ],
      client: [
        { 
          path: '/', 
          label: 'Dashboard', 
          icon: 'dashboard'
        },
        commonItems.projects,
        { 
          path: '/consultants', 
          label: 'Consultants', 
          icon: 'briefcase'
        },
        commonItems.applications,
        commonItems.universityApps,
        commonItems.visaApplications,
        commonItems.documents,
        commonItems.messages
      ],
      student: [
        { 
          path: '/', 
          label: 'Dashboard', 
          icon: 'dashboard'
        },
        commonItems.projects,
        { 
          path: '/consultants', 
          label: 'Consultants', 
          icon: 'briefcase'
        },
        commonItems.applications,
        commonItems.universityApps,
        commonItems.visaApplications,
        commonItems.documents,
        commonItems.messages
      ]
    };

    return roleBasedItems[userRole] || roleBasedItems.student;
  };

  // Get navigation items based on user role
  const navigationItems = getNavigationItems(user?.role);

  // Helper function to determine if a route is active
  const isActiveRoute = (itemPath) => {
    if (itemPath === '/') {
      return location.pathname === '/';
    }
    if (itemPath === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname === itemPath || 
           (itemPath !== '/' && location.pathname.startsWith(itemPath));
  };

  // Get brand link based on user role
  const getBrandLink = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin';
      case 'consultant':
      case 'client':
      case 'student':
      default:
        return '/';
    }
  };

  // Handle header click for toggle
  const handleHeaderClick = (e) => {
    // Check if the click was on the brand link or its children
    if (brandRef.current && brandRef.current.contains(e.target)) {
      return; // Don't toggle if clicking on brand
    }
    onToggle();
  };

  // Handle brand click separately
  const handleBrandClick = (e) => {
    e.stopPropagation(); // Prevent header click
  };

  return (
    <aside className={`${styles.sidebar} ${isCollapsed ? styles['sidebar--collapsed'] : ''}`}>
      <div 
        className={styles['sidebar__header']}
        onClick={handleHeaderClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleHeaderClick(e);
          }
        }}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        title={isCollapsed ? 'Click to expand' : 'Click to collapse'}
      >
        <Link 
          to={getBrandLink()} 
          className={styles['sidebar__brand']}
          ref={brandRef}
          onClick={handleBrandClick}
        >
          <Icon name="building" className={styles['sidebar__brandicon']} />
          {!isCollapsed && <span className={styles['sidebar__brandtext']}>Consultancy</span>}
        </Link>

        {/* Visual indicator for collapse/expand */}
        <div className={styles['sidebar__indicator']}>
          <Icon
            name={isCollapsed ? 'chevron-right' : 'chevron-left'}
            className={styles['sidebar__indicatorIcon']}
          />
        </div>
      </div>

      <nav className={styles['sidebar__nav']}>
        <div className={styles['sidebar__section']}>
          {!isCollapsed && <h3 className={styles['sidebar__title']}>Navigation</h3>}
          {navigationItems.map((item, index) => {
            const isActive = isActiveRoute(item.path);
            
            return (
              <Link
                key={`${item.path}-${index}`}
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

        {/* Role indicator section */}
        {!isCollapsed && user?.role === 'admin' && (
          <div className={styles['sidebar__section']}>
            <div className={styles['sidebar__role-indicator']}>
              <Icon name="shield-check" className={styles['sidebar__icon']} />
              <span className={styles['sidebar__role-text']}>Admin Mode</span>
            </div>
          </div>
        )}
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