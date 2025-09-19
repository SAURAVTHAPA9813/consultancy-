import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import Icon from '@/components/Icon.jsx';

export default function ConsultantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, branch } = useAuth();
  const { addNotification } = useNotifications();
  
  const [consultant, setConsultant] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [availableStudents, setAvailableStudents] = useState([]);

  const canEdit = user?.role === 'admin';

  useEffect(() => {
    loadConsultantData();
    loadStudents();
  }, [id]);

  const loadConsultantData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Mock consultant data - replace with actual API call
      const mockConsultant = {
        id: parseInt(id),
        name: id === '1' ? 'Dr. Nishan Timilsina' : id === '2' ? 'Jenish Neupane' : 'Sakura Ghimire',
        email: id === '1' ? 'nishan@consultancy.com' : id === '2' ? 'jenish@consultancy.com' : 'sakura@consultancy.com',
        phone: id === '1' ? '+977-9841234567' : id === '2' ? '+977-9857891234' : '+977-9823456789',
        branch: 'Main',
        isActive: true,
        joinedDate: id === '1' ? '2023-01-15' : id === '2' ? '2023-03-20' : '2023-06-10',
        address: 'Kathmandu, Nepal',
        education: id === '1' ? 'PhD in Computer Science, University of Toronto' : 
                  id === '2' ? 'MBA, Australian National University' : 
                  'MA in International Marketing, University of Berlin',
        experience: id === '1' ? '8 years in educational consulting' : 
                   id === '2' ? '6 years in international education' : 
                   '4 years in educational marketing',
        specializations: id === '1' ? ['US Universities', 'Canada Universities', 'Computer Science', 'Engineering'] :
                        id === '2' ? ['Australia Universities', 'UK Universities', 'Business Programs'] :
                        ['Marketing Programs', 'Creative Arts', 'Europe Universities'],
        expertise: id === '1' ? ['STEM Programs', 'Graduate Applications', 'Scholarship Guidance'] :
                  id === '2' ? ['MBA Applications', 'Work Visa Guidance', 'Corporate Partnerships'] :
                  ['Portfolio Development', 'Creative Writing', 'Scholarship Applications'],
        languages: id === '1' ? ['English', 'Nepali', 'Hindi'] :
                  id === '2' ? ['English', 'Nepali'] :
                  ['English', 'Nepali', 'German'],
        assignedStudents: id === '1' ? [1, 2, 4, 7, 12] : id === '2' ? [3, 5, 8, 11] : [6, 9, 10],
        performanceMetrics: {
          totalStudents: id === '1' ? 45 : id === '2' ? 32 : 28,
          activeStudents: id === '1' ? 12 : id === '2' ? 8 : 6,
          successRate: id === '1' ? 89 : id === '2' ? 94 : 86,
          avgResponseTime: id === '1' ? '2.3 hours' : id === '2' ? '1.8 hours' : '3.1 hours',
          completedApplications: id === '1' ? 38 : id === '2' ? 28 : 22,
          pendingApplications: id === '1' ? 7 : id === '2' ? 4 : 6,
          monthlyTarget: id === '1' ? 15 : id === '2' ? 12 : 10,
          monthlyCompleted: id === '1' ? 11 : id === '2' ? 14 : 8,
          studentSatisfaction: id === '1' ? 4.8 : id === '2' ? 4.9 : 4.6,
          avgProcessingTime: id === '1' ? '3.2 weeks' : id === '2' ? '2.8 weeks' : '4.1 weeks'
        },
      availability: {
          monday: id === '1' ? ['09:00', '17:00'] : id === '2' ? ['10:00', '18:00'] : ['09:00', '16:00'],
          tuesday: id === '1' ? ['09:00', '17:00'] : id === '2' ? ['10:00', '18:00'] : ['09:00', '16:00'],
          wednesday: id === '1' ? ['09:00', '17:00'] : id === '2' ? ['10:00', '18:00'] : ['09:00', '16:00'],
          thursday: id === '1' ? ['09:00', '17:00'] : id === '2' ? ['10:00', '18:00'] : ['09:00', '16:00'],
          friday: id === '1' ? ['09:00', '17:00'] : id === '2' ? ['10:00', '18:00'] : ['09:00', '16:00'],
          saturday: id === '1' ? ['10:00', '14:00'] : id === '3' ? ['10:00', '13:00'] : [],
          sunday: []
        },
        bio: id === '1' ? 'Experienced consultant specializing in North American universities with expertise in STEM programs.' :
             id === '2' ? 'Business-focused consultant with strong connections to Australian and UK institutions.' :
             'Creative programs specialist with extensive European university network.',
        recentActivity: [
          { id: 1, type: 'student_assigned', message: 'New student assigned', date: '2024-12-20T10:30:00Z' },
          { id: 2, type: 'application_completed', message: 'Application completed for University of Toronto', date: '2024-12-19T14:20:00Z' },
          { id: 3, type: 'meeting_scheduled', message: 'Consultation meeting scheduled', date: '2024-12-18T09:15:00Z' },
          { id: 4, type: 'document_reviewed', message: 'SOP document reviewed and approved', date: '2024-12-17T16:45:00Z' }
        ]
      };

      setConsultant(mockConsultant);
    } catch (err) {
      setError('Failed to load consultant data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await api.leads.list();
      setStudents(data);
      
      // Filter available students for assignment
      const consultantStudentIds = consultant?.assignedStudents || [];
      const available = data.filter(student => !consultantStudentIds.includes(student.id));
      setAvailableStudents(available);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const getAssignedStudents = () => {
    if (!consultant?.assignedStudents) return [];
    return students.filter(student => consultant.assignedStudents.includes(student.id));
  };

  const handleAssignStudent = async (studentId) => {
    try {
      const updatedConsultant = {
        ...consultant,
        assignedStudents: [...consultant.assignedStudents, studentId]
      };
      setConsultant(updatedConsultant);
      setShowAssignModal(false);
      
      addNotification({
        type: 'success',
        title: 'Student Assigned',
        message: 'Student has been assigned to consultant',
        category: 'consultants'
      });
    } catch (err) {
      console.error('Failed to assign student:', err);
    }
  };

  const handleUnassignStudent = async (studentId) => {
    if (!window.confirm('Are you sure you want to unassign this student?')) return;
    
    try {
      const updatedConsultant = {
        ...consultant,
        assignedStudents: consultant.assignedStudents.filter(id => id !== studentId)
      };
      setConsultant(updatedConsultant);
      
      addNotification({
        type: 'success',
        title: 'Student Unassigned',
        message: 'Student has been unassigned from consultant',
        category: 'consultants'
      });
    } catch (err) {
      console.error('Failed to unassign student:', err);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  const getDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const getCompletionRate = () => {
    const metrics = consultant?.performanceMetrics;
    if (!metrics || !metrics.monthlyTarget) return 0;
    return Math.round((metrics.monthlyCompleted / metrics.monthlyTarget) * 100);
  };

  if (loading) {
    return (
      <div className="consultant-detail">
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading consultant profile...</p>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="consultant-detail">
        <div className="error-state">
          <Icon name="x-mark" size={24} />
          <p>{error || 'Consultant not found'}</p>
          <button onClick={() => navigate('/consultants')} className="action-button">
            Back to Consultants
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* INLINE STYLES */}
      <style>{`
        .consultant-detail {
          padding: var(--space-6, 24px);
          max-width: 1400px;
          margin: 0 auto;
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4, 16px);
          margin-bottom: var(--space-6, 24px);
          padding-bottom: var(--space-4, 16px);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .detail-header__info {
          flex: 1;
          display: flex;
          gap: var(--space-4, 16px);
        }

        .consultant-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--color-primary, #2563eb);
          display: grid;
          place-items: center;
          color: white;
          font-weight: 600;
          font-size: 28px;
          flex-shrink: 0;
        }

        .consultant-info h1 {
          margin: 0 0 var(--space-1, 4px) 0;
          font-size: var(--font-2xl, 24px);
          font-weight: var(--font-bold, 700);
          color: var(--color-text, #111827);
        }

        .consultant-info__subtitle {
          margin: 0 0 var(--space-2, 8px) 0;
          color: var(--color-text-muted, #6b7280);
          font-size: var(--font-sm, 14px);
        }

        .consultant-info__meta {
          display: flex;
          gap: var(--space-4, 16px);
          flex-wrap: wrap;
          align-items: center;
        }

        .status-active {
          color: #16a34a;
          font-weight: 500;
        }

        .detail-actions {
          display: flex;
          gap: var(--space-2, 8px);
          flex-wrap: wrap;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.55rem 0.85rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
          font-weight: var(--font-medium, 500);
          cursor: pointer;
          transition: all 0.12s ease;
          text-decoration: none;
        }

        .action-button:hover {
          transform: translateY(-1px);
          background: var(--color-surface-hover, #f9fafb);
        }

        .action-button--primary {
          background: var(--color-primary, #2563eb);
          border-color: var(--color-primary, #2563eb);
          color: var(--color-text-inverse, #fff);
        }

        .action-button--primary:hover {
          background: var(--color-primary-dark, #1e40af);
          border-color: var(--color-primary-dark, #1e40af);
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border, #e5e7eb);
          margin-bottom: var(--space-6, 24px);
        }

        .tab {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          border: none;
          background: transparent;
          color: var(--color-text-muted, #6b7280);
          font-weight: var(--font-medium, 500);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.12s ease;
        }

        .tab:hover {
          color: var(--color-text, #111827);
        }

        .tab--active {
          color: var(--color-primary, #2563eb);
          border-bottom-color: var(--color-primary, #2563eb);
        }

        .tab-content {
          display: grid;
          gap: var(--space-6, 24px);
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--space-6, 24px);
        }

        .detail-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
        }

        .detail-card__header {
          padding: var(--space-4, 16px) var(--space-5, 20px);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-card__title {
          margin: 0;
          font-size: var(--font-lg, 18px);
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-card__body {
          padding: var(--space-5, 20px);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4, 16px);
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-1, 4px);
        }

        .info-item__label {
          font-size: var(--font-xs, 12px);
          font-weight: var(--font-medium, 500);
          color: var(--color-text-muted, #6b7280);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item__value {
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--space-4, 16px);
        }

        .metric-card {
          text-align: center;
          padding: var(--space-4, 16px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-bg, #f9fafb);
        }

        .metric-card__value {
          font-size: var(--font-2xl, 24px);
          font-weight: var(--font-bold, 700);
          color: var(--color-primary, #2563eb);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .metric-card__label {
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
          margin: 0;
        }

        .metric-card--success .metric-card__value {
          color: #16a34a;
        }

        .metric-card--warning .metric-card__value {
          color: #ea580c;
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: var(--space-2, 8px);
        }

        .tag {
          background: var(--color-bg, #f3f4f6);
          color: var(--color-text, #374151);
          padding: 0.25rem 0.5rem;
          border-radius: var(--radius-sm, 6px);
          font-size: var(--font-xs, 12px);
          font-weight: var(--font-medium, 500);
        }

        .tag--primary {
          background: var(--color-primary, #2563eb);
          color: white;
        }

        .student-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 12px);
        }

        .student-item {
          display: flex;
          align-items: center;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          transition: all 0.12s ease;
        }

        .student-item:hover {
          background: var(--color-surface-hover, #f9fafb);
        }

        .student-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--color-primary, #2563eb);
          display: grid;
          place-items: center;
          color: white;
          font-weight: 600;
          font-size: 16px;
          flex-shrink: 0;
        }

        .student-info {
          flex: 1;
        }

        .student-info h4 {
          margin: 0 0 var(--space-1, 4px) 0;
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
        }

        .student-info p {
          margin: 0;
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
        }

        .student-actions {
          display: flex;
          gap: var(--space-1, 4px);
        }

        .btn-small {
          padding: 0.25rem 0.5rem;
          font-size: var(--font-xs, 12px);
          border-radius: var(--radius-sm, 6px);
        }

        .schedule-grid {
          display: grid;
          gap: var(--space-2, 8px);
        }

        .schedule-day {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-3, 12px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
        }

        .schedule-day__name {
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
          min-width: 80px;
        }

        .schedule-day__time {
          color: var(--color-text-muted, #6b7280);
          font-size: var(--font-sm, 14px);
        }

        .schedule-day--unavailable {
          opacity: 0.5;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 12px);
        }

        .activity-item {
          display: flex;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          border-left: 3px solid var(--color-primary, #2563eb);
          background: var(--color-bg, #f9fafb);
          border-radius: 0 var(--radius-md, 8px) var(--radius-md, 8px) 0;
        }

        .activity-item__icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-primary, #2563eb);
          display: grid;
          place-items: center;
          color: white;
          flex-shrink: 0;
        }

        .activity-item__content {
          flex: 1;
        }

        .activity-item__message {
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .activity-item__time {
          font-size: var(--font-xs, 12px);
          color: var(--color-text-muted, #6b7280);
          margin: 0;
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          color: var(--color-text-muted, #6b7280);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.45);
          display: grid;
          place-items: center;
          padding: var(--space-6, 24px);
          z-index: 9999;
        }

        .modal-content {
          width: min(500px, 86vw);
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-xl, 14px);
          box-shadow: var(--shadow-xl, 0 20px 40px rgba(0, 0, 0, 0.18));
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--space-4, 16px);
          padding: var(--space-4, 16px) var(--space-5, 20px);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .modal-close {
          appearance: none;
          background: transparent;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          padding: 0.35rem 0.55rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
        }

        .modal-close:hover {
          background: var(--color-surface-hover, #f9fafb);
        }

        .modal-body {
          padding: var(--space-5, 20px);
          max-height: min(70vh, 400px);
          overflow: auto;
        }

        @media (max-width: 768px) {
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .detail-header__info {
            flex-direction: column;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .metrics-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="consultant-detail">
        {/* Header */}
        <div className="detail-header">
          <div className="detail-header__info">
            <div className="consultant-avatar">
              {consultant.name.charAt(0).toUpperCase()}
            </div>
            <div className="consultant-info">
              <h1>{consultant.name}</h1>
              <p className="consultant-info__subtitle">{consultant.education}</p>
              <div className="consultant-info__meta">
                <span className="status-active">Active Consultant</span>
                <span>{consultant.assignedStudents.length} assigned students</span>
                <span>Joined {formatDate(consultant.joinedDate)}</span>
              </div>
            </div>
          </div>
          
          <div className="detail-actions">
            <Link to="/consultants" className="action-button">
              <Icon name="arrow-left" size={16} />
              Back to Consultants
            </Link>
            
            {canEdit && (
              <>
                <button 
                  className="action-button action-button--primary"
                  onClick={() => setShowAssignModal(true)}
                >
                  <Icon name="plus" size={16} />
                  Assign Student
                </button>
                
                <Link 
                  to={`/consultants/${consultant.id}/schedule`}
                  className="action-button"
                >
                  <Icon name="calendar" size={16} />
                  Manage Schedule
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'overview' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`tab ${activeTab === 'students' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Assigned Students
          </button>
          <button 
            className={`tab ${activeTab === 'performance' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('performance')}
          >
            Performance Analytics
          </button>
          <button 
            className={`tab ${activeTab === 'schedule' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            Schedule & Availability
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'overview' && (
            <div className="detail-grid">
              <div>
                <div className="detail-card">
                  <div className="detail-card__header">
                    <h3 className="detail-card__title">
                      <Icon name="user" size={20} />
                      Professional Profile
                    </h3>
                  </div>
                  <div className="detail-card__body">
                    <div className="info-grid">
                      <div className="info-item">
                        <span className="info-item__label">Email</span>
                        <span className="info-item__value">{consultant.email}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-item__label">Phone</span>
                        <span className="info-item__value">{consultant.phone}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-item__label">Branch</span>
                        <span className="info-item__value">{consultant.branch}</span>
                      </div>
                      <div className="info-item">
                        <span className="info-item__label">Experience</span>
                        <span className="info-item__value">{consultant.experience}</span>
                      </div>
                    </div>

                    <div style={{ marginTop: '1.5rem' }}>
                      <div className="info-item">
                        <span className="info-item__label">Specializations</span>
                        <div className="tag-list" style={{ marginTop: '0.5rem' }}>
                          {consultant.specializations.map((spec, index) => (
                            <span key={index} className="tag tag--primary">{spec}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <div className="info-item">
                        <span className="info-item__label">Expertise Areas</span>
                        <div className="tag-list" style={{ marginTop: '0.5rem' }}>
                          {consultant.expertise.map((exp, index) => (
                            <span key={index} className="tag">{exp}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: '1rem' }}>
                      <div className="info-item">
                        <span className="info-item__label">Languages</span>
                        <div className="tag-list" style={{ marginTop: '0.5rem' }}>
                          {consultant.languages.map((lang, index) => (
                            <span key={index} className="tag">{lang}</span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {consultant.bio && (
                      <div style={{ marginTop: '1.5rem' }}>
                        <div className="info-item">
                          <span className="info-item__label">Bio</span>
                          <span className="info-item__value">{consultant.bio}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="detail-card">
                  <div className="detail-card__header">
                    <h3 className="detail-card__title">
                      <Icon name="chart" size={20} />
                      Quick Stats
                    </h3>
                  </div>
                  <div className="detail-card__body">
                    <div className="metrics-grid">
                      <div className="metric-card metric-card--success">
                        <div className="metric-card__value">{consultant.performanceMetrics.successRate}%</div>
                        <div className="metric-card__label">Success Rate</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-card__value">{consultant.performanceMetrics.activeStudents}</div>
                        <div className="metric-card__label">Active Students</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-card__value">{consultant.performanceMetrics.completedApplications}</div>
                        <div className="metric-card__label">Completed Apps</div>
                      </div>
                      <div className="metric-card">
                        <div className="metric-card__value">{consultant.performanceMetrics.avgResponseTime}</div>
                        <div className="metric-card__label">Avg Response</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="detail-card" style={{ marginTop: '1.5rem' }}>
                  <div className="detail-card__header">
                    <h3 className="detail-card__title">
                      <Icon name="activity" size={20} />
                      Recent Activity
                    </h3>
                  </div>
                  <div className="detail-card__body">
                    <div className="activity-list">
                      {consultant.recentActivity.map(activity => (
                        <div key={activity.id} className="activity-item">
                          <div className="activity-item__icon">
                            <Icon name={
                              activity.type === 'student_assigned' ? 'users' :
                              activity.type === 'application_completed' ? 'check' :
                              activity.type === 'meeting_scheduled' ? 'calendar' :
                              'document'
                            } size={16} />
                          </div>
                          <div className="activity-item__content">
                            <p className="activity-item__message">{activity.message}</p>
                            <p className="activity-item__time">{formatDateTime(activity.date)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="detail-card">
              <div className="detail-card__header">
                <h3 className="detail-card__title">
                  <Icon name="users" size={20} />
                  Assigned Students ({getAssignedStudents().length})
                </h3>
                {canEdit && (
                  <button 
                    className="action-button action-button--primary"
                    onClick={() => setShowAssignModal(true)}
                  >
                    <Icon name="plus" size={16} />
                    Assign Student
                  </button>
                )}
              </div>
              <div className="detail-card__body">
                <div className="student-list">
                  {getAssignedStudents().map(student => (
                    <div key={student.id} className="student-item">
                      <div className="student-avatar">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="student-info">
                        <h4>
                          <Link to={`/students/${student.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {student.name}
                          </Link>
                        </h4>
                        <p>{student.email} • {student.intendedCountry || 'No country specified'}</p>
                      </div>
                      <div className="student-actions">
                        <Link 
                          to={`/students/${student.id}`}
                          className="action-button btn-small"
                        >
                          View
                        </Link>
                        {canEdit && (
                          <button 
                            className="action-button btn-small"
                            onClick={() => handleUnassignStudent(student.id)}
                            style={{ color: '#ef4444' }}
                          >
                            Unassign
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {getAssignedStudents().length === 0 && (
                    <div style={{ 
                      padding: '3rem 1rem', 
                      textAlign: 'center', 
                      color: 'var(--color-text-muted, #6b7280)' 
                    }}>
                      <Icon name="users" size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                      <p>No students assigned yet</p>
                      {canEdit && (
                        <button 
                          className="action-button action-button--primary"
                          onClick={() => setShowAssignModal(true)}
                          style={{ marginTop: '1rem' }}
                        >
                          Assign First Student
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div>
              <div className="detail-card">
                <div className="detail-card__header">
                  <h3 className="detail-card__title">
                    <Icon name="chart" size={20} />
                    Performance Metrics
                  </h3>
                </div>
                <div className="detail-card__body">
                  <div className="metrics-grid">
                    <div className="metric-card metric-card--success">
                      <div className="metric-card__value">{consultant.performanceMetrics.successRate}%</div>
                      <div className="metric-card__label">Success Rate</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.totalStudents}</div>
                      <div className="metric-card__label">Total Students</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.activeStudents}</div>
                      <div className="metric-card__label">Active Students</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.completedApplications}</div>
                      <div className="metric-card__label">Completed Applications</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.pendingApplications}</div>
                      <div className="metric-card__label">Pending Applications</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.avgResponseTime}</div>
                      <div className="metric-card__label">Avg Response Time</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.avgProcessingTime}</div>
                      <div className="metric-card__label">Avg Processing Time</div>
                    </div>
                    <div className="metric-card metric-card--success">
                      <div className="metric-card__value">{consultant.performanceMetrics.studentSatisfaction}/5</div>
                      <div className="metric-card__label">Student Satisfaction</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="detail-card" style={{ marginTop: '1.5rem' }}>
                <div className="detail-card__header">
                  <h3 className="detail-card__title">
                    <Icon name="target" size={20} />
                    Monthly Performance
                  </h3>
                </div>
                <div className="detail-card__body">
                  <div className="metrics-grid">
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.monthlyTarget}</div>
                      <div className="metric-card__label">Monthly Target</div>
                    </div>
                    <div className="metric-card">
                      <div className="metric-card__value">{consultant.performanceMetrics.monthlyCompleted}</div>
                      <div className="metric-card__label">Completed This Month</div>
                    </div>
                    <div className={`metric-card ${getCompletionRate() >= 100 ? 'metric-card--success' : getCompletionRate() >= 75 ? '' : 'metric-card--warning'}`}>
                      <div className="metric-card__value">{getCompletionRate()}%</div>
                      <div className="metric-card__label">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="detail-card">
              <div className="detail-card__header">
                <h3 className="detail-card__title">
                  <Icon name="calendar" size={20} />
                  Weekly Availability
                </h3>
                <Link 
                  to={`/consultants/${consultant.id}/schedule`}
                  className="action-button"
                >
                  <Icon name="edit" size={16} />
                  Manage Schedule
                </Link>
              </div>
              <div className="detail-card__body">
                <div className="schedule-grid">
                  {Object.entries(consultant.availability).map(([day, hours]) => (
                    <div key={day} className={`schedule-day ${!hours.length ? 'schedule-day--unavailable' : ''}`}>
                      <div className="schedule-day__name">{getDayName(day)}</div>
                      <div className="schedule-day__time">
                        {hours.length ? `${hours[0]} - ${hours[1]}` : 'Unavailable'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Assign Student Modal */}
        {showAssignModal && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Assign Student to {consultant.name}</h3>
                <button className="modal-close" onClick={() => setShowAssignModal(false)}>
                  <Icon name="x-mark" size={16} />
                </button>
              </div>
              <div className="modal-body">
                <div className="student-list">
                  {availableStudents.length > 0 ? (
                    availableStudents.map(student => (
                      <div key={student.id} className="student-item">
                        <div className="student-avatar">
                          {student.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="student-info">
                          <h4>{student.name}</h4>
                          <p>{student.email} • {student.intendedCountry || 'No country specified'}</p>
                        </div>
                        <div className="student-actions">
                          <button 
                            className="action-button action-button--primary btn-small"
                            onClick={() => handleAssignStudent(student.id)}
                          >
                            Assign
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-muted, #6b7280)' }}>
                      No available students to assign
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}