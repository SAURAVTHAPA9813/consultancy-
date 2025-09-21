import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import Icon from '@/components/Icon.jsx';

export default function VisaApplications() {
  const { user, branch } = useAuth();
  const { addNotification } = useNotifications();
  
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    country: 'all',
    visaType: 'all',
    appointment: 'all',
    search: ''
  });

  // Country-specific document requirements
  const documentRequirements = {
    'USA': {
      'tourist': ['passport', 'photo', 'ds160', 'financial_proof', 'travel_itinerary', 'employment_letter'],
      'student': ['passport', 'photo', 'ds160', 'i20', 'sevis_fee', 'financial_proof', 'academic_documents', 'english_proficiency'],
      'business': ['passport', 'photo', 'ds160', 'invitation_letter', 'company_documents', 'financial_proof', 'travel_purpose']
    },
    'Canada': {
      'tourist': ['passport', 'photo', 'application_form', 'financial_proof', 'travel_purpose', 'ties_to_home'],
      'student': ['passport', 'photo', 'study_permit_app', 'letter_of_acceptance', 'financial_proof', 'medical_exam', 'police_clearance'],
      'work': ['passport', 'photo', 'work_permit_app', 'job_offer', 'lmia', 'financial_proof', 'medical_exam']
    },
    'UK': {
      'tourist': ['passport', 'photo', 'application_form', 'financial_proof', 'accommodation_proof', 'travel_itinerary'],
      'student': ['passport', 'photo', 'cas', 'financial_proof', 'english_proficiency', 'academic_documents', 'tuberculosis_test'],
      'work': ['passport', 'photo', 'cos', 'financial_proof', 'english_proficiency', 'skill_assessment']
    },
    'Australia': {
      'tourist': ['passport', 'photo', 'application_form', 'financial_proof', 'health_insurance', 'character_documents'],
      'student': ['passport', 'photo', 'coe', 'financial_proof', 'english_proficiency', 'health_insurance', 'academic_documents'],
      'work': ['passport', 'photo', 'job_offer', 'skill_assessment', 'english_proficiency', 'health_insurance', 'character_documents']
    },
    'Germany': {
      'tourist': ['passport', 'photo', 'application_form', 'travel_insurance', 'financial_proof', 'accommodation_proof'],
      'student': ['passport', 'photo', 'admission_letter', 'financial_proof', 'german_proficiency', 'academic_documents', 'health_insurance'],
      'work': ['passport', 'photo', 'job_offer', 'qualification_recognition', 'german_proficiency', 'health_insurance']
    }
  };

  // Mock visa applications data
  const mockApplications = [
    {
      id: 1,
      applicantName: 'Raj Patel',
      applicantEmail: 'raj.p@email.com',
      country: 'USA',
      visaType: 'student',
      purpose: 'Master\'s degree studies',
      status: 'appointment-scheduled',
      submissionDate: '2025-01-15',
      consultant: 'Dr. Nishan Timilsina',
      embassy: 'US Embassy, Kathmandu',
      appointmentDate: '2025-02-10',
      appointmentTime: '10:30 AM',
      appointmentConfirmation: 'KTM2025021001',
      expectedDecision: '2025-02-25',
      documents: {
        passport: { completed: true, uploadedDate: '2025-01-10', notes: 'Valid until 2030', verified: true },
        photo: { completed: true, uploadedDate: '2025-01-10', notes: 'US visa photo specs', verified: true },
        ds160: { completed: true, uploadedDate: '2025-01-12', notes: 'Confirmation number: KTM2025123456', verified: true },
        i20: { completed: true, uploadedDate: '2025-01-08', notes: 'From Stanford University', verified: true },
        sevis_fee: { completed: true, uploadedDate: '2025-01-14', notes: 'Receipt number: 1234567890123', verified: true },
        financial_proof: { completed: true, uploadedDate: '2025-01-13', notes: 'Bank statements + sponsor letter', verified: false },
        academic_documents: { completed: true, uploadedDate: '2025-01-11', notes: 'Transcripts and certificates', verified: true },
        english_proficiency: { completed: true, uploadedDate: '2025-01-09', notes: 'TOEFL Score: 110', verified: true }
      },
      statusHistory: [
        { date: '2025-01-08', status: 'started', note: 'Visa application process initiated' },
        { date: '2025-01-12', status: 'documents-collection', note: 'Collecting required documents' },
        { date: '2025-01-15', status: 'documents-submitted', note: 'All documents submitted for review' },
        { date: '2025-01-18', status: 'appointment-scheduled', note: 'Embassy appointment confirmed for Feb 10' }
      ],
      visaFee: 185,
      feePaid: true,
      priority: 'high',
      notes: 'Stanford University student visa - all documents ready for interview'
    },
    {
      id: 2,
      applicantName: 'Priya Sharma',
      applicantEmail: 'priya.s@email.com',
      country: 'Canada',
      visaType: 'student',
      purpose: 'Bachelor\'s degree in Engineering',
      status: 'documents-review',
      submissionDate: '2025-01-20',
      consultant: 'Jenish Neupane',
      embassy: 'VFS Global, Kathmandu',
      appointmentDate: null,
      appointmentTime: null,
      appointmentConfirmation: null,
      expectedDecision: '2025-03-05',
      documents: {
        passport: { completed: true, uploadedDate: '2025-01-15', notes: 'Valid until 2029', verified: true },
        photo: { completed: true, uploadedDate: '2025-01-15', notes: 'Canadian visa photo specs', verified: true },
        study_permit_app: { completed: true, uploadedDate: '2025-01-18', notes: 'Online application submitted', verified: true },
        letter_of_acceptance: { completed: true, uploadedDate: '2025-01-12', notes: 'University of Toronto', verified: true },
        financial_proof: { completed: true, uploadedDate: '2025-01-19', notes: 'GIC + family funds', verified: false },
        medical_exam: { completed: false, uploadedDate: null, notes: 'Scheduled for Jan 28', verified: false },
        police_clearance: { completed: false, uploadedDate: null, notes: 'Applied to police department', verified: false }
      },
      statusHistory: [
        { date: '2025-01-12', status: 'started', note: 'Student visa application initiated' },
        { date: '2025-01-18', status: 'documents-collection', note: 'Gathering required documents' },
        { date: '2025-01-20', status: 'documents-review', note: 'Documents under embassy review' }
      ],
      visaFee: 150,
      feePaid: true,
      priority: 'medium',
      notes: 'Waiting for medical exam and police clearance completion'
    },
    {
      id: 3,
      applicantName: 'Amit Lama',
      applicantEmail: 'amit.l@email.com',
      country: 'Australia',
      visaType: 'tourist',
      purpose: 'Holiday vacation',
      status: 'approved',
      submissionDate: '2025-01-05',
      consultant: 'Sakura Ghimire',
      embassy: 'Australian Visa Application Centre',
      appointmentDate: '2025-01-25',
      appointmentTime: '2:00 PM',
      appointmentConfirmation: 'AVAC202501250001',
      expectedDecision: '2025-02-10',
      decisionDate: '2025-01-28',
      visaNumber: 'AUS2025123456',
      documents: {
        passport: { completed: true, uploadedDate: '2025-01-02', notes: 'Valid until 2028', verified: true },
        photo: { completed: true, uploadedDate: '2025-01-02', notes: 'Passport size photo', verified: true },
        application_form: { completed: true, uploadedDate: '2025-01-03', notes: 'Form 1419 completed', verified: true },
        financial_proof: { completed: true, uploadedDate: '2025-01-04', notes: 'Bank statements last 6 months', verified: true },
        health_insurance: { completed: true, uploadedDate: '2025-01-04', notes: 'Travel insurance policy', verified: true },
        character_documents: { completed: true, uploadedDate: '2025-01-05', notes: 'Police clearance certificate', verified: true }
      },
      statusHistory: [
        { date: '2025-01-02', status: 'started', note: 'Tourist visa application started' },
        { date: '2025-01-05', status: 'documents-submitted', note: 'All documents submitted' },
        { date: '2025-01-10', status: 'under-review', note: 'Application under processing' },
        { date: '2025-01-28', status: 'approved', note: 'Tourist visa approved - 3 months validity' }
      ],
      visaFee: 145,
      feePaid: true,
      priority: 'low',
      notes: 'Approved! Tourist visa valid for 3 months'
    },
    {
      id: 4,
      applicantName: 'Sita Gurung',
      applicantEmail: 'sita.g@email.com',
      country: 'UK',
      visaType: 'student',
      purpose: 'PhD in Computer Science',
      status: 'documents-pending',
      submissionDate: null,
      consultant: 'Jenish Neupane',
      embassy: 'UK Visa Application Centre',
      appointmentDate: null,
      appointmentTime: null,
      appointmentConfirmation: null,
      expectedDecision: null,
      documents: {
        passport: { completed: true, uploadedDate: '2025-01-20', notes: 'Valid until 2030', verified: true },
        photo: { completed: true, uploadedDate: '2025-01-20', notes: 'UK visa photo specs', verified: true },
        cas: { completed: true, uploadedDate: '2025-01-18', notes: 'CAS from Oxford University', verified: true },
        financial_proof: { completed: false, uploadedDate: null, notes: 'Bank statements in progress', verified: false },
        english_proficiency: { completed: true, uploadedDate: '2025-01-15', notes: 'IELTS Score: 8.0', verified: true },
        academic_documents: { completed: false, uploadedDate: null, notes: 'Degree verification pending', verified: false },
        tuberculosis_test: { completed: false, uploadedDate: null, notes: 'Test scheduled for Jan 30', verified: false }
      },
      statusHistory: [
        { date: '2025-01-15', status: 'consultation', note: 'Initial consultation completed' },
        { date: '2025-01-18', status: 'documents-pending', note: 'Collecting remaining documents' }
      ],
      visaFee: 363,
      feePaid: false,
      priority: 'medium',
      notes: 'PhD visa application - several documents still pending'
    },
    {
      id: 5,
      applicantName: 'Kumar Thapa',
      applicantEmail: 'kumar.t@email.com',
      country: 'Germany',
      visaType: 'work',
      purpose: 'Software Engineer position',
      status: 'rejected',
      submissionDate: '2024-12-15',
      consultant: 'Dr. Nishan Timilsina',
      embassy: 'German Embassy, New Delhi',
      appointmentDate: '2025-01-10',
      appointmentTime: '11:00 AM',
      appointmentConfirmation: 'GER202501100002',
      expectedDecision: '2025-01-25',
      decisionDate: '2025-01-22',
      rejectionReason: 'Insufficient German language proficiency',
      documents: {
        passport: { completed: true, uploadedDate: '2024-12-10', notes: 'Valid until 2029', verified: true },
        photo: { completed: true, uploadedDate: '2024-12-10', notes: 'Biometric photo', verified: true },
        job_offer: { completed: true, uploadedDate: '2024-12-12', notes: 'Contract from BMW Group', verified: true },
        qualification_recognition: { completed: true, uploadedDate: '2024-12-14', notes: 'Anabin recognition', verified: true },
        german_proficiency: { completed: true, uploadedDate: '2024-12-13', notes: 'A2 level certificate', verified: false },
        health_insurance: { completed: true, uploadedDate: '2024-12-15', notes: 'TK insurance confirmation', verified: true }
      },
      statusHistory: [
        { date: '2024-12-10', status: 'started', note: 'Work visa application initiated' },
        { date: '2024-12-15', status: 'documents-submitted', note: 'Application submitted to embassy' },
        { date: '2025-01-10', status: 'interview-completed', note: 'Embassy interview completed' },
        { date: '2025-01-22', status: 'rejected', note: 'Visa rejected - insufficient German proficiency' }
      ],
      visaFee: 75,
      feePaid: true,
      priority: 'high',
      notes: 'REJECTED: Need to improve German to B1 level and reapply'
    }
  ];

  const statusConfig = {
    'consultation': { label: 'Consultation', color: 'var(--text-secondary)', bgColor: 'var(--glass-bg-light)' },
    'documents-pending': { label: 'Documents Pending', color: 'var(--warning)', bgColor: 'rgba(245, 158, 11, 0.1)' },
    'documents-collection': { label: 'Collecting Documents', color: 'var(--warning)', bgColor: 'rgba(245, 158, 11, 0.1)' },
    'documents-review': { label: 'Documents Review', color: 'var(--info)', bgColor: 'rgba(6, 182, 212, 0.1)' },
    'documents-submitted': { label: 'Documents Submitted', color: 'var(--info)', bgColor: 'rgba(6, 182, 212, 0.1)' },
    'appointment-scheduled': { label: 'Appointment Scheduled', color: 'var(--secondary)', bgColor: 'rgba(139, 92, 246, 0.1)' },
    'interview-completed': { label: 'Interview Completed', color: 'var(--primary)', bgColor: 'rgba(99, 102, 241, 0.1)' },
    'under-review': { label: 'Under Review', color: 'var(--primary)', bgColor: 'rgba(99, 102, 241, 0.1)' },
    'approved': { label: 'Approved', color: 'var(--success)', bgColor: 'rgba(16, 185, 129, 0.1)' },
    'rejected': { label: 'Rejected', color: 'var(--danger)', bgColor: 'rgba(239, 68, 68, 0.1)' }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);
      setApplications(mockApplications);
    } catch (error) {
      console.error('Failed to load visa applications:', error);
      addNotification({
        type: 'error',
        title: 'Load Failed',
        message: 'Failed to load visa applications',
        category: 'visas'
      });
    } finally {
      setLoading(false);
    }
  };

  const scheduleAppointment = async (appId, appointmentData) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === appId 
          ? {
              ...app,
              appointmentDate: appointmentData.date,
              appointmentTime: appointmentData.time,
              appointmentConfirmation: appointmentData.confirmation,
              status: 'appointment-scheduled',
              statusHistory: [
                ...app.statusHistory,
                {
                  date: new Date().toISOString().split('T')[0],
                  status: 'appointment-scheduled',
                  note: `Embassy appointment scheduled for ${appointmentData.date} at ${appointmentData.time}`
                }
              ]
            }
          : app
      ));

      setShowAppointmentModal(false);
      setSelectedAppointment(null);

      addNotification({
        type: 'success',
        title: 'Appointment Scheduled',
        message: `Embassy appointment confirmed for ${appointmentData.date}`,
        category: 'visas'
      });
    } catch (error) {
      console.error('Failed to schedule appointment:', error);
      addNotification({
        type: 'error',
        title: 'Scheduling Failed',
        message: 'Failed to schedule embassy appointment',
        category: 'visas'
      });
    }
  };

  const updateDocumentStatus = async (appId, docKey, updates) => {
    try {
      setApplications(prev => prev.map(app => 
        app.id === appId 
          ? {
              ...app,
              documents: {
                ...app.documents,
                [docKey]: { ...app.documents[docKey], ...updates }
              }
            }
          : app
      ));

      addNotification({
        type: 'success',
        title: 'Document Updated',
        message: `Document ${docKey} has been updated`,
        category: 'visas'
      });
    } catch (error) {
      console.error('Failed to update document:', error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update document status',
        category: 'visas'
      });
    }
  };

  const getDocumentProgress = (documents) => {
    const total = Object.keys(documents).length;
    const completed = Object.values(documents).filter(doc => doc.completed).length;
    const verified = Object.values(documents).filter(doc => doc.verified).length;
    return { 
      completed, 
      total, 
      verified,
      completedPercentage: total > 0 ? (completed / total) * 100 : 0,
      verifiedPercentage: total > 0 ? (verified / total) * 100 : 0
    };
  };

  const getAppointmentStatus = (app) => {
    if (!app.appointmentDate) return { status: 'none', text: 'Not scheduled', color: 'var(--text-muted)' };
    
    const appointmentDate = new Date(app.appointmentDate);
    const now = new Date();
    const daysUntil = Math.ceil((appointmentDate - now) / (1000 * 60 * 60 * 24));
    
    if (daysUntil < 0) return { status: 'past', text: 'Interview completed', color: 'var(--success)' };
    if (daysUntil === 0) return { status: 'today', text: 'Today!', color: 'var(--danger)' };
    if (daysUntil <= 7) return { status: 'soon', text: `${daysUntil} days`, color: 'var(--warning)' };
    return { status: 'scheduled', text: `${daysUntil} days`, color: 'var(--info)' };
  };

  const filteredApplications = applications.filter(app => {
    if (filters.status !== 'all' && app.status !== filters.status) return false;
    if (filters.country !== 'all' && app.country !== filters.country) return false;
    if (filters.visaType !== 'all' && app.visaType !== filters.visaType) return false;
    if (filters.appointment !== 'all') {
      const appointmentStatus = getAppointmentStatus(app);
      if (filters.appointment === 'scheduled' && appointmentStatus.status === 'none') return false;
      if (filters.appointment === 'today' && appointmentStatus.status !== 'today') return false;
      if (filters.appointment === 'upcoming' && !['today', 'soon'].includes(appointmentStatus.status)) return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return app.applicantName.toLowerCase().includes(searchTerm) ||
             app.country.toLowerCase().includes(searchTerm) ||
             app.visaType.toLowerCase().includes(searchTerm) ||
             app.purpose.toLowerCase().includes(searchTerm);
    }
    return true;
  });

  const countries = [...new Set(applications.map(app => app.country))];
  const visaTypes = [...new Set(applications.map(app => app.visaType))];

  if (loading) {
    return (
      <div className="visa-apps-page">
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading visa applications...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{`
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
          --text: #e2e8f0;
          --text-secondary: #94a3b8;
          --text-muted: #64748b;
          --border: rgba(148, 163, 184, 0.1);
          --glass-border: rgba(148, 163, 184, 0.15);
          --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
          --shadow-glow: 0 0 40px rgba(99, 102, 241, 0.3);
        }

        .visa-apps-page {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
          color: var(--text);
        }

        .visa-apps-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%),
                      radial-gradient(circle at 80% 70%, var(--secondary) 0%, transparent 50%);
          opacity: 0.1;
          animation: float 20s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(-10px, -10px) rotate(1deg); }
          50% { transform: translate(10px, -5px) rotate(-1deg); }
          75% { transform: translate(-5px, 10px) rotate(1deg); }
        }

        .visa-apps-page > * {
          position: relative;
          z-index: 1;
        }

        .visa-apps-container {
          padding: 1.5rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        .page-header {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 16px;
          box-shadow: var(--shadow-card);
          border: 1px solid var(--glass-border);
          margin-bottom: 2rem;
        }

        .page-title {
          margin: 0 0 0.5rem 0;
          font-size: 2.5rem;
          font-weight: 700;
          background: linear-gradient(135deg, var(--primary-light), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.025em;
        }

        .page-subtitle {
          margin: 0 0 1.5rem 0;
          color: var(--text-secondary);
          font-size: 1.1rem;
          line-height: 1.6;
        }

        .controls-section {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .filters-group {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filter-select, .search-input {
          padding: 0.875rem 1.25rem;
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          color: var(--text);
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .search-input {
          min-width: 280px;
        }

        .filter-select:focus, .search-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2), 0 8px 32px rgba(0, 0, 0, 0.3);
          transform: translateY(-2px);
        }

        .filter-select option {
          background: var(--dark-secondary);
          color: var(--text);
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          color: var(--text);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .action-button:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
          border-color: var(--primary);
        }

        .action-button--primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-color: var(--primary);
          color: white;
        }

        .action-button--primary:hover {
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
        }

        .stats-overview {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }

        .stat-number {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary-light), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
        }

        .stat-label {
          font-size: 0.875rem;
          color: var(--text-secondary);
          margin: 0;
          font-weight: 500;
        }

        .applications-container {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-card);
          overflow: hidden;
        }

        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(440px, 1fr));
          gap: 1.5rem;
          padding: 2rem;
        }

        .visa-card {
          background: var(--glass-bg-light);
          backdrop-filter: blur(15px);
          border: 1px solid var(--glass-border);
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .visa-card:hover {
          border-color: var(--primary);
          box-shadow: var(--shadow-glow);
          transform: translateY(-6px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.25rem;
          gap: 1rem;
        }

        .card-title {
          margin: 0 0 0.5rem 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text);
          line-height: 1.3;
        }

        .card-subtitle {
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
          color: var(--text-secondary);
          font-weight: 500;
        }

        .card-applicant {
          margin: 0;
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .appointment-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.25rem;
          padding: 1rem;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }

        .appointment-info {
          flex: 1;
        }

        .appointment-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 600;
          margin: 0 0 0.25rem 0;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .appointment-details {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--text);
          margin: 0;
        }

        .appointment-status {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .schedule-btn {
          padding: 0.625rem 1.25rem;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          backdrop-filter: blur(10px);
        }

        .schedule-btn:hover {
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }

        .dual-progress-section {
          margin-bottom: 1.25rem;
        }

        .progress-item {
          margin-bottom: 1rem;
        }

        .progress-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .progress-label {
          font-size: 0.8rem;
          color: var(--text-secondary);
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .progress-count {
          font-size: 0.75rem;
          color: var(--text-muted);
          font-weight: 700;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(148, 163, 184, 0.2);
          border-radius: 3px;
          overflow: hidden;
          backdrop-filter: blur(5px);
        }

        .progress-fill {
          height: 100%;
          transition: width 0.6s ease;
          border-radius: 3px;
        }

        .progress-fill--completed {
          background: linear-gradient(90deg, var(--info), var(--primary));
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }

        .progress-fill--verified {
          background: linear-gradient(90deg, var(--success), #059669);
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .card-meta {
          display: flex;
          gap: 1rem;
          margin-top: 1.25rem;
          padding-top: 1.25rem;
          border-top: 1px solid var(--glass-border);
          font-size: 0.8rem;
          color: var(--text-muted);
          flex-wrap: wrap;
        }

        .meta-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
          font-weight: 500;
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          border: 1px solid var(--glass-border);
          width: 100%;
          max-width: 900px;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 2rem;
          border-bottom: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
        }

        .modal-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          color: var(--text);
        }

        .modal-close {
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          border: 1px solid var(--glass-border);
          color: var(--text-secondary);
          cursor: pointer;
          padding: 0.75rem;
          border-radius: 12px;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          background: var(--glass-bg);
          color: var(--text);
          transform: translateY(-2px);
        }

        .modal-body {
          padding: 2rem;
          overflow-y: auto;
          flex: 1;
        }

        .modal-section {
          margin-bottom: 2.5rem;
        }

        .modal-section-title {
          margin: 0 0 1.5rem 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .modal-section-title::before {
          content: '';
          width: 4px;
          height: 20px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 2px;
        }

        .documents-grid {
          display: grid;
          gap: 1rem;
        }

        .document-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }

        .document-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .document-left {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .document-status {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .status-icon {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .status-icon--completed {
          background: linear-gradient(135deg, var(--info), var(--primary));
          color: white;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
        }

        .status-icon--verified {
          background: linear-gradient(135deg, var(--success), #059669);
          color: white;
          box-shadow: 0 0 10px rgba(16, 185, 129, 0.5);
        }

        .status-icon--pending {
          background: linear-gradient(135deg, var(--warning), #f59e0b);
          color: white;
          box-shadow: 0 0 10px rgba(245, 158, 11, 0.5);
        }

        .document-info {
          flex: 1;
        }

        .document-name {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem 0;
          text-transform: capitalize;
        }

        .document-notes {
          font-size: 0.8rem;
          color: var(--text-secondary);
          margin: 0;
        }

        .document-date {
          font-size: 0.75rem;
          color: var(--text-muted);
          text-align: right;
        }

        .appointment-modal-body {
          padding: 2rem;
        }

        .appointment-form {
          display: grid;
          gap: 2rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .form-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: var(--text);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .form-input, .form-select {
          padding: 1rem;
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          color: var(--text);
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .form-input:focus, .form-select:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.2);
          transform: translateY(-2px);
        }

        .form-select option {
          background: var(--dark-secondary);
          color: var(--text);
        }

        .embassy-info {
          padding: 1.5rem;
          background: var(--glass-bg);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          border: 1px solid var(--glass-border);
          border-radius: 12px;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          color: var(--text);
          font-weight: 600;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .button:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .button--primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-color: var(--primary);
          color: white;
        }

        .button--primary:hover {
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
          box-shadow: var(--shadow-glow);
        }

        .button--secondary {
          background: var(--glass-bg);
          border-color: var(--glass-border);
          color: var(--text);
        }

        .empty-state, .loading-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 2rem;
          color: var(--text-secondary);
          text-align: center;
        }

        .loading-state svg {
          animation: spin 1s linear infinite;
          margin-bottom: 1rem;
          color: var(--primary);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Responsive */
        @media (max-width: 768px) {
          .visa-apps-container {
            padding: 1rem;
          }

          .page-header {
            padding: 1.5rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .controls-section {
            flex-direction: column;
            align-items: stretch;
          }

          .filters-group {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 0.75rem;
          }

          .search-input {
            min-width: unset;
          }

          .applications-grid {
            grid-template-columns: 1fr;
            padding: 1.5rem;
          }

          .stats-overview {
            grid-template-columns: repeat(2, 1fr);
          }

          .card-meta {
            flex-direction: column;
            gap: 0.75rem;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .modal {
            margin: 0.5rem;
            max-height: 95vh;
          }
        }
      `}</style>

      <div className="visa-apps-page">
        <div className="visa-apps-container">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">Visa Applications</h1>
            <p className="page-subtitle">
              Track visa application progress, embassy appointments, and document requirements by country with real-time updates and intelligent workflow management
            </p>
            
            {/* Controls */}
            <div className="controls-section">
              <div className="filters-group">
                <select
                  className="filter-select"
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="all">All Statuses</option>
                  {Object.keys(statusConfig).map(status => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-select"
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
                  className="filter-select"
                  value={filters.visaType}
                  onChange={(e) => setFilters(prev => ({ ...prev, visaType: e.target.value }))}
                >
                  <option value="all">All Visa Types</option>
                  {visaTypes.map(type => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  className="filter-select"
                  value={filters.appointment}
                  onChange={(e) => setFilters(prev => ({ ...prev, appointment: e.target.value }))}
                >
                  <option value="all">All Appointments</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="today">Today</option>
                  <option value="upcoming">Upcoming (≤7 days)</option>
                </select>

                <input
                  type="text"
                  className="search-input"
                  placeholder="Search applications..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
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
              <h3 className="stat-number">
                {applications.filter(app => app.appointmentDate).length}
              </h3>
              <p className="stat-label">Appointments Scheduled</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">
                {applications.filter(app => app.status === 'approved').length}
              </h3>
              <p className="stat-label">Approved</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-number">
                {applications.filter(app => {
                  const appointmentStatus = getAppointmentStatus(app);
                  return appointmentStatus.status === 'today' || appointmentStatus.status === 'soon';
                }).length}
              </h3>
              <p className="stat-label">Upcoming Interviews</p>
            </div>
          </div>

          {/* Visa Applications */}
          <div className="applications-container">
            {filteredApplications.length > 0 ? (
              <div className="applications-grid">
                {filteredApplications.map(app => {
                  const progress = getDocumentProgress(app.documents);
                  const statusInfo = statusConfig[app.status];
                  const appointmentStatus = getAppointmentStatus(app);

                  return (
                    <div 
                      key={app.id}
                      className="visa-card"
                      onClick={() => setSelectedApp(app)}
                    >
                      <div className="card-header">
                        <div>
                          <h3 className="card-title">{app.country} {app.visaType.charAt(0).toUpperCase() + app.visaType.slice(1)} Visa</h3>
                          <p className="card-subtitle">{app.purpose}</p>
                          <p className="card-applicant">{app.applicantName}</p>
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

                      <div className="appointment-section">
                        <div className="appointment-info">
                          <p className="appointment-label">Embassy Appointment</p>
                          {app.appointmentDate ? (
                            <p className="appointment-details">
                              {new Date(app.appointmentDate).toLocaleDateString()} at {app.appointmentTime}
                            </p>
                          ) : (
                            <p className="appointment-details">Not scheduled</p>
                          )}
                        </div>
                        <div className="appointment-status" style={{ color: appointmentStatus.color }}>
                          <Icon name="clock" size={14} />
                          {appointmentStatus.text}
                        </div>
                        {!app.appointmentDate && app.status !== 'approved' && app.status !== 'rejected' && (
                          <button 
                            className="schedule-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppointment(app);
                              setShowAppointmentModal(true);
                            }}
                          >
                            Schedule
                          </button>
                        )}
                      </div>

                      <div className="dual-progress-section">
                        <div className="progress-item">
                          <div className="progress-header">
                            <span className="progress-label">Documents Collected</span>
                            <span className="progress-count">
                              {progress.completed}/{progress.total}
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill progress-fill--completed"
                              style={{ width: `${progress.completedPercentage}%` }}
                            />
                          </div>
                        </div>
                        <div className="progress-item">
                          <div className="progress-header">
                            <span className="progress-label">Documents Verified</span>
                            <span className="progress-count">
                              {progress.verified}/{progress.total}
                            </span>
                          </div>
                          <div className="progress-bar">
                            <div 
                              className="progress-fill progress-fill--verified"
                              style={{ width: `${progress.verifiedPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="card-meta">
                        <div className="meta-item">
                          <Icon name="user" size={14} />
                          <span>{app.consultant}</span>
                        </div>
                        <div className="meta-item">
                          <Icon name="building-office" size={14} />
                          <span>{app.embassy}</span>
                        </div>
                        <div className="meta-item">
                          <Icon name="currency-dollar" size={14} />
                          <span>${app.visaFee} {app.feePaid ? '(Paid)' : '(Pending)'}</span>
                        </div>
                        {app.status === 'approved' && (
                          <div className="meta-item">
                            <Icon name="check-circle" size={14} />
                            <span>Visa: {app.visaNumber}</span>
                          </div>
                        )}
                        {app.status === 'rejected' && (
                          <div className="meta-item">
                            <Icon name="x-circle" size={14} />
                            <span>Rejected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-state">
                <Icon name="document-text" size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} />
                <h3>No visa applications found</h3>
                <p>Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>

          {/* Application Detail Modal */}
          {selectedApp && (
            <div className="modal-overlay" onClick={() => setSelectedApp(null)}>
              <div className="modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3 className="modal-title">
                    {selectedApp.country} {selectedApp.visaType.charAt(0).toUpperCase() + selectedApp.visaType.slice(1)} Visa - {selectedApp.applicantName}
                  </h3>
                  <button 
                    className="modal-close"
                    onClick={() => setSelectedApp(null)}
                  >
                    <Icon name="x-mark" size={20} />
                  </button>
                </div>

                <div className="modal-body">
                  {/* Application Info */}
                  <div className="modal-section">
                    <h4 className="modal-section-title">Application Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div><strong>Applicant:</strong> {selectedApp.applicantName}</div>
                      <div><strong>Country:</strong> {selectedApp.country}</div>
                      <div><strong>Visa Type:</strong> {selectedApp.visaType}</div>
                      <div><strong>Purpose:</strong> {selectedApp.purpose}</div>
                      <div><strong>Status:</strong> {statusConfig[selectedApp.status].label}</div>
                      <div><strong>Embassy:</strong> {selectedApp.embassy}</div>
                      <div><strong>Consultant:</strong> {selectedApp.consultant}</div>
                      <div><strong>Visa Fee:</strong> ${selectedApp.visaFee} {selectedApp.feePaid ? '(Paid)' : '(Pending)'}</div>
                    </div>
                    
                    {selectedApp.appointmentDate && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                        <strong>Embassy Appointment:</strong> {new Date(selectedApp.appointmentDate).toLocaleDateString()} at {selectedApp.appointmentTime}
                        {selectedApp.appointmentConfirmation && (
                          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Confirmation: {selectedApp.appointmentConfirmation}
                          </div>
                        )}
                      </div>
                    )}

                    {selectedApp.notes && (
                      <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--glass-bg)', borderRadius: '8px' }}>
                        <strong>Notes:</strong> {selectedApp.notes}
                      </div>
                    )}
                  </div>

                  {/* Document Requirements */}
                  <div className="modal-section">
                    <h4 className="modal-section-title">Document Requirements ({selectedApp.country})</h4>
                    <div className="documents-grid">
                      {Object.entries(selectedApp.documents).map(([key, doc]) => (
                        <div key={key} className="document-item">
                          <div className="document-left">
                            <div className="document-status">
                              <div className={`status-icon ${doc.completed ? (doc.verified ? 'status-icon--verified' : 'status-icon--completed') : 'status-icon--pending'}`}>
                                {doc.completed ? (doc.verified ? <Icon name="shield-check" size={10} /> : <Icon name="check" size={10} />) : <Icon name="clock" size={10} />}
                              </div>
                              <span style={{ fontSize: '0.75rem', color: doc.verified ? 'var(--success)' : doc.completed ? 'var(--info)' : 'var(--warning)' }}>
                                {doc.verified ? 'Verified' : doc.completed ? 'Submitted' : 'Pending'}
                              </span>
                            </div>
                            <div className="document-info">
                              <h5 className="document-name">
                                {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h5>
                              <p className="document-notes">{doc.notes}</p>
                            </div>
                          </div>
                          <div className="document-date">
                            {doc.uploadedDate ? new Date(doc.uploadedDate).toLocaleDateString() : 'Not uploaded'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Status History */}
                  <div className="modal-section">
                    <h4 className="modal-section-title">Application Timeline</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {selectedApp.statusHistory.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--secondary))', marginTop: '0.5rem', flexShrink: 0, boxShadow: '0 0 8px rgba(99, 102, 241, 0.5)' }} />
                          <div style={{ flex: 1 }}>
                            <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                              {new Date(item.date).toLocaleDateString()}
                            </p>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text)' }}>{item.note}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointment Scheduling Modal */}
          {showAppointmentModal && selectedAppointment && (
            <div className="modal-overlay" onClick={() => setShowAppointmentModal(false)}>
              <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                <div className="modal-header">
                  <h3 className="modal-title">Schedule Embassy Appointment</h3>
                  <button 
                    className="modal-close"
                    onClick={() => setShowAppointmentModal(false)}
                  >
                    <Icon name="x-mark" size={20} />
                  </button>
                </div>

                <div className="appointment-modal-body">
                  <div className="embassy-info">
                    <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)' }}>Embassy Information</h4>
                    <p style={{ margin: '0', color: 'var(--text-secondary)' }}><strong>Embassy:</strong> {selectedAppointment.embassy}</p>
                    <p style={{ margin: '0', color: 'var(--text-secondary)' }}><strong>Applicant:</strong> {selectedAppointment.applicantName}</p>
                    <p style={{ margin: '0', color: 'var(--text-secondary)' }}><strong>Visa Type:</strong> {selectedAppointment.country} {selectedAppointment.visaType}</p>
                  </div>

                  <div className="appointment-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label className="form-label">Appointment Date</label>
                        <input
                          type="date"
                          className="form-input"
                          min={new Date().toISOString().split('T')[0]}
                          onChange={(e) => setSelectedAppointment(prev => ({ ...prev, tempDate: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Appointment Time</label>
                        <select 
                          className="form-select"
                          onChange={(e) => setSelectedAppointment(prev => ({ ...prev, tempTime: e.target.value }))}
                        >
                          <option value="">Select time</option>
                          <option value="09:00 AM">09:00 AM</option>
                          <option value="09:30 AM">09:30 AM</option>
                          <option value="10:00 AM">10:00 AM</option>
                          <option value="10:30 AM">10:30 AM</option>
                          <option value="11:00 AM">11:00 AM</option>
                          <option value="11:30 AM">11:30 AM</option>
                          <option value="02:00 PM">02:00 PM</option>
                          <option value="02:30 PM">02:30 PM</option>
                          <option value="03:00 PM">03:00 PM</option>
                          <option value="03:30 PM">03:30 PM</option>
                          <option value="04:00 PM">04:00 PM</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '2rem' }}>
                      <button 
                        className="button button--secondary"
                        onClick={() => setShowAppointmentModal(false)}
                      >
                        Cancel
                      </button>
                      <button 
                        className="button button--primary"
                        onClick={() => {
                          if (selectedAppointment.tempDate && selectedAppointment.tempTime) {
                            scheduleAppointment(selectedAppointment.id, {
                              date: selectedAppointment.tempDate,
                              time: selectedAppointment.tempTime,
                              confirmation: `${selectedAppointment.country.toUpperCase()}${Date.now()}`
                            });
                          }
                        }}
                        disabled={!selectedAppointment.tempDate || !selectedAppointment.tempTime}
                      >
                        <Icon name="calendar" size={16} />
                        Confirm Appointment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}