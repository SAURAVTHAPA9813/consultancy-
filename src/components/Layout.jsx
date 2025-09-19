import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import '@styles/App.css';
import layoutStyles from '@styles/Layout.module.css';
import Sidebar from '@/components/Sidebar.jsx';
import Header from '@/components/Header.jsx';

export default function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className={`${layoutStyles['app-shell']} ${sidebarCollapsed ? layoutStyles['app-shell--collapsed'] : ''}`}>
      <div className={layoutStyles['app-shell__sidebar']}>
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggle={toggleSidebar}
        />
      </div>
      <div className={layoutStyles['app-shell__main']}>
        <Header />
        <div className={layoutStyles['app-shell__content']}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}