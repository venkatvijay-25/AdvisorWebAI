import React from 'react';

export interface AvatarProps {
  initials: string;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Avatar component
 * Displays user initials in a colored circular badge
 */
export const Avatar: React.FC<AvatarProps> = ({
  initials,
  color = '#2FA4F9',
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-7 w-7 text-[11px]',
    md: 'h-8 w-8 text-xs',
    lg: 'h-10 w-10 text-sm',
  };

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-semibold text-white shrink-0 ${className}`}
      style={{ background: color }}
    >
      {initials}
    </div>
  );
};
