import React from 'react';
import { IconSparkles, IconChevronRight } from '@/components/icons';
import { iconMap } from '@/components/icons';
import { Card } from '@/components/ui';
import { TEMPLATES } from '@/data/templates';
import type { HistoryItem } from '@/types';

interface HistoryViewProps {
  recents: HistoryItem[];
  openHistory: (h: HistoryItem) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({ recents, openHistory }) => {
  // Group conversations by day (text before the comma in "when")
  const groups = recents.reduce<Record<string, HistoryItem[]>>((acc, r) => {
    const day = r.when.split(',')[0];
    (acc[day] = acc[day] || []).push(r);
    return acc;
  }, {});

  return (
    <div className="max-w-3xl mx-auto px-8 py-8">
      <h1 className="text-2xl font-bold text-slate-900">History</h1>
      <p className="text-slate-500 text-sm mt-1 mb-6">
        All your conversations with Copilot
      </p>

      <div className="space-y-6">
        {Object.entries(groups).map(([day, items]) => (
          <div key={day}>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">
              {day}
            </div>
            <Card className="divide-y divide-slate-100">
              {items.map(r => {
                const tpl = TEMPLATES.find(t => t.id === r.template);
                const IconC = tpl ? (iconMap[tpl.icon] || IconSparkles) : IconSparkles;
                const accent = tpl?.accent || '#2FA4F9';

                return (
                  <button
                    key={r.id}
                    onClick={() => openHistory(r)}
                    className="w-full text-left p-4 hover:bg-slate-50/60 ripple flex items-center gap-3"
                  >
                    <div
                      className="h-9 w-9 rounded-xl flex items-center justify-center"
                      style={{ background: `${accent}15` }}
                    >
                      <IconC size={16} stroke={accent} sw={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[14px] font-medium text-slate-900 truncate">
                        {r.title}
                      </div>
                      <div className="text-[11.5px] text-slate-500">
                        {r.when}
                        {r.client ? ` \u00b7 ${r.client}` : ''}
                      </div>
                    </div>
                    <IconChevronRight size={16} stroke="#94A3B8" />
                  </button>
                );
              })}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};
