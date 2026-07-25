import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useApp } from '../../contexts/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Bell,
  Mail,
  Calendar as CalendarIcon,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  Zap,
  Clock,
  Settings,
  LogOut,
  User,
  HelpCircle,
  Building,
  Check,
  Plus,
  MessageSquare
} from 'lucide-react';
import './Header.css';

const Header = () => {
  const { user, logout } = useAuth();
  const { theme, changeTheme } = useTheme();
  const { notifications, addNotification, toggleClock, userClockState } = useApp();
  const navigate = useNavigate();

  // Dropdown visibility states
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('English');
  const [searchQuery, setSearchQuery] = useState('');

  // Clock state
  const [currentTime, setCurrentTime] = useState(new Date());

  // Refs for closing dropdowns on outside click
  const userMenuRef = useRef(null);
  const notifMenuRef = useRef(null);
  const quickActionsRef = useRef(null);
  const langMenuRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (quickActionsRef.current && !quickActionsRef.current.contains(event.target)) {
        setShowQuickActions(false);
      }
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setShowLanguageMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut listener for Search (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleThemeToggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    changeTheme(nextTheme);
  };

  const unreadCount = notifications ? notifications.filter(n => n.unread).length : 0;

  const handleQuickAction = (action) => {
    setShowQuickActions(false);
    if (action === 'add-employee') navigate('/employees/new');
    if (action === 'request-leave') navigate('/leave');
    if (action === 'clock-io') toggleClock(user);
    if (action === 'performance-goal') navigate('/performance');
  };

  const languages = ['English', 'Español', 'Français', 'Deutsch', '日本語'];

  return (
    <>
      <header className="top-navbar">
        <div className="navbar-container">
          
          {/* Left Column: Logo & Global Search */}
          <div className="navbar-left">
            <div className="navbar-mobile-branding" onClick={() => navigate('/dashboard')}>
              <Building size={20} className="brand-logo-icon" />
              <span className="brand-title">HR Portal</span>
            </div>
            
            {/* Global Search */}
            <div className="navbar-search-wrapper">
              <Search className="search-icon" size={16} />
              <input
                id="global-search-input"
                type="text"
                className="navbar-search-input"
                placeholder="Search employees, documents, tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <span className="search-shortcut">⌘K</span>
            </div>
          </div>

          {/* Right Column: Time, Actions, Icons, Profile */}
          <div className="navbar-right">
            
            {/* Real-time Greetings, Clock & Date */}
            <div className="navbar-time-greet">
              <div className="greeting">
                <span className="greet-prefix">{getGreeting()},</span>
                <span className="greet-name">{user?.firstName || 'User'}</span>
              </div>
              <div className="time-display">
                <Clock size={12} className="time-icon" />
                <span className="current-time">
                  {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                </span>
                <span className="divider">•</span>
                <span className="current-date">
                  {currentTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="action-wrapper" ref={quickActionsRef}>
              <button 
                className="action-circle-btn quick-action-trigger" 
                onClick={() => setShowQuickActions(prev => !prev)}
                title="Quick Actions"
              >
                <Zap size={18} />
              </button>
              {showQuickActions && (
                <div className="navbar-dropdown-panel quick-actions-panel">
                  <div className="dropdown-panel-header">
                    <h4>Quick Actions</h4>
                  </div>
                  <div className="dropdown-panel-content">
                    {user?.role === 'hr' && (
                      <button className="dropdown-menu-item" onClick={() => handleQuickAction('add-employee')}>
                        <Plus size={16} />
                        <span>Onboard Employee</span>
                      </button>
                    )}
                    <button className="dropdown-menu-item" onClick={() => handleQuickAction('clock-io')}>
                      <Clock size={16} />
                      <span>{userClockState.clockedIn ? 'Clock Out' : 'Clock In'}</span>
                    </button>
                    <button className="dropdown-menu-item" onClick={() => handleQuickAction('request-leave')}>
                      <CalendarIcon size={16} />
                      <span>Request Time Off</span>
                    </button>
                    <button className="dropdown-menu-item" onClick={() => handleQuickAction('performance-goal')}>
                      <Award size={16} />
                      <span>Create Team Goal</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Messages Hub */}
            <button 
              className="action-circle-btn" 
              onClick={() => navigate('/help')} 
              title="Help & Support Desk"
            >
              <MessageSquare size={18} />
            </button>

            {/* Calendar Events Indicator */}
            <button 
              className="action-circle-btn" 
              onClick={() => navigate('/dashboard')} 
              title="Team Calendar"
            >
              <CalendarIcon size={18} />
            </button>

            {/* Theme Toggle */}
            <button 
              className="action-circle-btn" 
              onClick={handleThemeToggle}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language Selector */}
            <div className="action-wrapper" ref={langMenuRef}>
              <button 
                className="action-circle-btn" 
                onClick={() => setShowLanguageMenu(prev => !prev)}
                title="Language Select"
              >
                <Globe size={18} />
              </button>
              {showLanguageMenu && (
                <div className="navbar-dropdown-panel lang-panel">
                  {languages.map(lang => (
                    <button 
                      key={lang} 
                      className={`dropdown-menu-item ${currentLanguage === lang ? 'active' : ''}`}
                      onClick={() => { setCurrentLanguage(lang); setShowLanguageMenu(false); }}
                    >
                      <span>{lang}</span>
                      {currentLanguage === lang && <Check size={14} className="check-icon" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Real-time Notifications Bell */}
            <div className="action-wrapper" ref={notifMenuRef}>
              <button 
                className="action-circle-btn notification-bell-btn"
                onClick={() => setShowNotifications(prev => !prev)}
                title="Notifications Alert"
              >
                <Bell size={18} />
                {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
              </button>
              {showNotifications && (
                <div className="navbar-dropdown-panel notifications-panel">
                  <div className="dropdown-panel-header">
                    <h4>Notifications</h4>
                    {unreadCount > 0 && <span className="unread-label">{unreadCount} new</span>}
                  </div>
                  <div className="dropdown-panel-list">
                    {notifications && notifications.length > 0 ? (
                      notifications.slice(0, 5).map(notif => (
                        <div key={notif.id} className={`notification-item-row ${notif.unread ? 'unread' : ''}`}>
                          <div className="notification-bullet-point" />
                          <div className="notif-details">
                            <span className="notif-title">{notif.title}</span>
                            <span className="notif-desc">{notif.message}</span>
                            <span className="notif-time">{notif.time || 'Just now'}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="empty-notifications">No new notifications</div>
                    )}
                  </div>
                  <div className="dropdown-panel-footer">
                    <button className="view-all-btn" onClick={() => { setShowNotifications(false); navigate('/notifications'); }}>
                      View All Notifications
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="divider-vertical" />

            {/* User Profile Area */}
            <div className="user-profile-wrapper" ref={userMenuRef}>
              <button 
                className="user-profile-trigger" 
                onClick={() => setShowUserMenu(prev => !prev)}
              >
                <div className="user-avatar">
                  {user?.firstName?.[0]}{user?.lastName?.[0]}
                </div>
                <div className="user-meta-info">
                  <span className="user-full-name">{user?.firstName} {user?.lastName}</span>
                  <span className="user-department-tag">{user?.department || 'Department'}</span>
                </div>
                <ChevronDown size={14} className={`chevron-arrow ${showUserMenu ? 'rotate' : ''}`} />
              </button>

              {showUserMenu && (
                <div className="navbar-dropdown-panel user-panel">
                  <div className="user-profile-header">
                    <div className="avatar-large">{user?.firstName?.[0]}{user?.lastName?.[0]}</div>
                    <div className="user-contact-details">
                      <span className="full-name">{user?.firstName} {user?.lastName}</span>
                      <span className="email">{user?.email}</span>
                      <span className="position-tag">{user?.position}</span>
                    </div>
                  </div>
                  <div className="user-dropdown-menu">
                    <button className="dropdown-menu-item" onClick={() => { setShowUserMenu(false); navigate('/profile'); }}>
                      <User size={16} />
                      <span>My Profile</span>
                    </button>
                    <button className="dropdown-menu-item" onClick={() => { setShowUserMenu(false); navigate('/settings'); }}>
                      <Settings size={16} />
                      <span>Settings</span>
                    </button>
                    <button className="dropdown-menu-item" onClick={() => { setShowUserMenu(false); navigate('/help'); }}>
                      <HelpCircle size={16} />
                      <span>Help & FAQs</span>
                    </button>
                  </div>
                  <div className="user-dropdown-footer">
                    <button className="logout-action-btn" onClick={handleLogout}>
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
