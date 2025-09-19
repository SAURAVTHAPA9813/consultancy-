// src/components/public/PublicFooter.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';

const PublicFooter = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'Features', href: '#features' },
      { label: 'Universities', href: '#universities' },
      { label: 'Consultants', href: '#consultants' },
      { label: 'Success Stories', href: '#success' },
      { label: 'Pricing', href: '#pricing' }
    ],
    company: [
      { label: 'About Us', href: '#about' },
      { label: 'Our Team', href: '#team' },
      { label: 'Careers', href: '#careers' },
      { label: 'Press', href: '#press' },
      { label: 'Contact', href: '#contact' }
    ],
    resources: [
      { label: 'Help Center', href: '#help' },
      { label: 'Study Guides', href: '#guides' },
      { label: 'Country Guides', href: '#countries' },
      { label: 'IELTS Prep', href: '#ielts' },
      { label: 'Webinars', href: '#webinars' }
    ],
    legal: [
      { label: 'Privacy Policy', href: '#privacy' },
      { label: 'Terms of Service', href: '#terms' },
      { label: 'Cookie Policy', href: '#cookies' },
      { label: 'Refund Policy', href: '#refund' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', href: '#twitter', icon: 'twitter' },
    { name: 'LinkedIn', href: '#linkedin', icon: 'linkedin' },
    { name: 'Facebook', href: '#facebook', icon: 'facebook' },
    { name: 'Instagram', href: '#instagram', icon: 'instagram' }
  ];

  return (
    <footer className="public-footer" role="contentinfo">
      {/* Newsletter Section */}
      <div className="newsletter-section">
        <div className="footer-container">
          <div className="newsletter-wrapper">
            <div className="newsletter-content">
              <div className="newsletter-icon">
                <Icon name="bell" size={32} />
              </div>
              <div className="newsletter-text">
                <h3 className="newsletter-title">Stay Updated with Study Abroad News</h3>
                <p className="newsletter-description">
                  Get the latest university updates, scholarship opportunities, and expert tips delivered to your inbox.
                </p>
              </div>
            </div>
            <form className="newsletter-form">
              <div className="form-wrapper">
                <input
                  type="email"
                  className="email-input"
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                />
                <button className="subscribe-btn" type="submit">
                  <span>Subscribe</span>
                  <Icon name="arrow-right" size={18} />
                </button>
              </div>
              <p className="form-note">
                <Icon name="shield-check" size={14} />
                <span>We respect your privacy. Unsubscribe at any time.</span>
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="footer-main">
        <div className="footer-container">
          <div className="footer-grid">
            {/* Brand Column */}
            <div className="footer-brand">
              <div className="brand-logo">
                <Icon name="academic-cap" size={32} />
                <div className="brand-name">
                  <span className="brand-text">StudyAbroad</span>
                  <span className="brand-tag">Pro</span>
                </div>
              </div>
              <p className="brand-description">
                Empowering students worldwide with comprehensive tools to manage their study abroad journey 
                and connect with expert education consultants.
              </p>
              <div className="social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className="social-link"
                    aria-label={`Follow us on ${social.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon name={social.icon} size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="footer-links">
              <div className="links-column">
                <h4 className="column-title">Platform</h4>
                <ul className="links-list">
                  {footerLinks.product.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4 className="column-title">Company</h4>
                <ul className="links-list">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4 className="column-title">Resources</h4>
                <ul className="links-list">
                  {footerLinks.resources.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4 className="column-title">Legal</h4>
                <ul className="links-list">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="footer-container">
          <div className="bottom-content">
            <div className="copyright">
              © {currentYear} StudyAbroad Pro. All rights reserved.
            </div>
            <div className="bottom-links">
              <a href="#privacy" className="bottom-link">Privacy</a>
              <span className="separator">•</span>
              <a href="#terms" className="bottom-link">Terms</a>
              <span className="separator">•</span>
              <a href="#cookies" className="bottom-link">Cookies</a>
              <span className="separator">•</span>
              <a href="#sitemap" className="bottom-link">Sitemap</a>
            </div>
            <div className="made-with">
              Made with <Icon name="rocket" size={14} /> for students worldwide
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`


      /* Modern Newsletter Section */
.newsletter-section {
  background: linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%);
  color: #fff;
  position: relative;
  overflow: hidden;
  
}

/* Animated background pattern */
.newsletter-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.03) 1px, transparent 1px),
    radial-gradient(circle at 75% 75%, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 40px 40px, 60px 60px;
  animation: backgroundFloat 20s ease-in-out infinite;
}

@keyframes backgroundFloat {
  0%, 100% { 
    background-position: 0% 0%, 0% 0%; 
  }
  50% { 
    background-position: 100% 100%, -100% -100%; 
  }
}

/* Gradient overlay for depth */
.newsletter-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    45deg,
    rgba(99, 102, 241, 0.05) 0%,
    transparent 50%,
    rgba(139, 92, 246, 0.05) 100%
  );
  pointer-events: none;
}

.newsletter-wrapper {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4rem;
  align-items: center;
  padding: 5rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.newsletter-content {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.newsletter-icon {
  flex-shrink: 0;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 10px 25px rgba(99, 102, 241, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { 
    transform: scale(1);
    box-shadow: 
      0 10px 25px rgba(99, 102, 241, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.1);
  }
  50% { 
    transform: scale(1.05);
    box-shadow: 
      0 15px 35px rgba(99, 102, 241, 0.4),
      0 0 0 1px rgba(255, 255, 255, 0.2);
  }
}

.newsletter-icon :global(.icon) {
  color: white;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
}

.newsletter-text {
  flex: 1;
}

.newsletter-title {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.75rem;
  letter-spacing: -0.025em;
  line-height: 1.2;
}

.newsletter-description {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
  font-weight: 400;
}

.newsletter-form {
  min-width: 420px;
  max-width: 500px;
}

.form-wrapper {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
  position: relative;
}

.email-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.97);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  font-size: 1rem;
  color: #0f172a;
  font-weight: 500;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  backdrop-filter: blur(10px);
  box-shadow: 
    0 4px 15px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.05);
}

.email-input::placeholder {
  color: #64748b;
  font-weight: 400;
}

.email-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 1);
  border-color: rgba(99, 102, 241, 0.5);
  box-shadow: 
    0 8px 25px rgba(0, 0, 0, 0.15),
    0 0 0 4px rgba(99, 102, 241, 0.1),
    0 0 0 1px rgba(99, 102, 241, 0.2);
  transform: translateY(-1px);
}

.subscribe-btn {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
  color: #0f172a;
  border: none;
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  box-shadow: 
    0 4px 15px rgba(255, 255, 255, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.1);
}

.subscribe-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.3),
    transparent
  );
  transition: left 0.6s;
}

.subscribe-btn:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  transform: translateY(-2px);
  box-shadow: 
    0 8px 25px rgba(255, 255, 255, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2);
}

.subscribe-btn:hover::before {
  left: 100%;
}

.subscribe-btn:active {
  transform: translateY(0);
  transition: transform 0.1s;
}

.form-note {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
  padding-left: 0.25rem;
}

.form-note :global(.icon) {
  color: #10b981;
  filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.3));
}


/* Advanced hover effects for desktop */
@media (hover: hover) and (pointer: fine) {
  .newsletter-section:hover::before {
    animation-duration: 10s;
  }
  
  .newsletter-wrapper:hover .newsletter-icon {
    animation-duration: 1.5s;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .newsletter-section::before,
  .newsletter-icon {
    animation: none;
  }
  
  .subscribe-btn::before {
    display: none;
  }
  
  * {
    transition-duration: 0.01ms !important;
    animation-duration: 0.01ms !important;
  }
}
          .public-footer {
          background: #0f172a;
          color: #94a3b8;
          margin-top: 0;
          position: relative;
        }

        .footer-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
        }
        .form-note {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
        }

        .form-note :global(.icon) {
          flex-shrink: 0;
        }

        /* Main Footer */
        .footer-main {
          padding: 5rem 0 3rem;
          background: #0f172a;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 380px 1fr;
          gap: 4rem;
        }

        /* Brand Column */
        .footer-brand {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .brand-logo :global(.icon) {
          color: #6366f1;
        }

        .brand-name {
          display: flex;
          align-items: baseline;
          gap: 0.25rem;
        }

        .brand-text {
          font-size: 1.5rem;
          font-weight: 800;
          color: white;
          letter-spacing: -0.02em;
        }

        .brand-tag {
          font-size: 1rem;
          font-weight: 600;
          color: #6366f1;
        }

        .brand-description {
          font-size: 0.95rem;
          line-height: 1.7;
          color: #64748b;
          margin: 0;
        }

        .social-links {
          display: flex;
          gap: 0.75rem;
        }

        .social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 0.75rem;
          color: #94a3b8;
          transition: all 0.3s ease;
        }

        .social-link:hover {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.2);
          color: #6366f1;
          transform: translateY(-2px);
        }

        /* Links Columns */
        .footer-links {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
        }

        .links-column {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .column-title {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin: 0;
        }

        .links-list {
          display: flex;
          flex-direction: column;
          gap: 0.875rem;
          list-style: none;
          margin: 0;
          padding: 0;
        }

        .footer-link {
          font-size: 0.95rem;
          color: #64748b;
          text-decoration: none;
          transition: color 0.2s ease;
          position: relative;
        }

        .footer-link:hover {
          color: #cbd5e1;
        }

        .footer-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 1px;
          background: #6366f1;
          transition: width 0.3s ease;
        }

        .footer-link:hover::after {
          width: 100%;
        }

        /* Footer Bottom */
        .footer-bottom {
          padding: 2rem 0;
          background: #020617;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 1.5rem;
        }

        .copyright {
          font-size: 0.875rem;
          color: #475569;
        }

        .bottom-links {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .bottom-link {
          font-size: 0.875rem;
          color: #475569;
          text-decoration: none;
          transition: color 0.2s ease;
          padding: 0.25rem 0.5rem;
        }

        .bottom-link:hover {
          color: #94a3b8;
        }

        .separator {
          color: #334155;
          font-size: 0.75rem;
        }

        .made-with {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #475569;
        }

        .made-with :global(.icon) {
          color: #6366f1;
          animation: bounce 2s infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }

        /* Responsive Design */
        @media (max-width: 1024px) {
          .newsletter-wrapper {
            grid-template-columns: 1fr;
            gap: 2rem;
            padding: 3rem 0;
          }

          .newsletter-form {
            min-width: 100%;
          }

          .footer-grid {
            grid-template-columns: 1fr;
            gap: 3rem;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
            gap: 2.5rem;
          }
        }

        @media (max-width: 768px) {
          .footer-container {
            padding: 0 1.5rem;
          }

          .newsletter-content {
            flex-direction: column;
          }

          .newsletter-title {
            font-size: 1.5rem;
          }

          .form-wrapper {
            flex-direction: column;
          }

          .email-input,
          .subscribe-btn {
            width: 100%;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .bottom-content {
            flex-direction: column;
            text-align: center;
          }

          .bottom-links {
            order: 2;
          }

          .made-with {
            order: 3;
          }
        }

        @media (max-width: 640px) {
          .footer-container {
            padding: 0 1rem;
          }

          .newsletter-section {
            padding: 3rem 0;
          }

          .newsletter-icon {
            width: 48px;
            height: 48px;
          }

          .footer-main {
            padding: 3rem 0 2rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .made-with :global(.icon) {
            animation: none;
          }
        }
      `}</style>
    </footer>
  );
};

export default PublicFooter;