import React from 'react';
import { Card, Badge, Button, KPI, Avatar, SectionTitle } from '@/components/ui';
import { IconUsers, IconPlus, IconChat, IconArrowRight, IconClock, IconCheck } from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

interface TeamMember {
  id: string;
  initials: string;
  name: string;
  role: string;
  clients: number;
  aum: string | null;
  status: 'online' | 'away' | 'offline';
  specializations: string[];
  color: string;
  isCurrentUser?: boolean;
}

const TEAM: TeamMember[] = [
  { id: 'vv', initials: 'VV', name: 'Vijay Venkat', role: 'Sr. Wealth Advisor', clients: 6, aum: '$50.7M', status: 'online', specializations: [], color: '#0F172A', isCurrentUser: true },
  { id: 'mk', initials: 'MK', name: 'Meera Kapoor', role: 'Wealth Advisor', clients: 8, aum: '$38M', status: 'online', specializations: ['Estate', 'Tax'], color: '#7C3AED' },
  { id: 'at', initials: 'AT', name: 'Alex Thompson', role: 'Jr. Advisor', clients: 5, aum: '$22M', status: 'away', specializations: ['Fixed Income'], color: '#2FA4F9' },
  { id: 'pd', initials: 'PD', name: 'Priti Desai', role: 'Client Associate', clients: 12, aum: null, status: 'online', specializations: [], color: '#E11D48' },
  { id: 'dk', initials: 'DK', name: 'David Kim', role: 'Portfolio Analyst', clients: 4, aum: '$31M', status: 'offline', specializations: ['Alternatives'], color: '#059669' },
];

interface SharedClient {
  name: string;
  primaryAdvisor: string;
  primaryInitials: string;
  primaryColor: string;
  supporting: { initials: string; color: string }[];
  combinedAum: string;
  lastHandoff: string;
}

const SHARED_CLIENTS: SharedClient[] = [
  { name: 'David & Rachel Goldberg', primaryAdvisor: 'Vijay Venkat', primaryInitials: 'VV', primaryColor: '#0F172A', supporting: [{ initials: 'MK', color: '#7C3AED' }, { initials: 'PD', color: '#E11D48' }], combinedAum: '$12.4M', lastHandoff: 'Apr 18, 2026' },
  { name: 'Lin & Grace Zhao', primaryAdvisor: 'Vijay Venkat', primaryInitials: 'VV', primaryColor: '#0F172A', supporting: [{ initials: 'AT', color: '#2FA4F9' }], combinedAum: '$8.1M', lastHandoff: 'Apr 15, 2026' },
  { name: 'The Chen Household', primaryAdvisor: 'Meera Kapoor', primaryInitials: 'MK', primaryColor: '#7C3AED', supporting: [{ initials: 'AT', color: '#2FA4F9' }, { initials: 'DK', color: '#059669' }], combinedAum: '$6.7M', lastHandoff: 'Apr 12, 2026' },
  { name: 'Margaret Thornton Trust', primaryAdvisor: 'David Kim', primaryInitials: 'DK', primaryColor: '#059669', supporting: [{ initials: 'VV', color: '#0F172A' }, { initials: 'MK', color: '#7C3AED' }], combinedAum: '$15.2M', lastHandoff: 'Apr 10, 2026' },
];

interface DelegatedTask {
  id: string;
  description: string;
  from: { name: string; initials: string; color: string };
  to: { name: string; initials: string; color: string };
  due: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'High' | 'Medium' | 'Low';
}

const TASKS: DelegatedTask[] = [
  { id: 't1', description: 'Prepare Q2 review for Goldberg', from: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, to: { name: 'Meera', initials: 'MK', color: '#7C3AED' }, due: 'Apr 25', status: 'In Progress', priority: 'High' },
  { id: 't2', description: 'Tax projection for Chen household', from: { name: 'Alex', initials: 'AT', color: '#2FA4F9' }, to: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, due: 'Apr 28', status: 'Pending', priority: 'High' },
  { id: 't3', description: 'Onboard Thornton Trust account docs', from: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, to: { name: 'Priti', initials: 'PD', color: '#E11D48' }, due: 'Apr 24', status: 'In Progress', priority: 'Medium' },
  { id: 't4', description: 'Alternatives allocation memo for Kim portfolio', from: { name: 'David', initials: 'DK', color: '#059669' }, to: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, due: 'Apr 30', status: 'Pending', priority: 'Medium' },
  { id: 't5', description: 'Zhao rebalance trade execution', from: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, to: { name: 'Alex', initials: 'AT', color: '#2FA4F9' }, due: 'Apr 22', status: 'Completed', priority: 'High' },
  { id: 't6', description: 'Schedule Goldberg estate review meeting', from: { name: 'Meera', initials: 'MK', color: '#7C3AED' }, to: { name: 'Priti', initials: 'PD', color: '#E11D48' }, due: 'Apr 26', status: 'Pending', priority: 'Low' },
];

interface HandoffEntry {
  id: string;
  from: { name: string; initials: string; color: string };
  to: { name: string; initials: string; color: string };
  description: string;
  date: string;
}

const HANDOFFS: HandoffEntry[] = [
  { id: 'h1', from: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, to: { name: 'Meera', initials: 'MK', color: '#7C3AED' }, description: 'David Goldberg estate review', date: 'Apr 18' },
  { id: 'h2', from: { name: 'Alex', initials: 'AT', color: '#2FA4F9' }, to: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, description: 'Lin Zhao rebalance approval', date: 'Apr 15' },
  { id: 'h3', from: { name: 'David', initials: 'DK', color: '#059669' }, to: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, description: 'Thornton Trust alternatives review', date: 'Apr 12' },
  { id: 'h4', from: { name: 'Meera', initials: 'MK', color: '#7C3AED' }, to: { name: 'Priti', initials: 'PD', color: '#E11D48' }, description: 'Chen household document collection', date: 'Apr 10' },
  { id: 'h5', from: { name: 'Vijay', initials: 'VV', color: '#0F172A' }, to: { name: 'David', initials: 'DK', color: '#059669' }, description: 'Portfolio stress test for Zhao', date: 'Apr 8' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const statusDot = (status: TeamMember['status']) => {
  const colors: Record<typeof status, string> = {
    online: 'bg-emerald-500',
    away: 'bg-amber-400',
    offline: 'bg-slate-300',
  };
  return <span className={`inline-block h-2 w-2 rounded-full ${colors[status]}`} />;
};

const statusLabel = (status: TeamMember['status']) => {
  const labels: Record<typeof status, string> = { online: 'Online', away: 'Away', offline: 'Offline' };
  return labels[status];
};

const priorityTone = (p: DelegatedTask['priority']): 'danger' | 'warn' | 'neutral' => {
  if (p === 'High') return 'danger';
  if (p === 'Medium') return 'warn';
  return 'neutral';
};

const statusTone = (s: DelegatedTask['status']): 'success' | 'brand' | 'muted' => {
  if (s === 'Completed') return 'success';
  if (s === 'In Progress') return 'brand';
  return 'muted';
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const TeamView: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Team</h1>
          <p className="text-sm text-slate-500 mt-1">Collaborate, delegate, and stay in sync with your advisory team.</p>
        </div>
        <Button kind="primary" icon={IconPlus} size="md">
          Invite member
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Team members" value={5} accent="#2FA4F9" />
        <KPI label="Total AUM managed" value="$142M" delta="+3.1%" sub="vs last quarter" accent="#7C3AED" />
        <KPI label="Shared clients" value={4} sub="across team" accent="#059669" />
        <KPI label="Open handoffs" value={2} sub="awaiting action" accent="#F59E0B" />
      </div>

      {/* Team roster */}
      <section>
        <SectionTitle title="Team roster" icon={IconUsers} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TEAM.map((m) => (
            <Card key={m.id} className="p-5 flex flex-col gap-3">
              {/* Top row: avatar + info + status */}
              <div className="flex items-start gap-3">
                <Avatar initials={m.initials} color={m.color} size="lg" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 text-sm truncate">{m.name}</span>
                    {m.isCurrentUser && <Badge tone="brand">You</Badge>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">{m.role}</div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                  {statusDot(m.status)}
                  <span>{statusLabel(m.status)}</span>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-slate-600">
                <span><span className="font-semibold text-slate-900">{m.clients}</span> clients</span>
                {m.aum && (
                  <span><span className="font-semibold text-slate-900">{m.aum}</span> AUM</span>
                )}
                {!m.aum && <span className="text-slate-400">Supports team</span>}
              </div>

              {/* Specializations */}
              {m.specializations.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {m.specializations.map((s) => (
                    <Badge key={s} tone="purple">{s}</Badge>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2 mt-auto pt-1">
                <Button kind="outline" size="sm" className="flex-1">View book</Button>
                <Button kind="ghost" size="sm" icon={IconChat}>Message</Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Shared clients */}
      <section>
        <SectionTitle title="Shared clients" icon={IconUsers} />
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wider text-slate-500 font-semibold">
                  <th className="px-5 py-3">Client</th>
                  <th className="px-5 py-3">Primary advisor</th>
                  <th className="px-5 py-3">Supporting</th>
                  <th className="px-5 py-3 text-right">Combined AUM</th>
                  <th className="px-5 py-3 text-right">Last handoff</th>
                </tr>
              </thead>
              <tbody>
                {SHARED_CLIENTS.map((c, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                    <td className="px-5 py-3 font-medium text-slate-900">{c.name}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={c.primaryInitials} color={c.primaryColor} size="sm" />
                        <span className="text-slate-700">{c.primaryAdvisor}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex -space-x-2">
                        {c.supporting.map((s, j) => (
                          <Avatar key={j} initials={s.initials} color={s.color} size="sm" className="ring-2 ring-white" />
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right font-semibold text-slate-900">{c.combinedAum}</td>
                    <td className="px-5 py-3 text-right text-slate-500">{c.lastHandoff}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>

      {/* Task delegation */}
      <section>
        <SectionTitle title="Task delegation" icon={IconCheck} />
        <div className="space-y-3">
          {TASKS.map((t) => (
            <Card key={t.id} className="px-5 py-4 flex items-center gap-4">
              {/* Description */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-slate-900 truncate">{t.description}</div>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Avatar initials={t.from.initials} color={t.from.color} size="sm" />
                    <span>{t.from.name}</span>
                  </div>
                  <IconArrowRight size={12} stroke="#94A3B8" />
                  <div className="flex items-center gap-1.5">
                    <Avatar initials={t.to.initials} color={t.to.color} size="sm" />
                    <span>{t.to.name}</span>
                  </div>
                </div>
              </div>

              {/* Due */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 shrink-0">
                <IconClock size={13} stroke="#94A3B8" />
                <span>{t.due}</span>
              </div>

              {/* Status badge */}
              <Badge tone={statusTone(t.status)}>{t.status}</Badge>

              {/* Priority badge */}
              <Badge tone={priorityTone(t.priority)}>{t.priority}</Badge>
            </Card>
          ))}
        </div>
      </section>

      {/* Handoff log */}
      <section className="pb-8">
        <SectionTitle title="Handoff log" icon={IconClock} />
        <Card className="divide-y divide-slate-100">
          {HANDOFFS.map((h) => (
            <div key={h.id} className="px-5 py-3.5 flex items-center gap-4">
              <div className="flex items-center gap-2 shrink-0">
                <Avatar initials={h.from.initials} color={h.from.color} size="sm" />
                <IconArrowRight size={12} stroke="#94A3B8" />
                <Avatar initials={h.to.initials} color={h.to.color} size="sm" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-sm text-slate-900 font-medium">{h.from.name}</span>
                <span className="text-sm text-slate-400 mx-1.5">&rarr;</span>
                <span className="text-sm text-slate-900 font-medium">{h.to.name}</span>
                <span className="text-sm text-slate-500 ml-1">: {h.description}</span>
              </div>
              <span className="text-xs text-slate-400 shrink-0">{h.date}</span>
            </div>
          ))}
        </Card>
      </section>
    </div>
  );
};

export default TeamView;
