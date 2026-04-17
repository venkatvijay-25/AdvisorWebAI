import React from 'react';
import type { IcoProps } from '../icons';

export type ButtonKind = 'primary' | 'secondary' | 'ghost' | 'danger' | 'soft';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  kind?: ButtonKind;
  size?: ButtonSize;
  icon?: React.ComponentType<IcoProps>;
  children?: React.ReactNode;
  className?: string;
  title?: string;
}

/**
 * Button (Btn) component
 * Flexible button with multiple style variants and optional icon
 */
export const Button: React.FC<ButtonProps> = ({
  kind = 'primary',
  size = 'md',
  icon: IconComponent,
  children,
  className = '',
  title,
  ...buttonProps
}) => {
  const baseClasses =
    'ripple inline-flex items-center justify-center gap-2 font-medium rounded-lg whitespace-nowrap';

  const sizeClasses: Record<ButtonSize, string> = {
    sm: 'px-2.5 py-1.5 text-xs',
    md: 'px-3.5 py-2 text-sm',
    lg: 'px-4 py-2.5 text-sm',
  };

  const kindClasses: Record<ButtonKind, string> = {
    primary: 'bg-brand-500 text-white hover:bg-brand-600 elev-brand',
    secondary:
      'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 elev-1',
    ghost: 'text-slate-600 hover:bg-slate-100',
    danger: 'bg-rose-500 text-white hover:bg-rose-600',
    soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100',
  };

  const iconSize = size === 'sm' ? 14 : 16;

  return (
    <button
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${kindClasses[kind]} ${className}`}
      {...buttonProps}
    >
      {IconComponent && <IconComponent size={iconSize} sw={2} />}
      {children}
    </button>
  );
};

/**
 * Alias export for consistency with prototype naming
 */
export const Btn = Button;
