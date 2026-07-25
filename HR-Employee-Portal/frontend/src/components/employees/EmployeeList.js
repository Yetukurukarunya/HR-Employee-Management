import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import GlassCard from '../common/GlassCard';
import GlassIcon from '../common/GlassIcon';
import './EmployeeList.css';

const EmployeeList = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { employees, deleteEmployee } = useApp();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deptFilter, setDeptFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  const filteredEmployees = employees.filter(emp => {
    const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.email.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          emp.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = deptFilter === 'all' || emp.department === deptFilter;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="employee-page-container">
      {/* Header Banner */}
      <div className="page-header-banner glass-panel">
        <div>
          <span className="glass-badge glass-badge-primary">
            <GlassIcon name="Users" size={14} glow={false} /> Team Directory
          </span>
          <h1>Employee Directory</h1>
          <p>Browse, manage, and inspect organization workforce</p>
        </div>

        {user?.role === 'hr' && (
          <button className="glass-button" onClick={() => navigate('/employees/new')}>
            <GlassIcon name="UserPlus" size={18} glow={false} />
            <span>Add New Employee</span>
          </button>
        )}
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="directory-controls-bar glass-panel">
        <div className="search-box">
          <GlassIcon name="Search" size={18} glow={false} className="search-icon" />
          <input
            type="text"
            className="glass-input"
            placeholder="Search by name, position, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-controls-group">
          <select 
            className="glass-input select-filter"
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
          >
            <option value="all">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Human Resources">Human Resources</option>
            <option value="Design">Design</option>
            <option value="Marketing">Marketing</option>
          </select>

          <div className="view-toggle-btns">
            <button 
              className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Grid View"
            >
              <GlassIcon name="Grid" size={16} glow={false} />
            </button>
            <button 
              className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <GlassIcon name="List" size={16} glow={false} />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or Table View */}
      {viewMode === 'grid' ? (
        <div className="employees-grid-view">
          {filteredEmployees.map(emp => (
            <GlassCard key={emp.id} className="employee-card">
              <div className="emp-card-top">
                <img src={emp.avatar} alt={emp.name} className="emp-card-avatar" />
                <span className={`glass-badge glass-badge-${emp.status === 'Active' ? 'success' : 'warning'}`}>
                  {emp.status}
                </span>
              </div>
              <div className="emp-card-info">
                <h3>{emp.name}</h3>
                <p className="emp-pos">{emp.position}</p>
                <span className="emp-dept-pill"><GlassIcon name="Building" size={12} glow={false} /> {emp.department}</span>
              </div>
              <div className="emp-card-contacts">
                <div className="contact-line"><GlassIcon name="Mail" size={14} glow={false} /> {emp.email}</div>
                <div className="contact-line"><GlassIcon name="Phone" size={14} glow={false} /> {emp.phone || '+1 (555) 123-4567'}</div>
              </div>

              {user?.role === 'hr' && (
                <div className="emp-card-actions">
                  <button className="glass-button glass-button-secondary" onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                    <GlassIcon name="Edit3" size={14} glow={false} /> Edit
                  </button>
                  <button className="glass-button glass-button-secondary" style={{ color: 'var(--danger)' }} onClick={() => deleteEmployee(emp.id)}>
                    <GlassIcon name="Trash2" size={14} glow={false} /> Remove
                  </button>
                </div>
              )}
            </GlassCard>
          ))}
        </div>
      ) : (
        <div className="table-preview-section glass-panel">
          <div className="glass-table-wrapper">
            <table className="glass-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Position</th>
                  <th>Phone</th>
                  <th>Status</th>
                  {user?.role === 'hr' && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(emp => (
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
                    <td>{emp.phone || '+1 (555) 123-4567'}</td>
                    <td>
                      <span className={`glass-badge glass-badge-${emp.status === 'Active' ? 'success' : 'warning'}`}>
                        {emp.status}
                      </span>
                    </td>
                    {user?.role === 'hr' && (
                      <td>
                        <button className="icon-btn-action" onClick={() => navigate(`/employees/edit/${emp.id}`)}>
                          <GlassIcon name="Edit3" size={14} glow={false} />
                        </button>
                        <button className="icon-btn-action danger" onClick={() => deleteEmployee(emp.id)}>
                          <GlassIcon name="Trash2" size={14} glow={false} />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;