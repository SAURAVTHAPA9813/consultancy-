import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@components/AuthContext.jsx';
import Icon from '@components/Icon';
import PublicHeader from '@components/public/PublicHeader';
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      if (location.state?.email) {
        setLoginData(prev => ({ ...prev, email: location.state.email }));
      }
      setTimeout(() => setSuccessMessage(''), 5000);
    }
  }, [location.state]);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));

    const { email, password } = loginData;

    try {
      login(email, password);
      
      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        if (currentUser.role === 'admin') {
          navigate('/admin', { replace: true });
        } else {
          navigate('/dashboard', { replace: true });
        }
      }, 100);
      
    } catch (loginError) {
      setError(loginError.message || 'Invalid credentials');
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleGoogleLogin = () => {
    console.log('Google login');
  };

  const handleAppleLogin = () => {
    console.log('Apple login');
  };

  return (
    <div className="auth-page">
       <div style={{ height: '90px' }}></div>  
      <PublicHeader minimal={true} />
      <div className="auth-container">
        <div className="auth-card">
          {/* Left Column - Form */}
          <div className="auth-form-column">
            <div className="auth-form-content">
              {/* Logo */}
              <div className="auth-logo">
                <Icon name="academic-cap" size={32} />
                <span className="logo-text">StudyAbroad Pro</span>
              </div>

              {/* Header */}
              <div className="auth-header">
                <h1 className="auth-title">Welcome Back</h1>
                <p className="auth-subtitle">
                  Enter your email and password to access your account
                </p>
              </div>

              {/* Success Message */}
              {successMessage && (
                <div className="success-alert">
                  <Icon name="check" size={16} />
                  <span>{successMessage}</span>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-field">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={loginData.email}
                    onChange={handleChange}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="password" className="form-label">Password</label>
                  <div className="password-input-wrapper">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginData.password}
                      onChange={handleChange}
                      className="form-input"
                      placeholder="Enter your password"
                      required
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                    >
                      <Icon name={showPassword ? 'eye-off' : 'eye'} size={20} />
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="form-helpers">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="checkbox-input"
                    />
                    <span>Remember Me</span>
                  </label>
                  <a href="#" className="forgot-link">Forgot Your Password?</a>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="error-alert">
                    <Icon name="alert-circle" size={16} />
                    <span>{error}</span>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Icon name="loader" size={20} className="spin" />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    'Log In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="auth-divider">
                <span>Or Login With</span>
              </div>

              {/* SSO Buttons */}
              <div className="sso-buttons">
                <button className="sso-btn" onClick={handleGoogleLogin}>
                  <GoogleIcon />
                  <span>Google</span>
                </button>
                <button className="sso-btn" onClick={handleAppleLogin}>
                  <AppleIcon />
                  <span>Apple</span>
                </button>
              </div>

              {/* Sign Up Link */}
              <p className="auth-footer-text">
                Don't Have An Account? <Link to="/register" className="auth-link">Register Now</Link>
              </p>
            </div>
          </div>

          {/* Right Column - Promotional */}
          <div className="auth-promo-column">
            <div className="promo-content">
              <h2 className="promo-title">
                Effortlessly manage your study abroad journey
              </h2>
              <p className="promo-subtitle">
                Log in to access your dashboard and track your university applications, documents, and consultant meetings
              </p>
              
              {/* Dashboard Preview */}
              <div className="dashboard-preview">
                <div className="preview-stats">
                  <div className="stat-card primary">
                    <div className="stat-header">
                      <span className="stat-label">Applications</span>
                      <Icon name="chart" size={16} />
                    </div>
                    <div className="stat-value">12</div>
                    <div className="stat-change positive">+3 this month</div>
                  </div>
                  
                  <div className="stat-card">
                    <div className="stat-header">
                      <span className="stat-label">Universities</span>
                      <Icon name="university" size={16} />
                    </div>
                    <div className="stat-value">5</div>
                  </div>
                </div>

                <div className="preview-chart">
                  <div className="chart-header">Application Progress</div>
                  <div className="chart-bars">
                    <div className="bar" style={{ height: '60%' }}></div>
                    <div className="bar" style={{ height: '80%' }}></div>
                    <div className="bar" style={{ height: '40%' }}></div>
                    <div className="bar" style={{ height: '90%' }}></div>
                    <div className="bar" style={{ height: '70%' }}></div>
                  </div>
                </div>

                <div className="preview-list">
                  <div className="list-item">
                    <Icon name="check" size={14} className="check-icon" />
                    <span>IELTS Score Submitted</span>
                  </div>
                  <div className="list-item">
                    <Icon name="check" size={14} className="check-icon" />
                    <span>Documents Verified</span>
                  </div>
                  <div className="list-item">
                    <Icon name="clock" size={14} className="pending-icon" />
                    <span>Visa Interview Scheduled</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="auth-page-footer">
          <span className="copyright">Copyright © 2025 StudyAbroad Pro LTD.</span>
          <a href="#" className="footer-link">Privacy Policy</a>
        </div>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          padding-top: 72px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f4f6;
          padding: 2rem;
        }

        .auth-container {
          width: 100%;
          max-width: 1200px;
          margin-top: 60px;
        
        }

        .auth-card {
          background: white;
          border-radius: 24px;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          overflow: hidden;
        
          min-height: 700px;
        }


        /* Left Column */
        .auth-form-column {
          padding: 3rem;
          display: flex;
          align-items: center;
        }

        .auth-form-content {
          width: 100%;
          max-width: 420px;
          margin: 0 auto;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 3rem;
        }

        .auth-logo :global(.icon) {
          color: #6366f1;
        }

        .logo-text {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .auth-header {
          margin-bottom: 2rem;
        }

        .auth-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 0.5rem;
        }

        .auth-subtitle {
          color: #6b7280;
          font-size: 1rem;
          margin: 0;
        }

        .success-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #d1fae5;
          border: 1px solid #a7f3d0;
          border-radius: 0.75rem;
          color: #059669;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
        }

        .form-input {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 1rem;
          transition: all 0.2s;
          background: white;
        }

        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        .password-input-wrapper {
          position: relative;
        }

        .password-input-wrapper .form-input {
          padding-right: 3rem;
        }

        .password-toggle {
          position: absolute;
          right: 1rem;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #6b7280;
          cursor: pointer;
          padding: 0;
          display: flex;
          align-items: center;
        }

        .password-toggle:hover {
          color: #4b5563;
        }

        .form-helpers {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #4b5563;
          cursor: pointer;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          border-radius: 4px;
          cursor: pointer;
        }

        .forgot-link {
          font-size: 0.875rem;
          color: #6366f1;
          text-decoration: none;
        }

        .forgot-link:hover {
          text-decoration: underline;
        }

        .error-alert {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 0.75rem;
          color: #dc2626;
          font-size: 0.875rem;
        }

        .submit-btn {
          padding: 0.875rem;
          background: #6366f1;
          color: white;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .submit-btn:hover:not(:disabled) {
          background: #4f46e5;
          transform: translateY(-1px);
          box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .submit-btn :global(.spin) {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .auth-divider {
          position: relative;
          text-align: center;
          margin: 2rem 0;
        }

        .auth-divider::before {
          content: '';
          position: absolute;
          top: 50%;
          left: 0;
          right: 0;
          height: 1px;
          background: #e5e7eb;
        }

        .auth-divider span {
          position: relative;
          padding: 0 1rem;
          background: white;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .sso-buttons {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .sso-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem;
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 0.75rem;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }

        .sso-btn:hover {
          background: #f9fafb;
          border-color: #9ca3af;
        }

        .auth-footer-text {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 2rem;
        }

        .auth-link {
          color: #6366f1;
          font-weight: 600;
          text-decoration: none;
        }

        .auth-link:hover {
          text-decoration: underline;
        }

        /* Right Column */
        .auth-promo-column {
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          padding: 3rem;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .auth-promo-column::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 50px 50px;
          animation: float 20s linear infinite;
        }

        @keyframes float {
          from { transform: translate(0, 0); }
          to { transform: translate(50px, 50px); }
        }

        .promo-content {
          position: relative;
          z-index: 1;
          max-width: 480px;
        }

        .promo-title {
          font-size: 2.25rem;
          font-weight: 700;
          color: white;
          margin: 0 0 1rem;
          line-height: 1.2;
        }

        .promo-subtitle {
          font-size: 1.125rem;
          color: rgba(255, 255, 255, 0.9);
          margin: 0 0 3rem;
          line-height: 1.6;
        }

        .dashboard-preview {
          background: rgba(255, 255, 255, 0.95);
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
        }

        .preview-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .stat-card {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
        }

        .stat-card.primary {
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-color: #bfdbfe;
        }

        .stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-header :global(.icon) {
          color: #9ca3af;
        }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
        }

        .stat-change {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .stat-change.positive {
          color: #10b981;
        }

        .preview-chart {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1.5rem;
        }

        .chart-header {
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          margin-bottom: 1rem;
        }

        .chart-bars {
          display: flex;
          gap: 0.5rem;
          align-items: flex-end;
          height: 80px;
        }

        .bar {
          flex: 1;
          background: linear-gradient(to top, #6366f1, #8b5cf6);
          border-radius: 4px 4px 0 0;
          opacity: 0.8;
        }

        .preview-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .list-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.875rem;
          color: #374151;
        }

        .list-item :global(.check-icon) {
          color: #10b981;
        }

        .list-item :global(.pending-icon) {
          color: #f59e0b;
        }

        /* Footer */
        .auth-page-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
        }

        .copyright {
          font-size: 0.875rem;
          color: #9ca3af;
        }

        .footer-link {
          font-size: 0.875rem;
          color: #9ca3af;
          text-decoration: none;
        }

        .footer-link:hover {
          color: #6b7280;
        }

        /* Responsive */
        @media (max-width: 1024px) {
          .auth-card {
            grid-template-columns: 1fr;
          }

          .auth-promo-column {
            display: none;
          }

          .auth-form-column {
            padding: 2rem;
          }
        }

        @media (max-width: 640px) {
          .auth-page {
            padding: 1rem;
          }

          .auth-card {
            border-radius: 16px;
          }

          .auth-form-column {
            padding: 1.5rem;
          }

          .auth-title {
            font-size: 1.5rem;
          }

          .sso-buttons {
            grid-template-columns: 1fr;
          }

          .auth-page-footer {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

// Google Icon Component
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

// Apple Icon Component
const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.503 12.946c-.021-2.29 1.885-3.41 1.972-3.463-1.08-1.566-2.753-1.78-3.343-1.798-1.408-.146-2.772.843-3.492.843-.733 0-1.84-.826-3.03-.803-1.536.023-2.97.913-3.762 2.303-1.628 2.833-.414 6.989 1.147 9.276.781 1.12 1.697 2.37 2.897 2.326 1.171-.047 1.609-.748 3.021-.748 1.397 0 1.807.748 3.042.722 1.262-.021 2.048-1.126 2.8-2.257.907-1.284 1.272-2.545 1.289-2.61-.03-.009-2.462-1.034-2.484-4.091h-.057zM15.154 5.937c.63-.78 1.063-1.84.944-2.914-.914.04-2.05.63-2.71 1.402-.58.68-1.1 1.795-.967 2.846 1.025.077 2.08-.518 2.733-1.334z"/>
  </svg>
);

// Eye Off Icon - Add to Icon component if not present
const EyeOffIcon = () => (
  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

export default LoginPage;