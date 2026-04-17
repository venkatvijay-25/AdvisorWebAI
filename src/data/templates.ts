/**
 * Templates, history, suggestions, and insights
 * The action templates that advisors can use to generate advice
 */

import type { Template, HistoryItem, Suggestion, Insight } from '@/types';

/**
 * Action templates for generating advice
 * Each template represents a major use case (portfolio review, rebalance, risk analysis, etc.)
 */
export const TEMPLATES: Template[] = [
  {
    id: 'review',
    icon: 'brief',
    title: 'Portfolio review & meeting brief',
    hint: "Summarize a client's portfolio, drift, and generate talking points",
    accent: '#2FA4F9',
    sample: "Review Sarah Chen's portfolio and prepare a Q2 meeting brief",
  },
  {
    id: 'rebalance',
    icon: 'scale',
    title: 'Rebalance & trade ideas',
    hint: 'Suggest rebalancing trades vs. the model portfolio with rationale',
    accent: '#7B5BFF',
    sample: 'Rebalance Sarah Chen toward the Balanced Growth model',
  },
  {
    id: 'risk',
    icon: 'shield',
    title: 'Risk, exposure & stress tests',
    hint: 'Concentration, sector/geo exposure, scenario analysis',
    accent: '#F97316',
    sample: 'Run a full risk and stress test on my entire book',
  },
  {
    id: 'news',
    icon: 'newspaper',
    title: 'Market & news impact on my book',
    hint: 'News, events, and which clients are most affected today',
    accent: '#10B981',
    sample: "What's moving today and which clients are affected?",
  },
  {
    id: 'tax',
    icon: 'receipt',
    title: 'Tax-loss harvesting opportunities',
    hint: 'Find lots with unrealized losses and wash-sale-safe swaps',
    accent: '#EC4899',
    sample: 'Find tax-loss harvesting opportunities across my book before Apr 15',
  },
  {
    id: 'proposal',
    icon: 'briefcase',
    title: 'Prospect proposal & IPS draft',
    hint: 'Build a tailored proposal deck or Investment Policy Statement',
    accent: '#0EA5E9',
    sample: 'Draft an IPS for new prospect Aarav Singh, $3M, Moderate risk',
  },
];

/**
 * Historical actions the advisor has taken
 */
export const HISTORY_ITEMS: HistoryItem[] = [
  {
    id: 'h1',
    when: 'Today, 9:42 AM',
    title: "Review Sarah Chen's portfolio for Q2",
    template: 'review',
    client: 'Sarah Chen',
  },
  {
    id: 'h2',
    when: 'Today, 8:11 AM',
    title: "What's moving today across my book?",
    template: 'news',
    client: null,
  },
  {
    id: 'h3',
    when: 'Yesterday, 4:30 PM',
    title: 'Stress test Marcus Reid for a tech drawdown',
    template: 'risk',
    client: 'Marcus Reid',
  },
  {
    id: 'h4',
    when: 'Yesterday, 11:02 AM',
    title: 'TLH ideas for top 10 clients before Apr 15',
    template: 'tax',
    client: null,
  },
  {
    id: 'h5',
    when: 'Mon, Apr 13',
    title: 'Rebalance Lin Zhao to Endowment Growth model',
    template: 'rebalance',
    client: 'Lin Zhao',
  },
  {
    id: 'h6',
    when: 'Mon, Apr 13',
    title: 'Draft IPS for new prospect Aarav Singh',
    template: 'proposal',
    client: null,
  },
  {
    id: 'h7',
    when: 'Fri, Apr 10',
    title: 'Why is Anika Patel underperforming benchmark?',
    template: 'review',
    client: 'Anika Patel',
  },
];

/**
 * Suggested queries / actions for the advisor
 */
export const SUGGESTIONS = [
  'Compare YTD performance across all UHNI clients',
  'Which holdings exceed 5% concentration in any client?',
  'Draft a market commentary email for this week',
  'Find clients underweight on fixed income vs target',
];

/**
 * Key insights / alerts to surface
 */
export const INSIGHTS: Insight[] = [
  {
    tone: 'warn',
    icon: 'alert',
    title: 'Marcus Reid is 11.2% drifted from model',
    body: 'NVDA & AAPL overweight after Q1 rally. Consider partial rebalance.',
    cta: 'Open rebalance',
  },
  {
    tone: 'info',
    icon: 'zap',
    title: 'TLH window: 4 days to Apr 15',
    body: '$48K of harvestable losses across 7 clients. Net est. tax savings ~$17.8K.',
    cta: 'Review opportunities',
  },
  {
    tone: 'success',
    icon: 'trendUp',
    title: '6 clients beat their benchmark YTD',
    body: 'Lin Zhao leads at +11.8% vs +8.6% (Endowment Growth blend).',
    cta: 'Generate client emails',
  },
];
