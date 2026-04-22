import React, { useState, useMemo } from 'react';
import {
  IconPlus,
  IconClock,
  IconTarget,
  IconChevronRight,
  IconX,
  IconMail,
  IconCalendar,
  IconSparkles,
  IconLightbulb,
  IconBrief,
} from '@/components/icons';
import { Avatar, Badge, Button, Card, KPI } from '@/components/ui';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Stage = 'new-lead' | 'qualified' | 'proposal-sent' | 'negotiating' | 'won' | 'lost';
type Temperature = 'hot' | 'warm' | 'cool';
type Source = 'Referral' | 'Event' | 'LinkedIn' | 'Existing Client Referral';

interface Activity {
  id: string;
  date: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  summary: string;
}

interface Prospect {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  estimatedAUM: number;
  stage: Stage;
  source: Source;
  referredBy?: string;
  temperature: Temperature;
  daysInStage: number;
  nextActionDate: string;
  nextAction: string;
  advisor: string;
  email: string;
  phone: string;
  notes: string;
  activities: Activity[];
  documents: string[];
  aiSuggestions: string[];
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */
const PROSPECTS: Prospect[] = [
  {
    id: 'p1', name: 'James Morrison', initials: 'JM', avatarColor: '#6366F1',
    estimatedAUM: 3_000_000, stage: 'new-lead', source: 'LinkedIn',
    temperature: 'cool', daysInStage: 2, nextActionDate: '2026-04-24',
    nextAction: 'Send introductory email', advisor: 'Vijay Venkat',
    email: 'james.morrison@outlook.com', phone: '+1 415-555-0188',
    notes: 'VP of Engineering at a Series C startup. Recently exercised stock options.',
    activities: [
      { id: 'a1', date: '2026-04-20', type: 'note', summary: 'Identified via LinkedIn — recently posted about liquidity event.' },
    ],
    documents: [],
    aiSuggestions: ['Send personalized intro mentioning tech executive wealth planning.', 'Highlight concentrated stock position risk in outreach.'],
  },
  {
    id: 'p2', name: 'Rachel Kim', initials: 'RK', avatarColor: '#EC4899',
    estimatedAUM: 4_500_000, stage: 'new-lead', source: 'Referral', referredBy: 'Marcus Reid',
    temperature: 'warm', daysInStage: 5, nextActionDate: '2026-04-23',
    nextAction: 'Schedule discovery call', advisor: 'Vijay Venkat',
    email: 'rachel.kim@gmail.com', phone: '+1 212-555-0234',
    notes: 'Pediatric surgeon, recently inherited family trust. Looking for holistic planning.',
    activities: [
      { id: 'a2', date: '2026-04-17', type: 'email', summary: 'Marcus Reid sent warm introduction email.' },
      { id: 'a3', date: '2026-04-18', type: 'email', summary: 'Rachel replied — interested in a call next week.' },
    ],
    documents: [],
    aiSuggestions: ['Prioritize — warm referral with high intent.', 'Prepare trust transition checklist before call.'],
  },
  {
    id: 'p3', name: 'Priya Sharma', initials: 'PS', avatarColor: '#F59E0B',
    estimatedAUM: 12_000_000, stage: 'qualified', source: 'Event',
    temperature: 'hot', daysInStage: 8, nextActionDate: '2026-04-25',
    nextAction: 'Prepare IPS draft', advisor: 'Vijay Venkat',
    email: 'priya.sharma@sharmaventures.com', phone: '+91 98765-43210',
    notes: 'Founder of Sharma Ventures. Met at FinTech Mumbai 2026. Interested in global diversification.',
    activities: [
      { id: 'a4', date: '2026-04-14', type: 'meeting', summary: 'Initial discovery meeting — 45 min. Confirmed HNW status, discussed risk tolerance.' },
      { id: 'a5', date: '2026-04-16', type: 'call', summary: 'Follow-up call to clarify investment timeline and liquidity needs.' },
    ],
    documents: ['Risk Questionnaire (completed)'],
    aiSuggestions: ['Based on profile, recommend Global Growth model with 15% EM allocation.', 'Schedule IPS presentation within 5 business days.'],
  },
  {
    id: 'p4', name: 'David Okafor', initials: 'DO', avatarColor: '#10B981',
    estimatedAUM: 7_000_000, stage: 'qualified', source: 'Existing Client Referral', referredBy: 'Sarah Chen',
    temperature: 'warm', daysInStage: 12, nextActionDate: '2026-04-26',
    nextAction: 'Send risk questionnaire', advisor: 'Vijay Venkat',
    email: 'david.okafor@okaforholdings.ng', phone: '+234 805-555-0167',
    notes: 'Real estate developer. Wants to diversify out of property into liquid assets.',
    activities: [
      { id: 'a6', date: '2026-04-10', type: 'meeting', summary: 'Discovery meeting — discussed real estate concentration and desire for diversification.' },
    ],
    documents: [],
    aiSuggestions: ['Recommend Balanced Growth model with real asset hedge.', 'Discuss tax implications of Nigerian cross-border investments.'],
  },
  {
    id: 'p5', name: 'Aarav Singh', initials: 'AS', avatarColor: '#2FA4F9',
    estimatedAUM: 5_000_000, stage: 'proposal-sent', source: 'Referral', referredBy: 'Sarah Chen',
    temperature: 'hot', daysInStage: 6, nextActionDate: '2026-04-23',
    nextAction: 'Follow up on proposal', advisor: 'Vijay Venkat',
    email: 'aarav.singh@techcorp.in', phone: '+91 99887-65432',
    notes: 'CTO at TechCorp. Looking for a disciplined long-term wealth plan. Sarah Chen referred.',
    activities: [
      { id: 'a7', date: '2026-04-10', type: 'meeting', summary: 'Discovery meeting — confirmed goals and risk profile.' },
      { id: 'a8', date: '2026-04-14', type: 'email', summary: 'Sent IPS and Balanced Growth proposal (PDF).' },
      { id: 'a9', date: '2026-04-17', type: 'call', summary: 'Brief check-in — Aarav reviewing with spouse.' },
    ],
    documents: ['Investment Policy Statement v1', 'Balanced Growth Proposal'],
    aiSuggestions: ['Schedule follow-up — 5 days since last contact.', 'Based on profile, recommend Balanced Growth model.'],
  },
  {
    id: 'p6', name: 'Sophia Zhang', initials: 'SZ', avatarColor: '#8B5CF6',
    estimatedAUM: 8_000_000, stage: 'negotiating', source: 'Event',
    temperature: 'warm', daysInStage: 14, nextActionDate: '2026-04-22',
    nextAction: 'Address fee structure concerns', advisor: 'Vijay Venkat',
    email: 'sophia.zhang@zhangfamily.hk', phone: '+852 9555-0199',
    notes: 'Family office representative. Comparing our proposal vs. 2 other firms. Key concern is fee transparency.',
    activities: [
      { id: 'a10', date: '2026-04-08', type: 'meeting', summary: 'Presented proposal to Sophia and family CFO.' },
      { id: 'a11', date: '2026-04-12', type: 'email', summary: 'Sophia requested detailed fee breakdown and performance attribution.' },
      { id: 'a12', date: '2026-04-15', type: 'email', summary: 'Sent comprehensive fee comparison document.' },
      { id: 'a13', date: '2026-04-18', type: 'call', summary: 'Discussed fee flexibility — she is comparing with UBS and JPM.' },
    ],
    documents: ['IPS v2', 'Fee Comparison Sheet', 'Performance Attribution Report'],
    aiSuggestions: ['Offer tiered fee structure to stay competitive.', 'Emphasize personalized service vs. wirehouses.'],
  },
  {
    id: 'p7', name: 'Carlos Mendez', initials: 'CM', avatarColor: '#EF4444',
    estimatedAUM: 6_500_000, stage: 'negotiating', source: 'Referral', referredBy: 'Elena Vasquez',
    temperature: 'hot', daysInStage: 10, nextActionDate: '2026-04-23',
    nextAction: 'Final proposal revision', advisor: 'Vijay Venkat',
    email: 'carlos.mendez@mendezgroup.mx', phone: '+52 55-5555-0145',
    notes: 'Business owner. Elena Vasquez referral. Close to decision — wants ESG-focused portfolio.',
    activities: [
      { id: 'a14', date: '2026-04-12', type: 'meeting', summary: 'Second proposal meeting — discussed ESG integration.' },
      { id: 'a15', date: '2026-04-16', type: 'email', summary: 'Sent revised proposal with ESG overlay.' },
      { id: 'a16', date: '2026-04-19', type: 'call', summary: 'Carlos verbally positive — wants one more revision on alternatives sleeve.' },
    ],
    documents: ['ESG Proposal v2', 'IPS with ESG overlay'],
    aiSuggestions: ['High conversion probability (85%) — prioritize final revision.', 'Include impact reporting sample to close.'],
  },
  {
    id: 'p8', name: 'Elena Vasquez', initials: 'EV', avatarColor: '#059669',
    estimatedAUM: 15_000_000, stage: 'won', source: 'LinkedIn',
    temperature: 'hot', daysInStage: 0, nextActionDate: '',
    nextAction: '', advisor: 'Vijay Venkat',
    email: 'elena.vasquez@vasquezcap.com', phone: '+1 305-555-0177',
    notes: 'Onboarded successfully. $15M AUM across 3 accounts. Referring contacts from her network.',
    activities: [
      { id: 'a17', date: '2026-03-15', type: 'meeting', summary: 'Final onboarding meeting — accounts funded.' },
      { id: 'a18', date: '2026-04-01', type: 'call', summary: 'First quarterly check-in. Very satisfied.' },
    ],
    documents: ['Signed IPS', 'Onboarding Package', 'Account Agreements'],
    aiSuggestions: ['Ask for referrals — Elena has a large professional network.', 'Schedule 90-day review meeting.'],
  },
  {
    id: 'p9', name: 'Thomas Park', initials: 'TP', avatarColor: '#94A3B8',
    estimatedAUM: 6_000_000, stage: 'lost', source: 'Event',
    temperature: 'cool', daysInStage: 21, nextActionDate: '',
    nextAction: '', advisor: 'Vijay Venkat',
    email: 'thomas.park@parkassociates.kr', phone: '+82 2-555-0133',
    notes: 'Chose competitor (Morgan Stanley). Cited existing relationship with their Seoul office.',
    activities: [
      { id: 'a19', date: '2026-03-25', type: 'call', summary: 'Thomas informed us he chose MS. Polite — open to reconnecting in future.' },
      { id: 'a20', date: '2026-04-01', type: 'email', summary: 'Sent thank-you note and open-door invitation.' },
    ],
    documents: ['Proposal (declined)'],
    aiSuggestions: ['Set 6-month re-engagement reminder.', 'Track for future opportunity if MS relationship changes.'],
  },
  {
    id: 'p10', name: 'Amara Osei', initials: 'AO', avatarColor: '#D946EF',
    estimatedAUM: 9_000_000, stage: 'proposal-sent', source: 'Existing Client Referral', referredBy: 'Lin Zhao',
    temperature: 'warm', daysInStage: 4, nextActionDate: '2026-04-27',
    nextAction: 'Schedule proposal walkthrough', advisor: 'Vijay Venkat',
    email: 'amara.osei@osei.gh', phone: '+233 24-555-0188',
    notes: 'Mining executive. Lin Zhao referral. Interested in capital preservation with growth component.',
    activities: [
      { id: 'a21', date: '2026-04-15', type: 'meeting', summary: 'Discovery meeting — discussed goals: capital preservation + moderate growth.' },
      { id: 'a22', date: '2026-04-18', type: 'email', summary: 'Sent IPS and Conservative Growth proposal.' },
    ],
    documents: ['Investment Policy Statement', 'Conservative Growth Proposal'],
    aiSuggestions: ['Recommend Conservative Growth model with commodity hedge.', 'Mention mining sector expertise in follow-up.'],
  },
];

const STAGES: { id: Stage; label: string; color: string; bgColor: string }[] = [
  { id: 'new-lead', label: 'New Lead', color: '#64748B', bgColor: 'bg-slate-50' },
  { id: 'qualified', label: 'Qualified', color: '#2FA4F9', bgColor: 'bg-brand-50' },
  { id: 'proposal-sent', label: 'Proposal Sent', color: '#8B5CF6', bgColor: 'bg-violet-50' },
  { id: 'negotiating', label: 'Negotiating', color: '#F59E0B', bgColor: 'bg-amber-50' },
  { id: 'won', label: 'Won', color: '#059669', bgColor: 'bg-emerald-50' },
  { id: 'lost', label: 'Lost', color: '#94A3B8', bgColor: 'bg-slate-50' },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
const fmtAUM = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

const fmtDate = (iso: string) =>
  iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';

const tempTone = (t: Temperature): 'danger' | 'warn' | 'brand' =>
  ({ hot: 'danger', warm: 'warn', cool: 'brand' } as const)[t];

const tempLabel = (t: Temperature) =>
  ({ hot: 'Hot', warm: 'Warm', cool: 'Cool' } as const)[t];

const sourceTone = (s: Source): 'brand' | 'purple' | 'neutral' | 'success' => {
  if (s === 'Referral') return 'purple';
  if (s === 'Event') return 'brand';
  if (s === 'Existing Client Referral') return 'success';
  return 'neutral';
};

const activityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'email': return IconMail;
    case 'call': return IconTarget;
    case 'meeting': return IconCalendar;
    case 'note': return IconBrief;
  }
};

/* ------------------------------------------------------------------ */
/*  Prospect Card (Kanban)                                             */
/* ------------------------------------------------------------------ */
const ProspectCard: React.FC<{ prospect: Prospect; onClick: () => void }> = ({ prospect, onClick }) => (
  <Card interactive className="p-3 mb-2.5 fade-up" onClick={onClick}>
    <div className="flex items-start gap-2.5">
      <Avatar initials={prospect.initials} color={prospect.avatarColor} size="sm" />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="font-semibold text-slate-900 text-[13px] truncate">{prospect.name}</span>
          <Badge tone={tempTone(prospect.temperature)}>
            {tempLabel(prospect.temperature)}
          </Badge>
        </div>
        <div className="mt-1 flex items-center gap-1.5 flex-wrap">
          <Badge tone="neutral">{fmtAUM(prospect.estimatedAUM)}</Badge>
          <Badge tone={sourceTone(prospect.source)}>{prospect.source}</Badge>
        </div>
      </div>
    </div>
    {(prospect.daysInStage > 0 || prospect.nextActionDate) && (
      <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        {prospect.daysInStage > 0 && (
          <span className="flex items-center gap-1">
            <IconClock size={12} /> {prospect.daysInStage}d in stage
          </span>
        )}
        {prospect.nextActionDate && (
          <span className="flex items-center gap-1">
            <IconCalendar size={12} /> {fmtDate(prospect.nextActionDate)}
          </span>
        )}
      </div>
    )}
    {prospect.referredBy && (
      <div className="mt-1.5 text-[11px] text-slate-400">
        Referred by {prospect.referredBy}
      </div>
    )}
    <div className="mt-1.5 text-[11px] text-slate-400 truncate">
      {prospect.advisor}
    </div>
  </Card>
);

/* ------------------------------------------------------------------ */
/*  Prospect Detail Panel                                              */
/* ------------------------------------------------------------------ */
const ProspectDetail: React.FC<{ prospect: Prospect; onClose: () => void }> = ({ prospect, onClose }) => {
  const stage = STAGES.find(s => s.id === prospect.stage)!;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-white h-full overflow-y-auto scroll-thin shadow-2xl animate-slide-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center gap-3 z-10">
          <Avatar initials={prospect.initials} color={prospect.avatarColor} size="lg" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-slate-900">{prospect.name}</h2>
              <Badge tone={tempTone(prospect.temperature)}>{tempLabel(prospect.temperature)}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-sm text-slate-500">
              <span>{fmtAUM(prospect.estimatedAUM)} est. AUM</span>
              <span className="text-slate-300">|</span>
              <span style={{ color: stage.color }} className="font-medium">{stage.label}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition">
            <IconX size={20} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Contact Info */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Contact Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <IconMail size={14} stroke="#64748B" /> {prospect.email}
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <IconTarget size={14} stroke="#64748B" /> {prospect.phone}
              </div>
              <div className="flex items-center gap-2 text-slate-700">
                <Badge tone={sourceTone(prospect.source)}>{prospect.source}</Badge>
                {prospect.referredBy && <span className="text-slate-500">via {prospect.referredBy}</span>}
              </div>
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Notes</h3>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 rounded-xl p-3">{prospect.notes}</p>
          </section>

          {/* Activity Timeline */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Activity Timeline</h3>
            <div className="space-y-3">
              {prospect.activities.slice().reverse().map(act => {
                const ActIcon = activityIcon(act.type);
                return (
                  <div key={act.id} className="flex gap-3">
                    <div className="mt-0.5 h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <ActIcon size={14} stroke="#475569" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] text-slate-400 mb-0.5">{fmtDate(act.date)}</div>
                      <div className="text-sm text-slate-700">{act.summary}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Documents */}
          {prospect.documents.length > 0 && (
            <section>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Documents</h3>
              <div className="space-y-1.5">
                {prospect.documents.map((doc, i) => (
                  <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-50 text-sm text-slate-700">
                    <IconBrief size={14} stroke="#64748B" />
                    <span className="flex-1">{doc}</span>
                    <IconChevronRight size={14} stroke="#94A3B8" />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* AI Suggestions */}
          <section>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <IconSparkles size={13} stroke="#2FA4F9" /> AI Suggestions
            </h3>
            <div className="space-y-2">
              {prospect.aiSuggestions.map((sug, i) => (
                <div key={i} className="flex gap-2.5 px-3 py-2.5 rounded-xl bg-brand-50/60 border border-brand-100">
                  <IconLightbulb size={14} stroke="#2FA4F9" className="mt-0.5 shrink-0" />
                  <span className="text-sm text-brand-800">{sug}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  List View                                                          */
/* ------------------------------------------------------------------ */
type SortKey = 'name' | 'estimatedAUM' | 'stage' | 'source' | 'temperature' | 'daysInStage' | 'nextActionDate' | 'advisor';

const ListTable: React.FC<{ prospects: Prospect[]; onSelect: (p: Prospect) => void }> = ({ prospects, onSelect }) => {
  const [sortKey, setSortKey] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    const arr = [...prospects];
    arr.sort((a, b) => {
      let cmp = 0;
      if (sortKey === 'name') cmp = a.name.localeCompare(b.name);
      else if (sortKey === 'estimatedAUM') cmp = a.estimatedAUM - b.estimatedAUM;
      else if (sortKey === 'stage') cmp = STAGES.findIndex(s => s.id === a.stage) - STAGES.findIndex(s => s.id === b.stage);
      else if (sortKey === 'source') cmp = a.source.localeCompare(b.source);
      else if (sortKey === 'temperature') cmp = (['hot', 'warm', 'cool'].indexOf(a.temperature)) - (['hot', 'warm', 'cool'].indexOf(b.temperature));
      else if (sortKey === 'daysInStage') cmp = a.daysInStage - b.daysInStage;
      else if (sortKey === 'nextActionDate') cmp = (a.nextActionDate || 'z').localeCompare(b.nextActionDate || 'z');
      else if (sortKey === 'advisor') cmp = a.advisor.localeCompare(b.advisor);
      return sortAsc ? cmp : -cmp;
    });
    return arr;
  }, [prospects, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
  };

  const TH: React.FC<{ k: SortKey; children: React.ReactNode; className?: string }> = ({ k, children, className = '' }) => (
    <th
      onClick={() => toggleSort(k)}
      className={`text-left text-[11px] uppercase tracking-wider font-semibold text-slate-400 px-3 py-2.5 cursor-pointer hover:text-slate-600 select-none ${className}`}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {sortKey === k && <span className="text-brand-500">{sortAsc ? '\u2191' : '\u2193'}</span>}
      </span>
    </th>
  );

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-slate-100">
            <tr>
              <TH k="name">Name</TH>
              <TH k="estimatedAUM">Est. AUM</TH>
              <TH k="stage">Stage</TH>
              <TH k="source">Source</TH>
              <TH k="temperature">Temp</TH>
              <TH k="daysInStage">Days</TH>
              <TH k="nextActionDate">Next Action</TH>
              <TH k="advisor">Advisor</TH>
            </tr>
          </thead>
          <tbody>
            {sorted.map(p => {
              const stage = STAGES.find(s => s.id === p.stage)!;
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="border-b border-slate-50 hover:bg-slate-50/60 cursor-pointer transition"
                >
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar initials={p.initials} color={p.avatarColor} size="sm" />
                      <span className="font-medium text-slate-900">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-700 font-medium">{fmtAUM(p.estimatedAUM)}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium" style={{ color: stage.color }}>
                      <span className="h-1.5 w-1.5 rounded-full" style={{ background: stage.color }} />
                      {stage.label}
                    </span>
                  </td>
                  <td className="px-3 py-3"><Badge tone={sourceTone(p.source)}>{p.source}</Badge></td>
                  <td className="px-3 py-3"><Badge tone={tempTone(p.temperature)}>{tempLabel(p.temperature)}</Badge></td>
                  <td className="px-3 py-3 text-slate-600">{p.daysInStage > 0 ? `${p.daysInStage}d` : '--'}</td>
                  <td className="px-3 py-3 text-slate-600 max-w-[200px] truncate">{p.nextAction || '--'}</td>
                  <td className="px-3 py-3 text-slate-500 text-xs">{p.advisor}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

/* ================================================================== */
/*  PipelineView (main export)                                         */
/* ================================================================== */
export const PipelineView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);

  /* KPI computations */
  const active = PROSPECTS.filter(p => p.stage !== 'won' && p.stage !== 'lost');
  const totalPipelineAUM = active.reduce((s, p) => s + p.estimatedAUM, 0);
  const avgDays = Math.round(active.reduce((s, p) => s + p.daysInStage, 0) / (active.length || 1));
  const wonCount = PROSPECTS.filter(p => p.stage === 'won').length;
  const closedCount = PROSPECTS.filter(p => p.stage === 'won' || p.stage === 'lost').length;
  const conversionRate = closedCount > 0 ? Math.round((wonCount / closedCount) * 100) : 0;

  /* Group by stage */
  const byStage = useMemo(() => {
    const map: Record<Stage, Prospect[]> = { 'new-lead': [], qualified: [], 'proposal-sent': [], negotiating: [], won: [], lost: [] };
    PROSPECTS.forEach(p => map[p.stage].push(p));
    return map;
  }, []);

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Prospect Pipeline</h1>
          <p className="text-sm text-slate-500 mt-0.5">Track and manage prospective clients through your sales funnel</p>
        </div>
        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              List
            </button>
          </div>
          <Button kind="primary" size="sm" icon={IconPlus}>
            Add Prospect
          </Button>
        </div>
      </div>

      {/* KPI Strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI label="Active Prospects" value={active.length} accent="#2FA4F9" sub="in pipeline" />
        <KPI label="Pipeline Value" value={fmtAUM(totalPipelineAUM)} accent="#8B5CF6" sub="estimated AUM" />
        <KPI label="Avg Days in Pipeline" value={avgDays} accent="#F59E0B" sub="across active" />
        <KPI label="Conversion Rate" value={`${conversionRate}%`} accent="#059669" delta={`${wonCount}/${closedCount} closed`} deltaTone="success" />
      </div>

      {/* Kanban Board */}
      {viewMode === 'kanban' && (
        <div className="flex gap-4 overflow-x-auto pb-4 scroll-thin">
          {STAGES.map(stage => {
            const prospects = byStage[stage.id];
            const stageAUM = prospects.reduce((s, p) => s + p.estimatedAUM, 0);
            const isWon = stage.id === 'won';
            const isLost = stage.id === 'lost';

            return (
              <div
                key={stage.id}
                className={`shrink-0 w-[260px] rounded-2xl p-3 ${
                  isWon ? 'bg-emerald-50/60' : isLost ? 'bg-slate-100/60' : 'bg-slate-50'
                }`}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ background: stage.color }}
                    />
                    <span className={`text-sm font-semibold ${isLost ? 'text-slate-400' : 'text-slate-700'}`}>
                      {stage.label}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium bg-white rounded-full px-1.5 py-0.5">
                      {prospects.length}
                    </span>
                  </div>
                  {stageAUM > 0 && (
                    <span className="text-[11px] font-medium text-slate-400">
                      {fmtAUM(stageAUM)}
                    </span>
                  )}
                </div>

                {/* Cards */}
                <div className={`space-y-0 ${isLost ? 'opacity-60' : ''}`}>
                  {prospects.map(p => (
                    <ProspectCard key={p.id} prospect={p} onClick={() => setSelectedProspect(p)} />
                  ))}
                  {prospects.length === 0 && (
                    <div className="text-center py-6 text-xs text-slate-400">
                      No prospects
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ListTable prospects={PROSPECTS} onSelect={setSelectedProspect} />
      )}

      {/* Detail Panel */}
      {selectedProspect && (
        <ProspectDetail prospect={selectedProspect} onClose={() => setSelectedProspect(null)} />
      )}
    </div>
  );
};

export default PipelineView;
