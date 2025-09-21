// src/App.js
import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import { NotificationProvider } from './components/NotificationContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Layout from './components/Layout.jsx';

// Import public pages
import HomePage from './pages/HomePage.jsx';
import PricingPage from './pages/PricingPage.jsx';
import BlogPage from './pages/Blog.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from '@/pages/RegisterPage.jsx';

// Import your existing pages
import Students from './pages/Students/Students.jsx';
import StudentDetail from './pages/Students/StudentDetail.jsx';
import StudentApplication from './pages/Students/StudentApplication.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DocumentsPage from './pages/DocumentsPage.jsx';
import MessagesPage from './pages/MessagesPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import Consultants from './pages/Consultants.jsx';
import ConsultantsDetail from './pages/ConsultantsDetail.jsx';
import ConsultantSchedule from './pages/ConsultantSchedule.jsx';

// Import project management pages
import Projects from './pages/Projects.jsx';
import ProjectDetail from './pages/ProjectDetail.jsx';
import ProjectForm from './pages/ProjectForm.jsx';

import ApplicationPipeline from './pages/ApplicationPipeline.jsx';
import UniversityApps from './pages/UniversityApps.jsx';
import VisaApplications from './pages/VisaApplications.jsx';
import Unauthorized from './pages/Unauthorized.jsx';

 // Import Global CSS
import './styles/App.css';

// 🔧 FIXED: Role-based root route logic
function RootRoute() {
  const { isAuthenticated, user } = useAuth();
  
  // If not authenticated, show homepage
  if (!isAuthenticated) {
    return <HomePage />;
  }
  
  // 🎯 KEY FIX: Role-based redirection for authenticated users
  switch (user?.role) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'consultant':
    case 'client':
    case 'student':
      return <Navigate to="/dashboard" replace />;
    default:
      // Unknown role, redirect to login for safety
      return <Navigate to="/login" replace />;
  }
}

// 🔧 FIXED: Role-based dashboard route component
function DashboardRoute() {
  const { user } = useAuth();
  
  // Prevent admin from accessing regular dashboard
  if (user?.role === 'admin') {
    return <Navigate to="/admin" replace />;
  }
  
  // Allow other roles to access regular dashboard
  return <Dashboard />;
}

// 🔧 FIXED: Admin dashboard route component
function AdminRoute() {
  const { user } = useAuth();
  
  // Only admin can access admin dashboard
  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <AdminDashboard />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<RootRoute />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/blog" element={<BlogPage />} />
      
      {/* Protected routes - require authentication */}
      <Route element={<ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}><Layout /></ProtectedRoute>}>
        
        {/* 🎯 KEY FIX: Role-specific dashboard routes */}
        <Route path="dashboard" element={
          <ProtectedRoute allowedRoles={['consultant', 'student', 'client']}>
            <DashboardRoute />
          </ProtectedRoute>
        } />
        
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminRoute />
          </ProtectedRoute>
        } />
        
        {/* 🔒 STUDENT DATA - Admin & Consultant only (privacy protection) */}
        <Route path="students" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant']}>
            <Students />
          </ProtectedRoute>
        } />
        <Route path="students/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant']}>
            <StudentDetail />
          </ProtectedRoute>
        } />
        <Route path="students/:id/applications" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant']}>
            <StudentApplication />
          </ProtectedRoute>
        } />
        
        {/* 📄 PERSONAL DATA - All authenticated users (students see their own data) */}
        <Route path="documents" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <DocumentsPage />
          </ProtectedRoute>
        } />
        <Route path="messages" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <MessagesPage />
          </ProtectedRoute>
        } />
        <Route path="applications" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <ApplicationPipeline />
          </ProtectedRoute>
        } />
        <Route path="university-apps" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <UniversityApps />
          </ProtectedRoute>
        } />
        <Route path="visa-applications" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <VisaApplications />
          </ProtectedRoute>
        } />
        
        {/* 👥 CONSULTANT ACCESS - All users can view consultants */}
        <Route path="consultants" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <Consultants />
          </ProtectedRoute>
        } />
        <Route path="consultants/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <ConsultantsDetail />
          </ProtectedRoute>
        } />
        <Route path="consultants/:id/schedule" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant']}>
            <ConsultantSchedule />
          </ProtectedRoute>
        } />
        
        {/* 📋 PROJECT MANAGEMENT - View: All users, Modify: Admin/Consultant only */}
        <Route path="projects" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <Projects />
          </ProtectedRoute>
        } />
        <Route path="projects/new" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant']}>
            <ProjectForm />
          </ProtectedRoute>
        } />
        <Route path="projects/:id" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant', 'student', 'client']}>
            <ProjectDetail />
          </ProtectedRoute>
        } />
        <Route path="projects/:id/edit" element={
          <ProtectedRoute allowedRoles={['admin', 'consultant']}>
            <ProjectForm />
          </ProtectedRoute>
        } />
      </Route>

      {/* 🔧 FIXED: Catch-all route - role-based redirect */}
      <Route path="*" element={<RootRoute />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}