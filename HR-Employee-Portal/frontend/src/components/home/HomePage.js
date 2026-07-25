import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import GlassIcon from '../common/GlassIcon';
import ThemeSelector from '../common/ThemeSelector';
import './HomePage.css';

const HomePage = () => {
  const navigate = useNavigate();
  const { user, switchRole } = useAuth();

  const handleLaunchPortal = (role = 'hr') => {
    switchRole(role);
    navigate('/dashboard');
  };

  return (
    <div className="home-page-root">
      {/* Navbar */}
      <header className="home-navbar glass-panel">
        <div className="home-nav-brand">
          <GlassIcon name="Building2" variant="primary" size={24} />
          <span className="brand-name">HR Employee Portal</span>
        </div>

        <div className="home-nav-actions">
          <ThemeSelector compact={true} />
          {user ? (
            <button className="glass-button" onClick={() => navigate('/dashboard')}>
              <span>Go to Dashboard</span>
              <GlassIcon name="ArrowRight" size={16} glow={false} />
            </button>
          ) : (
            <>
              <Link to="/login" className="glass-button glass-button-secondary">Sign In</Link>
              <Link to="/signup" className="glass-button">Get Started</Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="home-hero-section">
        <div className="hero-content-box">
          <span className="glass-badge glass-badge-primary hero-badge">
            <GlassIcon name="Sparkles" size={14} glow={false} /> Next-Gen Enterprise Management
          </span>
          <h1 className="hero-main-title">
            Modern Glassmorphic <br />
            <span className="hero-title-gradient">HR & Employee Experience</span>
          </h1>
          <p className="hero-description">
            A state-of-the-art HR platform featuring real-time state synchronization, 5 classy theme presets, digital punch clocks, and multi-role executive control.
          </p>

          <div className="hero-launch-group">
            <button className="glass-button hero-cta-btn" onClick={() => handleLaunchPortal('hr')}>
              <GlassIcon name="ShieldCheck" size={20} glow={false} />
              <span>Launch HR Console</span>
            </button>
            <button className="glass-button glass-button-secondary hero-cta-btn" onClick={() => handleLaunchPortal('manager')}>
              <GlassIcon name="Users" size={20} glow={false} />
              <span>Manager Hub</span>
            </button>
            <button className="glass-button glass-button-secondary hero-cta-btn" onClick={() => handleLaunchPortal('employee')}>
              <GlassIcon name="User" size={20} glow={false} />
              <span>Employee Portal</span>
            </button>
          </div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="home-features-section">
        <div className="section-title-box">
          <h2>Everything Needed to Scale Teams</h2>
          <p>Built with precision glassmorphism, responsive UX, and zero friction workflows</p>
        </div>

        <div className="home-features-grid">
          <div className="home-feature-card glass-panel">
            <GlassIcon name="Users" variant="purple" size={32} />
            <h3>Employee Directory</h3>
            <p>Unified workforce records with grid & table toggle views, department filters, and search.</p>
          </div>

          <div className="home-feature-card glass-panel">
            <GlassIcon name="Clock" variant="info" size={32} />
            <h3>Digital Punch Clock</h3>
            <p>Live shift counter with real-time clock in/out tracking and weekly hours logs.</p>
          </div>

          <div className="home-feature-card glass-panel">
            <GlassIcon name="Calendar" variant="warning" size={32} />
            <h3>Leave Management</h3>
            <p>Synced leave submission modal with instant Manager approvals and HR analytics updates.</p>
          </div>

          <div className="home-feature-card glass-panel">
            <GlassIcon name="Banknote" variant="success" size={32} />
            <h3>Payslips & Payroll</h3>
            <p>Printable glassy invoice receipt statements with detailed earnings and tax deductions.</p>
          </div>

          <div className="home-feature-card glass-panel">
            <GlassIcon name="Palette" variant="gold" size={32} />
            <h3>5 Classy Themes</h3>
            <p>Switch seamlessly between Crystal Glass, Midnight Cyber, Emerald Royale, Sapphire, and Sunset Luxe.</p>
          </div>

          <div className="home-feature-card glass-panel">
            <GlassIcon name="Zap" variant="danger" size={32} />
            <h3>Coordinated Multi-Role Sync</h3>
            <p>Real-time data synchronization between HR, Manager, and Employee dashboards.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;