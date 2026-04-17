import React from 'react';

export type BadgeTone = 'neutral' | 'brand' | 'success' | 'warn' | 'danger' | 'purple';

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/**
 * Badge component
 * Displays a small, labeled chip with tone variants
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  tone = 'neutral',
  className = '',
}) => {
  const toneClasses: Record<BadgeTone, string> = {
    neutral: 'bg-slate-100 text-slate-700',
    brand: 'bg-brand-50 text-brand-700',
    success: 'bg-emerald-50 text-emerald-700',
    warn: 'bg-amber-50 text-amber-700',
    danger: 'bg-rose-50 text-rose-700',
    purple: 'bg-violet-50 text-violet-700',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
};
