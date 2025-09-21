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
      <section className="consultants-main">
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>
        <div className="loading-state">Loading consultants...</div>
      </section>
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

        .consultants-main {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
          color: var(--text);
          position: relative;
        }

        .consultants {
          padding: 2rem;
          display: grid;
          gap: 2rem;
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
        }

        .consultants__header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: var(--shadow-card);
        }

        .consultants__title h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text) 0%, var(--primary) 50%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .consultants__subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .consultants__actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .consultants__controls {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex-wrap: wrap;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .search-input {
          padding: 0.75rem 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text);
          min-width: 250px;
          transition: all 0.3s ease;
        }

        .search-input::placeholder {
          color: var(--text-muted);
        }

        .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .filter-select {
          padding: 0.75rem 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text);
          transition: all 0.3s ease;
        }

        .filter-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .view-toggle {
          display: flex;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          overflow: hidden;
        }

        .view-toggle button {
          padding: 0.75rem;
          border: none;
          background: transparent;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .view-toggle button:hover {
          background: rgba(99, 102, 241, 0.1);
          color: var(--text);
        }

        .view-toggle button.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .consultants__stats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 1rem;
        }

        .dash-stat {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.5rem;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
        }

        .dash-stat:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: var(--shadow-glow), var(--shadow-card);
        }

        .dash-stat__icon {
          width: 48px;
          height: 48px;
          display: grid;
          place-items: center;
          background: var(--glass-bg-light);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
        }

        .dash-stat__icon .icon {
          width: 20px;
          height: 20px;
          color: var(--primary);
        }

        .dash-stat__meta {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .dash-stat__label {
          font-size: 12px;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .dash-stat__value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text);
        }

        .consultants-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .consultant-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
        }

        .consultant-card:hover {
          transform: translateY(-4px);
          border-color: rgba(99, 102, 241, 0.3);
          box-shadow: var(--shadow-glow), var(--shadow-card);
        }

        .consultant-card__header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .consultant-avatar {
          width: 56px;
          height: 56px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: grid;
          place-items: center;
          color: white;
          font-weight: 600;
          font-size: 20px;
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }

        .consultant-info h3 {
          margin: 0 0 4px 0;
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--text);
        }

        .consultant-info p {
          margin: 0;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .consultant-card__body {
          margin-bottom: 1.5rem;
        }

        .consultant-meta {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .consultant-meta-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: var(--text-secondary);
        }

        .specializations {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin: 1rem 0;
        }

        .specialization-tag {
          background: var(--glass-bg-light);
          color: var(--text-secondary);
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 12px;
          border: 1px solid var(--glass-border);
        }

        .performance-metrics {
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          padding: 1rem;
          margin: 1rem 0;
        }

        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.75rem;
        }

        .metric-item {
          text-align: center;
        }

        .metric-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: var(--primary);
        }

        .metric-label {
          font-size: 11px;
          color: var(--text-muted);
        }

        .assigned-students {
          margin: 1rem 0;
        }

        .assigned-students h4 {
          margin: 0 0 8px 0;
          font-size: 14px;
          font-weight: 600;
          color: var(--text);
        }

        .student-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.25rem;
        }

        .student-tag {
          background: var(--primary);
          color: white;
          padding: 0.125rem 0.5rem;
          border-radius: 8px;
          font-size: 11px;
        }

        .consultant-card__actions {
          display: flex;
          gap: 0.5rem;
          justify-content: flex-end;
        }

        .status-active {
          color: var(--success);
          font-weight: 500;
        }

        .status-inactive {
          color: var(--text-muted);
          font-weight: 500;
        }

        .data-table {
          width: 100%;
          border-collapse: collapse;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .data-table th {
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text);
          border-bottom: 1px solid var(--glass-border);
        }

        .data-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
          vertical-align: middle;
          color: var(--text);
        }

        .data-table tr:hover {
          background: rgba(99, 102, 241, 0.05);
        }

        .loading-state, .inbox__empty {
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

        .alert {
          padding: 12px 16px;
          border-radius: 12px;
          margin-bottom: 1rem;
        }

        .alert--error {
          background: rgba(239, 68, 68, 0.2);
          color: var(--danger);
          border: 1px solid rgba(239, 68, 68, 0.3);
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
          background: var(--glass-bg-light);
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

        .action-button--danger {
          background: var(--danger);
          border-color: var(--danger);
          color: white;
        }

        .action-button--danger:hover {
          background: #dc2626;
          border-color: #dc2626;
        }

        .action-button--small {
          padding: 0.5rem 0.75rem;
          font-size: 12px;
        }

        @media (max-width: 960px) {
          .consultants {
            padding: 1rem;
          }
          
          .consultants__header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .consultants__actions {
            width: 100%;
          }
          
          .consultants__controls {
            flex-direction: column;
            align-items: stretch;
          }
          
          .consultants__stats {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .consultants-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <section className="consultants-main">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>

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
                              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
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
                          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {consultant.performanceMetrics?.totalStudents || 0} total
                          </div>
                        </td>
                        <td>
                          <strong style={{ color: 'var(--primary)' }}>
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
      </section>
    </>
  );
}