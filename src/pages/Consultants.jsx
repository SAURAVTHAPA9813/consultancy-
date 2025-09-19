import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import styles from '@styles/Dashboard.module.css';
import buttonStyles from '@styles/Buttons.module.css';
import Icon from '@/components/Icon.jsx';
import ConsultantForm from '@/components/ConsultantForm.jsx';

export default function ConsultantList() {
  const { branch, user } = useAuth();
  const { addNotification } = useNotifications();
  const [consultants, setConsultants] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingConsultant, setEditingConsultant] = useState(null);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [filters, setFilters] = useState({
    search: '',
    specialization: '',
    status: 'all'
  });

  const canEdit = user?.role === 'admin';

  useEffect(() => {
    loadConsultants();
    loadStudents();
  }, [branch]);

  const loadConsultants = async () => {
    try {
      setLoading(true);
      // Enhanced consultant data with performance metrics
      const mockConsultants = [
        {
          id: 1,
          name: 'Dr. Nishan Timilsina',
          email: 'nishan@consultancy.com',
          phone: '+977-9841234567',
          branch: 'Main',
          isActive: true,
          joinedDate: '2023-01-15',
          specializations: ['US Universities', 'Canada Universities', 'Computer Science', 'Engineering'],
          expertise: ['STEM Programs', 'Graduate Applications', 'Scholarship Guidance'],
          assignedStudents: [1, 2, 4, 7, 12],
          performanceMetrics: {
            totalStudents: 45,
            activeStudents: 12,
            successRate: 89,
            avgResponseTime: '2.3 hours',
            completedApplications: 38,
            pendingApplications: 7,
            monthlyTarget: 15,
            monthlyCompleted: 11
          },
          availability: {
            monday: ['09:00', '17:00'],
            tuesday: ['09:00', '17:00'],
            wednesday: ['09:00', '17:00'],
            thursday: ['09:00', '17:00'],
            friday: ['09:00', '17:00'],
            saturday: ['10:00', '14:00'],
            sunday: []
          },
          languages: ['English', 'Nepali', 'Hindi'],
          education: 'PhD in Computer Science, University of Toronto',
          experience: '8 years in educational consulting'
        },
        {
          id: 2,
          name: 'Jenish Neupane',
          email: 'jenish@consultancy.com',
          phone: '+977-9857891234',
          branch: 'Main',
          isActive: true,
          joinedDate: '2023-03-20',
          specializations: ['Australia Universities', 'UK Universities', 'Business Programs'],
          expertise: ['MBA Applications', 'Work Visa Guidance', 'Corporate Partnerships'],
          assignedStudents: [3, 5, 8, 11],
          performanceMetrics: {
            totalStudents: 32,
            activeStudents: 8,
            successRate: 94,
            avgResponseTime: '1.8 hours',
            completedApplications: 28,
            pendingApplications: 4,
            monthlyTarget: 12,
            monthlyCompleted: 14
          },
          availability: {
            monday: ['10:00', '18:00'],
            tuesday: ['10:00', '18:00'],
            wednesday: ['10:00', '18:00'],
            thursday: ['10:00', '18:00'],
            friday: ['10:00', '18:00'],
            saturday: [],
            sunday: []
          },
          languages: ['English', 'Nepali'],
          education: 'MBA, Australian National University',
          experience: '6 years in international education'
        },
        {
          id: 3,
          name: 'Sakura Ghimire',
          email: 'sakura@consultancy.com',
          phone: '+977-9823456789',
          branch: 'Main',
          isActive: true,
          joinedDate: '2023-06-10',
          specializations: ['Marketing Programs', 'Creative Arts', 'Europe Universities'],
          expertise: ['Portfolio Development', 'Creative Writing', 'Scholarship Applications'],
          assignedStudents: [6, 9, 10],
          performanceMetrics: {
            totalStudents: 28,
            activeStudents: 6,
            successRate: 86,
            avgResponseTime: '3.1 hours',
            completedApplications: 22,
            pendingApplications: 6,
            monthlyTarget: 10,
            monthlyCompleted: 8
          },
          availability: {
            monday: ['09:00', '16:00'],
            tuesday: ['09:00', '16:00'],
            wednesday: ['09:00', '16:00'],
            thursday: ['09:00', '16:00'],
            friday: ['09:00', '16:00'],
            saturday: ['10:00', '13:00'],
            sunday: []
          },
          languages: ['English', 'Nepali', 'German'],
          education: 'MA in International Marketing, University of Berlin',
          experience: '4 years in educational marketing'
        }
      ];
      setConsultants(mockConsultants);
    } catch (err) {
      setError('Failed to load consultants');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadStudents = async () => {
    try {
      const data = await api.leads.list();
      setStudents(data);
    } catch (err) {
      console.error('Failed to load students:', err);
    }
  };

  const handleAdd = async (consultantData) => {
    try {
      setError('');
      const existingConsultant = consultants.find(c =>
        c.email && consultantData.email &&
        c.email.toLowerCase() === consultantData.email.toLowerCase()
      );
      if (existingConsultant) {
        setError('A consultant with this email already exists');
        return;
      }
      
      const created = {
        id: Date.now(),
        ...consultantData,
        branch,
        isActive: true,
        joinedDate: new Date().toISOString().split('T')[0],
        assignedStudents: [],
        performanceMetrics: {
          totalStudents: 0,
          activeStudents: 0,
          successRate: 0,
          avgResponseTime: '0 hours',
          completedApplications: 0,
          pendingApplications: 0,
          monthlyTarget: 10,
          monthlyCompleted: 0
        },
        createdAt: new Date().toISOString()
      };
      
      setConsultants(prev => [created, ...prev]);
      setShowForm(false);
      
      addNotification({
        type: 'success',
        title: 'Consultant Added',
        message: `New consultant added: ${created.name}`,
        category: 'consultants'
      });
    } catch (err) {
      setError('Failed to create consultant');
      console.error(err);
    }
  };

  const handleEdit = (consultant) => {
    setEditingConsultant(consultant);
    setShowForm(true);
  };

  const handleUpdate = async (consultantData) => {
    try {
      setError('');
      const updated = {
        ...editingConsultant,
        ...consultantData,
        updatedAt: new Date().toISOString()
      };
      
      setConsultants(prev => prev.map(c => c.id === updated.id ? updated : c));
      setShowForm(false);
      setEditingConsultant(null);
      
      addNotification({
        type: 'success',
        title: 'Consultant Updated',
        message: `${updated.name} has been updated`,
        category: 'consultants'
      });
    } catch (err) {
      setError('Failed to update consultant');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm('Are you sure you want to delete this consultant?')) return;
    
    try {
      setConsultants(prev => prev.filter(c => c.id !== id));
      
      addNotification({
        type: 'success',
        title: 'Consultant Deleted',
        message: 'Consultant has been removed',
        category: 'consultants'
      });
    } catch (err) {
      setError('Failed to delete consultant');
      console.error(err);
    }
  };

  const handleAssignStudent = async (consultantId, studentId) => {
    try {
      setConsultants(prev => prev.map(c => 
        c.id === consultantId 
          ? { ...c, assignedStudents: [...(c.assignedStudents || []), studentId] }
          : c
      ));
      
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

  const consultantsForBranch = consultants.filter(c => (c.branch || 'Main') === branch);
  
  const filteredConsultants = consultantsForBranch.filter(consultant => {
    const matchesSearch = consultant.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         consultant.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchesSpecialization = !filters.specialization || 
                                 consultant.specializations?.some(spec => 
                                   spec.toLowerCase().includes(filters.specialization.toLowerCase()));
    const matchesStatus = filters.status === 'all' || 
                         (filters.status === 'active' && consultant.isActive) ||
                         (filters.status === 'inactive' && !consultant.isActive);
    
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const activeCount = consultantsForBranch.filter(c => c.isActive).length;
  const totalCount = consultantsForBranch.length;
  const avgSuccessRate = consultantsForBranch.length > 0 
    ? Math.round(consultantsForBranch.reduce((sum, c) => sum + (c.performanceMetrics?.successRate || 0), 0) / consultantsForBranch.length)
    : 0;

  const getStudentName = (studentId) => {
    const student = students.find(s => s.id === studentId);
    return student ? student.name : `Student ${studentId}`;
  };

  if (loading) {
    return (
      <section className="consultants">
        <div className="inbox__empty">Loading consultants...</div>
      </section>
    );
  }

  return (
    <>
      {/* ENHANCED STYLES */}
      <style>{`
        .consultants{padding:var(--space-6,24px);display:grid;gap:var(--space-6,24px);}
        .consultants__header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4,16px);}
        .consultants__title h2{margin:0 0 var(--space-1,4px) 0;font-size:var(--font-2xl,24px);font-weight:var(--font-bold,700);color:var(--color-text,#111827);}
        .consultants__subtitle{margin:0;color:var(--color-text-muted,#6b7280);font-size:var(--font-sm,14px);}
        .consultants__actions{display:flex;gap:var(--space-2,8px);flex-wrap:wrap;}

        .consultants__controls{display:flex;align-items:center;gap:var(--space-4,16px);flex-wrap:wrap;margin-bottom:var(--space-4,16px);}
        .search-input{padding:.5rem .75rem;border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);
          background:var(--color-surface,#fff);color:var(--color-text,#111827);min-width:250px;}
        .filter-select{padding:.5rem .75rem;border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);
          background:var(--color-surface,#fff);color:var(--color-text,#111827);}
        .view-toggle{display:flex;gap:4px;border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);overflow:hidden;}
        .view-toggle button{padding:.5rem .75rem;border:none;background:var(--color-surface,#fff);cursor:pointer;transition:background .2s;}
        .view-toggle button.active{background:var(--color-primary,#2563eb);color:white;}

        .consultants__stats{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--space-4,16px);}
        .dash-stat{display:flex;align-items:center;gap:var(--space-3,12px);padding:var(--space-4,16px);
          background:var(--color-surface,#fff);border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-lg,12px);
          box-shadow:var(--shadow-xs,0 1px 2px rgba(0,0,0,.04));}
        .dash-stat__icon{width:40px;height:40px;display:grid;place-items:center;background:var(--color-bg,#f9fafb);
          border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);}
        .dash-stat__icon .icon{width:18px;height:18px;}
        .dash-stat__meta{display:flex;flex-direction:column;gap:2px;}
        .dash-stat__label{font-size:12px;color:var(--color-text-muted,#6b7280);}
        .dash-stat__value{font-size:20px;font-weight:var(--font-bold,700);color:var(--color-text,#111827);}

        .consultants-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(350px,1fr));gap:var(--space-4,16px);}
        .consultant-card{background:var(--color-surface,#fff);border:1px solid var(--color-border,#e5e7eb);
          border-radius:var(--radius-lg,12px);padding:var(--space-5,20px);box-shadow:var(--shadow-xs,0 1px 2px rgba(0,0,0,.04));
          transition:transform .2s ease,box-shadow .2s ease;}
        .consultant-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-md,0 4px 6px rgba(0,0,0,.1));}
        
        .consultant-card__header{display:flex;align-items:center;gap:var(--space-3,12px);margin-bottom:var(--space-4,16px);}
        .consultant-avatar{width:56px;height:56px;border-radius:50%;background:var(--color-primary,#2563eb);
          display:grid;place-items:center;color:white;font-weight:600;font-size:20px;}
        .consultant-info h3{margin:0 0 4px 0;font-size:var(--font-lg,18px);font-weight:600;color:var(--color-text,#111827);}
        .consultant-info p{margin:0;font-size:14px;color:var(--color-text-muted,#6b7280);}

        .consultant-card__body{margin-bottom:var(--space-4,16px);}
        .consultant-meta{display:flex;flex-direction:column;gap:8px;}
        .consultant-meta-item{display:flex;align-items:center;gap:8px;font-size:14px;color:var(--color-text,#111827);}
        
        .specializations{display:flex;flex-wrap:wrap;gap:4px;margin:8px 0;}
        .specialization-tag{background:var(--color-bg,#f3f4f6);color:var(--color-text,#374151);
          padding:2px 8px;border-radius:12px;font-size:12px;}
        
        .performance-metrics{background:var(--color-bg,#f9fafb);border-radius:var(--radius-md,8px);
          padding:var(--space-3,12px);margin:var(--space-3,12px) 0;}
        .metrics-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;}
        .metric-item{text-align:center;}
        .metric-value{font-size:18px;font-weight:600;color:var(--color-primary,#2563eb);}
        .metric-label{font-size:11px;color:var(--color-text-muted,#6b7280);}

        .assigned-students{margin:var(--space-3,12px) 0;}
        .assigned-students h4{margin:0 0 8px 0;font-size:14px;font-weight:600;}
        .student-list{display:flex;flex-wrap:wrap;gap:4px;}
        .student-tag{background:var(--color-primary,#2563eb);color:white;
          padding:2px 6px;border-radius:8px;font-size:11px;}

        .consultant-card__actions{display:flex;gap:8px;justify-content:flex-end;}
        
        .status-active{color:#16a34a;font-weight:500;}
        .status-inactive{color:#6b7280;font-weight:500;}

        .data-table{width:100%;border-collapse:collapse;background:var(--color-surface,#fff);
          border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);overflow:hidden;}
        .data-table th{background:var(--color-bg,#f9fafb);padding:var(--space-3,12px);text-align:left;
          font-weight:var(--font-semibold,600);color:var(--color-text,#111827);border-bottom:1px solid var(--color-border,#e5e7eb);}
        .data-table td{padding:var(--space-3,12px);border-bottom:1px solid var(--color-border,#e5e7eb);vertical-align:middle;}
        .data-table tr:hover{background:var(--color-surface-hover,#f9fafb);}

        .inbox__empty{padding:2.5rem 1rem;text-align:center;color:var(--color-text-muted,#6b7280);}

        .modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:grid;place-items:center;
          padding:var(--space-6,24px);z-index:9999;}
        .modal-content{background:var(--color-surface,#fff);color:var(--color-text,#111827);
          border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-xl,14px);
          box-shadow:var(--shadow-xl,0 20px 40px rgba(0,0,0,.18));overflow:hidden;}
        .modal-header{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);
          padding:var(--space-4,16px) var(--space-5,20px);border-bottom:1px solid var(--color-border,#e5e7eb);background:#f8f9fa;}
        .modal-close{appearance:none;background:transparent;border:1px solid var(--color-border,#e5e7eb);
          border-radius:var(--radius-md,8px);padding:.35rem .55rem;cursor:pointer;display:inline-flex;
          align-items:center;justify-content:center;}
        .modal-close:hover{background:var(--color-surface-hover,#f9fafb);}

        .action-button{display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
          padding:.55rem .85rem;border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);
          background:var(--color-surface,#fff);color:var(--color-text,#111827);font-weight:var(--font-medium,500);
          cursor:pointer;transition:transform .12s ease, background-color .12s ease, border-color .12s ease;}
        .action-button:hover{transform:translateY(-1px);background:var(--color-surface-hover,#f9fafb);}
        .action-button--primary{background:var(--color-primary,#2563eb);border-color:var(--color-primary,#2563eb);color:var(--color-text-inverse,#fff);}
        .action-button--primary:hover{background:var(--color-primary-dark,#1e40af);border-color:var(--color-primary-dark,#1e40af);}
        .action-button--secondary{background:var(--color-bg,#f3f4f6);}
        .action-button--danger{background:var(--color-error,#ef4444);border-color:var(--color-error,#ef4444);color:#fff;}
        .action-button--danger:hover{background:#dc2626;border-color:#dc2626;}
        .action-button--small{padding:.35rem .55rem;font-size:12px;}

        @media (max-width: 960px){
          .consultants__header{flex-direction:column;align-items:flex-start;}
          .consultants__actions{width:100%;}
          .consultants__controls{flex-direction:column;align-items:stretch;}
          .consultants__stats{grid-template-columns:repeat(2,1fr);}
          .consultants-grid{grid-template-columns:1fr;}
        }
      `}</style>

      <section className="consultants">
        {/* Header */}
        <div className="consultants__header">
          <div className="consultants__title">
            <h2>Consultant Management — {branch}</h2>
            <p className="consultants__subtitle">Manage your team of consultants with performance tracking</p>
          </div>

          <div className="consultants__actions">
            {canEdit && (
              <button
                className="action-button action-button--primary"
                onClick={() => setShowForm(true)}
                aria-label="Add new consultant"
              >
                <Icon name="users" className="icon icon--sm" decorative />
                Add Consultant
              </button>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="consultants__controls">
          <input
            type="search"
            placeholder="Search consultants..."
            className="search-input"
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
          
          <select 
            className="filter-select"
            value={filters.specialization}
            onChange={(e) => setFilters(prev => ({ ...prev, specialization: e.target.value }))}
          >
            <option value="">All Specializations</option>
            <option value="US Universities">US Universities</option>
            <option value="Canada Universities">Canada Universities</option>
            <option value="Australia Universities">Australia Universities</option>
            <option value="UK Universities">UK Universities</option>
            <option value="Business Programs">Business Programs</option>
            <option value="Engineering">Engineering</option>
          </select>

          <select 
            className="filter-select"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>

          <div className="view-toggle">
            <button 
              className={viewMode === 'cards' ? 'active' : ''}
              onClick={() => setViewMode('cards')}
            >
              <Icon name="grid" size={16} />
            </button>
            <button 
              className={viewMode === 'table' ? 'active' : ''}
              onClick={() => setViewMode('table')}
            >
              <Icon name="list" size={16} />
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="consultants__stats">
          <div className="dash-stat">
            <div className="dash-stat__icon">
              <Icon name="users" className="icon" decorative />
            </div>
            <div className="dash-stat__meta">
              <div className="dash-stat__label">Total Consultants</div>
              <div className="dash-stat__value">{totalCount}</div>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__icon">
              <Icon name="briefcase" className="icon" decorative />
            </div>
            <div className="dash-stat__meta">
              <div className="dash-stat__label">Active</div>
              <div className="dash-stat__value">{activeCount}</div>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__icon">
              <Icon name="chart" className="icon" decorative />
            </div>
            <div className="dash-stat__meta">
              <div className="dash-stat__label">Avg Success Rate</div>
              <div className="dash-stat__value">{avgSuccessRate}%</div>
            </div>
          </div>
          <div className="dash-stat">
            <div className="dash-stat__icon">
              <Icon name="clipboard" className="icon" decorative />
            </div>
            <div className="dash-stat__meta">
              <div className="dash-stat__label">Total Students</div>
              <div className="dash-stat__value">
                {consultantsForBranch.reduce((sum, c) => sum + (c.performanceMetrics?.totalStudents || 0), 0)}
              </div>
            </div>
          </div>
        </div>

        {error && <div className="alert alert--error">{error}</div>}

        {/* Main Content */}
        <div className={styles['dash-card']}>
          <div className={styles['dash-card__body']}>
            {filteredConsultants.length === 0 ? (
              <div className="inbox__empty">
                <p>No consultants found matching your criteria</p>
                {canEdit && !consultantsForBranch.length && (
                  <button
                    className="action-button action-button--primary"
                    onClick={() => setShowForm(true)}
                    style={{ marginTop: '12px' }}
                    aria-label="Add your first consultant"
                  >
                    <Icon name="users" className="icon icon--sm" decorative />
                    Add your first consultant
                  </button>
                )}
              </div>
            ) : viewMode === 'cards' ? (
              <div className="consultants-grid">
                {filteredConsultants.map(consultant => (
                  <div key={consultant.id} className="consultant-card">
                    <div className="consultant-card__header">
                      <div className="consultant-avatar">
                        {consultant.name ? consultant.name.charAt(0).toUpperCase() : '?'}
                      </div>
                      <div className="consultant-info">
                        <h3>
                          <Link to={`/consultants/${consultant.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                            {consultant.name || 'Unnamed Consultant'}
                          </Link>
                        </h3>
                        <p className={consultant.isActive ? 'status-active' : 'status-inactive'}>
                          {consultant.isActive ? 'Active' : 'Inactive'} • {consultant.assignedStudents?.length || 0} students
                        </p>
                      </div>
                    </div>

                    <div className="consultant-card__body">
                      <div className="consultant-meta">
                        <div className="consultant-meta-item">
                          <Icon name="messages" className="icon icon--sm" decorative />
                          <span>{consultant.email || 'No email'}</span>
                        </div>
                        <div className="consultant-meta-item">
                          <Icon name="phone" className="icon icon--sm" decorative />
                          <span>{consultant.phone || 'No phone'}</span>
                        </div>
                        <div className="consultant-meta-item">
                          <Icon name="calendar" className="icon icon--sm" decorative />
                          <span>Joined {new Date(consultant.joinedDate || consultant.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="specializations">
                        {consultant.specializations?.slice(0, 3).map((spec, index) => (
                          <span key={index} className="specialization-tag">{spec}</span>
                        ))}
                        {consultant.specializations?.length > 3 && (
                          <span className="specialization-tag">+{consultant.specializations.length - 3} more</span>
                        )}
                      </div>

                      <div className="performance-metrics">
                        <div className="metrics-grid">
                          <div className="metric-item">
                            <div className="metric-value">{consultant.performanceMetrics?.successRate || 0}%</div>
                            <div className="metric-label">Success Rate</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-value">{consultant.performanceMetrics?.activeStudents || 0}</div>
                            <div className="metric-label">Active Students</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-value">{consultant.performanceMetrics?.completedApplications || 0}</div>
                            <div className="metric-label">Completed</div>
                          </div>
                          <div className="metric-item">
                            <div className="metric-value">{consultant.performanceMetrics?.avgResponseTime || 'N/A'}</div>
                            <div className="metric-label">Avg Response</div>
                          </div>
                        </div>
                      </div>

                      {consultant.assignedStudents?.length > 0 && (
                        <div className="assigned-students">
                          <h4>Assigned Students</h4>
                          <div className="student-list">
                            {consultant.assignedStudents.slice(0, 3).map(studentId => (
                              <span key={studentId} className="student-tag">
                                {getStudentName(studentId)}
                              </span>
                            ))}
                            {consultant.assignedStudents.length > 3 && (
                              <span className="student-tag">+{consultant.assignedStudents.length - 3} more</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="consultant-card__actions">
                      {canEdit && (
                        <>
                          <button
                            className="action-button action-button--secondary action-button--small"
                            onClick={() => handleEdit(consultant)}
                            title="Edit consultant"
                          >
                            <Icon name="edit" className="icon icon--sm" decorative />
                            Edit
                          </button>
                          <button
                            className="action-button action-button--danger action-button--small"
                            onClick={() => handleDelete(consultant.id)}
                            title="Delete consultant"
                          >
                            <Icon name="trash" className="icon icon--sm" decorative />
                            Delete
                          </button>
                        </>
                      )}
                      <Link 
                        to={`/consultants/${consultant.id}`}
                        className="action-button action-button--primary action-button--small"
                      >
                        <Icon name="eye" className="icon icon--sm" decorative />
                        View
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Consultant</th>
                    <th>Specializations</th>
                    <th>Students</th>
                    <th>Success Rate</th>
                    <th>Response Time</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredConsultants.map(consultant => (
                    <tr key={consultant.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div className="consultant-avatar" style={{ width: '40px', height: '40px', fontSize: '16px' }}>
                            {consultant.name ? consultant.name.charAt(0).toUpperCase() : '?'}
                          </div>
                          <div>
                            <strong>
                              <Link to={`/consultants/${consultant.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                {consultant.name}
                              </Link>
                            </strong>
                            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                              {consultant.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="specializations">
                          {consultant.specializations?.slice(0, 2).map((spec, index) => (
                            <span key={index} className="specialization-tag">{spec}</span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>{consultant.performanceMetrics?.activeStudents || 0}</strong> active
                        <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                          {consultant.performanceMetrics?.totalStudents || 0} total
                        </div>
                      </td>
                      <td>
                        <strong style={{ color: 'var(--color-primary)' }}>
                          {consultant.performanceMetrics?.successRate || 0}%
                        </strong>
                      </td>
                      <td>{consultant.performanceMetrics?.avgResponseTime || 'N/A'}</td>
                      <td>
                        <span className={consultant.isActive ? 'status-active' : 'status-inactive'}>
                          {consultant.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <Link 
                            to={`/consultants/${consultant.id}`}
                            className="action-button action-button--small"
                          >
                            View
                          </Link>
                          {canEdit && (
                            <button
                              className="action-button action-button--small"
                              onClick={() => handleEdit(consultant)}
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{
              width: 'min(700px, 90vw)', 
              maxHeight: '90vh', 
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <div className="modal-header">
                <h3>{editingConsultant ? 'Edit Consultant' : 'Add New Consultant'}</h3>
                <button className="modal-close" onClick={() => setShowForm(false)}>
                  <Icon name="x-mark" className="icon" decorative />
                </button>
              </div>
              <div className="modal-body" style={{
                flex: 1,
                overflow: 'auto',
                padding: '1.5rem'
              }}>
                <ConsultantForm
                  consultant={editingConsultant}
                  onSubmit={editingConsultant ? handleUpdate : handleAdd}
                  consultants={consultants}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingConsultant(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}