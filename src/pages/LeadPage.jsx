import React, { useEffect, useState } from 'react';
import Counter from '../components/Counter.jsx';
import LeadForm from '../components/LeadForm.jsx';
import { useAuth } from '../components/AuthContext.jsx';
import LeadCard from '../components/LeadCard.jsx';

function LeadPage({ onFormSubmit, onDeleteLead }) {
  const { user } = useAuth();
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const customLeads = [
          { id: 1, name: 'Client1', status: 'active' },
          { id: 2, name: 'Client2', status: 'inactive' },
          { id: 3, name: 'Client3', status: 'active' },
        ];
        await new Promise(resolve => setTimeout(resolve, 1000));
        setLeads(customLeads);
        setError(null);
      } catch (err) {
        setError('Failed to fetch leads');
      } finally {
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || lead.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <p>Loading leads...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Leads Management</h2>
      <Counter />
      <div>
        <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search by name..." />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="all">All</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>
      <h3>Leads List:</h3>
      {filteredLeads.length > 0 ? (
        <ul>
          {filteredLeads.map(lead => (
            <LeadCard key={lead.id} lead={lead} onDelete={onDeleteLead} isAdmin={user?.role === 'admin'} />
          ))}
        </ul>
      ) : (
        <p>No leads available.</p>
      )}
      <h3>Add Lead:</h3>
      <LeadForm onSubmit={onFormSubmit} leads={leads} />
    </div>
  );
}

export default LeadPage;