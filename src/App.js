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

// Component to handle root route logic
function RootRoute() {
  const { isAuthenticated } = useAuth();
  
  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  // If not authenticated, show homepage
  return <HomePage />;
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
        {/* Dashboard - accessible to all authenticated users */}
        <Route path="dashboard" element={<Dashboard />} />
        
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
        <Route path="documents" element={<DocumentsPage />} />
        <Route path="messages" element={<MessagesPage />} />
        <Route path="applications" element={<ApplicationPipeline />} />
        <Route path="university-apps" element={<UniversityApps />} />
        <Route path="visa-applications" element={<VisaApplications />} />
        
        {/* 👥 CONSULTANT ACCESS - All users can view consultants */}
        <Route path="consultants" element={<Consultants />} />
        <Route path="consultants/:id" element={<ConsultantsDetail />} />
        <Route path="consultants/:id/schedule" element={<ConsultantSchedule />} />
        
        {/* 📋 PROJECT MANAGEMENT - View: All users, Modify: Admin only */}
        <Route path="projects" element={<Projects />} />
        <Route path="projects/new" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProjectForm />
          </ProtectedRoute>
        } />
        <Route path="projects/:id" element={<ProjectDetail />} />
        <Route path="projects/:id/edit" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <ProjectForm />
          </ProtectedRoute>
        } />
        
        {/* 🔒 ADMIN ONLY */}
        <Route path="admin" element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Route>

      {/* Catch-all route - redirect to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
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