import React, { useState } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import GlassIcon from './GlassIcon';
import './ThemeSelector.css';

const THEMES = [
  { id: 'crystal', name: 'Crystal Glass', icon: 'Sparkles', color: '#4f46e5', previewBg: 'linear-gradient(135deg, #f0f4fd, #eef2ff)' },
  { id: 'midnight', name: 'Midnight Cyber', icon: 'Moon', color: '#818cf8', previewBg: 'linear-gradient(135deg, #0d111e, #070913)' },
  { id: 'emerald', name: 'Emerald Royale', icon: 'Gem', color: '#10b981', previewBg: 'linear-gradient(135deg, #062419, #073022)' },
  { id: 'sapphire', name: 'Sapphire Horizon', icon: 'Compass', color: '#0ea5e9', previewBg: 'linear-gradient(135deg, #0b192c, #1e3e62)' },
  { id: 'sunset', name: 'Sunset Luxe', icon: 'Sun', color: '#ff6b6b', previewBg: 'linear-gradient(135deg, #2a0845, #ff6b6b)' },
];

const ThemeSelector = ({ compact = false }) => {
  const { theme, changeTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const activeThemeObj = THEMES.find(t => t.id === theme) || THEMES[0];

  return (
    <div className={`theme-selector-wrapper ${compact ? 'compact' : ''}`}>
      <button 
        className="theme-selector-trigger glass-panel"
        onClick={() => setIsOpen(!isOpen)}
        title="Change UI Theme"
      >
        <GlassIcon name={activeThemeObj.icon} size={16} glow={false} style={{ padding: '0.2rem' }} />
        {!compact && <span className="active-theme-name">{activeThemeObj.name}</span>}
        <GlassIcon name="ChevronDown" size={14} glow={false} style={{ padding: '0.1rem' }} />
      </button>

      {isOpen && (
        <>
          <div className="theme-dropdown-overlay" onClick={() => setIsOpen(false)} />
          <div className="theme-dropdown-menu glass-panel">
            <div className="theme-dropdown-header">
              <GlassIcon name="Palette" size={16} variant="purple" />
              <span>Select Theme</span>
            </div>

            <div className="theme-options-grid">
              {THEMES.map((t) => {
                const isSelected = theme === t.id;
                return (
                  <button
                    key={t.id}
                    className={`theme-option-card ${isSelected ? 'active' : ''}`}
                    onClick={() => {
                      changeTheme(t.id);
                      setIsOpen(false);
                    }}
                  >
                    <div 
                      className="theme-color-preview" 
                      style={{ background: t.previewBg }}
                    >
                      <div className="theme-color-accent" style={{ background: t.color }} />
                      {isSelected && (
                        <div className="theme-check-badge">
                          <GlassIcon name="Check" size={12} variant="success" glow={false} />
                        </div>
                      )}
                    </div>
                    <span className="theme-label">{t.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ThemeSelector;
