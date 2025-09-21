import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon.jsx';
import { useAuth } from '@/components/AuthContext.jsx';
import { api } from '@/lib/api.js';

// Utility functions
const formatCurrency = (amount) => `Rs. ${amount.toLocaleString()}`;
const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
};

// Enhanced mock data with comprehensive admin features
const getAdminDashboardData = () => ({
  kpis: {
    monthlyRevenue: 2850000,
    revenueGrowth: 23.5,
    newStudents: 47,
    newStudentsGrowth: 18.2,
    conversionRate: 67,
    conversionGrowth: 4.8,
    activeStudents: 156,
    activeGrowth: 12.3
  },
  revenueChart: [
    { month: 'Jul', amount: 1800000, target: 2000000 },
    { month: 'Aug', amount: 2100000, target: 2200000 },
    { month: 'Sep', amount: 1950000, target: 2100000 },
    { month: 'Oct', amount: 2400000, target: 2300000 },
    { month: 'Nov', amount: 2650000, target: 2500000 },
    { month: 'Dec', amount: 2850000, target: 2600000 }
  ],
  studentPipeline: [
    { stage: 'Initial Consultation', count: 156, percentage: 100, color: '#6366f1' },
    { stage: 'Documents Collection', count: 134, percentage: 86, color: '#8b5cf6' },
    { stage: 'University Application', count: 89, percentage: 57, color: '#06b6d4' },
    { stage: 'Offer Received', count: 67, percentage: 43, color: '#10b981' },
    { stage: 'Visa Application', count: 52, percentage: 33, color: '#f59e0b' },
    { stage: 'Successfully Placed', count: 45, percentage: 29, color: '#059669' }
  ],
  topConsultants: [
    { id: 1, name: 'Dr. Nishan Timilsina', students: 45, successRate: 94, revenue: 850000, avatar: 'NT' },
    { id: 2, name: 'Jenish Neupane', students: 38, successRate: 87, revenue: 720000, avatar: 'JN' },
    { id: 3, name: 'Sakura Ghimire', students: 32, successRate: 91, revenue: 640000, avatar: 'SG' },
    { id: 4, name: 'Amit Sharma', students: 28, successRate: 83, revenue: 520000, avatar: 'AS' },
    { id: 5, name: 'Priya Thapa', students: 25, successRate: 89, revenue: 480000, avatar: 'PT' }
  ],
  destinations: [
    { country: 'Canada', students: 68, percentage: 43.6, growth: 15.2, flag: '🇨🇦' },
    { country: 'Australia', students: 34, percentage: 21.8, growth: 8.7, flag: '🇦🇺' },
    { country: 'USA', students: 28, percentage: 17.9, growth: -3.2, flag: '🇺🇸' },
    { country: 'UK', students: 18, percentage: 11.5, growth: 12.1, flag: '🇬🇧' },
    { country: 'Germany', students: 8, percentage: 5.1, growth: 33.3, flag: '🇩🇪' }
  ],
  consultantList: [
    { id: 1, name: 'Dr. Nishan Timilsina', email: 'nishan@agency.com', activeStudents: 45, successRate: 94, lastLogin: '2025-01-20T09:15:00', status: 'online', avatar: 'NT' },
    { id: 2, name: 'Jenish Neupane', email: 'jenish@agency.com', activeStudents: 38, successRate: 87, lastLogin: '2025-01-20T08:45:00', status: 'online', avatar: 'JN' },
    { id: 3, name: 'Sakura Ghimire', email: 'sakura@agency.com', activeStudents: 32, successRate: 91, lastLogin: '2025-01-19T17:30:00', status: 'offline', avatar: 'SG' },
    { id: 4, name: 'Amit Sharma', email: 'amit@agency.com', activeStudents: 28, successRate: 83, lastLogin: '2025-01-20T07:20:00', status: 'busy', avatar: 'AS' },
    { id: 5, name: 'Priya Thapa', email: 'priya@agency.com', activeStudents: 25, successRate: 89, lastLogin: '2025-01-20T09:00:00', status: 'online', avatar: 'PT' }
  ],
  activityFeed: [
    { id: 1, type: 'application', user: 'Jenish Neupane', action: 'submitted application for Ramesh Sharma to University of Toronto', time: '5 minutes ago', priority: 'medium' },
    { id: 2, type: 'lead', user: 'System', action: 'new lead received from website - Maya Gurung', time: '12 minutes ago', priority: 'high' },
    { id: 3, type: 'offer', user: 'Sakura Ghimire', action: 'received offer letter for Bikash Thapa from Monash University', time: '25 minutes ago', priority: 'high' },
    { id: 4, type: 'payment', user: 'Priya Thapa', action: 'payment received from Suresh Rai - Rs. 45,000', time: '1 hour ago', priority: 'medium' },
    { id: 5, type: 'document', user: 'Dr. Nishan', action: 'reviewed and approved documents for Arjun Lama', time: '1 hour ago', priority: 'low' }
  ],
  urgentAlerts: [
    { id: 1, type: 'unassigned', message: '3 new leads need consultant assignment', count: 3, priority: 'high' },
    { id: 2, type: 'overdue', message: '8 tasks are overdue across all consultants', count: 8, priority: 'high' },
    { id: 3, type: 'deadline', message: '5 application deadlines in next 72 hours', count: 5, priority: 'medium' },
    { id: 4, type: 'documents', message: '12 documents pending verification', count: 12, priority: 'medium' }
  ]
});

export default function AdminDashboard() {
  const { user, branch } = useAuth();
  const [data, setData] = useState({ loading: true });
  const [selectedView, setSelectedView] = useState('overview');
  const [selectedConsultant, setSelectedConsultant] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const dashboardData = getAdminDashboardData();
        setData({ ...dashboardData, loading: false });
      } catch (error) {
        console.error('Failed to load admin dashboard:', error);
        setData({ loading: false });
      }
    };

    loadDashboardData();
  }, []);

  if (data.loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
          <div className="spinner-ring"></div>
        </div>
        <p>Loading admin dashboard...</p>
      </div>
    );
  }

  const viewAsConsultant = (consultant) => {
    setSelectedConsultant(consultant);
    // In a real app, this would switch the user's view context
    console.log(`Viewing as consultant: ${consultant.name}`);
  };

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

        .admin-dashboard {
          position: relative;
          min-height: 100vh;
          background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
          color: var(--text);
        }

        .admin-dashboard::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 25% 25%, var(--primary) 0%, transparent 50%),
                      radial-gradient(circle at 75% 75%, var(--secondary) 0%, transparent 50%),
                      radial-gradient(circle at 50% 50%, var(--info) 0%, transparent 60%);
          opacity: 0.08;
          animation: float 25s ease-in-out infinite;
          pointer-events: none;
          z-index: 0;
        }

        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          25% { transform: translate(-20px, -15px) scale(1.05) rotate(2deg); }
          50% { transform: translate(15px, -10px) scale(0.95) rotate(-1deg); }
          75% { transform: translate(-10px, 20px) scale(1.02) rotate(1deg); }
        }

        .admin-dashboard > * {
          position: relative;
          z-index: 1;
        }

        .dashboard-container {
          padding: 2rem;
          max-width: 1800px;
          margin: 0 auto;
        }

        /* Header Section */
        .dashboard-header {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: 2.5rem;
          border-radius: 20px;
          box-shadow: var(--shadow-card);
          border: 1px solid var(--glass-border);
          margin-bottom: 2rem;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2rem;
        }

        .header-content {
          flex: 1;
        }

        .dashboard-title {
          margin: 0 0 0.75rem 0;
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary-light), var(--secondary), var(--info));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.03em;
        }

        .dashboard-subtitle {
          margin: 0 0 1rem 0;
          color: var(--text-secondary);
          font-size: 1.2rem;
          line-height: 1.6;
        }

        .branch-info {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          border-radius: 8px;
          border: 1px solid var(--glass-border);
          font-size: 0.875rem;
          color: var(--text-muted);
        }

        /* Navigation Tabs */
        .view-navigation {
          display: flex;
          gap: 0.5rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          padding: 0.5rem;
          border-radius: 12px;
          border: 1px solid var(--glass-border);
        }

        .nav-tab {
          padding: 0.75rem 1.5rem;
          background: transparent;
          border: none;
          border-radius: 8px;
          color: var(--text-secondary);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-tab.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.4);
        }

        .nav-tab:hover:not(.active) {
          background: var(--glass-bg);
          color: var(--text);
        }

        /* KPI Cards */
        .kpi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .kpi-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .kpi-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          border-radius: 16px 16px 0 0;
        }

        .kpi-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }

        .kpi-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .kpi-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
        }

        .kpi-trend {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .kpi-trend.positive {
          background: rgba(16, 185, 129, 0.15);
          color: var(--success);
        }

        .kpi-trend.negative {
          background: rgba(239, 68, 68, 0.15);
          color: var(--danger);
        }

        .kpi-value {
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, var(--primary-light), var(--secondary));
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem 0;
        }

        .kpi-label {
          color: var(--text-secondary);
          font-size: 1rem;
          font-weight: 500;
          margin: 0;
        }

        /* Main Content Grid */
        .main-content {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .content-left {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .content-right {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        /* Glass Cards */
        .glass-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-glow);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--glass-border);
        }

        .card-title {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--text);
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .card-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--primary-light);
          text-decoration: none;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
        }

        .card-link:hover {
          color: var(--primary);
        }

        /* Pipeline Funnel */
        .pipeline-funnel {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .pipeline-stage {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }

        .pipeline-stage:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .stage-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .stage-info {
          flex: 1;
        }

        .stage-name {
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem 0;
          font-size: 0.95rem;
        }

        .stage-count {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin: 0;
        }

        .stage-bar {
          flex: 2;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }

        .stage-fill {
          height: 100%;
          border-radius: 4px;
          transition: width 0.6s ease;
        }

        /* Revenue Chart */
        .revenue-chart {
          height: 300px;
          display: flex;
          align-items: end;
          gap: 1rem;
          padding: 2rem 1rem 1rem;
          position: relative;
        }

        .chart-bar {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
        }

        .bar-container {
          position: relative;
          width: 100%;
          height: 200px;
          display: flex;
          align-items: end;
          justify-content: center;
        }

        .bar-actual {
          width: 60%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          border-radius: 4px 4px 0 0;
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
          transition: all 0.3s ease;
        }

        .bar-target {
          position: absolute;
          top: 0;
          width: 60%;
          height: 2px;
          background: var(--warning);
          border-radius: 2px;
        }

        .bar-label {
          color: var(--text-secondary);
          font-size: 0.8rem;
          font-weight: 600;
        }

        .bar-value {
          color: var(--text);
          font-size: 0.75rem;
          text-align: center;
          margin-top: 0.25rem;
        }

        /* Top Consultants */
        .consultant-ranking {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .consultant-rank-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }

        .consultant-rank-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .rank-position {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 0.8rem;
        }

        .consultant-avatar-small {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: var(--glass-bg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.8rem;
          border: 1px solid var(--glass-border);
        }

        .consultant-info {
          flex: 1;
        }

        .consultant-name {
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
        }

        .consultant-stats {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin: 0;
        }

        .consultant-revenue {
          text-align: right;
          color: var(--success);
          font-weight: 700;
          font-size: 0.9rem;
        }

        /* Destinations */
        .destinations-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .destination-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }

        .destination-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .country-flag {
          font-size: 1.5rem;
        }

        .destination-info {
          flex: 1;
        }

        .country-name {
          font-weight: 600;
          color: var(--text);
          margin: 0 0 0.25rem 0;
        }

        .student-count {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin: 0;
        }

        .growth-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .growth-indicator.positive {
          color: var(--success);
        }

        .growth-indicator.negative {
          color: var(--danger);
        }

        /* Activity Feed */
        .activity-timeline {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .activity-item {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          border-radius: 12px;
          border: 1px solid var(--glass-border);
          transition: all 0.3s ease;
        }

        .activity-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .activity-icon.application {
          background: rgba(99, 102, 241, 0.2);
          color: var(--primary);
        }

        .activity-icon.lead {
          background: rgba(16, 185, 129, 0.2);
          color: var(--success);
        }

        .activity-icon.offer {
          background: rgba(245, 158, 11, 0.2);
          color: var(--warning);
        }

        .activity-icon.payment {
          background: rgba(6, 182, 212, 0.2);
          color: var(--info);
        }

        .activity-icon.document {
          background: rgba(139, 92, 246, 0.2);
          color: var(--secondary);
        }

        .activity-content {
          flex: 1;
        }

        .activity-message {
          color: var(--text);
          font-size: 0.9rem;
          margin: 0 0 0.25rem 0;
          line-height: 1.4;
        }

        .activity-time {
          color: var(--text-muted);
          font-size: 0.75rem;
        }

        /* Urgent Alerts */
        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .alert-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border-radius: 12px;
          border: 1px solid;
          transition: all 0.3s ease;
        }

        .alert-item.high {
          background: rgba(239, 68, 68, 0.1);
          border-color: rgba(239, 68, 68, 0.3);
        }

        .alert-item.medium {
          background: rgba(245, 158, 11, 0.1);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .alert-icon {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .alert-item.high .alert-icon {
          background: rgba(239, 68, 68, 0.2);
          color: var(--danger);
        }

        .alert-item.medium .alert-icon {
          background: rgba(245, 158, 11, 0.2);
          color: var(--warning);
        }

        .alert-content {
          flex: 1;
        }

        .alert-message {
          color: var(--text);
          font-weight: 600;
          margin: 0;
          font-size: 0.9rem;
        }

        .alert-count {
          background: var(--danger);
          color: white;
          padding: 0.25rem 0.5rem;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 700;
        }

        /* Team Management View */
        .team-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .consultant-card {
          background: var(--glass-bg);
          backdrop-filter: blur(20px);
          padding: 1.5rem;
          border-radius: 16px;
          border: 1px solid var(--glass-border);
          box-shadow: var(--shadow-card);
          transition: all 0.3s ease;
        }

        .consultant-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-glow);
        }

        .consultant-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .consultant-avatar-large {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--secondary));
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          font-size: 1.2rem;
        }

        .consultant-details h3 {
          margin: 0 0 0.25rem 0;
          color: var(--text);
          font-size: 1.1rem;
          font-weight: 600;
        }

        .consultant-details p {
          margin: 0;
          color: var(--text-secondary);
          font-size: 0.85rem;
        }

        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          position: absolute;
          top: -2px;
          right: -2px;
        }

        .status-indicator.online {
          background: var(--success);
          box-shadow: 0 0 8px rgba(16, 185, 129, 0.5);
        }

        .status-indicator.busy {
          background: var(--warning);
          box-shadow: 0 0 8px rgba(245, 158, 11, 0.5);
        }

        .status-indicator.offline {
          background: var(--text-muted);
        }

        .consultant-metrics {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .metric {
          text-align: center;
          padding: 1rem;
          background: var(--glass-bg-light);
          border-radius: 8px;
          border: 1px solid var(--glass-border);
        }

        .metric-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--primary-light);
          margin: 0 0 0.25rem 0;
        }

        .metric-label {
          color: var(--text-secondary);
          font-size: 0.8rem;
          margin: 0;
        }

        .consultant-actions {
          display: flex;
          gap: 0.75rem;
        }

        .action-btn {
          flex: 1;
          padding: 0.75rem 1rem;
          border: 1px solid var(--glass-border);
          border-radius: 8px;
          background: var(--glass-bg-light);
          backdrop-filter: blur(10px);
          color: var(--text);
          font-weight: 600;
          font-size: 0.8rem;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          text-align: center;
        }

        .action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
        }

        .action-btn.primary {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark));
          border-color: var(--primary);
          color: white;
        }

        .action-btn.primary:hover {
          background: linear-gradient(135deg, var(--primary-light), var(--primary));
        }

        /* Loading States */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: var(--text-secondary);
        }

        .loading-spinner {
          position: relative;
          width: 60px;
          height: 60px;
          margin-bottom: 2rem;
        }

        .spinner-ring {
          position: absolute;
          width: 60px;
          height: 60px;
          border: 3px solid transparent;
          border-top: 3px solid var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        .spinner-ring:nth-child(2) {
          animation-delay: 0.1s;
          border-top-color: var(--secondary);
        }

        .spinner-ring:nth-child(3) {
          animation-delay: 0.2s;
          border-top-color: var(--info);
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Responsive Design */
        @media (max-width: 1200px) {
          .main-content {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 768px) {
          .dashboard-container {
            padding: 1rem;
          }

          .dashboard-header {
            padding: 1.5rem;
          }

          .header-top {
            flex-direction: column;
            gap: 1rem;
          }

          .dashboard-title {
            font-size: 2rem;
          }

          .kpi-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .team-grid {
            grid-template-columns: 1fr;
          }

          .view-navigation {
            flex-wrap: wrap;
          }
        }
      `}</style>

      <div className="admin-dashboard">
        <div className="dashboard-container">
          {/* Header */}
          <div className="dashboard-header">
            <div className="header-top">
              <div className="header-content">
                <h1 className="dashboard-title">Admin Dashboard</h1>
                <p className="dashboard-subtitle">
                  Comprehensive business performance and team management overview
                </p>
                <div className="branch-info">
                  <Icon name="building-office" size={16} />
                  <span>{branch} Branch • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>
             
            </div>

            {/* Navigation */}
            <div className="view-navigation">
              <button 
                className={`nav-tab ${selectedView === 'overview' ? 'active' : ''}`}
                onClick={() => setSelectedView('overview')}
              >
                <Icon name="chart-bar" size={16} />
                Business Performance
              </button>
              <button 
                className={`nav-tab ${selectedView === 'team' ? 'active' : ''}`}
                onClick={() => setSelectedView('team')}
              >
                <Icon name="users" size={16} />
                Team Management
              </button>
              <button 
                className={`nav-tab ${selectedView === 'operations' ? 'active' : ''}`}
                onClick={() => setSelectedView('operations')}
              >
                <Icon name="cog" size={16} />
                Operations
              </button>
              <button 
                className={`nav-tab ${selectedView === 'system' ? 'active' : ''}`}
                onClick={() => setSelectedView('system')}
              >
                <Icon name="server" size={16} />
                System
              </button>
            </div>
          </div>

          {/* Business Performance View */}
          {selectedView === 'overview' && (
            <>
              {/* KPIs */}
              <div className="kpi-grid">
                <div className="kpi-card">
                  <div className="kpi-header">
                    <div className="kpi-icon">
                      <Icon name="currency-dollar" size={24} />
                    </div>
                    <div className="kpi-trend positive">
                      <Icon name="trending-up" size={12} />
                      +{data.kpis?.revenueGrowth}%
                    </div>
                  </div>
                  <div className="kpi-value">{formatCurrency(data.kpis?.monthlyRevenue)}</div>
                  <p className="kpi-label">Monthly Revenue</p>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <div className="kpi-icon">
                      <Icon name="user-plus" size={24} />
                    </div>
                    <div className="kpi-trend positive">
                      <Icon name="trending-up" size={12} />
                      +{data.kpis?.newStudentsGrowth}%
                    </div>
                  </div>
                  <div className="kpi-value">{data.kpis?.newStudents}</div>
                  <p className="kpi-label">New Students This Month</p>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <div className="kpi-icon">
                      <Icon name="chart-pie" size={24} />
                    </div>
                    <div className="kpi-trend positive">
                      <Icon name="trending-up" size={12} />
                      +{data.kpis?.conversionGrowth}%
                    </div>
                  </div>
                  <div className="kpi-value">{data.kpis?.conversionRate}%</div>
                  <p className="kpi-label">Conversion Rate</p>
                </div>

                <div className="kpi-card">
                  <div className="kpi-header">
                    <div className="kpi-icon">
                      <Icon name="users" size={24} />
                    </div>
                    <div className="kpi-trend positive">
                      <Icon name="trending-up" size={12} />
                      +{data.kpis?.activeGrowth}%
                    </div>
                  </div>
                  <div className="kpi-value">{data.kpis?.activeStudents}</div>
                  <p className="kpi-label">Total Active Students</p>
                </div>
              </div>

              {/* Main Content */}
              <div className="main-content">
                <div className="content-left">
                  {/* Revenue Trend */}
                  <div className="glass-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <Icon name="chart-line" size={20} />
                        Revenue Trend (6 Months)
                      </h3>
                    </div>
                    <div className="revenue-chart">
                      {data.revenueChart?.map((item, index) => (
                        <div key={index} className="chart-bar">
                          <div className="bar-container">
                            <div 
                              className="bar-actual"
                              style={{ height: `${(item.amount / 3000000) * 100}%` }}
                            />
                            <div 
                              className="bar-target"
                              style={{ bottom: `${(item.target / 3000000) * 100}%` }}
                            />
                          </div>
                          <div className="bar-label">{item.month}</div>
                          <div className="bar-value">{formatCurrency(item.amount)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Pipeline */}
                  <div className="glass-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <Icon name="funnel" size={20} />
                        Student Pipeline Funnel
                      </h3>
                    </div>
                    <div className="pipeline-funnel">
                      {data.studentPipeline?.map((stage, index) => (
                        <div key={index} className="pipeline-stage">
                          <div 
                            className="stage-indicator"
                            style={{ backgroundColor: stage.color }}
                          />
                          <div className="stage-info">
                            <h4 className="stage-name">{stage.stage}</h4>
                            <p className="stage-count">{stage.count} students ({stage.percentage}%)</p>
                          </div>
                          <div className="stage-bar">
                            <div 
                              className="stage-fill"
                              style={{ 
                                width: `${stage.percentage}%`,
                                backgroundColor: stage.color 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="content-right">
                  {/* Top Consultants */}
                  <div className="glass-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <Icon name="trophy" size={20} />
                        Top Performing Consultants
                      </h3>
                      <Link to="/consultants" className="card-link">
                        View All <Icon name="arrow-right" size={14} />
                      </Link>
                    </div>
                    <div className="consultant-ranking">
                      {data.topConsultants?.slice(0, 5).map((consultant, index) => (
                        <div key={consultant.id} className="consultant-rank-item">
                          <div className="rank-position">{index + 1}</div>
                          <div className="consultant-avatar-small">{consultant.avatar}</div>
                          <div className="consultant-info">
                            <h4 className="consultant-name">{consultant.name}</h4>
                            <p className="consultant-stats">{consultant.students} students • {consultant.successRate}% success</p>
                          </div>
                          <div className="consultant-revenue">{formatCurrency(consultant.revenue)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Destinations */}
                  <div className="glass-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <Icon name="globe" size={20} />
                        Popular Destinations
                      </h3>
                    </div>
                    <div className="destinations-list">
                      {data.destinations?.map((dest, index) => (
                        <div key={index} className="destination-item">
                          <div className="country-flag">{dest.flag}</div>
                          <div className="destination-info">
                            <h4 className="country-name">{dest.country}</h4>
                            <p className="student-count">{dest.students} students ({dest.percentage}%)</p>
                          </div>
                          <div className={`growth-indicator ${dest.growth > 0 ? 'positive' : 'negative'}`}>
                            <Icon name={dest.growth > 0 ? 'trending-up' : 'trending-down'} size={12} />
                            {Math.abs(dest.growth)}%
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity and Alerts */}
              <div className="main-content">
                <div className="content-left">
                  <div className="glass-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <Icon name="activity" size={20} />
                        Global Activity Feed
                      </h3>
                    </div>
                    <div className="activity-timeline">
                      {data.activityFeed?.map((activity) => (
                        <div key={activity.id} className="activity-item">
                          <div className={`activity-icon ${activity.type}`}>
                            <Icon name={activity.type === 'application' ? 'document-text' : 
                                        activity.type === 'lead' ? 'user-plus' :
                                        activity.type === 'offer' ? 'trophy' :
                                        activity.type === 'payment' ? 'credit-card' : 'folder'} size={16} />
                          </div>
                          <div className="activity-content">
                            <p className="activity-message">{activity.action}</p>
                            <span className="activity-time">{activity.time}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="content-right">
                  <div className="glass-card">
                    <div className="card-header">
                      <h3 className="card-title">
                        <Icon name="exclamation-triangle" size={20} />
                        Urgent Alerts
                      </h3>
                    </div>
                    <div className="alerts-list">
                      {data.urgentAlerts?.map((alert) => (
                        <div key={alert.id} className={`alert-item ${alert.priority}`}>
                          <div className="alert-icon">
                            <Icon name="exclamation-triangle" size={16} />
                          </div>
                          <div className="alert-content">
                            <p className="alert-message">{alert.message}</p>
                          </div>
                          <div className="alert-count">{alert.count}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Team Management View */}
          {selectedView === 'team' && (
            <div className="team-grid">
              {data.consultantList?.map((consultant) => (
                <div key={consultant.id} className="consultant-card">
                  <div className="consultant-header">
                    <div style={{ position: 'relative' }}>
                      <div className="consultant-avatar-large">{consultant.avatar}</div>
                      <div className={`status-indicator ${consultant.status}`}></div>
                    </div>
                    <div className="consultant-details">
                      <h3>{consultant.name}</h3>
                      <p>{consultant.email}</p>
                      <p>Last login: {formatTime(consultant.lastLogin)}</p>
                    </div>
                  </div>

                  <div className="consultant-metrics">
                    <div className="metric">
                      <div className="metric-value">{consultant.activeStudents}</div>
                      <p className="metric-label">Active Students</p>
                    </div>
                    <div className="metric">
                      <div className="metric-value">{consultant.successRate}%</div>
                      <p className="metric-label">Success Rate</p>
                    </div>
                  </div>

                  <div className="consultant-actions">
                    <button 
                      className="action-btn primary"
                      onClick={() => viewAsConsultant(consultant)}
                    >
                      <Icon name="eye" size={14} />
                      View As
                    </button>
                    <Link to={`/consultants/${consultant.id}`} className="action-btn">
                      <Icon name="cog" size={14} />
                      Manage
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Other views would go here */}
          {selectedView === 'operations' && (
            <div className="glass-card">
              <h3 className="card-title">
                <Icon name="cog" size={20} />
                Operational Oversight
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>Coming soon - Advanced operational management features</p>
            </div>
          )}

          {selectedView === 'system' && (
            <div className="glass-card">
              <h3 className="card-title">
                <Icon name="server" size={20} />
                System & Content Management
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>Coming soon - System configuration and content management</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}