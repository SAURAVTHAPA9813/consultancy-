import React, { useState } from 'react';

function LeadForm({ onSubmit, leads }) {
  const [form, setForm] = useState({ name: '', email: '' });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    else if (form.name.length < 3) newErrors.name = 'Name must be at least 3 characters';
    else if (leads.some(lead => lead.name === form.name)) newErrors.name = 'Name must be unique';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = 'Invalid email format';
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onSubmit({ id: Date.now(), name: form.name, status: 'active', email: form.email });
      setForm({ name: '', email: '' });
      setErrors({});
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <button type="submit">Add Lead</button>
      </form>
    </div>
  );
}

export default LeadForm;