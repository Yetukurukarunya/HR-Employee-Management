import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import GlassCard from '../common/GlassCard';
import GlassIcon from '../common/GlassIcon';
import './Dashboard.css';

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees, leaves, updateLeaveStatus, attendance } = useApp();

  const teamMembers = employees.filter(e => e.department === 'Engineering' || e.role === 'employee');
  const pendingLeaves = leaves.filter(l => l.status === 'Pending');

  const handleApprove = (leaveId) => {
    updateLeaveStatus(leaveId, 'Approved');
  };

  const handleReject = (leaveId) => {
    updateLeaveStatus(leaveId, 'Rejected');
  };

  return (
    <div className="dashboard-container">
      {/* Hero Banner */}
      <div className="dashboard-hero-banner glass-panel">
        <div className="hero-text">
          <span className="hero-pill glass-badge glass-badge-primary">
            <GlassIcon name="Users" size={14} glow={false} /> Department Management Console
          </span>
          <h1>Team Lead Dashboard</h1>
          <p>Welcome back, {user?.name}! Manage your department approvals and team members.</p>
        </div>
        <div className="hero-actions">
          <button className="glass-button" onClick={() => navigate('/leave')}>
            <GlassIcon name="CalendarCheck" size={18} glow={false} />
            <span>Manage Leave Queue</span>
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <GlassCard
          title="Team Size"
          subtitle="Direct Reports"
          value={teamMembers.length}
          icon="Users"
          iconVariant="purple"
          onClick={() => navigate('/employees')}
        />
        <GlassCard
          title="Present Today"
          subtitle="Active On-Shift"
          value={attendance.filter(a => a.status === 'Present').length}
          icon="CheckCircle2"
          iconVariant="success"
          onClick={() => navigate('/attendance')}
        />
        <GlassCard
          title="Pending Leave Approvals"
          subtitle="Requires Action"
          value={pendingLeaves.length}
          badgeText={pendingLeaves.length > 0 ? `${pendingLeaves.length} Pending` : "Completed"}
          badgeVariant={pendingLeaves.length > 0 ? "warning" : "success"}
          icon="Clock"
          iconVariant="warning"
          onClick={() => navigate('/leave')}
        />
        <GlassCard
          title="Team Rating"
          subtitle="Avg Performance"
          value="4.6 / 5.0"
          icon="TrendingUp"
          iconVariant="gold"
          onClick={() => navigate('/performance')}
        />
      </div>

      {/* Split Section */}
      <div className="dashboard-split-layout">
        {/* Pending Approvals */}
        <div className="split-main glass-panel">
          <div className="section-header">
            <GlassIcon name="AlertCircle" variant="warning" size={20} />
            <h3>Pending Approvals Queue ({pendingLeaves.length})</h3>
          </div>

          <div className="requests-list">
            {pendingLeaves.length > 0 ? (
              pendingLeaves.map((request) => (
                <div key={request.id} className="request-glass-card glass-panel">
                  <div className="request-info">
                    <div className="request-header-row">
                      <strong className="request-name">{request.employeeName}</strong>
                      <span className="glass-badge glass-badge-warning">{request.type}</span>
                    </div>
                    <div className="request-meta-row">
                      <span><GlassIcon name="Calendar" size={12} glow={false} /> {request.startDate} to {request.endDate} ({request.days} days)</span>
                      <span>Reason: "{request.reason}"</span>
                    </div>
                  </div>
                  <div className="request-actions">
                    <button 
                      className="glass-button" 
                      style={{ background: 'var(--success)', padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => handleApprove(request.id)}
                    >
                      <GlassIcon name="Check" size={14} glow={false} />
                      <span>Approve</span>
                    </button>
                    <button 
                      className="glass-button glass-button-secondary" 
                      style={{ color: 'var(--danger)', padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                      onClick={() => handleReject(request.id)}
                    >
                      <GlassIcon name="X" size={14} glow={false} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-queue-msg">
                <GlassIcon name="CheckCircle2" variant="success" size={32} />
                <p>All clear! No pending leave requests to review.</p>
              </div>
            )}
          </div>
        </div>

        {/* Team Roster */}
        <div className="split-side glass-panel">
          <div className="section-header">
            <GlassIcon name="Users" variant="primary" size={20} />
            <h3>Team Roster Overview</h3>
          </div>
          <div className="team-roster-list">
            {teamMembers.map(member => (
              <div key={member.id} className="roster-item">
                <img src={member.avatar} alt={member.name} className="roster-avatar" />
                <div className="roster-details">
                  <div className="roster-name">{member.name}</div>
                  <div className="roster-position">{member.position}</div>
                </div>
                <span className={`glass-badge glass-badge-${member.status === 'Active' ? 'success' : 'warning'}`}>
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;