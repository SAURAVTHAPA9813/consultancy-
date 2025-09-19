// StudentCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '@/components/Icon.jsx';
import styles from '@/styles/Components.module.css';

export const StudentCard = ({ student, variant = 'default' }) => {
  const getStatusColor = (status) => {
    const colors = {
      'consultation-scheduled': 'blue',
      'documents-pending': 'yellow',
      'application-submitted': 'green',
      'visa-processing': 'purple',
      'accepted': 'success'
    };
    return colors[status] || 'gray';
  };

  const getCountryFlag = (country) => {
    const flags = {
      'USA': '🇺🇸',
      'UK': '🇬🇧',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Japan': '🇯🇵',
      'New Zealand': '🇳🇿'
    };
    return flags[country] || '🌍';
  };

  return (
    <div className={`${styles['student-card']} ${styles[`student-card--${variant}`]}`}>
      <div className={styles['student-card__header']}>
        <div className={styles['student-card__country']}>
          <span className={styles['country-flag']}>{getCountryFlag(student.intendedCountry)}</span>
          <span className={styles['country-name']}>{student.intendedCountry}</span>
        </div>
        <div className={styles['student-card__menu']}>
          <Icon name="ellipsis-vertical" size={16} />
        </div>
      </div>
      
      <div className={styles['student-card__body']}>
        <div className={styles['student-card__avatar']}>
          <div className={styles['avatar-circle']}>
            {student.avatar || student.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className={`${styles['status-indicator']} ${styles[`status-indicator--${getStatusColor(student.status)}`]}`}></div>
        </div>
        
        <h3 className={styles['student-card__name']}>{student.name}</h3>
        <p className={styles['student-card__email']}>{student.email}</p>
        
        <div className={styles['student-card__progress']}>
          <div className={styles['progress-header']}>
            <span>Application Progress</span>
            <span className={styles['progress-percentage']}>{student.progress || 0}%</span>
          </div>
          <div className={styles['progress-bar']}>
            <div 
              className={styles['progress-fill']}
              style={{ width: `${student.progress || 0}%` }}
            ></div>
          </div>
        </div>
        
        <div className={styles['student-card__stats']}>
          <div className={styles['stat-item']}>
            <Icon name="calendar" size={14} />
            <span>{student.nextAppointment ? new Date(student.nextAppointment).toLocaleDateString() : 'No appointment'}</span>
          </div>
          <div className={styles['stat-item']}>
            <Icon name="user" size={14} />
            <span>{student.consultant}</span>
          </div>
        </div>
        
        <div className={styles['student-card__status']}>
          <span className={`${styles['status-badge']} ${styles[`status-badge--${getStatusColor(student.status)}`]}`}>
            {student.status.replace('-', ' ')}
          </span>
        </div>
      </div>
      
      <div className={styles['student-card__footer']}>
        <Link to={`/students/${student.id}`} className={styles['card-button']}>
          View Details
          <Icon name="arrow-right" size={14} />
        </Link>
      </div>
    </div>
  );
};

// ConsultantCard.jsx
export const ConsultantCard = ({ consultant, showPerformance = true }) => {
  const getStatusColor = (status) => {
    const colors = {
      'online': 'success',
      'busy': 'warning',
      'away': 'info',
      'offline': 'gray'
    };
    return colors[status] || 'gray';
  };

  return (
    <div className={styles['consultant-card']}>
      <div className={styles['consultant-card__glow']}></div>
      
      <div className={styles['consultant-card__header']}>
        <div className={styles['consultant-card__badge']}>
          <Icon name="award" size={16} />
          Top Performer
        </div>
      </div>
      
      <div className={styles['consultant-card__body']}>
        <div className={styles['consultant-card__avatar']}>
          <div className={styles['avatar-image']}>
            {consultant.photo ? (
              <img src={consultant.photo} alt={consultant.name} />
            ) : (
              <span>{consultant.name.split(' ').map(n => n[0]).join('')}</span>
            )}
          </div>
          <div className={`${styles['online-status']} ${styles[`online-status--${consultant.status}`]}`}>
            <span className={styles['status-dot']}></span>
            <span className={styles['status-text']}>{consultant.status}</span>
          </div>
        </div>
        
        <h3 className={styles['consultant-card__name']}>{consultant.name}</h3>
        <p className={styles['consultant-card__role']}>{consultant.specialization}</p>
        
        <div className={styles['consultant-card__rating']}>
          <div className={styles['stars']}>
            {[1, 2, 3, 4, 5].map(star => (
              <Icon 
                key={star} 
                name="star" 
                size={16} 
                className={star <= Math.floor(consultant.rating || 4.5) ? styles['star-filled'] : styles['star-empty']}
              />
            ))}
          </div>
          <span className={styles['rating-text']}>{consultant.rating || 4.5}/5.0</span>
        </div>
        
        {showPerformance && (
          <div className={styles['consultant-card__performance']}>
            <div className={styles['performance-item']}>
              <span className={styles['performance-label']}>Students</span>
              <span className={styles['performance-value']}>{consultant.totalStudents || 0}</span>
            </div>
            <div className={styles['performance-item']}>
              <span className={styles['performance-label']}>Success Rate</span>
              <div className={styles['success-rate']}>
                <div className={styles['rate-circle']}>
                  <svg className={styles['rate-svg']}>
                    <circle cx="25" cy="25" r="20" className={styles['rate-bg']} />
                    <circle 
                      cx="25" 
                      cy="25" 
                      r="20" 
                      className={styles['rate-fill']}
                      style={{ '--rate': consultant.successRate || 87 }}
                    />
                  </svg>
                  <span className={styles['rate-text']}>{consultant.successRate || 87}%</span>
                </div>
              </div>
            </div>
            <div className={styles['performance-item']}>
              <span className={styles['performance-label']}>This Month</span>
              <span className={styles['performance-value']}>{consultant.studentsThisMonth || 0}</span>
            </div>
          </div>
        )}
        
        <div className={styles['consultant-card__availability']}>
          <h4>Today's Availability</h4>
          <div className={styles['time-slots']}>
            {consultant.availableSlots?.map(slot => (
              <button 
                key={slot} 
                className={styles['time-slot']}
                disabled={!slot.available}
              >
                {slot.time}
              </button>
            )) || (
              <>
                <button className={styles['time-slot']}>2:00 PM</button>
                <button className={styles['time-slot']}>3:00 PM</button>
                <button className={`${styles['time-slot']} ${styles['time-slot--disabled']}`} disabled>4:00 PM</button>
                <button className={styles['time-slot']}>5:00 PM</button>
              </>
            )}
          </div>
        </div>
      </div>
      
      <div className={styles['consultant-card__footer']}>
        <Link to={`/consultants/${consultant.id}`} className={styles['card-button--outline']}>
          View Profile
        </Link>
        <Link to={`/appointments/new?consultant=${consultant.id}`} className={styles['card-button--primary']}>
          Book Appointment
        </Link>
      </div>
    </div>
  );
};

// AppointmentCard.jsx
export const AppointmentCard = ({ appointment, onReschedule, onCancel, onJoin }) => {
  const getTypeIcon = (type) => {
    const icons = {
      'consultation': 'users',
      'document-review': 'document',
      'visa-prep': 'identification',
      'follow-up': 'refresh',
      'online': 'video',
      'in-person': 'building-office'
    };
    return icons[type] || 'calendar';
  };

  const getTypeColor = (type) => {
    const colors = {
      'consultation': 'blue',
      'document-review': 'purple',
      'visa-prep': 'orange',
      'follow-up': 'green'
    };
    return colors[type] || 'gray';
  };

  const isToday = () => {
    const today = new Date().toDateString();
    const appointmentDate = new Date(appointment.date).toDateString();
    return today === appointmentDate;
  };

  const getTimeUntil = () => {
    const now = new Date();
    const appointmentTime = new Date(appointment.datetime);
    const diff = appointmentTime - now;
    
    if (diff < 0) return 'Past';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} mins`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)} hours`;
    return `${Math.floor(diff / 86400000)} days`;
  };

  return (
    <div className={`${styles['appointment-card']} ${isToday() ? styles['appointment-card--today'] : ''}`}>
      <div className={styles['appointment-card__timeline']}>
        <div className={`${styles['timeline-dot']} ${styles[`timeline-dot--${getTypeColor(appointment.type)}`]}`}>
          <Icon name={getTypeIcon(appointment.type)} size={16} />
        </div>
        <div className={styles['timeline-line']}></div>
      </div>
      
      <div className={styles['appointment-card__content']}>
        <div className={styles['appointment-card__header']}>
          <div className={styles['appointment-time']}>
            <Icon name="clock" size={14} />
            <span className={styles['time-text']}>{appointment.time}</span>
            <span className={styles['duration-text']}>{appointment.duration}</span>
          </div>
          {isToday() && (
            <div className={styles['appointment-countdown']}>
              <span className={styles['countdown-badge']}>In {getTimeUntil()}</span>
            </div>
          )}
        </div>
        
        <div className={styles['appointment-card__body']}>
          <h4 className={styles['appointment-title']}>{appointment.title}</h4>
          <p className={styles['appointment-type']}>{appointment.type.replace('-', ' ')}</p>
          
          <div className={styles['appointment-participants']}>
            <div className={styles['participant']}>
              <div className={styles['participant-avatar']}>
                {appointment.studentPhoto ? (
                  <img src={appointment.studentPhoto} alt={appointment.studentName} />
                ) : (
                  <span>{appointment.studentName?.charAt(0)}</span>
                )}
              </div>
              <div className={styles['participant-info']}>
                <span className={styles['participant-name']}>{appointment.studentName}</span>
                <span className={styles['participant-role']}>Student</span>
              </div>
            </div>
            
            <Icon name="arrow-right" size={16} className={styles['participant-separator']} />
            
            <div className={styles['participant']}>
              <div className={styles['participant-avatar']}>
                {appointment.consultantPhoto ? (
                  <img src={appointment.consultantPhoto} alt={appointment.consultantName} />
                ) : (
                  <span>{appointment.consultantName?.charAt(0)}</span>
                )}
              </div>
              <div className={styles['participant-info']}>
                <span className={styles['participant-name']}>{appointment.consultantName}</span>
                <span className={styles['participant-role']}>Consultant</span>
              </div>
            </div>
          </div>
          
          <div className={styles['appointment-location']}>
            <Icon name={appointment.mode === 'online' ? 'video' : 'map-pin'} size={14} />
            <span>{appointment.mode === 'online' ? appointment.meetingLink : appointment.location}</span>
          </div>
          
          {appointment.notes && (
            <div className={styles['appointment-notes']}>
              <p>{appointment.notes}</p>
            </div>
          )}
        </div>
        
        <div className={styles['appointment-card__actions']}>
          {appointment.mode === 'online' && isToday() && (
            <button 
              className={styles['action-button--primary']}
              onClick={() => onJoin?.(appointment)}
            >
              <Icon name="video" size={14} />
              Join Meeting
            </button>
          )}
          <button 
            className={styles['action-button--outline']}
            onClick={() => onReschedule?.(appointment)}
          >
            <Icon name="calendar" size={14} />
            Reschedule
          </button>
          <button 
            className={styles['action-button--danger']}
            onClick={() => onCancel?.(appointment)}
          >
            <Icon name="x-mark" size={14} />
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

// NotificationToast.jsx
export const NotificationToast = ({ notification, onDismiss }) => {
  const getIcon = (type) => {
    const icons = {
      'success': 'check-circle',
      'error': 'x-circle',
      'warning': 'alert-triangle',
      'info': 'information-circle'
    };
    return icons[type] || 'information-circle';
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss?.(notification.id);
    }, notification.duration || 5000);

    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  return (
    <div className={`${styles['notification-toast']} ${styles[`notification-toast--${notification.type}`]}`}>
      <div className={styles['notification-toast__icon']}>
        <Icon name={getIcon(notification.type)} size={20} />
      </div>
      <div className={styles['notification-toast__content']}>
        <h5 className={styles['notification-toast__title']}>{notification.title}</h5>
        {notification.message && (
          <p className={styles['notification-toast__message']}>{notification.message}</p>
        )}
      </div>
      <button 
        className={styles['notification-toast__close']}
        onClick={() => onDismiss?.(notification.id)}
      >
        <Icon name="x-mark" size={16} />
      </button>
      <div className={styles['notification-toast__timer']}>
        <div className={styles['timer-bar']}></div>
      </div>
    </div>
  );
};

// StatChart.jsx - Mini chart component for stat cards
export const StatChart = ({ data, type = 'line', color = 'primary' }) => {
  const getPath = () => {
    if (!data || data.length === 0) return '';
    
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    const width = 100;
    const height = 40;
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    });
    
    if (type === 'area') {
      return `M0,${height} L${points.join(' L')} L${width},${height} Z`;
    }
    
    return `M${points.join(' L')}`;
  };

  return (
    <div className={styles['stat-chart']}>
      <svg viewBox="0 0 100 40" className={styles['chart-svg']}>
        {type === 'bar' ? (
          data?.map((value, index) => {
            const max = Math.max(...data);
            const barHeight = (value / max) * 40;
            const barWidth = 100 / data.length - 2;
            const x = index * (100 / data.length) + 1;
            
            return (
              <rect
                key={index}
                x={x}
                y={40 - barHeight}
                width={barWidth}
                height={barHeight}
                className={styles[`chart-bar--${color}`]}
                rx="2"
              />
            );
          })
        ) : (
          <path
            d={getPath()}
            fill={type === 'area' ? 'currentColor' : 'none'}
            stroke={type === 'line' ? 'currentColor' : 'none'}
            strokeWidth="2"
            className={styles[`chart-path--${color}`]}
          />
        )}
      </svg>
    </div>
  );
};

// ProgressRing.jsx - Circular progress component
export const ProgressRing = ({ progress, size = 80, strokeWidth = 8, color = 'primary', showLabel = true }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className={styles['progress-ring']} style={{ width: size, height: size }}>
      <svg width={size} height={size} className={styles['progress-ring__svg']}>
        <circle
          className={styles['progress-ring__bg']}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <circle
          className={`${styles['progress-ring__fill']} ${styles[`progress-ring__fill--${color}`]}`}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1s ease-out',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
          }}
        />
      </svg>
      {showLabel && (
        <div className={styles['progress-ring__label']}>
          <span className={styles['progress-ring__value']}>{progress}%</span>
        </div>
      )}
    </div>
  );
};

export default {
  StudentCard,
  ConsultantCard,
  AppointmentCard,
  NotificationToast,
  StatChart,
  ProgressRing
};