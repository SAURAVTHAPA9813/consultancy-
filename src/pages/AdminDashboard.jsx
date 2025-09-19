import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon.jsx';
import { useAuth } from '@/components/AuthContext.jsx';
import { api } from '@/lib/api.js';

// CSS Modules
import styles from '@/styles/Dashboard.module.css';
import layoutStyles from '@/styles/Layout.module.css';
import buttonStyles from '@/styles/Buttons.module.css';

// Utility functions
const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Mock data generator based on user role (same as before but with more data)
const getMockDataForRole = (role, userId, branch) => {
  const baseData = {
    admin: {
      stats: {
        totalStudents: 156,
        activeApplications: 42,
        appointmentsToday: 8,
        monthlyRevenue: 285000,
        totalConsultants: 12,
        completedApplications: 89,
        pendingDocuments: 23,
        weeklyGrowth: 12,
        successRate: 87
      },
      chartData: {
        pipeline: [
          { stage: 'Initial Consultation', count: 156, color: '#6366f1' },
          { stage: 'Documents Collection', count: 134, color: '#8b5cf6' },
          { stage: 'University Application', count: 89, color: '#06b6d4' },
          { stage: 'Visa Application', count: 67, color: '#10b981' },
          { stage: 'Successfully Placed', count: 45, color: '#10b981' }
        ],
        revenue: [
          { month: 'Sep', amount: 180000 },
          { month: 'Oct', amount: 220000 },
          { month: 'Nov', amount: 195000 },
          { month: 'Dec', amount: 250000 },
          { month: 'Jan', amount: 285000 }
        ]
      },
      students: [
        { id: 1, name: 'Ramesh Sharma', consultant: 'Dr. Nishan Timilsina', intendedCountry: 'Australia', status: 'consultation-scheduled', createdAt: '2024-01-15', progress: 35, avatar: 'RS' },
        { id: 2, name: 'Priya Gurung', consultant: 'Jenish Neupane', intendedCountry: 'Canada', status: 'documents-pending', createdAt: '2024-01-14', progress: 60, avatar: 'PG' },
        { id: 3, name: 'Arjun Thapa', consultant: 'Sakura Ghimire', intendedCountry: 'UK', status: 'application-submitted', createdAt: '2024-01-13', progress: 75, avatar: 'AT' }
      ],
      consultants: [
        { id: 1, name: 'Dr. Nishan Timilsina', studentsThisMonth: 18, applicationsSubmitted: 12, successRate: 94, status: 'online', avatar: 'NT' },
        { id: 2, name: 'Jenish Neupane', studentsThisMonth: 15, applicationsSubmitted: 10, successRate: 87, status: 'busy', avatar: 'JN' },
        { id: 3, name: 'Sakura Ghimire', studentsThisMonth: 12, applicationsSubmitted: 8, successRate: 91, status: 'offline', avatar: 'SG' }
      ],
      recentActivities: [
        { id: 1, type: 'student_joined', message: 'New student Ramesh Sharma registered', time: '2 hours ago', icon: 'user-plus', color: 'blue' },
        { id: 2, type: 'payment', message: 'Payment received from Priya Gurung', time: '3 hours ago', icon: 'dollar', color: 'green' },
        { id: 3, type: 'document', message: 'Documents uploaded by Arjun Thapa', time: '5 hours ago', icon: 'document', color: 'purple' },
        { id: 4, type: 'application', message: 'Application submitted to Toronto University', time: '1 day ago', icon: 'send', color: 'orange' }
      ],
      appointments: [
        { id: 1, time: '09:00 AM', student: 'Ramesh Sharma', consultant: 'Dr. Nishan', type: 'Initial Consultation', duration: '1 hour', room: 'Meeting Room A' },
        { id: 2, time: '10:30 AM', student: 'Priya Gurung', consultant: 'Jenish', type: 'Document Review', duration: '30 mins', room: 'Online' },
        { id: 3, time: '02:00 PM', student: 'Maya Shrestha', consultant: 'Sakura', type: 'Visa Preparation', duration: '45 mins', room: 'Meeting Room B' }
      ],
      systemAlerts: [
        { id: 1, type: 'warning', message: 'Server maintenance scheduled for tonight', priority: 'medium' },
        { id: 2, type: 'info', message: '5 new user registrations pending approval', priority: 'low' }
      ]
    },
    consultant: {
      stats: {
        myStudents: 18,
        appointmentsToday: 3,
        pendingTasks: 7,
        monthlyEarnings: 45000,
        applicationsSubmitted: 12,
        successRate: 94,
        nextAppointment: '2024-01-20T10:00:00',
        hoursWorked: 142
      },
      schedule: [
        { time: '09:00', status: 'busy', appointment: { student: 'Ramesh Sharma', type: 'Consultation' } },
        { time: '10:00', status: 'busy', appointment: { student: 'Maya Shrestha', type: 'Document Review' } },
        { time: '11:00', status: 'available' },
        { time: '12:00', status: 'break' },
        { time: '01:00', status: 'break' },
        { time: '02:00', status: 'busy', appointment: { student: 'Suresh Rai', type: 'Follow-up' } },
        { time: '03:00', status: 'available' },
        { time: '04:00', status: 'busy', appointment: { student: 'Bikash Thapa', type: 'Application Review' } },
        { time: '05:00', status: 'available' }
      ],
      myStudents: [
        { id: 1, name: 'Ramesh Sharma', intendedCountry: 'Australia', status: 'consultation-scheduled', nextAppointment: '2024-01-20T10:00:00', progress: 35, daysInStage: 3, avatar: 'RS' },
        { id: 2, name: 'Maya Shrestha', intendedCountry: 'Canada', status: 'documents-pending', nextAppointment: '2024-01-21T14:00:00', progress: 60, daysInStage: 5, avatar: 'MS' },
        { id: 3, name: 'Bikash Thapa', intendedCountry: 'UK', status: 'application-submitted', nextAppointment: null, progress: 85, daysInStage: 2, avatar: 'BT' }
      ],
      todayAppointments: [
        { id: 1, studentName: 'Ramesh Sharma', time: '10:00 AM', type: 'Initial Consultation' },
        { id: 2, studentName: 'Maya Shrestha', time: '2:00 PM', type: 'Document Review' },
        { id: 3, studentName: 'Suresh Rai', time: '4:00 PM', type: 'Follow-up' }
      ],
      pendingTasks: [
        { id: 1, task: 'Review IELTS scores for Ramesh Sharma', priority: 'high', dueDate: '2024-01-19' },
        { id: 2, task: 'Submit university application for Maya', priority: 'high', dueDate: '2024-01-20' },
        { id: 3, task: 'Schedule visa interview for Bikash', priority: 'medium', dueDate: '2024-01-22' }
      ]
    },
    client: {
      stats: {
        applicationStatus: 'Under Review',
        documentsSubmitted: 8,
        documentsRequired: 10,
        nextAppointment: '2024-01-20T10:00:00',
        consultantName: 'Dr. Nishan Timilsina',
        progressPercentage: 45,
        currentStage: 3,
        totalStages: 7
      },
      applicationProgress: [
        { stage: 'Initial Consultation', completed: true, date: '2024-01-10', icon: 'check-circle' },
        { stage: 'Country Selection', completed: true, date: '2024-01-12', icon: 'globe' },
        { stage: 'Document Collection', completed: false, date: null, icon: 'document', current: true },
        { stage: 'University Applications', completed: false, date: null, icon: 'academic-cap', locked: false },
        { stage: 'Application Submission', completed: false, date: null, icon: 'send', locked: true },
        { stage: 'Visa Application', completed: false, date: null, icon: 'identification', locked: true },
        { stage: 'Pre-Departure', completed: false, date: null, icon: 'plane', locked: true }
      ],
      targetUniversities: [
        { id: 1, name: 'University of Toronto', country: 'Canada', deadline: '2024-03-15', probability: 85, logo: '🎓' },
        { id: 2, name: 'McGill University', country: 'Canada', deadline: '2024-03-20', probability: 72, logo: '🏛️' },
        { id: 3, name: 'UBC', country: 'Canada', deadline: '2024-04-01', probability: 78, logo: '🌲' }
      ],
      documents: [
        { id: 1, name: 'Academic Transcripts', status: 'approved', uploadedDate: '2024-01-12', icon: 'document-check' },
        { id: 2, name: 'IELTS Certificate', status: 'approved', uploadedDate: '2024-01-14', icon: 'document-check' },
        { id: 3, name: 'Personal Statement', status: 'pending-review', uploadedDate: '2024-01-16', icon: 'document-clock' },
        { id: 4, name: 'Recommendation Letter 1', status: 'required', uploadedDate: null, icon: 'document-plus' }
      ],
      recentMessages: [
        { id: 1, from: 'Dr. Nishan Timilsina', message: 'Your IELTS scores look great! Next step is university selection.', date: '2024-01-18' },
        { id: 2, from: 'System', message: 'Reminder: Upload your recommendation letters by Jan 25', date: '2024-01-17' }
      ]
    }
  };

  return baseData[role] || baseData.client;
};

// Enhanced Admin Dashboard Components
const AdminStatCard = ({ iconName, label, value, delta, trend, onClick, type, subtitle }) => (
  <div 
    className={`${styles['stat-card']} ${styles[`stat-card--${type}`]}`}
    onClick={onClick}
  >
    <div className={styles['stat-card__glow']}></div>
    <div className={styles['stat-card__content']}>
      <div className={styles['stat-card__header']}>
        <div className={`${styles['stat-card__icon']} ${styles[`stat-card__icon--${type}`]}`}>
          <Icon name={iconName} size={24} decorative />
        </div>
        {trend && (
          <div className={`${styles['stat-card__trend']} ${styles[`stat-card__trend--${trend}`]}`}>
            <Icon name={trend === 'positive' ? 'trending-up' : trend === 'negative' ? 'trending-down' : 'minus'} size={16} />
          </div>
        )}
      </div>
      <div className={styles['stat-card__body']}>
        <div className={styles['stat-card__value']}>{value}</div>
        <div className={styles['stat-card__label']}>{label}</div>
        {subtitle && <div className={styles['stat-card__subtitle']}>{subtitle}</div>}
        {delta && (
          <div className={`${styles['stat-card__delta']} ${styles[`stat-card__delta--${trend}`]}`}>
            {delta}
          </div>
        )}
      </div>
      <div className={styles['stat-card__sparkline']}>
        {/* Mini chart visualization */}
        <svg viewBox="0 0 100 40" className={styles['sparkline-svg']}>
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            points="0,30 20,25 40,27 60,15 80,18 100,10"
          />
        </svg>
      </div>
    </div>
  </div>
);

// Activity Feed Component
const ActivityFeed = ({ activities }) => (
  <div className={`${styles['glass-card']} ${styles['activity-feed']}`}>
    <div className={styles['card-header']}>
      <h3 className={styles['card-title']}>
        <Icon name="activity" size={20} />
        Recent Activities
      </h3>
      <Link to="/activities" className={styles['card-link']}>
        View All <Icon name="arrow-right" size={14} />
      </Link>
    </div>
    <div className={styles['card-body']}>
      <div className={styles['activity-timeline']}>
        {activities.map((activity, index) => (
          <div key={activity.id} className={styles['activity-item']}>
            <div className={`${styles['activity-icon']} ${styles[`activity-icon--${activity.color}`]}`}>
              <Icon name={activity.icon} size={16} />
            </div>
            <div className={styles['activity-content']}>
              <p className={styles['activity-message']}>{activity.message}</p>
              <span className={styles['activity-time']}>{activity.time}</span>
            </div>
            {index < activities.length - 1 && <div className={styles['activity-line']}></div>}
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Pipeline Visualization Component
const PipelineChart = ({ data }) => (
  <div className={`${styles['glass-card']} ${styles['pipeline-chart']}`}>
    <div className={styles['card-header']}>
      <h3 className={styles['card-title']}>
        <Icon name="chart-bar" size={20} />
        Application Pipeline
      </h3>
      <div className={styles['chart-legend']}>
        <span className={styles['legend-item']}>
          <span className={styles['legend-dot']} style={{ background: '#10b981' }}></span>
          Active
        </span>
      </div>
    </div>
    <div className={styles['card-body']}>
      <div className={styles['pipeline-funnel']}>
        {data.map((stage, index) => (
          <div 
            key={index} 
            className={styles['pipeline-stage']}
            style={{ '--stage-width': `${100 - (index * 15)}%` }}
          >
            <div 
              className={styles['pipeline-bar']}
              style={{ background: stage.color }}
            >
              <span className={styles['pipeline-count']}>{stage.count}</span>
              <span className={styles['pipeline-label']}>{stage.stage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Schedule Timeline Component
const ScheduleTimeline = ({ schedule }) => (
  <div className={`${styles['glass-card']} ${styles['schedule-timeline']}`}>
    <div className={styles['card-header']}>
      <h3 className={styles['card-title']}>
        <Icon name="clock" size={20} />
        Today's Schedule
      </h3>
      <span className={styles['current-time']}>Current Time: {formatTime(new Date())}</span>
    </div>
    <div className={styles['card-body']}>
      <div className={styles['timeline']}>
        {schedule.map((slot, index) => (
          <div key={index} className={`${styles['timeline-slot']} ${styles[`timeline-slot--${slot.status}`]}`}>
            <div className={styles['timeline-time']}>{slot.time}</div>
            <div className={styles['timeline-marker']}></div>
            <div className={styles['timeline-content']}>
              {slot.status === 'busy' && slot.appointment ? (
                <>
                  <div className={styles['timeline-title']}>{slot.appointment.student}</div>
                  <div className={styles['timeline-subtitle']}>{slot.appointment.type}</div>
                </>
              ) : slot.status === 'break' ? (
                <div className={styles['timeline-title']}>Break Time</div>
              ) : (
                <div className={styles['timeline-title']}>Available</div>
              )}
            </div>
          </div>
        ))}
        <div className={styles['timeline-current']} style={{ top: '35%' }}>
          <div className={styles['timeline-current-dot']}></div>
        </div>
      </div>
    </div>
  </div>
);

// Student Progress Card Component
const StudentProgressCard = ({ student }) => (
  <div className={`${styles['student-card']} ${styles['glass-card']}`}>
    <div className={styles['student-card__header']}>
      <div className={styles['student-avatar']}>
        <span className={styles['student-avatar__text']}>{student.avatar}</span>
        <span className={`${styles['status-dot']} ${styles[`status-dot--${student.status}`]}`}></span>
      </div>
      <div className={styles['student-info']}>
        <h4 className={styles['student-name']}>{student.name}</h4>
        <p className={styles['student-country']}>{student.intendedCountry}</p>
      </div>
      <div className={styles['student-progress']}>
        <div className={styles['progress-circle']}>
          <svg className={styles['progress-svg']}>
            <circle
              className={styles['progress-bg']}
              cx="20"
              cy="20"
              r="18"
            />
            <circle
              className={styles['progress-fill']}
              cx="20"
              cy="20"
              r="18"
              style={{ '--progress': student.progress }}
            />
          </svg>
          <span className={styles['progress-text']}>{student.progress}%</span>
        </div>
      </div>
    </div>
    <div className={styles['student-card__body']}>
      <div className={styles['student-stats']}>
        <div className={styles['student-stat']}>
          <Icon name="calendar" size={14} />
          <span>{student.nextAppointment ? formatDate(student.nextAppointment) : 'No appointment'}</span>
        </div>
        <div className={styles['student-stat']}>
          <Icon name="clock" size={14} />
          <span>{student.daysInStage} days in stage</span>
        </div>
      </div>
      <div className={`${styles['status-badge']} ${styles[`status-badge--${student.status}`]}`}>
        {student.status.replace('-', ' ')}
      </div>
    </div>
  </div>
);

// Main Dashboard Component
export default function Dashboard() {
  const { user, branch } = useAuth();
  const [data, setData] = useState({ loading: true });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const roleData = getMockDataForRole(user?.role, user?.id, branch);
        setData({ ...roleData, loading: false });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setData({ loading: false });
      }
    };

    if (user?.role) {
      loadDashboardData();
    }
  }, [user, branch]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (data.loading) {
    return (
      <div className={styles['loading-container']}>
        <div className={styles['loading-spinner']}>
          <div className={styles['spinner-ring']}></div>
          <div className={styles['spinner-ring']}></div>
          <div className={styles['spinner-ring']}></div>
        </div>
        <p className={styles['loading-text']}>Loading your dashboard...</p>
      </div>
    );
  }

  // Render different dashboards based on user role
  const renderDashboard = () => {
    switch (user?.role) {
      case 'admin':
        return (
          <>
            {/* Animated Background */}
            <div className={styles['bg-animation']}>
              <div className={styles['gradient-sphere']} style={{ '--delay': '0s' }}></div>
              <div className={styles['gradient-sphere']} style={{ '--delay': '5s' }}></div>
              <div className={styles['gradient-sphere']} style={{ '--delay': '10s' }}></div>
            </div>

            <div className={styles['dashboard-wrapper']}>
              {/* Header Section */}
              <div className={styles['dashboard-header']}>
                <div className={styles['header-content']}>
                  <h1 className={styles['header-title']}>Admin Dashboard</h1>
                  <p className={styles['header-subtitle']}>
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} • {branch} Branch
                  </p>
                </div>
                <div className={styles['header-actions']}>
                  <button className={styles['notification-btn']}>
                    <Icon name="bell" size={20} />
                    <span className={styles['notification-badge']}>5</span>
                  </button>
                  <div className={styles['user-menu']}>
                    <div className={styles['user-avatar']}>
                      <span>AD</span>
                    </div>
                    <span className={styles['user-name']}>{user?.username}</span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className={styles['stats-grid']}>
                <AdminStatCard 
                  type="students" 
                  iconName="users" 
                  label="Total Students" 
                  value={data.stats?.totalStudents} 
                  delta={`+${data.stats?.weeklyGrowth || 12}% this week`}
                  trend="positive"
                  subtitle="Active enrollments"
                />
                <AdminStatCard 
                  type="revenue" 
                  iconName="dollar" 
                  label="Monthly Revenue" 
                  value={formatCurrency(data.stats?.monthlyRevenue)} 
                  delta="+23% increase"
                  trend="positive"
                  subtitle="Current month"
                />
                <AdminStatCard 
                  type="applications" 
                  iconName="clipboard" 
                  label="Active Applications" 
                  value={data.stats?.activeApplications}
                  delta={`${data.stats?.completedApplications} completed`}
                  trend="neutral"
                  subtitle="In progress"
                />
                <AdminStatCard 
                  type="appointments" 
                  iconName="calendar" 
                  label="Today's Appointments" 
                  value={data.stats?.appointmentsToday}
                  subtitle="Scheduled meetings"
                />
              </div>

              {/* Main Content Grid */}
              <div className={styles['content-grid']}>
                <div className={styles['content-main']}>
                  {/* Pipeline Chart */}
                  <PipelineChart data={data.chartData?.pipeline || []} />

                  {/* Recent Students */}
                  <div className={`${styles['glass-card']} ${styles['students-list']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="users" size={20} />
                        Recent Students
                      </h3>
                      <Link to="/students" className={styles['card-link']}>
                        View All <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['students-grid']}>
                        {data.students?.map(student => (
                          <StudentProgressCard key={student.id} student={student} />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Appointments Timeline */}
                  <div className={`${styles['glass-card']} ${styles['appointments-timeline']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="calendar" size={20} />
                        Today's Appointments
                      </h3>
                      <Link to="/appointments" className={styles['card-link']}>
                        View Calendar <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['appointments-list']}>
                        {data.appointments?.map(apt => (
                          <div key={apt.id} className={styles['appointment-card']}>
                            <div className={styles['appointment-time']}>
                              <Icon name="clock" size={16} />
                              <span>{apt.time}</span>
                            </div>
                            <div className={styles['appointment-details']}>
                              <h4>{apt.student}</h4>
                              <p>{apt.type} • {apt.duration}</p>
                            </div>
                            <div className={styles['appointment-location']}>
                              <Icon name={apt.room === 'Online' ? 'video' : 'map-pin'} size={14} />
                              <span>{apt.room}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles['content-sidebar']}>
                  {/* Activity Feed */}
                  <ActivityFeed activities={data.recentActivities || []} />

                  {/* Consultant Performance */}
                  <div className={`${styles['glass-card']} ${styles['consultant-performance']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="briefcase" size={20} />
                        Consultant Performance
                      </h3>
                      <Link to="/consultants" className={styles['card-link']}>
                        View All <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['consultant-list']}>
                        {data.consultants?.map(consultant => (
                          <div key={consultant.id} className={styles['consultant-item']}>
                            <div className={styles['consultant-avatar']}>
                              <span>{consultant.avatar}</span>
                              <span className={`${styles['status-indicator']} ${styles[`status-indicator--${consultant.status}`]}`}></span>
                            </div>
                            <div className={styles['consultant-info']}>
                              <h4>{consultant.name}</h4>
                              <p>{consultant.studentsThisMonth} students</p>
                            </div>
                            <div className={styles['consultant-stats']}>
                              <div className={styles['success-rate']}>
                                <span className={styles['rate-value']}>{consultant.successRate}%</span>
                                <span className={styles['rate-label']}>Success</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'consultant':
        return (
          <>
            {/* Animated Background */}
            <div className={styles['bg-animation']}>
              <div className={styles['gradient-sphere']} style={{ '--delay': '0s' }}></div>
              <div className={styles['gradient-sphere']} style={{ '--delay': '7s' }}></div>
            </div>

            <div className={styles['dashboard-wrapper']}>
              {/* Header */}
              <div className={styles['dashboard-header']}>
                <div className={styles['header-content']}>
                  <h1 className={styles['header-title']}>Welcome back, {user?.username}!</h1>
                  <p className={styles['header-subtitle']}>
                    You have {data.stats?.appointmentsToday} appointments scheduled for today
                  </p>
                </div>
                <div className={styles['header-actions']}>
                  <div className={styles['next-appointment']}>
                    <Icon name="calendar" size={16} />
                    <span>Next: {data.stats?.nextAppointment ? formatTime(data.stats.nextAppointment) : 'None'}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className={styles['stats-grid']}>
                <AdminStatCard 
                  type="students" 
                  iconName="users" 
                  label="My Students" 
                  value={data.stats?.myStudents}
                  subtitle="Currently assigned"
                />
                <AdminStatCard 
                  type="appointments" 
                  iconName="calendar" 
                  label="Today's Appointments" 
                  value={data.stats?.appointmentsToday}
                  subtitle="Scheduled meetings"
                />
                <AdminStatCard 
                  type="tasks" 
                  iconName="clipboard-list" 
                  label="Pending Tasks" 
                  value={data.stats?.pendingTasks}
                  subtitle="Require attention"
                />
                <AdminStatCard 
                  type="success" 
                  iconName="trophy" 
                  label="Success Rate" 
                  value={`${data.stats?.successRate}%`}
                  delta={`${data.stats?.applicationsSubmitted} applications`}
                  trend="positive"
                  subtitle="This month"
                />
              </div>

              {/* Main Content */}
              <div className={styles['content-grid']}>
                <div className={styles['content-main']}>
                  {/* Schedule Timeline */}
                  <ScheduleTimeline schedule={data.schedule || []} />

                  {/* My Students */}
                  <div className={`${styles['glass-card']} ${styles['students-list']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="users" size={20} />
                        My Students
                      </h3>
                      <Link to="/students" className={styles['card-link']}>
                        View All <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['students-grid']}>
                        {data.myStudents?.map(student => (
                          <StudentProgressCard key={student.id} student={student} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles['content-sidebar']}>
                  {/* Pending Tasks */}
                  <div className={`${styles['glass-card']} ${styles['tasks-list']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="clipboard-list" size={20} />
                        Pending Tasks
                      </h3>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['tasks']}>
                        {data.pendingTasks?.map(task => (
                          <div key={task.id} className={styles['task-item']}>
                            <div className={`${styles['task-priority']} ${styles[`priority--${task.priority}`]}`}></div>
                            <div className={styles['task-content']}>
                              <p className={styles['task-title']}>{task.task}</p>
                              <span className={styles['task-due']}>Due: {formatDate(task.dueDate)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      case 'client':
      case 'student':
        return (
          <>
            {/* Animated Background */}
            <div className={styles['bg-animation']}>
              <div className={styles['gradient-sphere']} style={{ '--delay': '0s' }}></div>
              <div className={styles['gradient-sphere']} style={{ '--delay': '8s' }}></div>
            </div>

            <div className={styles['dashboard-wrapper']}>
              {/* Header with Progress */}
              <div className={styles['dashboard-header']}>
                <div className={styles['header-content']}>
                  <h1 className={styles['header-title']}>Welcome, {user?.username}! 🎯</h1>
                  <p className={styles['header-subtitle']}>
                    Your journey to {data.targetUniversities?.[0]?.country || 'abroad'} • {data.stats?.progressPercentage}% Complete
                  </p>
                </div>
                <div className={styles['progress-overview']}>
                  <div className={styles['progress-circle-large']}>
                    <svg className={styles['progress-svg-large']}>
                      <circle cx="60" cy="60" r="54" className={styles['progress-bg']} />
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="54" 
                        className={styles['progress-fill']}
                        style={{ '--progress': data.stats?.progressPercentage }}
                      />
                    </svg>
                    <div className={styles['progress-center']}>
                      <span className={styles['progress-value']}>{data.stats?.progressPercentage}%</span>
                      <span className={styles['progress-stage']}>Stage {data.stats?.currentStage} of {data.stats?.totalStages}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Journey Timeline */}
              <div className={`${styles['glass-card']} ${styles['journey-timeline']}`}>
                <div className={styles['card-header']}>
                  <h3 className={styles['card-title']}>
                    <Icon name="route" size={20} />
                    Your Journey Progress
                  </h3>
                </div>
                <div className={styles['card-body']}>
                  <div className={styles['journey-steps']}>
                    {data.applicationProgress?.map((step, index) => (
                      <div 
                        key={index} 
                        className={`${styles['journey-step']} 
                          ${step.completed ? styles['journey-step--completed'] : ''} 
                          ${step.current ? styles['journey-step--current'] : ''}
                          ${step.locked ? styles['journey-step--locked'] : ''}`}
                      >
                        <div className={styles['step-marker']}>
                          <Icon name={step.completed ? 'check' : step.current ? 'clock' : 'lock'} size={16} />
                        </div>
                        <div className={styles['step-content']}>
                          <h4>{step.stage}</h4>
                          {step.date && <span>{formatDate(step.date)}</span>}
                        </div>
                        {index < data.applicationProgress.length - 1 && (
                          <div className={styles['step-connector']}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className={styles['action-cards-grid']}>
                <div className={`${styles['action-card']} ${styles['action-card--appointment']}`}>
                  <div className={styles['action-card__icon']}>
                    <Icon name="calendar" size={24} />
                  </div>
                  <div className={styles['action-card__content']}>
                    <h3>Next Appointment</h3>
                    <p>{data.stats?.consultantName}</p>
                    <span>{data.stats?.nextAppointment ? formatDate(data.stats.nextAppointment) : 'Not scheduled'}</span>
                  </div>
                  <Link to="/appointments/new" className={styles['action-card__button']}>
                    Book Now
                  </Link>
                </div>

                <div className={`${styles['action-card']} ${styles['action-card--documents']}`}>
                  <div className={styles['action-card__icon']}>
                    <Icon name="document" size={24} />
                  </div>
                  <div className={styles['action-card__content']}>
                    <h3>Documents</h3>
                    <p>Progress: {data.stats?.documentsSubmitted}/{data.stats?.documentsRequired}</p>
                    <div className={styles['mini-progress']}>
                      <div 
                        className={styles['mini-progress-fill']}
                        style={{ width: `${(data.stats?.documentsSubmitted / data.stats?.documentsRequired) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <Link to="/documents" className={styles['action-card__button']}>
                    View All
                  </Link>
                </div>

                <div className={`${styles['action-card']} ${styles['action-card--universities']}`}>
                  <div className={styles['action-card__icon']}>
                    <Icon name="academic-cap" size={24} />
                  </div>
                  <div className={styles['action-card__content']}>
                    <h3>Target Universities</h3>
                    <p>{data.targetUniversities?.length || 0} Selected</p>
                    <span>Next deadline: {data.targetUniversities?.[0]?.deadline ? formatDate(data.targetUniversities[0].deadline) : 'None'}</span>
                  </div>
                  <Link to="/universities" className={styles['action-card__button']}>
                    View List
                  </Link>
                </div>
              </div>

              {/* Main Content */}
              <div className={styles['content-grid']}>
                <div className={styles['content-main']}>
                  {/* Target Universities */}
                  <div className={`${styles['glass-card']} ${styles['universities-list']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="academic-cap" size={20} />
                        Target Universities
                      </h3>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['university-cards']}>
                        {data.targetUniversities?.map(uni => (
                          <div key={uni.id} className={styles['university-card']}>
                            <div className={styles['university-logo']}>{uni.logo}</div>
                            <div className={styles['university-info']}>
                              <h4>{uni.name}</h4>
                              <p>{uni.country}</p>
                              <span className={styles['deadline']}>Deadline: {formatDate(uni.deadline)}</span>
                            </div>
                            <div className={styles['probability-meter']}>
                              <span className={styles['probability-label']}>Acceptance Probability</span>
                              <div className={styles['probability-bar']}>
                                <div 
                                  className={styles['probability-fill']}
                                  style={{ 
                                    width: `${uni.probability}%`,
                                    background: uni.probability > 75 ? '#10b981' : uni.probability > 50 ? '#f59e0b' : '#ef4444'
                                  }}
                                ></div>
                              </div>
                              <span className={styles['probability-value']}>{uni.probability}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Documents Status */}
                  <div className={`${styles['glass-card']} ${styles['documents-status']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="document" size={20} />
                        Document Status
                      </h3>
                      <Link to="/documents" className={styles['card-link']}>
                        Upload Documents <Icon name="arrow-up-tray" size={14} />
                      </Link>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['documents-list']}>
                        {data.documents?.map(doc => (
                          <div key={doc.id} className={styles['document-item']}>
                            <div className={`${styles['document-icon']} ${styles[`document-icon--${doc.status}`]}`}>
                              <Icon name={doc.icon} size={20} />
                            </div>
                            <div className={styles['document-info']}>
                              <h4>{doc.name}</h4>
                              {doc.uploadedDate && <span>Uploaded: {formatDate(doc.uploadedDate)}</span>}
                            </div>
                            <div className={`${styles['document-status']} ${styles[`document-status--${doc.status}`]}`}>
                              {doc.status === 'required' ? 'Upload Required' : doc.status.replace('-', ' ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles['content-sidebar']}>
                  {/* Messages */}
                  <div className={`${styles['glass-card']} ${styles['messages-widget']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>
                        <Icon name="messages" size={20} />
                        Recent Messages
                      </h3>
                      <Link to="/messages" className={styles['card-link']}>
                        View All <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['messages-list']}>
                        {data.recentMessages?.map(msg => (
                          <div key={msg.id} className={styles['message-item']}>
                            <div className={styles['message-avatar']}>
                              <Icon name="user" size={16} />
                            </div>
                            <div className={styles['message-content']}>
                              <h5>{msg.from}</h5>
                              <p>{msg.message}</p>
                              <span>{formatDate(msg.date)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className={`${styles['glass-card']} ${styles['quick-actions']}`}>
                    <div className={styles['card-header']}>
                      <h3 className={styles['card-title']}>Quick Actions</h3>
                    </div>
                    <div className={styles['card-body']}>
                      <div className={styles['quick-action-grid']}>
                        <Link to="/documents/upload" className={styles['quick-action-btn']}>
                          <Icon name="arrow-up-tray" size={18} />
                          <span>Upload</span>
                        </Link>
                        <Link to="/appointments/new" className={styles['quick-action-btn']}>
                          <Icon name="calendar" size={18} />
                          <span>Book</span>
                        </Link>
                        <Link to="/messages/new" className={styles['quick-action-btn']}>
                          <Icon name="messages" size={18} />
                          <span>Message</span>
                        </Link>
                        <Link to="/applications" className={styles['quick-action-btn']}>
                          <Icon name="eye" size={18} />
                          <span>View</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        );

      default:
        return (
          <div className={styles['error-container']}>
            <Icon name="alert-triangle" size={48} />
            <h2>Invalid user role</h2>
            <p>Please contact administrator.</p>
          </div>
        );
    }
  };

  return (
    <section className={styles.dashboard}>
      {renderDashboard()}
    </section>
  );
}