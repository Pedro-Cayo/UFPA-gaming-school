import React from 'react';

export default function MedalBadge({ position, size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-2xl'
  };

  const getMedalClass = (pos) => {
    if (pos === 1) return 'medal-gold';
    if (pos === 2) return 'medal-silver';
    if (pos === 3) return 'medal-bronze';
    return 'bg-gray-300 text-gray-700';
  };

  const getMedalContent = (pos) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return `${pos}º`;
  };

  return (
    <div className={`medal-badge ${getMedalClass(position)} ${sizeClasses[size]}`}>
      {getMedalContent(position)}
    </div>
  );
}
