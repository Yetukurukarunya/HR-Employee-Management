import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  Calendar,
  DollarSign,
  Award,
  TrendingUp,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  ChevronLeft,
  ChevronRight,
  Menu,
  Building,
  User,
  Shield,
  HelpCircle
} from 'lucide-react';
import './Sidebar.css';

// Lucide Icon mapping dictionary
const iconMap = {
  LayoutDashboard: LayoutDashboard,
  Users: Users,
  Clock: Clock,
  Calendar: Calendar,
  DollarSign: DollarSign,
  Award: Award,
  TrendingUp: TrendingUp,
  BarChart3: BarChart3,
  Settings: Settings,
  LogOut: LogOut,
  Bell: Bell,
  ChevronLeft: ChevronLeft,
  ChevronRight: ChevronRight,
  Menu: Menu,
  Building: Building,
  User: User,
  Shield: Shield,
  HelpCircle: HelpCircle
};

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { notifications } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState(['main', 'operations', 'analytics', 'mywork']);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Sync collapsed state with body class & localstorage on load
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar_collapsed') === 'true';
    setIsCollapsed(savedState);
    if (savedState) {
      document.body.classList.add('sidebar-collapsed');
    } else {
      document.body.classList.remove('sidebar-collapsed');
    }
  }, []);

  const handleToggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      if (next) {
        document.body.classList.add('sidebar-collapsed');
      } else {
        document.body.classList.remove('sidebar-collapsed');
      }
      return next;
    });
  };

  const toggleSection = (section) => {
    if (isCollapsed) return;
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get active notification count
  const unreadCount = notifications ? notifications.filter(n => n.unread).length : 0;

  // HR Menu Layout
  const hrMenu = [
    {
      section: 'main',
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', badge: null },
        { path: '/employees', label: 'Employees', icon: 'Users', badge: '156' },
      ]
    },
    {
      section: 'operations',
      title: 'Operations',
      items: [
        { path: '/attendance', label: 'Attendance', icon: 'Clock', badge: null },
        { path: '/leave', label: 'Leave Management', icon: 'Calendar', badge: '8' },
        { path: '/payroll', label: 'Payroll', icon: 'DollarSign', badge: null },
        { path: '/performance', label: 'Performance', icon: 'Award', badge: null },
      ]
    },
    {
      section: 'analytics',
      title: 'Insights',
      items: [
        { path: '/analytics', label: 'Analytics', icon: 'TrendingUp', badge: null },
        { path: '/reports', label: 'Reports', icon: 'BarChart3', badge: null },
      ]
    }
  ];

  // Manager Menu Layout
  const managerMenu = [
    {
      section: 'main',
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', badge: null },
        { path: '/employees', label: 'My Team', icon: 'Users', badge: '24' },
      ]
    },
    {
      section: 'operations',
      title: 'Team Management',
      items: [
        { path: '/attendance', label: 'Team Attendance', icon: 'Clock', badge: null },
        { path: '/leave', label: 'Leave Approval', icon: 'Calendar', badge: '3' },
        { path: '/performance', label: 'Performance', icon: 'Award', badge: null },
      ]
    },
    {
      section: 'reports',
      title: 'Reports',
      items: [
        { path: '/reports', label: 'Team Reports', icon: 'BarChart3', badge: null },
      ]
    }
  ];

  // Employee Menu Layout
  const employeeMenu = [
    {
      section: 'main',
      title: 'Main',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard', badge: null },
        { path: '/profile', label: 'My Profile', icon: 'User', badge: null },
      ]
    },
    {
      section: 'mywork',
      title: 'My Work',
      items: [
        { path: '/attendance', label: 'My Attendance', icon: 'Clock', badge: null },
        { path: '/leave', label: 'Leave Request', icon: 'Calendar', badge: null },
        { path: '/payslips', label: 'My Payslips', icon: 'DollarSign', badge: null },
        { path: '/performance', label: 'My Performance', icon: 'Award', badge: null },
      ]
    }
  ];

  const menuSections = user?.role === 'hr' ? hrMenu : 
                       user?.role === 'manager' ? managerMenu : 
                       employeeMenu;

  const getRoleBadge = () => {
    if (user?.role === 'hr') return { label: 'HR Admin', color: '#2563EB', icon: Shield };
    if (user?.role === 'manager') return { label: 'Manager', color: '#10B981', icon: Users };
    return { label: 'Employee', color: '#6366F1', icon: User };
  };

  const roleBadge = getRoleBadge();
  const RoleIcon = roleBadge.icon;

  const renderIcon = (name, className = '') => {
    const IconComponent = iconMap[name] || HelpCircle;
    return <IconComponent className={`sidebar-icon-svg ${className}`} size={20} />;
  };

  return (
    <>
      {/* Mobile Drawer Trigger (Hamburger) */}
      <button 
        className="mobile-hamburger-trigger"
        onClick={() => setIsMobileOpen(prev => !prev)}
        aria-label="Toggle Sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div 
          className="sidebar-mobile-overlay"
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      
      <aside className={`modern-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Logo Header */}
        <div className="sidebar-header-section">
          <div className="sidebar-brand" onClick={() => { navigate('/dashboard'); setIsMobileOpen(false); }}>
            <div className="brand-logo-container">
              <Building size={22} className="brand-logo-icon" />
            </div>
            {!isCollapsed && (
              <div className="brand-info">
                <h2 className="brand-title">HR Portal</h2>
                <p className="brand-subtitle">Enterprise HCM</p>
              </div>
            )}
          </div>
          
          <button 
            className="sidebar-collapse-btn"
            onClick={handleToggleCollapse}
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* User Role Badge */}
        {!isCollapsed && (
          <div className="role-badge-container">
            <div className="role-badge" style={{ borderColor: `${roleBadge.color}30`, background: `${roleBadge.color}10` }}>
              <RoleIcon size={14} style={{ color: roleBadge.color }} />
              <span className="role-text" style={{ color: roleBadge.color }}>{roleBadge.label}</span>
            </div>
          </div>
        )}

        {/* Navigation Area */}
        <nav className="sidebar-navigation">
          {menuSections.map(section => (
            <div key={section.section} className="nav-section">
              {!isCollapsed && (
                <button 
                  className="section-header"
                  onClick={() => toggleSection(section.section)}
                >
                  <span className="section-title">{section.title}</span>
                  <span className={`section-arrow-icon ${expandedSections.includes(section.section) ? 'expanded' : ''}`}>
                    ▾
                  </span>
                </button>
              )}
              
              <ul className={`nav-items ${!expandedSections.includes(section.section) && !isCollapsed ? 'collapsed' : ''}`}>
                {section.items.map(item => (
                  <li key={item.path} className="nav-item">
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                      onClick={() => setIsMobileOpen(false)}
                      title={isCollapsed ? item.label : ''}
                    >
                      <span className="nav-icon">{renderIcon(item.icon)}</span>
                      {!isCollapsed && (
                        <>
                          <span className="nav-label">{item.label}</span>
                          {item.badge && (
                            <span className="nav-badge">{item.badge}</span>
                          )}
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer Actions Panel */}
        <div className="sidebar-bottom-panel">
          <div className="sidebar-utility-links">
            <NavLink 
              to="/settings" 
              className={({ isActive }) => `utility-btn ${isActive ? 'active' : ''}`}
              title="Settings"
              onClick={() => setIsMobileOpen(false)}
            >
              <Settings size={18} />
              {!isCollapsed && <span className="utility-label">Settings</span>}
            </NavLink>

            <NavLink 
              to="/notifications" 
              className={({ isActive }) => `utility-btn ${isActive ? 'active' : ''}`}
              title="Notifications"
              onClick={() => setIsMobileOpen(false)}
            >
              <div className="utility-bell-container">
                <Bell size={18} />
                {unreadCount > 0 && <span className="utility-badge-dot" />}
              </div>
              {!isCollapsed && (
                <>
                  <span className="utility-label">Alerts</span>
                  {unreadCount > 0 && <span className="unread-number-badge">{unreadCount}</span>}
                </>
              )}
            </NavLink>

            <button 
              className="utility-btn logout-btn" 
              onClick={handleLogout}
              title="Sign Out"
            >
              <LogOut size={18} />
              {!isCollapsed && <span className="utility-label">Sign Out</span>}
            </button>
          </div>

          {/* User Profile Card */}
          <div className="sidebar-user-card" onClick={() => { navigate('/profile'); setIsMobileOpen(false); }}>
            <div className="user-card-avatar">
              <div className="avatar-circle">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="user-status-dot online"></div>
            </div>
            {!isCollapsed && (
              <div className="user-card-info">
                <h4 className="user-card-name">
                  {user?.firstName} {user?.lastName}
                </h4>
                <p className="user-card-role">{user?.position || 'Employee'}</p>
                <p className="user-card-dept">{user?.department || 'Department'}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;