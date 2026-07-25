import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import GlassCard from '../common/GlassCard';
import GlassIcon from '../common/GlassIcon';
import './AttendanceTracker.css';

const AttendanceTracker = () => {
  const { user } = useAuth();
  const { attendance, userClockState, toggleClock } = useApp();
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLiveTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="attendance-page-container">
      {/* Header Banner */}
      <div className="page-header-banner glass-panel">
        <div>
          <span className="glass-badge glass-badge-primary">
            <GlassIcon name="Clock" size={14} glow={false} /> Real-Time Time Tracking
          </span>
          <h1>Attendance Console</h1>
          <p>Punch-in shift logs, daily duration tracking, and activity audit</p>
        </div>

        <div className="digital-clock-display glass-panel">
          <div className="clock-time-str">{liveTime.toLocaleTimeString()}</div>
          <div className="clock-date-str">{liveTime.toLocaleDateString([], { weekday: 'long', month: 'short', day: 'numeric' })}</div>
        </div>
      </div>

      {/* Main Punch Clock Card */}
      <div className="punch-clock-card glass-panel">
        <div className="punch-status-header">
          <div className="punch-status-badge">
            <GlassIcon 
              name="Activity" 
              variant={userClockState.clockedIn ? "success" : "warning"} 
              size={28} 
            />
            <div>
              <h2>{userClockState.clockedIn ? 'Currently On Shift' : 'Shift Not Started'}</h2>
              <p>{userClockState.clockedIn ? `Punched in at ${userClockState.clockInTime}` : 'Click below to punch in for today'}</p>
            </div>
          </div>

          <button 
            className={`glass-button punch-main-btn ${userClockState.clockedIn ? 'btn-out' : ''}`}
            onClick={() => toggleClock(user)}
          >
            <GlassIcon name={userClockState.clockedIn ? "Square" : "Play"} size={20} glow={false} />
            <span>{userClockState.clockedIn ? 'Clock Out Now' : 'Clock In Now'}</span>
          </button>
        </div>
      </div>

      {/* Attendance History Table */}
      <div className="table-preview-section glass-panel">
        <div className="section-header">
          <GlassIcon name="History" variant="info" size={20} />
          <h3>Attendance Shift History</h3>
        </div>
        <div className="glass-table-wrapper">
          <table className="glass-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Clock In</th>
                <th>Clock Out</th>
                <th>Hours Logged</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((log) => (
                <tr key={log.id}>
                  <td><strong>{log.date}</strong></td>
                  <td>{log.clockIn}</td>
                  <td>{log.clockOut || 'In Progress'}</td>
                  <td>{log.hoursWorked}</td>
                  <td>
                    <span className={`glass-badge glass-badge-${log.status === 'Present' ? 'success' : 'warning'}`}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendanceTracker;