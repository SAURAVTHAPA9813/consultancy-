import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import StudentForm from '@/components/StudentForm.jsx';
import dashboardStyles from '@styles/Dashboard.module.css';
import buttonStyles from '@styles/Buttons.module.css';
import Icon from '@/components/Icon.jsx';
import { Link } from 'react-router-dom';

export default function Students() {
  const { branch, user } = useAuth();
  const { addNotification } = useNotifications();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [showForm, setShowForm] = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'consultant';

  useEffect(() => {
    loadStudents();
  }, [branch]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await api.students.list();
      setStudents(data);
    } catch (err) {
      setError('Failed to load students');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const studentsForBranch = students.filter(s => (s.branch || 'Main') === branch);

  const filtered = studentsForBranch
    .filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeCount = studentsForBranch.filter(s => s.status === 'active').length;
  const inactiveCount = studentsForBranch.length - activeCount;

  const handleAdd = async (studentData) => {
    try {
      setError('');
      const existingStudent = studentsForBranch.find(s =>
        s.email && studentData.email &&
        s.email.toLowerCase() === studentData.email.toLowerCase()
      );
      if (existingStudent) {
        setError('A student with this email already exists in this branch');
        return;
      }
      const created = await api.students.create({
        ...studentData,
        branch,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      setStudents(prev => [created, ...prev]);
      setShowForm(false);
      addNotification({
        type: 'success',
        title: 'Student Added',
        message: `New student added: ${created.name}`,
        category: 'students'
      });
    } catch (err) {
      setError('Failed to create student');
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!canEdit) return;
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await api.students.remove(id);
      setStudents(prev => prev.filter(s => s.id !== id));
      setSelectedStudents(prev => {
        const s = new Set(prev);
        s.delete(id);
        return s;
      });
      addNotification({
        type: 'success',
        title: 'Student Deleted',
        message: 'Student has been removed',
        category: 'students'
      });
    } catch (err) {
      setError('Failed to delete student');
      console.error(err);
    }
  };

  const handleBulkDelete = async () => {
    if (!canEdit || selectedStudents.size === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.size} selected students?`)) return;
    try {
      await Promise.all([...selectedStudents].map(id => api.students.remove(id)));
      setStudents(prev => prev.filter(s => !selectedStudents.has(s.id)));
      setSelectedStudents(new Set());
      addNotification({
        type: 'success',
        title: 'Students Deleted',
        message: `${selectedStudents.size} students have been removed`,
        category: 'students'
      });
    } catch (err) {
      setError('Failed to delete selected students');
      console.error(err);
    }
  };

  const handleSelectAll = () => {
    if (selectedStudents.size === filtered.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(filtered.map(s => s.id)));
    }
  };

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Status', 'Branch', 'Created'];
    const rows = filtered.map(s => [
      s.name,
      s.email || '',
      s.status,
      s.branch || 'Main',
      new Date(s.createdAt).toLocaleString()
    ]);
    const csv = [headers, ...rows].map(row =>
      row.map(field => `"${field.toString().replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `students-${branch}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToClient = async (student) => {
    try {
      const updated = await api.students.update(student.id, {
        ...student,
        status: 'converted',
        convertedAt: new Date().toISOString()
      });
      setStudents(prev => prev.map(s => s.id === student.id ? updated : s));
      addNotification({
        type: 'success',
        title: 'Student Converted',
        message: `${student.name} has been converted to client`,
        category: 'students'
      });
    } catch (err) {
      setError('Failed to convert student');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <section className="students-main">
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>
        <div className="loading-state">Loading students...</div>
      </section>
    );
  }

  return (
    <>
      {/* AETHERIAL GLASS STYLES */}
      <style>{`
        /* CSS Variables - Aetherial Glass Design System */
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
          
          /* Backgrounds */
          --dark: #0f172a;
          --dark-secondary: #1e293b;
          --dark-tertiary: #334155;
          
          /* Glass Surfaces */
          --glass-bg: rgba(15, 23, 42, 0.6);
          --glass-bg-light: rgba(30, 41, 59, 0.4);
          --glass-border: rgba(148, 163, 184, 0.15);
          
          /* Text Colors */
          --text: #e2e8f0;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          
          /* Borders & Shadows */
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

        /* Main Students Section */
        .students-main {
          min-height: 100vh;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
          color: var(--text);
          position: relative;
        }

        .students {
          padding: 2rem;
          display: grid;
          gap: 2rem;
          position: relative;
          z-index: 1;
          max-width: 1400px;
          margin: 0 auto;
        }

        .students__header {
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

        .students__title h2 {
          margin: 0 0 0.5rem 0;
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--text) 0%, var(--primary) 50%, var(--secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .students__subtitle {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.875rem;
        }

        .students__actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .students__actions .icon {
          margin-right: 0.4rem;
        }

        .action-button,[class*="action-button"] {
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

        .action-button:hover,[class*="action-button"]:hover {
          transform: translateY(-2px);
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .action-button--primary,[class*="action-button--primary"] {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }

        .action-button--primary:hover,[class*="action-button--primary"]:hover {
          background: var(--primary-dark);
          border-color: var(--primary-dark);
        }

        .action-button--secondary,[class*="action-button--secondary"] {
          background: var(--glass-bg);
        }

        .action-button--danger,[class*="action-button--danger"] {
          background: var(--danger);
          border-color: var(--danger);
          color: white;
        }

        .action-button--danger:hover,[class*="action-button--danger"]:hover {
          background: #dc2626;
          border-color: #dc2626;
        }

        .action-button--small,[class*="action-button--small"] {
          padding: 0.5rem 0.75rem;
          font-size: 12px;
          border-radius: 8px;
        }

        .students__stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
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

        .students__controls {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          flex-wrap: wrap;
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          padding: 1.5rem;
          box-shadow: var(--shadow-card);
        }

        .students__search {
          min-width: 260px;
          flex: 1;
        }

        .inbox__input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          color: var(--text);
          transition: all 0.3s ease;
        }

        .inbox__input::placeholder {
          color: var(--text-muted);
        }

        .inbox__input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
        }

        .loading-state, .inbox__empty {
          padding: 3rem 1rem;
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

        .dash-scroll {
          max-height: 480px;
          overflow: auto;
          border-radius: 12px;
        }

        .dash-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }

        .dash-table thead th {
          position: sticky;
          top: 0;
          background: var(--glass-bg-light);
          backdrop-filter: blur(20px);
          text-align: left;
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
          z-index: 1;
          color: var(--text);
          font-weight: 600;
        }

        .dash-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--glass-border);
          vertical-align: middle;
          color: var(--text);
        }

        .dash-table tr:hover {
          background: rgba(99, 102, 241, 0.05);
        }

        .students__table strong {
          font-weight: 600;
          color: var(--text);
        }

        .students__name {
          display: flex;
          flex-direction: column;
        }

        .students__name a {
          color: var(--text);
          text-decoration: none;
          transition: color 0.3s ease;
        }

        .students__name a:hover {
          color: var(--primary);
        }

        .students__source {
          color: var(--text-muted);
        }

        .dash-pill {
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

        .dash-pill.green {
          background: rgba(16, 185, 129, 0.2);
          color: var(--success);
          border-color: rgba(16, 185, 129, 0.3);
        }

        .dash-pill.blue {
          background: rgba(59, 130, 246, 0.2);
          color: #60a5fa;
          border-color: rgba(59, 130, 246, 0.3);
        }

        .dash-pill.gray {
          background: var(--glass-bg-light);
          color: var(--text-secondary);
          border-color: var(--glass-border);
        }

        .students__actions-cell {
          display: flex;
          gap: 0.35rem;
          align-items: center;
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
          width: min(620px, 86vw);
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          color: var(--text);
          border: 1px solid var(--glass-border);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .modal-body {
          padding: 1.5rem;
          max-height: min(70vh, 560px);
          overflow: auto;
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
          background: rgba(99, 102, 241, 0.1);
          color: var(--text);
          border-color: var(--primary);
        }

        .modal-close .icon {
          width: 16px;
          height: 16px;
        }

        /* Country and degree badges */
        .country-flag, .degree-badge, .timeline-badge {
          padding: 0.125rem 0.5rem;
          background: var(--glass-bg-light);
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          font-size: 12px;
          color: var(--text-secondary);
        }

        @media (max-width: 960px) {
          .students {
            padding: 1rem;
          }
          
          .students__stats {
            grid-template-columns: 1fr;
          }
          
          .students__header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .students__actions {
            width: 100%;
          }
          
          .students__controls {
            flex-direction: column;
            align-items: stretch;
          }
        }
      `}</style>

      <section className="students-main">
        {/* Animated Background */}
        <div className="animated-bg">
          <div className="orb orb1"></div>
          <div className="orb orb2"></div>
        </div>

        <div className="students">
          {/* Header */}
          <div className="students__header">
            <div className="students__title">
              <h2>Student Management — {branch}</h2>
              <p className="students__subtitle">Manage your students and prospects</p>
            </div>

            <div className="students__actions">
              {canEdit && (
                <>
                  <button
                    className={`${buttonStyles['action-button']} ${buttonStyles['action-button--secondary']}`}
                    onClick={exportToCsv}
                    disabled={filtered.length === 0}
                    aria-label="Export CSV"
                  >
                    <Icon name="clipboard" className="icon icon--sm" decorative />
                    Export CSV
                  </button>
                  <button
                    className={`${buttonStyles['action-button']} ${buttonStyles['action-button--primary']}`}
                    onClick={() => setShowForm(true)}
                    aria-label="Add new student"
                  >
                    <Icon name="users" className="icon icon--sm" decorative />
                    New Student
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Row */}
          <div className="students__stats">
            <div className="dash-stat">
              <div className="dash-stat__icon">
                <Icon name="clipboard" className="icon" decorative />
              </div>
              <div className="dash-stat__meta">
                <div className="dash-stat__label">Total Students</div>
                <div className="dash-stat__value">{studentsForBranch.length}</div>
              </div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat__icon">
                <Icon name="users" className="icon" decorative />
              </div>
              <div className="dash-stat__meta">
                <div className="dash-stat__label">Active</div>
                <div className="dash-stat__value">{activeCount}</div>
              </div>
            </div>
            <div className="dash-stat">
              <div className="dash-stat__icon">
                <Icon name="x-mark" className="icon" decorative />
              </div>
              <div className="dash-stat__meta">
                <div className="dash-stat__label">Inactive</div>
                <div className="dash-stat__value">{inactiveCount}</div>
              </div>
            </div>
          </div>

          {/* Search and Bulk Actions */}
          <div className="students__controls">
            <div className="students__search">
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by name or email..."
                className="inbox__input"
                aria-label="Search students"
              />
            </div>

            {canEdit && selectedStudents.size > 0 && (
              <div className="students__bulk">
                <button
                  className="action-button action-button--danger"
                  onClick={handleBulkDelete}
                  aria-label={`Delete ${selectedStudents.size} selected students`}
                  title="Delete selected"
                >
                  <Icon name="trash" className="icon icon--sm" decorative />
                  Delete Selected ({selectedStudents.size})
                </button>
              </div>
            )}
          </div>

          {error && <div className="alert alert--error">{error}</div>}

          {/* Main Content */}
          <div className={dashboardStyles['dash-card']}>
            <div className={dashboardStyles['dash-card__body']}>
              {filtered.length === 0 ? (
                <div className="inbox__empty">
                  {q ? 'No students match your search' : 'No students yet'}
                  {canEdit && !q && (
                    <button
                      className="action-button action-button--primary"
                      onClick={() => setShowForm(true)}
                      style={{ marginTop: '12px' }}
                      aria-label="Add your first student"
                    >
                      <Icon name="users" className="icon icon--sm" decorative />
                      Add your first student
                    </button>
                  )}
                </div>
              ) : (
                <div className="dash-scroll">
                  <table className="dash-table students__table">
                    <thead>
                      <tr>
                        {canEdit && (
                          <th style={{ width: '40px' }}>
                            <input
                              type="checkbox"
                              checked={selectedStudents.size === filtered.length && filtered.length > 0}
                              onChange={handleSelectAll}
                              aria-label="Select all students"
                            />
                          </th>
                        )}
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Intended Country</th>
                        <th>Highest Degree</th>
                        <th>Status</th>
                        <th>Assigned Consultant</th>
                        <th>Timeline</th>
                        <th>Created</th>
                        <th style={{ width: '140px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map(student => (
                        <tr key={student.id}>
                          {canEdit && (
                            <td>
                              <input
                                type="checkbox"
                                checked={selectedStudents.has(student.id)}
                                onChange={(e) => {
                                  const newSet = new Set(selectedStudents);
                                  e.target.checked ? newSet.add(student.id) : newSet.delete(student.id);
                                  setSelectedStudents(newSet);
                                }}
                                aria-label={`Select ${student.name}`}
                              />
                            </td>
                          )}
                          <td>
                            <div className="students__name">
                              <Link to={`/students/${student.id}`}>
                                <strong>{student.name}</strong>
                              </Link>
                              {student.source && <small className="students__source">via {student.source}</small>}
                            </div>
                          </td>
                          <td>{student.email || '—'}</td>
                          <td>{student.phone || '—'}</td>
                          <td>
                            {student.intendedCountry ? (
                              <span className="country-flag">
                                {student.intendedCountry === 'usa' ? 'USA' :
                                 student.intendedCountry === 'uk' ? 'UK' :
                                 student.intendedCountry === 'canada' ? 'Canada' :
                                 student.intendedCountry === 'australia' ? 'Australia' :
                                 student.intendedCountry === 'germany' ? 'Germany' :
                                 student.intendedCountry.toUpperCase()}
                              </span>
                            ) : '—'}
                          </td>
                          <td>
                            {student.highestDegree ? (
                              <span className="degree-badge">
                                {student.highestDegree === 'high-school' ? 'High School' :
                                 student.highestDegree === 'bachelor' ? "Bachelor's" :
                                 student.highestDegree === 'master' ? "Master's" :
                                 student.highestDegree === 'phd' ? 'PhD' :
                                 student.highestDegree}
                              </span>
                            ) : '—'}
                          </td>
                          <td>
                            <span className={`dash-pill ${
                              student.status === 'active' ? 'green' :
                              student.status === 'converted' ? 'blue' : 'gray'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td>{student.assignedConsultant || 'Unassigned'}</td>
                          <td>
                            {student.timeline ? (
                              <span className="timeline-badge">
                                {student.timeline.includes('Immediate') ? 'Urgent' :
                                 student.timeline.includes('Short') ? 'Short' :
                                 student.timeline.includes('Medium') ? 'Medium' :
                                 student.timeline.includes('Long') ? 'Long' :
                                 student.timeline}
                              </span>
                            ) : '—'}
                          </td>
                          <td>
                            <time dateTime={student.createdAt}>
                              {new Date(student.createdAt).toLocaleDateString()}
                            </time>
                          </td>
                          <td>
                            <div className="students__actions-cell">
                              {canEdit && student.status === 'active' && (
                                <button
                                  className="action-button action-button--small action-button--secondary"
                                  onClick={() => convertToClient(student)}
                                  title="Convert to client"
                                  aria-label={`Convert ${student.name} to client`}
                                >
                                  <Icon name="share" className="icon icon--sm" decorative />
                                </button>
                              )}
                              {canEdit && (
                                <button
                                  className="action-button action-button--small action-button--danger"
                                  onClick={() => handleDelete(student.id)}
                                  title="Delete student"
                                  aria-label={`Delete ${student.name}`}
                                >
                                  <Icon name="trash" className="icon icon--sm" decorative />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* New Student Form Modal */}
          {showForm && canEdit && (
            <div className="modal-overlay" onClick={() => setShowForm(false)}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add New Student</h3>
                  <button
                    className="modal-close"
                    onClick={() => setShowForm(false)}
                    aria-label="Close"
                  >
                    <Icon name="x-mark" className="icon" decorative />
                  </button>
                </div>
                <div className="modal-body">
                  <StudentForm
                    onSubmit={handleAdd}
                    students={studentsForBranch}
                    onCancel={() => setShowForm(false)}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}