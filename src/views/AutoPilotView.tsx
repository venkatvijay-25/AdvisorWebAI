import React, { useState, useMemo } from 'react';
import type { StagedAction } from '@/types';
import { STAGED_ACTIONS } from '@/data/autopilot';
import { CLIENTS } from '@/data/clients';
import { Avatar, Badge, Button, Card, KPI, SectionTitle } from '@/components/ui';
import {
  IconBrain,
  IconSparkles,
  IconCheck,
  IconCheckCircle,
  IconShield,
  IconScale,
  IconReceipt,
  IconMail,
  IconDatabase,
  IconBrief,
  IconEdit,
  IconX,
  IconChevronDown,
  IconChevronRight,
  IconDownload,
  IconClock,
  IconZap,
  IconFilter,
} from '@/components/icons';
import type { IcoProps } from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

type StatusFilter = 'all' | 'pending-approval' | 'approved' | 'rejected' | 'executed';

const TYPE_ICONS: Record<StagedAction['type'], React.ComponentType<IcoProps>> = {
  rebalance: IconScale,
  tlh: IconReceipt,
  email: IconMail,
  'compliance-filing': IconShield,
  'crm-update': IconDatabase,
  'meeting-prep': IconBrief,
};

const TYPE_LABELS: Record<StagedAction['type'], string> = {
  rebalance: 'Rebalance',
  tlh: 'Tax-Loss Harvest',
  email: 'Email Draft',
  'compliance-filing': 'Compliance',
  'crm-update': 'CRM Update',
  'meeting-prep': 'Meeting Prep',
};

const FILTERS: { label: string; value: StatusFilter }[] = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending-approval' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Executed', value: 'executed' },
];

const RULES = [
  { id: 'r1', text: 'Auto-stage rebalance when drift > 8%', on: true, last: 'Today, 3:22 AM' },
  { id: 'r2', text: 'Pre-build meeting briefs 24h before', on: true, last: 'Today, 4:30 AM' },
  { id: 'r3', text: 'TLH sweep when losses exceed $5K', on: true, last: 'Today, 3:45 AM' },
  { id: 'r4', text: 'Draft recap emails after meetings', on: true, last: 'Today, 4:10 AM' },
  { id: 'r5', text: 'Auto-file quarterly ADV updates', on: false, last: 'Mar 31, 2026' },
];

const confTone = (c: number): 'success' | 'warn' | 'danger' =>
  c >= 90 ? 'success' : c >= 80 ? 'warn' : 'danger';

const statusBadge = (s: StagedAction['status']) => {
  const map: Record<string, { label: string; tone: 'success' | 'warn' | 'danger' | 'brand' | 'neutral' }> = {
    'pending-approval': { label: 'Pending', tone: 'warn' },
    approved: { label: 'Approved', tone: 'success' },
    rejected: { label: 'Rejected', tone: 'danger' },
    executed: { label: 'Executed', tone: 'brand' },
  };
  return map[s] ?? { label: s, tone: 'neutral' as const };
};

const fmtTime = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const clientById = (id: string) => CLIENTS.find((c) => c.id === id);

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const AutoPilotView: React.FC = () => {
  const [actions, setActions] = useState<StagedAction[]>(STAGED_ACTIONS);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [ruleToggles, setRuleToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(RULES.map((r) => [r.id, r.on])),
  );

  const filtered = useMemo(
    () => (filter === 'all' ? actions : actions.filter((a) => a.status === filter)),
    [actions, filter],
  );

  const counts = useMemo(() => {
    const pending = actions.filter((a) => a.status === 'pending-approval').length;
    const approved = actions.filter((a) => a.status === 'approved').length;
    const executed = actions.filter((a) => a.status === 'executed').length;
    const avg = Math.round(actions.reduce((s, a) => s + a.confidence, 0) / actions.length);
    return { pending, approved, executed, avg };
  }, [actions]);

  const updateStatus = (id: string, status: StagedAction['status']) =>
    setActions((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const approveAllSafe = () =>
    setActions((prev) =>
      prev.map((a) =>
        a.status === 'pending-approval' && a.confidence >= 95 ? { ...a, status: 'approved' } : a,
      ),
    );

  const toggle = (id: string) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  /* ---- border color by status ---- */
  const borderClass = (s: StagedAction['status']) => {
    if (s === 'approved') return 'border-l-4 border-l-emerald-500';
    if (s === 'rejected') return 'border-l-4 border-l-rose-400 opacity-60';
    if (s === 'executed') return 'border-l-4 border-l-brand-500';
    return '';
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-6 pb-8">
      {/* ============ HEADER ============ */}
      <div className="fade-up flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-brand-400 to-violet-500 flex items-center justify-center">
            <IconBrain size={22} stroke="#fff" sw={2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold gradient-text">AutoPilot</h1>
              <Badge tone="brand">Beta</Badge>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Your AI co-pilot works overnight to stage actions for your approval
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="secondary" size="sm" icon={IconFilter}>
            Configure rules
          </Button>
          <Button kind="primary" size="sm" icon={IconSparkles} onClick={approveAllSafe}>
            Approve all safe
          </Button>
        </div>
      </div>

      {/* ============ KPI STRIP ============ */}
      <div className="fade-up grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Pending review" value={counts.pending} accent="#F59E0B" sub="actions staged" />
        <KPI label="Approved today" value={counts.approved} accent="#10B981" sub="ready to execute" />
        <KPI label="Auto-executed" value={counts.executed} accent="#2FA4F9" sub="no approval needed" />
        <KPI
          label="Avg confidence"
          value={`${counts.avg}%`}
          accent={counts.avg > 90 ? '#10B981' : counts.avg > 80 ? '#F59E0B' : '#EF4444'}
          sub="across all actions"
        />
      </div>

      {/* ============ FILTER BAR ============ */}
      <div className="fade-up flex items-center gap-2 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === f.value
                ? 'bg-brand-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ============ ACTION QUEUE ============ */}
      <div className="space-y-4">
        {filtered.map((action, idx) => {
          const TypeIcon = TYPE_ICONS[action.type];
          const sb = statusBadge(action.status);
          const isExpanded = !!expanded[action.id];

          return (
            <Card
              key={action.id}
              className={`fade-up p-5 ${borderClass(action.status)}`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              {/* Header row */}
              <div className="flex flex-wrap items-start gap-3 mb-3">
                <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <TypeIcon size={18} stroke="#475569" sw={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-sm text-slate-900">{action.title}</span>
                    <Badge tone={confTone(action.confidence)}>{action.confidence}% confidence</Badge>
                    <Badge tone={sb.tone as any}>{sb.label}</Badge>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400">
                    <IconClock size={12} />
                    <span>{fmtTime(action.createdAt)}</span>
                    <span className="mx-1">·</span>
                    <span>{TYPE_LABELS[action.type]}</span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-sm text-slate-600 leading-relaxed mb-3">{action.description}</p>

              {/* Impact */}
              <div className="flex items-center gap-2 mb-3 px-3 py-2 bg-slate-50 rounded-lg">
                <IconZap size={14} stroke="#F59E0B" />
                <span className="text-xs font-semibold text-slate-700">{action.impact}</span>
              </div>

              {/* Client chips */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                {action.clientIds.map((cid) => {
                  const cl = clientById(cid);
                  if (!cl) return null;
                  return (
                    <div key={cid} className="flex items-center gap-1.5 bg-slate-50 rounded-full pl-1 pr-2.5 py-0.5">
                      <Avatar initials={cl.initials} color={cl.avatar} size="sm" />
                      <span className="text-xs font-medium text-slate-700">{cl.name}</span>
                    </div>
                  );
                })}
              </div>

              {/* Agent reasoning toggle */}
              <button
                onClick={() => toggle(action.id)}
                className="flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors mb-2"
              >
                {isExpanded ? <IconChevronDown size={14} /> : <IconChevronRight size={14} />}
                Agent reasoning ({action.steps.length} steps)
              </button>

              {isExpanded && (
                <div className="ml-2 mb-3 space-y-1.5">
                  {action.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="tool-chip shrink-0 mt-0.5 h-5 w-5 rounded-md bg-brand-50 text-brand-600 flex items-center justify-center text-[10px] font-bold">
                        {i + 1}
                      </span>
                      <span className="text-xs text-slate-600 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Artifacts */}
              {action.artifacts && action.artifacts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {action.artifacts.map((art, i) => (
                    <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
                      <IconDownload size={14} stroke="#64748B" />
                      <div className="text-xs">
                        <span className="font-medium text-slate-700">{art.title}</span>
                        <span className="text-slate-400 ml-1.5">{art.type} · {art.size}</span>
                      </div>
                      <Button kind="ghost" size="sm" className="ml-1 !px-1.5 !py-0.5 text-[10px]">
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Action buttons (pending only) */}
              {action.status === 'pending-approval' && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <Button kind="primary" size="sm" icon={IconCheck} onClick={() => updateStatus(action.id, 'approved')}>
                    Approve
                  </Button>
                  <Button kind="secondary" size="sm" icon={IconEdit}>
                    Modify &amp; approve
                  </Button>
                  <Button kind="ghost" size="sm" icon={IconX} className="!text-rose-500 hover:!bg-rose-50" onClick={() => updateStatus(action.id, 'rejected')}>
                    Reject
                  </Button>
                </div>
              )}

              {/* Approved overlay indicator */}
              {action.status === 'approved' && (
                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100 text-emerald-600">
                  <IconCheckCircle size={16} />
                  <span className="text-xs font-semibold">Approved</span>
                </div>
              )}
            </Card>
          );
        })}

        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">No actions match this filter.</div>
        )}
      </div>

      {/* ============ AUTOMATION RULES ============ */}
      <div className="fade-up">
        <SectionTitle title="Automation rules" icon={IconZap} />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {RULES.map((rule) => (
            <Card key={rule.id} className="p-4 flex items-start gap-3">
              <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                <input
                  type="checkbox"
                  checked={ruleToggles[rule.id]}
                  onChange={() => setRuleToggles((p) => ({ ...p, [rule.id]: !p[rule.id] }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-checked:bg-brand-500 rounded-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
              </label>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-800 leading-snug">{rule.text}</p>
                <p className="text-[11px] text-slate-400 mt-1">Last triggered: {rule.last}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};
