import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/components/AuthContext.jsx';
import { useNotifications } from '@/components/NotificationContext.jsx';
import { api } from '@/lib/api.js';
import Icon from '@/components/Icon.jsx';

export default function ConsultantSchedule() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  
  const [consultant, setConsultant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('weekly');
  const [hasChanges, setHasChanges] = useState(false);
  
  // Schedule configuration
  const [weeklySchedule, setWeeklySchedule] = useState({
    monday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    tuesday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    wednesday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    thursday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    friday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
    saturday: { enabled: false, start: '10:00', end: '14:00', breakStart: '', breakEnd: '' },
    sunday: { enabled: false, start: '10:00', end: '14:00', breakStart: '', breakEnd: '' }
  });
  
  const [timeSlotConfig, setTimeSlotConfig] = useState({
    duration: 60, // minutes
    bufferTime: 15, // minutes between appointments
    maxAdvanceBooking: 30, // days
    minAdvanceBooking: 1 // days
  });
  
  const [blockedDates, setBlockedDates] = useState([
    { id: 1, date: '2025-01-15', reason: 'Personal Leave', type: 'full-day' },
    { id: 2, date: '2025-01-20', start: '14:00', end: '16:00', reason: 'Training Session', type: 'partial-day' }
  ]);
  
  const [scheduleTemplates, setScheduleTemplates] = useState([
    { 
      id: 1, 
      name: 'Standard Business Hours', 
      description: 'Monday-Friday 9AM-5PM with lunch break',
      schedule: {
        monday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
        tuesday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
        wednesday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
        thursday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
        friday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
        saturday: { enabled: false, start: '10:00', end: '14:00', breakStart: '', breakEnd: '' },
        sunday: { enabled: false, start: '10:00', end: '14:00', breakStart: '', breakEnd: '' }
      }
    },
    { 
      id: 2, 
      name: 'Extended Hours', 
      description: 'Monday-Friday 8AM-7PM, Saturday mornings',
      schedule: {
        monday: { enabled: true, start: '08:00', end: '19:00', breakStart: '12:00', breakEnd: '13:00' },
        tuesday: { enabled: true, start: '08:00', end: '19:00', breakStart: '12:00', breakEnd: '13:00' },
        wednesday: { enabled: true, start: '08:00', end: '19:00', breakStart: '12:00', breakEnd: '13:00' },
        thursday: { enabled: true, start: '08:00', end: '19:00', breakStart: '12:00', breakEnd: '13:00' },
        friday: { enabled: true, start: '08:00', end: '19:00', breakStart: '12:00', breakEnd: '13:00' },
        saturday: { enabled: true, start: '09:00', end: '13:00', breakStart: '', breakEnd: '' },
        sunday: { enabled: false, start: '10:00', end: '14:00', breakStart: '', breakEnd: '' }
      }
    },
    { 
      id: 3, 
      name: 'Weekend Focus', 
      description: 'Friday-Sunday availability for weekend clients',
      schedule: {
        monday: { enabled: false, start: '09:00', end: '17:00', breakStart: '', breakEnd: '' },
        tuesday: { enabled: false, start: '09:00', end: '17:00', breakStart: '', breakEnd: '' },
        wednesday: { enabled: false, start: '09:00', end: '17:00', breakStart: '', breakEnd: '' },
        thursday: { enabled: false, start: '09:00', end: '17:00', breakStart: '', breakEnd: '' },
        friday: { enabled: true, start: '10:00', end: '18:00', breakStart: '13:00', breakEnd: '14:00' },
        saturday: { enabled: true, start: '09:00', end: '17:00', breakStart: '12:00', breakEnd: '13:00' },
        sunday: { enabled: true, start: '10:00', end: '16:00', breakStart: '', breakEnd: '' }
      }
    }
  ]);

  // Recurring patterns state
  const [recurringPatterns, setRecurringPatterns] = useState([
    { id: 1, name: 'Weekdays Only', pattern: 'monday-friday', active: true },
    { id: 2, name: 'Weekends Only', pattern: 'saturday-sunday', active: false },
    { id: 3, name: 'Every Day', pattern: 'daily', active: false }
  ]);

  // Block date form state
  const [showBlockDateForm, setShowBlockDateForm] = useState(false);
  const [blockDateForm, setBlockDateForm] = useState({
    date: '',
    startDate: '',
    endDate: '',
    start: '',
    end: '',
    reason: '',
    type: 'full-day',
    recurring: false,
    recurringType: 'weekly'
  });

  // Export modal state
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [exportDateRange, setExportDateRange] = useState({ start: '', end: '' });

  const canEdit = user?.role === 'admin' || user?.id === parseInt(id);

  useEffect(() => {
    loadConsultantData();
  }, [id]);

  const loadConsultantData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Mock consultant data - replace with actual API call
      const mockConsultant = {
        id: parseInt(id),
        name: id === '1' ? 'Dr. Nishan Timilsina' : id === '2' ? 'Jenish Neupane' : 'Sakura Ghimire',
        email: id === '1' ? 'nishan@consultancy.com' : id === '2' ? 'jenish@consultancy.com' : 'sakura@consultancy.com',
        timezone: 'Asia/Kathmandu'
      };
      
      setConsultant(mockConsultant);
      
      // Set default export date range (next 30 days)
      const today = new Date();
      const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
      setExportDateRange({
        start: today.toISOString().split('T')[0],
        end: nextMonth.toISOString().split('T')[0]
      });
      
    } catch (err) {
      setError('Failed to load consultant data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleScheduleChange = (day, field, value) => {
    setWeeklySchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
    setHasChanges(true);
  };

  const handleTimeSlotConfigChange = (field, value) => {
    setTimeSlotConfig(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
  };

  const applyRecurringPattern = (pattern) => {
    let newSchedule = { ...weeklySchedule };
    
    switch (pattern) {
      case 'monday-friday':
        Object.keys(newSchedule).forEach(day => {
          if (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].includes(day)) {
            newSchedule[day] = { 
              ...newSchedule[day], 
              enabled: true, 
              start: '09:00', 
              end: '17:00',
              breakStart: '12:00',
              breakEnd: '13:00'
            };
          } else {
            newSchedule[day] = { ...newSchedule[day], enabled: false };
          }
        });
        break;
      case 'saturday-sunday':
        Object.keys(newSchedule).forEach(day => {
          if (['saturday', 'sunday'].includes(day)) {
            newSchedule[day] = { 
              ...newSchedule[day], 
              enabled: true, 
              start: '10:00', 
              end: '16:00',
              breakStart: '',
              breakEnd: ''
            };
          } else {
            newSchedule[day] = { ...newSchedule[day], enabled: false };
          }
        });
        break;
      case 'daily':
        Object.keys(newSchedule).forEach(day => {
          newSchedule[day] = { 
            ...newSchedule[day], 
            enabled: true, 
            start: '09:00', 
            end: '17:00',
            breakStart: '12:00',
            breakEnd: '13:00'
          };
        });
        break;
    }
    
    setWeeklySchedule(newSchedule);
    setHasChanges(true);
    
    addNotification({
      type: 'success',
      title: 'Pattern Applied',
      message: `${pattern.replace('-', ' to ')} pattern has been applied`,
      category: 'schedule'
    });
  };

  const handleBlockDateSubmit = (e) => {
    e.preventDefault();
    
    if (blockDateForm.type === 'date-range') {
      // Create blocked dates for date range
      const start = new Date(blockDateForm.startDate);
      const end = new Date(blockDateForm.endDate);
      const dates = [];
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push({
          id: Date.now() + Math.random(),
          date: d.toISOString().split('T')[0],
          reason: blockDateForm.reason,
          type: 'full-day'
        });
      }
      
      setBlockedDates(prev => [...prev, ...dates]);
    } else {
      const newBlockedDate = {
        id: Date.now(),
        date: blockDateForm.date,
        start: blockDateForm.start,
        end: blockDateForm.end,
        reason: blockDateForm.reason,
        type: blockDateForm.type
      };
      
      setBlockedDates(prev => [...prev, newBlockedDate]);
    }
    
    setHasChanges(true);
    setShowBlockDateForm(false);
    setBlockDateForm({
      date: '',
      startDate: '',
      endDate: '',
      start: '',
      end: '',
      reason: '',
      type: 'full-day',
      recurring: false,
      recurringType: 'weekly'
    });
    
    addNotification({
      type: 'success',
      title: 'Blocked Date Added',
      message: 'Date has been blocked successfully',
      category: 'schedule'
    });
  };

  const removeBlockedDate = (id) => {
    setBlockedDates(prev => prev.filter(date => date.id !== id));
    setHasChanges(true);
  };

  const generateTimeSlots = (day) => {
    const schedule = weeklySchedule[day];
    if (!schedule.enabled) return [];
    
    const slots = [];
    const start = new Date(`2000-01-01T${schedule.start}:00`);
    const end = new Date(`2000-01-01T${schedule.end}:00`);
    const breakStart = schedule.breakStart ? new Date(`2000-01-01T${schedule.breakStart}:00`) : null;
    const breakEnd = schedule.breakEnd ? new Date(`2000-01-01T${schedule.breakEnd}:00`) : null;
    
    let current = new Date(start);
    
    while (current < end) {
      const slotEnd = new Date(current.getTime() + timeSlotConfig.duration * 60000);
      
      // Skip if slot overlaps with break time
      if (breakStart && breakEnd) {
        if (!(slotEnd <= breakStart || current >= breakEnd)) {
          current = new Date(current.getTime() + timeSlotConfig.duration * 60000);
          continue;
        }
      }
      
      if (slotEnd <= end) {
        slots.push({
          start: current.toTimeString().slice(0, 5),
          end: slotEnd.toTimeString().slice(0, 5),
          day: day
        });
      }
      
      current = new Date(current.getTime() + (timeSlotConfig.duration + timeSlotConfig.bufferTime) * 60000);
    }
    
    return slots;
  };

  const generateAllAvailableSlots = (startDate, endDate) => {
    const slots = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      const dayName = current.toLocaleDateString('en-US', { weekday: 'lowercase' });
      const dateStr = current.toISOString().split('T')[0];
      
      // Check if date is blocked
      const isBlocked = blockedDates.some(blocked => 
        blocked.date === dateStr && blocked.type === 'full-day'
      );
      
      if (!isBlocked) {
        const daySlots = generateTimeSlots(dayName);
        daySlots.forEach(slot => {
          // Check if specific time is blocked
          const isTimeBlocked = blockedDates.some(blocked => 
            blocked.date === dateStr && 
            blocked.type === 'partial-day' &&
            blocked.start <= slot.start && 
            blocked.end >= slot.end
          );
          
          if (!isTimeBlocked) {
            slots.push({
              ...slot,
              date: dateStr,
              datetime: `${dateStr}T${slot.start}:00`,
              consultantId: parseInt(id)
            });
          }
        });
      }
      
      current.setDate(current.getDate() + 1);
    }
    
    return slots;
  };

  const exportScheduleData = () => {
    const availableSlots = generateAllAvailableSlots(
      new Date(exportDateRange.start),
      new Date(exportDateRange.end)
    );
    
    const exportData = {
      consultant: {
        id: consultant.id,
        name: consultant.name,
        email: consultant.email,
        timezone: consultant.timezone
      },
      dateRange: exportDateRange,
      weeklySchedule,
      timeSlotConfig,
      blockedDates,
      availableSlots,
      totalSlots: availableSlots.length,
      exportedAt: new Date().toISOString()
    };
    
    let content, filename, mimeType;
    
    switch (exportFormat) {
      case 'json':
        content = JSON.stringify(exportData, null, 2);
        filename = `schedule-${consultant.name.toLowerCase().replace(/\s+/g, '-')}-${exportDateRange.start}-to-${exportDateRange.end}.json`;
        mimeType = 'application/json';
        break;
      case 'csv':
        const csvHeaders = 'Date,Day,Start Time,End Time,Duration,Available\n';
        const csvRows = availableSlots.map(slot => 
          `${slot.date},${slot.day},${slot.start},${slot.end},${timeSlotConfig.duration}m,true`
        ).join('\n');
        content = csvHeaders + csvRows;
        filename = `schedule-${consultant.name.toLowerCase().replace(/\s+/g, '-')}-${exportDateRange.start}-to-${exportDateRange.end}.csv`;
        mimeType = 'text/csv';
        break;
      case 'ical':
        let icalContent = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Consultancy//Schedule//EN\n';
        availableSlots.forEach(slot => {
          icalContent += `BEGIN:VEVENT\n`;
          icalContent += `UID:${slot.date}-${slot.start}-${consultant.id}@consultancy.com\n`;
          icalContent += `DTSTART:${slot.datetime.replace(/[-:]/g, '')}00\n`;
          icalContent += `DTEND:${slot.datetime.replace(/[-:]/g, '')}${String(parseInt(slot.end.replace(':', '')) + timeSlotConfig.duration).padStart(4, '0')}00\n`;
          icalContent += `SUMMARY:Available - ${consultant.name}\n`;
          icalContent += `DESCRIPTION:Available consultation slot\n`;
          icalContent += `END:VEVENT\n`;
        });
        icalContent += 'END:VCALENDAR';
        content = icalContent;
        filename = `schedule-${consultant.name.toLowerCase().replace(/\s+/g, '-')}-${exportDateRange.start}-to-${exportDateRange.end}.ics`;
        mimeType = 'text/calendar';
        break;
    }
    
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    setShowExportModal(false);
    addNotification({
      type: 'success',
      title: 'Schedule Exported',
      message: `Schedule data exported as ${exportFormat.toUpperCase()}`,
      category: 'schedule'
    });
  };

  const applyTemplate = (template) => {
    setWeeklySchedule(template.schedule);
    setHasChanges(true);
    addNotification({
      type: 'success',
      title: 'Template Applied',
      message: `${template.name} template has been applied`,
      category: 'schedule'
    });
  };

  const saveSchedule = async () => {
    try {
      // Save schedule to API
      // await api.consultants.updateSchedule(id, { weeklySchedule, timeSlotConfig, blockedDates });
      
      setHasChanges(false);
      addNotification({
        type: 'success',
        title: 'Schedule Saved',
        message: 'Your availability schedule has been updated',
        category: 'schedule'
      });
    } catch (err) {
      console.error('Failed to save schedule:', err);
      addNotification({
        type: 'error',
        title: 'Save Failed',
        message: 'Failed to save schedule changes',
        category: 'schedule'
      });
    }
  };

  const resetSchedule = () => {
    if (window.confirm('Are you sure you want to reset all changes?')) {
      loadConsultantData(); // Reload original data
      setHasChanges(false);
    }
  };

  const getDayName = (day) => {
    return day.charAt(0).toUpperCase() + day.slice(1);
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getTotalWeeklySlots = () => {
    return Object.keys(weeklySchedule).reduce((total, day) => {
      return total + generateTimeSlots(day).length;
    }, 0);
  };

  if (loading) {
    return (
      <div className="schedule-manager">
        <div className="loading-state">
          <Icon name="clock" size={24} />
          <p>Loading schedule...</p>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="schedule-manager">
        <div className="error-state">
          <Icon name="x-mark" size={24} />
          <p>{error || 'Consultant not found'}</p>
          <button onClick={() => navigate('/consultants')} className="action-button">
            Back to Consultants
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* INLINE STYLES */}
      <style>{`
        .schedule-manager {
          padding: var(--space-6, 24px);
          max-width: 1200px;
          margin: 0 auto;
        }

        .schedule-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: var(--space-4, 16px);
          margin-bottom: var(--space-6, 24px);
          padding-bottom: var(--space-4, 16px);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
        }

        .schedule-header__info {
          flex: 1;
        }

        .schedule-header__title {
          margin: 0 0 var(--space-1, 4px) 0;
          font-size: var(--font-2xl, 24px);
          font-weight: var(--font-bold, 700);
          color: var(--color-text, #111827);
        }

        .schedule-header__subtitle {
          margin: 0 0 var(--space-2, 8px) 0;
          color: var(--color-text-muted, #6b7280);
          font-size: var(--font-sm, 14px);
        }

        .schedule-stats {
          display: flex;
          gap: var(--space-4, 16px);
          margin-top: var(--space-2, 8px);
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: var(--space-1, 4px);
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
        }

        .schedule-actions {
          display: flex;
          gap: var(--space-2, 8px);
          flex-wrap: wrap;
        }

        .action-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.55rem 0.85rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
          font-weight: var(--font-medium, 500);
          cursor: pointer;
          transition: all 0.12s ease;
          text-decoration: none;
        }

        .action-button:hover {
          transform: translateY(-1px);
          background: var(--color-surface-hover, #f9fafb);
        }

        .action-button--primary {
          background: var(--color-primary, #2563eb);
          border-color: var(--color-primary, #2563eb);
          color: var(--color-text-inverse, #fff);
        }

        .action-button--primary:hover {
          background: var(--color-primary-dark, #1e40af);
          border-color: var(--color-primary-dark, #1e40af);
        }

        .action-button--success {
          background: var(--color-success, #10b981);
          border-color: var(--color-success, #10b981);
          color: white;
        }

        .action-button--danger {
          background: var(--color-error, #ef4444);
          border-color: var(--color-error, #ef4444);
          color: white;
        }

        .action-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }

        .changes-indicator {
          background: #fef3c7;
          color: #92400e;
          padding: var(--space-3, 12px) var(--space-4, 16px);
          border-radius: var(--radius-md, 8px);
          border: 1px solid #fcd34d;
          margin-bottom: var(--space-4, 16px);
          display: flex;
          align-items: center;
          gap: var(--space-2, 8px);
        }

        .tabs {
          display: flex;
          border-bottom: 1px solid var(--color-border, #e5e7eb);
          margin-bottom: var(--space-6, 24px);
        }

        .tab {
          padding: var(--space-3, 12px) var(--space-4, 16px);
          border: none;
          background: transparent;
          color: var(--color-text-muted, #6b7280);
          font-weight: var(--font-medium, 500);
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.12s ease;
        }

        .tab:hover {
          color: var(--color-text, #111827);
        }

        .tab--active {
          color: var(--color-primary, #2563eb);
          border-bottom-color: var(--color-primary, #2563eb);
        }

        .schedule-card {
          background: var(--color-surface, #fff);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-lg, 12px);
          overflow: hidden;
          margin-bottom: var(--space-4, 16px);
        }

        .schedule-card__header {
          padding: var(--space-4, 16px) var(--space-5, 20px);
          border-bottom: 1px solid var(--color-border, #e5e7eb);
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .schedule-card__title {
          margin: 0;
          font-size: var(--font-lg, 18px);
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .schedule-card__body {
          padding: var(--space-5, 20px);
        }

        .recurring-patterns {
          display: flex;
          gap: var(--space-2, 8px);
          margin-bottom: var(--space-4, 16px);
          flex-wrap: wrap;
        }

        .pattern-button {
          padding: 0.5rem 1rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .pattern-button:hover {
          background: var(--color-primary, #2563eb);
          color: white;
          border-color: var(--color-primary, #2563eb);
        }

        .weekly-schedule {
          display: grid;
          gap: var(--space-3, 12px);
        }

        .schedule-day {
          display: grid;
          grid-template-columns: 100px 80px 120px 120px 120px 120px 80px;
          gap: var(--space-3, 12px);
          align-items: center;
          padding: var(--space-4, 16px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          transition: all 0.12s ease;
        }

        .schedule-day:hover {
          background: var(--color-surface-hover, #f9fafb);
        }

        .schedule-day--disabled {
          opacity: 0.5;
          background: var(--color-bg, #f9fafb);
        }

        .schedule-day__name {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
        }

        .schedule-day__toggle input {
          width: 16px;
          height: 16px;
        }

        .schedule-day__input {
          padding: 0.25rem 0.5rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-sm, 6px);
          font-size: var(--font-sm, 14px);
        }

        .schedule-day__input:focus {
          outline: none;
          border-color: var(--color-primary, #2563eb);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .schedule-day__slots {
          font-size: var(--font-xs, 12px);
          color: var(--color-text-muted, #6b7280);
        }

        .config-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: var(--space-4, 16px);
        }

        .config-item {
          display: flex;
          flex-direction: column;
          gap: var(--space-1, 4px);
        }

        .config-label {
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
          font-size: var(--font-sm, 14px);
        }

        .config-input {
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          font-size: var(--font-sm, 14px);
        }

        .config-input:focus {
          outline: none;
          border-color: var(--color-primary, #2563eb);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .blocked-dates-list {
          display: flex;
          flex-direction: column;
          gap: var(--space-3, 12px);
        }

        .blocked-date-item {
          display: flex;
          align-items: center;
          gap: var(--space-3, 12px);
          padding: var(--space-3, 12px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-surface, #fff);
        }

        .blocked-date-item__icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-error, #ef4444);
          display: grid;
          place-items: center;
          color: white;
          flex-shrink: 0;
        }

        .blocked-date-item__content {
          flex: 1;
        }

        .blocked-date-item__title {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .blocked-date-item__details {
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
          margin: 0;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: var(--space-3, 12px);
        }

        .template-card {
          padding: var(--space-4, 16px);
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-surface, #fff);
          cursor: pointer;
          transition: all 0.12s ease;
        }

        .template-card:hover {
          border-color: var(--color-primary, #2563eb);
          background: var(--color-surface-hover, #f9fafb);
        }

        .template-card__name {
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
          margin: 0 0 var(--space-1, 4px) 0;
        }

        .template-card__description {
          font-size: var(--font-sm, 14px);
          color: var(--color-text-muted, #6b7280);
          margin: 0;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: var(--color-surface, #fff);
          border-radius: var(--radius-lg, 12px);
          padding: var(--space-6, 24px);
          max-width: 500px;
          width: 90%;
          max-height: 90vh;
          overflow-y: auto;
        }

        .modal__header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: var(--space-4, 16px);
        }

        .modal__title {
          margin: 0;
          font-size: var(--font-xl, 20px);
          font-weight: var(--font-semibold, 600);
          color: var(--color-text, #111827);
        }

        .modal__close {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: var(--radius-md, 8px);
          color: var(--color-text-muted, #6b7280);
        }

        .modal__close:hover {
          background: var(--color-surface-hover, #f9fafb);
          color: var(--color-text, #111827);
        }

        .form-group {
          margin-bottom: var(--space-4, 16px);
        }

        .form-label {
          display: block;
          font-weight: var(--font-medium, 500);
          color: var(--color-text, #111827);
          margin-bottom: var(--space-1, 4px);
        }

        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.5rem 0.75rem;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: var(--radius-md, 8px);
          background: var(--color-surface, #fff);
          color: var(--color-text, #111827);
        }

        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary, #2563eb);
          box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .form-radio-group {
          display: flex;
          gap: var(--space-4, 16px);
          margin-top: var(--space-2, 8px);
        }

        .form-radio {
          display: flex;
          align-items: center;
          gap: var(--space-1, 4px);
        }

        .time-slots-preview {
          margin-top: var(--space-4, 16px);
          padding: var(--space-4, 16px);
          background: var(--color-bg, #f9fafb);
          border-radius: var(--radius-md, 8px);
          border: 1px solid var(--color-border, #e5e7eb);
        }

        .slots-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .slot-item {
          padding: 0.25rem 0.5rem;
          background: white;
          border: 1px solid var(--color-border, #e5e7eb);
          border-radius: 4px;
          font-size: 12px;
        }

        .export-stats {
          background: var(--color-bg, #f9fafb);
          padding: var(--space-3, 12px);
          border-radius: var(--radius-md, 8px);
          margin-bottom: var(--space-4, 16px);
        }

        .loading-state, .error-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem 2rem;
          text-align: center;
          color: var(--color-text-muted, #6b7280);
        }

        @media (max-width: 768px) {
          .schedule-header {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .schedule-day {
            grid-template-columns: 1fr;
            gap: var(--space-2, 8px);
          }
          
          .config-grid {
            grid-template-columns: 1fr;
          }
          
          .template-grid {
            grid-template-columns: 1fr;
          }

          .recurring-patterns {
            flex-direction: column;
          }

          .modal {
            width: 95%;
            margin: 1rem;
          }
        }
      `}</style>

      <div className="schedule-manager">
        {/* Header */}
        <div className="schedule-header">
          <div className="schedule-header__info">
            <h1 className="schedule-header__title">Schedule Management - {consultant.name}</h1>
            <p className="schedule-header__subtitle">
              Configure your availability, time slots, and blocked dates
            </p>
            <div className="schedule-stats">
              <div className="stat-item">
                <Icon name="clock" size={16} />
                <span>{getTotalWeeklySlots()} slots per week</span>
              </div>
              <div className="stat-item">
                <Icon name="calendar" size={16} />
                <span>{blockedDates.length} blocked dates</span>
              </div>
              <div className="stat-item">
                <Icon name="globe" size={16} />
                <span>{consultant.timezone}</span>
              </div>
            </div>
          </div>
          
          <div className="schedule-actions">
            <Link to={`/consultants/${consultant.id}`} className="action-button">
              <Icon name="arrow-left" size={16} />
              Back to Profile
            </Link>

            <button 
              className="action-button action-button--success"
              onClick={() => setShowExportModal(true)}
            >
              <Icon name="download" size={16} />
              Export Schedule
            </button>
            
            {canEdit && (
              <>
                <button 
                  className="action-button"
                  onClick={resetSchedule}
                  disabled={!hasChanges}
                >
                  <Icon name="refresh" size={16} />
                  Reset Changes
                </button>
                
                <button 
                  className="action-button action-button--primary"
                  onClick={saveSchedule}
                  disabled={!hasChanges}
                >
                  <Icon name="save" size={16} />
                  Save Schedule
                </button>
              </>
            )}
          </div>
        </div>

        {/* Changes Indicator */}
        {hasChanges && (
          <div className="changes-indicator">
            <Icon name="warning" size={16} />
            <span>You have unsaved changes to your schedule</span>
          </div>
        )}

        {/* Tabs */}
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'weekly' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('weekly')}
          >
            Weekly Schedule
          </button>
          <button 
            className={`tab ${activeTab === 'timeslots' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('timeslots')}
          >
            Time Slot Settings
          </button>
          <button 
            className={`tab ${activeTab === 'blocked' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('blocked')}
          >
            Blocked Dates ({blockedDates.length})
          </button>
          <button 
            className={`tab ${activeTab === 'templates' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('templates')}
          >
            Schedule Templates
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'weekly' && (
          <div className="schedule-card">
            <div className="schedule-card__header">
              <h3 className="schedule-card__title">
                <Icon name="calendar" size={20} />
                Weekly Availability
              </h3>
            </div>
            <div className="schedule-card__body">
              {/* Recurring Patterns */}
              <div>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text, #111827)' }}>
                  Quick Apply Patterns:
                </h4>
                <div className="recurring-patterns">
                  <button 
                    className="pattern-button"
                    onClick={() => applyRecurringPattern('monday-friday')}
                    disabled={!canEdit}
                  >
                    Weekdays Only (Mon-Fri)
                  </button>
                  <button 
                    className="pattern-button"
                    onClick={() => applyRecurringPattern('saturday-sunday')}
                    disabled={!canEdit}
                  >
                    Weekends Only (Sat-Sun)
                  </button>
                  <button 
                    className="pattern-button"
                    onClick={() => applyRecurringPattern('daily')}
                    disabled={!canEdit}
                  >
                    Every Day
                  </button>
                </div>
              </div>

              <div className="weekly-schedule">
                <div className="schedule-day" style={{ fontWeight: '600', background: 'var(--color-bg, #f9fafb)' }}>
                  <div>Day</div>
                  <div>Available</div>
                  <div>Start Time</div>
                  <div>End Time</div>
                  <div>Break Start</div>
                  <div>Break End</div>
                  <div>Slots</div>
                </div>
                
                {Object.entries(weeklySchedule).map(([day, schedule]) => (
                  <div 
                    key={day} 
                    className={`schedule-day ${!schedule.enabled ? 'schedule-day--disabled' : ''}`}
                  >
                    <div className="schedule-day__name">{getDayName(day)}</div>
                    
                    <div className="schedule-day__toggle">
                      <input
                        type="checkbox"
                        checked={schedule.enabled}
                        onChange={(e) => handleScheduleChange(day, 'enabled', e.target.checked)}
                        disabled={!canEdit}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="schedule-day__input"
                        value={schedule.start}
                        onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                        disabled={!schedule.enabled || !canEdit}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="schedule-day__input"
                        value={schedule.end}
                        onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                        disabled={!schedule.enabled || !canEdit}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="schedule-day__input"
                        value={schedule.breakStart}
                        onChange={(e) => handleScheduleChange(day, 'breakStart', e.target.value)}
                        disabled={!schedule.enabled || !canEdit}
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="schedule-day__input"
                        value={schedule.breakEnd}
                        onChange={(e) => handleScheduleChange(day, 'breakEnd', e.target.value)}
                        disabled={!schedule.enabled || !canEdit}
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div className="schedule-day__slots">
                      {schedule.enabled ? `${generateTimeSlots(day).length} slots` : 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'timeslots' && (
          <div className="schedule-card">
            <div className="schedule-card__header">
              <h3 className="schedule-card__title">
                <Icon name="clock" size={20} />
                Time Slot Configuration
              </h3>
            </div>
            <div className="schedule-card__body">
              <div className="config-grid">
                <div className="config-item">
                  <label className="config-label">Appointment Duration</label>
                  <select
                    className="config-input"
                    value={timeSlotConfig.duration}
                    onChange={(e) => handleTimeSlotConfigChange('duration', parseInt(e.target.value))}
                    disabled={!canEdit}
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                    <option value={90}>90 minutes</option>
                    <option value={120}>120 minutes</option>
                  </select>
                </div>
                
                <div className="config-item">
                  <label className="config-label">Buffer Time Between Appointments</label>
                  <select
                    className="config-input"
                    value={timeSlotConfig.bufferTime}
                    onChange={(e) => handleTimeSlotConfigChange('bufferTime', parseInt(e.target.value))}
                    disabled={!canEdit}
                  >
                    <option value={0}>No buffer</option>
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                  </select>
                </div>
                
                <div className="config-item">
                  <label className="config-label">Maximum Advance Booking</label>
                  <select
                    className="config-input"
                    value={timeSlotConfig.maxAdvanceBooking}
                    onChange={(e) => handleTimeSlotConfigChange('maxAdvanceBooking', parseInt(e.target.value))}
                    disabled={!canEdit}
                  >
                    <option value={7}>1 week</option>
                    <option value={14}>2 weeks</option>
                    <option value={30}>1 month</option>
                    <option value={60}>2 months</option>
                    <option value={90}>3 months</option>
                  </select>
                </div>
                
                <div className="config-item">
                  <label className="config-label">Minimum Advance Booking</label>
                  <select
                    className="config-input"
                    value={timeSlotConfig.minAdvanceBooking}
                    onChange={(e) => handleTimeSlotConfigChange('minAdvanceBooking', parseInt(e.target.value))}
                    disabled={!canEdit}
                  >
                    <option value={0}>Same day</option>
                    <option value={1}>1 day</option>
                    <option value={2}>2 days</option>
                    <option value={7}>1 week</option>
                  </select>
                </div>
              </div>
              
              {/* Preview of generated slots */}
              <div className="time-slots-preview">
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--color-text, #111827)' }}>
                  Preview: Monday Time Slots ({generateTimeSlots('monday').length} slots)
                </h4>
                <div className="slots-grid">
                  {generateTimeSlots('monday').map((slot, index) => (
                    <span key={index} className="slot-item">
                      {slot.start} - {slot.end}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'blocked' && (
          <div className="schedule-card">
            <div className="schedule-card__header">
              <h3 className="schedule-card__title">
                <Icon name="x-circle" size={20} />
                Blocked Dates & Times
              </h3>
              {canEdit && (
                <button 
                  className="action-button action-button--primary"
                  onClick={() => setShowBlockDateForm(true)}
                >
                  <Icon name="plus" size={16} />
                  Add Blocked Date
                </button>
              )}
            </div>
            <div className="schedule-card__body">
              <div className="blocked-dates-list">
                {blockedDates.map(blockedDate => (
                  <div key={blockedDate.id} className="blocked-date-item">
                    <div className="blocked-date-item__icon">
                      <Icon name="x-mark" size={16} />
                    </div>
                    <div className="blocked-date-item__content">
                      <h4 className="blocked-date-item__title">{blockedDate.reason}</h4>
                      <p className="blocked-date-item__details">
                        {formatDate(blockedDate.date)}
                        {blockedDate.type === 'partial-day' && 
                          ` • ${blockedDate.start} - ${blockedDate.end}`}
                        {blockedDate.type === 'full-day' && ' • Full day'}
                      </p>
                    </div>
                    {canEdit && (
                      <button 
                        className="action-button action-button--danger"
                        onClick={() => removeBlockedDate(blockedDate.id)}
                        style={{ padding: '0.25rem 0.5rem' }}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    )}
                  </div>
                ))}
                
                {blockedDates.length === 0 && (
                  <div style={{ 
                    padding: '3rem 1rem', 
                    textAlign: 'center', 
                    color: 'var(--color-text-muted, #6b7280)' 
                  }}>
                    <Icon name="calendar" size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No blocked dates configured</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="schedule-card">
            <div className="schedule-card__header">
              <h3 className="schedule-card__title">
                <Icon name="template" size={20} />
                Schedule Templates
              </h3>
            </div>
            <div className="schedule-card__body">
              <div className="template-grid">
                {scheduleTemplates.map(template => (
                  <div 
                    key={template.id} 
                    className="template-card"
                    onClick={() => canEdit && applyTemplate(template)}
                  >
                    <h4 className="template-card__name">{template.name}</h4>
                    <p className="template-card__description">
                      {template.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Block Date Form Modal */}
        {showBlockDateForm && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal__header">
                <h3 className="modal__title">Add Blocked Date/Time</h3>
                <button 
                  className="modal__close"
                  onClick={() => setShowBlockDateForm(false)}
                >
                  <Icon name="x-mark" size={20} />
                </button>
              </div>
              
              <form onSubmit={handleBlockDateSubmit}>
                <div className="form-group">
                  <label className="form-label">Block Type</label>
                  <div className="form-radio-group">
                    <label className="form-radio">
                      <input
                        type="radio"
                        name="type"
                        value="full-day"
                        checked={blockDateForm.type === 'full-day'}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, type: e.target.value }))}
                      />
                      Full Day
                    </label>
                    <label className="form-radio">
                      <input
                        type="radio"
                        name="type"
                        value="partial-day"
                        checked={blockDateForm.type === 'partial-day'}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, type: e.target.value }))}
                      />
                      Specific Time
                    </label>
                    <label className="form-radio">
                      <input
                        type="radio"
                        name="type"
                        value="date-range"
                        checked={blockDateForm.type === 'date-range'}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, type: e.target.value }))}
                      />
                      Date Range
                    </label>
                  </div>
                </div>

                {blockDateForm.type === 'date-range' ? (
                  <>
                    <div className="form-group">
                      <label className="form-label">Start Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={blockDateForm.startDate}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="form-input"
                        value={blockDateForm.endDate}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, endDate: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                ) : (
                  <div className="form-group">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-input"
                      value={blockDateForm.date}
                      onChange={(e) => setBlockDateForm(prev => ({ ...prev, date: e.target.value }))}
                      required
                    />
                  </div>
                )}

                {blockDateForm.type === 'partial-day' && (
                  <>
                    <div className="form-group">
                      <label className="form-label">Start Time</label>
                      <input
                        type="time"
                        className="form-input"
                        value={blockDateForm.start}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, start: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        className="form-input"
                        value={blockDateForm.end}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, end: e.target.value }))}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="form-group">
                  <label className="form-label">Reason</label>
                  <textarea
                    className="form-textarea"
                    value={blockDateForm.reason}
                    onChange={(e) => setBlockDateForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Personal Leave, Training, Vacation"
                    required
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    className="action-button"
                    onClick={() => setShowBlockDateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="action-button action-button--primary"
                  >
                    <Icon name="plus" size={16} />
                    Add Block
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Export Modal */}
        {showExportModal && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal__header">
                <h3 className="modal__title">Export Schedule Data</h3>
                <button 
                  className="modal__close"
                  onClick={() => setShowExportModal(false)}
                >
                  <Icon name="x-mark" size={20} />
                </button>
              </div>
              
              <div className="export-stats">
                <p style={{ margin: 0, fontSize: '14px' }}>
                  <strong>Current Schedule:</strong> {getTotalWeeklySlots()} slots per week, {blockedDates.length} blocked dates
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Export Format</label>
                <select
                  className="form-select"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="json">JSON (Complete Data)</option>
                  <option value="csv">CSV (Available Slots)</option>
                  <option value="ical">iCalendar (Calendar Import)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Date Range</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <input
                    type="date"
                    className="form-input"
                    value={exportDateRange.start}
                    onChange={(e) => setExportDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                  <input
                    type="date"
                    className="form-input"
                    value={exportDateRange.end}
                    onChange={(e) => setExportDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>

              {exportDateRange.start && exportDateRange.end && (
                <div className="export-stats">
                  <p style={{ margin: 0, fontSize: '14px' }}>
                    <strong>Preview:</strong> {generateAllAvailableSlots(
                      new Date(exportDateRange.start), 
                      new Date(exportDateRange.end)
                    ).length} available slots in selected date range
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="action-button"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="action-button action-button--success"
                  onClick={exportScheduleData}
                  disabled={!exportDateRange.start || !exportDateRange.end}
                >
                  <Icon name="download" size={16} />
                  Export {exportFormat.toUpperCase()}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}