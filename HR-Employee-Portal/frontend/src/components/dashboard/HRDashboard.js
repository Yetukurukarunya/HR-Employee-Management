import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import GlassCard from '../common/GlassCard';
import GlassIcon from '../common/GlassIcon';
import './Dashboard.css';

const HRDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees, leaves, attendance, notifications } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const totalEmployees = employees.length;
  const presentToday = attendance.filter(a => a.status === 'Present').length;
  const pendingLeaves = leaves.filter(l => l.status === 'Pending').length;

  const handleExportReport = () => {
    const reportData = {
      generatedDate: new Date().toLocaleDateString(),
      totalEmployees,
      presentToday,
      pendingLeaves,
      employees,
      leaves
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `HR-Enterprise-Report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container">
      {/* Executive Hero Banner */}
      <div className="dashboard-hero-banner glass-panel">
        <div className="hero-text">
          <span className="hero-pill glass-badge glass-badge-primary">
            <GlassIcon name="ShieldCheck" size={14} glow={false} /> Executive HR Console
          </span>
          <h1>Human Resources Control Center</h1>
          <p>Real-time workforce analytics, department metrics, and global operations</p>
        </div>
        <div className="hero-actions">
          <button className="glass-button" onClick={() => navigate('/employees/new')}>
            <GlassIcon name="UserPlus" size={18} glow={false} />
            <span>Add Employee</span>
          </button>
          <button className="glass-button glass-button-secondary" onClick={handleExportReport}>
            <GlassIcon name="Download" size={18} glow={false} />
            <span>Export Analytics</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tab-bar">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <GlassIcon name="LayoutGrid" size={16} glow={false} />
          <span>Workforce Overview</span>
        </button>
        <button 
          className={`tab-btn ${activeTab === 'departments' ? 'active' : ''}`}
          onClick={() => setActiveTab('departments')}
        >
          <GlassIcon name="Building" size={16} glow={false} />
          <span>Department Health</span>
        </button>
      </div>

      {activeTab === 'overview' ? (
        <>
          {/* Key Metrics Grid */}
          <div className="metrics-grid">
            <GlassCard
              title="Total Workforce"
              subtitle="Active Team Members"
              value={totalEmployees}
              trend={4.5}
              trendLabel="this month"
              icon="Users"
              iconVariant="primary"
              onClick={() => navigate('/employees')}
            />
            <GlassCard
              title="Present Today"
              subtitle="Daily Attendance"
              value={presentToday}
              trend={98.2}
              trendLabel="on-time rate"
              icon="UserCheck"
              iconVariant="success"
              onClick={() => navigate('/attendance')}
            />
            <GlassCard
              title="Pending Approvals"
              subtitle="Leave Requests"
              value={pendingLeaves}
              badgeText={pendingLeaves > 0 ? "Action Needed" : "All Clear"}
              badgeVariant={pendingLeaves > 0 ? "warning" : "success"}
              icon="Calendar"
              iconVariant="warning"
              onClick={() => navigate('/leave')}
            />
            <GlassCard
              title="Payroll Status"
              subtitle="Current Period"
              value="$98.5K"
              badgeText="Ready"
              badgeVariant="primary"
              icon="Banknote"
              iconVariant="purple"
              onClick={() => navigate('/payroll')}
            />
          </div>

          {/* Quick Actions & Live Stream Section */}
          <div className="dashboard-split-layout">
            <div className="split-main glass-panel">
              <div className="section-header">
                <GlassIcon name="Zap" variant="gold" size={20} />
                <h3>Quick Management Actions</h3>
              </div>
              <div className="quick-actions-grid">
                <button className="action-card glass-panel" onClick={() => navigate('/employees/new')}>
                  <GlassIcon name="UserPlus" variant="purple" size={24} />
                  <span>Onboard Employee</span>
                </button>
                <button className="action-card glass-panel" onClick={() => navigate('/attendance')}>
                  <GlassIcon name="Clock" variant="info" size={24} />
                  <span>Track Attendance</span>
                </button>
                <button className="action-card glass-panel" onClick={() => navigate('/leave')}>
                  <GlassIcon name="Calendar" variant="warning" size={24} />
                  <span>Review Leaves</span>
                </button>
                <button className="action-card glass-panel" onClick={() => navigate('/payroll')}>
                  <GlassIcon name="Banknote" variant="success" size={24} />
                  <span>Run Payroll</span>
                </button>
              </div>

              {/* Employee Directory Preview Table */}
              <div className="table-preview-section">
                <div className="section-header">
                  <GlassIcon name="Users" variant="primary" size={20} />
                  <h3>Recent Team Directory</h3>
                  <button className="view-all-link" onClick={() => navigate('/employees')}>View All →</button>
                </div>
                <div className="glass-table-wrapper">
                  <table className="glass-table">
                    <thead>
                      <tr>
                        <th>Employee</th>
                        <th>Department</th>
                        <th>Position</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employees.slice(0, 4).map(emp => (
                        <tr key={emp.id}>
                          <td className="emp-td-info">
                            <img src={emp.avatar} alt={emp.name} className="table-avatar" />
                            <div>
                              <div className="emp-name">{emp.name}</div>
                              <div className="emp-email">{emp.email}</div>
                            </div>
                          </td>
                          <td>{emp.department}</td>
                          <td>{emp.position}</td>
                          <td>
                            <span className={`glass-badge glass-badge-${emp.status === 'Active' ? 'success' : 'warning'}`}>
                              {emp.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Live Feed Side Column */}
            <div className="split-side glass-panel">
              <div className="section-header">
                <GlassIcon name="Activity" variant="info" size={20} />
                <h3>Live Portal Activity</h3>
              </div>
              <div className="activity-timeline">
                {notifications.slice(0, 5).map(n => (
                  <div key={n.id} className="timeline-item">
                    <GlassIcon name="Bell" variant="primary" size={14} glow={false} />
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
        </>
      ) : (
        /* Department Health View */
        <div className="departments-health-grid">
          {['Engineering', 'Human Resources', 'Design', 'Marketing'].map((dept, idx) => (
            <GlassCard key={idx} title={dept} subtitle="Department Overview" icon="Building" iconVariant="purple">
              <div className="dept-stat-row">
                <span>Headcount:</span>
                <strong>{employees.filter(e => e.department === dept).length || 4} members</strong>
              </div>
              <div className="dept-stat-row">
                <span>Performance Score:</span>
                <strong>4.8 / 5.0</strong>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${85 + idx * 3}%` }} />
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default HRDashboard;
