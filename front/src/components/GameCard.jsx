import React from 'react';

export default function GameCard({ 
  children, 
  className = '',
  hover = true,
  glass = true,
  dark = false,
  onClick = null
}) {
  const baseClass = glass 
    ? (dark ? 'glass-card-dark' : 'glass-card')
    : 'bg-white rounded-lg shadow-card';
  
  const hoverClass = hover ? 'card-hover' : '';
  const clickClass = onClick ? 'cursor-pointer' : '';

  return (
    <div 
      className={`${baseClass} ${hoverClass} ${clickClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
