import React from 'react';
import type { IcoProps } from '../icons';

export interface SectionTitleProps {
  title: string;
  icon?: React.ComponentType<IcoProps>;
  action?: React.ReactNode;
  className?: string;
}

/**
 * SectionTitle component
 * Section header with optional icon and action slot
 */
export const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  icon: IconComponent,
  action,
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-3 ${className}`}>
      <div className="flex items-center gap-2">
        {IconComponent && <IconComponent size={16} stroke="#475569" />}
        <h3 className="font-semibold text-slate-900 text-sm">{title}</h3>
      </div>
      {action}
    </div>
  );
};
