import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import GlassCard from '../common/GlassCard';
import GlassIcon from '../common/GlassIcon';
import './LeaveManagement.css';

const LeaveManagement = () => {
  const { user } = useAuth();
  const { leaves, updateLeaveStatus, addLeaveRequest } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const [formData, setFormData] = useState({
    type: 'Annual Leave',
    startDate: '',
    endDate: '',
    days: 1,
    reason: ''
  });

  const filteredLeaves = leaves.filter(l => filter === 'all' || l.status.toLowerCase() === filter);

  const handleSubmit = (e) => {
    e.preventDefault();
    addLeaveRequest({
      employeeId: user?.id || 3,
      employeeName: user?.name || 'Sarah Chen',
      department: user?.department || 'Engineering',
      ...formData
    });
    setShowModal(false);
    setFormData({ type: 'Annual Leave', startDate: '', endDate: '', days: 1, reason: '' });
  };

  return (
    <div className="leave-page-container">
      {/* Header Banner */}
      <div className="page-header-banner glass-panel">
        <div>
          <span className="glass-badge glass-badge-primary">
            <GlassIcon name="Calendar" size={14} glow={false} /> Leave Center
          </span>
          <h1>Leave & Time-Off Management</h1>
          <p>Review leave requests, check approval queues, and submit time-off</p>
        </div>

        <button className="glass-button" onClick={() => setShowModal(true)}>
          <GlassIcon name="Plus" size={18} glow={false} />
          <span>New Leave Request</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="metrics-grid">
        <GlassCard 
          title="Total Submissions" 
          value={leaves.length} 
          icon="Calendar" 
          iconVariant="primary" 
        />
        <GlassCard 
          title="Pending Action" 
          value={leaves.filter(l => l.status === 'Pending').length} 
          icon="Clock" 
          iconVariant="warning" 
        />
        <GlassCard 
          title="Approved Leaves" 
          value={leaves.filter(l => l.status === 'Approved').length} 
          icon="CheckCircle2" 
          iconVariant="success" 
        />
      </div>

      {/* Filter Tabs */}
      <div className="dashboard-tab-bar">
        {['all', 'pending', 'approved', 'rejected'].map(f => (
          <button 
            key={f} 
            className={`tab-btn ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Leave Requests Table */}
      <div className="table-preview-section glass-panel">
        <div className="glass-table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Leave Type</th>
                <th>Duration</th>
                <th>Reason</th>
                <th>Status</th>
                {(user?.role === 'hr' || user?.role === 'manager') && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredLeaves.map(leave => (
                <tr key={leave.id}>
                  <td><strong>{leave.employeeName}</strong></td>
                  <td>{leave.department}</td>
                  <td>{leave.type}</td>
                  <td>{leave.startDate} to {leave.endDate} ({leave.days}d)</td>
                  <td>{leave.reason}</td>
                  <td>
                    <span className={`glass-badge glass-badge-${leave.status === 'Approved' ? 'success' : leave.status === 'Pending' ? 'warning' : 'danger'}`}>
                      {leave.status}
                    </span>
                  </td>
                  {(user?.role === 'hr' || user?.role === 'manager') && (
                    <td>
                      {leave.status === 'Pending' && (
                        <div className="request-actions">
                          <button className="icon-btn-action" onClick={() => updateLeaveStatus(leave.id, 'Approved')} title="Approve">
                            <GlassIcon name="Check" size={14} glow={false} />
                          </button>
                          <button className="icon-btn-action danger" onClick={() => updateLeaveStatus(leave.id, 'Rejected')} title="Reject">
                            <GlassIcon name="X" size={14} glow={false} />
                          </button>
                        </div>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog */}
      {showModal && (
        <div className="leave-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="leave-modal-card glass-panel" onClick={e => e.stopPropagation()}>
            <div className="section-header">
              <GlassIcon name="CalendarPlus" variant="primary" size={24} />
              <h3>Submit Time-Off Request</h3>
            </div>
            <form onSubmit={handleSubmit} className="leave-form">
              <div className="login-field">
                <label>Leave Type</label>
                <select 
                  className="glass-input" 
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Personal">Personal Leave</option>
                  <option value="Maternity / Paternity">Maternity / Paternity</option>
                </select>
              </div>

              <div className="form-row">
                <div className="login-field">
                  <label>Start Date</label>
                  <input 
                    type="date" 
                    className="glass-input" 
                    required 
                    value={formData.startDate}
                    onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  />
                </div>
                <div className="login-field">
                  <label>End Date</label>
                  <input 
                    type="date" 
                    className="glass-input" 
                    required 
                    value={formData.endDate}
                    onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div className="login-field">
                <label>Reason for Leave</label>
                <textarea 
                  className="glass-input" 
                  rows="3" 
                  required
                  placeholder="Provide details regarding your request..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>

              <div className="hero-actions" style={{ marginTop: '1rem' }}>
                <button type="submit" className="glass-button">Submit Request</button>
                <button type="button" className="glass-button glass-button-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;