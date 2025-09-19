// src/components/TaskDrawer.jsx
import { useState, useEffect } from 'react';
import Icon from '@components/Icon.jsx';
import { useAuth } from '@components/AuthContext.jsx';
import { projectApi } from '@/lib/projectApi.js';

const drawerStyles = {
  // Drawer Overlay and Container
  'drawer-overlay': {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    backdropFilter: 'blur(2px)'
  },
  
  drawer: {
    background: 'white',
    borderRadius: '12px',
    width: '100%',
    maxWidth: '700px',
    maxHeight: '95vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 25px 75px rgba(0, 0, 0, 0.2)'
  },

  'drawer__header': {
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    background: '#f8f9fa'
  },

  'drawer__subtitle': {
    margin: '0.25rem 0 0 0',
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: 'normal'
  },

  'drawer__close': {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.5rem',
    borderRadius: '6px',
    transition: 'background-color 0.15s ease',
    color: '#6b7280',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  'drawer__body': {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column'
  },

  'drawer__footer': {
    padding: '1.5rem',
    borderTop: '1px solid #e5e7eb',
    display: 'flex',
    gap: '0.75rem',
    justifyContent: 'flex-end',
    background: '#f8f9fa'
  },

  'drawer-tabs': {
    display: 'flex',
    borderBottom: '1px solid #e5e7eb',
    background: '#f8f9fa',
    padding: '0 1.5rem'
  },

  'drawer-tab': {
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
    transition: 'all 0.15s ease',
    position: 'relative'
  },

  'drawer-tab--active': {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
    background: 'white',
    fontWeight: '500'
  },

  'tab-badge': {
    background: '#3b82f6',
    color: 'white',
    padding: '0.125rem 0.375rem',
    borderRadius: '10px',
    fontSize: '0.6875rem',
    fontWeight: '600',
    minWidth: '1.25rem',
    textAlign: 'center'
  },

  'task-form': {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem'
  },

  'form-group': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  'form-label': {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
  },

  'form-required': {
    color: '#dc2626',
    fontWeight: '700'
  },

  'form-input': {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    transition: 'all 0.2s ease',
    background: 'white',
    color: '#1f2937'
  },

  'form-input--error': {
    borderColor: '#dc2626',
    backgroundColor: '#fef2f2'
  },

  'form-textarea': {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    transition: 'all 0.2s ease',
    background: 'white',
    color: '#1f2937',
    resize: 'vertical',
    fontFamily: 'inherit'
  },

  'form-select': {
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

  'form-error': {
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

  'form-error-text': {
    fontSize: '0.75rem',
    color: '#dc2626',
    marginTop: '0.25rem'
  },

  'form-actions': {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '2rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #e5e7eb'
  },

  'attachments-list': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: '#f8f9fa',
    borderRadius: '6px',
    border: '1px solid #e5e7eb'
  },

  'attachment-item': {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem',
    background: 'white',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },

  'attachment-remove': {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '0.25rem',
    borderRadius: '4px',
    color: '#6b7280',
    transition: 'all 0.15s ease',
    marginLeft: 'auto'
  },

  'document-picker': {
    padding: '1rem'
  },

  'picker-empty': {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280'
  },

  'document-list': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    maxHeight: '300px',
    overflowY: 'auto'
  },

  'document-item': {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    background: 'white'
  },

  'document-item--selected': {
    borderColor: '#3b82f6',
    background: '#eff6ff',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.1)'
  },

  'document-item__icon': {
    color: '#6b7280',
    flexShrink: 0
  },

  'document-item__info': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },

  'document-item__name': {
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151'
  },

  'document-item__meta': {
    fontSize: '0.75rem',
    color: '#6b7280'
  },

  'document-item__check': {
    color: '#3b82f6',
    flexShrink: 0
  },

  'task-comments': {
    padding: '1.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.5rem',
    minHeight: '400px'
  },

  'comments-loading': {
    textAlign: 'center',
    padding: '2rem',
    color: '#6b7280',
    fontSize: '0.875rem'
  },

  'comments-empty': {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#6b7280'
  },

  'comments-list': {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    flex: 1
  },

  'comment-item': {
    display: 'flex',
    gap: '0.75rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #e5e7eb'
  },

  'comment-item__avatar': {
    width: '32px',
    height: '32px',
    background: '#e5e7eb',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6b7280',
    flexShrink: 0
  },

  'comment-item__content': {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },

  'comment-item__header': {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '1rem'
  },

  'comment-item__author': {
    fontSize: '0.875rem',
    fontWeight: '600',
    color: '#374151'
  },

  'comment-item__time': {
    fontSize: '0.75rem',
    color: '#6b7280'
  },

  'comment-item__body': {
    margin: 0,
    fontSize: '0.875rem',
    lineHeight: '1.5',
    color: '#374151',
    whiteSpace: 'pre-wrap'
  },

  'comment-form': {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
    marginTop: 'auto',
    paddingTop: '1rem',
    borderTop: '1px solid #e5e7eb'
  },

  'comment-form__input': {
    display: 'flex',
    flexDirection: 'column'
  },

  'comment-textarea': {
    padding: '0.75rem 1rem',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    lineHeight: '1.5',
    transition: 'all 0.2s ease',
    background: 'white',
    color: '#1f2937',
    resize: 'vertical',
    fontFamily: 'inherit',
    minHeight: '80px'
  },

  'comment-form__actions': {
    display: 'flex',
    justifyContent: 'flex-end'
  },

  'loading-state': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    color: '#6b7280',
    fontSize: '0.875rem'
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
    justifyContent: 'center'
  },

  'btn--outline': {
    background: 'white',
    color: '#374151',
    borderColor: '#d1d5db'
  },

  'btn--primary': {
    background: '#3b82f6',
    color: 'white',
    borderColor: '#3b82f6'
  },

  'btn--sm': {
    padding: '0.5rem 0.75rem',
    fontSize: '0.75rem'
  }
};

function DocumentPicker({ selectedDocs, onDocsChange, onClose }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mockDocs = [
      { id: 'doc-1', name: 'Requirements.pdf', type: 'pdf', uploadedDate: '2025-08-01' },
      { id: 'doc-2', name: 'Design_Specs.docx', type: 'docx', uploadedDate: '2025-08-10' },
      { id: 'doc-3', name: 'Wireframes.fig', type: 'figma', uploadedDate: '2025-08-15' },
      { id: 'doc-4', name: 'API_Documentation.md', type: 'markdown', uploadedDate: '2025-08-20' }
    ];
    setDocuments(mockDocs);
    setLoading(false);
  }, []);

  const handleDocToggle = (docId) => {
    const isSelected = selectedDocs.includes(docId);
    if (isSelected) {
      onDocsChange(selectedDocs.filter(id => id !== docId));
    } else {
      onDocsChange([...selectedDocs, docId]);
    }
  };

  const getFileIcon = (type) => {
    const iconMap = {
      'pdf': 'file-text',
      'docx': 'file-text',
      'figma': 'figma',
      'markdown': 'file-text',
      'image': 'image'
    };
    return iconMap[type] || 'file';
  };

  if (loading) {
    return (
      <div style={drawerStyles['drawer-overlay']}>
        <div style={drawerStyles.drawer}>
          <div style={drawerStyles['drawer__header']}>
            <h3>Attach Documents</h3>
            <button onClick={onClose} style={drawerStyles['drawer__close']}>
              <Icon name="x" size={20} />
            </button>
          </div>
          <div style={drawerStyles['drawer__body']}>
            <div style={drawerStyles['loading-state']}>Loading documents...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={drawerStyles['drawer-overlay']}>
      <div style={drawerStyles.drawer}>
        <div style={drawerStyles['drawer__header']}>
          <h3>Attach Documents</h3>
          <button onClick={onClose} style={drawerStyles['drawer__close']}>
            <Icon name="x" size={20} />
          </button>
        </div>
        
        <div style={drawerStyles['drawer__body']}>
          <div style={drawerStyles['document-picker']}>
            {documents.length === 0 ? (
              <div style={drawerStyles['picker-empty']}>
                <Icon name="file" size={32} />
                <p>No documents available</p>
              </div>
            ) : (
              <div style={drawerStyles['document-list']}>
                {documents.map(doc => (
                  <div
                    key={doc.id}
                    style={{
                      ...drawerStyles['document-item'],
                      ...(selectedDocs.includes(doc.id) ? drawerStyles['document-item--selected'] : {})
                    }}
                    onClick={() => handleDocToggle(doc.id)}
                  >
                    <div style={drawerStyles['document-item__icon']}>
                      <Icon name={getFileIcon(doc.type)} size={20} />
                    </div>
                    <div style={drawerStyles['document-item__info']}>
                      <div style={drawerStyles['document-item__name']}>{doc.name}</div>
                      <div style={drawerStyles['document-item__meta']}>
                        {doc.type.toUpperCase()} • {new Date(doc.uploadedDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={drawerStyles['document-item__check']}>
                      {selectedDocs.includes(doc.id) && <Icon name="check" size={16} />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={drawerStyles['drawer__footer']}>
          <button
            onClick={onClose}
            style={{ ...drawerStyles.btn, ...drawerStyles['btn--outline'] }}
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            style={{ ...drawerStyles.btn, ...drawerStyles['btn--primary'] }}
          >
            Attach Selected ({selectedDocs.length})
          </button>
        </div>
      </div>
    </div>
  );
}

function Comments({ taskId, canEdit }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [taskId]);

  const loadComments = async () => {
    try {
      const data = await projectApi.getComments(taskId);
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      await projectApi.createComment({
        taskId,
        body: newComment.trim()
      });
      setNewComment('');
      await loadComments();
    } catch (err) {
      console.error('Failed to add comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div style={drawerStyles['comments-loading']}>Loading comments...</div>;
  }

  return (
    <div style={drawerStyles['task-comments']}>
      {comments.length === 0 ? (
        <div style={drawerStyles['comments-empty']}>
          <Icon name="message-circle" size={32} />
          <p>No comments yet</p>
        </div>
      ) : (
        <div style={drawerStyles['comments-list']}>
          {comments.map(comment => (
            <div key={comment.id} style={drawerStyles['comment-item']}>
              <div style={drawerStyles['comment-item__avatar']}>
                <Icon name="user" size={16} />
              </div>
              <div style={drawerStyles['comment-item__content']}>
                <div style={drawerStyles['comment-item__header']}>
                  <span style={drawerStyles['comment-item__author']}>
                    {comment.authorId}
                  </span>
                  <time style={drawerStyles['comment-item__time']}>
                    {new Date(comment.createdAt).toLocaleString()}
                  </time>
                </div>
                <p style={drawerStyles['comment-item__body']}>{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {canEdit && (
        <form onSubmit={handleSubmitComment} style={drawerStyles['comment-form']}>
          <div style={drawerStyles['comment-form__input']}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              style={drawerStyles['comment-textarea']}
              disabled={submitting}
            />
          </div>
          <div style={drawerStyles['comment-form__actions']}>
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              style={{ ...drawerStyles.btn, ...drawerStyles['btn--primary'], ...drawerStyles['btn--sm'] }}
            >
              {submitting ? 'Adding...' : 'Add Comment'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default function TaskDrawer({ task, project, onSave, onClose, canEdit, isClient }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    assigneeId: null,
    dueDate: '',
    attachments: []
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [showDocPicker, setShowDocPicker] = useState(false);
  const [activeSection, setActiveSection] = useState('details');

  const isEditing = Boolean(task?.id);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        assigneeId: task.assigneeId || null,
        dueDate: task.dueDate ? task.dueDate.split('T')[0] : '',
        attachments: task.attachments || []
      });
    }
  }, [task]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (dueDate < today) {
        newErrors.dueDate = 'Due date cannot be in the past';
      }
    }

    if (formData.assigneeId && project.members && !project.members.includes(formData.assigneeId)) {
      newErrors.assigneeId = 'Assignee must be a project member';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm() || submitting) return;

    try {
      setSubmitting(true);
      
      const taskData = {
        ...formData,
        projectId: project.id
      };

      if (isEditing) {
        taskData.id = task.id;
      }

      await onSave(taskData);
    } catch (err) {
      console.error('Failed to save task:', err);
      setErrors({ submit: 'Failed to save task. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDocumentsChange = (newDocs) => {
    handleInputChange('attachments', newDocs);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'blocked', label: 'Blocked' },
    { value: 'done', label: 'Done' }
  ];

  const availableStatuses = isEditing && task?.status ? 
    statusOptions.filter(option => 
      option.value === task.status || 
      (projectApi.validateTaskMove && projectApi.validateTaskMove(task.status, option.value))
    ) : 
    statusOptions;

  return (
    <div style={drawerStyles['drawer-overlay']} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={drawerStyles.drawer}>
        <div style={drawerStyles['drawer__header']}>
          <div>
            <h3>{isEditing ? 'Edit Task' : 'Create Task'}</h3>
            <p style={drawerStyles['drawer__subtitle']}>
              in {project.name}
            </p>
          </div>
          <button onClick={onClose} style={drawerStyles['drawer__close']}>
            <Icon name="x" size={20} />
          </button>
        </div>

        <div style={drawerStyles['drawer__body']}>
          <div style={drawerStyles['drawer-tabs']}>
            <button
              style={{
                ...drawerStyles['drawer-tab'],
                ...(activeSection === 'details' ? drawerStyles['drawer-tab--active'] : {})
              }}
              onClick={() => setActiveSection('details')}
            >
              <Icon name="edit" size={14} />
              Details
            </button>
            {isEditing && (
              <button
                style={{
                  ...drawerStyles['drawer-tab'],
                  ...(activeSection === 'comments' ? drawerStyles['drawer-tab--active'] : {})
                }}
                onClick={() => setActiveSection('comments')}
              >
                <Icon name="message-circle" size={14} />
                Comments
                {task.commentsCount > 0 && (
                  <span style={drawerStyles['tab-badge']}>{task.commentsCount}</span>
                )}
              </button>
            )}
          </div>

          {activeSection === 'details' && (
            <form onSubmit={handleSubmit} style={drawerStyles['task-form']}>
              {errors.submit && (
                <div style={drawerStyles['form-error']}>
                  <Icon name="alert-circle" size={16} />
                  {errors.submit}
                </div>
              )}

              <div style={drawerStyles['form-group']}>
                <label htmlFor="task-title" style={drawerStyles['form-label']}>
                  Title <span style={drawerStyles['form-required']}>*</span>
                </label>
                <input
                  id="task-title"
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  style={{
                    ...drawerStyles['form-input'],
                    ...(errors.title ? drawerStyles['form-input--error'] : {})
                  }}
                  placeholder="Enter task title..."
                  disabled={!canEdit}
                  autoFocus
                />
                {errors.title && (
                  <span style={drawerStyles['form-error-text']}>{errors.title}</span>
                )}
              </div>

              <div style={drawerStyles['form-group']}>
                <label htmlFor="task-description" style={drawerStyles['form-label']}>
                  Description
                </label>
                <textarea
                  id="task-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  style={drawerStyles['form-textarea']}
                  placeholder="Describe the task..."
                  rows={4}
                  disabled={!canEdit}
                />
              </div>

              <div style={drawerStyles['form-group']}>
                <label htmlFor="task-status" style={drawerStyles['form-label']}>
                  Status
                </label>
                <select
                  id="task-status"
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  style={drawerStyles['form-select']}
                  disabled={!canEdit}
                >
                  {availableStatuses.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {!isClient && (
                <div style={drawerStyles['form-group']}>
                  <label htmlFor="task-assignee" style={drawerStyles['form-label']}>
                    Assignee
                  </label>
                  <select
                    id="task-assignee"
                    value={formData.assigneeId || ''}
                    onChange={(e) => handleInputChange('assigneeId', e.target.value || null)}
                    style={drawerStyles['form-select']}
                    disabled={!canEdit}
                  >
                    <option value="">Unassigned</option>
                    {(project.members || []).map(memberId => (
                      <option key={memberId} value={memberId}>
                        {memberId}
                      </option>
                    ))}
                  </select>
                  {errors.assigneeId && (
                    <span style={drawerStyles['form-error-text']}>{errors.assigneeId}</span>
                  )}
                </div>
              )}

            <div style={drawerStyles['form-group']}>
                <label htmlFor="task-due-date" style={drawerStyles['form-label']}>
                  Due Date
                </label>
                <input
                  id="task-due-date"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  style={{
                    ...drawerStyles['form-input'],
                    ...(errors.dueDate ? drawerStyles['form-input--error'] : {})
                  }}
                  disabled={!canEdit}
                />
                {errors.dueDate && (
                  <span style={drawerStyles['form-error-text']}>{errors.dueDate}</span>
                )}
              </div>

              <div style={drawerStyles['form-group']}>
                <label style={drawerStyles['form-label']}>
                  Attachments
                </label>
                
                {formData.attachments.length > 0 && (
                  <div style={drawerStyles['attachments-list']}>
                    {formData.attachments.map(docId => (
                      <div key={docId} style={drawerStyles['attachment-item']}>
                        <Icon name="file" size={14} />
                        <span>Document {docId}</span>
                        {canEdit && (
                          <button
                            type="button"
                            onClick={() => handleDocumentsChange(formData.attachments.filter(id => id !== docId))}
                            style={drawerStyles['attachment-remove']}
                          >
                            <Icon name="x" size={12} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {canEdit && (
                  <button
                    type="button"
                    onClick={() => setShowDocPicker(true)}
                    style={{ ...drawerStyles.btn, ...drawerStyles['btn--outline'], ...drawerStyles['btn--sm'] }}
                  >
                    <Icon name="paperclip" size={14} />
                    Attach Documents
                  </button>
                )}
              </div>

              {canEdit && (
                <div style={drawerStyles['form-actions']}>
                  <button
                    type="button"
                    onClick={onClose}
                    style={{ ...drawerStyles.btn, ...drawerStyles['btn--outline'] }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{ ...drawerStyles.btn, ...drawerStyles['btn--primary'] }}
                  >
                    {submitting ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeSection === 'comments' && isEditing && (
            <Comments taskId={task.id} canEdit={canEdit} />
          )}
        </div>

        {showDocPicker && (
          <DocumentPicker
            selectedDocs={formData.attachments}
            onDocsChange={handleDocumentsChange}
            onClose={() => setShowDocPicker(false)}
          />
        )}
      </div>
    </div>
  );
}