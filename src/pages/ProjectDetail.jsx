// src/pages/ProjectDetail.jsx - Updated for Consultancy Business Projects
import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '@components/Icon.jsx';
import { useAuth } from '@components/AuthContext.jsx';
import { projectApi } from '@/lib/projectApi.js';
import TaskDrawer from '@components/TaskDrawer.jsx';
// Comprehensive inline styles
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
  // Project Header Styles
  projectHeader: {
    marginBottom: '2rem',
    padding: '1.5rem',
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.08)',
    border: '1px solid #e5e7eb'
  },
  projectHeaderMain: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginBottom: '1rem'
  },
  projectTitle: {
    margin: '0 0 0.5rem 0',
    fontSize: '1.75rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  projectMeta: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  projectMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem',
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  projectHeaderActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  projectProgress: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  progressBar: {
    width: '120px',
    height: '8px',
    background: '#e5e7eb',
    borderRadius: '4px',
    overflow: 'hidden',
    border: '1px solid #d1d5db'
  },
  progressBarFill: {
    height: '100%',
    background: '#10b981',
    transition: 'width 0.3s ease'
  },
  // Tabs Styles
  projectTabs: {
    marginBottom: '2rem'
  },
  tabNav: {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb'
  },
  tabNavItem: {
    background: 'none',
    border: 'none',
    padding: '0.75rem 1rem',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    fontSize: '0.875rem',
    color: '#6b7280',
    borderBottom: '2px solid transparent',
    transition: 'all 0.15s ease'
  },
  tabNavItemActive: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
    background: '#f8f9fa'
  },
  // Task Management Board
  taskBoard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  taskColumn: {
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    minHeight: '500px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
  },
  taskColumnHeader: {
    padding: '1rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#f8f9fa'
  },
  taskColumnTitle: {
    margin: '0',
    fontSize: '0.875rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: '#374151'
  },
  taskCount: {
    background: '#e5e7eb',
    color: '#6b7280',
    padding: '0.25rem 0.5rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500'
  },
  taskList: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    minHeight: '400px'
  },
  taskEmpty: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '200px',
    color: '#6b7280',
    textAlign: 'center'
  },
  // Task Card Styles
  taskCard: {
    background: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '6px',
    padding: '1rem',
    transition: 'all 0.15s ease',
    cursor: 'pointer'
  },
  taskCardTodo: {
    borderLeft: '3px solid #9ca3af'
  },
  taskCardInProgress: {
    borderLeft: '3px solid #f59e0b'
  },
  taskCardReview: {
    borderLeft: '3px solid #3b82f6'
  },
  taskCardCompleted: {
    borderLeft: '3px solid #10b981',
    opacity: '0.8'
  },
  taskCardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '0.75rem'
  },
  taskCardTitle: {
    margin: '0',
    fontSize: '0.875rem',
    fontWeight: '600',
    lineHeight: '1.4',
    flex: '1',
    cursor: 'pointer',
    color: '#374151'
  },
  taskCardDescription: {
    margin: '0 0 0.75rem 0',
    fontSize: '0.8rem',
    color: '#6b7280',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: '2',
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden'
  },
  taskCardMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.75rem',
    marginBottom: '0.75rem',
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  taskCardMetaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },
  taskCardActions: {
    display: 'flex',
    gap: '0.25rem',
    flexWrap: 'wrap',
    marginTop: '0.75rem',
    paddingTop: '0.75rem',
    borderTop: '1px solid #e5e7eb'
  },
  // Pill Styles
  dashPill: {
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: '500',
    textTransform: 'capitalize'
  },
  dashPillSmall: {
    padding: '0.125rem 0.5rem',
    fontSize: '0.6875rem'
  },
  dashPillBlue: {
    background: '#dbeafe',
    color: '#1e40af'
  },
  dashPillGreen: {
    background: '#dcfce7',
    color: '#166534'
  },
  dashPillYellow: {
    background: '#fef3c7',
    color: '#92400e'
  },
  dashPillRed: {
    background: '#fee2e2',
    color: '#991b1b'
  },
  dashPillGray: {
    background: '#f3f4f6',
    color: '#374151'
  },
  // Button Styles
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
    justifyContent: 'center'
  },
  btnSm: {
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem',
    minWidth: 'auto'
  },
  btnPrimary: {
    background: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },
  btnGhost: {
    background: 'transparent',
    color: '#6b7280',
    borderColor: 'transparent'
  },
  // Team Tab
  teamSection: {
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '1.5rem'
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  teamMember: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },
  teamMemberAvatar: {
    width: '40px',
    height: '40px',
    background: '#e5e7eb',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    fontWeight: '600'
  },
  teamMemberInfo: {
    flex: '1'
  },
  teamMemberName: {
    fontWeight: '600',
    color: '#374151',
    marginBottom: '0.25rem'
  },
  teamMemberRole: {
    fontSize: '0.75rem',
    color: '#6b7280'
  },
  // Overview Tab
  overviewSection: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr',
    gap: '2rem'
  },
  overviewMain: {
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '1.5rem'
  },
  overviewSidebar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  overviewCard: {
    background: 'white',
    borderRadius: '8px',
    border: '1px solid #e5e7eb',
    padding: '1.5rem'
  },
  overviewCardTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.125rem',
    fontWeight: '600',
    color: '#1f2937'
  },
  overviewText: {
    color: '#6b7280',
    lineHeight: '1.6'
  },
  overviewList: {
    listStyle: 'none',
    padding: '0',
    margin: '0'
  },
  overviewListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.5rem 0',
    borderBottom: '1px solid #f3f4f6'
  },
  overviewLabel: {
    fontSize: '0.875rem',
    color: '#6b7280'
  },
  overviewValue: {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  }
};

function TaskCard({ task, onEdit, onMove, canEdit, onDelete }) {
  const statusColor = task.status === 'todo' ? 'gray' : 
                     task.status === 'in-progress' ? 'yellow' :
                     task.status === 'review' ? 'blue' : 'green';
  
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const date = new Date(dateStr);
    const now = new Date();
    const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: date.toLocaleDateString(), overdue: true };
    if (diffDays === 0) return { text: 'Today', today: true };
    if (diffDays === 1) return { text: 'Tomorrow', soon: true };
    return { text: date.toLocaleDateString(), normal: true };
  };

  const dueInfo = formatDate(task.dueDate);
  
  const getValidMoves = (currentStatus) => {
    const moves = {
      'todo': [{ status: 'in-progress', label: 'Start', icon: 'play' }],
      'in-progress': [
        { status: 'review', label: 'Review', icon: 'eye' },
        { status: 'completed', label: 'Complete', icon: 'check' },
        { status: 'todo', label: 'Reset', icon: 'rotate-ccw' }
      ],
      'review': [
        { status: 'completed', label: 'Approve', icon: 'check' },
        { status: 'in-progress', label: 'Revise', icon: 'edit' }
      ],
      'completed': [{ status: 'in-progress', label: 'Reopen', icon: 'rotate-ccw' }]
    };
    return moves[currentStatus] || [];
  };

  const validMoves = getValidMoves(task.status);

  const getTaskCardStyle = (status) => {
    const baseStyle = { ...styles.taskCard };
    switch (status) {
      case 'todo': return { ...baseStyle, ...styles.taskCardTodo };
      case 'in-progress': return { ...baseStyle, ...styles.taskCardInProgress };
      case 'review': return { ...baseStyle, ...styles.taskCardReview };
      case 'completed': return { ...baseStyle, ...styles.taskCardCompleted };
      default: return baseStyle;
    }
  };

  const getPillStyle = (color) => {
    const baseStyle = { ...styles.dashPill, ...styles.dashPillSmall };
    switch (color) {
      case 'blue': return { ...baseStyle, ...styles.dashPillBlue };
      case 'green': return { ...baseStyle, ...styles.dashPillGreen };
      case 'yellow': return { ...baseStyle, ...styles.dashPillYellow };
      case 'red': return { ...baseStyle, ...styles.dashPillRed };
      default: return { ...baseStyle, ...styles.dashPillGray };
    }
  };

  return (
    <div 
      style={getTaskCardStyle(task.status)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#3b82f6';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <div style={styles.taskCardHeader}>
        <h4 
          style={styles.taskCardTitle} 
          onClick={() => onEdit(task)}
          onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
          onMouseLeave={(e) => e.target.style.color = '#374151'}
        >
          {task.title}
        </h4>
        <span style={getPillStyle(statusColor)}>
          {task.status}
        </span>
      </div>

      {task.description && (
        <p style={styles.taskCardDescription}>{task.description}</p>
      )}

      <div style={styles.taskCardMeta}>
        {task.assignee && (
          <div style={styles.taskCardMetaItem}>
            <Icon name="user" size={12} />
            <span>{task.assignee}</span>
          </div>
        )}

        {dueInfo && (
          <div style={{
            ...styles.taskCardMetaItem,
            color: dueInfo.overdue ? '#ef4444' : dueInfo.today ? '#f59e0b' : dueInfo.soon ? '#3b82f6' : '#6b7280',
            fontWeight: dueInfo.overdue || dueInfo.today || dueInfo.soon ? '500' : 'normal'
          }}>
            <Icon name="calendar" size={12} />
            <span>{dueInfo.text}</span>
          </div>
        )}

        {task.priority && (
          <div style={styles.taskCardMetaItem}>
            <Icon name="flag" size={12} />
            <span>{task.priority}</span>
          </div>
        )}
      </div>

      {canEdit && (
        <div style={styles.taskCardActions}>
          {validMoves.map(move => (
            <button
              key={move.status}
              style={{ ...styles.btn, ...styles.btnGhost, ...styles.btnSm }}
              onClick={() => onMove(task.id, move.status)}
              title={move.label}
              onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
              onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
              <Icon name={move.icon} size={14} />
              {move.label}
            </button>
          ))}
          
          <button
            style={{ ...styles.btn, ...styles.btnGhost, ...styles.btnSm }}
            onClick={() => onEdit(task)}
            title="Edit task"
            onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
          >
            <Icon name="edit" size={14} />
          </button>

          <button
            style={{ ...styles.btn, ...styles.btnGhost, ...styles.btnSm, color: '#ef4444' }}
            onClick={() => onDelete(task.id)}
            title="Delete task"
            onMouseEnter={(e) => {
              e.target.style.background = '#fef2f2';
              e.target.style.color = '#dc2626';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = '#ef4444';
            }}
          >
            <Icon name="trash" size={14} />
          </button>
        </div>
      )}
    </div>
  );
}

function TaskBoard({ tasks, onTaskEdit, onTaskMove, onTaskDelete, canEdit, onCreateTask }) {
  const columns = [
    { id: 'todo', title: 'To Do', status: 'todo' },
    { id: 'in-progress', title: 'In Progress', status: 'in-progress' },
    { id: 'review', title: 'Review', status: 'review' },
    { id: 'completed', title: 'Completed', status: 'completed' }
  ];

  const getColumnTasks = (status) => {
    return tasks.filter(task => task.status === status);
  };

  return (
    <div style={styles.taskBoard}>
      {columns.map(column => {
        const columnTasks = getColumnTasks(column.status);
        
        return (
          <div key={column.id} style={styles.taskColumn}>
            <div style={styles.taskColumnHeader}>
              <h3 style={styles.taskColumnTitle}>{column.title}</h3>
              <span style={styles.taskCount}>{columnTasks.length}</span>
              
              {column.status === 'todo' && canEdit && (
                <button
                  style={{ ...styles.btn, ...styles.btnGhost, ...styles.btnSm }}
                  onClick={() => onCreateTask(column.status)}
                  title="Add task"
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Icon name="plus" size={14} />
                </button>
              )}
            </div>

            <div style={styles.taskList}>
              {columnTasks.length === 0 ? (
                <div style={styles.taskEmpty}>
                  {column.status === 'todo' ? (
                    canEdit ? (
                      <button
                        style={{ ...styles.btn, ...styles.btnGhost }}
                        onClick={() => onCreateTask(column.status)}
                        onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                        onMouseLeave={(e) => e.target.style.background = 'transparent'}
                      >
                        <Icon name="plus" size={16} />
                        Add first task
                      </button>
                    ) : (
                      <p>No tasks yet</p>
                    )
                  ) : (
                    <p>No {column.title.toLowerCase()} tasks</p>
                  )}
                </div>
              ) : (
                columnTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onTaskEdit}
                    onMove={onTaskMove}
                    onDelete={onTaskDelete}
                    canEdit={canEdit}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TeamTab({ project }) {
  const teamMembers = [
    { id: 'consultant-1', name: 'Nishan Timilsina', role: 'Project Manager', avatar: 'N' },
    { id: 'consultant-2', name: 'Jenish Neupane', role: 'Technical Lead', avatar: 'J' },
    { id: 'consultant-3', name: 'Sakura Ghimire', role: 'Marketing Specialist', avatar: 'S' },
    { id: 'consultant-4', name: 'Shikhar Khadka', role: 'Business Development', avatar: 'S' }
  ];

  return (
    <div style={styles.teamSection}>
      <h3 style={styles.overviewCardTitle}>Project Team</h3>
      <p style={styles.overviewText}>
        Team members working on this project and their responsibilities.
      </p>
      
      <div style={styles.teamGrid}>
        {teamMembers.map(member => (
          <div key={member.id} style={styles.teamMember}>
            <div style={styles.teamMemberAvatar}>
              {member.avatar}
            </div>
            <div style={styles.teamMemberInfo}>
              <div style={styles.teamMemberName}>{member.name}</div>
              <div style={styles.teamMemberRole}>{member.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OverviewTab({ project }) {
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
    <div style={styles.overviewSection}>
      <div style={styles.overviewMain}>
        <h3 style={styles.overviewCardTitle}>Project Description</h3>
        <p style={styles.overviewText}>
          {project.description || 'This is a consultancy business project focused on delivering value to our clients and organization. The project involves coordinated efforts from multiple team members to achieve specific business objectives within the defined timeline and budget.'}
        </p>

        {project.objectives && (
          <>
            <h4 style={{...styles.overviewCardTitle, fontSize: '1rem', marginTop: '2rem'}}>
              Project Objectives
            </h4>
            <p style={styles.overviewText}>{project.objectives}</p>
          </>
        )}

        {project.successCriteria && (
          <>
            <h4 style={{...styles.overviewCardTitle, fontSize: '1rem', marginTop: '2rem'}}>
              Success Criteria
            </h4>
            <p style={styles.overviewText}>{project.successCriteria}</p>
          </>
        )}

        {project.riskFactors && (
          <>
            <h4 style={{...styles.overviewCardTitle, fontSize: '1rem', marginTop: '2rem'}}>
              Risk Factors & Mitigation
            </h4>
            <p style={styles.overviewText}>{project.riskFactors}</p>
          </>
        )}
      </div>

      <div style={styles.overviewSidebar}>
        <div style={styles.overviewCard}>
          <h3 style={styles.overviewCardTitle}>Project Details</h3>
          <ul style={styles.overviewList}>
            <li style={styles.overviewListItem}>
              <span style={styles.overviewLabel}>Project Type</span>
              <span style={styles.overviewValue}>{getProjectTypeLabel(project.type)}</span>
            </li>
            <li style={styles.overviewListItem}>
              <span style={styles.overviewLabel}>Project Manager</span>
              <span style={styles.overviewValue}>{project.projectManager || 'Unassigned'}</span>
            </li>
            <li style={styles.overviewListItem}>
              <span style={styles.overviewLabel}>Branch</span>
              <span style={styles.overviewValue}>{project.branch}</span>
            </li>
            <li style={styles.overviewListItem}>
              <span style={styles.overviewLabel}>Budget</span>
              <span style={styles.overviewValue}>
                {project.budget ? `Rs. ${project.budget.toLocaleString()}` : 'No budget set'}
              </span>
            </li>
            <li style={styles.overviewListItem}>
              <span style={styles.overviewLabel}>Timeline</span>
              <span style={styles.overviewValue}>
                {project.startDate && project.endDate 
                  ? `${new Date(project.startDate).toLocaleDateString()} - ${new Date(project.endDate).toLocaleDateString()}`
                  : 'No timeline set'}
              </span>
            </li>
          </ul>
        </div>

        <div style={styles.overviewCard}>
          <h3 style={styles.overviewCardTitle}>Progress Summary</h3>
          <div style={styles.progressBar}>
            <div 
              style={{...styles.progressBarFill, width: `${project.progress}%`}}
            />
          </div>
          <p style={{...styles.overviewText, textAlign: 'center', marginTop: '0.5rem'}}>
            {project.progress}% Complete
          </p>
          
          <ul style={{...styles.overviewList, marginTop: '1rem'}}>
            <li style={styles.overviewListItem}>
              <span style={styles.overviewLabel}>Total Tasks</span>
              <span style={styles.overviewValue}>{project.taskCount || 0}</span>
            </li>
            <li style={styles.overviewListItem}>
              <span style={styles.overviewLabel}>Team Size</span>
              <span style={styles.overviewValue}>{project.teamMembers?.length || 0}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');

  const canEdit = user?.role === 'admin' || 
    (user?.role === 'consultant' && project?.teamMembers?.includes(user.id));

  useEffect(() => {
    loadProject();
  }, [id]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectData = await projectApi.getProject(id);
      setProject({
        ...projectData,
        type: projectData.type || 'internal',
        projectManager: projectData.projectManager || 'Nishan Timilsina',
        teamMembers: projectData.teamMembers || ['consultant-1', 'consultant-2'],
        tasks: projectData.tasks || []
      });

      // Load business project tasks
      const businessTasks = projectData.tasks || [
        {
          id: 'task-1',
          title: 'Book venue and permits',
          description: 'Secure appropriate venue and obtain necessary permits for the event',
          status: 'completed',
          assignee: 'Rajesh Maharjan',
          dueDate: '2024-09-15',
          priority: 'High'
        },
        {
          id: 'task-2', 
          title: 'Contact partner universities',
          description: 'Reach out to Australian universities to confirm participation',
          status: 'completed',
          assignee: 'Nishan Timilsina',
          dueDate: '2024-09-20',
          priority: 'High'
        },
        {
          id: 'task-3',
          title: 'Design promotional materials',
          description: 'Create brochures, banners, and digital marketing content',
          status: 'in-progress', 
          assignee: 'Sakura Ghimire',
          dueDate: '2024-10-01',
          priority: 'Medium'
        },
        {
          id: 'task-4',
          title: 'Setup registration system',
          description: 'Build online registration platform for student attendees',
          status: 'review',
          assignee: 'Jenish Neupane',
          dueDate: '2024-10-05',
          priority: 'Medium'
        },
        {
          id: 'task-5',
          title: 'Coordinate logistics',
          description: 'Arrange catering, seating, AV equipment, and event staff',
          status: 'todo',
          assignee: 'Rajesh Maharjan', 
          dueDate: '2024-10-15',
          priority: 'High'
        },
        {
          id: 'task-6',
          title: 'Media coverage planning',
          description: 'Arrange press coverage and social media promotion',
          status: 'todo',
          assignee: 'Sakura Ghimire',
          dueDate: '2024-10-10',
          priority: 'Low'
        }
      ];
      
      setTasks(businessTasks);
    } catch (err) {
      console.error('Failed to load project:', err);
      setError('Project not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleTaskEdit = (task) => {
    console.log('Edit task:', task);
    // In a real app, open task edit modal
  };

const handleTaskCreate = (status = 'todo') => {
  const newTaskTemplate = {
    id: null,
    projectId: project.id,
    title: '',
    description: '',
    status: status,
    assignee: null,
    dueDate: null,
    priority: 'Medium'
  };
  
  setSelectedTask(newTaskTemplate);
  setDrawerOpen(true);
  setSearchParams({ task: 'new' });
};

  const handleTaskMove = async (taskId, newStatus) => {
    try {
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? { ...task, status: newStatus } : task
      );
      setTasks(updatedTasks);
      // In real app: await projectApi.updateTask(taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to move task:', err);
      alert('Failed to move task');
    }
  };

  const handleTaskDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      // In real app: await projectApi.deleteTask(taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
      alert('Failed to delete task');
    }
  };
const handleTaskSave = async (taskData) => {
  try {
    if (taskData.id) {
      // Update existing task
      const updatedTasks = tasks.map(task => 
        task.id === taskData.id ? { ...taskData } : task
      );
      setTasks(updatedTasks);
    } else {
      // Create new task with unique ID
      const newTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        assignee: taskData.assignee || user?.username || 'Unassigned'
      };
      setTasks(prev => [...prev, newTask]);
    }
    
    setDrawerOpen(false);
    setSelectedTask(null);
    setSearchParams({});
  } catch (err) {
    console.error('Failed to save task:', err);
    throw err;
  }
};

const handleDrawerClose = () => {
  setDrawerOpen(false);
  setSelectedTask(null);
  setSearchParams({});
};
const [drawerOpen, setDrawerOpen] = useState(false);
const [selectedTask, setSelectedTask] = useState(null);
  const getPillStyle = (color) => {
    const baseStyle = { ...styles.dashPill };
    switch (color) {
      case 'blue': return { ...baseStyle, ...styles.dashPillBlue };
      case 'green': return { ...baseStyle, ...styles.dashPillGreen };
      case 'yellow': return { ...baseStyle, ...styles.dashPillYellow };
      case 'red': return { ...baseStyle, ...styles.dashPillRed };
      default: return { ...baseStyle, ...styles.dashPillGray };
    }
  };

  if (loading) {
    return (
      <section style={styles.mainSection}>
        <section style={styles.dash}>
          <div style={styles.dashGrid}>
            <div style={styles.dashCol12}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <Icon name="loader" size={24} />
                <p>Loading project...</p>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }

  if (error || !project) {
    return (
      <section style={styles.mainSection}>
        <section style={styles.dash}>
          <div style={styles.dashGrid}>
            <div style={styles.dashCol12}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 2rem',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <Icon name="alert-circle" size={24} />
                <h3>Project Not Found</h3>
                <p>{error || 'The requested project could not be found.'}</p>
                <button 
                  onClick={() => navigate('/projects')}
                  style={{ ...styles.btn, ...styles.btnPrimary }}
                >
                  <Icon name="arrow-left" size={16} />
                  Back to Projects
                </button>
              </div>
            </div>
          </div>
        </section>
      </section>
    );
  }

  const statusColor = project.status === 'planning' ? 'gray' :
                     project.status === 'active' ? 'yellow' :
                     project.status === 'on-hold' ? 'red' : 'green';

  return (
    <section style={styles.mainSection}>
      <section style={styles.dash}>
        <div style={styles.dashGrid}>
          {/* Project Header - Full Width */}
          <div style={styles.dashCol12}>
            <div style={styles.projectHeader}>
              <div style={styles.projectHeaderMain}>
                <button
                  onClick={() => navigate('/projects')}
                  style={{ ...styles.btn, ...styles.btnGhost }}
                  onMouseEnter={(e) => e.target.style.background = '#f3f4f6'}
                  onMouseLeave={(e) => e.target.style.background = 'transparent'}
                >
                  <Icon name="arrow-left" size={16} />
                  Back to Projects
                </button>
                
                <div>
                  <h1 style={styles.projectTitle}>{project.name}</h1>
                  <div style={styles.projectMeta}>
                    <span style={getPillStyle(statusColor)}>
                      {project.status}
                    </span>
                    <span style={styles.projectMetaItem}>
                      <Icon name="briefcase" size={14} />
                      {project.type === 'client' ? 'Client Project' :
                       project.type === 'internal' ? 'Internal Initiative' :
                       project.type === 'service' ? 'Service Launch' :
                       project.type === 'marketing' ? 'Marketing Campaign' : 'Partnership Program'}
                    </span>
                    <span style={styles.projectMetaItem}>
                      <Icon name="user" size={14} />
                      PM: {project.projectManager}
                    </span>
                    <span style={styles.projectMetaItem}>
                      <Icon name="users" size={14} />
                      {project.teamMembers?.length || 0} members
                    </span>
                    {project.endDate && (
                      <span style={styles.projectMetaItem}>
                        <Icon name="calendar" size={14} />
                        Due {new Date(project.endDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div style={styles.projectHeaderActions}>
                <div style={styles.projectProgress}>
                  <div style={styles.progressBar}>
                    <div 
                      style={{...styles.progressBarFill, width: `${project.progress}%`}}
                    />
                  </div>
                  <span>{project.progress}% complete</span>
                </div>

                {canEdit && (
                  <button
                    style={{ ...styles.btn, ...styles.btnPrimary }}
                    onClick={() => handleTaskCreate()}
                    onMouseEnter={(e) => {
                      e.target.style.background = '#2563eb';
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = '#3b82f6';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <Icon name="plus" size={16} />
                    Add Task
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tabs - Full Width */}
          <div style={styles.dashCol12}>
            <div style={styles.projectTabs}>
              <nav style={styles.tabNav}>
                <button
                  style={{
                    ...styles.tabNavItem,
                    ...(activeTab === 'overview' ? styles.tabNavItemActive : {})
                  }}
                  onClick={() => handleTabChange('overview')}
                >
                  <Icon name="file-text" size={16} />
                  Overview
                </button>
                <button
                  style={{
                    ...styles.tabNavItem,
                    ...(activeTab === 'tasks' ? styles.tabNavItemActive : {})
                  }}
                  onClick={() => handleTabChange('tasks')}
                >
                  <Icon name="check-square" size={16} />
                  Tasks
                </button>
                <button
                  style={{
                    ...styles.tabNavItem,
                    ...(activeTab === 'team' ? styles.tabNavItemActive : {})
                  }}
                  onClick={() => handleTabChange('team')}
                >
                  <Icon name="users" size={16} />
                  Team
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content - Full Width */}
          <div style={styles.dashCol12}>
            <div>
              {activeTab === 'overview' && (
                <OverviewTab project={project} />
              )}

              {activeTab === 'tasks' && (
                <TaskBoard
                  tasks={tasks}
                  onTaskEdit={handleTaskEdit}
                  onTaskMove={handleTaskMove}
                  onTaskDelete={handleTaskDelete}
                  onCreateTask={handleTaskCreate}
                  canEdit={canEdit}
                />
              )}

              {activeTab === 'team' && (
                <TeamTab project={project} />
              )}
            </div>
          </div>

          {/* Task Drawer */}
          {drawerOpen && (
            <TaskDrawer
              task={selectedTask}
              project={project}
              onSave={handleTaskSave}
              onClose={handleDrawerClose}
              canEdit={canEdit}
              isClient={user?.role === 'client'}
            />
          )}
        </div>
      </section>
    </section>
  );
}