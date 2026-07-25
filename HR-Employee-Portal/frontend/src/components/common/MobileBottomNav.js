import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GlassIcon from './GlassIcon';
import './MobileBottomNav.css';

const MobileBottomNav = () => {
  const { user } = useAuth();

  const navItems = user?.role === 'hr' ? [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/employees', label: 'Employees', icon: 'Users' },
    { path: '/attendance', label: 'Attendance', icon: 'Clock' },
    { path: '/leave', label: 'Leave', icon: 'Calendar' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ] : user?.role === 'manager' ? [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/employees', label: 'Team', icon: 'Users' },
    { path: '/attendance', label: 'Attendance', icon: 'Clock' },
    { path: '/leave', label: 'Leave', icon: 'Calendar' },
    { path: '/settings', label: 'Settings', icon: 'Settings' },
  ] : [
    { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/attendance', label: 'Punch', icon: 'Clock' },
    { path: '/leave', label: 'Leave', icon: 'Calendar' },
    { path: '/payslips', label: 'Payslips', icon: 'Banknote' },
    { path: '/profile', label: 'Profile', icon: 'User' },
  ];

  return (
    <nav className="mobile-glass-bottom-nav glass-panel">
      {navItems.map((item) => (
        <NavLink 
          key={item.path} 
          to={item.path} 
          className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}
        >
          <GlassIcon name={item.icon} size={20} glow={false} />
          <span className="mobile-nav-text">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};

export default MobileBottomNav;
