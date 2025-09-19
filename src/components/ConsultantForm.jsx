import React, { useState, useEffect } from 'react';
import styles from '@styles/Forms.module.css';
import buttonStyles from '@styles/Buttons.module.css';
import Icon from '@/components/Icon.jsx';

export default function ConsultantForm({ consultant = null, onSubmit, consultants = [], onCancel }) {
  const isEditing = Boolean(consultant);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    branch: 'Main',
    address: '',
    // Professional Background
    education: '',
    experience: '',
    // Specializations - specific university regions/programs
    specializations: [],
    // Expertise - general service areas
    expertise: [],
    // Languages
    languages: [],
    // Availability (basic schedule)
    availability: {
      monday: { enabled: true, start: '09:00', end: '17:00' },
      tuesday: { enabled: true, start: '09:00', end: '17:00' },
      wednesday: { enabled: true, start: '09:00', end: '17:00' },
      thursday: { enabled: true, start: '09:00', end: '17:00' },
      friday: { enabled: true, start: '09:00', end: '17:00' },
      saturday: { enabled: false, start: '10:00', end: '14:00' },
      sunday: { enabled: false, start: '10:00', end: '14:00' }
    },
    // Status
    isActive: true,
    joinedDate: new Date().toISOString().split('T')[0],
    bio: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing consultant data for editing
  useEffect(() => {
    if (isEditing && consultant) {
      setFormData({
        name: consultant.name || '',
        email: consultant.email || '',
        phone: consultant.phone || '',
        branch: consultant.branch || 'Main',
        address: consultant.address || '',
        education: consultant.education || '',
        experience: consultant.experience || '',
        specializations: consultant.specializations || [],
        expertise: consultant.expertise || [],
        languages: consultant.languages || [],
        availability: consultant.availability || formData.availability,
        isActive: consultant.isActive !== undefined ? consultant.isActive : true,
        joinedDate: consultant.joinedDate || new Date().toISOString().split('T')[0],
        bio: consultant.bio || ''
      });
    }
  }, [consultant, isEditing]);

  const branchOptions = ['Main', 'East', 'West', 'Tech', 'Marketing'];
  
  const specializationOptions = [
    { value: 'us-universities', label: 'US Universities', icon: 'flag' },
    { value: 'canada-universities', label: 'Canada Universities', icon: 'flag' },
    { value: 'australia-universities', label: 'Australia Universities', icon: 'flag' },
    { value: 'uk-universities', label: 'UK Universities', icon: 'flag' },
    { value: 'europe-universities', label: 'European Universities', icon: 'flag' },
    { value: 'computer-science', label: 'Computer Science Programs', icon: 'cpu' },
    { value: 'engineering', label: 'Engineering Programs', icon: 'cog' },
    { value: 'business-programs', label: 'Business & MBA Programs', icon: 'briefcase' },
    { value: 'medical-programs', label: 'Medical Programs', icon: 'heart' },
    { value: 'arts-creative', label: 'Arts & Creative Programs', icon: 'palette' },
    { value: 'stem-programs', label: 'STEM Programs', icon: 'beaker' },
    { value: 'graduate-studies', label: 'Graduate Studies', icon: 'graduation-cap' }
  ];

  const expertiseOptions = [
    { value: 'application-guidance', label: 'Application Guidance', icon: 'document' },
    { value: 'visa-assistance', label: 'Visa Assistance', icon: 'globe' },
    { value: 'document-preparation', label: 'Document Preparation', icon: 'folder' },
    { value: 'test-preparation', label: 'Test Preparation', icon: 'clipboard' },
    { value: 'interview-prep', label: 'Interview Preparation', icon: 'microphone' },
    { value: 'scholarship-guidance', label: 'Scholarship Guidance', icon: 'award' },
    { value: 'career-counseling', label: 'Career Counseling', icon: 'users' },
    { value: 'financial-planning', label: 'Financial Planning', icon: 'calculator' }
  ];

  const languageOptions = [
    { value: 'english', label: 'English', icon: 'chat' },
    { value: 'nepali', label: 'Nepali', icon: 'chat' },
    { value: 'hindi', label: 'Hindi', icon: 'chat' },
    { value: 'chinese', label: 'Chinese', icon: 'chat' },
    { value: 'spanish', label: 'Spanish', icon: 'chat' },
    { value: 'french', label: 'French', icon: 'chat' },
    { value: 'german', label: 'German', icon: 'chat' },
    { value: 'japanese', label: 'Japanese', icon: 'chat' },
    { value: 'korean', label: 'Korean', icon: 'chat' },
    { value: 'arabic', label: 'Arabic', icon: 'chat' }
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
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address';
      } else {
        // Check for duplicate email (excluding current consultant if editing)
        const existingConsultant = consultants.find(c => 
          c.email && 
          c.email.toLowerCase() === formData.email.trim().toLowerCase() &&
          (!isEditing || c.id !== consultant.id)
        );
        if (existingConsultant) {
          newErrors.email = 'A consultant with this email already exists';
        }
      }
    }

    // Phone validation
    if (formData.phone.trim()) {
      const phoneRegex = /^[+]?[\d\s\-()]+$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        newErrors.phone = 'Please enter a valid phone number';
      }
    }

    // Specializations validation
    if (formData.specializations.length === 0) {
      newErrors.specializations = 'Please select at least one specialization';
    }

    // Expertise validation
    if (formData.expertise.length === 0) {
      newErrors.expertise = 'Please select at least one area of expertise';
    }

    // Languages validation
    if (formData.languages.length === 0) {
      newErrors.languages = 'Please select at least one language';
    }

    // Join date validation
    if (formData.joinedDate) {
      const joinDate = new Date(formData.joinedDate);
      const today = new Date();
      if (joinDate > today) {
        newErrors.joinedDate = 'Join date cannot be in the future';
      }
    }

    // Education validation
    if (!formData.education.trim()) {
      newErrors.education = 'Education background is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox' && name === 'isActive') {
      setFormData(prev => ({ ...prev, isActive: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Clear specific error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleArrayFieldChange = (fieldName, value) => {
    const isSelected = formData[fieldName].includes(value);
    
    setFormData(prev => ({
      ...prev,
      [fieldName]: isSelected 
        ? prev[fieldName].filter(item => item !== value)
        : [...prev[fieldName], value]
    }));

    // Clear error for this field
    if (errors[fieldName]) {
      setErrors(prev => ({ ...prev, [fieldName]: '' }));
    }
  };

  const handleAvailabilityChange = (day, field, value) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Clean up form data
      const cleanData = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || null,
        branch: formData.branch,
        address: formData.address.trim() || null,
        education: formData.education.trim(),
        experience: formData.experience.trim(),
        specializations: formData.specializations,
        expertise: formData.expertise,
        languages: formData.languages,
        availability: formData.availability,
        isActive: formData.isActive,
        joinedDate: formData.joinedDate || new Date().toISOString().split('T')[0],
        bio: formData.bio.trim() || null,
        // Add performance metrics for new consultants
        ...(!isEditing && {
          assignedStudents: [],
          performanceMetrics: {
            totalStudents: 0,
            activeStudents: 0,
            successRate: 0,
            avgResponseTime: '0 hours',
            completedApplications: 0,
            pendingApplications: 0,
            monthlyTarget: 10,
            monthlyCompleted: 0
          }
        }),
        [isEditing ? 'updatedAt' : 'createdAt']: new Date().toISOString()
      };

      await onSubmit(cleanData);
      
      // Reset form on success (only for new consultants)
      if (!isEditing) {
        setFormData({
          name: '', email: '', phone: '', branch: 'Main', address: '',
          education: '', experience: '', specializations: [], expertise: [], languages: [],
          availability: formData.availability, isActive: true,
          joinedDate: new Date().toISOString().split('T')[0], bio: ''
        });
      }
      setErrors({});
      
    } catch (error) {
      console.error('Failed to submit consultant:', error);
      setErrors({ submit: 'Failed to save consultant. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        .consultant-form { max-width: none; }
        .form-section { margin-bottom: 2rem; padding-bottom: 1.5rem; }
        .form-section:not(:last-child) { border-bottom: 1px solid #f3f4f6; }
        .form-section-title { margin: 0 0 1rem 0; font-size: 1.125rem; font-weight: 600; color: #374151; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .form-row--three { grid-template-columns: 1fr 1fr 1fr; }
        
        .option-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 0.75rem; margin-top: 0.5rem; }
        .option-item { display: flex; align-items: center; gap: 0.75rem; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 8px; cursor: pointer; background: white; transition: all 0.2s ease; position: relative; }
        .option-item:hover { border-color: #d1d5db; background: #f9fafb; }
        .option-item--selected { border-color: #3b82f6; background: #eff6ff; }
        .option-item input { position: absolute; opacity: 0; cursor: pointer; }
        .option-item__icon { flex-shrink: 0; }
        .option-item__label { font-weight: 500; font-size: 0.875rem; }
        .option-item__check { margin-left: auto; color: #3b82f6; }

        .availability-grid { display: grid; gap: 0.5rem; }
        .availability-day { display: grid; grid-template-columns: 100px 1fr 80px 80px; gap: 1rem; align-items: center; padding: 0.75rem; border: 1px solid #e5e7eb; border-radius: 6px; }
        .availability-day__name { font-weight: 500; }
        .availability-day__toggle input { width: 16px; height: 16px; }
        .availability-day__time { display: flex; gap: 0.5rem; align-items: center; }
        .availability-day__time input { padding: 0.25rem 0.5rem; border: 1px solid #e5e7eb; border-radius: 4px; font-size: 0.875rem; }
        .availability-day--disabled { opacity: 0.5; }

        .form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e5e7eb; }

        @media (max-width: 768px) {
          .form-row, .form-row--three { grid-template-columns: 1fr; }
          .option-grid { grid-template-columns: 1fr; }
          .availability-day { grid-template-columns: 1fr; gap: 0.5rem; }
          .availability-day__time { justify-content: space-between; }
        }
      `}</style>

      <form className="consultant-form" onSubmit={handleSubmit} noValidate>
        {errors.submit && (
          <div className="alert alert--error">
            {errors.submit}
          </div>
        )}

        {/* Basic Information */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Icon name="user" size={20} style={{ marginRight: '0.5rem' }} />
            Basic Information
          </h3>
          
          <div className="form-row">
            <div className={styles['form-group']}>
              <label className={styles['form-label']} htmlFor="consultant-name">
                Full Name <span className={styles['form-required']}>*</span>
              </label>
              <input
                id="consultant-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`${styles['form-input']} ${errors.name ? styles['form-input--error'] : ''}`}
                placeholder="Enter full name"
                required
              />
              {errors.name && <span className={styles['form-error']}>{errors.name}</span>}
            </div>

            <div className={styles['form-group']}>
              <label className={styles['form-label']} htmlFor="consultant-email">
                Email <span className={styles['form-required']}>*</span>
              </label>
              <input
                id="consultant-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`${styles['form-input']} ${errors.email ? styles['form-input--error'] : ''}`}
                placeholder="consultant@company.com"
                required
              />
              {errors.email && <span className={styles['form-error']}>{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className={styles['form-group']}>
              <label className={styles['form-label']} htmlFor="consultant-phone">
                Phone Number
              </label>
              <input
                id="consultant-phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className={`${styles['form-input']} ${errors.phone ? styles['form-input--error'] : ''}`}
                placeholder="+977-123-456789"
              />
              {errors.phone && <span className={styles['form-error']}>{errors.phone}</span>}
            </div>

            <div className={styles['form-group']}>
              <label className={styles['form-label']} htmlFor="consultant-branch">
                Branch
              </label>
              <select
                id="consultant-branch"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={styles['form-input']}
              >
                {branchOptions.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="consultant-address">
              Address
            </label>
            <input
              id="consultant-address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className={styles['form-input']}
              placeholder="Office or home address"
            />
          </div>
        </div>

        {/* Professional Background */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Icon name="briefcase" size={20} style={{ marginRight: '0.5rem' }} />
            Professional Background
          </h3>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="consultant-education">
              Education <span className={styles['form-required']}>*</span>
            </label>
            <input
              id="consultant-education"
              name="education"
              type="text"
              value={formData.education}
              onChange={handleChange}
              className={`${styles['form-input']} ${errors.education ? styles['form-input--error'] : ''}`}
              placeholder="e.g., PhD in Computer Science, University of Toronto"
              required
            />
            {errors.education && <span className={styles['form-error']}>{errors.education}</span>}
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="consultant-experience">
              Experience Summary
            </label>
            <textarea
              id="consultant-experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              className={`${styles['form-input']} ${styles['form-textarea']}`}
              rows="3"
              placeholder="Brief summary of relevant experience..."
            />
          </div>
        </div>

        {/* Specializations */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Icon name="star" size={20} style={{ marginRight: '0.5rem' }} />
            University Specializations <span className={styles['form-required']}>*</span>
          </h3>
          
          <div className="option-grid">
            {specializationOptions.map(option => {
              const isSelected = formData.specializations.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`option-item ${isSelected ? 'option-item--selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleArrayFieldChange('specializations', option.value)}
                  />
                  <Icon name={option.icon} size={20} className="option-item__icon" />
                  <span className="option-item__label">{option.label}</span>
                  {isSelected && <Icon name="check" size={14} className="option-item__check" />}
                </label>
              );
            })}
          </div>
          {errors.specializations && <span className={styles['form-error']}>{errors.specializations}</span>}
        </div>

        {/* Expertise Areas */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Icon name="cog" size={20} style={{ marginRight: '0.5rem' }} />
            Service Expertise <span className={styles['form-required']}>*</span>
          </h3>
          
          <div className="option-grid">
            {expertiseOptions.map(option => {
              const isSelected = formData.expertise.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`option-item ${isSelected ? 'option-item--selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleArrayFieldChange('expertise', option.value)}
                  />
                  <Icon name={option.icon} size={20} className="option-item__icon" />
                  <span className="option-item__label">{option.label}</span>
                  {isSelected && <Icon name="check" size={14} className="option-item__check" />}
                </label>
              );
            })}
          </div>
          {errors.expertise && <span className={styles['form-error']}>{errors.expertise}</span>}
        </div>

        {/* Languages */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Icon name="globe" size={20} style={{ marginRight: '0.5rem' }} />
            Languages <span className={styles['form-required']}>*</span>
          </h3>
          
          <div className="option-grid">
            {languageOptions.map(option => {
              const isSelected = formData.languages.includes(option.value);
              return (
                <label
                  key={option.value}
                  className={`option-item ${isSelected ? 'option-item--selected' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleArrayFieldChange('languages', option.value)}
                  />
                  <Icon name={option.icon} size={20} className="option-item__icon" />
                  <span className="option-item__label">{option.label}</span>
                  {isSelected && <Icon name="check" size={14} className="option-item__check" />}
                </label>
              );
            })}
          </div>
          {errors.languages && <span className={styles['form-error']}>{errors.languages}</span>}
        </div>

        {/* Availability Schedule */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Icon name="calendar" size={20} style={{ marginRight: '0.5rem' }} />
            Weekly Availability
          </h3>
          
          <div className="availability-grid">
            {Object.entries(formData.availability).map(([day, schedule]) => (
              <div key={day} className={`availability-day ${!schedule.enabled ? 'availability-day--disabled' : ''}`}>
                <div className="availability-day__name">
                  {day.charAt(0).toUpperCase() + day.slice(1)}
                </div>
                <div className="availability-day__toggle">
                  <input
                    type="checkbox"
                    checked={schedule.enabled}
                    onChange={(e) => handleAvailabilityChange(day, 'enabled', e.target.checked)}
                  />
                  <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem' }}>Available</span>
                </div>
                {schedule.enabled && (
                  <div className="availability-day__time">
                    <input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Professional Details */}
        <div className="form-section">
          <h3 className="form-section-title">
            <Icon name="settings" size={20} style={{ marginRight: '0.5rem' }} />
            Professional Details
          </h3>
          
          <div className="form-row">
            <div className={styles['form-group']}>
              <label className={styles['form-label']} htmlFor="consultant-joindate">
                Join Date
              </label>
              <input
                id="consultant-joindate"
                name="joinedDate"
                type="date"
                value={formData.joinedDate}
                onChange={handleChange}
                className={`${styles['form-input']} ${errors.joinedDate ? styles['form-input--error'] : ''}`}
              />
              {errors.joinedDate && <span className={styles['form-error']}>{errors.joinedDate}</span>}
            </div>

            <div className={styles['form-group']} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <input
                id="consultant-active"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                style={{ width: '16px', height: '16px' }}
              />
              <label className={styles['form-label']} htmlFor="consultant-active">
                Active Consultant
              </label>
            </div>
          </div>

          <div className={styles['form-group']}>
            <label className={styles['form-label']} htmlFor="consultant-bio">
              Bio / Notes
            </label>
            <textarea
              id="consultant-bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              className={`${styles['form-input']} ${styles['form-textarea']}`}
              rows="4"
              placeholder="Brief bio, special notes, or additional information about this consultant"
            />
          </div>
        </div>

        {/* Form Actions */}
        <div className="form-actions">
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
            {isSubmitting 
              ? (isEditing ? 'Updating Consultant...' : 'Adding Consultant...') 
              : (isEditing ? 'Update Consultant' : 'Add Consultant')
            }
          </button>
        </div>
      </form>
    </>
  );
}