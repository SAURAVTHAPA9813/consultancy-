// src/components/PublicLayout.jsx
import React from 'react';
import PublicHeader from './PublicHeader.jsx';
import PublicFooter from './PublicFooter.jsx';
<PublicHeader />
const PublicLayout = ({ children, className = '', showHeader = true, showFooter = true }) => (
  <div className={`public-layout ${className}`}>
    <div className="layout-wrapper">
      {showHeader && <PublicHeader />}
      <main className="main-content" role="main">
        {children}
      </main>
      {showFooter && <PublicFooter />}
    </div>

    <style jsx>{`
      .public-layout {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
      }

      .layout-wrapper {
        flex: 1;
        display: flex;
        flex-direction: column;
      }

      .main-content {
        flex: 1;
        width: 100%;
      }
    `}</style>
  </div>
);

export default PublicLayout;