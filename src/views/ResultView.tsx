import React, { useState, useEffect, useRef } from 'react';
import type { Template, Client, Source, SeedContent, FollowUpIntent } from '@/types';
import { SEED } from '@/data/trust';
import { CLIENTS, fmtPct } from '@/data/clients';
import { resolveFollowUp } from '@/data/intents';
import { useTypewriter } from '@/hooks';
import { Badge, Card } from '@/components/ui';
import { AgentTrace, AISummary, RightRail, FollowUpBar, StructuredSummary } from '@/components/shared';
import type { StructuredData } from '@/components/shared';
import {
  IconSparkles,
  IconCheckCircle,
  IconArrowRight,
  IconCopy,
  IconRefresh,
  IconThumbsUp,
  IconThumbsDown,
  iconMap,
} from '@/components/icons';

/* ================================================================
   Per-template STRUCTURED summary data
   Replaces flat paragraph format with scannable, decision-oriented layout
   ================================================================ */
type StructuredSummaryFn = (client?: Client | null) => StructuredData;

const STRUCTURED_SUMMARIES: Record<string, StructuredSummaryFn> = {
  review: (client) => {
    const c = client || CLIENTS[0];
    const diff = +(c.ytd - c.bench).toFixed(1);
    return {
      headline: `${c.name}'s portfolio is performing well — here's what you need to know for the review.`,
      metrics: [
        { label: 'YTD Return', value: fmtPct(c.ytd, 1, true), tone: c.ytd >= 0 ? 'positive' : 'negative', cite: 1 },
        { label: 'vs Benchmark', value: fmtPct(diff, 1, true), tone: diff >= 0 ? 'positive' : 'negative' },
        { label: 'Drift from Target', value: `${c.drift}%`, tone: c.drift > 5 ? 'warn' : 'neutral' },
        { label: 'Model', value: c.model, tone: 'neutral' },
      ],
      details: [
        { icon: 'trendUp', tone: 'positive', text: `US Equity is overweight by +6% after strong runs in NVDA and MSFT`, bold: '+6%' },
        { icon: 'trendDown', tone: 'negative', text: 'Fixed Income underweight by -8% relative to target allocation', bold: '-8%' },
        { icon: 'alert', tone: c.drift > 5 ? 'warn' : 'neutral', text: `Current drift of ${c.drift}% is ${c.drift > 5 ? 'above' : 'within'} the 5% rebalance threshold`, bold: `${c.drift}%` },
      ],
      actions: [
        { label: '1-page meeting brief', description: 'Pre-built with performance, attribution, and talking points', status: 'ready', icon: 'brief' },
        { label: '3 talking points ready', description: 'Performance highlights, drift drivers, and rebalance recommendation', status: 'ready', icon: 'chat' },
        { label: 'Performance attribution chart', description: 'Sector-level breakdown exportable to PDF', status: 'ready', icon: 'bar' },
      ],
      footnote: 'Data as of 6 min ago via Schwab custodian feed · Benchmark: Balanced Growth v4.2 blend',
    };
  },

  rebalance: (client) => {
    const c = client || CLIENTS[0];
    return {
      headline: `5 trades will bring ${c.name} back within target — compliance-checked and ready for OMS.`,
      metrics: [
        { label: 'Trades', value: '5', tone: 'neutral', icon: 'scale' },
        { label: 'Drift After', value: `${c.drift}% → 1.4%`, tone: 'positive', cite: 1 },
        { label: 'Tax Impact', value: '-$8.2K', tone: 'warn' },
        { label: 'Cash Effect', value: 'Flat', tone: 'positive' },
      ],
      details: [
        { icon: 'trendDown', tone: 'negative', text: 'Trim NVDA (-2.1%), VTI (-1.8%) to reduce equity overweight', bold: 'NVDA (-2.1%), VTI (-1.8%)' },
        { icon: 'trendUp', tone: 'positive', text: 'Add to BND (+3.2%), VXUS (+0.7%) to close fixed income gap', bold: 'BND (+3.2%), VXUS (+0.7%)' },
        { icon: 'receipt', tone: 'warn', text: 'Short-term gains on NVDA partially offsetable via TLH on AAPL lot ($11K)', bold: '$11K' },
        { icon: 'shield', tone: 'positive', text: 'All trades pre-checked for concentration limits and wash-sale rules', bold: 'pre-checked' },
      ],
      actions: [
        { label: 'Send to OMS', description: 'Trade blotter staged and ready for execution', status: 'ready', icon: 'scale' },
        { label: 'Client rationale memo', description: 'Auto-drafted explanation for client records', status: 'ready', icon: 'brief' },
      ],
      footnote: 'Compliance ruleset Apr 2026 · Tax engine: 37% federal + 5% state bracket',
    };
  },

  risk: () => ({
    headline: 'Your book has moderate-aggressive risk with two notable concentrations to watch.',
    metrics: [
      { label: 'Risk Score', value: '64 / 100', tone: 'warn', cite: 1 },
      { label: 'Top Concentration', value: 'NVDA 6.2%', tone: 'warn' },
      { label: 'GFC Drawdown', value: '~$11.3M', tone: 'negative' },
      { label: 'Rate Shock (+200bp)', value: '~$3.6M', tone: 'negative', cite: 2 },
    ],
    details: [
      { icon: 'alert', tone: 'warn', text: 'Tech sector at 32% of book — above the 25% soft limit', bold: '32%' },
      { icon: 'alert', tone: 'warn', text: 'NVDA at 6.2% book-level is the largest single-name exposure', bold: '6.2%' },
      { icon: 'shield', tone: 'neutral', text: 'VaR 99% (1-day) is $284K across the full book', bold: '$284K' },
      { icon: 'trendUp', tone: 'positive', text: 'Portfolio Sharpe ratio of 1.34 outperforms peer group median', bold: '1.34' },
    ],
    actions: [
      { label: 'Hedging options', description: 'QQQ puts, SPLV rotation, or NVDA covered calls — details in right rail', status: 'ready', icon: 'shield' },
      { label: 'Risk dashboard PDF', description: 'Full stress scenario detail exportable for compliance', status: 'ready', icon: 'brief' },
    ],
    footnote: 'Flyer Risk Engine · VaR 99% 1d · Stress scenarios: GFC, COVID, rate shock, stagflation, tech correction, geopolitical',
  }),

  news: () => ({
    headline: '5 stories are moving names in your book today — net impact is positive but two clients need attention.',
    metrics: [
      { label: 'Net Book Impact', value: '+0.8%', tone: 'positive', cite: 1 },
      { label: 'Dollar Impact', value: '~$405K', tone: 'positive' },
      { label: 'Top Gainer', value: 'NVDA +2.4%', tone: 'positive' },
      { label: 'Top Decliner', value: 'AAPL -1.2%', tone: 'negative' },
    ],
    details: [
      { icon: 'trendUp', tone: 'positive', text: 'NVDA up 2.4% on Blackwell Ultra production announcement', bold: 'NVDA up 2.4%' },
      { icon: 'trendDown', tone: 'negative', text: 'AAPL down 1.2% on iPhone build cut reports from Nikkei', bold: 'AAPL down 1.2%' },
      { icon: 'users', tone: 'warn', text: 'Marcus Reid and Lin Zhao are most exposed to today\'s moves', bold: 'Marcus Reid and Lin Zhao' },
    ],
    actions: [
      { label: 'Draft outreach emails', description: 'Personalized updates for affected clients (2)', status: 'ready', icon: 'mail' },
      { label: 'Market commentary', description: 'Today-in-markets brief ready for newsletter', status: 'ready', icon: 'newspaper' },
      { label: 'Review hedges', description: 'Protective strategies for AAPL-exposed clients', status: 'pending', icon: 'shield' },
    ],
    footnote: 'Bloomberg + Reuters wire · Live feed · Last update: just now',
  }),

  tax: () => ({
    headline: '4 tax-loss harvesting opportunities totaling $47.9K in unrealized losses — act before Apr 15.',
    metrics: [
      { label: 'Opportunities', value: '4 lots', tone: 'neutral', cite: 1 },
      { label: 'Unrealized Losses', value: '-$47.9K', tone: 'negative' },
      { label: 'Est. Tax Savings', value: '$17.8K', tone: 'positive', cite: 2 },
      { label: 'Tax Bracket', value: '37% + 5%', tone: 'neutral' },
    ],
    details: [
      { icon: 'receipt', tone: 'positive', text: 'AAPL 2024 lot: $11.2K loss → swap to MSFT (sector-neutral)', bold: '$11.2K' },
      { icon: 'receipt', tone: 'positive', text: 'META 2023 lot: $14.8K loss → swap to GOOGL (mega-cap tech)', bold: '$14.8K' },
      { icon: 'receipt', tone: 'positive', text: 'NFLX 2024 lot: $8.6K loss → swap to DIS (media sector)', bold: '$8.6K' },
      { icon: 'receipt', tone: 'positive', text: 'TSLA 2023 lot: $13.3K loss → swap to RIVN (EV sector)', bold: '$13.3K' },
      { icon: 'shield', tone: 'positive', text: 'All swaps pass wash-sale clearance (30-day window clean)', bold: 'wash-sale clearance' },
    ],
    actions: [
      { label: 'Stage TLH trades', description: 'Swap pairs queued for batch execution', status: 'ready', icon: 'scale' },
      { label: 'TLH opportunity report', description: 'Lot-level detail with cost basis and holding periods', status: 'ready', icon: 'brief' },
    ],
    footnote: 'Tax engine · 37% federal + 5% state · Wash-sale rule: 30-day window · Deadline: Apr 15, 2026',
  }),

  proposal: () => ({
    headline: 'Investment Policy Statement drafted for prospect Aarav Singh — ready for review.',
    metrics: [
      { label: 'Prospect', value: 'Aarav Singh', tone: 'neutral', cite: 1 },
      { label: 'Investable', value: '$3.0M', tone: 'neutral' },
      { label: 'Risk Profile', value: 'Moderate', tone: 'neutral' },
      { label: 'Horizon', value: '20 years', tone: 'neutral' },
    ],
    details: [
      { icon: 'users', tone: 'neutral', text: '30 y/o tech founder — prioritizes long-term growth with downside protection', bold: 'long-term growth' },
      { icon: 'scale', tone: 'positive', text: 'Recommended Balanced Growth model with tax-aware ETF core', bold: 'Balanced Growth', },
      { icon: 'briefcase', tone: 'neutral', text: '10% private alternatives sleeve for diversification and alpha', bold: '10% private alternatives' },
    ],
    actions: [
      { label: 'IPS draft (4 pages)', description: 'Full policy statement with allocation targets and constraints', status: 'ready', icon: 'brief' },
      { label: 'Proposal deck', description: 'Client-facing presentation with projections and fee disclosure', status: 'ready', icon: 'briefcase' },
    ],
    footnote: 'Model: Balanced Growth v4.2 · Compliance ruleset Apr 2026 · Benchmark: 60/40 + 5% Alts blend',
  }),
};

/* ================================================================
   Per-template branch options (continue-with chips)
   ================================================================ */
const BRANCH_OPTIONS: Record<string, string[]> = {
  review: ['Focus on attribution', 'Focus on tax impact', 'Prepare for the meeting'],
  rebalance: ['Alternative optimizer', 'Apply to all clients', 'What if we wait 30 days?'],
  risk: ['Hedge ideas', 'Run a scenario', 'Compare across clients'],
  news: ['Hedge ideas', 'Draft a client email', 'Summarize for newsletter'],
  tax: ['Apply to similar clients', 'Schedule harvest', 'Export to CRM'],
  proposal: ['Add fee schedule', 'Plain-language version', 'Compare to last prospect'],
};

/* ================================================================
   Per-template follow-up suggestions
   ================================================================ */
const FOLLOW_UP_SUGGESTIONS: Record<string, string[]> = {
  review: [
    'Show after-tax return',
    'Compare to 60/40',
    'Project 5-year IRR',
    'Draft a client email',
    'Schedule a review meeting',
    'Compare across clients',
    'ESG snapshot',
  ],
  rebalance: [
    'Optimize for after-tax',
    'Apply to all Balanced Growth clients',
    'Show before/after',
    'What if rates fall 50bps?',
    'Export to CRM',
  ],
  risk: [
    'Suggest hedges for tech exposure',
    'What if inflation spikes?',
    'Drill into Marcus Reid',
    'Compare across clients',
    'Schedule a risk review',
  ],
  news: [
    'Summarize for newsletter',
    'Show macro implications',
    'Find hedges for AAPL',
    'Draft a client email',
    'Compare impact across clients',
  ],
  tax: [
    'Apply across all clients with similar lots',
    'Show after-tax IRR uplift',
    'Schedule for end of day',
    'Export to CRM',
    'Add 30-day reminder',
  ],
  proposal: [
    'Add fee schedule',
    'Include 5-year projection',
    'Translate to plain language',
    'ESG snapshot',
    'Schedule a prospect meeting',
  ],
};

/* ================================================================
   Turn types
   ================================================================ */
export interface UserTurnData {
  id: string;
  kind: 'user';
  text: string;
  chips?: Array<{ label: string; value: string }>;
}

export interface AIInitialTurnData {
  id: string;
  kind: 'ai-initial';
}

export interface AIFollowUpTurnData {
  id: string;
  kind: 'ai-followup';
  intent: FollowUpIntent;
}

export type TurnData = UserTurnData | AIInitialTurnData | AIFollowUpTurnData;

/* ================================================================
   Sub-components
   ================================================================ */

/**
 * TurnHeader - Header for AI turns with template icon, title, badges, and action buttons
 */
const TurnHeader: React.FC<{
  template: { icon: string | React.ComponentType<any>; title: string; accent: string };
  client?: Client | null;
  subtitle?: string;
}> = ({ template, client, subtitle }) => {
  const IconC =
    typeof template.icon === 'string' ? iconMap[template.icon] || IconSparkles : template.icon;

  return (
    <div className="flex items-start gap-4 mb-4">
      <div
        className="h-11 w-11 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: `${template.accent}18` }}
      >
        <IconC size={22} stroke={template.accent} sw={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h2 className="text-[18px] font-bold text-slate-900">{template.title}</h2>
          <Badge tone="brand">
            <IconSparkles size={10} sw={2.4} /> AI
          </Badge>
          <Badge tone="success">
            <IconCheckCircle size={10} sw={2.4} /> Verified
          </Badge>
        </div>
        <div className="text-[12.5px] text-slate-500 mt-0.5">
          {subtitle ||
            (client ? (
              <>
                For <span className="font-medium text-slate-700">{client.name}</span> &middot;{' '}
                {client.role}
              </>
            ) : (
              'Across your full book'
            ))}
          <span className="mx-2">&middot;</span>
          GPT-Copilot v3.1
        </div>
      </div>
      <div className="flex items-center gap-0.5">
        <button
          className="p-2 rounded-lg hover:bg-slate-100 ripple text-slate-500"
          title="Copy"
        >
          <IconCopy size={15} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-slate-100 ripple text-slate-500"
          title="Regenerate"
        >
          <IconRefresh size={15} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-slate-100 ripple text-slate-500"
          title="Good answer"
        >
          <IconThumbsUp size={15} />
        </button>
        <button
          className="p-2 rounded-lg hover:bg-slate-100 ripple text-slate-500"
          title="Bad answer"
        >
          <IconThumbsDown size={15} />
        </button>
      </div>
    </div>
  );
};

/**
 * UserTurn - Renders a user message bubble (right-aligned)
 */
const UserTurn: React.FC<{
  text: string;
  contextChips?: Array<{ label: string; value: string }>;
}> = ({ text, contextChips }) => (
  <div className="flex justify-end mb-4 fade-up">
    <div className="max-w-[70%]">
      {contextChips && contextChips.length > 0 && (
        <div className="flex justify-end gap-1 mb-1 flex-wrap">
          {contextChips.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10.5px] text-slate-600"
            >
              <span className="text-slate-400">{c.label}:</span>
              <span className="font-medium">{c.value}</span>
            </span>
          ))}
        </div>
      )}
      <div className="user-bubble text-[14px]">{text}</div>
    </div>
  </div>
);

/**
 * AITurnInitial - First AI response with agent trace, summary, and branch chips
 */
const AITurnInitial: React.FC<{
  template: Template;
  client?: Client | null;
  onBranch?: (text: string) => void;
}> = ({ template, client, onBranch }) => {
  const seed = SEED[template.id];
  const structuredFn = STRUCTURED_SUMMARIES[template.id];
  const structured = structuredFn ? structuredFn(client) : null;
  const [summaryDone, setSummaryDone] = useState(false);

  // Track when headline typewriter finishes to show branches
  const headlineText = structured?.headline || '';
  const { done } = useTypewriter(headlineText, { speed: 6 });

  useEffect(() => {
    if (done) {
      const t = setTimeout(() => setSummaryDone(true), 600);
      return () => clearTimeout(t);
    }
  }, [done]);

  const branches = BRANCH_OPTIONS[template.id] || [];

  return (
    <div className="mb-8">
      <TurnHeader template={template} client={client} />
      {seed && (
        <div className="mb-4">
          <AgentTrace steps={seed.steps} accent={template.accent} />
        </div>
      )}
      <Card className="p-5 mb-4">
        {structured ? (
          <StructuredSummary data={structured} />
        ) : (
          <p className="text-[14px] text-slate-500 italic">No summary available.</p>
        )}
      </Card>
      {summaryDone && branches.length > 0 && (
        <div className="mt-4 fade-up flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 inline-flex items-center gap-1">
            <IconArrowRight size={11} stroke="#94A3B8" /> Continue with
          </span>
          {branches.map((b, i) => (
            <button
              key={i}
              onClick={() => onBranch && onBranch(b)}
              className="branch-btn"
            >
              <IconSparkles size={10} stroke="#2FA4F9" sw={2.4} /> {b}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * AITurnFollowUp - Follow-up AI turn based on a resolved intent
 */
const AITurnFollowUp: React.FC<{
  intent: FollowUpIntent;
  client?: Client | null;
}> = ({ intent, client }) => {
  const structured = intent.structured ? intent.structured(client) : null;

  const templateLike = {
    icon: IconSparkles,
    title: intent.label,
    accent: intent.accent,
  };

  return (
    <div className="mb-8">
      <TurnHeader
        template={templateLike}
        client={client}
        subtitle="Refined answer based on your follow-up"
      />
      <div className="mb-4">
        <AgentTrace steps={intent.steps} accent={intent.accent} />
      </div>
      <Card className="p-5 mb-4">
        {structured ? (
          <StructuredSummary data={structured} />
        ) : (
          <AISummary pieces={intent.summary(client)} sources={intent.sources} />
        )}
      </Card>
    </div>
  );
};

/* ================================================================
   ResultView — the main conversation/result view
   ================================================================ */
export interface ResultViewProps {
  turns: TurnData[];
  template: Template;
  client?: Client | null;
  onFollowUp: (text: string) => void;
  onRegenerate?: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({
  turns,
  template,
  client,
  onFollowUp,
  onRegenerate,
}) => {
  const seed = SEED[template.id];
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [turns.length]);

  const sugg =
    FOLLOW_UP_SUGGESTIONS[template.id] || [
      'Make it shorter',
      'Show after-tax return',
      'Compare to 60/40',
      'Project 5-year IRR',
    ];

  return (
    <div className="flex flex-1 min-h-0">
      <div ref={scrollRef} className="flex-1 overflow-y-auto scroll-thin">
        <div className="max-w-4xl mx-auto px-6 py-8">
          {turns.map((turn, i) => {
            if (turn.kind === 'user') {
              return (
                <UserTurn
                  key={turn.id}
                  text={turn.text}
                  contextChips={turn.chips}
                />
              );
            }
            if (turn.kind === 'ai-initial') {
              return (
                <div key={turn.id}>
                  <AITurnInitial
                    template={template}
                    client={client}
                    onBranch={onFollowUp}
                  />
                  {i < turns.length - 1 && <div className="thread-divider my-6" />}
                </div>
              );
            }
            if (turn.kind === 'ai-followup') {
              return (
                <div key={turn.id}>
                  <AITurnFollowUp intent={turn.intent} client={client} />
                  {i < turns.length - 1 && <div className="thread-divider my-6" />}
                </div>
              );
            }
            return null;
          })}
          <FollowUpBar suggestions={sugg} onSend={onFollowUp} />
        </div>
      </div>
      <RightRail seed={seed} client={client} onRefineAction={onFollowUp} />
    </div>
  );
};

export default ResultView;
