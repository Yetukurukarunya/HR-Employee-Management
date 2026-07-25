import React from 'react';
import GlassIcon from './GlassIcon';
import './GlassCard.css';

const GlassCard = ({
  title,
  subtitle,
  icon,
  iconVariant = 'primary',
  value,
  trend,
  trendLabel,
  badgeText,
  badgeVariant = 'primary',
  children,
  onClick,
  className = '',
  style = {}
}) => {
  return (
    <div 
      className={`glass-card-component ${onClick ? 'interactive' : ''} ${className}`}
      onClick={onClick}
      style={style}
    >
      <div className="glass-card-header">
        {icon && (
          <GlassIcon name={icon} variant={iconVariant} />
        )}
        <div className="glass-card-titles">
          {title && <h3 className="glass-card-title">{title}</h3>}
          {subtitle && <p className="glass-card-subtitle">{subtitle}</p>}
        </div>
        {badgeText && (
          <span className={`glass-badge glass-badge-${badgeVariant}`}>
            {badgeText}
          </span>
        )}
      </div>

      {(value !== undefined || trend !== undefined) && (
        <div className="glass-card-metrics">
          {value !== undefined && <div className="glass-card-value">{value}</div>}
          {trend !== undefined && (
            <div className={`glass-card-trend ${trend >= 0 ? 'positive' : 'negative'}`}>
              <span>{trend >= 0 ? `+${trend}%` : `${trend}%`}</span>
              {trendLabel && <span className="trend-label">{trendLabel}</span>}
            </div>
          )}
        </div>
      )}

      {children && <div className="glass-card-body">{children}</div>}
    </div>
  );
};

export default GlassCard;
