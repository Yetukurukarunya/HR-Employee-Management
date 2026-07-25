import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import GlassCard from '../common/GlassCard';
import GlassIcon from '../common/GlassIcon';
import './Dashboard.css';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { leaves, userClockState, toggleClock, notifications } = useApp();

  const userLeaves = leaves.filter(l => l.employeeName === user?.name || l.employeeId === user?.id);
  const pendingLeaves = userLeaves.filter(l => l.status === 'Pending').length;

  return (
    <div className="dashboard-container">
      {/* Hero Banner */}
      <div className="dashboard-hero-banner glass-panel">
        <div className="hero-text">
          <span className="hero-pill glass-badge glass-badge-primary">
            <GlassIcon name="User" size={14} glow={false} /> Employee Self-Service Workspace
          </span>
          <h1>Welcome, {user?.name}</h1>
          <p>{user?.position || 'Senior FullStack Developer'} • {user?.department || 'Engineering'}</p>
        </div>

        {/* Live Punch Clock Widget */}
        <div className="hero-clock-widget glass-panel">
          <div className="clock-status-row">
            <GlassIcon 
              name="Clock" 
              variant={userClockState.clockedIn ? "success" : "warning"} 
              size={20} 
            />
            <div>
              <div className="clock-status-title">
                {userClockState.clockedIn ? 'Clocked In' : 'Clocked Out'}
              </div>
              <div className="clock-status-sub">
                {userClockState.clockedIn ? `Shift Started: ${userClockState.clockInTime}` : 'Not currently on shift'}
              </div>
            </div>
          </div>
          <button 
            className={`glass-button ${userClockState.clockedIn ? 'btn-clock-out' : ''}`}
            onClick={() => toggleClock(user)}
          >
            <GlassIcon name={userClockState.clockedIn ? "Square" : "Play"} size={16} glow={false} />
            <span>{userClockState.clockedIn ? 'Clock Out Shift' : 'Clock In Shift'}</span>
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="metrics-grid">
        <GlassCard
          title="Leave Balance"
          subtitle="Available Days"
          value="18 Days"
          badgeText={pendingLeaves > 0 ? `${pendingLeaves} Pending` : "Available"}
          badgeVariant={pendingLeaves > 0 ? "warning" : "success"}
          icon="Calendar"
          iconVariant="primary"
          onClick={() => navigate('/leave')}
        />
        <GlassCard
          title="Monthly Hours"
          subtitle="Total Logged"
          value="164.5 hrs"
          trend={3.2}
          trendLabel="vs last mo."
          icon="Clock"
          iconVariant="info"
          onClick={() => navigate('/attendance')}
        />
        <GlassCard
          title="Latest Payslip"
          subtitle="July 2026 Ready"
          value="$7,333"
          icon="Banknote"
          iconVariant="success"
          onClick={() => navigate('/payslips')}
        />
        <GlassCard
          title="Performance Rating"
          subtitle="Last Q2 Review"
          value="4.9 / 5.0"
          icon="Award"
          iconVariant="gold"
          onClick={() => navigate('/performance')}
        />
      </div>

      {/* Split Section */}
      <div className="dashboard-split-layout">
        {/* Quick Actions & Recent Leaves */}
        <div className="split-main glass-panel">
          <div className="section-header">
            <GlassIcon name="Zap" variant="primary" size={20} />
            <h3>Quick Actions</h3>
          </div>
          <div className="quick-actions-grid">
            <button className="action-card glass-panel" onClick={() => navigate('/leave')}>
              <GlassIcon name="CalendarPlus" variant="warning" size={24} />
              <span>Request Leave</span>
            </button>
            <button className="action-card glass-panel" onClick={() => navigate('/attendance')}>
              <GlassIcon name="Clock" variant="info" size={24} />
              <span>Attendance History</span>
            </button>
            <button className="action-card glass-panel" onClick={() => navigate('/payslips')}>
              <GlassIcon name="FileText" variant="success" size={24} />
              <span>View Payslip Receipt</span>
            </button>
            <button className="action-card glass-panel" onClick={() => navigate('/profile')}>
              <GlassIcon name="UserCheck" variant="purple" size={24} />
              <span>Update Profile</span>
            </button>
          </div>

          {/* User Leave Status Table */}
          <div className="table-preview-section">
            <div className="section-header">
              <GlassIcon name="Calendar" variant="warning" size={20} />
              <h3>My Leave Submissions</h3>
            </div>
            <div className="glass-table-wrapper">
              <table className="glass-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Days</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {userLeaves.map(l => (
                    <tr key={l.id}>
                      <td><strong>{l.type}</strong></td>
                      <td>{l.startDate} to {l.endDate}</td>
                      <td>{l.days} days</td>
                      <td>
                        <span className={`glass-badge glass-badge-${l.status === 'Approved' ? 'success' : l.status === 'Pending' ? 'warning' : 'danger'}`}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Notifications & System Updates */}
        <div className="split-side glass-panel">
          <div className="section-header">
            <GlassIcon name="Bell" variant="purple" size={20} />
            <h3>Recent Updates</h3>
          </div>
          <div className="activity-timeline">
            {notifications.slice(0, 5).map(n => (
              <div key={n.id} className="timeline-item">
                <GlassIcon name="CheckCircle2" variant="success" size={14} glow={false} />
                <div className="timeline-content">
                  <div className="timeline-title">{n.title}</div>
                  <div className="timeline-msg">{n.message}</div>
                  <div className="timeline-time">{n.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;