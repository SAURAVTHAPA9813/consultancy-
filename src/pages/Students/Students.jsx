import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import StudentForm from '@/components/StudentForm.jsx';
import dashboardStyles from '@styles/Dashboard.module.css';
import buttonStyles from '@styles/Buttons.module.css';
import Icon from '@/components/Icon.jsx';
import { Link } from 'react-router-dom';

export default function Students() {  // ✅ FIXED: Component name
  const { branch, user } = useAuth();
  const { addNotification } = useNotifications();
  const [students, setStudents] = useState([]);  // ✅ FIXED: Variable name
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');
  const [selectedStudents, setSelectedStudents] = useState(new Set());  // ✅ FIXED: Variable name
  const [showForm, setShowForm] = useState(false);

  const canEdit = user?.role === 'admin' || user?.role === 'consultant';

  useEffect(() => {
    loadStudents();  // ✅ FIXED: Function name
  }, [branch]);

  const loadStudents = async () => {  // ✅ FIXED: Function name
    try {
      setLoading(true);
      const data = await api.students.list();  // ✅ FIXED: API endpoint
      setStudents(data);  // ✅ FIXED: State setter
    } catch (err) {
      setError('Failed to load students');  // ✅ FIXED: Error message
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const studentsForBranch = students.filter(s => (s.branch || 'Main') === branch);  // ✅ FIXED: Variable name

  const filtered = studentsForBranch
    .filter(s =>
      s.name.toLowerCase().includes(q.toLowerCase()) ||
      (s.email || '').toLowerCase().includes(q.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const activeCount = studentsForBranch.filter(s => s.status === 'active').length;
  const inactiveCount = studentsForBranch.length - activeCount;

  const handleAdd = async (studentData) => {  // ✅ FIXED: Parameter name
    try {
      setError('');
      const existingStudent = studentsForBranch.find(s =>  // ✅ FIXED: Variable name
        s.email && studentData.email &&
        s.email.toLowerCase() === studentData.email.toLowerCase()
      );
      if (existingStudent) {  // ✅ FIXED: Variable name
        setError('A student with this email already exists in this branch');  // ✅ FIXED: Error message
        return;
      }
      const created = await api.students.create({  // ✅ FIXED: API endpoint
        ...studentData,
        branch,
        status: 'active',
        createdAt: new Date().toISOString()
      });
      setStudents(prev => [created, ...prev]);  // ✅ FIXED: State setter
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
      await api.students.remove(id);  // ✅ FIXED: API endpoint
      setStudents(prev => prev.filter(s => s.id !== id));  // ✅ FIXED: State setter
      setSelectedStudents(prev => {  // ✅ FIXED: State setter
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
    if (!canEdit || selectedStudents.size === 0) return;  // ✅ FIXED: Variable name
    if (!window.confirm(`Are you sure you want to delete ${selectedStudents.size} selected students?`)) return;
    try {
      await Promise.all([...selectedStudents].map(id => api.students.remove(id)));  // ✅ FIXED: API endpoint
      setStudents(prev => prev.filter(s => !selectedStudents.has(s.id)));  // ✅ FIXED: State setter
      setSelectedStudents(new Set());  // ✅ FIXED: State setter
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
    if (selectedStudents.size === filtered.length) {  // ✅ FIXED: Variable name
      setSelectedStudents(new Set());  // ✅ FIXED: State setter
    } else {
      setSelectedStudents(new Set(filtered.map(s => s.id)));  // ✅ FIXED: State setter
    }
  };

  const exportToCsv = () => {
    const headers = ['Name', 'Email', 'Status', 'Branch', 'Created'];
    const rows = filtered.map(s => [  // ✅ FIXED: Variable name
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
    a.download = `students-${branch}-${new Date().toISOString().split('T')[0]}.csv`;  // ✅ FIXED: Filename
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToClient = async (student) => {  // ✅ FIXED: Parameter name
    try {
      const updated = await api.students.update(student.id, {  // ✅ FIXED: API endpoint
        ...student,
        status: 'converted',
        convertedAt: new Date().toISOString()
      });
      setStudents(prev => prev.map(s => s.id === student.id ? updated : s));  // ✅ FIXED: State setter
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
      <section className="students">  {/* ✅ FIXED: CSS class */}
        <div className="inbox__empty">Loading students...</div>
      </section>
    );
  }

  return (
    <>
      {/* INLINE STYLES - ✅ FIXED: Updated CSS class names */}
      <style>{`
        .students{padding:var(--space-6,24px);display:grid;gap:var(--space-6,24px);}
        .students__header{display:flex;align-items:flex-start;justify-content:space-between;gap:var(--space-4,16px);}
        .students__title h2{margin:0 0 var(--space-1,4px) 0;font-size:var(--font-2xl,24px);font-weight:var(--font-bold,700);color:var(--color-text,#111827);}
        .students__subtitle{margin:0;color:var(--color-text-muted,#6b7280);font-size:var(--font-sm,14px);}
        .students__actions{display:flex;gap:var(--space-2,8px);flex-wrap:wrap;}
        .students__actions .icon{margin-right:.4rem;}

        .action-button,[class*="action-button"]{
          display:inline-flex;align-items:center;justify-content:center;gap:.5rem;
          padding:.55rem .85rem;border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);
          background:var(--color-surface,#fff);color:var(--color-text,#111827);font-weight:var(--font-medium,500);
          cursor:pointer;transition:transform .12s ease, background-color .12s ease, border-color .12s ease;
        }
        .action-button:hover,[class*="action-button"]:hover{transform:translateY(-1px);background:var(--color-surface-hover,#f9fafb);}
        .action-button--primary,[class*="action-button--primary"]{background:var(--color-primary,#2563eb);border-color:var(--color-primary,#2563eb);color:var(--color-text-inverse,#fff);}
        .action-button--primary:hover,[class*="action-button--primary"]:hover{background:var(--color-primary-dark,#1e40af);border-color:var(--color-primary-dark,#1e40af);}
        .action-button--secondary,[class*="action-button--secondary"]{background:var(--color-bg,#f3f4f6);}
        .action-button--danger,[class*="action-button--danger"]{background:var(--color-error,#ef4444);border-color:var(--color-error,#ef4444);color:#fff;}
        .action-button--danger:hover,[class*="action-button--danger"]:hover{background:#dc2626;border-color:#dc2626;}
        .action-button--small,[class*="action-button--small"]{padding:.35rem .55rem;font-size:12px;border-radius:var(--radius-sm,6px);}

        .students__stats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--space-4,16px);}
        .dash-stat{display:flex;align-items:center;gap:var(--space-3,12px);padding:var(--space-4,16px);
          background:var(--color-surface,#fff);border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-lg,12px);
          box-shadow:var(--shadow-xs,0 1px 2px rgba(0,0,0,.04));}
        .dash-stat__icon{width:40px;height:40px;display:grid;place-items:center;background:var(--color-bg,#f9fafb);
          border:1px solid var(--color-border,#e5e7eb);border-radius:var(--radius-md,8px);}
        .dash-stat__icon .icon{width:18px;height:18px;}
        .dash-stat__meta{display:flex;flex-direction:column;gap:2px;}
        .dash-stat__label{font-size:12px;color:var(--color-text-muted,#6b7280);}
        .dash-stat__value{font-size:20px;font-weight:var(--font-bold,700);color:var(--color-text,#111827);}

        .students__controls{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);flex-wrap:wrap;}
        .students__search{min-width:260px;flex:1;}
        .inbox__input{width:100%;padding:.6rem .8rem;border:1px solid var(--color-border,#e5e7eb);
          border-radius:var(--radius-md,8px);background:var(--color-surface,#fff);color:var(--color-text,#111827);}
        .inbox__input:focus{outline:none;border-color:var(--color-primary,#2563eb);box-shadow:0 0 0 3px rgba(37,99,235,.15);}

        .inbox__empty{padding:2.5rem 1rem;text-align:center;color:var(--color-text-muted,#6b7280);}
        .alert{padding:12px 14px;border-radius:8px;}
        .alert--error{background:#fee2e2;color:#991b1b;border:1px solid #fecaca;}

        .dash-scroll{max-height:480px;overflow:auto;border-radius:var(--radius-md,8px);}
        .dash-table{width:100%;border-collapse:collapse;font-size:14px;}
        .dash-table thead th{position:sticky;top:0;background:var(--color-bg,#f9fafb);text-align:left;
          padding:.75rem;border-bottom:1px solid var(--color-border,#e5e7eb);z-index:1;}
        .dash-table td{padding:.7rem;border-bottom:1px solid var(--color-border,#e5e7eb);vertical-align:middle;}
        .dash-table tr:hover{background:var(--color-surface-hover,#f3f4f6);}
        .students__table strong{font-weight:var(--font-semibold,600);}
        .students__name{display:flex;flex-direction:column;}
        .students__source{color:var(--color-text-muted,#6b7280);}

        .dash-pill{display:inline-flex;align-items:center;gap:.35rem;padding:.15rem .5rem;border-radius:999px;
          font-size:12px;font-weight:var(--font-medium,500);background:var(--color-bg,#f3f4f6);border:1px solid var(--color-border,#e5e7eb);}
        .dash-pill.green{background:#dcfce7;color:#166534;border-color:#86efac;}
        .dash-pill.blue{background:#dbeafe;color:#1e3a8a;border-color:#93c5fd;}
        .dash-pill.gray{background:#f3f4f6;color:#374151;border-color:#e5e7eb;}

        .students__actions-cell{display:flex;gap:.35rem;align-items:center;}

        .modal-overlay{
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.45);
          display: grid;
          place-items: center;
          padding: var(--space-6,24px);
          z-index: 9999;
        }

        .modal-content{
          width: min(620px, 86vw);
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-xl, 14px);
          box-shadow: var(--shadow-xl, 0 20px 40px rgba(0,0,0,.18));
          overflow: hidden;
        }

        .modal-body{
          padding: var(--space-5,20px);
          max-height: min(70vh, 560px);
          overflow: auto;
        }

        .modal-header{display:flex;align-items:center;justify-content:space-between;gap:var(--space-4,16px);
          padding:var(--space-4,16px) var(--space-5,20px);border-bottom:1px solid var(--color-border,#e5e7eb);}
        .modal-close{appearance:none;background:transparent;border:1px solid var(--color-border,#e5e7eb);
          border-radius:var(--radius-md,8px);padding:.35rem .55rem;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;gap:.4rem;}
        .modal-close:hover{background:var(--color-surface-hover,#f9fafb);}
        .modal-close .icon{width:16px;height:16px;}
        .modal-body{padding:var(--space-5,20px);}

        @media (max-width: 960px){
          .students__stats{grid-template-columns:1fr;}
          .students__header{flex-direction:column;align-items:flex-start;}
          .students__actions{width:100%;}
        }
      `}</style>

      <section className="students">  {/* ✅ FIXED: CSS class */}
        {/* Header */}
        <div className="students__header">  {/* ✅ FIXED: CSS class */}
          <div className="students__title">  {/* ✅ FIXED: CSS class */}
            <h2>Student Management — {branch}</h2>
            <p className="students__subtitle">Manage your students and prospects</p>  {/* ✅ FIXED: CSS class */}
          </div>

          <div className="students__actions">  {/* ✅ FIXED: CSS class */}
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
        <div className="students__stats">  {/* ✅ FIXED: CSS class */}
          <div className="dash-stat">
            <div className="dash-stat__icon">
              <Icon name="clipboard" className="icon" decorative />
            </div>
            <div className="dash-stat__meta">
              <div className="dash-stat__label">Total Students</div>
              <div className="dash-stat__value">{studentsForBranch.length}</div>  {/* ✅ FIXED: Variable name */}
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
        <div className="students__controls">  {/* ✅ FIXED: CSS class */}
          <div className="students__search">  {/* ✅ FIXED: CSS class */}
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
            <div className="students__bulk">  {/* ✅ FIXED: CSS class */}
              <button
                className="action-button action-button--danger"
                onClick={handleBulkDelete}
                aria-label={`Delete ${selectedStudents.size} selected students`}
                title="Delete selected"
              >
                <Icon name="trash" className="icon icon--sm" decorative />
                Delete Selected ({selectedStudents.size})  {/* ✅ FIXED: Variable name */}
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
                {q ? 'No students match your search' : 'No students yet'}  {/* ✅ FIXED: Text */}
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
                <table className="dash-table students__table">  {/* ✅ FIXED: CSS class */}
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
                          <div className="students__name">  {/* ✅ FIXED: CSS class */}
                            <Link to={`/students/${student.id}`}>
                              <strong>{student.name}</strong>
                            </Link>
                            {student.source && <small className="students__source">via {student.source}</small>}  {/* ✅ FIXED: CSS class */}
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
                          <div className="students__actions-cell">  {/* ✅ FIXED: CSS class */}
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

        {/* New Student Form Modal - ✅ FIXED: Modal title */}
        {showForm && canEdit && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Add New Student</h3>  {/* ✅ FIXED: Modal title */}
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
      </section>
    </>
  );
}