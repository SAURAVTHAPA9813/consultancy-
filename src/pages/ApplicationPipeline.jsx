import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import Icon from '@/components/Icon.jsx';

export default function ApplicationPipeline() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    consultant: '',
    country: '',
    timeline: '',
    search: ''
  });
  const [showNewAppModal, setShowNewAppModal] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // New Application Form Data
  const [newAppForm, setNewAppForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    type: 'university', // 'university' or 'visa'
    title: '',
    country: '',
    consultant: '',
    priority: 'medium',
    deadline: '',
    notes: '',
    documents: {
      required: [],
      completed: []
    }
  });

  const [formErrors, setFormErrors] = useState({});

  // Pipeline stages
  const stages = [
    { id: 'initial', name: 'Initial', color: '#64748b', description: 'Initial consultation and planning' },
    { id: 'documents', name: 'Documents', color: '#f59e0b', description: 'Collecting and preparing documents' },
    { id: 'submitted', name: 'Submitted', color: '#3b82f6', description: 'Application submitted and pending' },
    { id: 'interview', name: 'Interview', color: '#8b5cf6', description: 'Interview scheduled or completed' },
    { id: 'decision', name: 'Decision', color: '#10b981', description: 'Final decision received' }
  ];

  // Document templates based on application type
  const documentTemplates = {
    university: {
      undergraduate: ['transcript', 'sop', 'lor', 'cv', 'ielts_toefl', 'financial_docs'],
      graduate: ['transcript', 'sop', 'lor', 'cv', 'gre_gmat', 'ielts_toefl', 'financial_docs', 'research_proposal'],
      phd: ['transcript', 'sop', 'lor', 'cv', 'gre_gmat', 'ielts_toefl', 'research_proposal', 'publications', 'financial_docs']
    },
    visa: {
      student: ['passport', 'i20_cas', 'financial_docs', 'ielts_toefl', 'photos', 'medical_exam'],
      tourist: ['passport', 'invitation_letter', 'financial_docs', 'photos', 'travel_itinerary'],
      business: ['passport', 'business_letter', 'financial_docs', 'photos', 'company_docs']
    }
  };

  // Countries and consultants data
  const countries = ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Netherlands', 'Sweden'];
  const consultants = [
    { id: 1, name: 'Dr. Nishan Timilsina', specializations: ['USA', 'Canada'] },
    { id: 2, name: 'Jenish Neupane', specializations: ['Australia', 'UK'] },
    { id: 3, name: 'Sakura Ghimire', specializations: ['Germany', 'France'] }
  ];

  // Mock applications data
  const mockApplications = [
    {
      id: 1,
      clientName: 'Sarah Johnson',
      clientEmail: 'sarah.j@email.com',
      type: 'university',
      title: 'Harvard University - Computer Science',
      country: 'USA',
      stage: 'interview',
      consultant: 'Dr. Nishan Timilsina',
      consultantId: 1,
      priority: 'high',
      deadline: '2025-03-15',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-15',
      documents: {
        required: ['transcript', 'sop', 'lor', 'cv'],
        completed: ['transcript', 'sop', 'lor']
      },
      notes: 'Interview scheduled for next week',
      status: 'active'
    },
    {
      id: 2,
      clientName: 'Michael Chen',
      clientEmail: 'michael.c@email.com',
      type: 'visa',
      title: 'US Student Visa Application',
      country: 'USA',
      stage: 'documents',
      consultant: 'Jenish Neupane',
      consultantId: 2,
      priority: 'medium',
      deadline: '2025-02-28',
      createdAt: '2025-01-05',
      updatedAt: '2025-01-12',
      documents: {
        required: ['passport', 'i20', 'financial', 'photo'],
        completed: ['passport', 'photo']
      },
      notes: 'Waiting for I-20 from university',
      status: 'active'
    },
    {
      id: 3,
      clientName: 'Emma Wilson',
      clientEmail: 'emma.w@email.com',
      type: 'university',
      title: 'University of Toronto - MBA',
      country: 'Canada',
      stage: 'submitted',
      consultant: 'Sakura Ghimire',
      consultantId: 3,
      priority: 'high',
      deadline: '2025-04-01',
      createdAt: '2024-12-20',
      updatedAt: '2025-01-08',
      documents: {
        required: ['transcript', 'gmat', 'essays', 'lor'],
        completed: ['transcript', 'gmat', 'essays', 'lor']
      },
      notes: 'Application submitted successfully',
      status: 'active'
    },
    {
      id: 4,
      clientName: 'David Kumar',
      clientEmail: 'david.k@email.com',
      type: 'university',
      title: 'MIT - Electrical Engineering',
      country: 'USA',
      stage: 'initial',
      consultant: 'Dr. Nishan Timilsina',
      consultantId: 1,
      priority: 'medium',
      deadline: '2025-12-01',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15',
      documents: {
        required: ['transcript', 'gre', 'sop', 'lor'],
        completed: []
      },
      notes: 'Initial consultation completed',
      status: 'active'
    },
    {
      id: 5,
      clientName: 'Priya Sharma',
      clientEmail: 'priya.s@email.com',
      type: 'visa',
      title: 'UK Student Visa',
      country: 'UK',
      stage: 'decision',
      consultant: 'Jenish Neupane',
      consultantId: 2,
      priority: 'high',
      deadline: '2025-01-30',
      createdAt: '2024-11-15',
      updatedAt: '2025-01-10',
      documents: {
        required: ['passport', 'cas', 'financial', 'ielts'],
        completed: ['passport', 'cas', 'financial', 'ielts']
      },
      notes: 'Visa approved!',
      status: 'completed'
    }
  ];

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setApplications(mockApplications);
    } catch (error) {
      console.error('Failed to load applications:', error);
      addNotification({
        type: 'error',
        title: 'Load Failed',
        message: 'Failed to load applications',
        category: 'applications'
      });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!newAppForm.clientName.trim()) errors.clientName = 'Client name is required';
    if (!newAppForm.clientEmail.trim()) errors.clientEmail = 'Client email is required';
    if (!newAppForm.title.trim()) errors.title = 'Application title is required';
    if (!newAppForm.country) errors.country = 'Country is required';
    if (!newAppForm.consultant) errors.consultant = 'Consultant is required';
    if (!newAppForm.deadline) errors.deadline = 'Deadline is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newAppForm.clientEmail && !emailRegex.test(newAppForm.clientEmail)) {
      errors.clientEmail = 'Please enter a valid email address';
    }
    
    // Deadline validation (must be in future)
    if (newAppForm.deadline) {
      const selectedDate = new Date(newAppForm.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.deadline = 'Deadline must be in the future';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormChange = (field, value) => {
    setNewAppForm(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Auto-populate documents based on type and country
    if (field === 'type' || field === 'country') {
      const updatedForm = { ...newAppForm, [field]: value };
      if (updatedForm.type && updatedForm.country) {
        const template = getDocumentTemplate(updatedForm.type, updatedForm.country);
        setNewAppForm(prev => ({
          ...prev,
          [field]: value,
          documents: {
            required: template,
            completed: []
          }
        }));
      }
    }
  };

  const getDocumentTemplate = (type, country) => {
    if (type === 'university') {
      return documentTemplates.university.graduate; // Default to graduate
    } else if (type === 'visa') {
      if (['USA', 'Canada'].includes(country)) {
        return documentTemplates.visa.student;
      } else {
        return documentTemplates.visa.student;
      }
    }
    return [];
  };

  const handleSubmitApplication = async () => {
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      const newApplication = {
        id: Date.now(), // In real app, this would come from backend
        ...newAppForm,
        consultantId: parseInt(newAppForm.consultant),
        consultant: consultants.find(c => c.id === parseInt(newAppForm.consultant))?.name || '',
        stage: 'initial',
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0],
        updatedAt: new Date().toISOString().split('T')[0]
      };

      // Add to applications list
      setApplications(prev => [newApplication, ...prev]);
      
      // Reset form
      setNewAppForm({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        type: 'university',
        title: '',
        country: '',
        consultant: '',
        priority: 'medium',
        deadline: '',
        notes: '',
        documents: { required: [], completed: [] }
      });
      
      setShowNewAppModal(false);
      
      addNotification({
        type: 'success',
        title: 'Application Created',
        message: `New application for ${newApplication.clientName} has been created successfully`,
        category: 'applications'
      });
      
    } catch (error) {
      console.error('Failed to create application:', error);
      addNotification({
        type: 'error',
        title: 'Creation Failed',
        message: 'Failed to create new application',
        category: 'applications'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const moveApplication = async (appId, newStage) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === appId 
          ? { ...app, stage: newStage, updatedAt: new Date().toISOString().split('T')[0] }
          : app
      ));

      addNotification({
        type: 'success',
        title: 'Stage Updated',
        message: `Application moved to ${stages.find(s => s.id === newStage)?.name}`,
        category: 'applications'
      });
    } catch (error) {
      console.error('Failed to update stage:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update application stage',
        category: 'applications'
      });
    }
  };

  const filteredApplications = applications.filter(app => {
    if (filters.consultant && app.consultantId !== parseInt(filters.consultant)) return false;
    if (filters.country && app.country !== filters.country) return false;
    if (filters.timeline) {
      const deadline = new Date(app.deadline);
      const now = new Date();
      const daysUntil = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24));
      
      switch (filters.timeline) {
        case 'overdue': if (daysUntil >= 0) return false; break;
        case 'urgent': if (daysUntil > 7 || daysUntil < 0) return false; break;
        case 'this-month': if (daysUntil > 30 || daysUntil < 0) return false; break;
        case 'next-month': if (daysUntil > 60 || daysUntil <= 30) return false; break;
      }
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return app.clientName.toLowerCase().includes(searchTerm) ||
             app.title.toLowerCase().includes(searchTerm) ||
             app.country.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  const getApplicationsByStage = (stageId) => {
    return filteredApplications.filter(app => app.stage === stageId);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const daysUntil = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { status: 'overdue', color: '#ef4444', text: `${Math.abs(daysUntil)} days overdue` };
    if (daysUntil <= 7) return { status: 'urgent', color: '#f59e0b', text: `${daysUntil} days left` };
    if (daysUntil <= 30) return { status: 'soon', color: '#f59e0b', text: `${daysUntil} days left` };
    return { status: 'normal', color: '#10b981', text: `${daysUntil} days left` };
  };

  const getDocumentProgress = (documents) => {
    const total = documents.required.length;
    const completed = documents.completed.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  };

  const getStageActions = (currentStage) => {
    const currentIndex = stages.findIndex(s => s.id === currentStage);
    const actions = [];
    
    if (currentIndex > 0) {
      actions.push({
        type: 'previous',
        stage: stages[currentIndex - 1],
        icon: 'arrow-left'
      });
    }
    
    if (currentIndex < stages.length - 1) {
      actions.push({
        type: 'next',
        stage: stages[currentIndex + 1],
        icon: 'arrow-right'
      });
    }
    
    return actions;
  };

  if (loading) {
    return (
      <div className="pipeline-page">
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .pipeline-page {
          padding: 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
          min-height: calc(100vh - 120px);
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .pipeline-header {
          margin-bottom: 2rem;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
        }

        .pipeline-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.875rem;
          font-weight: 700;
          color: #1e293b;
          letter-spacing: -0.025em;
        }

        .pipeline-subtitle {
          margin: 0 0 1.5rem 0;
          color: #64748b;
          font-size: 1rem;
          line-height: 1.5;
        }

        .pipeline-controls {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .filter-group {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-select, .search-input {
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .search-input {
          min-width: 250px;
        }

        .filter-select:focus, .search-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.25rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #374151;
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }

        .action-button:hover {
          background: #f9fafb;
          transform: translateY(-1px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .action-button--primary {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .action-button--primary:hover {
          background: #2563eb;
        }

        .pipeline-stats {
          display: flex;
          gap: 1.5rem;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e2e8f0;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .stat-item strong {
          color: #1e293b;
          font-weight: 700;
        }

        /* FIXED KANBAN BOARD LAYOUT */
        .kanban-board {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
          flex: 1;
          align-items: start;
          margin-top: 1rem;
          min-height: 600px;
        }

        .kanban-column {
          display: flex;
          flex-direction: column;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          min-height: 500px;
          max-height: 80vh;
          overflow: hidden;
        }

        /* FIXED COLUMN HEADER */
        .column-header {
          padding: 1.25rem 1rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          flex-shrink: 0;
        }

        .column-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 0 0 0.5rem 0;
          font-size: 1rem;
          font-weight: 700;
          color: #1e293b;
          gap: 0.75rem;
        }

        .column-title-left {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          min-width: 0;
          flex: 1;
        }

        .stage-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .column-count {
          background: #e2e8f0;
          color: #64748b;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
          min-width: 1.5rem;
          text-align: center;
          flex-shrink: 0;
        }

        .column-description {
          margin: 0;
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.4;
          font-weight: 500;
        }

        /* FIXED COLUMN BODY */
        .column-body {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          background: #fafbfc;
        }

        /* COMPLETELY REDESIGNED CARDS */
        .application-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          position: relative;
          overflow: hidden;
          min-height: 120px;
          max-width: 100%;
        }

        .application-card:hover {
          border-color: #3b82f6;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }

        /* FIXED CARD HEADER */
        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          gap: 0.5rem;
        }

        .card-header-left {
          min-width: 0;
          flex: 1;
        }

        /* PRIMARY TITLE - MOST IMPORTANT */
        .card-title {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          font-weight: 700;
          color: #1e293b;
          line-height: 1.3;
          /* CRITICAL: Handle text overflow */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        /* SECONDARY INFO */
        .card-client {
          margin: 0;
          font-size: 0.8rem;
          color: #64748b;
          font-weight: 500;
          /* CRITICAL: Handle text overflow */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        /* PRIORITY BADGE - SIMPLIFIED */
        .priority-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          line-height: 1;
        }

        /* SIMPLIFIED META SECTION */
        .card-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.75rem;
          font-size: 0.75rem;
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #64748b;
          font-weight: 500;
          background: #f1f5f9;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          /* CRITICAL: Handle text overflow */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
          min-width: 0;
        }

        .country-flag {
          width: 12px;
          height: 9px;
          border-radius: 2px;
          background: linear-gradient(45deg, #3b82f6, #1d4ed8);
          flex-shrink: 0;
        }

        /* SIMPLIFIED PROGRESS */
        .progress-section {
          margin-bottom: 0.75rem;
        }

        .progress-label {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .progress-bar {
          width: 100%;
          height: 4px;
          background: #e2e8f0;
          border-radius: 2px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: #10b981;
          transition: width 0.3s ease;
        }

        /* SIMPLIFIED NOTES */
        .card-notes {
          margin: 0.5rem 0;
          padding: 0.5rem;
          background: #f8fafc;
          border-radius: 6px;
          font-size: 0.75rem;
          color: #64748b;
          font-style: italic;
          line-height: 1.3;
          /* CRITICAL: Handle text overflow */
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* SIMPLIFIED ACTIONS */
        .card-actions {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e2e8f0;
        }

        .stage-action {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          background: white;
          color: #64748b;
          font-size: 0.7rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.15s ease;
          text-transform: uppercase;
          letter-spacing: 0.025em;
          /* CRITICAL: Prevent text overflow */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        .stage-action:hover {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .stage-action--next {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .stage-action--next:hover {
          background: #2563eb;
        }

        /* DEADLINE BADGE */
        .deadline-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          color: white;
          letter-spacing: 0.025em;
          text-align: center;
          /* CRITICAL: Handle text overflow */
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
        }

        /* EMPTY STATE */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
          color: #94a3b8;
          text-align: center;
          background: #f8fafc;
          border-radius: 6px;
          border: 1px dashed #cbd5e1;
        }

        .empty-state svg {
          opacity: 0.6;
          margin-bottom: 0.5rem;
        }

        .empty-state p {
          margin: 0;
          font-weight: 500;
          font-size: 0.8rem;
        }

        /* LOADING STATE */
        .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          color: #64748b;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .loading-state svg {
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal {
          background: white;
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          margin: 0;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1e293b;
        }

        .modal-close {
          background: none;
          border: none;
          color: #64748b;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 8px;
          transition: all 0.15s ease;
        }

        .modal-close:hover {
          background: #f9fafb;
          color: #1e293b;
        }

        .modal-body {
          padding: 1.5rem;
          overflow-y: auto;
          flex: 1;
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #e2e8f0;
          display: flex;
          gap: 0.75rem;
          justify-content: flex-end;
        }

        .form-grid {
          display: grid;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }

        .form-label--required::after {
          content: ' *';
          color: #ef4444;
        }

        .form-input, .form-select, .form-textarea {
          padding: 0.75rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          font-size: 0.875rem;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        .form-input--error, .form-select--error, .form-textarea--error {
          border-color: #ef4444;
        }

        .form-error {
          font-size: 0.75rem;
          color: #ef4444;
          margin-top: 0.25rem;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .type-selector {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }

        .type-option {
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          background: white;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: center;
        }

        .type-option:hover {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.05);
        }

        .type-option--selected {
          border-color: #3b82f6;
          background: rgba(59, 130, 246, 0.1);
        }

        .type-option__icon {
          margin-bottom: 0.5rem;
          color: #3b82f6;
        }

        .type-option__title {
          margin: 0 0 0.25rem 0;
          font-weight: 500;
          color: #1e293b;
        }

        .type-option__description {
          margin: 0;
          font-size: 0.75rem;
          color: #64748b;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          border: 1px solid #d1d5db;
          border-radius: 8px;
          background: white;
          color: #1e293b;
          font-weight: 500;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.15s ease;
          text-decoration: none;
        }

        .button:hover {
          background: #f9fafb;
          transform: translateY(-1px);
        }

        .button--primary {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .button--primary:hover {
          background: #2563eb;
        }

        .button--secondary {
          background: white;
          border-color: #d1d5db;
          color: #1e293b;
        }

        .button--secondary:hover {
          background: #f9fafb;
        }

        .button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        .button:disabled:hover {
          transform: none;
        }

        /* RESPONSIVE DESIGN - PROPER BREAKPOINTS */
        @media (max-width: 768px) {
          .pipeline-page {
            padding: 1rem;
          }

          .pipeline-header {
            padding: 1.5rem;
            margin-bottom: 1.5rem;
          }

          .pipeline-title {
            font-size: 1.5rem;
          }

          .pipeline-controls {
            flex-direction: column;
            align-items: stretch;
            gap: 0.75rem;
          }
          
          .filter-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.75rem;
            width: 100%;
          }

          .search-input {
            min-width: unset;
            width: 100%;
          }

          .pipeline-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 0.75rem;
          }
          
          /* MOBILE: Single column kanban */
          .kanban-board {
            grid-template-columns: 1fr;
            gap: 1rem;
            margin-top: 1rem;
          }
          
          .kanban-column {
            min-height: 400px;
            max-height: 70vh;
          }

          .column-body {
            max-height: 50vh;
          }

          .card-meta {
            flex-direction: column;
            gap: 0.5rem;
          }

          .card-actions {
            flex-direction: column;
            gap: 0.5rem;
          }

          .stage-action {
            font-size: 0.75rem;
            padding: 0.5rem;
          }

          .modal {
            margin: 0.5rem;
            max-height: 95vh;
          }

          .form-row {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }

        /* TABLET: 2-3 columns */
        @media (min-width: 769px) and (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: repeat(3, 1fr);
            gap: 1rem;
          }

          .pipeline-controls {
            flex-wrap: wrap;
            gap: 0.75rem;
          }

          .filter-group {
            gap: 0.5rem;
          }
        }

        /* LARGE SCREENS: Full 5 columns */
        @media (min-width: 1025px) {
          .kanban-board {
            grid-template-columns: repeat(5, 1fr);
            gap: 1.5rem;
          }
        }

        /* EXTRA LARGE: More spacing */
        @media (min-width: 1400px) {
          .pipeline-page {
            max-width: 1800px;
            padding: 2rem;
          }

          .kanban-board {
            gap: 2rem;
          }
        }

        /* SCROLLBAR STYLING */
        .column-body::-webkit-scrollbar {
          width: 6px;
        }

        .column-body::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 3px;
        }

        .column-body::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }

        .column-body::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        /* ACCESSIBILITY */
        .application-card:focus-within {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        .stage-action:focus {
          outline: 2px solid #3b82f6;
          outline-offset: 2px;
        }

        /* ANIMATIONS */
        .application-card {
          animation: fadeIn 0.2s ease-out;
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
      `}</style>

      <div className="pipeline-page">
        {/* Header */}
        <div className="pipeline-header">
          <h1 className="pipeline-title">Application Pipeline</h1>
          <p className="pipeline-subtitle">
            Track and manage university and visa applications through their lifecycle
          </p>
          
          {/* Controls */}
          <div className="pipeline-controls">
            <div className="filter-group">
              <select
                className="filter-select"
                value={filters.consultant}
                onChange={(e) => setFilters(prev => ({ ...prev, consultant: e.target.value }))}
              >
                <option value="">All Consultants</option>
                {consultants.map(consultant => (
                  <option key={consultant.id} value={consultant.id}>
                    {consultant.name}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={filters.country}
                onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
              >
                <option value="">All Countries</option>
                {countries.map(country => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>

              <select
                className="filter-select"
                value={filters.timeline}
                onChange={(e) => setFilters(prev => ({ ...prev, timeline: e.target.value }))}
              >
                <option value="">All Timelines</option>
                <option value="overdue">Overdue</option>
                <option value="urgent">Urgent (≤ 7 days)</option>
                <option value="this-month">This Month</option>
                <option value="next-month">Next Month</option>
              </select>
            </div>

            <input
              type="text"
              className="search-input"
              placeholder="Search applications..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            />

            <button
              className="action-button action-button--primary"
              onClick={() => setShowNewAppModal(true)}
            >
              <Icon name="plus" size={16} />
              New Application
            </button>
          </div>

          {/* Stats */}
          <div className="pipeline-stats">
            <div className="stat-item">
              <Icon name="file-text" size={16} />
              <span><strong>{filteredApplications.length}</strong> applications</span>
            </div>
            <div className="stat-item">
              <Icon name="clock" size={16} />
              <span>
                <strong>{filteredApplications.filter(app => {
                  const deadline = new Date(app.deadline);
                  const now = new Date();
                  return deadline < now;
                }).length}</strong> overdue
              </span>
            </div>
            <div className="stat-item">
              <Icon name="check-circle" size={16} />
              <span>
                <strong>{filteredApplications.filter(app => app.stage === 'decision').length}</strong> completed
              </span>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="kanban-board">
          {stages.map(stage => (
            <div 
              key={stage.id} 
              className="kanban-column"
              style={{ '--stage-color': stage.color }}
            >
              <div className="column-header">
                <div className="column-title">
                  <div className="column-title-left">
                    <div 
                      className="stage-indicator" 
                      style={{ backgroundColor: stage.color }}
                    />
                    <span>{stage.name}</span>
                  </div>
                  <span className="column-count">
                    {getApplicationsByStage(stage.id).length}
                  </span>
                </div>
                <p className="column-description">{stage.description}</p>
              </div>
              
              <div className="column-body">
                {getApplicationsByStage(stage.id).map(app => {
                  const deadlineStatus = getDeadlineStatus(app.deadline);
                  const documentProgress = getDocumentProgress(app.documents);
                  const stageActions = getStageActions(app.stage);

                  return (
                    <div 
                      key={app.id} 
                      className="application-card"
                      onClick={() => setSelectedApp(app)}
                      style={{ '--priority-color': getPriorityColor(app.priority) }}
                    >
                      <div className="card-header">
                        <div className="card-header-left">
                          <h4 className="card-title" title={app.title}>{app.title}</h4>
                          <p className="card-client" title={app.clientName}>{app.clientName}</p>
                        </div>
                        <div 
                          className="priority-badge"
                          style={{ backgroundColor: getPriorityColor(app.priority) }}
                        >
                          {app.priority}
                        </div>
                      </div>

                      <div className="card-meta">
                        <div className="meta-item" title={app.country}>
                          <div className="country-flag" />
                          <span>{app.country}</span>
                        </div>
                        <div className="meta-item" title={app.consultant}>
                          <Icon name="user" size={12} />
                          <span>{app.consultant}</span>
                        </div>
                        <div className="meta-item">
                          <div 
                            className="deadline-badge"
                            style={{ backgroundColor: deadlineStatus.color }}
                            title={`Deadline: ${app.deadline}`}
                          >
                            {deadlineStatus.text}
                          </div>
                        </div>
                      </div>

                      <div className="progress-section">
                        <div className="progress-label">
                          <span>Documents</span>
                          <span>{documentProgress.completed}/{documentProgress.total}</span>
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill"
                            style={{ width: `${documentProgress.percentage}%` }}
                          />
                        </div>
                      </div>

                      {app.notes && (
                        <div className="card-notes" title={app.notes}>
                          {app.notes}
                        </div>
                      )}

                      <div className="card-actions">
                        {stageActions.map(action => (
                          <button
                            key={action.type}
                            className={`stage-action ${action.type === 'next' ? 'stage-action--next' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveApplication(app.id, action.stage.id);
                            }}
                            title={`Move to ${action.stage.name}`}
                          >
                            <Icon name={action.icon} size={12} />
                            {action.stage.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}

                {getApplicationsByStage(stage.id).length === 0 && (
                  <div className="empty-state">
                    <Icon name="inbox" size={32} style={{ opacity: 0.5, marginBottom: '8px' }} />
                    <p>No applications in {stage.name.toLowerCase()}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* New Application Modal */}
        {showNewAppModal && (
          <div className="modal-overlay" onClick={() => setShowNewAppModal(false)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3 className="modal-title">Create New Application</h3>
                <button 
                  className="modal-close"
                  onClick={() => setShowNewAppModal(false)}
                >
                  <Icon name="x-mark" size={20} />
                </button>
              </div>

              <div className="modal-body">
                <div className="form-grid">
                  {/* Application Type */}
                  <div className="form-group">
                    <label className="form-label form-label--required">Application Type</label>
                    <div className="type-selector">
                      <div 
                        className={`type-option ${newAppForm.type === 'university' ? 'type-option--selected' : ''}`}
                        onClick={() => handleFormChange('type', 'university')}
                      >
                        <div className="type-option__icon">
                          <Icon name="academic-cap" size={24} />
                        </div>
                        <h4 className="type-option__title">University</h4>
                        <p className="type-option__description">University admission application</p>
                      </div>
                      <div 
                        className={`type-option ${newAppForm.type === 'visa' ? 'type-option--selected' : ''}`}
                        onClick={() => handleFormChange('type', 'visa')}
                      >
                        <div className="type-option__icon">
                          <Icon name="identification" size={24} />
                        </div>
                        <h4 className="type-option__title">Visa</h4>
                        <p className="type-option__description">Student or tourist visa application</p>
                      </div>
                    </div>
                  </div>

                  {/* Client Information */}
                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label form-label--required">Client Name</label>
                      <input
                        type="text"
                        className={`form-input ${formErrors.clientName ? 'form-input--error' : ''}`}
                        value={newAppForm.clientName}
                        onChange={(e) => handleFormChange('clientName', e.target.value)}
                        placeholder="Enter client full name"
                      />
                      {formErrors.clientName && <div className="form-error">{formErrors.clientName}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label--required">Client Email</label>
                      <input
                        type="email"
                        className={`form-input ${formErrors.clientEmail ? 'form-input--error' : ''}`}
                        value={newAppForm.clientEmail}
                        onChange={(e) => handleFormChange('clientEmail', e.target.value)}
                        placeholder="client@email.com"
                      />
                      {formErrors.clientEmail && <div className="form-error">{formErrors.clientEmail}</div>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Client Phone</label>
                    <input
                      type="tel"
                      className="form-input"
                      value={newAppForm.clientPhone}
                      onChange={(e) => handleFormChange('clientPhone', e.target.value)}
                      placeholder="+977-98XXXXXXXX"
                    />
                  </div>

                  {/* Application Details */}
                  <div className="form-group">
                    <label className="form-label form-label--required">Application Title</label>
                    <input
                      type="text"
                      className={`form-input ${formErrors.title ? 'form-input--error' : ''}`}
                      value={newAppForm.title}
                      onChange={(e) => handleFormChange('title', e.target.value)}
                      placeholder={newAppForm.type === 'university' ? 'e.g., Harvard University - Computer Science' : 'e.g., US Student Visa Application'}
                    />
                    {formErrors.title && <div className="form-error">{formErrors.title}</div>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label form-label--required">Country</label>
                      <select
                        className={`form-select ${formErrors.country ? 'form-select--error' : ''}`}
                        value={newAppForm.country}
                        onChange={(e) => handleFormChange('country', e.target.value)}
                      >
                        <option value="">Select Country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                      {formErrors.country && <div className="form-error">{formErrors.country}</div>}
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label--required">Consultant</label>
                      <select
                        className={`form-select ${formErrors.consultant ? 'form-select--error' : ''}`}
                        value={newAppForm.consultant}
                        onChange={(e) => handleFormChange('consultant', e.target.value)}
                      >
                        <option value="">Select Consultant</option>
                        {consultants.map(consultant => (
                          <option key={consultant.id} value={consultant.id}>
                            {consultant.name} - {consultant.specializations.join(', ')}
                          </option>
                        ))}
                      </select>
                      {formErrors.consultant && <div className="form-error">{formErrors.consultant}</div>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={newAppForm.priority}
                        onChange={(e) => handleFormChange('priority', e.target.value)}
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label form-label--required">Deadline</label>
                      <input
                        type="date"
                        className={`form-input ${formErrors.deadline ? 'form-input--error' : ''}`}
                        value={newAppForm.deadline}
                        onChange={(e) => handleFormChange('deadline', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                      />
                      {formErrors.deadline && <div className="form-error">{formErrors.deadline}</div>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="form-group">
                    <label className="form-label">Initial Notes</label>
                    <textarea
                      className="form-textarea"
                      value={newAppForm.notes}
                      onChange={(e) => handleFormChange('notes', e.target.value)}
                      placeholder="Add any initial notes or special requirements..."
                      rows={3}
                    />
                  </div>

                  {/* Document Preview */}
                  {newAppForm.documents.required.length > 0 && (
                    <div className="form-group">
                      <label className="form-label">Required Documents</label>
                      <div style={{ 
                        background: '#f8fafc', 
                        padding: '0.75rem', 
                        borderRadius: '8px',
                        fontSize: '0.875rem'
                      }}>
                        <p style={{ margin: '0 0 0.5rem 0', fontWeight: '500' }}>
                          The following documents will be required:
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {newAppForm.documents.required.map(doc => (
                            <span 
                              key={doc} 
                              style={{
                                background: 'white',
                                padding: '0.25rem 0.5rem',
                                borderRadius: '6px',
                                border: '1px solid #e2e8f0',
                                fontSize: '0.75rem'
                              }}
                            >
                              {doc.replace('_', ' ').toUpperCase()}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button 
                  className="button button--secondary"
                  onClick={() => setShowNewAppModal(false)}
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button 
                  className="button button--primary"
                  onClick={handleSubmitApplication}
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <Icon name="clock" size={16} />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Icon name="plus" size={16} />
                      Create Application
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}