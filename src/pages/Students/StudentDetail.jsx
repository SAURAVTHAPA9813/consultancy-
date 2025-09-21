import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import Icon from '@/components/Icon.jsx';

export default function StudentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, branch } = useAuth();
  const { addNotification } = useNotifications();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [showCommunicationModal, setShowCommunicationModal] = useState(false);
  
  // Mock data - replace with API calls
  const [applications, setApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [communications, setCommunications] = useState([]);
  const [consultants, setConsultants] = useState([]);

  const canEdit = user?.role === 'admin' || user?.role === 'consultant';

  useEffect(() => {
    loadStudentData();
    loadApplications();
    loadDocuments();
    loadCommunications();
    loadConsultants();
  }, [id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.students.get(id);
      setStudent(data);
    } catch (err) {
      setError('Failed to load student data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    setApplications([
      {
        id: 1,
        type: 'University Application',
        university: 'University of Toronto',
        program: 'Computer Science',
        status: 'submitted',
        deadline: '2025-01-15',
        submittedDate: '2024-12-20',
        documents: ['transcript', 'sop', 'lor']
      },
      {
        id: 2,
        type: 'Visa Application',
        country: 'Canada',
        status: 'in-progress',
        deadline: '2025-03-01',
        submittedDate: null,
        documents: ['passport', 'financial-proof']
      }
    ]);
  };

  const loadDocuments = async () => {
    setDocuments([
      {
        id: 1,
        name: 'Academic Transcript',
        type: 'transcript',
        status: 'approved',
        uploadedDate: '2024-12-01',
        size: '2.4 MB',
        url: '#'
      },
      {
        id: 2,
        name: 'Statement of Purpose',
        type: 'sop',
        status: 'pending-review',
        uploadedDate: '2024-12-15',
        size: '1.8 MB',
        url: '#'
      },
      {
        id: 3,
        name: 'IELTS Certificate',
        type: 'test-score',
        status: 'approved',
        uploadedDate: '2024-11-20',
        size: '0.8 MB',
        url: '#'
      }
    ]);
  };

  const loadCommunications = async () => {
    setCommunications([
      {
        id: 1,
        type: 'email',
        from: 'Dr. Nishan Timilsina',
        subject: 'University Selection Discussion',
        message: 'Based on your profile, I recommend applying to University of Toronto and McGill University for Computer Science programs.',
        date: '2024-12-18T10:30:00Z',
        read: true
      },
      {
        id: 2,
        type: 'note',
        from: 'System',
        subject: 'Document Upload Reminder',
        message: 'Reminder: Please upload your recommendation letters by December 25th.',
        date: '2024-12-16T14:00:00Z',
        read: true
      },
      {
        id: 3,
        type: 'call',
        from: 'Dr. Nishan Timilsina',
        subject: 'Initial Consultation Call',
        message: 'Discussed student goals, timeline, and budget. Student interested in Computer Science programs in Canada.',
        date: '2024-12-10T09:00:00Z',
        read: true
      }
    ]);
  };

  const loadConsultants = async () => {
    setConsultants([
      { id: 1, name: 'Dr. Nishan Timilsina', specialization: 'US/Canada Programs' },
      { id: 2, name: 'Jenish Neupane', specialization: 'Australia/UK Programs' },
      { id: 3, name: 'Sakura Ghimire', specialization: 'Marketing & Business' }
    ]);
  };

  const handleAssignConsultant = async (consultantId) => {
    try {
      const consultant = consultants.find(c => c.id === consultantId);
      const updated = await api.leads.update(id, {
        ...student,
        assignedConsultant: consultant.name,
        consultantId: consultantId
      });
      setStudent(updated);
      setShowAssignModal(false);
      addNotification({
        type: 'success',
        title: 'Consultant Assigned',
        message: `${consultant.name} has been assigned to ${student.name}`,
        category: 'students'
      });
    } catch (err) {
      setError('Failed to assign consultant');
      console.error(err);
    }
  };

  const handleDocumentUpload = (documentData) => {
    const newDoc = {
      id: Date.now(),
      ...documentData,
      uploadedDate: new Date().toISOString(),
      status: 'pending-review'
    };
    setDocuments(prev => [newDoc, ...prev]);
    setShowDocumentModal(false);
    addNotification({
      type: 'success',
      title: 'Document Uploaded',
      message: `${documentData.name} has been uploaded successfully`,
      category: 'documents'
    });
  };

  const handleAddCommunication = (commData) => {
    const newComm = {
      id: Date.now(),
      from: user.username,
      date: new Date().toISOString(),
      read: false,
      ...commData
    };
    setCommunications(prev => [newComm, ...prev]);
    setShowCommunicationModal(false);
    addNotification({
      type: 'success',
      title: 'Communication Added',
      message: 'New communication record has been added',
      category: 'communications'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'green';
      case 'submitted': return 'blue';
      case 'in-progress': return 'yellow';
      case 'pending-review': return 'orange';
      case 'rejected': return 'red';
      default: return 'gray';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className="student-detail-main">
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="student-detail-main">
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>
        <div className="error-state">
          <Icon name="x-mark" size={24} />
          <p>{error || 'Student not found'}</p>
          <button onClick={() => navigate('/students')} className="action-button">
            Back to Students
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

        .student-detail-main {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
          color: var(--text);
          position: relative;
        }

        .student-detail {
          padding: 2rem;
          max-width: 1200px;
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
        }

        .detail-header__title {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text) 0%, var(--primary) 50%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .detail-header__subtitle {
          margin: 0 0 0.5rem 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .detail-header__meta {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
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

        .action-button--secondary {
          background: var(--glass-bg);
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
          grid-template-columns: 1fr 320px;
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

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 500;
          backdrop-filter: blur(20px);
          border: 1px solid transparent;
        }

        .status-pill--green { background: rgba(16, 185, 129, 0.2); color: var(--success); border-color: rgba(16, 185, 129, 0.3); }
        .status-pill--blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; border-color: rgba(59, 130, 246, 0.3); }
        .status-pill--yellow { background: rgba(245, 158, 11, 0.2); color: var(--warning); border-color: rgba(245, 158, 11, 0.3); }
        .status-pill--orange { background: rgba(249, 115, 22, 0.2); color: #fb923c; border-color: rgba(249, 115, 22, 0.3); }
        .status-pill--red { background: rgba(239, 68, 68, 0.2); color: var(--danger); border-color: rgba(239, 68, 68, 0.3); }
        .status-pill--gray { background: var(--glass-bg-light); color: var(--text-secondary); border-color: var(--glass-border); }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .timeline-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }

        .timeline-item:hover {
          transform: translateX(4px);
          border-color: var(--primary);
        }

        .timeline-item__icon {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          flex-shrink: 0;
        }

        .timeline-item__content {
          flex: 1;
        }

        .timeline-item__title {
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem 0;
        }

        .timeline-item__subtitle {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0 0 0.25rem 0;
        }

        .timeline-item__meta {
          font-size: 12px;
          color: var(--text-muted);
        }

        .document-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .document-item {
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

        .document-item:hover {
          transform: translateX(4px);
          border-color: var(--primary);
        }

        .document-item__icon {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
        }

        .document-item__content {
          flex: 1;
        }

        .document-item__name {
          font-weight: 500;
          color: var(--text);
          margin: 0 0 0.25rem 0;
        }

        .document-item__meta {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .communication-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .communication-item {
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .communication-item:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
        }

        .communication-item__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .communication-item__title {
          font-weight: 600;
          color: var(--text);
          margin: 0;
        }

        .communication-item__meta {
          font-size: 0.875rem;
          color: var(--text-secondary);
        }

        .communication-item__message {
          color: var(--text);
          line-height: 1.5;
        }

        .progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .progress-item {
          text-align: center;
          padding: 1.5rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .progress-item:hover {
          transform: translateY(-4px);
          border-color: var(--primary);
        }

        .progress-item__value {
          font-size: 1.75rem;
          font-weight: 700;
          color: var(--primary);
          margin: 0 0 0.25rem 0;
        }

        .progress-item__label {
          font-size: 0.875rem;
          color: var(--text-secondary);
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
          width: min(520px, 86vw);
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
          max-height: min(70vh, 560px);
          overflow: auto;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-label {
          display: block;
          font-weight: 500;
          color: var(--text);
          margin-bottom: 0.25rem;
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text);
          transition: all 0.3s ease;
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: var(--text-muted);
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        @media (max-width: 768px) {
          .student-detail {
            padding: 1rem;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
          
          .detail-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
          
          .progress-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>

      <div className="student-detail-main">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>

        <div className="student-detail">
          {/* Header */}
          <div className="detail-header">
            <div className="detail-header__info">
              <h1 className="detail-header__title">{student.name}</h1>
              <p className="detail-header__subtitle">Student ID: {student.id} • Branch: {student.branch || 'Main'}</p>
              <div className="detail-header__meta">
                <span className={`status-pill status-pill--${getStatusColor(student.status)}`}>
                  {student.status}
                </span>
                {student.assignedConsultant && (
                  <span>Consultant: {student.assignedConsultant}</span>
                )}
                <span>Created: {formatDate(student.createdAt)}</span>
              </div>
            </div>
            
            <div className="detail-actions">
              <Link to={`/students/${student.id}/applications`} className="action-button action-button--primary">
                <Icon name="clipboard" size={16} />
                Applications
              </Link>
              <Link to="/students" className="action-button">
                <Icon name="arrow-left" size={16} />
                Back to Students
              </Link>
              
              {canEdit && (
                <>
                  <button 
                    className="action-button action-button--secondary"
                    onClick={() => setShowAssignModal(true)}
                  >
                    <Icon name="users" size={16} />
                    Assign Consultant
                  </button>
                  
                  <button 
                    className="action-button action-button--secondary"
                    onClick={() => setShowDocumentModal(true)}
                  >
                    <Icon name="document" size={16} />
                    Upload Document
                  </button>
                  
                  <button 
                    className="action-button action-button--primary"
                    onClick={() => setShowCommunicationModal(true)}
                  >
                    <Icon name="message" size={16} />
                    Add Note
                  </button>
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
              className={`tab ${activeTab === 'applications' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('applications')}
            >
              Applications
            </button>
            <button 
              className={`tab ${activeTab === 'documents' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
            <button 
              className={`tab ${activeTab === 'communications' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('communications')}
            >
              Communications
            </button>
            <button 
              className={`tab ${activeTab === 'progress' ? 'tab--active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              Progress
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === 'overview' && (
              <div className="detail-grid">
                <div>
                  <div className="detail-card">
                    <div className="detail-card__header">
                      <h3 className="detail-card__title">Personal Information</h3>
                    </div>
                    <div className="detail-card__body">
                      <div className="info-grid">
                        <div className="info-item">
                          <span className="info-item__label">Full Name</span>
                          <span className="info-item__value">{student.name}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item__label">Email</span>
                          <span className="info-item__value">{student.email || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item__label">Phone</span>
                          <span className="info-item__value">{student.phone || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item__label">Intended Country</span>
                          <span className="info-item__value">{student.intendedCountry || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item__label">Highest Degree</span>
                          <span className="info-item__value">{student.highestDegree || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item__label">Timeline</span>
                          <span className="info-item__value">{student.timeline || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item__label">Source</span>
                          <span className="info-item__value">{student.source || '—'}</span>
                        </div>
                        <div className="info-item">
                          <span className="info-item__label">Status</span>
                          <span className={`status-pill status-pill--${getStatusColor(student.status)}`}>
                            {student.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="detail-card">
                    <div className="detail-card__header">
                      <h3 className="detail-card__title">Quick Stats</h3>
                    </div>
                    <div className="detail-card__body">
                      <div className="progress-grid">
                        <div className="progress-item">
                          <div className="progress-item__value">{applications.length}</div>
                          <div className="progress-item__label">Applications</div>
                        </div>
                        <div className="progress-item">
                          <div className="progress-item__value">{documents.length}</div>
                          <div className="progress-item__label">Documents</div>
                        </div>
                        <div className="progress-item">
                          <div className="progress-item__value">{communications.length}</div>
                          <div className="progress-item__label">Communications</div>
                        </div>
                        <div className="progress-item">
                          <div className="progress-item__value">
                            {Math.round((applications.filter(a => a.status === 'submitted').length / Math.max(applications.length, 1)) * 100)}%
                          </div>
                          <div className="progress-item__label">Completion Rate</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'applications' && (
              <div className="detail-card">
                <div className="detail-card__header">
                  <h3 className="detail-card__title">Application Timeline</h3>
                </div>
                <div className="detail-card__body">
                  <div className="timeline">
                    {applications.map(app => (
                      <div key={app.id} className="timeline-item">
                        <div className="timeline-item__icon">
                          <Icon name="document" size={16} />
                        </div>
                        <div className="timeline-item__content">
                          <h4 className="timeline-item__title">{app.type}</h4>
                          <p className="timeline-item__subtitle">
                            {app.university && `${app.university} - ${app.program}`}
                            {app.country && `Visa Application - ${app.country}`}
                          </p>
                          <div className="timeline-item__meta">
                            <span className={`status-pill status-pill--${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                            {app.deadline && ` • Deadline: ${formatDate(app.deadline)}`}
                            {app.submittedDate && ` • Submitted: ${formatDate(app.submittedDate)}`}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {applications.length === 0 && (
                      <div className="timeline-item">
                        <div className="timeline-item__icon">
                          <Icon name="plus" size={16} />
                        </div>
                        <div className="timeline-item__content">
                          <h4 className="timeline-item__title">No applications yet</h4>
                          <p className="timeline-item__subtitle">Start by creating the first application for this student</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="detail-card">
                <div className="detail-card__header">
                  <h3 className="detail-card__title">Documents</h3>
                  {canEdit && (
                    <button 
                      className="action-button action-button--primary"
                      onClick={() => setShowDocumentModal(true)}
                    >
                      <Icon name="plus" size={16} />
                      Upload Document
                    </button>
                  )}
                </div>
                <div className="detail-card__body">
                  <div className="document-list">
                    {documents.map(doc => (
                      <div key={doc.id} className="document-item">
                        <div className="document-item__icon">
                          <Icon name="document" size={16} />
                        </div>
                        <div className="document-item__content">
                          <h4 className="document-item__name">{doc.name}</h4>
                          <div className="document-item__meta">
                            <span className={`status-pill status-pill--${getStatusColor(doc.status)}`}>
                              {doc.status}
                            </span>
                            <span> • {doc.size} • Uploaded {formatDate(doc.uploadedDate)}</span>
                          </div>
                        </div>
                        <button className="action-button action-button--secondary">
                          <Icon name="download" size={16} />
                        </button>
                      </div>
                    ))}
                    
                    {documents.length === 0 && (
                      <div className="document-item">
                        <div className="document-item__icon">
                          <Icon name="plus" size={16} />
                        </div>
                        <div className="document-item__content">
                          <h4 className="document-item__name">No documents uploaded</h4>
                          <div className="document-item__meta">Upload student documents to get started</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'communications' && (
              <div className="detail-card">
                <div className="detail-card__header">
                  <h3 className="detail-card__title">Communication History</h3>
                  {canEdit && (
                    <button 
                      className="action-button action-button--primary"
                      onClick={() => setShowCommunicationModal(true)}
                    >
                      <Icon name="plus" size={16} />
                      Add Communication
                    </button>
                  )}
                </div>
                <div className="detail-card__body">
                  <div className="communication-list">
                    {communications.map(comm => (
                      <div key={comm.id} className="communication-item">
                        <div className="communication-item__header">
                          <h4 className="communication-item__title">{comm.subject}</h4>
                          <div className="communication-item__meta">
                            <span className={`status-pill status-pill--${comm.type === 'email' ? 'blue' : comm.type === 'call' ? 'green' : 'gray'}`}>
                              {comm.type}
                            </span>
                            <span> • {comm.from} • {formatDateTime(comm.date)}</span>
                          </div>
                        </div>
                        <p className="communication-item__message">{comm.message}</p>
                      </div>
                    ))}
                    
                    {communications.length === 0 && (
                      <div className="communication-item">
                        <div className="communication-item__header">
                          <h4 className="communication-item__title">No communications yet</h4>
                        </div>
                        <p className="communication-item__message">Start logging communications with this student</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="detail-card">
                <div className="detail-card__header">
                  <h3 className="detail-card__title">Progress Tracking</h3>
                </div>
                <div className="detail-card__body">
                  <div className="progress-grid">
                    <div className="progress-item">
                      <div className="progress-item__value">
                        {applications.filter(a => a.status === 'submitted').length}/{applications.length}
                      </div>
                      <div className="progress-item__label">Applications Submitted</div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-item__value">
                        {documents.filter(d => d.status === 'approved').length}/{documents.length}
                      </div>
                      <div className="progress-item__label">Documents Approved</div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-item__value">{communications.length}</div>
                      <div className="progress-item__label">Total Communications</div>
                    </div>
                    <div className="progress-item">
                      <div className="progress-item__value">
                        {student.createdAt ? Math.floor((new Date() - new Date(student.createdAt)) / (1000 * 60 * 60 * 24)) : 0}
                      </div>
                      <div className="progress-item__label">Days Since Registration</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Assign Consultant Modal */}
          {showAssignModal && (
            <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Assign Consultant</h3>
                  <button className="modal-close" onClick={() => setShowAssignModal(false)}>
                    <Icon name="x-mark" size={16} />
                  </button>
                </div>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Select Consultant</label>
                    <select 
                      className="form-select"
                      onChange={(e) => handleAssignConsultant(Number(e.target.value))}
                      defaultValue=""
                    >
                      <option value="" disabled>Choose a consultant...</option>
                      {consultants.map(consultant => (
                        <option key={consultant.id} value={consultant.id}>
                          {consultant.name} - {consultant.specialization}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Document Upload Modal */}
          {showDocumentModal && (
            <DocumentUploadModal 
              onSubmit={handleDocumentUpload}
              onClose={() => setShowDocumentModal(false)}
            />
          )}

          {/* Communication Modal */}
          {showCommunicationModal && (
            <CommunicationModal 
              onSubmit={handleAddCommunication}
              onClose={() => setShowCommunicationModal(false)}
            />
          )}
        </div>
      </div>
    </>
  );
}

// Document Upload Modal Component
function DocumentUploadModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    size: '1.2 MB'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.type) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Upload Document</h3>
          <button className="modal-close" onClick={onClose}>
            <Icon name="x-mark" size={16} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Document Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Academic Transcript"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Document Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                required
              >
                <option value="">Select type...</option>
                <option value="transcript">Academic Transcript</option>
                <option value="sop">Statement of Purpose</option>
                <option value="lor">Letter of Recommendation</option>
                <option value="test-score">Test Score</option>
                <option value="passport">Passport</option>
                <option value="financial-proof">Financial Proof</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">File</label>
              <input
                type="file"
                className="form-input"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="action-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="action-button action-button--primary">
                Upload Document
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Communication Modal Component
function CommunicationModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    type: 'note',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.subject && formData.message) {
      onSubmit(formData);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add Communication</h3>
          <button className="modal-close" onClick={onClose}>
            <Icon name="x-mark" size={16} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
              >
                <option value="note">Note</option>
                <option value="email">Email</option>
                <option value="call">Phone Call</option>
                <option value="meeting">Meeting</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Subject</label>
              <input
                type="text"
                className="form-input"
                value={formData.subject}
                onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                placeholder="Brief subject line"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea
                className="form-textarea"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Detailed message or notes..."
                required
                rows={4}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="action-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="action-button action-button--primary">
                Add Communication
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}