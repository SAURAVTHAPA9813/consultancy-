import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useAuth } from '@/components/AuthContext.jsx';
import styles from '@/styles/Dashboard.module.css';


// Icon Component (matching your Icon.jsx structure)
const Icon = ({ name, size = 20, className = '' }) => {
  const icons = {
    dashboard: <rect x="3" y="3" width="7" height="7" rx="1"/>,
    documents: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></>,
    users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></>,
    'clipboard-document-list': <><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><line x1="8" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="16" y2="15"/></>,
    'academic-cap': <><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 1.7 3.3 3 6 3s6-1.3 6-3v-5"/></>,
    identification: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 9h3M15 13h3"/></>,
    messages: <><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></>,
    admin: <><circle cx="12" cy="12" r="3"/><circle cx="12" cy="4" r="2"/><circle cx="20" cy="12" r="2"/><circle cx="12" cy="20" r="2"/><circle cx="4" cy="12" r="2"/></>,
    calendar: <><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    alert: <><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></>,
    activity: <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>,
    check: <polyline points="20 6 9 17 4 12"/>,
    plus: <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    'trending-up': <><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></>,
    funnel: <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>,
    chart: <><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></>,
    'arrow-right': <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>,
    x: <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    upload: <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></>,
    'file-text': <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></>,
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      {icons[name] || icons.dashboard}
    </svg>
  );
};

export default function Dashboard() {
  const { user } = useAuth();  
   const navigate = useNavigate(); 
const [currentView, setCurrentView] = useState(
  user?.role === 'student' ? 'student' : 'consultant'
);
  const [activeTab, setActiveTab] = useState('university');
  const [activities, setActivities] = useState([
    { id: 1, type: 'success', icon: 'check', message: "Sarah Johnson's I-20 document was verified", time: '2 minutes ago' },
    { id: 2, type: 'warning', icon: 'activity', message: "Michael Chen's application for MIT is now in-progress", time: '15 minutes ago' },
    { id: 3, type: 'info', icon: 'users', message: 'New student David Kumar was assigned to you', time: '1 hour ago' },
  ]);

  // Quick Actions based on Sidebar.jsx navigation
  const quickActions = [
    { path: '/students', label: 'Students', icon: 'users', color: 'primary' },
    { path: '/applications', label: 'Applications', icon: 'clipboard-document-list', color: 'secondary' },
    { path: '/university-apps', label: 'Universities', icon: 'academic-cap', color: 'success' },
    { path: '/visa-applications', label: 'Visa Apps', icon: 'identification', color: 'warning' },
    { path: '/documents', label: 'Documents', icon: 'documents', color: 'info' },
    { path: '/messages', label: 'Messages', icon: 'messages', color: 'danger' },
  ];

  // Data from ApplicationPipeline.jsx
  const pipelineStages = [
    { id: 'initial', name: 'Initial', count: 8, color: '#64748b' },
    { id: 'documents', name: 'Documents', count: 12, color: '#f59e0b' },
    { id: 'submitted', name: 'Submitted', count: 15, color: '#3b82f6' },
    { id: 'interview', name: 'Interview', count: 6, color: '#8b5cf6' },
    { id: 'decision', name: 'Decision', count: 4, color: '#10b981' },
  ];

  // Data from ConsultantSchedule.jsx
  const todayAppointments = [
    { id: 1, title: 'Sarah Johnson - Initial Consultation', time: '10:00 AM', priority: 'high' },
    { id: 2, title: 'Michael Chen - Document Review', time: '2:00 PM', priority: 'medium' },
    { id: 3, title: 'Emma Wilson - Follow-up', time: '4:00 PM', priority: 'low' },
  ];

  // Data from UniversityApps.jsx
  const urgentDeadlines = [
    { id: 1, title: 'Harvard - Computer Science', deadline: 'Feb 15 (7 days)', priority: 'high' },
    { id: 2, title: 'MIT - Electrical Engineering', deadline: 'Mar 1 (14 days)', priority: 'medium' },
  ];

  // Data from Consultants.jsx performanceMetrics
  const performanceMetrics = {
    successRate: 94,
    activeStudents: 18,
    avgResponseTime: '1.8h',
    monthlyCompleted: 14,
    monthlyTarget: 12,
  };

  // Student Data from StudentApplication.jsx
  const journeyStages = ['Consultation', 'Document Collection', 'Application Submission', 'Visa Process', 'Pre-Departure'];
  const currentStage = 2; // Application Submission

  const documents = [
    { name: 'Official Transcripts', status: 'verified', note: 'Verified - Received from university' },
    { name: 'Statement of Purpose', status: 'verified', note: 'Verified - Final version approved' },
    { name: 'Letters of Recommendation', status: 'review', note: 'Under Review - Waiting for 2nd letter' },
    { name: 'IELTS Score Report', status: 'verified', note: 'Verified - Score: 7.5' },
    { name: 'Financial Documents', status: 'missing', note: 'Missing - Bank statements needed' },
    { name: 'Passport Copy', status: 'missing', note: 'Missing - Clear scan required' },
  ];

  const universityApplications = [
    { id: 1, name: 'Harvard University - Computer Science', country: 'USA', deadline: 'Feb 15, 2025', status: 'in-progress' },
    { id: 2, name: 'MIT - Electrical Engineering', country: 'USA', deadline: 'Mar 1, 2025', status: 'submitted' },
    { id: 3, name: 'University of Toronto - MBA', country: 'Canada', deadline: 'Apr 1, 2025', status: 'documents-pending' },
  ];

  const visaApplications = [
    { id: 1, name: 'USA Student Visa (F-1)', embassy: 'New Delhi', status: 'appointment-scheduled' },
  ];

  const deadlines = [
    { day: '15', month: 'FEB', title: 'Harvard University Application Deadline', type: 'University Application', urgent: true },
    { day: '28', month: 'FEB', title: 'US Embassy Visa Interview', type: 'Visa Appointment • 10:30 AM', urgent: false },
    { day: '01', month: 'MAR', title: 'MIT Application Deadline', type: 'University Application', urgent: false },
    { day: '15', month: 'MAR', title: 'Financial Documents Submission', type: 'Document Deadline', urgent: false }
  ];

  // Add new activity periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const newActivities = [
        { type: 'success', icon: 'upload', message: 'New document uploaded by student' },
        { type: 'warning', icon: 'activity', message: 'Application status changed' },
        { type: 'info', icon: 'users', message: 'New message received' },
      ];
      const randomActivity = newActivities[Math.floor(Math.random() * newActivities.length)];
      setActivities(prev => [
        { ...randomActivity, id: Date.now(), time: 'Just now' },
        ...prev.slice(0, 4)
      ]);
    }, 15000);
    return () => clearInterval(interval);
  }, []);
useEffect(() => {
  if (user?.role === 'student') {
    setCurrentView('student');
  } else if (user?.role === 'consultant') {
    setCurrentView('consultant');
  }
}, [user?.role]);
  return (
    <div className={styles.dashboardContainer}>
      {/* Animated Background */}
      <div className={styles.animatedBg}>
        <div className={`${styles.orb} ${styles.orb1}`}></div>
        <div className={`${styles.orb} ${styles.orb2}`}></div>
      </div>

      <div className={styles.dashboardWrapper}>
        {/* Header */}
        <div className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <div>
              <h1 className={styles.headerTitle}>Educational Consultancy Portal</h1>
             <p className={styles.headerSubtitle}>
  Welcome back, {user?.fullName || user?.username} ({user?.role})
</p>
            </div>
           {user?.role === 'admin' && (
  <div className={styles.viewSwitcher}>
    <button 
      className={`${styles.viewBtn} ${currentView === 'consultant' ? styles.active : ''}`}
      onClick={() => setCurrentView('consultant')}
    >
      Consultant View
    </button>
    <button 
      className={`${styles.viewBtn} ${currentView === 'student' ? styles.active : ''}`}
      onClick={() => setCurrentView('student')}
    >
      Student View
    </button>
  </div>
)}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className={styles.quickActionsBar}>
          {quickActions.map((action) => (
            <button
              key={action.path}
              className={`${styles.quickActionBtn} ${styles[action.color]}`}
          onClick={() => navigate(action.path)}
            >
              <Icon name={action.icon} size={18} />
              {action.label}
            </button>
          ))}
        </div>

        {/* Dashboard Content */}
        {currentView === 'consultant' ? (
          <div className={`${styles.dashboardGrid} ${styles.consultantGrid}`}>
            {/* Today's Agenda & Urgent Tasks */}
            <div className={`${styles.glassCard} ${styles.span2}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="calendar" />
                  Today's Agenda & Urgent Tasks
                </h3>
              </div>
              <div className={styles.agendaGrid}>
                <div className={styles.agendaSection}>
                  <h4>
                    <Icon name="clock" size={16} />
                    Today's Appointments
                  </h4>
                  {todayAppointments.map(appointment => (
                    <div key={appointment.id} className={styles.taskItem}>
                      <div className={styles.taskTitle}>{appointment.title}</div>
                      <div className={styles.taskMeta}>
                        <span>{appointment.time}</span>
                        <span className={`${styles.priorityBadge} ${styles[`priority${appointment.priority.charAt(0).toUpperCase() + appointment.priority.slice(1)}`]}`}>
                          {appointment.priority}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className={styles.agendaSection}>
                  <h4>
                    <Icon name="alert" size={16} />
                    Urgent Deadlines
                  </h4>
                  {urgentDeadlines.map(deadline => (
                    <div key={deadline.id} className={styles.taskItem}>
                      <div className={styles.taskTitle}>{deadline.title}</div>
                      <div className={styles.taskMeta}>
                        <span>{deadline.deadline}</span>
                        <span className={`${styles.priorityBadge} ${styles[`priority${deadline.priority.charAt(0).toUpperCase() + deadline.priority.slice(1)}`]}`}>
                          {deadline.priority === 'high' ? 'Urgent' : 'Soon'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.agendaSection}>
                  <h4>
                    <Icon name="alert" size={16} />
                    Overdue Alerts
                  </h4>
                  <div className={styles.taskItem}>
                    <div className={styles.taskTitle}>Submit IELTS scores - David Kumar</div>
                    <div className={styles.taskMeta}>
                      <span>2 days overdue</span>
                      <span className={`${styles.priorityBadge} ${styles.priorityHigh}`}>Action Required</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Pipeline */}
            <div className={`${styles.glassCard} ${styles.span2}`}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="funnel" />
                  My Application Pipeline
                </h3>
              </div>
              <div className={styles.pipelineStages}>
                {pipelineStages.map(stage => (
                  <div key={stage.id} className={styles.stage}>
                    <div className={styles.stageCount}>{stage.count}</div>
                    <div className={styles.stageLabel}>{stage.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Real-Time Activity Feed */}
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="activity" />
                  Real-Time Activity Feed
                </h3>
              </div>
              <div className={styles.activityFeed}>
                {activities.map(activity => (
                  <div key={activity.id} className={styles.activityItem}>
                    <div className={`${styles.activityIcon} ${styles[activity.type]}`}>
                      <Icon name={activity.icon} size={20} />
                    </div>
                    <div>
                      <div className={styles.taskTitle}>{activity.message}</div>
                      <div className={styles.taskMeta}>{activity.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Performance Snapshot */}
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="chart" />
                  Performance Snapshot
                </h3>
              </div>
              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Success Rate</div>
                  <div className={styles.statValue}>{performanceMetrics.successRate}%</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Active Students</div>
                  <div className={styles.statValue}>{performanceMetrics.activeStudents}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Avg Response</div>
                  <div className={styles.statValue}>{performanceMetrics.avgResponseTime}</div>
                </div>
                <div className={styles.statCard}>
                  <div className={styles.statLabel}>Monthly Apps</div>
                  <div className={styles.statValue}>{performanceMetrics.monthlyCompleted}/{performanceMetrics.monthlyTarget}</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Student View
          <div className={`${styles.dashboardGrid} ${styles.studentGrid}`}>
            {/* My Application Journey */}
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="chart" />
                  My Application Journey
                </h3>
              </div>
              <div className={styles.journeyTimeline}>
                <div className={styles.journeyProgress}></div>
                {journeyStages.map((stage, index) => (
                  <div key={index} className={styles.journeyStep}>
                    <div className={`${styles.journeyStepIcon} ${
                      index < currentStage ? styles.completed : 
                      index === currentStage ? styles.current : ''
                    }`}>
                      <Icon name={index < currentStage ? 'check' : index === currentStage ? 'activity' : 'clock'} size={24} />
                    </div>
                    <div className={styles.journeyStepLabel}>{stage}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Document Checklist */}
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="clipboard-document-list" />
                  Action Required! Your Document Checklist
                </h3>
                <button className={styles.uploadBtn}>
                  <Icon name="upload" size={16} />
                  Upload Document
                </button>
              </div>
              <div className={styles.documentList}>
                {documents.map((doc, index) => (
                  <div key={index} className={styles.documentItem}>
                    <div className={styles.documentInfo}>
                      <div className={`${styles.documentStatus} ${styles[doc.status]}`}>
                        <Icon name={doc.status === 'verified' ? 'check' : doc.status === 'review' ? 'clock' : 'x'} size={16} />
                      </div>
                      <div>
                        <div className={styles.documentName}>{doc.name}</div>
                        <div className={styles.documentNote}>{doc.note}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Applications Overview */}
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="academic-cap" />
                  My Applications Overview
                </h3>
              </div>
              <div className={styles.tabContainer}>
                <div className={styles.tabButtons}>
                  <button
                    onClick={() => setActiveTab('university')}
                    className={`${styles.tabBtn} ${activeTab === 'university' ? styles.active : ''}`}
                  >
                    University
                  </button>
                  <button
                    onClick={() => setActiveTab('visa')}
                    className={`${styles.tabBtn} ${activeTab === 'visa' ? styles.active : ''}`}
                  >
                    Visa
                  </button>
                </div>
              </div>
              <div className={styles.applicationList}>
                {activeTab === 'university' ? (
                  universityApplications.map(app => (
                    <div key={app.id} className={styles.applicationItem}>
                      <div>
                        <div className={styles.applicationTitle}>{app.name}</div>
                        <div className={styles.applicationMeta}>{app.country} • Deadline: {app.deadline}</div>
                      </div>
                      <div className={`${styles.applicationStatus} ${
                        app.status === 'submitted' ? styles.statusSubmitted : styles.statusProgress
                      }`}>
                        {app.status === 'in-progress' ? 'In Progress' : 
                         app.status === 'submitted' ? 'Submitted' : 'Documents Pending'}
                      </div>
                    </div>
                  ))
                ) : (
                  visaApplications.map(app => (
                    <div key={app.id} className={styles.applicationItem}>
                      <div>
                        <div className={styles.applicationTitle}>{app.name}</div>
                        <div className={styles.applicationMeta}>Embassy: {app.embassy}</div>
                      </div>
                      <div className={`${styles.applicationStatus} ${styles.statusScheduled}`}>
                        Appointment Scheduled
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className={styles.glassCard}>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>
                  <Icon name="calendar" />
                  Upcoming Deadlines & Appointments
                </h3>
              </div>
              <div className={styles.deadlineList}>
                {deadlines.map((deadline, index) => (
                  <div key={index} className={`${styles.deadlineItem} ${
                    deadline.urgent ? styles.urgent : styles.soon
                  }`}>
                    <div className={styles.deadlineDate}>
                      <div className={styles.deadlineDay}>{deadline.day}</div>
                      <div className={styles.deadlineMonth}>{deadline.month}</div>
                    </div>
                    <div className={styles.deadlineContent}>
                      <div className={styles.deadlineTitle}>{deadline.title}</div>
                      <div className={styles.deadlineType}>{deadline.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}