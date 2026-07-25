import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import GlassIcon from '../common/GlassIcon';
import ThemeSelector from '../common/ThemeSelector';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in both email and password fields.');
      return;
    }

    setLoading(true);
    setError('');

    const result = await login(email, password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Invalid credentials. Please try again.');
    }
    
    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-top-bar">
        <Link to="/" className="login-brand-link">
          <GlassIcon name="Building2" variant="primary" size={20} />
          <span>HR Employee Portal</span>
        </Link>
        <ThemeSelector compact={true} />
      </div>

      <div className="login-wrapper">
        <div className="login-glass-card glass-panel">
          <div className="login-header">
            <div className="login-icon-badge">
              <GlassIcon name="ShieldCheck" variant="purple" size={32} />
            </div>
            <h2>Welcome Back</h2>
            <p>Access your enterprise workspace dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && (
              <div className="login-error-alert animate-fade-in">
                <GlassIcon name="AlertCircle" variant="danger" size={18} glow={false} />
                <span>{error}</span>
              </div>
            )}
            
            <div className="login-field">
              <label htmlFor="email">Email Address</label>
              <div className="login-input-box">
                <GlassIcon name="Mail" size={18} glow={false} className="input-prefix" />
                <input
                  type="email"
                  id="email"
                  className="glass-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@company.com"
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="login-field">
              <div className="field-label-row">
                <label htmlFor="password">Password</label>
                <a href="#forgot" className="forgot-password-link" onClick={(e) => { e.preventDefault(); alert('Please contact your HR administrator to reset your credentials.'); }}>
                  Forgot?
                </a>
              </div>
              <div className="login-input-box">
                <GlassIcon name="Lock" size={18} glow={false} className="input-prefix" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className="glass-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <GlassIcon name={showPassword ? 'EyeOff' : 'Eye'} size={18} glow={false} />
                </button>
              </div>
            </div>

            <div className="login-remember-row">
              <label className="remember-checkbox">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox-custom" />
                <span>Remember me on this device</span>
              </label>
            </div>

            <button 
              type="submit" 
              className="glass-button w-full login-submit-btn"
              disabled={loading}
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In to Portal</span>
                  <GlassIcon name="ArrowRight" size={18} glow={false} />
                </>
              )}
            </button>
          </form>

          <div className="login-card-footer">
            <p>
              New team member?{' '}
              <Link to="/signup" className="signup-highlight-link">
                Register account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;