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
      const data = await api.students.get(id); // Assuming your API has a get method
      setStudent(data);
    } catch (err) {
      setError('Failed to load student data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplications = async () => {
    // Mock data - replace with actual API call
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
    // Mock data - replace with actual API call
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
    // Mock data - replace with actual API call
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
    // Mock data - replace with actual API call
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
    // Mock document upload - replace with actual implementation
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
      <div className="student-detail">
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading student profile...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="student-detail">
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
      {/* INLINE STYLES */}
      <style>{`
        .student-detail {
          padding: var(--space-6, 24px);
          max-width: 1200px;
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
        }

        .detail-header__title {
          margin: 0 0 var(--space-1, 4px) 0;
          font-size: var(--font-2xl, 24px);
          font-weight: var(--font-bold, 700);
          color: var(--color-text, #111827);
        }

        .detail-header__subtitle {
          margin: 0 0 var(--space-2, 8px) 0;
          color: var(--color-text-muted, #6b7280);
          font-size: var(--font-sm, 14px);
        }

        .detail-header__meta {
          display: flex;
          gap: var(--space-4, 16px);
          flex-wrap: wrap;
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

        .action-button--secondary {
          background: var(--color-bg, #f3f4f6);
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
          grid-template-columns: 1fr 320px;
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

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.15rem 0.5rem;
          border-radius: 999px;
          font-size: 12px;
          font-weight: var(--font-medium, 500);
          border: 1px solid;
        }

        .status-pill--green {
          background: #dcfce7;
          color: #166534;
          border-color: #86efac;
        }

        .status-pill--blue {
          background: #dbeafe;
          color: #1e3a8a;
          border-color: #93c5fd;
        }

        .status-pill--yellow {
          background: #fef3c7;
          color: #92400e;
          border-color: #fcd34d;
        }

        .status-pill--orange {
          background: #fed7aa;
          color: #9a3412;
          border-color: #fdba74;
        }

        .status-pill--red {
          background: #fecaca;
          color: #991b1b;
          border-color: #f87171;
        }

        .status-pill--gray {
          background: #f3f4f6;
          color: #374151;
          border-color: #e5e7eb;
        }

        .timeline {
          display: flex;
          flex-direction: column;
          gap: var(--space-4, 16px);
        }

        .timeline-item {
          display: flex;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          border-radius: var(--radius-md, 8px);
          border: 1px solid var(--color-border, #e5e7eb);
        }

        .timeline-item__icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: var(--color-bg, #f3f4f6);
          border: 1px solid var(--color-border, #e5e7eb);
          flex-shrink: 0;
        }

        .timeline-item__content {
          flex: 1;
        }

        .timeline-item__title {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .timeline-item__subtitle {
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .timeline-item__meta {
          font-size: var(--font-xs, 12px);
          color: var(--color-text-muted, #6b7280);
        }

        .document-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-2, 8px);
        }

        .document-item {
          display: flex;
          align-items: center;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
        }

        .document-item__icon {
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md, 8px);
          display: grid;
          place-items: center;
          background: var(--color-bg, #f3f4f6);
          border: 1px solid var(--color-border, #e5e7eb);
        }

        .document-item__content {
          flex: 1;
        }

        .document-item__name {
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .document-item__meta {
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
        }

        .communication-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 12px);
        }

        .communication-item {
          padding: var(--space-4, 16px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
        }

        .communication-item__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-2, 8px);
        }

        .communication-item__title {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          margin: 0;
        }

        .communication-item__meta {
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
        }

        .communication-item__message {
          color: var(--color-text, #111827);
          line-height: 1.5;
        }

        .progress-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4, 16px);
        }

        .progress-item {
          text-align: center;
          padding: var(--space-4, 16px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
        }

        .progress-item__value {
          font-size: var(--font-2xl, 24px);
          font-weight: var(--font-bold, 700);
          color: var(--color-primary, #2563eb);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .progress-item__label {
          font-size: var(--font-sm, 14px);
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
          width: min(520px, 86vw);
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
          max-height: min(70vh, 560px);
          overflow: auto;
        }

        .form-group {
          margin-bottom: var(--space-4, 16px);
        }

        .form-label {
          display: block;
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
          margin-bottom: var(--space-1, 4px);
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.6rem 0.8rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary, #2563eb);
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        @media (max-width: 768px) {
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