// src/components/HeroSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import Icon from '../Icon.jsx';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/register');
    }
  };

  return (
    <section className="hero-section" aria-labelledby="hero-title">
      {/* Background design elements */}
      <div className="hero-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="grid-pattern"></div>
      </div>

      <div className="hero-container">
        {/* Left side - Headlines */}
        <div className="hero-content">
          <div className="hero-badge">
            <Icon name="rocket" size={16} />
            <span>Your Gateway to Global Education</span>
          </div>
          
          <h1 id="hero-title" className="hero-title">
            Study Abroad
            <span className="title-gradient">Consultancy</span>
            Platform
          </h1>
          
          <p className="hero-description">
            Transform your study abroad journey with our comprehensive management system. 
            Connect with expert consultants, track applications, and achieve your international education dreams.
          </p>
          
          <div className="hero-actions">
            <button className="btn-primary" onClick={handleGetStarted}>
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              <Icon name="arrow-right" size={20} />
            </button>
            <button className="btn-secondary">
              <Icon name="play" size={20} />
              Watch Demo
            </button>
          </div>
          
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">500+</span>
              <span className="stat-label">Universities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Countries</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">98%</span>
              <span className="stat-label">Success Rate</span>
            </div>
          </div>
        </div>

        {/* Right side - Dashboard preview */}
        <div className="dashboard-preview">
          <div className="preview-card">
            <div className="preview-header">
              <div className="header-left">
                <h2 className="preview-title">Student Dashboard</h2>
                <span className="preview-badge">Live Preview</span>
              </div>
              <div className="header-dots">
                <span></span><span></span><span></span>
              </div>
            </div>

            <div className="preview-content">
              {/* Quick Actions */}
              <div className="quick-actions">
                <div className="action-card">
                  <Icon name="academic-cap" size={24} className="action-icon" />
                  <span>Universities</span>
                </div>
                <div className="action-card">
                  <Icon name="clipboard-document-list" size={24} className="action-icon" />
                  <span>Applications</span>
                </div>
                <div className="action-card">
                  <Icon name="document" size={24} className="action-icon" />
                  <span>Documents</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="progress-section">
                <div className="progress-header">
                  <h3>Application Progress</h3>
                  <span className="progress-percentage">75%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill"></div>
                </div>
                <div className="progress-steps">
                  <div className="step completed">
                    <Icon name="check" size={14} />
                    <span>Documents</span>
                  </div>
                  <div className="step completed">
                    <Icon name="check" size={14} />
                    <span>IELTS</span>
                  </div>
                  <div className="step active">
                    <Icon name="edit" size={14} />
                    <span>Application</span>
                  </div>
                  <div className="step">
                    <Icon name="visa" size={14} />
                    <span>Visa</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="stats-grid">
                <div className="stat-card">
                  <Icon name="university" size={20} className="stat-icon" />
                  <div className="stat-info">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Applied</div>
                  </div>
                </div>
                <div className="stat-card">
                  <Icon name="file-text" size={20} className="stat-icon" />
                  <div className="stat-info">
                    <div className="stat-value">12/15</div>
                    <div className="stat-label">Documents</div>
                  </div>
                </div>
                <div className="stat-card highlight">
                  <Icon name="calendar" size={20} className="stat-icon" />
                  <div className="stat-info">
                    <div className="stat-value">Jan 25</div>
                    <div className="stat-label">Next Meeting</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero-section {
          position: relative;
          min-height: calc(100vh - 80px);
          margin-top: 80px;
          background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
          overflow: hidden;
          display: flex;
          align-items: center;
        }

        /* Background Elements */
        .hero-background {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.6;
        }

        .orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, #6366f1 0%, transparent 70%);
          top: -200px;
          right: -200px;
          animation: float 20s ease-in-out infinite;
        }

        .orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, #8b5cf6 0%, transparent 70%);
          bottom: -250px;
          left: -150px;
          animation: float 25s ease-in-out infinite reverse;
        }

        .orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, #ec4899 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: pulse 15s ease-in-out infinite;
        }

        .grid-pattern {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(99, 102, 241, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99, 102, 241, 0.03) 1px, transparent 1px);
          background-size: 50px 50px;
        }

        /* Container */
        .hero-container {
          position: relative;
          z-index: 10;
          max-width: 1400px;
          margin: 0 auto;
          padding: 4rem 2rem;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        /* Left Content */
        .hero-content {
          max-width: 600px;
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(99, 102, 241, 0.1);
          border: 1px solid rgba(99, 102, 241, 0.2);
          border-radius: 2rem;
          color: #a5b4fc;
          font-size: 0.875rem;
          font-weight: 500;
          margin-bottom: 2rem;
        }

        .hero-badge :global(.icon) {
          color: #6366f1;
        }

        .hero-title {
          font-size: clamp(2.5rem, 6vw, 4.5rem);
          font-weight: 900;
          line-height: 1.1;
          color: #ffffff;
          margin-bottom: 1.5rem;
          letter-spacing: -0.02em;
        }

        .title-gradient {
          display: block;
          background: linear-gradient(135deg, #6366f1 0%, #ec4899 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.125rem;
          line-height: 1.7;
          color: #94a3b8;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
          flex-wrap: wrap;
        }

        .btn-primary,
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 0.75rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: pointer;
          border: none;
        }

        .btn-primary {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          color: white;
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 35px rgba(99, 102, 241, 0.35);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.05);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.2);
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 800;
          color: white;
          line-height: 1;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        /* Dashboard Preview */
        .dashboard-preview {
          position: relative;
        }

        .preview-card {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 1.5rem;
          overflow: hidden;
          box-shadow: 
            0 20px 60px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }

        .preview-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .preview-title {
          font-size: 1.125rem;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .preview-badge {
          padding: 0.25rem 0.75rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          color: #4ade80;
          font-size: 0.75rem;
          font-weight: 500;
          border-radius: 1rem;
        }

        .header-dots {
          display: flex;
          gap: 0.5rem;
        }

        .header-dots span {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
        }

        .header-dots span:nth-child(1) { background: #ef4444; }
        .header-dots span:nth-child(2) { background: #f59e0b; }
        .header-dots span:nth-child(3) { background: #22c55e; }

        .preview-content {
          padding: 2rem;
        }

        /* Quick Actions */
        .quick-actions {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .action-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .action-card:hover {
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-2px);
        }

        .action-card :global(.action-icon) {
          color: #6366f1;
        }

        .action-card span {
          font-size: 0.875rem;
          color: #cbd5e1;
        }

        /* Progress Section */
        .progress-section {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 1rem;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .progress-header h3 {
          font-size: 1rem;
          color: white;
          margin: 0;
        }

        .progress-percentage {
          font-size: 1.125rem;
          font-weight: 700;
          color: #6366f1;
        }

        .progress-bar {
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
          margin-bottom: 1.5rem;
        }

        .progress-fill {
          width: 75%;
          height: 100%;
          background: linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 4px;
          animation: progressSlide 1s ease-out;
        }

        .progress-steps {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0.75rem;
        }

        .step {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem;
          border-radius: 0.5rem;
          font-size: 0.75rem;
          color: #64748b;
          background: rgba(255, 255, 255, 0.02);
        }

        .step :global(.icon) {
          flex-shrink: 0;
        }

        .step.completed {
          color: #10b981;
          background: rgba(16, 185, 129, 0.1);
        }

        .step.active {
          color: #6366f1;
          background: rgba(99, 102, 241, 0.1);
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .stat-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 0.75rem;
          transition: all 0.3s ease;
        }

        .stat-card.highlight {
          background: rgba(99, 102, 241, 0.1);
          border-color: rgba(99, 102, 241, 0.2);
        }

        .stat-card :global(.stat-icon) {
          color: #6366f1;
          flex-shrink: 0;
        }

        .stat-info {
          flex: 1;
        }

        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: white;
          line-height: 1;
        }

        .stat-card .stat-label {
          font-size: 0.75rem;
          color: #94a3b8;
          margin-top: 0.25rem;
        }

        /* Animations */
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -30px) scale(1.05); }
          66% { transform: translate(-20px, 20px) scale(0.95); }
        }

        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 0.3; }
        }

        @keyframes progressSlide {
          from { width: 0; }
          to { width: 75%; }
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .hero-section {
            margin-top: 70px;
            min-height: calc(100vh - 70px);
          }

          .hero-container {
            grid-template-columns: 1fr;
            gap: 3rem;
            padding: 3rem 1.5rem;
          }

          .hero-content {
            text-align: center;
            max-width: 100%;
          }

          .hero-actions {
            justify-content: center;
          }

          .hero-stats {
            justify-content: center;
          }

          .dashboard-preview {
            max-width: 600px;
            margin: 0 auto;
          }
        }

        @media (max-width: 768px) {
          .hero-title {
            font-size: clamp(2rem, 8vw, 3.5rem);
          }

          .quick-actions {
            grid-template-columns: 1fr;
          }

          .progress-steps {
            grid-template-columns: repeat(2, 1fr);
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .hero-container {
            padding: 2rem 1rem;
          }

          .hero-actions {
            flex-direction: column;
            width: 100%;
          }

          .btn-primary,
          .btn-secondary {
            width: 100%;
            justify-content: center;
          }

          .hero-stats {
            flex-direction: column;
            gap: 1rem;
            align-items: center;
          }

          .stat-item {
            align-items: center;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .gradient-orb {
            animation: none;
          }
          
          .progress-fill {
            animation: none;
            width: 75%;
          }
        }
      `}</style>
    </section>
  );
};

// Add play icon to Icon component if it doesn't exist
const PlayIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" stroke="none" aria-hidden="true">
    <path d="M8 5v14l11-7z"/>
  </svg>
);

export default HeroSection;