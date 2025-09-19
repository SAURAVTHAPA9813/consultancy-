// src/pages/ProjectForm.jsx - Updated for Consultancy Business Projects
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Icon from '@components/Icon.jsx';
import { useAuth } from '@components/AuthContext.jsx';
import { projectApi } from '@/lib/projectApi.js';

export default function ProjectForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, branch } = useAuth();

  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
    projectManager: '',
    branch: branch || 'Main',
    budget: '',
    startDate: '',
    endDate: '',
    teamMembers: [],
    objectives: '',
    successCriteria: '',
    riskFactors: ''
  });

  // Demo data - replace with actual API calls in production
  const projectTypes = [
    { value: 'client', label: 'Client Project', description: 'Projects for specific clients or institutions' },
    { value: 'internal', label: 'Internal Initiative', description: 'Company improvement or operational projects' },
    { value: 'service', label: 'Service Launch', description: 'New service offerings or product launches' },
    { value: 'marketing', label: 'Marketing Campaign', description: 'Promotional and outreach activities' },
    { value: 'partnership', label: 'Partnership Program', description: 'Collaboration with external organizations' }
  ];

  const availableMembers = [
    { id: 'consultant-1', name: 'Nishan Timilsina', role: 'Senior Consultant', specialization: 'US/Canada' },
    { id: 'consultant-2', name: 'Jenish Neupane', role: 'Technical Consultant', specialization: 'Australia/UK' },
    { id: 'consultant-3', name: 'Sakura Ghimire', role: 'Marketing Consultant', specialization: 'Digital Marketing' },
    { id: 'consultant-4', name: 'Shikhar Khadka', role: 'Business Development', specialization: 'Partnerships' },
    { id: 'staff-1', name: 'Samira Khatri', role: 'Administrative Staff', specialization: 'Documentation' },
    { id: 'staff-2', name: 'Rajesh Maharjan', role: 'Event Coordinator', specialization: 'Event Management' }
  ];

  const branches = ['Main', 'Tech', 'Marketing', 'Operations'];

  // Inline Styles (keeping it compact)
  const styles = {
    mainSection: {
      padding: '2rem',
      minHeight: 'calc(100vh - 80px)',
      background: '#f8f9fa'
    },
    dash: {
      maxWidth: '1200px',
      margin: '0 auto'
    },
    dashGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(12, 1fr)',
      gap: '2rem',
      alignItems: 'start'
    },
    dashCol12: {
      gridColumn: '1 / -1'
    },
    dashCol8: {
      gridColumn: 'span 8'
    },
    dashCol4: {
      gridColumn: 'span 4'
    },
    pageHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '2rem',
      padding: '1.5rem',
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb'
    },
    pageHeaderTitle: {
      margin: '0.5rem 0 0 0',
      fontSize: '1.75rem',
      fontWeight: '600',
      color: '#1f2937'
    },
    dashCard: {
      background: 'white',
      borderRadius: '12px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
      border: '1px solid #e5e7eb',
      overflow: 'hidden',
      marginBottom: '2rem'
    },
    dashCardBody: {
      padding: '2rem'
    },
    projectForm: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    },
    formLabel: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      alignItems: 'center',
      gap: '0.25rem'
    },
    formRequired: {
      color: '#dc2626',
      fontWeight: '700'
    },
    formInput: {
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      transition: 'all 0.2s ease',
      background: 'white',
      color: '#1f2937'
    },
    formTextarea: {
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      transition: 'all 0.2s ease',
      background: 'white',
      color: '#1f2937',
      resize: 'vertical',
      minHeight: '100px'
    },
    formSelect: {
      padding: '0.75rem 1rem',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '0.875rem',
      lineHeight: '1.5',
      background: 'white',
      color: '#1f2937',
      cursor: 'pointer',
      transition: 'all 0.2s ease'
    },
    formInputError: {
      borderColor: '#dc2626',
      backgroundColor: '#fef2f2'
    },
    formError: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1rem',
      background: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '8px',
      color: '#dc2626',
      fontSize: '0.875rem',
      marginBottom: '1rem'
    },
    formErrorText: {
      fontSize: '0.75rem',
      color: '#dc2626',
      marginTop: '0.25rem'
    },
    formHelp: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginTop: '0.25rem'
    },
    membersPicker: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '0.75rem',
      marginTop: '0.5rem'
    },
    memberOption: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      padding: '1rem',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      background: 'white',
      position: 'relative'
    },
    memberOptionSelected: {
      borderColor: '#3b82f6',
      background: '#eff6ff'
    },
    memberCheckbox: {
      position: 'absolute',
      opacity: '0',
      cursor: 'pointer'
    },
    memberInfo: {
      flex: '1'
    },
    memberName: {
      fontWeight: '600',
      color: '#374151',
      marginBottom: '0.25rem'
    },
    memberRole: {
      fontSize: '0.75rem',
      color: '#6b7280',
      marginBottom: '0.25rem'
    },
    memberSpec: {
      fontSize: '0.7rem',
      color: '#9ca3af',
      fontStyle: 'italic'
    },
    formActions: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'flex-end',
      marginTop: '2rem',
      paddingTop: '1.5rem',
      borderTop: '1px solid #e5e7eb'
    },
    btn: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.75rem 1.5rem',
      fontSize: '0.875rem',
      fontWeight: '500',
      borderRadius: '8px',
      border: '1px solid transparent',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      textDecoration: 'none',
      justifyContent: 'center',
      minWidth: '120px'
    },
    btnPrimary: {
      background: '#3b82f6',
      color: 'white',
      borderColor: '#3b82f6'
    },
    btnOutline: {
      background: 'white',
      color: '#374151',
      borderColor: '#d1d5db'
    },
    btnDisabled: {
      opacity: '0.6',
      cursor: 'not-allowed'
    },
    loadingState: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '3rem 2rem',
      textAlign: 'center',
      color: '#6b7280'
    }
  };

  useEffect(() => {
    if (isEditing && id) {
      (async () => {
        try {
          setLoading(true);
          const project = await projectApi.getProject(id);
          setFormData({
            name: project.name,
            description: project.description || '',
            type: project.type || '',
            projectManager: project.projectManager || '',
            branch: project.branch,
            budget: project.budget || '',
            startDate: project.startDate ? project.startDate.split('T')[0] : '',
            endDate: project.endDate ? project.endDate.split('T')[0] : '',
            teamMembers: project.teamMembers || [],
            objectives: project.objectives || '',
            successCriteria: project.successCriteria || '',
            riskFactors: project.riskFactors || ''
          });
        } catch (err) {
          console.error('Failed to load project:', err);
          setErrors({ load: 'Failed to load project' });
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [id, isEditing]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleMemberToggle = (memberId) => {
    const isSelected = formData.teamMembers.includes(memberId);
    handleInputChange(
      'teamMembers',
      isSelected ? formData.teamMembers.filter(x => x !== memberId) : [...formData.teamMembers, memberId]
    );
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Project name is required';
    if (!formData.type) newErrors.type = 'Project type is required';
    if (!formData.projectManager.trim()) newErrors.projectManager = 'Project manager is required';
    
    if (formData.budget && isNaN(parseFloat(formData.budget))) {
      newErrors.budget = 'Budget must be a valid number';
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    if (formData.teamMembers.length === 0) {
      newErrors.teamMembers = 'At least one team member is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm() || submitting) return;

    try {
      setSubmitting(true);
      const payload = {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : null
      };
      
      if (isEditing) {
        await projectApi.updateProject(id, payload);
      } else {
        await projectApi.createProject(payload);
      }
      navigate('/projects');
    } catch (err) {
      console.error('Failed to save project:', err);
      setErrors({ submit: 'Failed to save project. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const canDelete = isEditing && user?.role === 'admin';

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project? This will also delete all associated tasks.')) {
      return;
    }
    try {
      setSubmitting(true);
      await projectApi.deleteProject(id);
      navigate('/projects');
    } catch (err) {
      console.error('Failed to delete project:', err);
      setErrors({ submit: 'Failed to delete project. Please try again.' });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <section style={styles.mainSection}>
        <section style={styles.dash}>
          <div style={styles.dashGrid}>
            <div style={styles.dashCol12}>
              <div style={styles.loadingState}>
                <Icon name="clock" size={24} />
                <p>Loading project...</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section style={styles.mainSection}>
      <section style={styles.dash}>
        <div style={styles.dashGrid}>
          {/* Header */}
          <div style={styles.dashCol12}>
            <div style={styles.pageHeader}>
              <div>
                <button
                  onClick={() => navigate('/projects')}
                  style={{...styles.btn, ...styles.btnOutline}}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = 'white'}
                >
                  <Icon name="dashboard" size={16} />
                  Back to Projects
                </button>
                <h2 style={styles.pageHeaderTitle}>
                  {isEditing ? 'Edit Business Project' : 'Create New Project'}
                </h2>
              </div>

              {canDelete && (
                <button
                  onClick={handleDelete}
                  disabled={submitting}
                  style={{
                    ...styles.btn,
                    background: '#dc2626',
                    color: 'white',
                    borderColor: '#dc2626',
                    ...(submitting ? styles.btnDisabled : {})
                  }}
                >
                  <Icon name="trash" size={16} />
                  Delete Project
                </button>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div style={styles.dashCol12}>
            <div style={styles.dashCard}>
              <div style={styles.dashCardBody}>
                <form onSubmit={handleSubmit} style={styles.projectForm}>
                  {errors.submit && (
                    <div style={styles.formError}>
                      <Icon name="clipboard" size={16} />
                      {errors.submit}
                    </div>
                  )}
                  {errors.load && (
                    <div style={styles.formError}>
                      <Icon name="clipboard" size={16} />
                      {errors.load}
                    </div>
                  )}

                  {/* Basic Information */}
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Basic Information</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={styles.formGroup}>
                        <label htmlFor="project-name" style={styles.formLabel}>
                          Project Name <span style={styles.formRequired}>*</span>
                        </label>
                        <input
                          id="project-name"
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          style={{
                            ...styles.formInput,
                            ...(errors.name ? styles.formInputError : {})
                          }}
                          placeholder="e.g., Australian Universities Fair 2024"
                          autoFocus
                        />
                        {errors.name && <span style={styles.formErrorText}>{errors.name}</span>}
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor="project-type" style={styles.formLabel}>
                          Project Type <span style={styles.formRequired}>*</span>
                        </label>
                        <select
                          id="project-type"
                          value={formData.type}
                          onChange={(e) => handleInputChange('type', e.target.value)}
                          style={{
                            ...styles.formSelect,
                            ...(errors.type ? styles.formInputError : {})
                          }}
                        >
                          <option value="">Select project type...</option>
                          {projectTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        {errors.type && <span style={styles.formErrorText}>{errors.type}</span>}
                      </div>
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="project-description" style={styles.formLabel}>
                        Project Description
                      </label>
                      <textarea
                        id="project-description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        style={styles.formTextarea}
                        placeholder="Describe the project goals, scope, and expected outcomes..."
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* Management & Timeline */}
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Management & Timeline</h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                      <div style={styles.formGroup}>
                        <label htmlFor="project-manager" style={styles.formLabel}>
                          Project Manager <span style={styles.formRequired}>*</span>
                        </label>
                        <input
                          id="project-manager"
                          type="text"
                          value={formData.projectManager}
                          onChange={(e) => handleInputChange('projectManager', e.target.value)}
                          style={{
                            ...styles.formInput,
                            ...(errors.projectManager ? styles.formInputError : {})
                          }}
                          placeholder="Who will lead this project?"
                        />
                        {errors.projectManager && <span style={styles.formErrorText}>{errors.projectManager}</span>}
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor="project-branch" style={styles.formLabel}>
                          Branch
                        </label>
                        <select
                          id="project-branch"
                          value={formData.branch}
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          style={styles.formSelect}
                        >
                          {branches.map(b => (
                            <option key={b} value={b}>{b}</option>
                          ))}
                        </select>
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor="project-budget" style={styles.formLabel}>
                          Budget (Rs.)
                        </label>
                        <input
                          id="project-budget"
                          type="number"
                          value={formData.budget}
                          onChange={(e) => handleInputChange('budget', e.target.value)}
                          style={{
                            ...styles.formInput,
                            ...(errors.budget ? styles.formInputError : {})
                          }}
                          placeholder="0"
                          min="0"
                          step="1000"
                        />
                        {errors.budget && <span style={styles.formErrorText}>{errors.budget}</span>}
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div style={styles.formGroup}>
                        <label htmlFor="start-date" style={styles.formLabel}>
                          Start Date
                        </label>
                        <input
                          id="start-date"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) => handleInputChange('startDate', e.target.value)}
                          style={styles.formInput}
                        />
                      </div>

                      <div style={styles.formGroup}>
                        <label htmlFor="end-date" style={styles.formLabel}>
                          End Date
                        </label>
                        <input
                          id="end-date"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) => handleInputChange('endDate', e.target.value)}
                          style={{
                            ...styles.formInput,
                            ...(errors.endDate ? styles.formInputError : {})
                          }}
                        />
                        {errors.endDate && <span style={styles.formErrorText}>{errors.endDate}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  <div style={styles.formGroup}>
                    <label style={styles.formLabel}>
                      Team Members <span style={styles.formRequired}>*</span>
                    </label>
                    <p style={styles.formHelp}>Select consultants and staff who will work on this project</p>

                    <div style={styles.membersPicker}>
                      {availableMembers.map(member => {
                        const selected = formData.teamMembers.includes(member.id);
                        return (
                          <label
                            key={member.id}
                            style={{
                              ...styles.memberOption,
                              ...(selected ? styles.memberOptionSelected : {})
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={selected}
                              onChange={() => handleMemberToggle(member.id)}
                              style={styles.memberCheckbox}
                            />
                            <div style={styles.memberInfo}>
                              <div style={styles.memberName}>{member.name}</div>
                              <div style={styles.memberRole}>{member.role}</div>
                              <div style={styles.memberSpec}>{member.specialization}</div>
                            </div>
                            {selected && (
                              <Icon name="clipboard" size={14} style={{color: '#3b82f6'}} />
                            )}
                          </label>
                        );
                      })}
                    </div>

                    {errors.teamMembers && <span style={styles.formErrorText}>{errors.teamMembers}</span>}
                  </div>

                  {/* Project Goals */}
                  <div>
                    <h3 style={{ marginBottom: '1rem', color: '#1f2937' }}>Project Goals & Planning</h3>
                    
                    <div style={styles.formGroup}>
                      <label htmlFor="objectives" style={styles.formLabel}>
                        Project Objectives
                      </label>
                      <textarea
                        id="objectives"
                        value={formData.objectives}
                        onChange={(e) => handleInputChange('objectives', e.target.value)}
                        style={styles.formTextarea}
                        placeholder="What are the main goals and objectives of this project?"
                        rows={3}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="success-criteria" style={styles.formLabel}>
                        Success Criteria
                      </label>
                      <textarea
                        id="success-criteria"
                        value={formData.successCriteria}
                        onChange={(e) => handleInputChange('successCriteria', e.target.value)}
                        style={styles.formTextarea}
                        placeholder="How will you measure if this project is successful?"
                        rows={3}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label htmlFor="risk-factors" style={styles.formLabel}>
                        Risk Factors & Mitigation
                      </label>
                      <textarea
                        id="risk-factors"
                        value={formData.riskFactors}
                        onChange={(e) => handleInputChange('riskFactors', e.target.value)}
                        style={styles.formTextarea}
                        placeholder="What are potential risks and how will they be handled?"
                        rows={3}
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={styles.formActions}>
                    <button
                      type="button"
                      onClick={() => navigate('/projects')}
                      style={{...styles.btn, ...styles.btnOutline}}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        ...styles.btn,
                        ...styles.btnPrimary,
                        ...(submitting ? styles.btnDisabled : {})
                      }}
                    >
                      {submitting ? 'Saving...' : (isEditing ? 'Update Project' : 'Create Project')}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </section>
  );
}