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
      <div className="consultant-detail-main">
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading consultant profile...</p>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="consultant-detail-main">
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>
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
      {/* AETHERIAL GLASS STYLES */}
      <style>{`
        /* CSS Variables - Aetherial Glass Design System */
        :root {
          --primary: #6366f1;
          --primary-light: #818cf8;
          --primary-dark: #4f46e5;
          --secondary: #8b5cf6;
          --secondary-light: #a78bfa;
          --success: #10b981;
          --warning: #f59e0b;
          --danger: #ef4444;
          --info: #06b6d4;
          --dark: #0f172a;
          --dark-secondary: #1e293b;
          --dark-tertiary: #334155;
          --glass-bg: rgba(15, 23, 42, 0.6);
          --glass-bg-light: rgba(30, 41, 59, 0.4);
          --glass-border: rgba(148, 163, 184, 0.15);
          --text: #e2e8f0;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --border: rgba(148, 163, 184, 0.1);
          --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
          --shadow-glow: 0 0 40px rgba(99, 102, 241, 0.3);
        }

        /* Animated Background */
        .animated-bg {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: float 20s infinite ease-in-out;
        }

        .orb1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
          top: -200px;
          right: -200px;
          opacity: 0.2;
        }

        .orb2 {
          width: 800px;
          height: 800px;
          background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
          bottom: -300px;
          left: -300px;
          opacity: 0.15;
          animation-delay: -10s;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(30px, -30px) rotate(90deg); }
          50% { transform: translate(-20px, 20px) rotate(180deg); }
          75% { transform: translate(-30px, -20px) rotate(270deg); }
        }

        .consultant-detail-main {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
          color: var(--text);
          position: relative;
        }

        .consultant-detail {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .detail-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 2rem;
          padding: 2rem;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
        }

        .detail-header__info {
          flex: 1;
          display: flex;
          gap: 1.5rem;
        }

        .consultant-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: grid;
          place-items: center;
          color: white;
          font-weight: 600;
          font-size: 28px;
          flex-shrink: 0;
          box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        }

        .consultant-info h1 {
          margin: 0 0 0.5rem 0;
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text) 0%, var(--primary) 50%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .consultant-info__subtitle {
          margin: 0 0 0.75rem 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .consultant-info__meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
          align-items: center;
        }

        .status-active {
          color: var(--success);
          font-weight: 500;
        }

        .detail-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .action-button:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .action-button--primary {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .action-button--primary:hover {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
        }

        .tabs {
          display: flex;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 0.5rem;
          margin-bottom: 2rem;
          box-shadow: var(--shadow-card);
        }

        .tab {
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          font-weight: 500;
          cursor: pointer;
          border-radius: 12px;
          transition: all 0.3s ease;
          flex: 1;
          text-align: center;
        }

        .tab:hover {
          color: var(--text);
          background: var(--glass-bg-light);
        }

        .tab--active {
          color: white;
          background: var(--primary);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .tab-content {
          display: grid;
          gap: 2rem;
        }

        .detail-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
        }

        .detail-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .detail-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: var(--shadow-glow), var(--shadow-card);
        }

        .detail-card__header {
          padding: 1.5rem 2rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .detail-card__title {
          margin: 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .detail-card__body {
          padding: 2rem;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-item__label {
          font-size: 12px;
          font-weight: 500;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item__value {
          font-weight: 500;
          color: var(--text);
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .metric-card {
          text-align: center;
          padding: 1.5rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .metric-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
        }

        .metric-card__value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 0.25rem 0;
        }

        .metric-card__label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .metric-card--success .metric-card__value {
          color: var(--success);
        }

        .metric-card--warning .metric-card__value {
          color: var(--warning);
        }

        .tag-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag {
          background: var(--glass-bg-light);
          color: var(--text-secondary);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          border: 1px solid var(--glass-border);
        }

        .tag--primary {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .student-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .student-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .student-item:hover {
          transform: translateX(4px);
          border-color: var(--primary);
        }

        .student-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
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
          margin: 0 0 0.25rem 0;
          font-weight: 600;
          color: var(--text);
        }

        .student-info h4 a {
          color: inherit;
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .student-info h4 a:hover {
          color: var(--primary);
        }

        .student-info p {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .student-actions {
          display: flex;
          gap: 0.5rem;
        }

        .btn-small {
          padding: 0.5rem 0.75rem;
          font-size: 12px;
          border-radius: 8px;
        }

        .schedule-grid {
          display: grid;
          gap: 0.75rem;
        }

        .schedule-day {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
        }

        .schedule-day__name {
          font-weight: 500;
          color: var(--text);
          min-width: 80px;
        }

        .schedule-day__time {
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .schedule-day--unavailable {
          opacity: 0.5;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-left: 3px solid var(--primary);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          transform: translateX(4px);
          border-color: var(--primary);
        }

        .activity-item__icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--primary);
          display: grid;
          place-items: center;
          color: white;
          flex-shrink: 0;
        }

        .activity-item__content {
          flex: 1;
        }

        .activity-item__message {
          font-weight: 500;
          color: var(--text);
          margin: 0 0 0.25rem 0;
        }

        .activity-item__time {
          font-size: 12px;
          color: var(--text-muted);
          margin: 0;
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          color: var(--text-secondary);
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
        }

        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          padding: 1.5rem;
          z-index: 9999;
        }

        .modal-content {
          width: min(500px, 86vw);
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          color: var(--text);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .modal-header h3 {
          margin: 0;
          color: var(--text);
          font-size: 1.25rem;
          font-weight: 600;
        }

        .modal-close {
          appearance: none;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: var(--primary);
          color: white;
          border-color: var(--primary);
        }

        .modal-body {
          padding: 1.5rem;
          max-height: min(70vh, 400px);
          overflow: auto;
        }

        @media (max-width: 768px) {
          .consultant-detail {
            padding: 1rem;
          }
          
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

      <div className="consultant-detail-main">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>

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
                            <Link to={`/students/${student.id}`}>
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
                              style={{ color: 'var(--danger)' }}
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
                        color: 'var(--text-secondary)' 
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
                      <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No available students to assign
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}