import React, { useState } from 'react';
import {
  IconChevronLeft, IconBrief, IconScale, IconShield, IconMail,
  IconSparkles, IconAlert, IconCalendar, IconClock, IconStar,
  IconTrendUp, IconTarget, IconSend, IconCheck, IconCheckCircle,
  IconPlus, IconLink, IconDownload, IconBriefcase, IconUsers,
  iconMap,
} from '@/components/icons';
import { Avatar, Badge, Button, Card, SectionTitle } from '@/components/ui';
import { CLIENTS, HOLDINGS, fmtMoney, fmtPct } from '@/data/clients';
import { MEETINGS } from '@/data/meetings';
import type { Client } from '@/types';

interface ClientHubViewProps {
  clientId: string;
  onBack: () => void;
  openTemplate: (templateId: string, client?: Client | null, title?: string) => void;
}

type Tab = 'overview' | 'portfolio' | 'activity' | 'meetings' | 'actions';

const TABS: { id: Tab; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'portfolio', label: 'Portfolio' },
  { id: 'activity', label: 'Activity' },
  { id: 'meetings', label: 'Meetings' },
  { id: 'actions', label: 'Actions' },
];

/* ── Inline mock data ─────────────────────────────────── */

const CLIENT_INFO: Record<string, { phone: string; email: string; address: string; since: string; notes: string }> = {
  sc: { phone: '+1 (415) 555-0182', email: 'sarah.chen@heliolabs.com', address: 'San Francisco, CA', since: 'Mar 2019', notes: 'Prefers Zoom. Daughter Maya starting college 2027.' },
  mr: { phone: '+1 (212) 555-0347', email: 'marcus@northwind.io', address: 'New York, NY', since: 'Jan 2018', notes: 'High-conviction tech investor. Dislikes bonds.' },
  ap: { phone: '+1 (650) 555-0291', email: 'anika.patel@gmail.com', address: 'Palo Alto, CA', since: 'Sep 2020', notes: 'Conservative. Focus on capital preservation and income.' },
  dg: { phone: '+1 (305) 555-0463', email: 'david.goldberg@outlook.com', address: 'Miami, FL', since: 'Jun 2016', notes: 'Retired. Wants steady income. Exploring 529 for grandchild.' },
  lz: { phone: '+1 (415) 555-0518', email: 'lin.zhao@familyoffice.com', address: 'San Francisco, CA', since: 'Nov 2017', notes: 'Family trust. Multi-generational planning. Estate attorney involved.' },
  rm: { phone: '+91 98765 43210', email: 'rohan@mehta.ventures', address: 'Mumbai, India', since: 'Feb 2021', notes: 'Entrepreneur. Aggressive growth appetite. Plans IPO 2027.' },
};

const KEY_DATES: Record<string, { nextReview: string; birthday: string; anniversary: string }> = {
  sc: { nextReview: 'May 03, 2026', birthday: 'Jul 14', anniversary: 'Mar 2019' },
  mr: { nextReview: 'Apr 22, 2026', birthday: 'Nov 08', anniversary: 'Jan 2018' },
  ap: { nextReview: 'May 15, 2026', birthday: 'Feb 22', anniversary: 'Sep 2020' },
  dg: { nextReview: 'Jun 01, 2026', birthday: 'Aug 30', anniversary: 'Jun 2016' },
  lz: { nextReview: 'Apr 28, 2026', birthday: 'Dec 05', anniversary: 'Nov 2017' },
  rm: { nextReview: 'May 18, 2026', birthday: 'Apr 09', anniversary: 'Feb 2021' },
};

const ACTIVITY_DATA = (clientId: string) => [
  { id: 'a1', icon: 'receipt', type: 'trade', title: 'Sold 50 shares NVDA', desc: 'Rebalance trade executed at $892.40', time: '2 hours ago' },
  { id: 'a2', icon: 'mail', type: 'email', title: 'Quarterly update sent', desc: 'Performance summary and market outlook', time: 'Yesterday' },
  { id: 'a3', icon: 'videoOn', type: 'meeting', title: 'Portfolio review call', desc: '30-min Zoom — discussed drift and TLH', time: 'Mar 28' },
  { id: 'a4', icon: 'alert', type: 'alert', title: 'Drift threshold crossed', desc: `Portfolio drift exceeded 5% target`, time: 'Mar 25' },
  { id: 'a5', icon: 'briefcase', type: 'deposit', title: 'Wire deposit received', desc: '$150,000 deposited to taxable account', time: 'Mar 20' },
  { id: 'a6', icon: 'shield', type: 'review', title: 'Compliance review completed', desc: 'Annual suitability check — passed', time: 'Mar 15' },
  { id: 'a7', icon: 'receipt', type: 'trade', title: 'Bought 200 shares BND', desc: 'Fixed income allocation increase', time: 'Mar 10' },
  { id: 'a8', icon: 'mail', type: 'email', title: 'Tax-loss harvesting report', desc: 'Identified $12.3K in harvestable losses', time: 'Mar 05' },
];

const ACTION_ITEMS = (clientId: string) => [
  { id: 't1', text: 'Send rebalance proposal for approval', source: 'Q2 Review meeting', due: 'Apr 20, 2026', status: 'open' as const },
  { id: 't2', text: 'Schedule 529 planning call with CPA', source: 'Client request', due: 'Apr 25, 2026', status: 'open' as const },
  { id: 't3', text: 'Update IPS with new risk tolerance', source: 'Compliance', due: 'Apr 10, 2026', status: 'overdue' as const },
  { id: 't4', text: 'Prepare tax-loss harvesting analysis', source: 'Copilot suggestion', due: 'May 01, 2026', status: 'open' as const },
  { id: 't5', text: 'Send annual performance deck', source: 'Annual review', due: 'Apr 08, 2026', status: 'completed' as const },
];

/* ── Allocation bar data ──────────────────────────────── */
const ALLOC_SEGMENTS = [
  { label: 'US Equity', pct: 28.4, color: '#2FA4F9' },
  { label: 'Intl Equity', pct: 9.0, color: '#7B5BFF' },
  { label: 'Fixed Income', pct: 14.2, color: '#10B981' },
  { label: 'Alternatives', pct: 4.8, color: '#F97316' },
  { label: 'Cash', pct: 3.6, color: '#94A3B8' },
];

/* ── Helpers ──────────────────────────────────────────── */
const daysSince = (dateStr: string): number => {
  const d = new Date(dateStr);
  const now = new Date('2026-04-17');
  return Math.floor((now.getTime() - d.getTime()) / 86_400_000);
};

/* ── Component ────────────────────────────────────────── */
const ClientHubView: React.FC<ClientHubViewProps> = ({ clientId, onBack, openTemplate }) => {
  const [tab, setTab] = useState<Tab>('overview');
  const [copilotQ, setCopilotQ] = useState('');
  const [checkedActions, setCheckedActions] = useState<Set<string>>(new Set(['t5']));

  const client = CLIENTS.find(c => c.id === clientId);

  if (!client) {
    return (
      <div className="max-w-3xl mx-auto px-8 py-20 text-center fade-up">
        <div className="text-6xl mb-4 text-slate-300">
          <IconUsers size={64} stroke="#CBD5E1" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Client not found</h2>
        <p className="text-slate-500 mb-6">No client matches the ID "{clientId}".</p>
        <Button kind="primary" onClick={onBack} icon={IconChevronLeft}>Back to clients</Button>
      </div>
    );
  }

  const excess = client.ytd - client.bench;
  const reviewDays = daysSince(client.lastReview);
  const clientMeetings = MEETINGS.filter(m => m.clientId === clientId);
  const info = CLIENT_INFO[clientId] || CLIENT_INFO.sc;
  const dates = KEY_DATES[clientId] || KEY_DATES.sc;

  /* ── Suggestions ────────────────────────────────────── */
  const suggestions: { icon: string; tone: 'warn' | 'brand' | 'success' | 'danger'; title: string; desc: string; cta: string; action: string }[] = [];
  if (client.drift > 5) suggestions.push({ icon: 'alert', tone: 'warn', title: `Drift is ${client.drift}% — consider rebalancing`, desc: `Portfolio has drifted ${client.drift}% from the ${client.model} target allocation.`, cta: 'Rebalance', action: 'rebalance' });
  if (reviewDays > 45) suggestions.push({ icon: 'calendar', tone: 'brand', title: `Review overdue by ${reviewDays - 90} days`, desc: `Last review was ${client.lastReview}. Schedule a check-in soon.`, cta: 'Schedule', action: 'review' });
  else suggestions.push({ icon: 'calendar', tone: 'brand', title: `Next review in ${Math.max(90 - reviewDays, 1)} days`, desc: `Last reviewed on ${client.lastReview}. Stay proactive.`, cta: 'Prep review', action: 'review' });
  suggestions.push({ icon: 'zap', tone: 'success', title: 'TLH opportunity: $12.3K in AAPL unrealized loss', desc: 'Harvest tax losses by swapping AAPL for a correlated ETF. Est. savings: $4.3K.', cta: 'Analyze', action: 'risk' });
  if (clientMeetings.some(m => m.status === 'upcoming')) suggestions.push({ icon: 'videoOn', tone: 'brand', title: `Upcoming: ${clientMeetings.find(m => m.status === 'upcoming')!.title}`, desc: `${clientMeetings.find(m => m.status === 'upcoming')!.when} via ${clientMeetings.find(m => m.status === 'upcoming')!.channel}`, cta: 'View prep', action: 'review' });

  /* ── Render ─────────────────────────────────────────── */
  return (
    <div className="max-w-7xl mx-auto px-8 py-6">
      {/* Back */}
      <button onClick={onBack} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-4 fade-up">
        <IconChevronLeft size={16} /> Back to clients
      </button>

      {/* ── Header ───────────────────────────────────── */}
      <div className="fade-up mb-6">
        <div className="flex items-start gap-5 mb-4">
          <Avatar initials={client.initials} color={client.avatar} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-slate-900">{client.name}</h1>
              <Badge tone={client.segment === 'UHNI' ? 'purple' : 'brand'}>{client.segment}</Badge>
            </div>
            <p className="text-sm text-slate-500">{client.role}</p>
          </div>
        </div>

        {/* KPI pills */}
        <div className="flex flex-wrap gap-3 mb-4">
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <span className="text-slate-500 text-xs uppercase font-semibold">AUM</span>
            <span className="font-bold text-slate-900">{fmtMoney(client.aum)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <span className="text-slate-500 text-xs uppercase font-semibold">YTD</span>
            <span className={`font-bold ${client.ytd >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtPct(client.ytd, 1, true)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <span className="text-slate-500 text-xs uppercase font-semibold">Excess</span>
            <span className={`font-bold ${excess >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtPct(excess, 1, true)}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <span className="text-slate-500 text-xs uppercase font-semibold">Risk</span>
            <span className="font-bold text-slate-900">{client.risk}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <span className="text-slate-500 text-xs uppercase font-semibold">Model</span>
            <span className="font-bold text-slate-900">{client.model}</span>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 px-3 py-2 text-sm">
            <span className="text-slate-500 text-xs uppercase font-semibold">Drift</span>
            <span className={`font-bold ${client.drift > 5 ? 'text-amber-600' : 'text-emerald-600'}`}>{fmtPct(client.drift)}</span>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-2">
          <Button kind="primary" size="sm" icon={IconBrief} onClick={() => openTemplate('review', client, 'Portfolio review')}>Review portfolio</Button>
          <Button kind="secondary" size="sm" icon={IconScale} onClick={() => openTemplate('rebalance', client, 'Rebalance')}>Rebalance</Button>
          <Button kind="secondary" size="sm" icon={IconShield} onClick={() => openTemplate('risk', client, 'Risk analysis')}>Risk analysis</Button>
          <Button kind="ghost" size="sm" icon={IconMail} onClick={() => openTemplate('email', client, 'Draft email')}>Draft email</Button>
        </div>
      </div>

      {/* ── Tab bar ──────────────────────────────────── */}
      <div className="flex items-center gap-6 border-b border-slate-200 mb-6 fade-up" style={{ animationDelay: '60ms' }}>
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`pb-2.5 text-sm font-medium border-b-2 transition-colors ${
              tab === t.id
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Two column layout ────────────────────────── */}
      <div className="grid grid-cols-[1fr_320px] gap-6">
        {/* LEFT COLUMN */}
        <div className="min-w-0">

          {/* ══ OVERVIEW TAB ══ */}
          {tab === 'overview' && (
            <div className="space-y-5 fade-up">
              {/* Performance snapshot */}
              <Card className="p-5">
                <SectionTitle title="Performance snapshot" icon={IconTrendUp} />
                <div className="grid grid-cols-4 gap-4 mt-3">
                  <div className="text-center">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">YTD</div>
                    <div className={`text-lg font-bold mt-1 ${client.ytd >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtPct(client.ytd, 1, true)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Excess</div>
                    <div className={`text-lg font-bold mt-1 ${excess >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtPct(excess, 1, true)}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Sharpe</div>
                    <div className="text-lg font-bold mt-1 text-slate-900">1.34</div>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Max DD</div>
                    <div className="text-lg font-bold mt-1 text-rose-600">-4.2%</div>
                  </div>
                </div>
              </Card>

              {/* AI Copilot suggestions */}
              <div>
                <SectionTitle title="Copilot suggestions" icon={IconSparkles} />
                <div className="space-y-3">
                  {suggestions.map((s, i) => {
                    const Ic = iconMap[s.icon] || IconSparkles;
                    const toneMap = { warn: 'bg-amber-50 border-amber-200', brand: 'bg-brand-50/50 border-brand-200', success: 'bg-emerald-50 border-emerald-200', danger: 'bg-rose-50 border-rose-200' };
                    const iconColor = { warn: '#D97706', brand: '#2FA4F9', success: '#059669', danger: '#E11D48' };
                    return (
                      <div key={i} className={`flex items-start gap-3 rounded-xl border p-4 ${toneMap[s.tone]} fade-up`} style={{ animationDelay: `${i * 60}ms` }}>
                        <Ic size={18} stroke={iconColor[s.tone]} className="mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                          <div className="text-xs text-slate-600 mt-0.5">{s.desc}</div>
                        </div>
                        <Button kind="ghost" size="sm" onClick={() => openTemplate(s.action, client)}>{s.cta}</Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Risk summary */}
              <Card className="p-5">
                <SectionTitle title="Risk summary" icon={IconShield} />
                <div className="flex items-center gap-4 mt-2">
                  <Badge tone={client.risk === 'Conservative' ? 'success' : client.risk === 'Moderate' ? 'warn' : 'danger'}>
                    {client.risk}
                  </Badge>
                  <div className="text-sm text-slate-600">
                    Model: <span className="font-semibold text-slate-900">{client.model}</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-xs text-slate-500">Alignment</span>
                    <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${100 - client.drift * 5}%` }} />
                    </div>
                    <span className="text-xs font-medium text-slate-700">{Math.round(100 - client.drift * 5)}%</span>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* ══ PORTFOLIO TAB ══ */}
          {tab === 'portfolio' && (
            <div className="space-y-5 fade-up">
              {/* Allocation bar */}
              <Card className="p-5">
                <SectionTitle title="Asset allocation" icon={IconTarget} />
                <div className="flex h-5 rounded-full overflow-hidden mt-3 mb-3">
                  {ALLOC_SEGMENTS.map(s => (
                    <div key={s.label} style={{ width: `${s.pct}%`, background: s.color }} title={`${s.label}: ${s.pct}%`} />
                  ))}
                </div>
                <div className="flex flex-wrap gap-4">
                  {ALLOC_SEGMENTS.map(s => (
                    <div key={s.label} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                      {s.label} <span className="font-semibold">{s.pct}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Drift indicator */}
              <Card className="p-5">
                <SectionTitle title="Drift indicator" icon={IconAlert} />
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                      <span>Current</span><span>Target</span>
                    </div>
                    <div className="relative h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div className="absolute inset-y-0 left-0 bg-brand-400 rounded-full" style={{ width: '60%' }} />
                      <div className="absolute inset-y-0 bg-amber-400 rounded-full" style={{ left: '60%', width: `${client.drift * 2}%` }} />
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${client.drift > 5 ? 'text-amber-600' : 'text-emerald-600'}`}>{fmtPct(client.drift)}</div>
                    <div className="text-[11px] text-slate-500">drift</div>
                  </div>
                </div>
              </Card>

              {/* Holdings table */}
              <Card className="overflow-hidden">
                <div className="p-4 pb-0">
                  <SectionTitle title="Holdings" icon={IconBriefcase} />
                </div>
                <table className="w-full text-[13px]">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100">
                      <th className="px-5 py-2.5 font-semibold">Ticker</th>
                      <th className="py-2.5 font-semibold">Name</th>
                      <th className="py-2.5 font-semibold text-right">Weight</th>
                      <th className="py-2.5 font-semibold text-right">Value</th>
                      <th className="py-2.5 font-semibold text-right">Day %</th>
                      <th className="py-2.5 font-semibold text-right pr-5">YTD %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOLDINGS.map(h => (
                      <tr key={h.tk} className="border-b border-slate-50 hover:bg-slate-50/50">
                        <td className="px-5 py-2.5 font-semibold text-brand-600">{h.tk}</td>
                        <td className="py-2.5 text-slate-700">{h.name}</td>
                        <td className="py-2.5 text-right tabular-nums">{h.weight}%</td>
                        <td className="py-2.5 text-right tabular-nums font-medium">{fmtMoney(h.value)}</td>
                        <td className={`py-2.5 text-right tabular-nums font-medium ${h.day >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtPct(h.day, 1, true)}</td>
                        <td className={`py-2.5 text-right tabular-nums font-medium pr-5 ${h.ytd >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>{fmtPct(h.ytd, 1, true)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            </div>
          )}

          {/* ══ ACTIVITY TAB ══ */}
          {tab === 'activity' && (
            <div className="fade-up">
              <SectionTitle title="Recent activity" icon={IconClock} />
              <div className="relative pl-6">
                {/* Timeline line */}
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-slate-200" />
                <div className="space-y-0">
                  {ACTIVITY_DATA(clientId).map((a, i) => {
                    const Ic = iconMap[a.icon] || IconClock;
                    return (
                      <div key={a.id} className="relative flex items-start gap-4 pb-5 fade-up" style={{ animationDelay: `${i * 40}ms` }}>
                        <div className="absolute -left-6 top-1 w-[22px] h-[22px] rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                          <Ic size={12} stroke="#64748B" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-semibold text-slate-900">{a.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5">{a.desc}</div>
                        </div>
                        <div className="text-xs text-slate-400 whitespace-nowrap pt-0.5">{a.time}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══ MEETINGS TAB ══ */}
          {tab === 'meetings' && (
            <div className="space-y-4 fade-up">
              <div className="flex items-center justify-between">
                <SectionTitle title={`Meetings (${clientMeetings.length})`} icon={IconCalendar} />
                <Button kind="primary" size="sm" icon={IconPlus}>Schedule meeting</Button>
              </div>
              {clientMeetings.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-slate-500 text-sm">No meetings found for this client.</p>
                </Card>
              ) : (
                clientMeetings.map((m, i) => (
                  <Card key={m.id} className="p-4 fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-semibold text-slate-900">{m.title}</span>
                          <Badge tone={m.status === 'upcoming' ? 'brand' : 'neutral'}>{m.status}</Badge>
                          {m.prep && <Badge tone="success">Brief ready</Badge>}
                        </div>
                        <div className="text-xs text-slate-500">{m.when} &middot; {m.duration} &middot; {m.channel}</div>
                        <div className="flex items-center gap-1.5 mt-2 text-xs text-slate-500">
                          <IconUsers size={13} />
                          <span>{m.attendees.join(', ')}</span>
                        </div>
                      </div>
                      {m.status === 'upcoming' && (
                        <Button kind="ghost" size="sm" onClick={() => openTemplate('review', client)}>Prep</Button>
                      )}
                    </div>
                  </Card>
                ))
              )}
            </div>
          )}

          {/* ══ ACTIONS TAB ══ */}
          {tab === 'actions' && (
            <div className="space-y-4 fade-up">
              <div className="flex items-center justify-between">
                <SectionTitle title="Action items" icon={IconCheckCircle} />
                <Button kind="primary" size="sm" icon={IconPlus}>Add action</Button>
              </div>
              {ACTION_ITEMS(clientId).map((item, i) => {
                const checked = checkedActions.has(item.id);
                const isOverdue = item.status === 'overdue';
                return (
                  <Card
                    key={item.id}
                    className={`p-4 fade-up ${isOverdue ? 'border border-rose-200 bg-rose-50/30' : ''}`}
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setCheckedActions(prev => {
                          const next = new Set(prev);
                          next.has(item.id) ? next.delete(item.id) : next.add(item.id);
                          return next;
                        })}
                        className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                          checked
                            ? 'bg-brand-500 border-brand-500'
                            : isOverdue
                              ? 'border-rose-300'
                              : 'border-slate-300'
                        }`}
                      >
                        {checked && <IconCheck size={12} stroke="#fff" sw={3} />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className={`text-sm font-medium ${checked ? 'line-through text-slate-400' : 'text-slate-900'}`}>{item.text}</div>
                        <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                          <span>From: {item.source}</span>
                          {item.due && <span>Due: {item.due}</span>}
                        </div>
                      </div>
                      <Badge tone={isOverdue ? 'danger' : item.status === 'completed' ? 'success' : 'neutral'}>
                        {item.status}
                      </Badge>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (sidebar) */}
        <div className="space-y-4">
          {/* Client info */}
          <Card className="p-4 fade-up" style={{ animationDelay: '80ms' }}>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Client info</h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Phone</span><span className="text-slate-900 font-medium">{info.phone}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Email</span><span className="text-slate-900 font-medium text-xs truncate ml-2">{info.email}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="text-slate-900 font-medium">{info.address}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Client since</span><span className="text-slate-900 font-medium">{info.since}</span></div>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Notes</div>
              <p className="text-xs text-slate-600 leading-relaxed">{info.notes}</p>
            </div>
          </Card>

          {/* Key dates */}
          <Card className="p-4 fade-up" style={{ animationDelay: '140ms' }}>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Key dates</h4>
            <div className="space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <IconCalendar size={14} stroke="#64748B" />
                <span className="text-slate-500 text-xs">Next review</span>
                <span className="ml-auto font-medium text-slate-900 text-xs">{dates.nextReview}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconStar size={14} stroke="#64748B" />
                <span className="text-slate-500 text-xs">Birthday</span>
                <span className="ml-auto font-medium text-slate-900 text-xs">{dates.birthday}</span>
              </div>
              <div className="flex items-center gap-2">
                <IconClock size={14} stroke="#64748B" />
                <span className="text-slate-500 text-xs">Anniversary</span>
                <span className="ml-auto font-medium text-slate-900 text-xs">{dates.anniversary}</span>
              </div>
            </div>
          </Card>

          {/* Quick links */}
          <Card className="p-4 fade-up" style={{ animationDelay: '200ms' }}>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Quick links</h4>
            <div className="space-y-1">
              <Button kind="ghost" size="sm" icon={IconLink} className="w-full justify-start">Open in CRM</Button>
              <Button kind="ghost" size="sm" icon={IconShield} className="w-full justify-start">View compliance</Button>
              <Button kind="ghost" size="sm" icon={IconDownload} className="w-full justify-start">Export report</Button>
            </div>
          </Card>

          {/* Copilot chat */}
          <Card className="p-4 fade-up" style={{ animationDelay: '260ms' }}>
            <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Ask Copilot</h4>
            <div className="flex items-center gap-2">
              <input
                value={copilotQ}
                onChange={e => setCopilotQ(e.target.value)}
                placeholder={`Ask about ${client.name.split(' ')[0]}...`}
                className="flex-1 text-sm bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 outline-none focus:border-brand-400 focus:ring-1 focus:ring-brand-100"
                onKeyDown={e => { if (e.key === 'Enter' && copilotQ.trim()) { openTemplate('ask', client, copilotQ); setCopilotQ(''); } }}
              />
              <button
                onClick={() => { if (copilotQ.trim()) { openTemplate('ask', client, copilotQ); setCopilotQ(''); } }}
                className="p-2 rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition-colors"
              >
                <IconSend size={16} />
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientHubView;
