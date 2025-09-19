import React, { useState } from 'react';
import styles from '@styles/Forms.module.css';
import buttonStyles from '@styles/Buttons.module.css';

export default function StudentForm({ onSubmit, students = [], onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    address: '',
    source: '',
    status: 'New',
    specificNeeds: '',
    budget: '',
    timeline: '',
    nextSteps: '',
    notes: '',
    // NEW: Academic fields
    highestDegree: '',
    currentGPA: '',
    intendedCountry: '',
    assignedConsultant: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sourceOptions = [
    'Website Inquiry',
    'Referral', 
    'Social Media',
    'Email Campaign',
    'Google Ads',
    'LinkedIn',
    'Trade Show',
    'Industry Conference',
    'Cold Outreach',
    'Partner',
    'Networking Event',
    'Direct Mail',
    'Other'
  ];

  const statusOptions = [
    'New',
    'Contacted',
    'Qualified',
    'Nurturing',
    'Proposal Sent',
    'Negotiation',
    'Converted',
    'Lost'
  ];

  const timelineOptions = [
    'Immediate (1-30 days)',
    'Short term (1-3 months)',
    'Medium term (3-6 months)',
    'Long term (6+ months)',
    'No specific timeline',
    'Unknown'
  ];

  const budgetRanges = [
    'Under $5,000',
    '$5,000 - $15,000',
    '$15,000 - $50,000',
    '$50,000 - $100,000',
    '$100,000 - $500,000',
    '$500,000+',
    'To be determined',
    'Budget not disclosed'
  ];

  const validateForm = () => {
    const newErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Email validation
    if (formData.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        // Check for duplicate email (case-insensitive)
        const existingStudent = students.find(s => 
          s.email && 
          s.email.toLowerCase() === formData.email.trim().toLowerCase()
        );
        if (existingStudent) {
          newErrors.email = 'A student with this email already exists';
        }
      }
    }

    // Phone validation (basic)
    if (formData.phone.trim()) {
      const phoneRegex = /^[+]?[\d\s\-()]+$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // At least email or phone should be provided
    if (!formData.email.trim() && !formData.phone.trim()) {
      newErrors.contact = 'Please provide either email or phone number';
    }

    // Company validation (if job title is provided, company should be too)
    if (formData.jobTitle.trim() && !formData.company.trim()) {
      newErrors.company = 'Company name is required when job title is provided';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear contact error when user provides email or phone
    if ((name === 'email' || name === 'phone') && errors.contact) {
      setErrors(prev => ({
        ...prev,
        contact: ''
      }));
    }

    // Clear company error when user provides company after job title
    if (name === 'company' && errors.company) {
      setErrors(prev => ({
        ...prev,
        company: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clean up form data - FIXED: Moved cleanData inside function
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim() || null,
        phone: formData.phone.trim() || null,
        company: formData.company.trim() || null,
        jobTitle: formData.jobTitle.trim() || null,
        address: formData.address.trim() || null,
        source: formData.source || 'Website Inquiry',
        status: formData.status || 'New',
        specificNeeds: formData.specificNeeds.trim() || null,
        budget: formData.budget || null,
        timeline: formData.timeline || null,
        nextSteps: formData.nextSteps.trim() || null,
        notes: formData.notes.trim() || null,
        // NEW: Academic fields
        highestDegree: formData.highestDegree || null,
        currentGPA: formData.currentGPA.trim() || null,
        intendedCountry: formData.intendedCountry || null,
        assignedConsultant: formData.assignedConsultant || null,
        dateCreated: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      };

      await onSubmit(cleanData);
      
      // Reset form on success - FIXED: Include new fields
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        jobTitle: '',
        address: '',
        source: '',
        status: 'New',
        specificNeeds: '',
        budget: '',
        timeline: '',
        nextSteps: '',
        notes: '',
        // NEW: Reset academic fields
        highestDegree: '',
        currentGPA: '',
        intendedCountry: '',
        assignedConsultant: ''
      });
      setErrors({});
      
    } catch (error) {
      console.error('Failed to submit student:', error);
      setErrors({ submit: 'Failed to save student. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      {errors.submit && (
        <div className="alert alert--error">
          {errors.submit}
        </div>
      )}
      
      {errors.contact && (
        <div className="alert alert--warning">
          {errors.contact}
        </div>
      )}

      {/* Basic Contact Information Section */}
      <div className="lead-form__section">
        <h3 className="lead-form__section-title">Basic Contact Information</h3>
        
        <div className="lead-form__row">
          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-name">
              Name <span className={styles['form-required']}>*</span>
            </label>
            <input
              id="student-name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`${styles['form-input']} ${errors.name ? styles['form-input--error'] : ''}`}
              placeholder="Enter full name"
              required
              autoComplete="name"
            />
            {errors.name && (
              <span className={styles['form-error']}>{errors.name}</span>
            )}
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-email">
              Email
            </label>
            <input
              id="student-email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles['form-input']} ${errors.email ? styles['form-input--error'] : ''}`}
              placeholder="email@example.com"
              autoComplete="email"
            />
            {errors.email && (
              <span className={styles['form-error']}>{errors.email}</span>
            )}
          </div>
        </div>

        <div className="lead-form__row">
          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-phone">
              Phone
            </label>
            <input
              id="student-phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className={`${styles['form-input']} ${errors.phone ? styles['form-input--error'] : ''}`}
              placeholder="+977-123-456789"
              autoComplete="tel"
            />
            {errors.phone && (
              <span className={styles['form-error']}>{errors.phone}</span>
            )}
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-company">
              Current Institution
            </label>
            <input
              id="student-company"
              name="company"
              type="text"
              value={formData.company}
              onChange={handleChange}
              className={`${styles['form-input']} ${errors.company ? styles['form-input--error'] : ''}`}
              placeholder="Current school/college"
              autoComplete="organization"
            />
            {errors.company && (
              <span className={styles['form-error']}>{errors.company}</span>
            )}
          </div>
        </div>

        <div className="lead-form__row">
          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-address">
              Physical Address
            </label>
            <input
              id="student-address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={styles['form-input']}
              placeholder="Home address"
              autoComplete="street-address"
            />
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-source">
              How did you hear about us?
            </label>
            <select
              id="student-source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className={`${styles['form-input']} ${styles['form-select']}`}
            >
              <option value="">Select source...</option>
              {sourceOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Academic Background Section */}
      <div className="lead-form__section">
        <h3 className="lead-form__section-title">Academic Background</h3>
        
        <div className="lead-form__row">
          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="highest-degree">
              Highest Degree
            </label>
            <select
              id="highest-degree"
              name="highestDegree"
              value={formData.highestDegree}
              onChange={handleChange}
              className={`${styles['form-input']} ${styles['form-select']}`}
            >
              <option value="">Select degree...</option>
              <option value="high-school">High School</option>
              <option value="bachelor">Bachelor's</option>
              <option value="master">Master's</option>
              <option value="phd">PhD</option>
            </select>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="current-gpa">
              Current GPA
            </label>
            <input
              id="current-gpa"
              name="currentGPA"
              type="text"
              value={formData.currentGPA}
              onChange={handleChange}
              className={styles['form-input']}
              placeholder="3.5"
            />
          </div>
        </div>

        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="intended-country">
            Intended Study Country
          </label>
          <select
            id="intended-country"
            name="intendedCountry"
            value={formData.intendedCountry}
            onChange={handleChange}
            className={`${styles['form-input']} ${styles['form-select']}`}
          >
            <option value="">Select country...</option>
            <option value="usa">United States</option>
            <option value="uk">United Kingdom</option>
            <option value="canada">Canada</option>
            <option value="australia">Australia</option>
            <option value="germany">Germany</option>
            <option value="japan">Japan</option>
            <option value="south-korea">South Korea</option>
          </select>
        </div>
      </div>

      {/* Study Preferences Section */}
      <div className="lead-form__section">
        <h3 className="lead-form__section-title">Study Preferences & Status</h3>
        
        <div className="lead-form__row">
          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-status">
              Status
            </label>
            <select
              id="student-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className={`${styles['form-input']} ${styles['form-select']}`}
            >
              {statusOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="student-timeline">
              Timeline
            </label>
            <select
              id="student-timeline"
              name="timeline"
              value={formData.timeline}
              onChange={handleChange}
              className={`${styles['form-input']} ${styles['form-select']}`}
            >
              <option value="">Select timeline...</option>
              {timelineOptions.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="student-budget">
            Budget Range
          </label>
          <select
            id="student-budget"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className={`${styles['form-input']} ${styles['form-select']}`}
          >
            <option value="">Select budget range...</option>
            {budgetRanges.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="student-specificNeeds">
            Study Goals & Requirements
          </label>
          <textarea
            id="student-specificNeeds"
            name="specificNeeds"
            value={formData.specificNeeds}
            onChange={handleChange}
            className={`${styles['form-input']} ${styles['form-textarea']}`}
            rows="3"
            placeholder="What are you looking to study? (e.g., Computer Science Masters, MBA, Engineering)"
          />
        </div>

        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="student-nextSteps">
            Next Steps
          </label>
          <textarea
            id="student-nextSteps"
            name="nextSteps"
            value={formData.nextSteps}
            onChange={handleChange}
            className={`${styles['form-input']} ${styles['form-textarea']}`}
            rows="2"
            placeholder="What is the next action needed? (e.g., Document review, University research, Application prep)"
          />
        </div>

        <div className={styles['form-group']}>
          <label className={styles['form-label']} htmlFor="student-notes">
            Notes & History
          </label>
          <textarea
            id="student-notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className={`${styles['form-input']} ${styles['form-textarea']}`}
            rows="4"
            placeholder="Consultation history, preferences, important notes"
          />
        </div>
      </div>

      <div className="lead-form__actions">
        {onCancel && (
          <button
            type="button"
            className={`${buttonStyles['action-button']} ${buttonStyles['action-button--secondary']}`}
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`${buttonStyles['action-button']} ${buttonStyles['action-button--primary']}`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Add Student'}
        </button>
      </div>
    </form>
  );
}