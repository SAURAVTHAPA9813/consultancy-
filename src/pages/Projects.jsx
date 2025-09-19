// src/pages/Projects.jsx - Updated for Consultancy Business Projects
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '@components/Icon.jsx';
import { useAuth } from '@components/AuthContext.jsx';
import { projectApi } from '@/lib/projectApi.js';

// Import your existing styles
import styles from '@styles/Projects.module.css';
import layoutStyles from '@styles/Layout.module.css';
import buttonStyles from '@styles/Buttons.module.css';

function ProjectCard({ project, onClick }) {
  const statusColor = projectApi.getProjectStatusColor(project.status);
  
  const formatDate = (dateStr) => {
    if (!dateStr) return 'No deadline set';
    return new Date(dateStr).toLocaleDateString();
  };

  const formatBudget = (budget) => {
    if (!budget) return 'No budget set';
    return `Rs. ${budget.toLocaleString()}`;
  };

  const getProjectTypeLabel = (type) => {
    const types = {
      'client': 'Client Project',
      'internal': 'Internal Initiative', 
      'service': 'Service Launch',
      'marketing': 'Marketing Campaign',
      'partnership': 'Partnership Program'
    };
    return types[type] || type;
  };

  return (
    <div className={`${styles['dash-card']} ${styles['project-card']}`} onClick={onClick}>
      <div className={styles['dash-card__body']}>
        {/* Project Header */}
        <div className={styles['project-card__header']}>
          <h3 className={styles['project-card__title']}>{project.name}</h3>
          <span className={`${styles['dash-pill']} ${styles[statusColor]}`}>
            {project.status}
          </span>
        </div>

        {/* Project Type & Manager */}
        <div className={styles['project-card__meta']}>
          <div className={styles['project-card__type']}>
            <Icon name="briefcase" size={14} />
            <span>{getProjectTypeLabel(project.type)}</span>
          </div>
          
          <div className={styles['project-card__manager']}>
            <Icon name="user" size={14} />
            <span>PM: {project.projectManager || 'Unassigned'}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className={styles['project-card__progress']}>
          <div className={styles['progress-bar']}>
            <div 
              className={styles['progress-bar__fill']} 
              style={{ width: `${project.progress}%` }}
            />
          </div>
          <span className={styles['progress-text']}>{project.progress}% complete</span>
        </div>

        {/* Team & Tasks */}
        <div className={styles['project-card__stats']}>
          <div className={styles['project-card__stat']}>
            <Icon name="users" size={14} />
            <span>{project.teamMembers?.length || 0} team members</span>
          </div>
          <div className={styles['project-card__stat']}>
            <Icon name="clipboard" size={14} />
            <span>{project.taskCount || 0} tasks</span>
          </div>
        </div>

        {/* Footer */}
        <div className={styles['project-card__footer']}>
          <div className={styles['project-card__deadline']}>
            <Icon name="calendar" size={14} />
            <span>{formatDate(project.endDate)}</span>
          </div>
          
          {project.budget && (
            <div className={styles['project-card__budget']}>
              <Icon name="dollar" size={14} />
              <span>{formatBudget(project.budget)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ProjectFilters({ filters, onFiltersChange, canCreateProject }) {
  const { branch } = useAuth();
  
  const branches = ['Main', 'Tech', 'Marketing', 'Operations'];
  const statuses = ['planning', 'active', 'on-hold', 'completed', 'cancelled'];
  const types = ['client', 'internal', 'service', 'marketing', 'partnership'];

  const handleFilterChange = (key, value) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className={styles['projects-toolbar']}>
      {/* Search */}
      <div className={styles['projects-search']}>
        <Icon name="search" size={16} />
        <input
          type="text"
          placeholder="Search projects..."
          value={filters.search || ''}
          onChange={(e) => handleFilterChange('search', e.target.value)}
          className={styles['search-input']}
        />
      </div>

      {/* Filters */}
      <div className={styles['projects-filters']}>
        <select
          value={filters.type || ''}
          onChange={(e) => handleFilterChange('type', e.target.value)}
          className={styles['filter-select']}
        >
          <option value="">All types</option>
          <option value="client">Client Projects</option>
          <option value="internal">Internal Initiatives</option>
          <option value="service">Service Launches</option>
          <option value="marketing">Marketing Campaigns</option>
          <option value="partnership">Partnership Programs</option>
        </select>

        <select
          value={filters.status || ''}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className={styles['filter-select']}
        >
          <option value="">All statuses</option>
          <option value="planning">Planning</option>
          <option value="active">Active</option>
          <option value="on-hold">On Hold</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filters.branch || ''}
          onChange={(e) => handleFilterChange('branch', e.target.value)}
          className={styles['filter-select']}
        >
          <option value="">All branches</option>
          {branches.map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className={styles['projects-actions']}>
        {canCreateProject && (
          <Link 
            to="/projects/new" 
            className={`${buttonStyles.btn} ${buttonStyles['btn--primary']}`}
          >
            <Icon name="plus" size={16} />
            New Project
          </Link>
        )}
      </div>
    </div>
  );
}

function ProjectsTable({ projects, onProjectClick }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString();
  };

  const formatBudget = (budget) => {
    if (!budget) return '—';
    return `Rs. ${budget.toLocaleString()}`;
  };

  const getProjectTypeLabel = (type) => {
    const types = {
      'client': 'Client Project',
      'internal': 'Internal Initiative', 
      'service': 'Service Launch',
      'marketing': 'Marketing Campaign',
      'partnership': 'Partnership Program'
    };
    return types[type] || type;
  };

  if (projects.length === 0) {
    return (
      <div className={styles['projects-empty']}>
        <Icon name="briefcase" size={48} />
        <h3>No projects found</h3>
        <p>No projects match your current filters.</p>
      </div>
    );
  }

  return (
    <div className={styles['projects-table-wrapper']}>
      <table className={styles['dash-table']}>
        <thead>
          <tr>
            <th>Project Name</th>
            <th>Type</th>
            <th>Project Manager</th>
            <th>Team Size</th>
            <th>Progress</th>
            <th>Status</th>
            <th>Deadline</th>
            <th>Budget</th>
          </tr>
        </thead>
        <tbody>
          {projects.map(project => {
            const statusColor = projectApi.getProjectStatusColor(project.status);
            
            return (
              <tr 
                key={project.id} 
                className={styles['projects-table__row']}
                onClick={() => onProjectClick(project.id)}
              >
                <td>
                  <div className={styles['project-cell']}>
                    <strong>{project.name}</strong>
                    <small>{project.taskCount || 0} tasks</small>
                  </div>
                </td>
                <td>
                  <span className={styles['project-type-badge']}>
                    {getProjectTypeLabel(project.type)}
                  </span>
                </td>
                <td>{project.projectManager || '—'}</td>
                <td>
                  <div className={styles['team-cell']}>
                    <Icon name="users" size={14} />
                    <span>{project.teamMembers?.length || 0}</span>
                  </div>
                </td>
                <td>
                  <div className={styles['progress-cell']}>
                    <div className={styles['progress-bar']}>
                      <div 
                        className={styles['progress-bar__fill']} 
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                    <span>{project.progress}%</span>
                  </div>
                </td>
                <td>
                  <span className={`${styles['dash-pill']} ${styles[statusColor]}`}>
                    {project.status}
                  </span>
                </td>
                <td>{formatDate(project.endDate)}</td>
                <td>{formatBudget(project.budget)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default function Projects() {
  const { user, branch } = useAuth();
  const navigate = useNavigate();
  
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    branch: '',
    status: '',
    type: ''
  });
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'

  const canCreateProject = user?.role === 'admin';
  const canEditProject = user?.role === 'admin' || user?.role === 'consultant';

  // Load projects
  useEffect(() => {
    loadProjects();
  }, [filters, user, branch]);

  const loadProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const filterParams = {
        ...filters,
        userId: user?.id,
        userRole: user?.role
      };
      
      const data = await projectApi.getProjects(filterParams);
      setProjects(data);
    } catch (err) {
      console.error('Failed to load projects:', err);
      setError('Failed to load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (projectId) => {
    navigate(`/projects/${projectId}`);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) {
    return (
      <section className="main-section">
        <section className={styles.dash}>
          <div className={styles['loading-state']}>
            <Icon name="loader" size={24} />
            <p>Loading projects...</p>
          </div>
        </section>
      </section>
    );
  }

  if (error) {
    return (
      <section className="main-section">
        <section className={styles.dash}>
          <div className={styles['error-state']}>
            <Icon name="alert-circle" size={24} />
            <p>{error}</p>
            <button 
              onClick={loadProjects}
              className={`${buttonStyles.btn} ${buttonStyles['btn--outline']}`}
            >
              Try Again
            </button>
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="main-section">
      <section className={styles.dash}>
        {/* Page Header */}
        <div className={styles['page-header']}>
          <div>
            <h2>Business Projects</h2>
            <p>Manage consultancy projects and initiatives — {branch} branch</p>
          </div>
          
          <div className={styles['page-header__actions']}>
            {/* View Mode Toggle */}
            <div className={styles['view-toggle']}>
              <button
                className={`${styles['view-toggle__btn']} ${viewMode === 'cards' ? styles['view-toggle__btn--active'] : ''}`}
                onClick={() => setViewMode('cards')}
                aria-label="Card view"
              >
                <Icon name="grid" size={16} />
              </button>
              <button
                className={`${styles['view-toggle__btn']} ${viewMode === 'table' ? styles['view-toggle__btn--active'] : ''}`}
                onClick={() => setViewMode('table')}
                aria-label="Table view"
              >
                <Icon name="list" size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <ProjectFilters 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          canCreateProject={canCreateProject}
        />

        {/* Projects Content */}
        <div className={styles['projects-content']}>
          {viewMode === 'cards' ? (
            <div className={styles['projects-grid']}>
              {projects.length === 0 ? (
                <div className={styles['projects-empty']}>
                  <Icon name="briefcase" size={48} />
                  <h3>No projects found</h3>
                  <p>No projects match your current filters.</p>
                  {canCreateProject && (
                    <Link 
                      to="/projects/new"
                      className={`${buttonStyles.btn} ${buttonStyles['btn--primary']}`}
                    >
                      Create First Project
                    </Link>
                  )}
                </div>
              ) : (
                projects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => handleProjectClick(project.id)}
                  />
                ))
              )}
            </div>
          ) : (
            <ProjectsTable 
              projects={projects}
              onProjectClick={handleProjectClick}
            />
          )}
        </div>

        {/* Summary Stats */}
        {projects.length > 0 && (
          <div className={styles['projects-summary']}>
            <div className={styles['summary-stat']}>
              <span className={styles['summary-stat__value']}>{projects.length}</span>
              <span className={styles['summary-stat__label']}>Total Projects</span>
            </div>
            <div className={styles['summary-stat']}>
              <span className={styles['summary-stat__value']}>
                {projects.filter(p => p.status === 'active').length}
              </span>
              <span className={styles['summary-stat__label']}>Active</span>
            </div>
            <div className={styles['summary-stat']}>
              <span className={styles['summary-stat__value']}>
                {projects.filter(p => p.status === 'completed').length}
              </span>
              <span className={styles['summary-stat__label']}>Completed</span>
            </div>
            <div className={styles['summary-stat']}>
              <span className={styles['summary-stat__value']}>
                {Math.round(projects.reduce((sum, p) => sum + p.progress, 0) / projects.length)}%
              </span>
              <span className={styles['summary-stat__label']}>Avg Progress</span>
            </div>
          </div>
        )}
      </section>
    </section>
  );
}