import React, { useState } from 'react';
import { IconRefresh, IconBell, IconSparkles, IconMail, IconTarget, IconChevronDown, IconChevronRight, IconZap, type IcoProps } from '@/components/icons';
import { iconMap } from '@/components/icons';
import { Badge, Button, Card } from '@/components/ui';
import { PULSE_EVENTS } from '@/data/meetings';

const toneMap: Record<string, { bg: string; icon: string; label: string; tone: 'danger' | 'warn' | 'brand' }> = {
  urgent: { bg: 'bg-rose-50', icon: '#E11D48', label: 'Urgent', tone: 'danger' },
  worth: { bg: 'bg-amber-50', icon: '#B45309', label: 'Worth attention', tone: 'warn' },
  fyi: { bg: 'bg-brand-50', icon: '#1B8AD8', label: 'FYI', tone: 'brand' },
};

export const PulseView: React.FC = () => {
  const [filter, setFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const counts = PULSE_EVENTS.reduce<Record<string, number>>((a, e) => {
    a[e.severity] = (a[e.severity] || 0) + 1;
    return a;
  }, {});

  const filtered = filter === 'all' ? PULSE_EVENTS : PULSE_EVENTS.filter(e => e.severity === filter);

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Book pulse</h1>
            <Badge tone="purple">v4</Badge>
            <span className="flex items-center gap-1.5 text-[11.5px] text-slate-500">
              <span className="relative h-1.5 w-1.5 rounded-full bg-emerald-500 ping-dot" /> Live
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Everything across your book that changed since you last logged in. Refreshed every 15 min.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="secondary" size="sm" icon={IconRefresh}>Refresh</Button>
          <Button kind="soft" size="sm" icon={IconBell}>Set alerts</Button>
        </div>
      </div>

      <div className="flex items-center gap-1 my-5 bg-white rounded-xl border border-slate-200 p-1 w-fit">
        {[
          { id: 'all', label: `All (${PULSE_EVENTS.length})` },
          { id: 'urgent', label: `Urgent (${counts.urgent || 0})` },
          { id: 'worth', label: `Worth attention (${counts.worth || 0})` },
          { id: 'fyi', label: `FYI (${counts.fyi || 0})` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-[12.5px] px-3 py-1.5 rounded-lg ${
              filter === f.id
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* AI Summary Banner */}
      <Card className="p-4 mb-5 border-l-4 border-l-brand-500 bg-gradient-to-r from-brand-50/60 to-white">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-xl bg-white elev-1 flex items-center justify-center shrink-0">
            <IconSparkles size={16} stroke="#2FA4F9" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-slate-900 mb-0.5">Copilot pulse summary</div>
            <div className="text-[12.5px] text-slate-600 leading-relaxed">
              Copilot detected <span className="font-semibold text-rose-600">2 urgent events</span>, <span className="font-semibold text-amber-600">1 worth-attention</span>, and <span className="font-semibold text-brand-600">2 FYI items</span>. 3 clients are affected by the AAPL build cut. Recommended: stage hedge for exposed clients.
            </div>
          </div>
          <Button kind="primary" size="sm" icon={IconZap}>Take action</Button>
        </div>
      </Card>

      <div className="space-y-3">
        {filtered.map(e => {
          const IconC = (iconMap as Record<string, React.FC<IcoProps>>)[e.icon] || IconSparkles;
          const t = toneMap[e.severity] || toneMap.fyi;
          const isExpanded = expandedId === e.id;
          return (
            <Card key={e.id} className="p-5 hover:elev-2 hover:-translate-y-0.5 transition">
              <div
                className="flex items-start gap-4 cursor-pointer"
                onClick={() => setExpandedId(isExpanded ? null : e.id)}
              >
                <div className={`h-11 w-11 rounded-2xl ${t.bg} flex items-center justify-center shrink-0`}>
                  <IconC size={20} stroke={t.icon} sw={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={t.tone}>{t.label}</Badge>
                    <span className="text-[11.5px] text-slate-500">{e.source} · {e.age}</span>
                    <span className="ml-auto">
                      {isExpanded
                        ? <IconChevronDown size={14} stroke="#94A3B8" />
                        : <IconChevronRight size={14} stroke="#94A3B8" />}
                    </span>
                  </div>
                  <div className="font-semibold text-slate-900">{e.title}</div>
                  <div className="text-[13px] text-slate-600 mt-1 leading-relaxed">{e.body}</div>
                  <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
                    <span className="text-[11.5px] text-slate-500 mr-1">Affected:</span>
                    {e.affected.map((a, i) => (
                      <Badge key={i} tone="neutral">{a}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-3.5">
                    {e.actions.map((a, i) => (
                      <Button key={i} kind={i === 0 ? 'primary' : 'secondary'} size="sm" icon={i === 0 ? IconSparkles : undefined}>
                        {a}
                      </Button>
                    ))}
                    <Button kind="ghost" size="sm">Dismiss</Button>
                  </div>
                </div>
              </div>

              {/* Action Flow — expanded */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-slate-100">
                  <div className="flex items-center gap-2 mb-4">
                    <IconSparkles size={14} stroke="#2FA4F9" />
                    <span className="text-[13px] font-semibold text-slate-900">Recommended actions</span>
                  </div>

                  {/* Progress bar */}
                  <div className="flex items-center gap-1 mb-5">
                    <div className="h-1.5 flex-1 rounded-full bg-brand-500" />
                    <div className="h-1.5 flex-1 rounded-full bg-brand-200" />
                    <div className="h-1.5 flex-1 rounded-full bg-slate-200" />
                  </div>

                  <div className="space-y-3">
                    {/* Step 1 */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-brand-50/50 border border-brand-100">
                      <div className="h-7 w-7 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-brand-700">1</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900">Assess impact</div>
                        <div className="text-[12px] text-slate-600 mt-0.5">
                          Review how "{e.title}" affects your book and identify exposure across affected clients.
                        </div>
                      </div>
                      <Badge tone="success">In progress</Badge>
                    </div>

                    {/* Step 2 */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-slate-500">2</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900">Notify affected clients</div>
                        <div className="text-[12px] text-slate-600 mt-0.5">
                          Send personalized updates to {e.affected.length} affected client{e.affected.length !== 1 ? 's' : ''} about this event.
                        </div>
                      </div>
                      <Button kind="secondary" size="sm" icon={IconMail}>Draft emails</Button>
                    </div>

                    {/* Step 3 */}
                    <div className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                      <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                        <span className="text-[12px] font-bold text-slate-500">3</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-slate-900">Stage trades if needed</div>
                        <div className="text-[12px] text-slate-600 mt-0.5">
                          Pre-stage hedge or rebalance trades for review before execution.
                        </div>
                      </div>
                      <Button kind="secondary" size="sm" icon={IconTarget}>Review trades</Button>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button kind="primary" icon={IconSparkles}>Execute full workflow</Button>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
