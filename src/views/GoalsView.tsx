import React, { useState } from 'react';
import { Card, Badge, Button, KPI } from '@/components/ui';
import {
  IconTarget,
  IconPlus,
  IconChevronDown,
  IconChevronRight,
  IconSparkles,
  IconBriefcase,
  IconShield,
  IconGlobe,
  IconBook,
  IconHome,
  IconUsers,
  IconCheckCircle,
  IconClock,
  IconTrendUp,
  IconX,
  IconLightbulb,
} from '@/components/icons';
import type { IcoProps } from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type GoalStatus = 'on-track' | 'at-risk' | 'behind' | 'achieved';
type GoalCategory = 'Retirement' | 'Education' | 'Estate' | 'Philanthropy' | 'Wealth Preservation' | 'Liquidity';

interface Milestone {
  date: string;
  label: string;
  done: boolean;
}

interface AIRecommendation {
  text: string;
}

interface LinkedAccount {
  name: string;
  value: string;
}

interface Goal {
  id: string;
  name: string;
  client: string;
  category: GoalCategory;
  icon: React.ComponentType<IcoProps>;
  targetAmount: number;
  currentFunded: number;
  targetDate: string;
  status: GoalStatus;
  monthlyContribution: number;
  growthRate: number;
  projectedOutcome: number;
  aiConfidence: number;
  milestones: Milestone[];
  recommendations: AIRecommendation[];
  linkedAccounts: LinkedAccount[];
  currentSavingsRate: number;
  projectedSurplus: number;
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const GOALS: Goal[] = [
  {
    id: 'g1',
    name: 'Retirement at 60',
    client: 'Sarah Chen',
    category: 'Retirement',
    icon: IconTarget,
    targetAmount: 15_000_000,
    currentFunded: 11_200_000,
    targetDate: '2032-06-01',
    status: 'on-track',
    monthlyContribution: 42_000,
    growthRate: 7.2,
    projectedOutcome: 15_800_000,
    aiConfidence: 91,
    currentSavingsRate: 28,
    projectedSurplus: 800_000,
    milestones: [
      { date: '2024-01', label: 'Max-funded 401(k) & backdoor Roth', done: true },
      { date: '2025-06', label: 'Hit $10M milestone', done: true },
      { date: '2028-01', label: 'Begin bond ladder allocation', done: false },
      { date: '2032-06', label: 'Target retirement date', done: false },
    ],
    recommendations: [
      { text: 'Consider shifting 5% from growth equities to dividend aristocrats as target date approaches.' },
      { text: 'Tax-loss harvest approximately $120K in international equity losses before year-end.' },
    ],
    linkedAccounts: [
      { name: 'Brokerage — Growth Portfolio', value: '$6.2M' },
      { name: '401(k) Rollover IRA', value: '$3.1M' },
      { name: 'Roth IRA', value: '$1.9M' },
    ],
  },
  {
    id: 'g2',
    name: "Education Fund — Maya",
    client: 'Sarah Chen',
    category: 'Education',
    icon: IconBook,
    targetAmount: 800_000,
    currentFunded: 520_000,
    targetDate: '2027-09-01',
    status: 'at-risk',
    monthlyContribution: 8_500,
    growthRate: 5.8,
    projectedOutcome: 740_000,
    aiConfidence: 68,
    currentSavingsRate: 15,
    projectedSurplus: -60_000,
    milestones: [
      { date: '2023-09', label: '529 plan opened', done: true },
      { date: '2025-01', label: 'Reached $500K', done: true },
      { date: '2026-09', label: 'Application year — lock gains', done: false },
      { date: '2027-09', label: 'First tuition payment due', done: false },
    ],
    recommendations: [
      { text: 'Increase monthly contribution by $2,000 to close the projected $60K shortfall.' },
      { text: 'Shift 15% of 529 allocation from equities to short-term bonds given the 2-year horizon.' },
      { text: 'Explore prepaid tuition plans for Stanford / MIT as a hedge against tuition inflation.' },
    ],
    linkedAccounts: [
      { name: '529 College Savings Plan', value: '$420K' },
      { name: 'UTMA Custodial Account', value: '$100K' },
    ],
  },
  {
    id: 'g3',
    name: 'Charitable Foundation Endowment',
    client: 'Goldberg Family',
    category: 'Philanthropy',
    icon: IconGlobe,
    targetAmount: 5_000_000,
    currentFunded: 3_800_000,
    targetDate: '2028-12-31',
    status: 'on-track',
    monthlyContribution: 25_000,
    growthRate: 6.5,
    projectedOutcome: 5_350_000,
    aiConfidence: 87,
    currentSavingsRate: 22,
    projectedSurplus: 350_000,
    milestones: [
      { date: '2023-06', label: 'Foundation established (501c3)', done: true },
      { date: '2024-12', label: 'Initial $3M seeded', done: true },
      { date: '2026-06', label: 'First grant cycle begins', done: false },
      { date: '2028-12', label: 'Full endowment funded', done: false },
    ],
    recommendations: [
      { text: 'Donate appreciated AAPL shares ($400K unrealized gains) to avoid capital gains tax.' },
      { text: 'Set up a donor-advised fund as a bridge for timing large charitable gifts.' },
    ],
    linkedAccounts: [
      { name: 'Foundation Investment Account', value: '$3.2M' },
      { name: 'DAF — Fidelity Charitable', value: '$600K' },
    ],
  },
  {
    id: 'g4',
    name: 'Estate Tax Minimization',
    client: 'Goldberg Family',
    category: 'Estate',
    icon: IconShield,
    targetAmount: 25_000_000,
    currentFunded: 18_500_000,
    targetDate: '2035-01-01',
    status: 'on-track',
    monthlyContribution: 0,
    growthRate: 6.0,
    projectedOutcome: 27_200_000,
    aiConfidence: 82,
    currentSavingsRate: 0,
    projectedSurplus: 2_200_000,
    milestones: [
      { date: '2024-03', label: 'Irrevocable life insurance trust (ILIT) established', done: true },
      { date: '2025-01', label: 'Annual gifting strategy ($17K/recipient) executed', done: true },
      { date: '2026-06', label: 'GRAT #2 funded', done: false },
      { date: '2030-01', label: 'Review exemption amounts with estate attorney', done: false },
    ],
    recommendations: [
      { text: 'Fund a new 2-year GRAT with $5M in concentrated stock to transfer appreciation tax-free.' },
      { text: 'Accelerate annual exclusion gifting — current exemption levels may sunset in 2026.' },
      { text: 'Consider a spousal lifetime access trust (SLAT) for additional estate freezing.' },
    ],
    linkedAccounts: [
      { name: 'Family Trust', value: '$12.4M' },
      { name: 'ILIT', value: '$3.8M' },
      { name: 'GRAT #1', value: '$2.3M' },
    ],
  },
  {
    id: 'g5',
    name: 'Real Estate Acquisition Fund',
    client: 'Anika Patel',
    category: 'Liquidity',
    icon: IconHome,
    targetAmount: 4_000_000,
    currentFunded: 2_100_000,
    targetDate: '2027-03-01',
    status: 'at-risk',
    monthlyContribution: 55_000,
    growthRate: 4.5,
    projectedOutcome: 3_650_000,
    aiConfidence: 62,
    currentSavingsRate: 35,
    projectedSurplus: -350_000,
    milestones: [
      { date: '2024-06', label: 'Liquidity reserve account opened', done: true },
      { date: '2025-09', label: 'Reached 50% of target', done: true },
      { date: '2026-06', label: 'Pre-approval for bridge financing', done: false },
      { date: '2027-03', label: 'Target acquisition date', done: false },
    ],
    recommendations: [
      { text: 'Increase monthly contribution by $15K or extend timeline by 6 months to close the gap.' },
      { text: 'Consider a securities-backed line of credit as bridge financing for the acquisition.' },
    ],
    linkedAccounts: [
      { name: 'High-Yield Savings', value: '$1.4M' },
      { name: 'Short-Term Bond Fund', value: '$700K' },
    ],
  },
  {
    id: 'g6',
    name: 'Wealth Preservation',
    client: 'Anika Patel',
    category: 'Wealth Preservation',
    icon: IconShield,
    targetAmount: 20_000_000,
    currentFunded: 20_800_000,
    targetDate: '2030-12-31',
    status: 'achieved',
    monthlyContribution: 30_000,
    growthRate: 5.5,
    projectedOutcome: 24_100_000,
    aiConfidence: 95,
    currentSavingsRate: 18,
    projectedSurplus: 4_100_000,
    milestones: [
      { date: '2023-01', label: 'Defensive allocation strategy implemented', done: true },
      { date: '2024-06', label: 'Inflation-protected bond sleeve added', done: true },
      { date: '2025-12', label: 'Target net worth achieved', done: true },
      { date: '2030-12', label: 'Maintain purchasing power (inflation-adjusted)', done: false },
    ],
    recommendations: [
      { text: 'Maintain current allocation — consider increasing TIPS weight if inflation expectations rise.' },
      { text: 'Review umbrella insurance coverage; current $10M policy may need uplift.' },
    ],
    linkedAccounts: [
      { name: 'Core Portfolio', value: '$14.2M' },
      { name: 'Alternative Investments', value: '$4.1M' },
      { name: 'Cash & Equivalents', value: '$2.5M' },
    ],
  },
  {
    id: 'g7',
    name: 'Business Succession Plan',
    client: 'Raj Malhotra',
    category: 'Estate',
    icon: IconBriefcase,
    targetAmount: 12_000_000,
    currentFunded: 7_200_000,
    targetDate: '2029-06-30',
    status: 'at-risk',
    monthlyContribution: 65_000,
    growthRate: 8.0,
    projectedOutcome: 11_400_000,
    aiConfidence: 72,
    currentSavingsRate: 30,
    projectedSurplus: -600_000,
    milestones: [
      { date: '2024-01', label: 'Business valuation completed ($18M)', done: true },
      { date: '2025-03', label: 'Buy-sell agreement drafted', done: true },
      { date: '2027-01', label: 'Key-person insurance in force', done: false },
      { date: '2029-06', label: 'Target transition date', done: false },
    ],
    recommendations: [
      { text: 'Establish an employee stock ownership plan (ESOP) to facilitate gradual ownership transfer.' },
      { text: 'Increase life insurance coverage to $12M to fully fund buy-sell agreement.' },
      { text: 'Consider an installment sale to a grantor trust for tax-efficient transfer.' },
    ],
    linkedAccounts: [
      { name: 'Business Operating Account', value: '$2.8M' },
      { name: 'Key-Person Insurance Reserve', value: '$1.4M' },
      { name: 'Succession Reserve Portfolio', value: '$3.0M' },
    ],
  },
  {
    id: 'g8',
    name: 'Philanthropic Legacy Fund',
    client: 'Raj Malhotra',
    category: 'Philanthropy',
    icon: IconGlobe,
    targetAmount: 3_000_000,
    currentFunded: 2_400_000,
    targetDate: '2028-12-31',
    status: 'on-track',
    monthlyContribution: 15_000,
    growthRate: 6.0,
    projectedOutcome: 3_250_000,
    aiConfidence: 88,
    currentSavingsRate: 12,
    projectedSurplus: 250_000,
    milestones: [
      { date: '2024-06', label: 'Charitable remainder trust (CRT) funded', done: true },
      { date: '2025-12', label: 'First annual distribution to charities', done: true },
      { date: '2027-01', label: 'Evaluate converting to private foundation', done: false },
      { date: '2028-12', label: 'Full endowment target met', done: false },
    ],
    recommendations: [
      { text: 'Bundle 2 years of charitable contributions into a single year for itemized deduction benefit.' },
      { text: 'Donate appreciated real estate to CRT to unlock illiquid value tax-efficiently.' },
    ],
    linkedAccounts: [
      { name: 'Charitable Remainder Trust', value: '$1.8M' },
      { name: 'DAF — Schwab Charitable', value: '$600K' },
    ],
  },
  {
    id: 'g9',
    name: 'Early Retirement Bridge',
    client: 'David & Lisa Wong',
    category: 'Retirement',
    icon: IconTarget,
    targetAmount: 2_500_000,
    currentFunded: 1_600_000,
    targetDate: '2028-01-01',
    status: 'on-track',
    monthlyContribution: 22_000,
    growthRate: 6.8,
    projectedOutcome: 2_680_000,
    aiConfidence: 84,
    currentSavingsRate: 25,
    projectedSurplus: 180_000,
    milestones: [
      { date: '2024-01', label: 'Bridge account opened — taxable brokerage', done: true },
      { date: '2025-06', label: 'Reached 60% of target', done: true },
      { date: '2027-01', label: 'Begin shifting to income-generating assets', done: false },
      { date: '2028-01', label: 'Early retirement begins (age 55)', done: false },
    ],
    recommendations: [
      { text: 'Build a 3-year cash reserve ladder to cover expenses before penalty-free 401(k) access.' },
      { text: 'Maximize HSA contributions as a tax-free bridge for healthcare costs.' },
    ],
    linkedAccounts: [
      { name: 'Joint Brokerage — Bridge Fund', value: '$1.2M' },
      { name: 'HSA Investment Account', value: '$180K' },
      { name: 'Money Market Reserve', value: '$220K' },
    ],
  },
  {
    id: 'g10',
    name: 'Liquidity Event Preparation',
    client: 'David & Lisa Wong',
    category: 'Liquidity',
    icon: IconBriefcase,
    targetAmount: 8_000_000,
    currentFunded: 1_200_000,
    targetDate: '2026-12-31',
    status: 'behind',
    monthlyContribution: 0,
    growthRate: 0,
    projectedOutcome: 1_200_000,
    aiConfidence: 35,
    currentSavingsRate: 0,
    projectedSurplus: -6_800_000,
    milestones: [
      { date: '2025-01', label: 'Pre-liquidity financial plan drafted', done: true },
      { date: '2025-06', label: 'Qualified Small Business Stock (QSBS) analysis', done: false },
      { date: '2026-06', label: 'Establish tax-efficient structure pre-exit', done: false },
      { date: '2026-12', label: 'Expected company acquisition closes', done: false },
    ],
    recommendations: [
      { text: 'Verify QSBS eligibility — could exclude up to $10M in capital gains from federal tax.' },
      { text: 'Create a charitable lead annuity trust (CLAT) pre-transaction to reduce estate exposure.' },
      { text: 'Engage M&A tax counsel to model net proceeds under various deal structures.' },
    ],
    linkedAccounts: [
      { name: 'Concentrated Stock (Private Co.)', value: '$6.8M est.' },
      { name: 'Liquid Reserves', value: '$1.2M' },
    ],
  },
];

const CLIENTS_LIST = ['All clients', 'Sarah Chen', 'Goldberg Family', 'Anika Patel', 'Raj Malhotra', 'David & Lisa Wong'];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fmt = (n: number) => {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
};

const fmtFull = (n: number) =>
  '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

const statusConfig: Record<GoalStatus, { label: string; tone: 'success' | 'warn' | 'danger' | 'brand'; dot: string }> = {
  'on-track': { label: 'On Track', tone: 'success', dot: 'bg-emerald-500' },
  'at-risk':  { label: 'At Risk',  tone: 'warn',    dot: 'bg-amber-500' },
  'behind':   { label: 'Behind',   tone: 'danger',  dot: 'bg-rose-500' },
  'achieved': { label: 'Achieved', tone: 'brand',   dot: 'bg-brand-500' },
};

const categoryTone: Record<GoalCategory, 'brand' | 'success' | 'purple' | 'warn' | 'neutral' | 'danger'> = {
  'Retirement': 'brand',
  'Education': 'purple',
  'Estate': 'neutral',
  'Philanthropy': 'success',
  'Wealth Preservation': 'warn',
  'Liquidity': 'danger',
};

const pct = (current: number, target: number) =>
  Math.min(100, Math.round((current / target) * 100));

/* ------------------------------------------------------------------ */
/*  Detail Panel                                                       */
/* ------------------------------------------------------------------ */

const DetailPanel: React.FC<{ goal: Goal; onClose: () => void }> = ({ goal, onClose }) => {
  const surplusPositive = goal.projectedSurplus >= 0;

  return (
    <div className="w-[420px] shrink-0 border-l border-slate-200 bg-white overflow-y-auto scroll-thin">
      {/* Header */}
      <div className="sticky top-0 bg-white border-b border-slate-100 px-5 py-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2 min-w-0">
          <goal.icon size={18} stroke="#2FA4F9" sw={2} />
          <h2 className="font-semibold text-slate-900 text-sm truncate">{goal.name}</h2>
        </div>
        <button onClick={onClose} className="p-1 rounded-md hover:bg-slate-100">
          <IconX size={16} stroke="#64748B" />
        </button>
      </div>

      <div className="px-5 py-5 space-y-6">
        {/* Cash flow projection */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Cash Flow Projection</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Savings Rate</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{goal.currentSavingsRate}%</div>
              <div className="text-[11px] text-slate-500">of gross income</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Growth Rate</div>
              <div className="text-lg font-bold text-slate-900 mt-1">{goal.growthRate}%</div>
              <div className="text-[11px] text-slate-500">assumed annual</div>
            </div>
            <div className="col-span-2 bg-slate-50 rounded-xl p-3">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                Projected {surplusPositive ? 'Surplus' : 'Shortfall'}
              </div>
              <div className={`text-lg font-bold mt-1 ${surplusPositive ? 'text-emerald-600' : 'text-rose-600'}`}>
                {surplusPositive ? '+' : ''}{fmtFull(goal.projectedSurplus)}
              </div>
              <div className="text-[11px] text-slate-500">
                vs. {fmtFull(goal.targetAmount)} target
              </div>
            </div>
          </div>
        </section>

        {/* Milestone timeline */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Milestone Timeline</h3>
          <div className="relative pl-5">
            <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
            {goal.milestones.map((m, i) => (
              <div key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                <div className={`absolute left-[-13px] top-[5px] w-3 h-3 rounded-full border-2 ${
                  m.done
                    ? 'bg-brand-500 border-brand-500'
                    : 'bg-white border-slate-300'
                }`} />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-slate-400">{m.date}</div>
                  <div className={`text-sm ${m.done ? 'text-slate-900' : 'text-slate-600'}`}>{m.label}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* AI Recommendations */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <IconSparkles size={12} stroke="#2FA4F9" />
            AI Recommendations
          </h3>
          <div className="space-y-2">
            {goal.recommendations.map((r, i) => (
              <div key={i} className="flex gap-2.5 bg-brand-50/60 rounded-xl p-3">
                <IconLightbulb size={14} stroke="#2FA4F9" sw={2} className="shrink-0 mt-0.5" />
                <p className="text-[13px] text-slate-700 leading-relaxed">{r.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Linked accounts */}
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">Linked Accounts</h3>
          <div className="space-y-1.5">
            {goal.linkedAccounts.map((a, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50">
                <span className="text-sm text-slate-700">{a.name}</span>
                <span className="text-sm font-semibold text-slate-900">{a.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Goal Card                                                          */
/* ------------------------------------------------------------------ */

const GoalCard: React.FC<{ goal: Goal; selected: boolean; onSelect: () => void }> = ({ goal, selected, onSelect }) => {
  const progress = pct(goal.currentFunded, goal.targetAmount);
  const st = statusConfig[goal.status];

  return (
    <Card
      interactive
      onClick={onSelect}
      className={`p-5 transition-all ${selected ? 'ring-2 ring-brand-400 ring-offset-1' : ''}`}
    >
      {/* Top row: icon + name + badges */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <goal.icon size={18} stroke="#2FA4F9" sw={2} />
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-slate-900 text-sm truncate">{goal.name}</div>
            <div className="text-xs text-slate-500">{goal.client}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge tone={categoryTone[goal.category]}>{goal.category}</Badge>
          <Badge tone={st.tone}>
            <span className={`inline-block w-1.5 h-1.5 rounded-full ${st.dot}`} />
            {st.label}
          </Badge>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1.5">
          <span className="text-xs text-slate-500">
            {fmt(goal.currentFunded)} of {fmt(goal.targetAmount)}
          </span>
          <span className="text-xs font-semibold text-slate-700">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${progress}%`,
              background: goal.status === 'achieved' ? '#2FA4F9' :
                          goal.status === 'behind' ? '#F43F5E' :
                          goal.status === 'at-risk' ? '#F59E0B' : '#10B981',
            }}
          />
        </div>
      </div>

      {/* Metrics row */}
      <div className="grid grid-cols-4 gap-3 text-center mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Target</div>
          <div className="text-sm font-bold text-slate-900">{goal.targetDate.slice(0, 7)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Monthly</div>
          <div className="text-sm font-bold text-slate-900">{fmt(goal.monthlyContribution)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Projected</div>
          <div className="text-sm font-bold text-slate-900">{fmt(goal.projectedOutcome)}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">AI Conf.</div>
          <div className={`text-sm font-bold ${
            goal.aiConfidence >= 80 ? 'text-emerald-600' :
            goal.aiConfidence >= 60 ? 'text-amber-600' : 'text-rose-600'
          }`}>
            {goal.aiConfidence}%
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
        <Button kind="soft" size="sm" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
          View plan
        </Button>
        <Button kind="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
          Adjust
        </Button>
      </div>
    </Card>
  );
};

/* ------------------------------------------------------------------ */
/*  Main View                                                          */
/* ------------------------------------------------------------------ */

type ScenarioType = 'base' | 'optimistic' | 'conservative';

export const GoalsView: React.FC = () => {
  const [selectedClient, setSelectedClient] = useState('All clients');
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [clientDropdownOpen, setClientDropdownOpen] = useState(false);
  const [scenario, setScenario] = useState<ScenarioType>('base');
  const [contributionDelta, setContributionDelta] = useState(0);

  const filteredGoals = selectedClient === 'All clients'
    ? GOALS
    : GOALS.filter(g => g.client === selectedClient);

  const selectedGoal = GOALS.find(g => g.id === selectedGoalId) || null;

  const onTrack = filteredGoals.filter(g => g.status === 'on-track').length;
  const atRisk = filteredGoals.filter(g => g.status === 'at-risk').length;
  const behind = filteredGoals.filter(g => g.status === 'behind').length;
  const achieved = filteredGoals.filter(g => g.status === 'achieved').length;

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex-1 overflow-y-auto scroll-thin">
        <div className="max-w-5xl mx-auto px-8 py-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Financial Planning & Goals</h1>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="text-sm text-slate-500">Showing goals for</span>
                <div className="relative">
                  <button
                    onClick={() => setClientDropdownOpen(!clientDropdownOpen)}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-sm font-medium text-brand-700 bg-brand-50 hover:bg-brand-100 transition"
                  >
                    {selectedClient}
                    <IconChevronDown size={14} stroke="#1B8AD8" />
                  </button>
                  {clientDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setClientDropdownOpen(false)} />
                      <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-xl elev-2 border border-slate-200 py-1 z-20">
                        {CLIENTS_LIST.map(c => (
                          <button
                            key={c}
                            onClick={() => { setSelectedClient(c); setClientDropdownOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-sm transition ${
                              selectedClient === c
                                ? 'bg-brand-50 text-brand-700 font-medium'
                                : 'text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            {c}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <Button kind="primary" icon={IconPlus} size="md">
              Add Goal
            </Button>
          </div>

          {/* KPI strip */}
          <div className="grid grid-cols-5 gap-4 mb-8">
            <KPI
              label="Total Goals"
              value={filteredGoals.length}
              sub="across all categories"
              accent="#2FA4F9"
            />
            <KPI
              label="On Track"
              value={onTrack}
              sub={achieved > 0 ? `+${achieved} achieved` : undefined}
              accent="#10B981"
            />
            <KPI
              label="At Risk"
              value={atRisk}
              sub="need attention"
              accent="#F59E0B"
            />
            <KPI
              label="Behind"
              value={behind}
              sub="action required"
              accent="#F43F5E"
            />
            <KPI
              label="Avg. AI Confidence"
              value={filteredGoals.length > 0 ? `${Math.round(filteredGoals.reduce((sum, g) => sum + g.aiConfidence, 0) / filteredGoals.length)}%` : '—'}
              sub="across filtered goals"
              accent="#6366F1"
            />
          </div>

          {/* Scenario Analysis */}
          {(() => {
            const scenarioReturnDelta = scenario === 'optimistic' ? 2 : scenario === 'conservative' ? -2 : 0;

            // Compute projected surplus/shortfall impact from contribution change
            // Mock: each $1K monthly change over avg 4 years = ~$48K impact
            const contributionImpact = contributionDelta * 48;
            const returnImpact = scenarioReturnDelta * 320_000; // mock: 2% return shift = ~$320K on avg portfolio
            const totalImpactChange = contributionImpact + returnImpact;

            // Cash flow projection data: portfolio value over 5 years
            const baseValues = [48.2, 53.1, 58.4, 64.2, 70.8, 78.1]; // in millions
            const optimisticValues = baseValues.map(v => +(v * 1.12).toFixed(1));
            const conservativeValues = baseValues.map(v => +(v * 0.89).toFixed(1));
            const years = ['2026', '2027', '2028', '2029', '2030', '2031'];
            const maxVal = Math.max(...optimisticValues);

            return (
              <>
                <Card className="p-5 mb-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <IconSparkles size={16} stroke="#2FA4F9" sw={2} />
                      <h2 className="text-sm font-semibold text-slate-900">Scenario Analysis</h2>
                    </div>
                  </div>

                  {/* Scenario toggle bar */}
                  <div className="flex items-center gap-2 mb-5">
                    <span className="text-xs font-medium text-slate-500 mr-1">Scenario:</span>
                    {([
                      { key: 'base' as ScenarioType, label: 'Base Case' },
                      { key: 'optimistic' as ScenarioType, label: 'Optimistic (+2% return)' },
                      { key: 'conservative' as ScenarioType, label: 'Conservative (-2% return)' },
                    ]).map(s => (
                      <button
                        key={s.key}
                        onClick={() => setScenario(s.key)}
                        className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                          scenario === s.key
                            ? 'bg-brand-500 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>

                  {/* What-if slider */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-slate-500">Monthly contribution change</span>
                      <span className="text-sm font-bold text-slate-900">
                        {contributionDelta >= 0 ? '+' : ''}{contributionDelta > 0 ? `$${contributionDelta}K` : contributionDelta < 0 ? `$${contributionDelta}K` : '$0'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400 shrink-0">-$10K</span>
                      <input
                        type="range"
                        min={-10}
                        max={10}
                        step={1}
                        value={contributionDelta}
                        onChange={e => setContributionDelta(Number(e.target.value))}
                        className="flex-1 h-2 rounded-full appearance-none cursor-pointer accent-brand-500"
                        style={{
                          background: `linear-gradient(to right, #E2E8F0 0%, #E2E8F0 ${(contributionDelta + 10) / 20 * 100}%, #E2E8F0 ${(contributionDelta + 10) / 20 * 100}%, #E2E8F0 100%)`,
                        }}
                      />
                      <span className="text-xs text-slate-400 shrink-0">+$10K</span>
                    </div>
                  </div>

                  {/* Impact display */}
                  <div className="bg-slate-50 rounded-xl px-4 py-3 flex items-center gap-3">
                    <IconTrendUp size={16} stroke={totalImpactChange >= 0 ? '#10B981' : '#F43F5E'} sw={2} />
                    <div>
                      <span className="text-xs text-slate-500">Projected surplus/shortfall change: </span>
                      <span className={`text-sm font-bold ${totalImpactChange >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {totalImpactChange >= 0 ? '+' : ''}{totalImpactChange >= 1_000_000 || totalImpactChange <= -1_000_000
                          ? `$${(totalImpactChange / 1_000_000).toFixed(1)}M`
                          : `$${(totalImpactChange / 1_000).toFixed(0)}K`}
                      </span>
                    </div>
                  </div>
                </Card>

                {/* Cash Flow Projection Chart */}
                <Card className="p-5 mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-semibold text-slate-900">Cash Flow Projection — Portfolio Value Over 5 Years</h2>
                    <Badge tone="purple">
                      <IconSparkles size={10} /> Monte Carlo: 87% probability of reaching goal
                    </Badge>
                  </div>

                  {/* Bar chart with 3 overlaid bars per year */}
                  <div className="border border-slate-200 rounded-xl p-5">
                    {/* Y-axis labels */}
                    <div className="flex">
                      <div className="w-14 shrink-0 flex flex-col justify-between text-[10px] text-slate-400 font-medium pr-2 h-52">
                        <span>${Math.ceil(maxVal / 10) * 10}M</span>
                        <span>${Math.ceil(maxVal / 10) * 5}M</span>
                        <span>$0</span>
                      </div>
                      <div className="flex-1 flex items-end gap-4 h-52">
                        {years.map((year, i) => {
                          const bH = (baseValues[i] / maxVal) * 100;
                          const oH = (optimisticValues[i] / maxVal) * 100;
                          const cH = (conservativeValues[i] / maxVal) * 100;
                          return (
                            <div key={year} className="flex-1 flex items-end justify-center gap-1 h-full">
                              <div
                                className="w-4 rounded-t-sm transition-all"
                                style={{ height: `${cH}%`, backgroundColor: '#F59E0B', opacity: 0.7 }}
                                title={`Conservative: $${conservativeValues[i]}M`}
                              />
                              <div
                                className="w-4 rounded-t-sm transition-all"
                                style={{ height: `${bH}%`, backgroundColor: '#2FA4F9' }}
                                title={`Base: $${baseValues[i]}M`}
                              />
                              <div
                                className="w-4 rounded-t-sm transition-all"
                                style={{ height: `${oH}%`, backgroundColor: '#10B981', opacity: 0.7 }}
                                title={`Optimistic: $${optimisticValues[i]}M`}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* X-axis labels */}
                    <div className="flex mt-2">
                      <div className="w-14 shrink-0" />
                      <div className="flex-1 flex gap-4">
                        {years.map(y => (
                          <div key={y} className="flex-1 text-center text-[11px] text-slate-500 font-medium">{y}</div>
                        ))}
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex items-center justify-center gap-5 mt-4 pt-3 border-t border-slate-100">
                      {[
                        { label: 'Conservative', color: '#F59E0B' },
                        { label: 'Base Case', color: '#2FA4F9' },
                        { label: 'Optimistic', color: '#10B981' },
                      ].map(l => (
                        <div key={l.label} className="flex items-center gap-1.5">
                          <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: l.color }} />
                          <span className="text-xs text-slate-500">{l.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Card>
              </>
            );
          })()}

          {/* Goals list */}
          <div className="space-y-4">
            {filteredGoals.map(goal => (
              <GoalCard
                key={goal.id}
                goal={goal}
                selected={selectedGoalId === goal.id}
                onSelect={() => setSelectedGoalId(selectedGoalId === goal.id ? null : goal.id)}
              />
            ))}
          </div>

          {filteredGoals.length === 0 && (
            <div className="text-center py-16">
              <IconTarget size={40} stroke="#CBD5E1" sw={1.4} />
              <p className="text-slate-400 mt-3 text-sm">No goals found for this client.</p>
            </div>
          )}
        </div>
      </div>

      {/* Detail panel */}
      {selectedGoal && (
        <DetailPanel goal={selectedGoal} onClose={() => setSelectedGoalId(null)} />
      )}
    </div>
  );
};

export default GoalsView;
