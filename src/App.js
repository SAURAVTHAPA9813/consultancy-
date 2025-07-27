import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Header from './components/Header.jsx';
import LeadPage from './pages/LeadPage.jsx'; 
import DocumentsPage from './pages/DocumentsPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

const Navigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  return (
    <nav>
      <Link to="/">Home</Link> | <Link to="/leads">Leads</Link> | <Link to="/documents">Documents</Link> |
      {isAuthenticated ? (
        <>
          <Link to="/admin">Admin</Link> | <span>Welcome, {user.username} ({user.role})!</span> <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </nav>
  );
};

function App() {
  const [leads, setLeads] = useState([]);
  useEffect(() => {
    const customLeads = [{ id: 1, name: 'Client1', status: 'active', email: 'client1@example.com' }, { id: 2, name: 'Client2', status: 'inactive', email: 'client2@example.com' }, { id: 3, name: 'Client3', status: 'active', email: 'client3@example.com' }];
    setLeads(customLeads);
  }, []);
  const handleFormSubmit = (newLead) => setLeads(prev => [...prev, newLead]);
  const handleDeleteLead = (leadId) => setLeads(prev => prev.filter(lead => lead.id !== leadId));

  return (
    <AuthProvider>
      <Router>
        <div>
          <Header />
          <Navigation />
          <Routes>
            <Route path="/" element={<LeadPage leads={leads} onFormSubmit={handleFormSubmit} onDeleteLead={handleDeleteLead} />} />
            <Route path="/leads" element={<LeadPage leads={leads} onFormSubmit={handleFormSubmit} onDeleteLead={handleDeleteLead} />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          </Routes>
          <p>Welcome to Consultancy Management!</p>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;