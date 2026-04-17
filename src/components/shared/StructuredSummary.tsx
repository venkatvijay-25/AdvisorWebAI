import React, { useState, useEffect } from 'react';
import { useTypewriter } from '@/hooks';
import {
  IconTrendUp,
  IconTrendDown,
  IconAlert,
  IconCheckCircle,
  IconArrowRight,
  IconZap,
  iconMap,
  type IcoProps,
} from '@/components/icons';
import { Badge } from '@/components/ui';
import type { Source, Client } from '@/types';

/* ================================================================
   Types
   ================================================================ */

/** A key metric to show as a visual pill/card */
export interface SummaryMetric {
  label: string;
  value: string;
  tone?: 'positive' | 'negative' | 'neutral' | 'warn';
  icon?: string;
  cite?: number;
}

/** A detail point — one line of insight */
export interface SummaryDetail {
  icon?: string;
  tone?: 'positive' | 'negative' | 'neutral' | 'warn';
  text: string;
  bold?: string;   // highlighted portion within text
}

/** An action item / recommendation */
export interface SummaryAction {
  label: string;
  description: string;
  status?: 'ready' | 'pending' | 'done';
  icon?: string;
}

/** Full structured summary for a template result */
export interface StructuredData {
  headline: string;
  metrics: SummaryMetric[];
  details: SummaryDetail[];
  actions?: SummaryAction[];
  footnote?: string;
  sources?: Source[];
}

export interface StructuredSummaryProps {
  data: StructuredData;
}

/* ================================================================
   Sub-components
   ================================================================ */

const toneColor = {
  positive: { text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-200', accent: '#10B981' },
  negative: { text: 'text-rose-700', bg: 'bg-rose-50', border: 'border-rose-200', accent: '#F43F5E' },
  warn:     { text: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-200', accent: '#F59E0B' },
  neutral:  { text: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200', accent: '#64748B' },
};

const toneIcon: Record<string, React.FC<IcoProps>> = {
  positive: IconTrendUp,
  negative: IconTrendDown,
  warn: IconAlert,
  neutral: IconZap,
};

/**
 * MetricPill — a single highlighted KPI
 */
const MetricPill: React.FC<{ m: SummaryMetric; index: number }> = ({ m, index }) => {
  const tone = m.tone || 'neutral';
  const c = toneColor[tone];
  const Ic = m.icon ? (iconMap[m.icon] || toneIcon[tone]) : toneIcon[tone];

  return (
    <div
      className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl ${c.bg} border ${c.border} fade-up`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`h-8 w-8 rounded-lg ${c.bg} flex items-center justify-center shrink-0`}
           style={{ background: `${c.accent}20` }}>
        <Ic size={16} stroke={c.accent} sw={2.2} />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 leading-none mb-0.5">
          {m.label}
        </div>
        <div className={`text-[17px] font-bold ${c.text} leading-tight tabular-nums`}>
          {m.value}
          {m.cite && (
            <span className="cite ml-1" style={{ verticalAlign: 'super', fontSize: 9 }}>{m.cite}</span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * DetailRow — a single insight line with icon
 */
const DetailRow: React.FC<{ d: SummaryDetail; index: number }> = ({ d, index }) => {
  const tone = d.tone || 'neutral';
  const c = toneColor[tone];
  const Ic = d.icon ? (iconMap[d.icon] || IconArrowRight) : IconArrowRight;

  return (
    <div
      className="flex items-start gap-2.5 py-1.5 fade-up"
      style={{ animationDelay: `${300 + index * 80}ms` }}
    >
      <div className={`mt-0.5 h-5 w-5 rounded-md flex items-center justify-center shrink-0`}
           style={{ background: `${c.accent}15` }}>
        <Ic size={12} stroke={c.accent} sw={2} />
      </div>
      <p className="text-[13.5px] text-slate-600 leading-relaxed">
        {d.bold ? (
          <>
            {d.text.split(d.bold)[0]}
            <span className="font-semibold text-slate-900">{d.bold}</span>
            {d.text.split(d.bold).slice(1).join(d.bold)}
          </>
        ) : d.text}
      </p>
    </div>
  );
};

/**
 * ActionRow — a recommended next step
 */
const ActionRow: React.FC<{ a: SummaryAction; index: number }> = ({ a, index }) => {
  const statusStyle = {
    ready:   { badge: 'success' as const, label: 'Ready' },
    pending: { badge: 'warn' as const,    label: 'Pending' },
    done:    { badge: 'muted' as const,   label: 'Done' },
  };
  const s = statusStyle[a.status || 'ready'];
  const Ic = a.icon ? (iconMap[a.icon] || IconCheckCircle) : IconCheckCircle;

  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white border border-slate-100 hover:border-brand-200 hover:bg-brand-50/30 transition fade-up"
      style={{ animationDelay: `${500 + index * 80}ms` }}
    >
      <div className="h-7 w-7 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
        <Ic size={14} stroke="#2FA4F9" sw={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-slate-900">{a.label}</div>
        <div className="text-[12px] text-slate-500">{a.description}</div>
      </div>
      <Badge tone={s.badge}>{s.label}</Badge>
    </div>
  );
};

/* ================================================================
   Main component
   ================================================================ */

export const StructuredSummary: React.FC<StructuredSummaryProps> = ({ data }) => {
  const { shown, done } = useTypewriter(data.headline, { speed: 6 });
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setReveal(true), 150);
      return () => clearTimeout(t);
    }
  }, [done]);

  return (
    <div>
      {/* Headline with typewriter */}
      <p className="text-[15px] font-medium text-slate-800 leading-relaxed mb-4">
        {done ? data.headline : <>{shown}<span className="caret" /></>}
      </p>

      {reveal && (
        <>
          {/* Metrics strip */}
          {data.metrics.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
              {data.metrics.map((m, i) => (
                <MetricPill key={i} m={m} index={i} />
              ))}
            </div>
          )}

          {/* Details */}
          {data.details.length > 0 && (
            <div className="mb-4 pl-0.5">
              {data.details.map((d, i) => (
                <DetailRow key={i} d={d} index={i} />
              ))}
            </div>
          )}

          {/* Actions */}
          {data.actions && data.actions.length > 0 && (
            <div className="space-y-1.5 mb-3">
              <div className="text-[10.5px] uppercase tracking-wider font-semibold text-slate-400 mb-1 flex items-center gap-1.5">
                <IconZap size={11} stroke="#94A3B8" sw={2} />
                Recommended actions
              </div>
              {data.actions.map((a, i) => (
                <ActionRow key={i} a={a} index={i} />
              ))}
            </div>
          )}

          {/* Footnote */}
          {data.footnote && (
            <p className="text-[12px] text-slate-400 mt-3 fade-up" style={{ animationDelay: '700ms' }}>
              {data.footnote}
            </p>
          )}
        </>
      )}
    </div>
  );
};
