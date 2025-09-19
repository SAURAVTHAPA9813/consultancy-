import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@components/AuthContext.jsx';
import Icon from '@components/Icon';
import PublicHeader from '@components/public/PublicHeader';
function RegisterPage() {
  const navigate = useNavigate();
  const { isAuthenticated, register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'student',
    acceptTerms: false
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscores only)';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 10) {
      newErrors.phone = 'Phone number must be at least 10 digits';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.acceptTerms) {
      newErrors.acceptTerms = 'You must accept the terms and conditions';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formErrors = validateForm();
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      const result = await register({
        fullName: formData.fullName,
        username: formData.username,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: formData.role
      });

      if (result.success) {
        setSuccessData(result);
        setShowSuccess(true);
        setIsLoading(false);

        setTimeout(() => {
          navigate('/login', { 
            replace: true,
            state: { 
              message: `Account created! Login with: ${result.email}`,
              email: result.email 
            }
          });
        }, 3000);
      }
    } catch (error) {
      setErrors({ submit: error.message });
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  if (showSuccess) {
    return (
      <div className="success-page">
        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <Icon name="check" size={32} />
            </div>
            <h2 className="success-title">Account Created Successfully!</h2>
            <p className="success-message">
              Welcome to our platform! Your account has been created.
            </p>
            {successData && (
              <div className="login-info">
                <strong>Login Details:</strong>
                <div className="login-detail">Email: <strong>{successData.email}</strong></div>
                <div className="login-detail">Username: <strong>{successData.username}</strong></div>
              </div>
            )}
            <p className="redirect-message">
              <Icon name="loader" size={16} className="spin" />
              Redirecting to login page...
            </p>
          </div>
        </div>

        <style jsx>{`
          .success-page {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            padding: 2rem;
          }

          .success-container {
            width: 100%;
            max-width: 480px;
          }

          .success-card {
            background: white;
            border-radius: 24px;
            padding: 3rem;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
            animation: fadeInScale 0.3s ease-out;
          }

          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .success-icon {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 1.5rem;
            color: white;
          }

          .success-title {
            font-size: 1.875rem;
            font-weight: 700;
            color: #111827;
            margin: 0 0 0.75rem;
          }

          .success-message {
            font-size: 1rem;
            color: #6b7280;
            margin: 0 0 2rem;
          }

          .login-info {
            background: #f3f4f6;
            border-radius: 12px;
            padding: 1.5rem;
            margin: 0 0 2rem;
            text-align: left;
          }

          .login-info strong {
            color: #374151;
            display: block;
            margin-bottom: 0.75rem;
          }

          .login-detail {
            color: #6b7280;
            margin: 0.5rem 0;
            font-size: 0.875rem;
          }

          .login-detail strong {
            color: #111827;
            display: inline;
          }

          .redirect-message {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 0.5rem;
            color: #6b7280;
            font-size: 0.875rem;
            margin: 0;
          }

          .redirect-message :global(.spin) {
            animation: spin 1s linear infinite;
          }

          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

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
                <h1 className="auth-title">Create Your Account</h1>
                <p className="auth-subtitle">
                  Join our platform to start your study abroad journey
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="auth-form">
                {/* Full Name */}
                <div className="form-field">
                  <label htmlFor="fullName" className="form-label">Full Name</label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="John Doe"
                    disabled={isLoading}
                  />
                  {errors.fullName && <span className="field-error">{errors.fullName}</span>}
                </div>

                {/* Username and Email Row */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      value={formData.username}
                      onChange={handleChange}
                      className={`form-input ${errors.username ? 'error' : ''}`}
                      placeholder="johndoe"
                      disabled={isLoading}
                    />
                    {errors.username && <span className="field-error">{errors.username}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="john@example.com"
                      disabled={isLoading}
                    />
                    {errors.email && <span className="field-error">{errors.email}</span>}
                  </div>
                </div>

                {/* Phone and Role Row */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="phone" className="form-label">Phone Number</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="+1 (555) 000-0000"
                      disabled={isLoading}
                    />
                    {errors.phone && <span className="field-error">{errors.phone}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="role" className="form-label">I am a</label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="form-input"
                      disabled={isLoading}
                    >
                      <option value="student">Student</option>
                      <option value="consultant">Consultant</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                {/* Password Row */}
                <div className="form-row">
                  <div className="form-field">
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange}
                        className={`form-input ${errors.password ? 'error' : ''}`}
                        placeholder="Min. 6 characters"
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
                    {errors.password && <span className="field-error">{errors.password}</span>}
                  </div>

                  <div className="form-field">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="password-input-wrapper">
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                        placeholder="Repeat password"
                        disabled={isLoading}
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        tabIndex={-1}
                      >
                        <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={20} />
                      </button>
                    </div>
                    {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="form-field">
                  <label className="checkbox-label">
                    <input
                      id="acceptTerms"
                      name="acceptTerms"
                      type="checkbox"
                      checked={formData.acceptTerms}
                      onChange={handleChange}
                      className="checkbox-input"
                      disabled={isLoading}
                    />
                    <span>
                      I agree to the <a href="/terms" className="inline-link">Terms & Conditions</a> and{' '}
                      <a href="/privacy" className="inline-link">Privacy Policy</a>
                    </span>
                  </label>
                  {errors.acceptTerms && <span className="field-error">{errors.acceptTerms}</span>}
                </div>

                {/* Submit Error */}
                {errors.submit && (
                  <div className="error-alert">
                    <Icon name="alert-circle" size={16} />
                    <span>{errors.submit}</span>
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Sign In Link */}
              <p className="auth-footer-text">
                Already have an account? <Link to="/login" className="auth-link">Sign In</Link>
              </p>
            </div>
          </div>

          {/* Right Column - Promotional */}
          <div className="auth-promo-column">
            <div className="promo-content">
              <h2 className="promo-title">
                Start Your Global Education Journey
              </h2>
              <p className="promo-subtitle">
                Join thousands of students who have successfully achieved their dream of studying abroad
              </p>

              {/* Features List */}
              <div className="features-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <Icon name="university" size={24} />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">500+ Universities</h3>
                    <p className="feature-desc">Access top universities across 50+ countries</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <Icon name="users" size={24} />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Expert Consultants</h3>
                    <p className="feature-desc">Get guidance from certified education experts</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <Icon name="shield-check" size={24} />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">98% Success Rate</h3>
                    <p className="feature-desc">Proven track record of successful applications</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <Icon name="visa" size={24} />
                  </div>
                  <div className="feature-content">
                    <h3 className="feature-title">Complete Support</h3>
                    <p className="feature-desc">From application to visa, we've got you covered</p>
                  </div>
                </div>
              </div>

              {/* Testimonial */}
              <div className="testimonial">
                <p className="testimonial-text">
                  "StudyAbroad Pro made my dream of studying in the UK a reality. The platform is intuitive and the consultants are incredibly helpful!"
                </p>
                <div className="testimonial-author">
                  <div className="author-avatar">
                    <Icon name="user" size={20} />
                  </div>
                  <div className="author-info">
                    <p className="author-name">Sarah Johnson</p>
                    <p className="author-role">MSc Student, Oxford University</p>
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
          max-width: 520px;
          margin: 0 auto;
        }

        .auth-logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 2.5rem;
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

        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
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
          width: 100%;
        }

        .form-input:focus {
          outline: none;
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-input.error {
          border-color: #ef4444;
        }

        .form-input:disabled {
          background: #f9fafb;
          cursor: not-allowed;
        }

        select.form-input {
          cursor: pointer;
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

        .field-error {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: -0.25rem;
        }

        .checkbox-label {
          display: flex;
          align-items: flex-start;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #4b5563;
          cursor: pointer;
          line-height: 1.4;
        }

        .checkbox-input {
          width: 16px;
          height: 16px;
          margin-top: 2px;
          cursor: pointer;
          flex-shrink: 0;
        }

        .inline-link {
          color: #6366f1;
          text-decoration: none;
        }

        .inline-link:hover {
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
          margin-top: 0.5rem;
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

        .auth-footer-text {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 1.5rem;
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
          max-width: 420px;
        }

        .promo-title {
          font-size: 2rem;
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

        .features-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
        }

        .feature-item {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .feature-icon :global(.icon) {
          color: white;
        }

        .feature-content {
          flex: 1;
        }

        .feature-title {
          font-size: 1rem;
          font-weight: 600;
          color: white;
          margin: 0 0 0.25rem;
        }

        .feature-desc {
          font-size: 0.875rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
          line-height: 1.4;
        }

        .testimonial {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 16px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .testimonial-text {
          font-size: 0.95rem;
          color: white;
          margin: 0 0 1rem;
          line-height: 1.6;
          font-style: italic;
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .author-avatar :global(.icon) {
          color: white;
        }

        .author-info {
          flex: 1;
        }

        .author-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: white;
          margin: 0;
        }

        .author-role {
          font-size: 0.75rem;
          color: rgba(255, 255, 255, 0.8);
          margin: 0;
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

          .form-row {
            grid-template-columns: 1fr;
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

export default RegisterPage;