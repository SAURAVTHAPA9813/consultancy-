import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import Icon from '@/components/Icon.jsx';

export default function StudentApplication() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, branch } = useAuth();
  const { addNotification } = useNotifications();
  
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('pipeline');
  
  // Application data states
  const [applications, setApplications] = useState([]);
  const [visaApplications, setVisaApplications] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [deadlines, setDeadlines] = useState([]);
  
  // Modal states
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [showNewVisaModal, setShowNewVisaModal] = useState(false);
  const [showDocumentModal, setShowDocumentModal] = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'consultant';

  // Application pipeline stages
  const pipelineStages = [
    { id: 'preparing', name: 'Preparing', color: 'gray' },
    { id: 'submitted', name: 'Submitted', color: 'blue' },
    { id: 'interview', name: 'Interview', color: 'yellow' },
    { id: 'decision-pending', name: 'Decision Pending', color: 'orange' },
    { id: 'accepted', name: 'Accepted', color: 'green' },
    { id: 'rejected', name: 'Rejected', color: 'red' },
    { id: 'waitlisted', name: 'Waitlisted', color: 'purple' }
  ];

  // Visa application stages
  const visaStages = [
    { id: 'document-prep', name: 'Document Preparation', color: 'gray' },
    { id: 'application-submitted', name: 'Application Submitted', color: 'blue' },
    { id: 'biometrics', name: 'Biometrics', color: 'yellow' },
    { id: 'interview-scheduled', name: 'Interview Scheduled', color: 'orange' },
    { id: 'processing', name: 'Processing', color: 'purple' },
    { id: 'approved', name: 'Approved', color: 'green' },
    { id: 'rejected', name: 'Rejected', color: 'red' }
  ];

  useEffect(() => {
    loadStudentData();
    loadApplicationData();
  }, [id]);

  const loadStudentData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await api.leads.get(id);
      setStudent(data);
    } catch (err) {
      setError('Failed to load student data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadApplicationData = async () => {
    // Mock data - replace with actual API calls
    setApplications([
      {
        id: 1,
        studentId: id,
        university: 'University of Toronto',
        program: 'Computer Science',
        degree: 'Masters',
        status: 'submitted',
        applicationDate: '2024-11-15',
        deadline: '2025-01-15',
        fee: 150,
        requirements: ['Transcript', 'SOP', 'LOR', 'IELTS'],
        notes: 'Strong application, good match for program'
      },
      {
        id: 2,
        studentId: id,
        university: 'McGill University',
        program: 'Data Science',
        degree: 'Masters',
        status: 'preparing',
        applicationDate: null,
        deadline: '2025-02-01',
        fee: 120,
        requirements: ['Transcript', 'SOP', 'LOR', 'GRE'],
        notes: 'Need to improve GRE scores'
      },
      {
        id: 3,
        studentId: id,
        university: 'University of British Columbia',
        program: 'Computer Science',
        degree: 'Masters',
        status: 'interview',
        applicationDate: '2024-10-20',
        deadline: '2024-12-15',
        fee: 130,
        requirements: ['Transcript', 'SOP', 'LOR', 'IELTS'],
        notes: 'Interview scheduled for Dec 20'
      }
    ]);

    setVisaApplications([
      {
        id: 1,
        studentId: id,
        country: 'Canada',
        visaType: 'Study Permit',
        status: 'document-prep',
        applicationDate: null,
        expectedProcessingTime: '8-12 weeks',
        fee: 150,
        requirements: ['Passport', 'LOA', 'Financial Proof', 'Medical Exam'],
        notes: 'Waiting for Letter of Acceptance'
      }
    ]);

    setDocuments([
      { id: 1, name: 'Academic Transcript', status: 'approved', required: true, deadline: '2025-01-15' },
      { id: 2, name: 'Statement of Purpose', status: 'pending-review', required: true, deadline: '2025-01-15' },
      { id: 3, name: 'Letter of Recommendation 1', status: 'approved', required: true, deadline: '2025-01-15' },
      { id: 4, name: 'Letter of Recommendation 2', status: 'missing', required: true, deadline: '2025-01-15' },
      { id: 5, name: 'IELTS Certificate', status: 'approved', required: true, deadline: '2025-01-15' },
      { id: 6, name: 'Passport Copy', status: 'approved', required: true, deadline: '2025-02-01' },
      { id: 7, name: 'Financial Statement', status: 'pending-review', required: true, deadline: '2025-02-01' }
    ]);

    setDeadlines([
      { id: 1, title: 'UofT Application Deadline', date: '2025-01-15', type: 'application', status: 'upcoming' },
      { id: 2, title: 'McGill Application Deadline', date: '2025-02-01', type: 'application', status: 'upcoming' },
      { id: 3, title: 'UBC Interview', date: '2024-12-20', type: 'interview', status: 'upcoming' },
      { id: 4, title: 'IELTS Retake (if needed)', date: '2025-01-10', type: 'test', status: 'optional' },
      { id: 5, title: 'Visa Application Submit', date: '2025-03-01', type: 'visa', status: 'planned' }
    ]);
  };

  // Handler functions - PROPERLY DEFINED HERE
  const handleNewApplication = (appData) => {
    try {
      const newApp = {
        id: Date.now(),
        studentId: id,
        status: 'preparing',
        applicationDate: null,
        ...appData
      };
      setApplications(prev => [newApp, ...prev]);
      setShowNewAppModal(false);
      addNotification({
        type: 'success',
        title: 'Application Added',
        message: `New application for ${appData.university} created`,
        category: 'applications'
      });
    } catch (err) {
      console.error('Failed to create application:', err);
    }
  };

  const handleNewVisaApplication = (visaData) => {
    try {
      const newVisa = {
        id: Date.now(),
        studentId: id,
        status: 'document-prep',
        applicationDate: null,
        ...visaData
      };
      setVisaApplications(prev => [newVisa, ...prev]);
      setShowNewVisaModal(false);
      addNotification({
        type: 'success',
        title: 'Visa Application Added',
        message: `New visa application for ${visaData.country} created`,
        category: 'visa'
      });
    } catch (err) {
      console.error('Failed to create visa application:', err);
    }
  };

  const moveApplication = async (appId, newStatus) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === appId ? { ...app, status: newStatus } : app
      ));
      addNotification({
        type: 'success',
        title: 'Application Updated',
        message: `Application status changed to ${newStatus}`,
        category: 'applications'
      });
    } catch (err) {
      console.error('Failed to update application:', err);
    }
  };

  const moveVisaApplication = async (visaId, newStatus) => {
    try {
      setVisaApplications(prev => prev.map(visa => 
        visa.id === visaId ? { ...visa, status: newStatus } : visa
      ));
      addNotification({
        type: 'success',
        title: 'Visa Application Updated',
        message: `Visa status changed to ${newStatus}`,
        category: 'visa'
      });
    } catch (err) {
      console.error('Failed to update visa application:', err);
    }
  };

  const getStatusColor = (status) => {
    const stage = [...pipelineStages, ...visaStages].find(s => s.id === status);
    return stage ? stage.color : 'gray';
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getDaysUntilDeadline = (deadline) => {
    const days = Math.ceil((new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getDeadlineStatus = (deadline) => {
    const days = getDaysUntilDeadline(deadline);
    if (days < 0) return 'overdue';
    if (days <= 7) return 'urgent';
    if (days <= 30) return 'upcoming';
    return 'future';
  };

  if (loading) {
    return (
      <div className="application-tracker">
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading application data...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="application-tracker">
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
        .application-tracker {
          padding: var(--space-6, 24px);
          max-width: 1400px;
          margin: 0 auto;
        }

        .tracker-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4, 16px);
          margin-bottom: var(--space-6, 24px);
          padding-bottom: var(--space-4, 16px);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .tracker-header__info {
          flex: 1;
        }

        .tracker-header__title {
          margin: 0 0 var(--space-1, 4px) 0;
          font-size: var(--font-2xl, 24px);
          font-weight: var(--font-bold, 700);
          color: var(--color-text, #111827);
        }

        .tracker-header__subtitle {
          margin: 0 0 var(--space-2, 8px) 0;
          color: var(--color-text-muted, #6b7280);
          font-size: var(--font-sm, 14px);
        }

        .tracker-actions {
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

        .pipeline {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-4, 16px);
          margin-bottom: var(--space-6, 24px);
        }

        .pipeline-column {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
        }

        .pipeline-column__header {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          background: var(--color-bg, #f9fafb);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .pipeline-column__title {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          margin: 0;
        }

        .pipeline-column__count {
          background: var(--color-border, #e5e7eb);
          color: var(--color-text-muted, #6b7280);
          padding: 0.25rem 0.5rem;
          border-radius: 999px;
          font-size: var(--font-xs, 12px);
          font-weight: var(--font-medium, 500);
        }

        .pipeline-column__body {
          padding: var(--space-3, 12px);
          min-height: 200px;
        }

        .application-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          padding: var(--space-3, 12px);
          margin-bottom: var(--space-2, 8px);
          transition: all 0.12s ease;
          cursor: move;
        }

        .application-card:hover {
          border-color: var(--color-primary, #2563eb);
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.1);
        }

        .application-card__header {
          margin-bottom: var(--space-2, 8px);
        }

        .application-card__university {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .application-card__program {
          color: var(--color-text-muted, #6b7280);
          font-size: var(--font-sm, 14px);
          margin: 0;
        }

        .application-card__meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-2, 8px);
        }

        .application-card__deadline {
          font-size: var(--font-xs, 12px);
          color: var(--color-text-muted, #6b7280);
        }

        .application-card__actions {
          display: flex;
          gap: var(--space-1, 4px);
        }

        .card-button {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-sm, 6px);
          background: var(--color-surface, #fff);
          color: var(--color-text-muted, #6b7280);
          font-size: var(--font-xs, 12px);
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .card-button:hover {
          background: var(--color-bg, #f9fafb);
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

        .status-pill--green { background: #dcfce7; color: #166534; border-color: #86efac; }
        .status-pill--blue { background: #dbeafe; color: #1e3a8a; border-color: #93c5fd; }
        .status-pill--yellow { background: #fef3c7; color: #92400e; border-color: #fcd34d; }
        .status-pill--orange { background: #fed7aa; color: #9a3412; border-color: #fdba74; }
        .status-pill--red { background: #fecaca; color: #991b1b; border-color: #f87171; }
        .status-pill--purple { background: #e9d5ff; color: #7c2d12; border-color: #c4b5fd; }
        .status-pill--gray { background: #f3f4f6; color: #374151; border-color: #e5e7eb; }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          overflow: hidden;
        }

        .data-table th {
          background: var(--color-bg, #f9fafb);
          padding: var(--space-3, 12px);
          text-align: left;
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .data-table td {
          padding: var(--space-3, 12px);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
          vertical-align: middle;
        }

        .data-table tr:hover {
          background: var(--color-surface-hover, #f9fafb);
        }

        .deadline-item {
          display: flex;
          align-items: center;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          margin-bottom: var(--space-2, 8px);
        }

        .deadline-item__icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .deadline-item__icon--urgent { background: #fecaca; color: #991b1b; }
        .deadline-item__icon--upcoming { background: #fef3c7; color: #92400e; }
        .deadline-item__icon--future { background: #dbeafe; color: #1e3a8a; }
        .deadline-item__icon--overdue { background: #991b1b; color: #fff; }

        .deadline-item__content {
          flex: 1;
        }

        .deadline-item__title {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .deadline-item__meta {
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
        }

        .document-checklist {
          display: grid;
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

        .document-item__checkbox {
          width: 20px;
          height: 20px;
          border: 2px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-sm, 4px);
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .document-item__checkbox--approved {
          background: #166534;
          border-color: #166534;
          color: white;
        }

        .document-item__content {
          flex: 1;
        }

        .document-item__name {
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
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

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-3, 12px);
        }

        @media (max-width: 768px) {
          .pipeline {
            grid-template-columns: 1fr;
          }
          
          .tracker-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="application-tracker">
        {/* Header */}
        <div className="tracker-header">
          <div className="tracker-header__info">
            <h1 className="tracker-header__title">Application Tracking - {student.name}</h1>
            <p className="tracker-header__subtitle">
              Track university applications, visa processes, and deadlines
            </p>
          </div>
          
          <div className="tracker-actions">
            <Link to={`/students/${student.id}`} className="action-button">
              <Icon name="arrow-left" size={16} />
              Back to Profile
            </Link>
            
            {canEdit && (
              <>
                <button 
                  className="action-button action-button--primary"
                  onClick={() => setShowNewAppModal(true)}
                >
                  <Icon name="plus" size={16} />
                  New Application
                </button>
                
                <button 
                  className="action-button action-button--primary"
                  onClick={() => setShowNewVisaModal(true)}
                >
                  <Icon name="document" size={16} />
                  Visa Application
                </button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'pipeline' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('pipeline')}
          >
            Application Pipeline
          </button>
          <button 
            className={`tab ${activeTab === 'university' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('university')}
          >
            University Applications
          </button>
          <button 
            className={`tab ${activeTab === 'visa' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('visa')}
          >
            Visa Applications
          </button>
          <button 
            className={`tab ${activeTab === 'documents' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('documents')}
          >
            Document Checklist
          </button>
          <button 
            className={`tab ${activeTab === 'deadlines' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('deadlines')}
          >
            Deadlines
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'pipeline' && (
          <div className="pipeline">
            {pipelineStages.map(stage => {
              const stageApplications = applications.filter(app => app.status === stage.id);
              return (
                <div key={stage.id} className="pipeline-column">
                  <div className="pipeline-column__header">
                    <h3 className="pipeline-column__title">{stage.name}</h3>
                    <span className="pipeline-column__count">{stageApplications.length}</span>
                  </div>
                  <div className="pipeline-column__body">
                    {stageApplications.map(app => (
                      <div key={app.id} className="application-card">
                        <div className="application-card__header">
                          <h4 className="application-card__university">{app.university}</h4>
                          <p className="application-card__program">{app.program} - {app.degree}</p>
                        </div>
                        <div className="application-card__meta">
                          <span className="application-card__deadline">
                            Due: {formatDate(app.deadline)}
                          </span>
                          <div className="application-card__actions">
                            {stage.id !== 'rejected' && stage.id !== 'accepted' && canEdit && (
                              <>
                                {stage.id !== 'preparing' && (
                                  <button 
                                    className="card-button"
                                    onClick={() => {
                                      const prevStageIndex = pipelineStages.findIndex(s => s.id === stage.id) - 1;
                                      if (prevStageIndex >= 0) {
                                        moveApplication(app.id, pipelineStages[prevStageIndex].id);
                                      }
                                    }}
                                    title="Move back"
                                  >
                                    ←
                                  </button>
                                )}
                                {stage.id !== 'waitlisted' && (
                                  <button 
                                    className="card-button"
                                    onClick={() => {
                                      const nextStageIndex = pipelineStages.findIndex(s => s.id === stage.id) + 1;
                                      if (nextStageIndex < pipelineStages.length) {
                                        moveApplication(app.id, pipelineStages[nextStageIndex].id);
                                      }
                                    }}
                                    title="Move forward"
                                  >
                                    →
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {stageApplications.length === 0 && (
                      <div style={{ 
                        padding: '2rem 1rem', 
                        textAlign: 'center', 
                        color: 'var(--color-text-muted, #6b7280)',
                        fontSize: '14px'
                      }}>
                        No applications in this stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'university' && (
          <div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>University</th>
                  <th>Program</th>
                  <th>Status</th>
                  <th>Deadline</th>
                  <th>Application Date</th>
                  <th>Fee</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map(app => (
                  <tr key={app.id}>
                    <td>
                      <strong>{app.university}</strong>
                    </td>
                    <td>{app.program} - {app.degree}</td>
                    <td>
                      <span className={`status-pill status-pill--${getStatusColor(app.status)}`}>
                        {app.status.replace('-', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={getDaysUntilDeadline(app.deadline) <= 7 ? 'text-red-600' : ''}>
                        {formatDate(app.deadline)}
                        <small style={{ display: 'block', fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          ({getDaysUntilDeadline(app.deadline)} days)
                        </small>
                      </span>
                    </td>
                    <td>{app.applicationDate ? formatDate(app.applicationDate) : 'Not submitted'}</td>
                    <td>${app.fee}</td>
                    <td>
                      {canEdit && (
                        <button className="card-button">Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'visa' && (
          <div>
            <div className="pipeline">
              {visaStages.map(stage => {
                const stageVisas = visaApplications.filter(visa => visa.status === stage.id);
                return (
                  <div key={stage.id} className="pipeline-column">
                    <div className="pipeline-column__header">
                      <h3 className="pipeline-column__title">{stage.name}</h3>
                      <span className="pipeline-column__count">{stageVisas.length}</span>
                    </div>
                    <div className="pipeline-column__body">
                      {stageVisas.map(visa => (
                        <div key={visa.id} className="application-card">
                          <div className="application-card__header">
                            <h4 className="application-card__university">{visa.country} - {visa.visaType}</h4>
                            <p className="application-card__program">Processing: {visa.expectedProcessingTime}</p>
                          </div>
                          <div className="application-card__meta">
                            <span className="application-card__deadline">
                              Fee: ${visa.fee}
                            </span>
                            <div className="application-card__actions">
                              {canEdit && stage.id !== 'approved' && stage.id !== 'rejected' && (
                                <>
                                  {stage.id !== 'document-prep' && (
                                    <button 
                                      className="card-button"
                                      onClick={() => {
                                        const prevStageIndex = visaStages.findIndex(s => s.id === stage.id) - 1;
                                        if (prevStageIndex >= 0) {
                                          moveVisaApplication(visa.id, visaStages[prevStageIndex].id);
                                        }
                                      }}
                                      title="Move back"
                                    >
                                      ←
                                    </button>
                                  )}
                                  {stage.id !== 'processing' && (
                                    <button 
                                      className="card-button"
                                      onClick={() => {
                                        const nextStageIndex = visaStages.findIndex(s => s.id === stage.id) + 1;
                                        if (nextStageIndex < visaStages.length) {
                                          moveVisaApplication(visa.id, visaStages[nextStageIndex].id);
                                        }
                                      }}
                                      title="Move forward"
                                    >
                                      →
                                    </button>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {stageVisas.length === 0 && (
                        <div style={{ 
                          padding: '2rem 1rem', 
                          textAlign: 'center', 
                          color: 'var(--color-text-muted, #6b7280)',
                          fontSize: '14px'
                        }}>
                          No visa applications in this stage
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            <div className="document-checklist">
              {documents.map(doc => (
                <div key={doc.id} className="document-item">
                  <div className={`document-item__checkbox ${doc.status === 'approved' ? 'document-item__checkbox--approved' : ''}`}>
                    {doc.status === 'approved' && <Icon name="check" size={12} />}
                  </div>
                  <div className="document-item__content">
                    <h4 className="document-item__name">{doc.name}</h4>
                  </div>
                  <span className={`status-pill status-pill--${getStatusColor(doc.status)}`}>
                    {doc.status.replace('-', ' ')}
                  </span>
                  {doc.deadline && (
                    <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                      Due: {formatDate(doc.deadline)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'deadlines' && (
          <div>
            {deadlines
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(deadline => {
                const status = getDeadlineStatus(deadline.date);
                const daysUntil = getDaysUntilDeadline(deadline.date);
                
                return (
                  <div key={deadline.id} className="deadline-item">
                    <div className={`deadline-item__icon deadline-item__icon--${status}`}>
                      <Icon name={
                        deadline.type === 'application' ? 'document' :
                        deadline.type === 'interview' ? 'users' :
                        deadline.type === 'test' ? 'clipboard' :
                        deadline.type === 'visa' ? 'globe' : 'calendar'
                      } size={16} />
                    </div>
                    <div className="deadline-item__content">
                      <h4 className="deadline-item__title">{deadline.title}</h4>
                      <div className="deadline-item__meta">
                        {formatDate(deadline.date)} • 
                        {daysUntil < 0 ? ` ${Math.abs(daysUntil)} days overdue` :
                         daysUntil === 0 ? ' Due today' :
                         ` ${daysUntil} days remaining`} • 
                        {deadline.type.charAt(0).toUpperCase() + deadline.type.slice(1)}
                      </div>
                    </div>
                    <span className={`status-pill status-pill--${
                      status === 'overdue' ? 'red' :
                      status === 'urgent' ? 'orange' :
                      status === 'upcoming' ? 'yellow' : 'blue'
                    }`}>
                      {deadline.status}
                    </span>
                  </div>
                );
              })}
          </div>
        )}
        
        {/* MODALS - PROPERLY PLACED AT THE END */}
        {showNewAppModal && (
          <NewApplicationModal 
            onSubmit={handleNewApplication}
            onClose={() => setShowNewAppModal(false)}
          />
        )}

        {showNewVisaModal && (
          <NewVisaApplicationModal 
            onSubmit={handleNewVisaApplication}
            onClose={() => setShowNewVisaModal(false)}
          />
        )}
      </div>
    </>
  );
}

// Modal Components - OUTSIDE the main component
function NewApplicationModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    university: '',
    program: '',
    degree: 'Masters',
    deadline: '',
    fee: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.university && formData.program && formData.deadline) {
      onSubmit({
        ...formData,
        fee: Number(formData.fee) || 0,
        requirements: ['Transcript', 'SOP', 'LOR']
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New University Application</h3>
          <button className="modal-close" onClick={onClose}>
            <Icon name="x-mark" size={16} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">University Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.university}
                onChange={(e) => setFormData(prev => ({ ...prev, university: e.target.value }))}
                placeholder="e.g., University of Toronto"
                required
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Program</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.program}
                  onChange={(e) => setFormData(prev => ({ ...prev, program: e.target.value }))}
                  placeholder="e.g., Computer Science"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Degree Level</label>
                <select
                  className="form-select"
                  value={formData.degree}
                  onChange={(e) => setFormData(prev => ({ ...prev, degree: e.target.value }))}
                >
                  <option value="Bachelors">Bachelor's</option>
                  <option value="Masters">Master's</option>
                  <option value="PhD">PhD</option>
                  <option value="Diploma">Diploma</option>
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Application Deadline</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Application Fee ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                  placeholder="150"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="action-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="action-button action-button--primary">
                Add Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function NewVisaApplicationModal({ onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    country: '',
    visaType: 'Study Permit',
    expectedProcessingTime: '',
    fee: '',
    notes: ''
  });

  const countries = [
    'Canada', 'Australia', 'United Kingdom', 'United States', 'Germany', 
    'New Zealand', 'Ireland', 'Netherlands', 'Sweden', 'Denmark'
  ];

  const visaTypes = {
    'Canada': ['Study Permit', 'Visitor Visa', 'Work Permit'],
    'Australia': ['Student Visa (500)', 'Visitor Visa', 'Graduate Work Visa'],
    'United Kingdom': ['Student Visa', 'Visitor Visa', 'Graduate Route'],
    'United States': ['F-1 Student Visa', 'B-2 Tourist Visa', 'OPT'],
    'Germany': ['Student Visa', 'Language Course Visa', 'Job Seeker Visa'],
    'New Zealand': ['Student Visa', 'Visitor Visa', 'Work Visa'],
    'Ireland': ['Study Visa', 'Tourist Visa', 'Working Holiday Visa'],
    'Netherlands': ['Student Visa', 'Tourist Visa', 'Work Permit'],
    'Sweden': ['Student Residence Permit', 'Visit Visa', 'Work Permit'],
    'Denmark': ['Student Visa', 'Tourist Visa', 'Work Permit']
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.country && formData.visaType) {
      onSubmit({
        ...formData,
        fee: Number(formData.fee) || 0,
        requirements: ['Passport', 'Letter of Acceptance', 'Financial Proof']
      });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Visa Application</h3>
          <button className="modal-close" onClick={onClose}>
            <Icon name="x-mark" size={16} />
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Country</label>
                <select
                  className="form-select"
                  value={formData.country}
                  onChange={(e) => {
                    const country = e.target.value;
                    setFormData(prev => ({ 
                      ...prev, 
                      country,
                      visaType: visaTypes[country]?.[0] || 'Study Permit'
                    }));
                  }}
                  required
                >
                  <option value="">Select country...</option>
                  {countries.map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label className="form-label">Visa Type</label>
                <select
                  className="form-select"
                  value={formData.visaType}
                  onChange={(e) => setFormData(prev => ({ ...prev, visaType: e.target.value }))}
                  required
                >
                  {(visaTypes[formData.country] || ['Study Permit']).map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Expected Processing Time</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.expectedProcessingTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, expectedProcessingTime: e.target.value }))}
                  placeholder="e.g., 8-12 weeks"
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Application Fee ($)</label>
                <input
                  type="number"
                  className="form-input"
                  value={formData.fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                  placeholder="150"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label className="form-label">Notes</label>
              <textarea
                className="form-textarea"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="Any special requirements or notes..."
                rows={3}
              />
            </div>
            
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button type="button" className="action-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="action-button action-button--primary">
                Add Visa Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}