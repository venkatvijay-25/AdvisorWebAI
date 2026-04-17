import React, { useState } from 'react';
import {
  IconShield, IconCheckCircle, IconAlert, IconClock,
  IconDownload, IconZap, IconCalendar, IconPlus,
} from '@/components/icons';
import { Avatar, Badge, Button, Card, KPI } from '@/components/ui';
import {
  COMPLIANCE_CHECKS, COMPLIANCE_FILINGS, RESTRICTION_LIST, COMPLIANCE_SUMMARY,
} from '@/data/compliance';
import type { ComplianceCheck, ComplianceFiling, RestrictionEntry } from '@/types';

type Tab = 'checks' | 'filings' | 'restrictions';
type CheckFilter = 'all' | 'fail' | 'warning' | 'pass' | 'pending';

const statusIcon = (s: ComplianceCheck['status'], size = 16) => {
  switch (s) {
    case 'pass':    return <IconCheckCircle size={size} stroke="#10B981" sw={2} />;
    case 'fail':    return <IconAlert size={size} stroke="#EF4444" sw={2} />;
    case 'warning': return <IconAlert size={size} stroke="#F59E0B" sw={2} />;
    case 'pending': return <IconClock size={size} stroke="#64748B" sw={2} />;
  }
};

const severityTone = (s: ComplianceCheck['severity']): 'danger' | 'warn' | 'brand' | 'muted' => {
  switch (s) {
    case 'critical': return 'danger';
    case 'high':     return 'warn';
    case 'medium':   return 'brand';
    case 'low':      return 'muted';
  }
};

const filingBg = (s: ComplianceFiling['status']) => {
  switch (s) {
    case 'overdue':  return 'bg-rose-50 border-rose-200';
    case 'due-soon': return 'bg-amber-50 border-amber-200';
    case 'on-track': return 'bg-emerald-50/50 border-emerald-200';
    case 'filed':    return 'bg-slate-50 border-slate-200';
  }
};

const filingTone = (s: ComplianceFiling['status']): 'danger' | 'warn' | 'success' | 'muted' => {
  switch (s) {
    case 'overdue':  return 'danger';
    case 'due-soon': return 'warn';
    case 'on-track': return 'success';
    case 'filed':    return 'muted';
  }
};

const daysUntil = (dateStr: string) => {
  const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86_400_000);
  if (diff < 0) return `${Math.abs(diff)}d overdue`;
  if (diff === 0) return 'Due today';
  return `${diff}d remaining`;
};

const restrictionTone = (t: RestrictionEntry['type']): 'danger' | 'warn' | 'brand' => {
  switch (t) {
    case 'hard-block': return 'danger';
    case 'soft-limit': return 'warn';
    case 'watchlist':  return 'brand';
  }
};

const auditCountdown = () => {
  const diff = Math.ceil(
    (new Date(COMPLIANCE_SUMMARY.nextAudit).getTime() - Date.now()) / 86_400_000,
  );
  return diff > 0 ? `${diff} days away` : 'Overdue';
};

const passRateColor = (r: number) =>
  r > 80 ? '#10B981' : r > 60 ? '#F59E0B' : '#EF4444';

export const ComplianceView: React.FC = () => {
  const [tab, setTab] = useState<Tab>('checks');
  const [checkFilter, setCheckFilter] = useState<CheckFilter>('all');

  const filteredChecks =
    checkFilter === 'all'
      ? COMPLIANCE_CHECKS
      : COMPLIANCE_CHECKS.filter(c => c.status === checkFilter);

  const failCount = COMPLIANCE_CHECKS.filter(c => c.status === 'fail').length;
  const warnCount = COMPLIANCE_CHECKS.filter(c => c.status === 'warning').length;
  const passCount = COMPLIANCE_CHECKS.filter(c => c.status === 'pass').length;
  const pendCount = COMPLIANCE_CHECKS.filter(c => c.status === 'pending').length;

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6 fade-up">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <IconShield size={22} stroke="#2FA4F9" sw={2} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Compliance Center</h1>
            <p className="text-slate-500 text-sm mt-0.5">
              {COMPLIANCE_SUMMARY.passRate}% pass rate &middot; Next audit{' '}
              {new Date(COMPLIANCE_SUMMARY.nextAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="secondary" icon={IconDownload} size="sm">Export report</Button>
          <Button kind="primary" icon={IconZap} size="sm">Run full scan</Button>
        </div>
      </div>

      {/* KPI STRIP */}
      <div className="grid grid-cols-4 gap-4 mb-6 fade-up" style={{ animationDelay: '60ms' }}>
        <KPI
          label="Pass rate"
          value={`${COMPLIANCE_SUMMARY.passRate}%`}
          accent={passRateColor(COMPLIANCE_SUMMARY.passRate)}
          sub={`${passCount} of ${COMPLIANCE_CHECKS.length} checks passing`}
        />
        <KPI
          label="Open issues"
          value={COMPLIANCE_SUMMARY.openIssues}
          accent="#F59E0B"
          sub={`${failCount} fail \u00b7 ${warnCount} warn \u00b7 ${pendCount} pending`}
        />
        <KPI
          label="Critical issues"
          value={COMPLIANCE_SUMMARY.criticalIssues}
          accent="#EF4444"
          sub="Requires immediate action"
        />
        <KPI
          label="Next audit"
          value={new Date(COMPLIANCE_SUMMARY.nextAudit).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          accent="#2FA4F9"
          sub={auditCountdown()}
        />
      </div>

      {/* TAB BAR */}
      <div className="flex items-center gap-1 mb-5 bg-white rounded-xl border border-slate-200 p-1 w-fit fade-up" style={{ animationDelay: '120ms' }}>
        {([
          { id: 'checks', label: 'Pre-trade Checks' },
          { id: 'filings', label: 'Filings & Deadlines' },
          { id: 'restrictions', label: 'Restriction List' },
        ] as const).map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`text-[12.5px] px-4 py-1.5 rounded-lg transition ${
              tab === t.id
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div className="fade-up" style={{ animationDelay: '180ms' }}>

        {/* PRE-TRADE CHECKS */}
        {tab === 'checks' && (
          <div>
            <div className="flex items-center gap-1 mb-4 bg-white rounded-xl border border-slate-200 p-1 w-fit">
              {([
                { id: 'all',     label: `All (${COMPLIANCE_CHECKS.length})` },
                { id: 'fail',    label: `Fail (${failCount})` },
                { id: 'warning', label: `Warning (${warnCount})` },
                { id: 'pass',    label: `Pass (${passCount})` },
                { id: 'pending', label: `Pending (${pendCount})` },
              ] as const).map(f => (
                <button
                  key={f.id}
                  onClick={() => setCheckFilter(f.id)}
                  className={`text-[12px] px-3 py-1 rounded-lg transition ${
                    checkFilter === f.id
                      ? 'bg-brand-50 text-brand-700 font-semibold'
                      : 'text-slate-500 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="space-y-2">
              {filteredChecks.map(c => (
                <Card key={c.id} className="p-4 flex items-start gap-4 hover:elev-2 transition">
                  <div className="mt-0.5">{statusIcon(c.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 text-[13.5px]">{c.rule}</span>
                      <Badge tone={severityTone(c.severity)}>{c.severity}</Badge>
                    </div>
                    <p className="text-[13px] text-slate-600 mt-1">{c.description}</p>
                    {c.clientName && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <Avatar initials={c.clientName.split(' ').map(n => n[0]).join('')} size="sm" />
                        <span className="text-[12px] text-slate-500">{c.clientName}</span>
                      </div>
                    )}
                    {c.resolution && (
                      <p className="text-[12.5px] text-emerald-600 italic mt-1.5">{c.resolution}</p>
                    )}
                  </div>
                  <div className="shrink-0">
                    {(c.status === 'fail' || c.status === 'warning') ? (
                      <Button kind="outline" size="sm">Resolve</Button>
                    ) : (
                      <Button kind="ghost" size="sm">View</Button>
                    )}
                  </div>
                </Card>
              ))}
              {filteredChecks.length === 0 && (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No checks match this filter.
                </div>
              )}
            </div>
          </div>
        )}

        {/* FILINGS & DEADLINES */}
        {tab === 'filings' && (
          <div className="space-y-2">
            {COMPLIANCE_FILINGS.map(f => (
              <Card key={f.id} className={`p-4 border ${filingBg(f.status)} hover:elev-2 transition`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-slate-900 text-[13.5px]">{f.type}</span>
                      <Badge tone={filingTone(f.status)}>{f.status.replace('-', ' ')}</Badge>
                    </div>
                    <p className="text-[13px] text-slate-600">{f.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-[12px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <IconCalendar size={13} stroke="#64748B" sw={1.5} />
                        Due {new Date(f.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                      <span className="font-medium">{daysUntil(f.dueDate)}</span>
                      <span>Assignee: {f.assignee}</span>
                    </div>
                  </div>
                  {f.status === 'on-track' && (
                    <Button kind="outline" size="sm" icon={IconCheckCircle}>Mark as filed</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* RESTRICTION LIST */}
        {tab === 'restrictions' && (
          <div>
            <div className="flex justify-end mb-3">
              <Button kind="primary" icon={IconPlus} size="sm">Add restriction</Button>
            </div>
            <Card className="overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/40">
                    <th className="px-5 py-3 font-semibold">Ticker</th>
                    <th className="py-3 font-semibold">Company</th>
                    <th className="py-3 font-semibold">Type</th>
                    <th className="py-3 font-semibold">Reason</th>
                    <th className="py-3 font-semibold">Applies to</th>
                    <th className="py-3 px-5 font-semibold">Expires</th>
                  </tr>
                </thead>
                <tbody>
                  {RESTRICTION_LIST.map(r => (
                    <tr key={r.ticker} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="px-5 py-3 font-semibold text-slate-900 tabular-nums">{r.ticker}</td>
                      <td className="py-3 text-slate-700">{r.name}</td>
                      <td className="py-3">
                        <Badge tone={restrictionTone(r.type)}>
                          {r.type === 'hard-block' ? 'Hard block' : r.type === 'soft-limit' ? 'Soft limit' : 'Watchlist'}
                        </Badge>
                      </td>
                      <td className="py-3 text-slate-600 max-w-xs">{r.reason}</td>
                      <td className="py-3 text-slate-600">
                        {r.appliesTo === 'all' ? 'All clients' : (r.appliesTo as string[]).join(', ').toUpperCase()}
                      </td>
                      <td className="py-3 px-5 text-slate-500">
                        {r.expiresAt
                          ? new Date(r.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : <span className="text-slate-400">Permanent</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};
