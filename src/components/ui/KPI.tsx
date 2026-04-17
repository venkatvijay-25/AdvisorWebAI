import React from 'react';

export type KPIDeltaTone = 'success' | 'danger' | 'neutral';

export interface KPIProps {
  label: string;
  value: string | number;
  delta?: string | number;
  deltaTone?: KPIDeltaTone;
  sub?: string;
  accent?: string;
  className?: string;
}

/**
 * KPI component
 * Key performance indicator card with label, value, optional delta, and accent color stripe
 */
export const KPI: React.FC<KPIProps> = ({
  label,
  value,
  delta,
  deltaTone = 'success',
  sub,
  accent = '#2FA4F9',
  className = '',
}) => {
  const toneTailwindClasses: Record<KPIDeltaTone, string> = {
    success: 'text-emerald-600',
    danger: 'text-rose-600',
    neutral: 'text-slate-500',
  };

  return (
    <div className={`bg-white rounded-2xl elev-1 p-4 relative overflow-hidden ${className}`}>
      <div
        className="absolute top-0 left-0 w-1 h-full"
        style={{ background: accent }}
      />
      <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold text-slate-900">{value}</div>
      {(delta || sub) && (
        <div className="mt-1.5 flex items-center gap-2 text-xs">
          {delta && (
            <span className={`font-semibold ${toneTailwindClasses[deltaTone]}`}>
              {delta}
            </span>
          )}
          {sub && <span className="text-slate-500">{sub}</span>}
        </div>
      )}
    </div>
  );
};
