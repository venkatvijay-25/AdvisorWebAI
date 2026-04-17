import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
}

/**
 * Card component
 * Elevation wrapper for grouped content with optional interactive state
 */
export const Card: React.FC<CardProps> = ({
  children,
  interactive = false,
  className = '',
  onClick,
  ...divProps
}) => {
  const interactiveClasses = interactive
    ? 'cursor-pointer ripple hover:elev-3 hover:-translate-y-0.5 transition-all'
    : '';

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl elev-1 ${interactiveClasses} ${className}`}
      {...divProps}
    >
      {children}
    </div>
  );
};
