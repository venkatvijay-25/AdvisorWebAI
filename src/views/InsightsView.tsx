import React from 'react';
import { IconRefresh, IconSparkles } from '@/components/icons';
import { iconMap } from '@/components/icons';
import { Button, Card } from '@/components/ui';
import { INSIGHTS } from '@/data/templates';

const toneStyles: Record<string, { bar: string; bg: string; text: string }> = {
  warn:    { bar: '#F59E0B', bg: 'bg-amber-50',   text: 'text-amber-700' },
  info:    { bar: '#2FA4F9', bg: 'bg-brand-50',   text: 'text-brand-700' },
  success: { bar: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700' },
};

export const InsightsView: React.FC = () => (
  <div className="max-w-4xl mx-auto px-8 py-8">
    {/* Header */}
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Insights</h1>
        <p className="text-slate-500 text-sm mt-1">
          Proactive signals across your book. Updated every 15 minutes.
        </p>
      </div>
      <Button kind="secondary" icon={IconRefresh} size="sm">Refresh</Button>
    </div>

    {/* Insight cards */}
    <div className="space-y-3">
      {INSIGHTS.map((ins, i) => {
        const t = toneStyles[ins.tone] || toneStyles.info;
        const IconC = iconMap[ins.icon] || IconSparkles;

        return (
          <Card
            key={i}
            className="p-5 flex items-start gap-4 ripple hover:elev-2 hover:-translate-y-0.5 transition cursor-pointer"
          >
            {/* Icon */}
            <div
              className={`h-12 w-12 rounded-2xl ${t.bg} flex items-center justify-center shrink-0`}
            >
              <IconC size={20} stroke={t.bar} sw={2} />
            </div>

            {/* Text */}
            <div className="flex-1">
              <div className="font-semibold text-slate-900">{ins.title}</div>
              <div className="text-[13px] text-slate-600 mt-1">{ins.body}</div>
            </div>

            {/* CTA */}
            <Button kind="soft" size="sm">{ins.cta}</Button>
          </Card>
        );
      })}
    </div>
  </div>
);
