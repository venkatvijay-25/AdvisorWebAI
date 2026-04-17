/**
 * Follow-up intents: Pattern matching for refined answers
 * Each intent includes structured data for rich visual rendering
 */

import type { FollowUpIntent } from '@/types';
import { SRC } from './trust';

/**
 * After-tax return analysis
 */
const afterTaxIntent: FollowUpIntent = {
  id: 'after-tax',
  match: /after.?tax|tax.?adj|net of tax/i,
  label: 'After-tax return analysis',
  accent: '#EC4899',
  steps: ['Pulled tax lots and holding periods', 'Applied 37% federal + 5% state bracket', 'Normalized YTD net-of-tax'],
  summary: () => [
    { t: 'Net-of-tax YTD is ' },
    { t: '+6.1%', b: true },
    { t: ' (vs. gross +8.2%) after modelling short-term gains on the NVDA and MSFT trims. A TLH offset of ' },
    { t: '~$11K', b: true },
    { t: ' is available from the Apple lot, which would lift after-tax return to ' },
    { t: '+6.5%', b: true },
    { t: '.', cite: 1 },
  ],
  sources: [SRC.tax_engine, SRC.custodian],
  render: () => null,
  structured: () => ({
    headline: 'After-tax return is lower than gross — but a TLH opportunity can close the gap.',
    metrics: [
      { label: 'Gross YTD', value: '+8.2%', tone: 'positive' },
      { label: 'After-tax YTD', value: '+6.1%', tone: 'positive', cite: 1 },
      { label: 'Tax Drag', value: '-2.1%', tone: 'negative' },
      { label: 'TLH Offset Available', value: '~$11K', tone: 'positive' },
    ],
    details: [
      { icon: 'receipt', tone: 'negative', text: 'Short-term gains on NVDA and MSFT trims reduce net return by 2.1%', bold: '2.1%' },
      { icon: 'trendUp', tone: 'positive', text: 'Apple lot has $11K unrealized loss available for tax-loss harvesting', bold: '$11K' },
      { icon: 'checkCircle', tone: 'positive', text: 'Harvesting the AAPL lot would lift after-tax return to +6.5%', bold: '+6.5%' },
    ],
    actions: [
      { label: 'Harvest AAPL lot', description: 'Swap to MSFT to maintain sector exposure, save ~$4.1K in taxes', status: 'ready', icon: 'receipt' },
      { label: 'Tax impact report', description: 'Lot-level detail with cost basis and holding periods', status: 'ready', icon: 'brief' },
    ],
    footnote: 'Tax engine · 37% federal + 5% state · Net of fees',
  }),
};

/**
 * Comparison vs. 60/40 benchmark
 */
const compareBenchmarkIntent: FollowUpIntent = {
  id: 'compare-6040',
  match: /compare.*60.?40|60.?40|benchmark/i,
  label: 'Comparison vs. 60/40 benchmark',
  accent: '#2FA4F9',
  steps: ['Loaded 60/40 blended benchmark series', 'Aligned periods to portfolio', 'Computed excess return + tracking error'],
  summary: () => [
    { t: 'Over the last 12 months, the portfolio returned ' },
    { t: '+8.2%', b: true },
    { t: ' vs. ' },
    { t: '+6.4%', b: true },
    { t: ' for a simple 60/40 — ' },
    { t: '180bps', b: true },
    { t: ' of excess return with a tracking error of ' },
    { t: '3.1%', b: true },
    { t: '. Information ratio: 0.58.', cite: 1 },
  ],
  sources: [SRC.bench_6040, SRC.custodian],
  render: () => null,
  structured: () => ({
    headline: 'The portfolio outperforms a simple 60/40 by 180bps with a solid information ratio.',
    metrics: [
      { label: 'Portfolio YTD', value: '+8.2%', tone: 'positive' },
      { label: '60/40 Benchmark', value: '+6.4%', tone: 'neutral' },
      { label: 'Excess Return', value: '+180bps', tone: 'positive', cite: 1 },
      { label: 'Information Ratio', value: '0.58', tone: 'positive' },
    ],
    details: [
      { icon: 'trendUp', tone: 'positive', text: 'Equity overweight contributed +140bps of the excess via NVDA and MSFT', bold: '+140bps' },
      { icon: 'scale', tone: 'neutral', text: 'Tracking error of 3.1% is moderate — within risk budget', bold: '3.1%' },
      { icon: 'shield', tone: 'neutral', text: 'Max drawdown was -4.2% vs -5.1% for 60/40 — better downside protection', bold: '-4.2%' },
    ],
    footnote: 'Benchmark: 60% MSCI World + 40% Bloomberg Agg · 12-month trailing',
  }),
};

/**
 * 5-year IRR projection
 */
const projectIRRIntent: FollowUpIntent = {
  id: 'project-irr',
  match: /project|5.?year|irr|forecast/i,
  label: '5-year IRR projection',
  accent: '#7B5BFF',
  steps: ['Loaded capital-markets assumptions', 'Applied Monte Carlo (10,000 paths)', 'Pulled 5/50/95 percentile'],
  summary: () => [
    { t: 'Base-case 5-year annualized IRR is ' },
    { t: '+7.4%', b: true },
    { t: ' with a 5th/95th-percentile band of ' },
    { t: '+2.1% to +12.8%', b: true },
    { t: '. Under stress (2008-like), 5y IRR drops to +3.1%.', cite: 1 },
  ],
  sources: [SRC.risk_engine, SRC.model_bg],
  render: () => null,
  structured: () => ({
    headline: 'Monte Carlo projects a 7.4% annualized return with a wide but manageable range.',
    metrics: [
      { label: 'Base Case (50th)', value: '+7.4%', tone: 'positive', cite: 1 },
      { label: 'Upside (95th)', value: '+12.8%', tone: 'positive' },
      { label: 'Downside (5th)', value: '+2.1%', tone: 'warn' },
      { label: 'Stress (GFC)', value: '+3.1%', tone: 'negative' },
    ],
    details: [
      { icon: 'target', tone: 'positive', text: '10,000 Monte Carlo paths with current allocation and capital-market assumptions', bold: '10,000 Monte Carlo paths' },
      { icon: 'shield', tone: 'warn', text: 'Under a 2008-like stress, 5-year IRR still stays positive at +3.1%', bold: '+3.1%' },
      { icon: 'trendUp', tone: 'positive', text: 'Current allocation is expected to outperform the model benchmark over 5 years', bold: 'outperform' },
    ],
    footnote: 'Flyer Risk Engine · Capital-market assumptions as of Apr 2026 · 10,000 simulation paths',
  }),
};

/**
 * Hedging ideas for tech exposure
 */
const hedgeIntent: FollowUpIntent = {
  id: 'hedge',
  match: /hedge|protect|downside|tech.?exposure|insurance/i,
  label: 'Hedging ideas for tech exposure',
  accent: '#F97316',
  steps: ['Identified tech factor loadings', 'Modelled hedge payoff vs. cost', 'Ranked by cost-of-carry'],
  summary: () => [
    { t: 'Three hedges to consider against the 32% tech exposure: ' },
    { t: 'QQQ 3-month 5% OTM puts', b: true },
    { t: ' (cost ~0.9% of notional), a ' },
    { t: '10% sleeve into SPLV low-vol ETF', b: true },
    { t: ', or ' },
    { t: 'selling 2-week NVDA covered calls', b: true },
    { t: ' at 105 delta-neutral strike.', cite: 1 },
  ],
  sources: [SRC.risk_engine, SRC.compliance],
  render: () => null,
  structured: () => ({
    headline: 'Three hedge strategies ranked by cost-effectiveness for the 32% tech exposure.',
    metrics: [
      { label: 'Tech Exposure', value: '32%', tone: 'warn' },
      { label: 'Cheapest Hedge', value: '~0.9%', tone: 'neutral' },
      { label: 'Max Protection', value: '-15% floor', tone: 'positive' },
      { label: 'Options Available', value: '3', tone: 'neutral' },
    ],
    details: [
      { icon: 'shield', tone: 'positive', text: 'Option 1: QQQ 3-month 5% OTM puts — cost ~0.9% of notional, protects full tech sleeve', bold: 'QQQ 3-month 5% OTM puts' },
      { icon: 'scale', tone: 'neutral', text: 'Option 2: Rotate 10% into SPLV low-vol ETF — no cost, reduces beta by 0.15', bold: '10% into SPLV low-vol ETF' },
      { icon: 'receipt', tone: 'positive', text: 'Option 3: Sell 2-week NVDA covered calls at 105 strike — generates income, caps upside', bold: 'NVDA covered calls at 105 strike' },
    ],
    actions: [
      { label: 'Stage QQQ puts', description: 'Pre-checked for suitability — ready for OMS', status: 'ready', icon: 'shield' },
      { label: 'Compare payoff profiles', description: 'Side-by-side scenario analysis for all 3 strategies', status: 'ready', icon: 'bar' },
    ],
    footnote: 'Risk engine · Compliance ruleset Apr 2026 · Options pricing as of market close',
  }),
};

/**
 * Drafted client-ready email
 */
const emailIntent: FollowUpIntent = {
  id: 'email',
  match: /email|newsletter|client.?friendly|write|draft/i,
  label: 'Drafted client-ready email',
  accent: '#10B981',
  steps: ['Adopted client communication tone', 'Removed technical jargon', 'Added call-to-action'],
  summary: () => [
    { t: 'Drafted a client-ready version. Tone is friendly and jargon-free, with a clear CTA for a 20-minute review call.', cite: 1 },
  ],
  sources: [SRC.client_meta],
  render: () => null,
  structured: () => ({
    headline: 'Client-ready email drafted — friendly tone, no jargon, with a clear call to action.',
    metrics: [
      { label: 'Tone', value: 'Friendly', tone: 'positive' },
      { label: 'Reading Level', value: 'Grade 8', tone: 'positive' },
      { label: 'CTA', value: '20-min review', tone: 'neutral' },
      { label: 'Personalized', value: 'Yes', tone: 'positive' },
    ],
    details: [
      { icon: 'check', tone: 'positive', text: 'Jargon-free language — no "alpha", "drift", or "rebalance" in client-facing copy', bold: 'Jargon-free' },
      { icon: 'mail', tone: 'neutral', text: "Includes performance highlights and a brief mention of the rebalance recommendation" },
      { icon: 'calendar', tone: 'neutral', text: 'CTA links to your Calendly for a 20-minute Q2 review call', bold: '20-minute Q2 review' },
    ],
    actions: [
      { label: 'Preview email', description: 'Review the full draft before sending', status: 'ready', icon: 'mail' },
      { label: 'Send now', description: 'Deliver to client via connected email', status: 'pending', icon: 'send' },
    ],
  }),
};

/**
 * Short summary
 */
const shorterIntent: FollowUpIntent = {
  id: 'shorter',
  match: /shorter|brief|tl;?dr|summary|concise/i,
  label: 'Short summary',
  accent: '#94A3B8',
  steps: ['Condensed to 2 sentences'],
  summary: () => [
    { t: 'Portfolio is ' },
    { t: '+8.2% YTD', b: true },
    { t: ' (vs. +6.4% benchmark), driven by tech overweight. Recommend trimming NVDA/VTI and adding to BND to rebalance before the Q2 meeting.', cite: 1 },
  ],
  sources: [SRC.custodian, SRC.model_bg],
  render: () => null,
  structured: () => ({
    headline: 'Portfolio is beating benchmark — rebalance before Q2 meeting.',
    metrics: [
      { label: 'YTD', value: '+8.2%', tone: 'positive', cite: 1 },
      { label: 'vs Benchmark', value: '+1.8%', tone: 'positive' },
      { label: 'Action', value: 'Rebalance', tone: 'warn' },
    ],
    details: [
      { icon: 'trendUp', tone: 'positive', text: 'Tech overweight is the primary driver of outperformance', bold: 'Tech overweight' },
      { icon: 'scale', tone: 'warn', text: 'Trim NVDA/VTI, add to BND to reduce drift before Q2 review', bold: 'Trim NVDA/VTI, add to BND' },
    ],
  }),
};

/**
 * Scheduled a client meeting
 */
const scheduleIntent: FollowUpIntent = {
  id: 'schedule',
  match: /schedul|meeting|book|calendar|call|invite/i,
  label: 'Scheduled a client meeting',
  accent: '#2FA4F9',
  steps: ['Checked calendar availability', 'Reserved Zoom room', 'Sent invite with meeting brief attached'],
  summary: () => [
    { t: 'Found a 30-min slot on ' },
    { t: 'Thursday, Apr 23 · 2:30 PM IST', b: true },
    { t: '. Invite sent to Sarah Chen with the 1-page brief and attribution chart pre-attached.', cite: 1 },
  ],
  sources: [SRC.client_meta],
  render: () => null,
  structured: () => ({
    headline: 'Meeting scheduled and invite sent — brief and charts are pre-attached.',
    metrics: [
      { label: 'Date', value: 'Apr 23', tone: 'neutral' },
      { label: 'Time', value: '2:30 PM IST', tone: 'neutral' },
      { label: 'Duration', value: '30 min', tone: 'neutral' },
      { label: 'Channel', value: 'Zoom', tone: 'neutral' },
    ],
    details: [
      { icon: 'calendar', tone: 'positive', text: 'Found an open slot on Thursday, Apr 23 — no calendar conflicts', bold: 'Thursday, Apr 23' },
      { icon: 'mail', tone: 'positive', text: 'Calendar invite sent to Sarah Chen with Zoom link', bold: 'Sarah Chen' },
      { icon: 'brief', tone: 'positive', text: '1-page meeting brief and attribution chart pre-attached to the invite', bold: 'pre-attached' },
    ],
    actions: [
      { label: 'View calendar', description: 'Open the scheduled event in your calendar', status: 'done', icon: 'calendar' },
      { label: 'Edit brief', description: 'Customize the attached meeting brief before the call', status: 'ready', icon: 'edit' },
    ],
  }),
};

/**
 * Book-wide comparison
 */
const compareClientsIntent: FollowUpIntent = {
  id: 'compare-clients',
  match: /compare.*client|across.*client|all.*clients|book.?wide/i,
  label: 'Book-wide comparison',
  accent: '#0EA5E9',
  steps: ['Loaded all 6 client portfolios', 'Normalized to comparable basis', 'Identified similar patterns and outliers'],
  summary: () => [
    { t: 'Across your 6 clients, ' },
    { t: '4 of 6', b: true },
    { t: ' show the same overweight pattern in US tech. ' },
    { t: 'Marcus Reid and Priya Nair', b: true },
    { t: ' are the largest outliers — both need a similar trim. One trade list can be staged for all 4.', cite: 1 },
  ],
  sources: [SRC.custodian, SRC.model_bg],
  render: () => null,
  structured: () => ({
    headline: '4 of 6 clients share the same tech overweight — a single batch rebalance can fix all of them.',
    metrics: [
      { label: 'Pattern Match', value: '4 of 6', tone: 'warn', cite: 1 },
      { label: 'Largest Outlier', value: 'Marcus Reid', tone: 'warn' },
      { label: 'Batch Trades', value: '1 list', tone: 'positive' },
      { label: 'Est. Time', value: '~8 min', tone: 'positive' },
    ],
    details: [
      { icon: 'users', tone: 'warn', text: 'Marcus Reid and Priya Nair are the largest outliers — both need a similar trim', bold: 'Marcus Reid and Priya Nair' },
      { icon: 'scale', tone: 'neutral', text: 'Sarah Chen and Rohan Mehta also overweight but within tolerance', bold: 'within tolerance' },
      { icon: 'checkCircle', tone: 'positive', text: 'One standardized trade list works for all 4 — stage as a batch', bold: 'stage as a batch' },
    ],
    actions: [
      { label: 'Open batch rebalance', description: 'Stage the same trim for all 4 clients at once', status: 'ready', icon: 'layers' },
      { label: 'Per-client breakdown', description: 'View individual drift and trade details', status: 'ready', icon: 'users' },
    ],
  }),
};

/**
 * Custom scenario analysis
 */
const scenarioIntent: FollowUpIntent = {
  id: 'scenario',
  match: /what.?if|scenario|rate.?fall|rate.?rise|bps|inflation/i,
  label: 'Custom scenario',
  accent: '#8B5CF6',
  steps: ['Parsed the scenario', 'Shocked the yield curve', 'Re-priced all holdings', 'Recomputed P&L'],
  summary: () => [
    { t: 'If rates fall 50bps parallel, the portfolio gains ' },
    { t: '+1.4%', b: true },
    { t: ' primarily from duration in BND. Equity book is roughly neutral. If rates rise 50bps instead, the portfolio loses ' },
    { t: '−1.1%', b: true },
    { t: '.', cite: 1 },
  ],
  sources: [SRC.risk_engine, SRC.custodian],
  render: () => null,
  structured: () => ({
    headline: 'Rate move scenario: the portfolio is mildly rate-sensitive — BND drives most of the impact.',
    metrics: [
      { label: 'Rates -50bps', value: '+1.4%', tone: 'positive', cite: 1 },
      { label: 'Rates +50bps', value: '-1.1%', tone: 'negative' },
      { label: 'Main Driver', value: 'BND duration', tone: 'neutral' },
      { label: 'Equity Impact', value: '~Neutral', tone: 'neutral' },
    ],
    details: [
      { icon: 'trendUp', tone: 'positive', text: 'In a -50bps scenario, BND gains +2.8% — offsets minor equity drag', bold: 'BND gains +2.8%' },
      { icon: 'trendDown', tone: 'negative', text: 'In a +50bps scenario, BND falls -2.1% and drags portfolio by -1.1%', bold: '-1.1%' },
      { icon: 'shield', tone: 'neutral', text: 'Equity book is roughly rate-neutral — tech names have low duration sensitivity', bold: 'rate-neutral' },
    ],
    actions: [
      { label: 'Run more scenarios', description: 'Test inflation, recession, or custom shocks', status: 'ready', icon: 'beaker' },
      { label: 'Adjust duration', description: 'Trade ideas to reduce rate sensitivity if needed', status: 'ready', icon: 'scale' },
    ],
    footnote: 'Flyer Risk Engine · Parallel yield curve shock · All holdings re-priced',
  }),
};

/**
 * ESG / sustainability snapshot
 */
const esgIntent: FollowUpIntent = {
  id: 'esg',
  match: /esg|sustainab|carbon|climate|green/i,
  label: 'ESG / sustainability snapshot',
  accent: '#10B981',
  steps: ['Pulled ESG ratings from MSCI', 'Computed weighted-average carbon intensity', 'Flagged exclusions'],
  summary: () => [
    { t: 'Weighted-average ESG score is ' },
    { t: 'AA (MSCI)', b: true },
    { t: " — above the benchmark's A. Carbon intensity is " },
    { t: '42 tCO₂e/$M', b: true },
    { t: ', roughly 30% below the S&P 500.', cite: 1 },
  ],
  sources: [SRC.custodian],
  render: () => null,
  structured: () => ({
    headline: 'ESG profile is strong — above-benchmark ratings and 30% lower carbon intensity.',
    metrics: [
      { label: 'ESG Score', value: 'AA', tone: 'positive', cite: 1 },
      { label: 'Benchmark Score', value: 'A', tone: 'neutral' },
      { label: 'Carbon Intensity', value: '42 tCO₂e/$M', tone: 'positive' },
      { label: 'vs S&P 500', value: '-30%', tone: 'positive' },
    ],
    details: [
      { icon: 'trendUp', tone: 'positive', text: 'Weighted-average ESG rating of AA (MSCI) outperforms the benchmark A', bold: 'AA (MSCI)' },
      { icon: 'globe', tone: 'positive', text: 'Carbon intensity is 42 tCO₂e per $M revenue — 30% below the S&P 500', bold: '30% below' },
      { icon: 'checkCircle', tone: 'positive', text: 'No flagged exclusions — portfolio is clean on controversial weapons, tobacco, thermal coal', bold: 'No flagged exclusions' },
    ],
    actions: [
      { label: 'ESG detail report', description: 'Per-holding ESG ratings and controversy flags', status: 'ready', icon: 'brief' },
      { label: 'Improve ESG score', description: 'Swap suggestions to move from AA to AAA', status: 'ready', icon: 'globe' },
    ],
    footnote: 'MSCI ESG Ratings · Carbon data via S&P Trucost · As of Apr 2026',
  }),
};

/**
 * Export to CRM
 */
const exportCRMIntent: FollowUpIntent = {
  id: 'export-crm',
  match: /export|crm|salesforce|save.?to|send.?to/i,
  label: 'Exported to CRM',
  accent: '#EA580C',
  steps: ['Mapped fields to Salesforce objects', 'Pushed activity + attached artifacts', 'Stamped audit-trail link'],
  summary: () => [
    { t: 'Pushed this conversation to ' },
    { t: 'Salesforce', b: true },
    { t: " as an Activity on the client's account. All artifacts and the full audit trail are linked.", cite: 1 },
  ],
  sources: [SRC.client_meta],
  render: () => null,
  structured: () => ({
    headline: 'Conversation exported to Salesforce — activity logged and artifacts attached.',
    metrics: [
      { label: 'Destination', value: 'Salesforce', tone: 'positive', cite: 1 },
      { label: 'Record Type', value: 'Activity', tone: 'neutral' },
      { label: 'Artifacts', value: '3 files', tone: 'positive' },
      { label: 'Audit Trail', value: 'Linked', tone: 'positive' },
    ],
    details: [
      { icon: 'database', tone: 'positive', text: 'Activity created on the client account with full conversation context', bold: 'Activity created' },
      { icon: 'brief', tone: 'positive', text: 'All generated artifacts (briefs, charts, trade lists) attached to the record', bold: 'artifacts attached' },
      { icon: 'lock', tone: 'positive', text: 'Audit trail link stamped — compliance can trace every step', bold: 'Audit trail' },
    ],
    actions: [
      { label: 'Open in Salesforce', description: 'View the activity record in your CRM', status: 'done', icon: 'database' },
      { label: 'Share with team', description: 'Notify teammates about this export', status: 'ready', icon: 'users' },
    ],
  }),
};

/**
 * All follow-up intents
 */
export const FOLLOW_UP_INTENTS: FollowUpIntent[] = [
  afterTaxIntent,
  compareBenchmarkIntent,
  projectIRRIntent,
  hedgeIntent,
  emailIntent,
  shorterIntent,
  scheduleIntent,
  compareClientsIntent,
  scenarioIntent,
  esgIntent,
  exportCRMIntent,
];

/**
 * Resolve a user's follow-up text to the matching intent
 * Returns the matching intent, or a generic fallback
 */
export const resolveFollowUp = (text: string): FollowUpIntent => {
  for (const intent of FOLLOW_UP_INTENTS) {
    if (intent.match.test(text)) {
      return intent;
    }
  }

  // Generic fallback
  return {
    id: 'generic',
    label: 'Refined answer',
    accent: '#2FA4F9',
    match: /.*/,
    steps: ['Parsed your follow-up', 'Retrieved relevant context', 'Composed refined answer'],
    summary: () => [
      { t: "Here's what I found for " },
      { t: `"${text}"`, b: true },
      { t: ". Based on the context of this conversation, I've pulled the relevant holdings, computed the relevant numbers, and composed a short answer below.", cite: 1 },
    ],
    sources: [SRC.custodian],
    render: () => null,
    structured: () => ({
      headline: `Here's a refined answer based on your follow-up: "${text}"`,
      metrics: [
        { label: 'Query', value: text.slice(0, 20) + (text.length > 20 ? '…' : ''), tone: 'neutral' },
        { label: 'Sources Used', value: '3', tone: 'neutral', cite: 1 },
        { label: 'Confidence', value: 'High', tone: 'positive' },
      ],
      details: [
        { icon: 'search', tone: 'neutral', text: 'Retrieved relevant holdings and market data for your query' },
        { icon: 'brain', tone: 'neutral', text: 'Computed relevant numbers using conversation context and latest data' },
        { icon: 'checkCircle', tone: 'positive', text: 'Answer is cross-referenced with custodian data for accuracy', bold: 'cross-referenced' },
      ],
    }),
  };
};
