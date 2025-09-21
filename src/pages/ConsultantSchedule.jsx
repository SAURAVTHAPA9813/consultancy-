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
      <div className="aetherial-background">
        <style>{AETHERIAL_CSS}</style>
        <div className="aetherial-content">
          <div className="loading-state">
            <Icon name="clock" size={48} />
            <p>Loading schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !consultant) {
    return (
      <div className="aetherial-background">
        <style>{AETHERIAL_CSS}</style>
        <div className="aetherial-content">
          <div className="error-state">
            <Icon name="x-mark" size={48} />
            <p>{error || 'Consultant not found'}</p>
            <button onClick={() => navigate('/consultants')} className="glass-button">
              Back to Consultants
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="aetherial-background">
      <style>{AETHERIAL_CSS}</style>
      
      <div className="aetherial-content">
        {/* Header */}
        <div className="glass-card">
          <div className="glass-card-content">
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
                <Link to={`/consultants/${consultant.id}`} className="glass-button-secondary">
                  <Icon name="arrow-left" size={16} />
                  Back to Profile
                </Link>

                <button 
                  className="glass-button-success"
                  onClick={() => setShowExportModal(true)}
                >
                  <Icon name="download" size={16} />
                  Export Schedule
                </button>
                
                {canEdit && (
                  <>
                    <button 
                      className="glass-button-secondary"
                      onClick={resetSchedule}
                      disabled={!hasChanges}
                    >
                      <Icon name="refresh" size={16} />
                      Reset Changes
                    </button>
                    
                    <button 
                      className="glass-button"
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
        <div className="glass-card">
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
        </div>

        {/* Tab Content */}
        {activeTab === 'weekly' && (
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">
                <Icon name="calendar" size={20} />
                Weekly Availability
              </h3>
            </div>
            <div className="glass-card-content">
              {/* Recurring Patterns */}
              <div style={{ marginBottom: '2rem' }}>
                <h4 className="section-title">Quick Apply Patterns:</h4>
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
                <div className="schedule-header-row">
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
                        className="glass-checkbox"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="glass-input"
                        value={schedule.start}
                        onChange={(e) => handleScheduleChange(day, 'start', e.target.value)}
                        disabled={!schedule.enabled || !canEdit}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="glass-input"
                        value={schedule.end}
                        onChange={(e) => handleScheduleChange(day, 'end', e.target.value)}
                        disabled={!schedule.enabled || !canEdit}
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="glass-input"
                        value={schedule.breakStart}
                        onChange={(e) => handleScheduleChange(day, 'breakStart', e.target.value)}
                        disabled={!schedule.enabled || !canEdit}
                        placeholder="Optional"
                      />
                    </div>
                    
                    <div>
                      <input
                        type="time"
                        className="glass-input"
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
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">
                <Icon name="clock" size={20} />
                Time Slot Configuration
              </h3>
            </div>
            <div className="glass-card-content">
              <div className="config-grid">
                <div className="config-item">
                  <label className="config-label">Appointment Duration</label>
                  <select
                    className="glass-select"
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
                    className="glass-select"
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
                    className="glass-select"
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
                    className="glass-select"
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
                <h4 className="section-title">
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
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">
                <Icon name="x-circle" size={20} />
                Blocked Dates & Times
              </h3>
              {canEdit && (
                <button 
                  className="glass-button"
                  onClick={() => setShowBlockDateForm(true)}
                >
                  <Icon name="plus" size={16} />
                  Add Blocked Date
                </button>
              )}
            </div>
            <div className="glass-card-content">
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
                        className="glass-action-button glass-action-button--danger"
                        onClick={() => removeBlockedDate(blockedDate.id)}
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    )}
                  </div>
                ))}
                
                {blockedDates.length === 0 && (
                  <div className="empty-state">
                    <Icon name="calendar" size={48} />
                    <h3>No blocked dates configured</h3>
                    <p>Add blocked dates to prevent bookings during unavailable times</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="glass-card">
            <div className="glass-card-header">
              <h3 className="glass-card-title">
                <Icon name="template" size={20} />
                Schedule Templates
              </h3>
            </div>
            <div className="glass-card-content">
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
            <div className="glass-modal">
              <div className="glass-modal-header">
                <h3 className="glass-modal-title">Add Blocked Date/Time</h3>
                <button 
                  className="glass-modal-close"
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
                        className="glass-input"
                        value={blockDateForm.startDate}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, startDate: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date</label>
                      <input
                        type="date"
                        className="glass-input"
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
                      className="glass-input"
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
                        className="glass-input"
                        value={blockDateForm.start}
                        onChange={(e) => setBlockDateForm(prev => ({ ...prev, start: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Time</label>
                      <input
                        type="time"
                        className="glass-input"
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
                    className="glass-textarea"
                    value={blockDateForm.reason}
                    onChange={(e) => setBlockDateForm(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="e.g., Personal Leave, Training, Vacation"
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="glass-button-secondary"
                    onClick={() => setShowBlockDateForm(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="glass-button"
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
            <div className="glass-modal">
              <div className="glass-modal-header">
                <h3 className="glass-modal-title">Export Schedule Data</h3>
                <button 
                  className="glass-modal-close"
                  onClick={() => setShowExportModal(false)}
                >
                  <Icon name="x-mark" size={20} />
                </button>
              </div>
              
              <div className="export-stats">
                <p>
                  <strong>Current Schedule:</strong> {getTotalWeeklySlots()} slots per week, {blockedDates.length} blocked dates
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">Export Format</label>
                <select
                  className="glass-select"
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
                <div className="date-range-inputs">
                  <input
                    type="date"
                    className="glass-input"
                    value={exportDateRange.start}
                    onChange={(e) => setExportDateRange(prev => ({ ...prev, start: e.target.value }))}
                  />
                  <input
                    type="date"
                    className="glass-input"
                    value={exportDateRange.end}
                    onChange={(e) => setExportDateRange(prev => ({ ...prev, end: e.target.value }))}
                  />
                </div>
              </div>

              {exportDateRange.start && exportDateRange.end && (
                <div className="export-stats">
                  <p>
                    <strong>Preview:</strong> {generateAllAvailableSlots(
                      new Date(exportDateRange.start), 
                      new Date(exportDateRange.end)
                    ).length} available slots in selected date range
                  </p>
                </div>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="glass-button-secondary"
                  onClick={() => setShowExportModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="glass-button-success"
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
    </div>
  );
}

// Aetherial Glass Design System CSS
const AETHERIAL_CSS = `
/* ===== AETHERIAL GLASS DESIGN SYSTEM ===== */
:root {
  /* Primary Colors */
  --primary: #6366f1;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  
  /* Secondary Colors */
  --secondary: #8b5cf6;
  --secondary-light: #a78bfa;
  
  /* State Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
  --info: #06b6d4;
  
  /* Background Colors */
  --dark: #0f172a;
  --dark-secondary: #1e293b;
  --dark-tertiary: #334155;
  
  /* Glass/Surface Colors */
  --glass-bg: rgba(15, 23, 42, 0.6);
  --glass-bg-light: rgba(30, 41, 59, 0.4);
  --glass-bg-lighter: rgba(51, 65, 85, 0.3);
  
  /* Text Colors */
  --text: #e2e8f0;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;
  
  /* Border & Effects */
  --border: rgba(148, 163, 184, 0.1);
  --glass-border: rgba(148, 163, 184, 0.15);
  --glass-border-hover: rgba(148, 163, 184, 0.3);
  
  /* Shadows */
  --shadow-card: 0 8px 32px rgba(0, 0, 0, 0.4);
  --shadow-glow: 0 0 40px rgba(99, 102, 241, 0.3);
  --shadow-glow-secondary: 0 0 40px rgba(139, 92, 246, 0.3);
  --shadow-glow-success: 0 0 40px rgba(16, 185, 129, 0.3);
  --shadow-glow-danger: 0 0 40px rgba(239, 68, 68, 0.3);
  
  /* Animations */
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Background Container */
.aetherial-background {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--dark) 0%, var(--dark-secondary) 50%, var(--dark-tertiary) 100%);
  position: relative;
  overflow: hidden;
}

/* Animated Background Orbs */
.aetherial-background::before,
.aetherial-background::after {
  content: '';
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
  pointer-events: none;
}

.aetherial-background::before {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
  top: -250px;
  right: -250px;
  animation-delay: 0s;
}

.aetherial-background::after {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
  bottom: -200px;
  left: -200px;
  animation-delay: 4s;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-40px) rotate(120deg); }
  66% { transform: translateY(20px) rotate(240deg); }
}

/* Main Content Container */
.aetherial-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

/* Glass Cards */
.glass-card {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  box-shadow: var(--shadow-card);
  margin-bottom: 2rem;
  transition: var(--transition);
}

.glass-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-glow);
  border-color: var(--glass-border-hover);
}

.glass-card-header {
  padding: 2rem 2rem 1rem 2rem;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.glass-card-title {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.glass-card-content {
  padding: 2rem;
}

.section-title {
  color: var(--text);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

/* Header Section */
.schedule-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 2rem;
}

.schedule-header__info {
  flex: 1;
}

.schedule-header__title {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--text) 0%, var(--primary-light) 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.schedule-header__subtitle {
  margin: 0 0 1rem 0;
  color: var(--text-secondary);
  font-size: 1rem;
}

.schedule-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.schedule-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  align-items: flex-start;
}

/* Changes Indicator */
.changes-indicator {
  background: rgba(245, 158, 11, 0.1);
  color: var(--warning);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  border: 1px solid rgba(245, 158, 11, 0.3);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  backdrop-filter: blur(20px);
}

/* Tabs */
.tabs {
  display: flex;
  border-bottom: 1px solid var(--glass-border);
  padding: 0 2rem;
}

.tab {
  padding: 1rem 1.5rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-weight: 600;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: var(--transition);
  font-size: 0.95rem;
}

.tab:hover {
  color: var(--text);
  background: var(--glass-bg-lighter);
}

.tab--active {
  color: var(--primary-light);
  border-bottom-color: var(--primary);
}

/* Buttons */
.glass-button {
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  border: 1px solid var(--primary);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.glass-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow);
}

.glass-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.glass-button-secondary {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: var(--text);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  text-decoration: none;
}

.glass-button-secondary:hover {
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.glass-button-success {
  background: linear-gradient(135deg, var(--success) 0%, #059669 100%);
  border: 1px solid var(--success);
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.glass-button-success:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-glow-success);
}

/* Recurring Patterns */
.recurring-patterns {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.pattern-button {
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  background: var(--glass-bg-light);
  color: var(--text);
  cursor: pointer;
  transition: var(--transition);
  font-weight: 500;
  font-size: 0.9rem;
}

.pattern-button:hover:not(:disabled) {
  background: var(--primary);
  color: white;
  border-color: var(--primary);
  transform: translateY(-2px);
}

.pattern-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Schedule Grid */
.weekly-schedule {
  display: grid;
  gap: 1rem;
}

.schedule-header-row {
  display: grid;
  grid-template-columns: 120px 80px 140px 140px 140px 140px 80px;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: var(--glass-bg-light);
  border-radius: 8px;
  font-weight: 700;
  color: var(--text);
  font-size: 0.85rem;
}

.schedule-day {
  display: grid;
  grid-template-columns: 120px 80px 140px 140px 140px 140px 80px;
  gap: 1rem;
  align-items: center;
  padding: 1.25rem;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  transition: var(--transition);
  background: var(--glass-bg-lighter);
}

.schedule-day:hover {
  background: var(--glass-bg-light);
  border-color: var(--glass-border-hover);
}

.schedule-day--disabled {
  opacity: 0.5;
}

.schedule-day__name {
  font-weight: 600;
  color: var(--text);
  font-size: 0.95rem;
}

.schedule-day__toggle input {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

.schedule-day__slots {
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Form Elements */
.glass-input, .glass-select, .glass-textarea {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.5rem 0.75rem;
  color: var(--text);
  font-size: 0.9rem;
  transition: var(--transition);
  width: 100%;
}

.glass-input:focus, .glass-select:focus, .glass-textarea:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.glass-input::placeholder, .glass-textarea::placeholder {
  color: var(--text-muted);
}

.glass-textarea {
  resize: vertical;
  min-height: 80px;
}

.glass-checkbox {
  width: 18px;
  height: 18px;
  accent-color: var(--primary);
}

/* Config Grid */
.config-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.config-label {
  font-weight: 600;
  color: var(--text);
  font-size: 0.9rem;
}

/* Time Slots Preview */
.time-slots-preview {
  background: var(--glass-bg-lighter);
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-top: 2rem;
}

.slots-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.slot-item {
  padding: 0.4rem 0.8rem;
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--text-secondary);
  font-weight: 500;
}

/* Blocked Dates */
.blocked-dates-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.blocked-date-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background: var(--glass-bg-lighter);
  transition: var(--transition);
}

.blocked-date-item:hover {
  background: var(--glass-bg-light);
  border-color: var(--glass-border-hover);
}

.blocked-date-item__icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--danger);
  display: grid;
  place-items: center;
  color: white;
  flex-shrink: 0;
}

.blocked-date-item__content {
  flex: 1;
}

.blocked-date-item__title {
  font-weight: 600;
  color: var(--text);
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.blocked-date-item__details {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
}

.glass-action-button {
  background: var(--glass-bg-light);
  border: 1px solid var(--glass-border);
  border-radius: 8px;
  padding: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.glass-action-button:hover {
  color: var(--primary);
  border-color: var(--primary);
  background: rgba(99, 102, 241, 0.1);
  transform: translateY(-1px);
}

.glass-action-button--danger:hover {
  color: var(--danger);
  border-color: var(--danger);
  background: rgba(239, 68, 68, 0.1);
}

/* Template Grid */
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}

.template-card {
  padding: 1.5rem;
  border: 1px solid var(--glass-border);
  border-radius: 12px;
  background: var(--glass-bg-lighter);
  cursor: pointer;
  transition: var(--transition);
}

.template-card:hover {
  border-color: var(--primary);
  background: var(--glass-bg-light);
  transform: translateY(-2px);
}

.template-card__name {
  font-weight: 700;
  color: var(--text);
  margin: 0 0 0.5rem 0;
  font-size: 1.1rem;
}

.template-card__description {
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
}

/* Modals */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.glass-modal {
  background: var(--glass-bg);
  backdrop-filter: blur(20px);
  border: 1px solid var(--glass-border);
  border-radius: 16px;
  padding: 2rem;
  max-width: 500px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: var(--shadow-card);
}

.glass-modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.glass-modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text);
}

.glass-modal-close {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  color: var(--text-muted);
  transition: var(--transition);
}

.glass-modal-close:hover {
  background: var(--glass-bg-light);
  color: var(--text);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.form-radio-group {
  display: flex;
  gap: 1.5rem;
  margin-top: 0.5rem;
  flex-wrap: wrap;
}

.form-radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text);
  font-size: 0.9rem;
}

.form-radio input[type="radio"] {
  accent-color: var(--primary);
}

.date-range-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

/* Export Stats */
.export-stats {
  background: var(--glass-bg-lighter);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid var(--glass-border);
}

.export-stats p {
  margin: 0;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

/* States */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.loading-state p, .error-state p {
  margin: 1rem 0 0 0;
  font-size: 1.1rem;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  text-align: center;
  color: var(--text-secondary);
}

.empty-state h3 {
  color: var(--text);
  margin: 1rem 0 0.5rem 0;
  font-size: 1.25rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .schedule-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1.5rem;
  }
  
  .schedule-header-row, .schedule-day {
    grid-template-columns: repeat(7, 1fr);
    font-size: 0.8rem;
  }
  
  .config-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 768px) {
  .aetherial-content {
    padding: 1rem;
  }
  
  .schedule-header-row, .schedule-day {
    grid-template-columns: 1fr;
    gap: 0.75rem;
    text-align: center;
  }
  
  .recurring-patterns {
    flex-direction: column;
  }
  
  .template-grid {
    grid-template-columns: 1fr;
  }

  .glass-modal {
    width: 95%;
    margin: 1rem;
    padding: 1.5rem;
  }
  
  .schedule-stats {
    flex-direction: column;
    gap: 0.75rem;
  }
  
  .date-range-inputs {
    grid-template-columns: 1fr;
  }
  
  .tabs {
    flex-wrap: wrap;
    padding: 0 1rem;
  }
  
  .tab {
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
  }
}
`;