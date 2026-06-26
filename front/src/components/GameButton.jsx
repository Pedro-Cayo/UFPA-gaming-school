import React from 'react';

export default function GameButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick = null,
  className = '',
  type = 'button',
  icon = null,
  ...props
}) {
  const variantClasses = {
    primary: 'btn-game-primary',
    secondary: 'btn-game-secondary',
    success: 'btn-game-success',
    outline: 'btn-game border-2 border-ufpa-500 text-ufpa-700 bg-white hover:bg-ufpa-50'
  };

  const sizeClasses = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg'
  };

  const disabledClass = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-game ${variantClasses[variant]} ${sizeClasses[size]} ${disabledClass} ${className} flex items-center justify-center gap-2`}
      {...props}
    >
      {icon && <span>{icon}</span>}
      {children}
    </button>
  );
}
