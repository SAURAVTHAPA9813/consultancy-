import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import Icon from '@/components/Icon.jsx';

export default function UniversityApps() {
  const { user, branch } = useAuth();
  const { addNotification } = useNotifications();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    country: 'all',
    deadline: 'all',
    search: ''
  });
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'list'

  // Mock university applications data
  const mockApplications = [
    {
      id: 1,
      studentName: 'Sarah Johnson',
      studentEmail: 'sarah.j@email.com',
      university: 'Harvard University',
      program: 'Computer Science - Master\'s',
      country: 'USA',
      applicationDeadline: '2025-02-15',
      status: 'in-progress',
      submissionDate: null,
      consultant: 'Dr. Nishan Timilsina',
      requirements: {
        transcripts: { completed: true, uploadedDate: '2025-01-10', notes: 'Official transcripts received' },
        sop: { completed: true, uploadedDate: '2025-01-12', notes: 'Statement of Purpose finalized' },
        lor: { completed: false, uploadedDate: null, notes: 'Waiting for 2nd recommendation letter' },
        cv: { completed: true, uploadedDate: '2025-01-08', notes: 'Updated CV with recent projects' },
        gre: { completed: true, uploadedDate: '2025-01-05', notes: 'GRE Score: 325' },
        ielts: { completed: true, uploadedDate: '2025-01-06', notes: 'IELTS Score: 7.5' },
        financial: { completed: false, uploadedDate: null, notes: 'Bank statements needed' },
        portfolio: { completed: true, uploadedDate: '2025-01-14', notes: 'Technical portfolio submitted' }
      },
      statusHistory: [
        { date: '2025-01-08', status: 'started', note: 'Application process initiated' },
        { date: '2025-01-10', status: 'documents-collection', note: 'Started collecting documents' },
        { date: '2025-01-15', status: 'in-progress', note: 'Most documents ready, pending LOR and financial docs' }
      ],
      applicationFee: 85,
      feePaid: true,
      priority: 'high',
      notes: 'Dream school - ensure all requirements are perfect'
    },
    {
      id: 2,
      studentName: 'Michael Chen',
      studentEmail: 'michael.c@email.com',
      university: 'MIT',
      program: 'Electrical Engineering - PhD',
      country: 'USA',
      applicationDeadline: '2025-03-01',
      status: 'submitted',
      submissionDate: '2025-01-20',
      consultant: 'Dr. Nishan Timilsina',
      requirements: {
        transcripts: { completed: true, uploadedDate: '2025-01-05', notes: 'Official transcripts sent' },
        sop: { completed: true, uploadedDate: '2025-01-10', notes: 'Research-focused SOP' },
        lor: { completed: true, uploadedDate: '2025-01-15', notes: 'All 3 letters received' },
        cv: { completed: true, uploadedDate: '2025-01-08', notes: 'Academic CV with publications' },
        gre: { completed: true, uploadedDate: '2025-01-03', notes: 'GRE Score: 330' },
        ielts: { completed: true, uploadedDate: '2025-01-04', notes: 'IELTS Score: 8.0' },
        financial: { completed: true, uploadedDate: '2025-01-18', notes: 'Sponsorship letter included' },
        research: { completed: true, uploadedDate: '2025-01-16', notes: 'Research proposal submitted' }
      },
      statusHistory: [
        { date: '2025-01-03', status: 'started', note: 'Application initiated' },
        { date: '2025-01-05', status: 'documents-collection', note: 'Document collection phase' },
        { date: '2025-01-18', status: 'ready-to-submit', note: 'All documents ready' },
        { date: '2025-01-20', status: 'submitted', note: 'Application successfully submitted' }
      ],
      applicationFee: 85,
      feePaid: true,
      priority: 'high',
      notes: 'Strong research background, good chance of acceptance'
    },
    {
      id: 3,
      studentName: 'Emma Wilson',
      studentEmail: 'emma.w@email.com',
      university: 'University of Toronto',
      program: 'MBA',
      country: 'Canada',
      applicationDeadline: '2025-01-30',
      status: 'submitted',
      submissionDate: '2025-01-25',
      consultant: 'Sakura Ghimire',
      requirements: {
        transcripts: { completed: true, uploadedDate: '2025-01-15', notes: 'WES evaluation completed' },
        sop: { completed: true, uploadedDate: '2025-01-20', notes: 'MBA goals statement' },
        lor: { completed: true, uploadedDate: '2025-01-22', notes: 'Professional recommendations' },
        cv: { completed: true, uploadedDate: '2025-01-18', notes: 'Professional resume' },
        gmat: { completed: true, uploadedDate: '2025-01-12', notes: 'GMAT Score: 720' },
        ielts: { completed: true, uploadedDate: '2025-01-14', notes: 'IELTS Score: 7.0' },
        financial: { completed: true, uploadedDate: '2025-01-24', notes: 'Proof of funds' },
        workExp: { completed: true, uploadedDate: '2025-01-21', notes: '5 years experience certificates' }
      },
      statusHistory: [
        { date: '2025-01-12', status: 'started', note: 'MBA application started' },
        { date: '2025-01-15', status: 'documents-collection', note: 'Collecting professional documents' },
        { date: '2025-01-24', status: 'ready-to-submit', note: 'Final review completed' },
        { date: '2025-01-25', status: 'submitted', note: 'MBA application submitted' }
      ],
      applicationFee: 150,
      feePaid: true,
      priority: 'medium',
      notes: 'Strong professional background, competitive program'
    },
    {
      id: 4,
      studentName: 'David Kumar',
      studentEmail: 'david.k@email.com',
      university: 'University of Melbourne',
      program: 'Data Science - Master\'s',
      country: 'Australia',
      applicationDeadline: '2025-03-15',
      status: 'planning',
      submissionDate: null,
      consultant: 'Jenish Neupane',
      requirements: {
        transcripts: { completed: false, uploadedDate: null, notes: 'Requesting from university' },
        sop: { completed: false, uploadedDate: null, notes: 'First draft in progress' },
        lor: { completed: false, uploadedDate: null, notes: 'Identified recommenders' },
        cv: { completed: true, uploadedDate: '2025-01-10', notes: 'Technical CV ready' },
        ielts: { completed: true, uploadedDate: '2025-01-08', notes: 'IELTS Score: 7.5' },
        financial: { completed: false, uploadedDate: null, notes: 'Preparing bank statements' },
        portfolio: { completed: false, uploadedDate: null, notes: 'Data science projects compilation' }
      },
      statusHistory: [
        { date: '2025-01-08', status: 'consultation', note: 'Initial consultation completed' },
        { date: '2025-01-10', status: 'planning', note: 'Application strategy planned' }
      ],
      applicationFee: 100,
      feePaid: false,
      priority: 'medium',
      notes: 'Good technical background, needs to strengthen profile'
    },
    {
      id: 5,
      studentName: 'Priya Sharma',
      studentEmail: 'priya.s@email.com',
      university: 'Oxford University',
      program: 'International Relations - Master\'s',
      country: 'UK',
      applicationDeadline: '2025-01-25',
      status: 'overdue',
      submissionDate: null,
      consultant: 'Jenish Neupane',
      requirements: {
        transcripts: { completed: true, uploadedDate: '2025-01-15', notes: 'Official transcripts ready' },
        sop: { completed: true, uploadedDate: '2025-01-20', notes: 'Personal statement finalized' },
        lor: { completed: true, uploadedDate: '2025-01-18', notes: 'Academic references ready' },
        cv: { completed: true, uploadedDate: '2025-01-16', notes: 'Academic CV prepared' },
        ielts: { completed: true, uploadedDate: '2025-01-12', notes: 'IELTS Score: 8.5' },
        financial: { completed: false, uploadedDate: null, notes: 'Financial documents pending' },
        portfolio: { completed: true, uploadedDate: '2025-01-22', notes: 'Writing samples submitted' }
      },
      statusHistory: [
        { date: '2025-01-12', status: 'started', note: 'Application process started' },
        { date: '2025-01-15', status: 'documents-collection', note: 'Collecting required documents' },
        { date: '2025-01-22', status: 'almost-ready', note: 'Most documents ready' },
        { date: '2025-01-26', status: 'overdue', note: 'Deadline passed, checking for extensions' }
      ],
      applicationFee: 75,
      feePaid: true,
      priority: 'urgent',
      notes: 'URGENT: Deadline passed, contact university for extension'
    }
  ];

  const statusConfig = {
    'planning': { label: 'Planning', color: '#64748b', bgColor: '#f1f5f9' },
    'in-progress': { label: 'In Progress', color: '#f59e0b', bgColor: '#fef3c7' },
    'ready-to-submit': { label: 'Ready to Submit', color: '#3b82f6', bgColor: '#dbeafe' },
    'submitted': { label: 'Submitted', color: '#10b981', bgColor: '#d1fae5' },
    'accepted': { label: 'Accepted', color: '#059669', bgColor: '#a7f3d0' },
    'rejected': { label: 'Rejected', color: '#dc2626', bgColor: '#fecaca' },
    'overdue': { label: 'Overdue', color: '#dc2626', bgColor: '#fee2e2' }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      // Replace with actual API call
      // const response = await api.universityApplications.getAll();
      setApplications(mockApplications);
    } catch (error) {
      console.error('Failed to load applications:', error);
      addNotification({
        type: 'error',
        title: 'Load Failed',
        message: 'Failed to load university applications',
        category: 'applications'
      });
    } finally {
      setLoading(false);
    }
  };

  const updateRequirement = async (appId, reqKey, updates) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === appId 
          ? {
              ...app,
              requirements: {
                ...app.requirements,
                [reqKey]: { ...app.requirements[reqKey], ...updates }
              }
            }
          : app
      ));

      addNotification({
        type: 'success',
        title: 'Requirement Updated',
        message: `Requirement ${reqKey} has been updated`,
        category: 'applications'
      });
    } catch (error) {
      console.error('Failed to update requirement:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update requirement',
        category: 'applications'
      });
    }
  };

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { status: 'overdue', color: '#dc2626', text: `${Math.abs(daysUntil)} days overdue`, urgent: true };
    if (daysUntil <= 7) return { status: 'urgent', color: '#f59e0b', text: `${daysUntil} days left`, urgent: true };
    if (daysUntil <= 30) return { status: 'soon', color: '#f59e0b', text: `${daysUntil} days left`, urgent: false };
    return { status: 'normal', color: '#10b981', text: `${daysUntil} days left`, urgent: false };
  };

  const getRequirementProgress = (requirements) => {
    const total = Object.keys(requirements).length;
    const completed = Object.values(requirements).filter(req => req.completed).length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const filteredApplications = applications.filter(app => {
    if (filters.status !== 'all' && app.status !== filters.status) return false;
    if (filters.country !== 'all' && app.country !== filters.country) return false;
    if (filters.deadline !== 'all') {
      const deadlineStatus = getDeadlineStatus(app.applicationDeadline);
      if (filters.deadline === 'urgent' && !deadlineStatus.urgent) return false;
      if (filters.deadline === 'overdue' && deadlineStatus.status !== 'overdue') return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return app.studentName.toLowerCase().includes(searchTerm) ||
             app.university.toLowerCase().includes(searchTerm) ||
             app.program.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  const countries = [...new Set(applications.map(app => app.country))];
  const statuses = Object.keys(statusConfig);

  if (loading) {
    return (
      <div className="aetherial-background">
        <style>{AETHERIAL_CSS}</style>
        <div className="aetherial-content">
          <div className="loading-state">
            <Icon name="clock" size={48} />
            <p>Loading applications...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aetherial-background">
      <style>{AETHERIAL_CSS}</style>
      
      <div className="aetherial-content">
        {/* Page Header */}
        <div className="glass-card">
          <div className="glass-card-content">
            <h1 className="page-title">University Applications</h1>
            <p className="page-subtitle">
              Track application progress, deadlines, and requirements for all university applications
            </p>
            
            {/* Controls */}
            <div className="controls-section">
              <div className="filters-group">
                <select
                  className="glass-select"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Statuses</option>
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>

                <select
                  className="glass-select"
                  value={filters.country}
                  onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                >
                  <option value="all">All Countries</option>
                  {countries.map(country => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>

                <select
                  className="glass-select"
                  value={filters.deadline}
                  onChange={(e) => setFilters(prev => ({ ...prev, deadline: e.target.value }))}
                >
                  <option value="all">All Deadlines</option>
                  <option value="overdue">Overdue</option>
                  <option value="urgent">Urgent (≤ 7 days)</option>
                </select>

                <input
                  type="text"
                  className="glass-input search-input"
                  placeholder="Search applications..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>

              <div className="view-toggle">
                <button
                  className={`view-toggle-btn ${viewMode === 'cards' ? 'view-toggle-btn--active' : ''}`}
                  onClick={() => setViewMode('cards')}
                >
                  <Icon name="squares-2x2" size={16} />
                  Cards
                </button>
                <button
                  className={`view-toggle-btn ${viewMode === 'list' ? 'view-toggle-btn--active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <Icon name="list-bullet" size={16} />
                  List
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Overview */}
        <div className="stats-overview">
          <div className="stat-card">
            <h3 className="stat-number">{applications.length}</h3>
            <p className="stat-label">Total Applications</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number stat-number--warning">
              {applications.filter(app => app.status === 'in-progress').length}
            </h3>
            <p className="stat-label">In Progress</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number stat-number--success">
              {applications.filter(app => app.status === 'submitted').length}
            </h3>
            <p className="stat-label">Submitted</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-number stat-number--danger">
              {applications.filter(app => {
                const deadline = getDeadlineStatus(app.applicationDeadline);
                return deadline.urgent || deadline.status === 'overdue';
              }).length}
            </h3>
            <p className="stat-label">Urgent/Overdue</p>
          </div>
        </div>

        {/* Applications */}
        <div className="glass-card">
          {filteredApplications.length > 0 ? (
            <div className="applications-grid">
              {filteredApplications.map(app => {
                const deadlineStatus = getDeadlineStatus(app.applicationDeadline);
                const progress = getRequirementProgress(app.requirements);
                const statusInfo = statusConfig[app.status];

                return (
                  <div 
                    key={app.id}
                    className="application-card"
                    onClick={() => setSelectedApp(app)}
                  >
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3 className="card-title">{app.university}</h3>
                        <p className="card-subtitle">{app.program}</p>
                        <p className="card-student">{app.studentName}</p>
                      </div>
                      <div 
                        className="status-badge"
                        style={{ 
                          color: statusInfo.color,
                          backgroundColor: statusInfo.bgColor 
                        }}
                      >
                        {statusInfo.label}
                      </div>
                    </div>

                    <div className="deadline-section">
                      <span className="deadline-label">Application Deadline</span>
                      <div 
                        className="deadline-value"
                        style={{ color: deadlineStatus.color }}
                      >
                        <Icon name="clock" size={14} />
                        {deadlineStatus.text}
                      </div>
                    </div>

                    <div className="progress-section">
                      <div className="progress-header">
                        <span className="progress-label">Requirements</span>
                        <span className="progress-count">
                          {progress.completed}/{progress.total}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${progress.percentage}%` }}
                        />
                      </div>
                    </div>

                    <div className="card-meta">
                      <div className="meta-item">
                        <Icon name="map-pin" size={14} />
                        <span>{app.country}</span>
                      </div>
                      <div className="meta-item">
                        <Icon name="user" size={14} />
                        <span>{app.consultant}</span>
                      </div>
                      <div className="meta-item">
                        <Icon name="currency-dollar" size={14} />
                        <span>${app.applicationFee} {app.feePaid ? '(Paid)' : '(Pending)'}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <Icon name="document-text" size={48} />
              <h3>No applications found</h3>
              <p>Try adjusting your filters to see more results</p>
            </div>
          )}
        </div>

        {/* Application Detail Modal */}
        {selectedApp && (
          <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
            <div className="glass-modal" onClick={e => e.stopPropagation()}>
              <div className="glass-modal-header">
                <h3 className="glass-modal-title">
                  {selectedApp.university} - {selectedApp.program}
                </h3>
                <button 
                  className="glass-modal-close"
                  onClick={() => setSelectedApp(null)}
                >
                  <Icon name="x-mark" size={20} />
                </button>
              </div>

              <div className="glass-modal-body">
                {/* Application Info */}
                <div className="modal-section">
                  <h4 className="modal-section-title">Application Details</h4>
                  <div className="application-details-grid">
                    <div className="detail-item">
                      <strong>Student:</strong> {selectedApp.studentName}
                    </div>
                    <div className="detail-item">
                      <strong>Country:</strong> {selectedApp.country}
                    </div>
                    <div className="detail-item">
                      <strong>Deadline:</strong> {selectedApp.applicationDeadline}
                    </div>
                    <div className="detail-item">
                      <strong>Status:</strong> {statusConfig[selectedApp.status].label}
                    </div>
                    <div className="detail-item">
                      <strong>Application Fee:</strong> ${selectedApp.applicationFee} 
                      {selectedApp.feePaid ? ' (Paid)' : ' (Pending)'}
                    </div>
                    <div className="detail-item">
                      <strong>Consultant:</strong> {selectedApp.consultant}
                    </div>
                  </div>
                  {selectedApp.notes && (
                    <div className="notes-section">
                      <strong>Notes:</strong> {selectedApp.notes}
                    </div>
                  )}
                </div>

                {/* Requirements Checklist */}
                <div className="modal-section">
                  <h4 className="modal-section-title">Requirements Checklist</h4>
                  <div className="requirements-grid">
                    {Object.entries(selectedApp.requirements).map(([key, req]) => (
                      <div key={key} className="requirement-item">
                        <div className="requirement-left">
                          <div 
                            className={`requirement-checkbox ${req.completed ? 'requirement-checkbox--checked' : ''}`}
                            onClick={() => updateRequirement(selectedApp.id, key, { completed: !req.completed })}
                          >
                            {req.completed && <Icon name="check" size={12} />}
                          </div>
                          <div className="requirement-info">
                            <h5 className="requirement-name">
                              {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </h5>
                            <p className="requirement-notes">{req.notes}</p>
                          </div>
                        </div>
                        <div className="requirement-date">
                          {req.uploadedDate ? new Date(req.uploadedDate).toLocaleDateString() : 'Not uploaded'}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status History */}
                <div className="modal-section">
                  <h4 className="modal-section-title">Status History</h4>
                  <div className="status-timeline">
                    {selectedApp.statusHistory.map((item, index) => (
                      <div key={index} className="timeline-item">
                        <div className="timeline-dot" />
                        <div className="timeline-content">
                          <p className="timeline-date">{new Date(item.date).toLocaleDateString()}</p>
                          <p className="timeline-note">{item.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Aetherial Glass Design System CSS
const AETHERIAL_CSS = `
/* ===== AETHERIAL GLASS DESIGN SYSTEM ===== */
:root {
  /* Primary Colors */
  --primary: #6366f1;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  
  /* Secondary Colors */
  --secondary: #8b5cf6;
  --secondary-light: #a78bfa;
  
  /* State Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #06b6d4;
  
  /* Background Colors */
  --dark: #0f172a;
  --dark-secondary: #1e293b;
  --dark-tertiary: #334155;
  
  /* Glass/Surface Colors */
  --glass-bg: rgba(15, 23, 42, 0.6);
  --glass-bg-light: rgba(30, 41, 59, 0.4);
  --glass-bg-lighter: rgba(51, 65, 85, 0.3);
  
  /* Text Colors */
  --text: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  /* Border & Effects */
  --border: rgba(148, 163, 184, 0.1);
  --glass-border: rgba(148, 163, 184, 0.15);
  --glass-border-hover: rgba(148, 163, 184, 0.3);
  
  /* Shadows */
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 40px rgba(99, 102, 241, 0.3);
  --shadow-glow-secondary: 0 0 40px rgba(139, 92, 246, 0.3);
  --shadow-glow-success: 0 0 40px rgba(16, 185, 129, 0.3);
  
  /* Animations */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Background Container */
.aetherial-background {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
  position: relative;
  overflow: hidden;
}

/* Animated Background Orbs */
.aetherial-background::before,
.aetherial-background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.aetherial-background::before {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  top: -300px;
  right: -300px;
  animation-delay: 0s;
}

.aetherial-background::after {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
  bottom: -250px;
  left: -250px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-50px) rotate(120deg); }
  66% { transform: translateY(25px) rotate(240deg); }
}

/* Main Content Container */
.aetherial-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1600px;
  margin: 0 auto;
}

/* Glass Cards */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  margin-bottom: 2rem;
  transition: var(--transition);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
  border-color: var(--glass-border-hover);
}

.glass-card-content {
  padding: 2rem;
}

/* Header Styles */
.page-title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.page-subtitle {
  margin: 0 0 2rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
  line-height: 1.5;
}

/* Controls */
.controls-section {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
}

.filters-group {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

/* Form Elements */
.glass-input, .glass-select {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.75rem 1rem;
  color: var(--text);
  font-size: 0.9rem;
  transition: var(--transition);
}

.glass-input:focus, .glass-select:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.glass-input::placeholder {
  color: var(--text-muted);
}

.search-input {
  min-width: 250px;
}

/* View Toggle */
.view-toggle {
  display: flex;
  background: var(--glass-bg-light);
  backdrop-filter: blur(20px);
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  padding: 0.25rem;
}

.view-toggle-btn {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: var(--text-secondary);
  font-size: 0.875rem;
  cursor: pointer;
  border-radius: 6px;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.view-toggle-btn--active {
  background: var(--primary);
  color: white;
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
}

/* Statistics Overview */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: var(--shadow-card);
  transition: var(--transition);
  text-align: center;
}

.stat-card:hover {
  transform: translateY(-2px);
  border-color: var(--glass-border-hover);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0 0 0.5rem 0;
  display: block;
}

.stat-number--warning {
  background: linear-gradient(135deg, var(--warning) 0%, #fb923c 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-number--success {
  background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-number--danger {
  background: linear-gradient(135deg, var(--danger) 0%, #dc2626 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
  font-weight: 500;
}

/* Applications Grid */
.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.application-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: var(--transition);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.3s ease-out;
}

.application-card:hover {
  border-color: var(--primary);
  box-shadow: var(--shadow-glow);
  transform: translateY(-4px);
}

@keyframes fadeIn {
  from { 
    opacity: 0; 
    transform: translateY(10px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

/* Card Header */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.card-header-left {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text);
  line-height: 1.3;
}

.card-subtitle {
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
  font-weight: 500;
}

.card-student {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  flex-shrink: 0;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Deadline Section */
.deadline-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--glass-bg-lighter);
  border-radius: 8px;
  border: 1px solid var(--glass-border);
}

.deadline-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 600;
}

.deadline-value {
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Progress Section */
.progress-section {
  margin-bottom: 1rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.progress-label {
  font-size: 0.85rem;
  color: var(--text);
  font-weight: 600;
}

.progress-count {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.progress-bar {
  width: 100%;
  height: 6px;
  background: var(--glass-bg-lighter);
  border-radius: 3px;
  overflow: hidden;
  border: 1px solid var(--glass-border);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--success) 0%, #059669 100%);
  transition: width 0.3s ease;
}

/* Card Meta */
.card-meta {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--glass-border);
  font-size: 0.8rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
  backdrop-filter: blur(8px);
}

.glass-modal {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.glass-modal-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
}

.glass-modal-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.glass-modal-close {
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: var(--transition);
}

.glass-modal-close:hover {
  background: var(--glass-bg-light);
  color: var(--text);
}

.glass-modal-body {
  padding: 2rem;
  overflow-y: auto;
  flex: 1;
}

/* Modal Sections */
.modal-section {
  margin-bottom: 2rem;
}

.modal-section-title {
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text);
}

.application-details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  color: var(--text-secondary);
}

.detail-item strong {
  color: var(--text);
}

.notes-section {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--glass-bg-lighter);
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
}

.notes-section strong {
  color: var(--text);
}

/* Requirements Grid */
.requirements-grid {
  display: grid;
  gap: 0.75rem;
}

.requirement-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: var(--glass-bg-lighter);
  border-radius: 8px;
  border: 1px solid var(--glass-border);
  transition: var(--transition);
}

.requirement-item:hover {
  border-color: var(--glass-border-hover);
}

.requirement-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.requirement-checkbox {
  width: 18px;
  height: 18px;
  border: 2px solid var(--glass-border);
  border-radius: 4px;
  background: var(--glass-bg-light);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.requirement-checkbox--checked {
  background: var(--success);
  border-color: var(--success);
  color: white;
}

.requirement-info {
  flex: 1;
}

.requirement-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.25rem 0;
  text-transform: capitalize;
}

.requirement-notes {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin: 0;
}

.requirement-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-align: right;
  flex-shrink: 0;
}

/* Status Timeline */
.status-timeline {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.timeline-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.timeline-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--primary);
  margin-top: 0.5rem;
  flex-shrink: 0;
}

.timeline-content {
  flex: 1;
}

.timeline-date {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0 0 0.25rem 0;
}

.timeline-note {
  font-size: 0.85rem;
  color: var(--text);
  margin: 0;
}

/* States */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  color: var(--text-muted);
  text-align: center;
}

.empty-state h3 {
  color: var(--text);
  margin: 1rem 0 0.5rem 0;
  font-size: 1.25rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
}

.loading-state p {
  margin: 1rem 0 0 0;
  font-size: 1.1rem;
}

/* Scrollbar Styling */
.glass-modal-body::-webkit-scrollbar {
  width: 6px;
}

.glass-modal-body::-webkit-scrollbar-track {
  background: var(--glass-bg-lighter);
  border-radius: 3px;
}

.glass-modal-body::-webkit-scrollbar-thumb {
  background: var(--glass-border-hover);
  border-radius: 3px;
}

.glass-modal-body::-webkit-scrollbar-thumb:hover {
  background: var(--text-muted);
}

/* Responsive Design */
@media (max-width: 768px) {
  .aetherial-content {
    padding: 1rem;
  }

  .controls-section {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filters-group {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .search-input {
    min-width: unset;
  }

  .applications-grid {
    grid-template-columns: 1fr;
    padding: 1rem;
  }

  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .glass-modal {
    margin: 0.5rem;
    max-height: 95vh;
  }

  .glass-modal-header,
  .glass-modal-body {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }

  .application-details-grid {
    grid-template-columns: 1fr;
  }
}

@media (min-width: 1400px) {
  .aetherial-content {
    max-width: 1800px;
    padding: 2.5rem;
  }

  .applications-grid {
    grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
    gap: 2rem;
  }
}
`;