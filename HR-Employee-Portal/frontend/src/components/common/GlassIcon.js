import React from 'react';
import * as Icons from 'lucide-react';
import './GlassIcon.css';

const GlassIcon = ({ 
  name = 'Sparkles', 
  variant = 'primary', // primary, success, warning, danger, info, purple, gold
  size = 22, 
  glow = true,
  className = '',
  style = {} 
}) => {
  // Dynamically resolve icon from Lucide with safe fallback
  const IconComponent = Icons[name] || Icons.CircleHelp || Icons.HelpCircle || Icons.Info || (() => null);

  return (
    <div 
      className={`glass-icon-container glass-icon-${variant} ${glow ? 'icon-glow' : ''} ${className}`}
      style={style}
    >
      <div className="glass-icon-shine" />
      <IconComponent size={size} className="glass-icon-svg" />
    </div>
  );
};

export default GlassIcon;
