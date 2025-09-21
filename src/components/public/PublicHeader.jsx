// src/components/public/PublicHeader.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon.jsx';

const PublicHeader = ({ minimal = false }) => {
  const [open, setOpen] = useState(false);

  const NAV = [
    { label: "Home", href: "/home" },
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="public-header" role="banner">
     <nav className="navbar" aria-label="Main navigation">
  {/* Logo */}
  <Link to="/" className="logo" aria-label="Home">
    <Icon name="chart" size={24} className="logo-icon" />
    <span className="logo-text">Consultancy</span>
  </Link>

  {!minimal && (
    <>
      {/* Desktop links */}
      <ul className="nav-links">
        {NAV.map((n) => (
          <li key={n.label}>
            <a className="nav-link" href={n.href}>{n.label}</a>
          </li>
        ))}
      </ul>

      {/* Actions + mobile toggle */}
      <div className="nav-actions">
        <Link to="/login" className="btn btn-outline">
          Log In
        </Link>
        <Link to="/register" className="btn btn-primary">
          Sign Up
        </Link>
        <button
          className="mobile-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <Icon name={open ? 'x' : 'bars-3'} size={20} />
        </button>
      </div>
    </>
  )}
</nav>

    {/* Mobile drawer */}
{open && !minimal && (
  <div className="mobile-menu">

          <ul className="mobile-nav-list">
            {NAV.map((n) => (
              <li key={n.label}>
                <a className="mobile-nav-link" href={n.href} onClick={() => setOpen(false)}>
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mobile-auth">
            <Link to="/login" className="btn btn-outline btn-large" onClick={() => setOpen(false)}>
              Log In
            </Link>
            <Link to="/register" className="btn btn-primary btn-large" onClick={() => setOpen(false)}>
              Sign Up
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        .public-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: rgba(17, 17, 17, 0.85);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: ${minimal ? 'transparent' : 'rgba(17, 17, 17, 0.85)'};
  backdrop-filter: ${minimal ? 'none' : 'blur(20px)'};
  border-bottom: ${minimal ? 'none' : '1px solid rgba(255, 255, 255, 0.1)'};
}

        .navbar {
          height: 72px;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        /* Logo */
        .logo {
          color: #fff;
          text-decoration: none;
          font-weight: 700;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          color: #6366f1;
        }

        .logo-text {
          font-size: 1.25rem;
          letter-spacing: -0.025em;
        }

        /* Desktop nav */
        .nav-links {
          list-style: none;
          display: flex;
          gap: 2rem;
          margin: 0;
          padding: 0;
        }

        .nav-link {
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-weight: 500;
          padding: 0.5rem 1rem;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .nav-link:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.1);
        }

        /* Actions */
        .nav-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.625rem 1.25rem;
          border-radius: 8px;
          font-weight: 600;
          text-decoration: none;
          font-size: 0.875rem;
          transition: all 0.2s;
          display: inline-block;
          text-align: center;
          border: none;
          cursor: pointer;
        }

        .btn-outline {
          color: rgba(255, 255, 255, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: transparent;
        }

        .btn-outline:hover {
          background: rgba(255, 255, 255, 0.12);
          color: #fff;
        }

        .btn-primary {
          background: rgba(99, 102, 241, 0.9);
          color: #fff;
          border: 1px solid rgba(99, 102, 241, 0.3);
        }

        .btn-primary:hover {
          background: rgba(99, 102, 241, 1);
          transform: translateY(-1px);
        }

        .btn-large {
          padding: 0.875rem 1.5rem;
          font-size: 1rem;
        }

        /* Mobile */
        .mobile-toggle {
          display: none;
          background: transparent;
          border: 0;
          color: #fff;
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        .mobile-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .mobile-menu {
          position: fixed;
          top: 72px;
          left: 0;
          right: 0;
          background: rgba(17, 17, 17, 0.96);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .mobile-nav-list {
          list-style: none;
          margin: 0;
          padding: 1rem 1.25rem;
        }

        .mobile-nav-link {
          display: block;
          padding: 1rem 0;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .mobile-nav-link:last-child {
          border-bottom: 0;
        }

        .mobile-auth {
          padding: 0 1.25rem 1.25rem;
          display: grid;
          gap: 0.75rem;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .nav-links,
          .nav-actions .btn {
            display: none;
          }
          .mobile-toggle {
            display: flex;
          }
          .navbar {
            padding: 0 1.25rem;
          }
        }

        @media (max-width: 480px) {
          .navbar {
            padding: 0 1rem;
          }
          .logo-text {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </header>
  );
};

export default PublicHeader;