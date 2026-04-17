'use client';

import React, { useState } from 'react';
import { iconMap, IconSparkles, IconCheckCircle, IconChevronDown, IconChevronRight, IconAlert, IconCalendar, IconClock, IconZap, IconRocket, IconLightbulb, IconShield, IconGlobe, IconBrain, IconArrowRight } from '@/components/icons';
import { Badge, Button, Card, KPI, SectionTitle } from '@/components/ui';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface BriefingItem {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'drift' | 'meeting' | 'market' | 'compliance' | 'tax' | 'review';
  icon: string;
  title: string;
  subtitle: string;
  clientId?: string;
  clientName?: string;
  estimatedTime: string;
  action: string;
  templateId?: string;
  automatable: boolean;
}

interface StagedAction {
  id: string;
  type: 'rebalance' | 'tlh' | 'email' | 'compliance-filing' | 'crm-update' | 'meeting-prep';
  status: 'pending-approval' | 'approved' | 'rejected' | 'executed';
  title: string;
  description: string;
  clientIds: string[];
  impact: string;
  confidence: number;
  createdAt: string;
  steps: string[];
  artifacts?: Array<{ icon: string; title: string; type: string; size: string }>;
}

interface DailySummary {
  totalTasks: number;
  automatable: number;
  estimatedSavings: string;
  criticalCount: number;
  meetingsToday: number;
}

/* ------------------------------------------------------------------ */
/*  Mock data (inline fallback)                                        */
/* ------------------------------------------------------------------ */

const DAILY_SUMMARY: DailySummary = {
  totalTasks: 14,
  automatable: 9,
  estimatedSavings: '2.4 hrs',
  criticalCount: 3,
  meetingsToday: 4,
};

const STAGED_ACTIONS: StagedAction[] = [
  {
    id: 'sa-1',
    type: 'rebalance',
    status: 'pending-approval',
    title: 'Rebalance Chen portfolio — drift exceeded 5%',
    description: 'International equity allocation drifted to 28.3% (target 22%). Copilot generated a trade list to bring all asset classes within tolerance.',
    clientIds: ['c-chen'],
    impact: 'Reduces tracking error by ~40bps; estimated tax cost $1,200',
    confidence: 94,
    createdAt: '3:42 AM',
    steps: [
      'Detected drift via nightly portfolio scan',
      'Pulled current holdings & target allocation',
      'Generated optimal trade list (min tax impact)',
      'Cross-checked against wash-sale rules',
      'Validated with compliance pre-trade checks',
    ],
  },
  {
    id: 'sa-2',
    type: 'tlh',
    status: 'pending-approval',
    title: 'Tax-loss harvest opportunity — Patel account',
    description: 'VXUS position is down 4.2% since purchase. Swapping to IXUS saves ~$3,800 in capital gains.',
    clientIds: ['c-patel'],
    impact: 'Estimated tax savings: $3,800; no wash-sale conflict',
    confidence: 97,
    createdAt: '4:15 AM',
    steps: [
      'Scanned all accounts for unrealized losses > $1K',
      'Identified VXUS lot with $3,800 loss',
      'Found tax-equivalent substitute (IXUS)',
      'Verified 30-day wash-sale window is clear',
    ],
  },
  {
    id: 'sa-3',
    type: 'meeting-prep',
    status: 'pending-approval',
    title: 'Meeting brief drafted — Williams quarterly review',
    description: 'Prepared a 6-page brief with performance summary, allocation changes, and talking points for tomorrow\'s meeting.',
    clientIds: ['c-williams'],
    impact: 'Brief covers performance, allocation, and 3 discussion topics',
    confidence: 88,
    createdAt: '5:01 AM',
    steps: [
      'Pulled 90-day performance data',
      'Compared vs benchmark & peer group',
      'Summarized recent trades & rationale',
      'Generated talking points from CRM notes',
      'Formatted into meeting brief template',
    ],
  },
];

const BRIEFING_ITEMS: BriefingItem[] = [
  { id: 'b-1', priority: 'critical', category: 'drift', icon: 'alert', title: 'Chen portfolio drift > 5%', subtitle: 'Intl equity 28.3% vs 22% target', clientName: 'Sarah Chen', estimatedTime: '15 min', action: 'Review trades', templateId: 'rebalance', automatable: true },
  { id: 'b-2', priority: 'critical', category: 'compliance', icon: 'shield', title: 'Reg BI disclosure due today', subtitle: 'Annual disclosure for 3 accounts', estimatedTime: '20 min', action: 'File now', automatable: true },
  { id: 'b-3', priority: 'critical', category: 'market', icon: 'trendDown', title: 'NVDA down 6.2% pre-market', subtitle: 'Held in 4 client accounts (~$2.1M exposure)', estimatedTime: '10 min', action: 'Assess impact', automatable: false },
  { id: 'b-4', priority: 'high', category: 'meeting', icon: 'calendar', title: 'Williams quarterly review — 10:30 AM', subtitle: 'Brief is 90% complete, review talking points', clientName: 'James Williams', estimatedTime: '10 min', action: 'Open brief', templateId: 'meeting-prep', automatable: true },
  { id: 'b-5', priority: 'high', category: 'tax', icon: 'receipt', title: 'Patel TLH opportunity — $3,800', subtitle: 'VXUS lot down 4.2%, swap to IXUS', clientName: 'Anita Patel', estimatedTime: '5 min', action: 'Review swap', automatable: true },
  { id: 'b-6', priority: 'high', category: 'review', icon: 'users', title: 'Respond to Kim re: estate plan', subtitle: 'Client emailed yesterday, flagged as priority', clientName: 'David Kim', estimatedTime: '15 min', action: 'Draft reply', automatable: true },
  { id: 'b-7', priority: 'medium', category: 'meeting', icon: 'calendar', title: 'Team standup — 9:00 AM', subtitle: 'Weekly pipeline review', estimatedTime: '30 min', action: 'Join', automatable: false },
  { id: 'b-8', priority: 'medium', category: 'compliance', icon: 'shield', title: 'Review updated ADV Part 2A', subtitle: 'Compliance flagged 2 sections for review', estimatedTime: '20 min', action: 'Review', automatable: false },
  { id: 'b-9', priority: 'low', category: 'review', icon: 'mail', title: 'Send newsletter to book', subtitle: 'Q1 market commentary — draft ready', estimatedTime: '5 min', action: 'Review & send', automatable: true },
];

const PREDICTIONS = [
  { icon: 'calendar', title: "Sarah Chen's 1-year review is in 18 days", detail: 'Brief is 60% pre-built', accent: '#2FA4F9' },
  { icon: 'globe', title: 'Fed meeting next Wednesday', detail: 'May impact 4 clients in your book', accent: '#F97316' },
  { icon: 'shield', title: 'Quarterly compliance filing due in 11 days', detail: '3 of 5 sections auto-filled', accent: '#10B981' },
];

/* ------------------------------------------------------------------ */
/*  Priority helpers                                                   */
/* ------------------------------------------------------------------ */

const PRIORITY_META: Record<string, { color: string; label: string; tone: 'danger' | 'warn' | 'neutral' | 'brand' }> = {
  critical: { color: '#EF4444', label: 'Critical', tone: 'danger' },
  high:     { color: '#F97316', label: 'High',     tone: 'warn' },
  medium:   { color: '#EAB308', label: 'Medium',   tone: 'neutral' },
  low:      { color: '#94A3B8', label: 'Low',      tone: 'neutral' },
};

const PRIORITY_ORDER = ['critical', 'high', 'medium', 'low'] as const;

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

const StagedActionCard: React.FC<{
  action: StagedAction;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ action, onApprove, onReject }) => {
  const [expanded, setExpanded] = useState(false);
  const isApproved = action.status === 'approved';

  return (
    <Card className={`p-5 relative overflow-hidden transition-all ${isApproved ? 'ring-2 ring-emerald-200' : 'hover:elev-2'}`}>
      {/* Confidence bar */}
      <div className="absolute top-0 left-0 h-1 rounded-t-2xl" style={{ width: `${action.confidence}%`, background: 'linear-gradient(90deg, #2FA4F9, #10B981)' }} />

      {isApproved && (
        <div className="absolute top-3 right-3">
          <IconCheckCircle size={22} stroke="#10B981" sw={2.2} />
        </div>
      )}

      <div className="flex items-start gap-3 mt-1">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 flex items-center justify-center shrink-0">
          <IconSparkles size={18} stroke="#2FA4F9" sw={2} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[13.5px] font-semibold text-slate-900">{action.title}</h4>
          <p className="text-[12.5px] text-slate-500 mt-1 leading-relaxed">{action.description}</p>

          <div className="flex items-center gap-3 mt-3">
            <Badge tone="brand">{action.confidence}% confidence</Badge>
            <span className="text-[11px] text-slate-400">Staged at {action.createdAt}</span>
          </div>

          <div className="mt-2 text-[12px] text-slate-600 flex items-center gap-1.5">
            <IconZap size={12} stroke="#F97316" sw={2} />
            <span className="font-medium">{action.impact}</span>
          </div>

          {/* Collapsible steps */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="mt-3 text-[12px] font-medium text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 transition"
          >
            {expanded ? <IconChevronDown size={13} sw={2} /> : <IconChevronRight size={13} sw={2} />}
            {expanded ? 'Hide' : 'Show'} agent steps ({action.steps.length})
          </button>

          {expanded && (
            <div className="mt-2 space-y-1.5 pl-1">
              {action.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="tool-chip shrink-0 mt-0.5 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {i + 1}
                  </span>
                  <span className="text-[12px] text-slate-600">{step}</span>
                </div>
              ))}
            </div>
          )}

          {/* Action buttons */}
          {!isApproved && action.status === 'pending-approval' && (
            <div className="flex items-center gap-2 mt-4">
              <Button kind="primary" size="sm" icon={IconCheckCircle} onClick={() => onApprove(action.id)}>
                Approve
              </Button>
              <Button kind="secondary" size="sm" onClick={() => {}}>
                Modify
              </Button>
              <Button kind="ghost" size="sm" className="text-rose-500 hover:text-rose-600 hover:bg-rose-50" onClick={() => onReject(action.id)}>
                Reject
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

interface MorningBriefingViewProps {
  openTemplate: (templateId: string, client?: any, title?: string) => void;
}

const MorningBriefingView: React.FC<MorningBriefingViewProps> = ({ openTemplate }) => {
  const [stagedActions, setStagedActions] = useState<StagedAction[]>(STAGED_ACTIONS);
  const summary = DAILY_SUMMARY;
  const items = BRIEFING_ITEMS;

  const handleApprove = (id: string) => {
    setStagedActions(prev => prev.map(a => a.id === id ? { ...a, status: 'approved' as const } : a));
  };

  const handleReject = (id: string) => {
    setStagedActions(prev => prev.map(a => a.id === id ? { ...a, status: 'rejected' as const } : a));
  };

  const grouped = PRIORITY_ORDER.map(p => ({
    priority: p,
    items: items.filter(i => i.priority === p),
  })).filter(g => g.items.length > 0);

  const pendingCount = stagedActions.filter(a => a.status === 'pending-approval').length;

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">

      {/* ── 1. HERO GREETING ─────────────────────────────── */}
      <section className="fade-up mb-8">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-[34px] font-bold tracking-tight text-slate-900">
            Good morning, <span className="gradient-text">Vijay</span>
          </h1>
          {pendingCount > 0 && (
            <span className="ping-dot relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500" />
            </span>
          )}
        </div>
        <p className="text-[13px] text-slate-500 mb-1">Thursday, April 17, 2026</p>
        <p className="text-[14px] text-slate-600 leading-relaxed mt-3">
          You have <span className="font-semibold text-rose-600">{summary.criticalCount} critical items</span>,{' '}
          {summary.totalTasks} total tasks. Copilot can handle{' '}
          <span className="font-semibold text-brand-600">{summary.automatable} of them</span> autonomously,
          saving ~<span className="font-semibold text-emerald-600">{summary.estimatedSavings}</span>.
        </p>
        <div className="flex items-center gap-3 mt-5">
          <Button kind="primary" size="md" icon={IconRocket}>
            Start my day
          </Button>
          <Button kind="secondary" size="md" icon={IconSparkles}>
            Let Copilot handle it
          </Button>
        </div>
      </section>

      {/* ── 2. KPI STRIP ─────────────────────────────────── */}
      <section className="fade-up grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-10">
        <KPI
          label="Priority tasks"
          value={summary.totalTasks}
          sub={`${summary.criticalCount} critical`}
          accent={summary.criticalCount > 0 ? '#EF4444' : '#2FA4F9'}
        />
        <KPI
          label="Auto-handleable"
          value={summary.automatable}
          sub="by Copilot"
          accent="#2FA4F9"
        />
        <KPI
          label="Est. time saved"
          value={summary.estimatedSavings}
          sub="today"
          accent="#10B981"
        />
        <KPI
          label="Meetings today"
          value={summary.meetingsToday}
          sub="next at 9:00 AM"
          accent="#8B5CF6"
        />
      </section>

      {/* ── 3. AUTOPILOT QUEUE ───────────────────────────── */}
      {stagedActions.filter(a => a.status !== 'rejected').length > 0 && (
        <section className="fade-up mb-10">
          <SectionTitle
            icon={IconSparkles}
            title="Copilot staged overnight"
            action={
              <Badge tone="brand">
                {pendingCount} awaiting review
              </Badge>
            }
          />
          <div className="space-y-3">
            {stagedActions
              .filter(a => a.status !== 'rejected')
              .map((action, i) => (
                <div key={action.id} className={`fade-up`} style={{ animationDelay: `${i * 80}ms` }}>
                  <StagedActionCard
                    action={action}
                    onApprove={handleApprove}
                    onReject={handleReject}
                  />
                </div>
              ))}
          </div>
        </section>
      )}

      {/* ── 4. PRIORITIZED ACTION LIST ───────────────────── */}
      <section className="fade-up mb-10">
        <SectionTitle
          icon={IconBrain}
          title="Today's priorities"
          action={
            <span className="text-xs text-slate-500">{items.length} items</span>
          }
        />
        <div className="space-y-2">
          {grouped.map(group => (
            <div key={group.priority}>
              {group.items.map((item, i) => {
                const meta = PRIORITY_META[item.priority];
                const IconC = iconMap[item.icon] || IconAlert;
                const isCritical = item.priority === 'critical';

                return (
                  <div
                    key={item.id}
                    className={`fade-up row-in flex items-center gap-4 px-4 py-3.5 rounded-xl mb-2 transition-all hover:elev-1 ${
                      isCritical
                        ? 'bg-rose-50/60 border border-rose-100'
                        : 'bg-white border border-slate-100 hover:border-slate-200'
                    }`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {/* Priority dot */}
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ background: meta.color }}
                    />

                    {/* Category icon */}
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${meta.color}14` }}
                    >
                      <IconC size={16} stroke={meta.color} sw={2} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="text-[13.5px] font-semibold text-slate-900 truncate">
                        {item.title}
                      </div>
                      <div className="text-[12px] text-slate-500 truncate mt-0.5">
                        {item.subtitle}
                        {item.clientName && (
                          <span className="text-slate-400"> · {item.clientName}</span>
                        )}
                      </div>
                    </div>

                    {/* Time badge */}
                    <Badge tone="neutral" className="shrink-0">
                      <IconClock size={10} sw={2} />
                      {item.estimatedTime}
                    </Badge>

                    {/* Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      {item.automatable && (
                        <Button kind="ghost" size="sm" icon={IconSparkles} className="text-brand-500 hover:text-brand-700 hover:bg-brand-50">
                          Copilot
                        </Button>
                      )}
                      <Button
                        kind="secondary"
                        size="sm"
                        onClick={() => item.templateId && openTemplate(item.templateId, null, item.title)}
                      >
                        {item.action}
                        <IconArrowRight size={12} sw={2} />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. PREDICTIVE INSIGHTS STRIP ─────────────────── */}
      <section className="fade-up">
        <SectionTitle
          icon={IconLightbulb}
          title="Predictive insights"
          action={<Badge tone="brand">AI-generated</Badge>}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {PREDICTIONS.map((p, i) => {
            const IconC = iconMap[p.icon] || IconLightbulb;
            return (
              <Card
                key={i}
                className="p-4 hover:elev-2 hover:-translate-y-0.5 transition-all"
              >
                <div
                  className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${p.accent}14` }}
                >
                  <IconC size={18} stroke={p.accent} sw={2} />
                </div>
                <h4 className="text-[13.5px] font-semibold text-slate-900 leading-snug">
                  {p.title}
                </h4>
                <p className="text-[12px] text-slate-500 mt-1">{p.detail}</p>
                <Button kind="secondary" size="sm" className="mt-3">
                  Preview
                  <IconArrowRight size={12} sw={2} />
                </Button>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default MorningBriefingView;
