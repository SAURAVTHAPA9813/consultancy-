// src/components/FeaturesSection.jsx
import React from 'react';
import Icon from '@/components/Icon.jsx';

const FeaturesSection = () => {
  const features = [
    {
      icon: 'university',
      title: 'University Applications',
      description: 'Apply to multiple universities worldwide with guided assistance from expert consultants.',
      color: '#6366f1'
    },
    {
      icon: 'clipboard-document-list',
      title: 'Document Management',
      description: 'Secure upload and tracking of all required documents including transcripts, IELTS, and recommendations.',
      color: '#8b5cf6'
    },
    {
      icon: 'consultant',
      title: 'Expert Consultants',
      description: 'Connect with certified education consultants who specialize in your target countries.',
      color: '#ec4899'
    },
    {
      icon: 'chart',
      title: 'Progress Tracking',
      description: 'Real-time tracking of your application status from submission to visa approval.',
      color: '#10b981'
    },
    {
      icon: 'messages',
      title: 'Direct Communication',
      description: 'Built-in messaging system to communicate directly with your assigned consultant.',
      color: '#f59e0b'
    },
    {
      icon: 'visa',
      title: 'Visa Support',
      description: 'Complete visa application guidance and support throughout the entire process.',
      color: '#3b82f6'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">Everything You Need for Study Abroad Success</h2>
          <p className="features-subtitle">
            Our comprehensive platform provides all the tools and support needed to make your study abroad dreams a reality.
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon-wrapper" style={{ '--icon-color': feature.color }}>
                <div className="icon-background"></div>
                <Icon name={feature.icon} className="feature-icon" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .features-section {
          padding: 6rem 0;
          background: linear-gradient(180deg, #ffffff 0%, #f8fafc 50%, #ffffff 100%);
          position: relative;
          overflow: hidden;
        }

        .features-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 200%;
          height: 100%;
          background-image: radial-gradient(circle at 1px 1px, #e2e8f0 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.3;
          pointer-events: none;
        }

        .features-container {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          position: relative;
          z-index: 1;
        }

        .features-header {
          text-align: center;
          margin-bottom: 5rem;
          max-width: 700px;
          margin-left: auto;
          margin-right: auto;
        }

        .features-title {
          font-size: clamp(2.25rem, 4vw, 3.5rem);
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 1.5rem;
          line-height: 1.1;
          letter-spacing: -0.02em;
          position: relative;
        }

        .features-subtitle {
          font-size: 1.125rem;
          color: #475569;
          line-height: 1.7;
          font-weight: 400;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
          gap: 2rem;
          margin-top: 4rem;
        }

        .feature-card {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 2.5rem;
          text-align: center;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--icon-color), transparent);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.08),
            0 0 0 1px var(--icon-color);
          border-color: transparent;
        }

        .feature-card:hover::before {
          opacity: 1;
        }

        .feature-card:hover .icon-background {
          transform: scale(1.1) rotate(10deg);
          opacity: 0.2;
        }

        .feature-card:hover .feature-icon {
          transform: scale(1.1);
        }

        .feature-icon-wrapper {
          position: relative;
          width: 80px;
          height: 80px;
          margin: 0 auto 2rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .icon-background {
          position: absolute;
          inset: 0;
          background: var(--icon-color);
          border-radius: 20px;
          opacity: 0.1;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .feature-icon {
          position: relative;
          z-index: 1;
          color: var(--icon-color);
          transition: transform 0.3s ease;
          width: 48px;
          height: 48px;
        }

        .feature-title {
          font-size: 1.375rem;
          font-weight: 700;
          color: #0f172a;
          margin-bottom: 1rem;
          letter-spacing: -0.01em;
        }

        .feature-description {
          color: #475569;
          line-height: 1.7;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .features-section {
            padding: 4rem 0;
          }

          .features-container {
            padding: 0 1.5rem;
          }

          .features-header {
            margin-bottom: 3rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
            margin-top: 3rem;
          }

          .feature-card {
            padding: 2rem;
          }

          .feature-icon-wrapper {
            width: 70px;
            height: 70px;
            margin-bottom: 1.5rem;
          }

          .feature-icon {
            width: 40px;
            height: 40px;
          }
        }

        @media (max-width: 480px) {
          .features-container {
            padding: 0 1rem;
          }

          .feature-card {
            padding: 1.75rem;
            border-radius: 16px;
          }

          .features-title {
            font-size: clamp(1.75rem, 6vw, 2.5rem);
          }

          .feature-title {
            font-size: 1.25rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .feature-card,
          .icon-background,
          .feature-icon {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
};

export default FeaturesSection;