import React, { useState } from 'react';
import { IconRefresh, IconSparkles, IconChevronRight, IconChevronDown, IconX } from '@/components/icons';
import { iconMap } from '@/components/icons';
import { Button, Card, Badge, KPI } from '@/components/ui';

/* ── Types ─────────────────────────────────────────── */

type InsightTone = 'warn' | 'info' | 'success' | 'critical';
type InsightCategory = 'Portfolio' | 'Risk' | 'Tax' | 'Market' | 'Compliance' | 'Performance';
type DateRange = '7D' | '30D' | '90D' | 'YTD';

interface AffectedClient {
  name: string;
  impact: string;
}

interface InsightDrilldown {
  analysis: string[];
  clients: AffectedClient[];
  recommendations: string[];
  trend: string;
}

interface InsightItem {
  id: string;
  tone: InsightTone;
  icon: string;
  category: InsightCategory;
  title: string;
  body: string;
  cta: string;
  affectedClients: string[];
  timestamp: string;
  drilldown: InsightDrilldown;
}

/* ── Tone styles ───────────────────────────────────── */

const toneStyles: Record<InsightTone, { bar: string; bg: string; text: string }> = {
  warn:     { bar: '#F59E0B', bg: 'bg-amber-50',   text: 'text-amber-700' },
  info:     { bar: '#2FA4F9', bg: 'bg-brand-50',   text: 'text-brand-700' },
  success:  { bar: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700' },
  critical: { bar: '#EF4444', bg: 'bg-rose-50',    text: 'text-rose-700' },
};

const toneBadge: Record<InsightTone, 'warn' | 'brand' | 'success' | 'danger'> = {
  warn: 'warn',
  info: 'brand',
  success: 'success',
  critical: 'danger',
};

const categoryBadgeTone: Record<InsightCategory, 'neutral' | 'brand' | 'success' | 'warn' | 'danger' | 'purple' | 'muted'> = {
  Portfolio: 'brand',
  Risk: 'warn',
  Tax: 'purple',
  Market: 'success',
  Compliance: 'danger',
  Performance: 'neutral',
};

/* ── Insights data ─────────────────────────────────── */

const ALL_INSIGHTS: InsightItem[] = [
  {
    id: 'ins-1',
    tone: 'warn',
    icon: 'alert',
    category: 'Portfolio',
    title: 'Marcus Reid is 11.2% drifted from model',
    body: 'NVDA & AAPL overweight after Q1 rally. Consider partial rebalance to bring the Balanced Growth allocation back within policy limits.',
    cta: 'Open rebalance',
    affectedClients: ['Marcus Reid'],
    timestamp: '12 min ago',
    drilldown: {
      analysis: [
        'Marcus Reid\'s portfolio has drifted 11.2% from the Balanced Growth target allocation, primarily driven by outsized gains in NVDA (+42% YTD) and AAPL (+18% YTD). The technology sector now represents 38% of the portfolio, well above the 25% target.',
        'The drift has been accelerating since mid-February when tech earnings exceeded expectations. If left uncorrected, the portfolio\'s risk profile shifts from Moderate to Moderate-Aggressive, which is inconsistent with Marcus\'s IPS.',
        'A partial rebalance trimming $180K from tech positions and redistributing to fixed income and international equities would bring drift below the 5% threshold while preserving most of the momentum exposure.',
      ],
      clients: [
        { name: 'Marcus Reid', impact: '11.2% drift, $180K rebalance needed' },
      ],
      recommendations: [
        'Trim NVDA by $95K and AAPL by $85K in taxable account',
        'Reallocate proceeds: 60% to AGG (fixed income), 40% to VXUS (international)',
        'Schedule a call with Marcus to discuss rebalance rationale before executing',
      ],
      trend: 'Drift has increased steadily from 4.8% (30 days ago) to 8.1% (60 days ago baseline was 3.2%). Without intervention, projected drift will exceed 15% within 2 weeks based on current momentum.',
    },
  },
  {
    id: 'ins-2',
    tone: 'info',
    icon: 'zap',
    category: 'Tax',
    title: 'TLH window: 4 days to Apr 15',
    body: '$48K of harvestable losses across 7 clients. Net estimated tax savings approximately $17.8K. Action required before deadline.',
    cta: 'Review opportunities',
    affectedClients: ['Sarah Chen', 'Marcus Reid', 'Lin Zhao', 'James Okafor', 'Emily Duval', 'Raj Patel', 'Priya Anand'],
    timestamp: '25 min ago',
    drilldown: {
      analysis: [
        'Across your book, seven clients have unrealized losses totaling $48K that qualify for tax-loss harvesting before the April 15 deadline. The largest opportunities are in small-cap value (SCZ, $14K) and emerging markets (EEM, $11K).',
        'All identified lots have been held for at least 31 days and have no wash-sale concerns with existing positions. Replacement securities have been pre-screened for tracking error below 1.5%.',
        'If all harvests are executed, the estimated net tax savings across these seven clients is $17.8K, assuming a blended marginal tax rate of 37%.',
      ],
      clients: [
        { name: 'Sarah Chen', impact: '$8.2K harvestable, ~$3K tax savings' },
        { name: 'Marcus Reid', impact: '$7.1K harvestable, ~$2.6K tax savings' },
        { name: 'Lin Zhao', impact: '$9.4K harvestable, ~$3.5K tax savings' },
        { name: 'James Okafor', impact: '$6.8K harvestable, ~$2.5K tax savings' },
        { name: 'Emily Duval', impact: '$5.5K harvestable, ~$2K tax savings' },
        { name: 'Raj Patel', impact: '$6.2K harvestable, ~$2.3K tax savings' },
        { name: 'Priya Anand', impact: '$4.8K harvestable, ~$1.8K tax savings' },
      ],
      recommendations: [
        'Prioritize the three largest opportunities (Lin Zhao, Sarah Chen, Marcus Reid) for immediate execution',
        'Use SCHA as replacement for SCZ positions and VWO as replacement for EEM positions',
        'Send batch notification to all seven clients explaining the tax benefit and requesting same-day approval',
      ],
      trend: 'Harvestable losses have increased 22% over the past 30 days due to small-cap underperformance. At 60 days ago, total harvestable losses were $31K. The window is closing as markets recover.',
    },
  },
  {
    id: 'ins-3',
    tone: 'success',
    icon: 'trendUp',
    category: 'Performance',
    title: '6 clients beat their benchmark YTD',
    body: 'Lin Zhao leads at +11.8% vs +8.6% (Endowment Growth blend). Strong outperformance driven by quality factor tilt and alternatives allocation.',
    cta: 'Generate client emails',
    affectedClients: ['Lin Zhao', 'Sarah Chen', 'Emily Duval', 'James Okafor', 'Priya Anand', 'Raj Patel'],
    timestamp: '1 hr ago',
    drilldown: {
      analysis: [
        'Six of your twelve clients are outperforming their respective benchmarks year-to-date. The average alpha across these six is +2.4%, with Lin Zhao\'s Endowment Growth portfolio leading at +3.2% alpha.',
        'The primary drivers of outperformance are the quality factor tilt introduced in Q4 2025 and the 8% allocation to liquid alternatives (managed futures) that has provided uncorrelated returns during the recent equity volatility.',
        'This is an excellent opportunity to reinforce client confidence and deepen relationships. Proactive communication about positive performance has been shown to increase retention by 23%.',
      ],
      clients: [
        { name: 'Lin Zhao', impact: '+11.8% vs +8.6% benchmark (+3.2% alpha)' },
        { name: 'Sarah Chen', impact: '+8.2% vs +6.4% benchmark (+1.8% alpha)' },
        { name: 'Emily Duval', impact: '+7.9% vs +5.8% benchmark (+2.1% alpha)' },
        { name: 'James Okafor', impact: '+9.1% vs +7.2% benchmark (+1.9% alpha)' },
        { name: 'Priya Anand', impact: '+6.8% vs +4.5% benchmark (+2.3% alpha)' },
        { name: 'Raj Patel', impact: '+10.2% vs +7.8% benchmark (+2.4% alpha)' },
      ],
      recommendations: [
        'Send personalized performance update emails to each client highlighting their specific alpha generation',
        'Schedule Q2 review calls with top performers to discuss locking in gains and adjusting allocations',
        'Use Lin Zhao\'s portfolio as a case study for prospect presentations',
      ],
      trend: 'Outperformance count has grown from 3 clients (90 days ago) to 4 (60 days ago) to 6 today. The quality factor tilt has been the primary contributor, adding an average of 1.8% since implementation.',
    },
  },
  {
    id: 'ins-4',
    tone: 'warn',
    icon: 'receipt',
    category: 'Portfolio',
    title: 'Fee drag analysis: 3 clients paying above-median fees',
    body: 'Three client accounts have expense ratios 15-22 bps above category median. Switching to institutional share classes could save $8.4K annually.',
    cta: 'Review fee analysis',
    affectedClients: ['Marcus Reid', 'James Okafor', 'Emily Duval'],
    timestamp: '2 hr ago',
    drilldown: {
      analysis: [
        'A systematic fee analysis across your book has identified three client accounts where the weighted average expense ratio is 15-22 basis points above the category median. This is primarily due to legacy retail share class holdings that qualify for institutional pricing.',
        'Marcus Reid\'s account has the largest impact at $3.8K in excess annual fees, driven by two actively managed mutual funds (ABNDX and PIMIX) that have institutional equivalents with identical strategies but lower expense ratios.',
        'Converting these positions to institutional share classes requires no change in investment strategy, tax impact, or risk profile. It is purely a cost-reduction exercise.',
      ],
      clients: [
        { name: 'Marcus Reid', impact: '$3.8K/yr excess fees, 22 bps above median' },
        { name: 'James Okafor', impact: '$2.6K/yr excess fees, 18 bps above median' },
        { name: 'Emily Duval', impact: '$2.0K/yr excess fees, 15 bps above median' },
      ],
      recommendations: [
        'Convert Marcus Reid\'s ABNDX to ABNFX (institutional class) and PIMIX to PTTRX',
        'Submit share class conversion requests for James Okafor and Emily Duval',
        'Document fee savings in each client\'s annual review as a tangible value-add',
      ],
      trend: 'This analysis was first flagged 60 days ago with 2 clients. A third client (Emily Duval) crossed the threshold 15 days ago after a new position was added in a retail share class.',
    },
  },
  {
    id: 'ins-5',
    tone: 'info',
    icon: 'bar',
    category: 'Performance',
    title: 'Performance attribution: Tech sector contributed 62% of YTD gains',
    body: 'Technology holdings across your book contributed 62% of total year-to-date returns. Concentration risk may warrant attention for diversification.',
    cta: 'View attribution',
    affectedClients: ['Sarah Chen', 'Marcus Reid', 'Lin Zhao', 'Raj Patel'],
    timestamp: '3 hr ago',
    drilldown: {
      analysis: [
        'A book-wide performance attribution analysis reveals that technology sector holdings have contributed 62% of aggregate YTD gains. This is the highest single-sector contribution in the past three years and represents a significant concentration of return sources.',
        'The top contributors are NVDA (+42% YTD, 18% of total book gains), MSFT (+15% YTD, 12% of gains), AAPL (+18% YTD, 11% of gains), and GOOGL (+22% YTD, 9% of gains). Semiconductor and AI-related names are disproportionately represented.',
        'While this has been beneficial in the current environment, historical analysis suggests that sectors contributing more than 50% of returns in a given period tend to mean-revert. The current situation warrants a tactical discussion about taking partial profits.',
      ],
      clients: [
        { name: 'Sarah Chen', impact: 'Tech = 58% of YTD gains, NVDA largest contributor' },
        { name: 'Marcus Reid', impact: 'Tech = 71% of YTD gains, highest concentration' },
        { name: 'Lin Zhao', impact: 'Tech = 49% of YTD gains, well diversified' },
        { name: 'Raj Patel', impact: 'Tech = 65% of YTD gains, MSFT/GOOGL driven' },
      ],
      recommendations: [
        'Review each client\'s tech allocation relative to their IPS limits and risk tolerance',
        'Consider tactical profit-taking in NVDA for clients where it exceeds 8% of portfolio',
        'Reallocate partial proceeds to healthcare and industrials, which are showing early momentum',
      ],
      trend: 'Tech sector contribution has risen from 38% (90 days ago) to 51% (60 days ago) to 62% today. This is the fastest acceleration since the 2024 AI rally.',
    },
  },
  {
    id: 'ins-6',
    tone: 'warn',
    icon: 'shield',
    category: 'Risk',
    title: 'Sector concentration risk: 4 clients >30% tech exposure',
    body: 'Four clients exceed the 30% technology sector concentration threshold. IPS policy limits are 35% for three of these clients.',
    cta: 'Review exposure',
    affectedClients: ['Marcus Reid', 'Sarah Chen', 'Raj Patel', 'Priya Anand'],
    timestamp: '3 hr ago',
    drilldown: {
      analysis: [
        'Four clients currently have technology sector exposure exceeding 30%, which is the internal monitoring threshold. Marcus Reid is the most concentrated at 38%, just 3% below his IPS hard limit of 41%. Sarah Chen is at 33%, Raj Patel at 35%, and Priya Anand at 31%.',
        'The concentration has built up gradually through price appreciation rather than new purchases. All four clients were within policy limits at their last quarterly reviews, but market movements have pushed allocations higher.',
        'If the tech sector experiences a 10% correction, these four clients would see outsized drawdowns of 1.2-1.8% more than a benchmark-weighted portfolio. A 20% correction would trigger IPS breach notifications for Marcus Reid.',
      ],
      clients: [
        { name: 'Marcus Reid', impact: '38% tech exposure, IPS limit 41%, 3% buffer' },
        { name: 'Raj Patel', impact: '35% tech exposure, IPS limit 40%, 5% buffer' },
        { name: 'Sarah Chen', impact: '33% tech exposure, IPS limit 35%, 2% buffer' },
        { name: 'Priya Anand', impact: '31% tech exposure, IPS limit 38%, 7% buffer' },
      ],
      recommendations: [
        'Trim Sarah Chen\'s tech allocation by 3% ($126K) given her tight 2% buffer to IPS limit',
        'Set automated alerts at 36% for Marcus Reid to prevent IPS breach',
        'Discuss sector concentration with all four clients at their next scheduled touchpoint',
      ],
      trend: 'Average tech exposure for these clients has increased from 26% (90 days ago) to 30% (60 days ago) to 34% today. If current trends continue, Marcus Reid will breach his IPS limit within 3 weeks.',
    },
  },
  {
    id: 'ins-7',
    tone: 'success',
    icon: 'trendUp',
    category: 'Market',
    title: 'Fixed income opportunity: Rising yields favor duration extension',
    body: '10Y Treasury at 4.8%, highest since 2023. Extending duration on short-dated holdings could lock in attractive yields for conservative clients.',
    cta: 'Explore opportunity',
    affectedClients: ['Emily Duval', 'James Okafor', 'Priya Anand'],
    timestamp: '4 hr ago',
    drilldown: {
      analysis: [
        'The 10-year Treasury yield has risen to 4.8%, the highest level since October 2023. The yield curve has steepened significantly, with the 2s10s spread now at +45 bps after being inverted for most of 2025. This presents an attractive entry point for extending duration.',
        'Three conservative-profile clients (Emily Duval, James Okafor, Priya Anand) have significant allocations to short-duration instruments (T-bills, money market, 1-3 year treasuries) that are yielding 4.2-4.5%. Extending to intermediate duration (5-7 year) would capture an additional 40-60 bps of yield.',
        'The risk/reward is favorable: if rates rise another 50 bps, the mark-to-market loss on a 5-year duration extension would be recovered through the higher coupon within 18 months. If rates decline, these clients would benefit from both the coupon and price appreciation.',
      ],
      clients: [
        { name: 'Emily Duval', impact: '$1.2M in short-duration, potential $6K/yr additional income' },
        { name: 'James Okafor', impact: '$890K in short-duration, potential $4.5K/yr additional income' },
        { name: 'Priya Anand', impact: '$650K in short-duration, potential $3.2K/yr additional income' },
      ],
      recommendations: [
        'Ladder $500K of Emily Duval\'s T-bill maturities into 5Y and 7Y treasuries over the next 2 weeks',
        'For James Okafor, consider VCIT (intermediate corporate) for additional credit spread pickup',
        'Present a duration extension proposal at each client\'s next review with scenario analysis',
      ],
      trend: 'The 10Y yield has risen from 4.1% (90 days ago) to 4.5% (60 days ago) to 4.8% today. Duration extension opportunities have been on our watchlist since yields crossed 4.5% (45 days ago).',
    },
  },
  {
    id: 'ins-8',
    tone: 'warn',
    icon: 'shield',
    category: 'Compliance',
    title: 'Compliance: 2 accounts approaching position limits',
    body: 'Two accounts are within 5% of their maximum position concentration limits. Automated alerts have been set, but manual review is recommended.',
    cta: 'Review limits',
    affectedClients: ['Marcus Reid', 'Sarah Chen'],
    timestamp: '5 hr ago',
    drilldown: {
      analysis: [
        'Two client accounts are approaching their maximum single-position concentration limits as defined in their Investment Policy Statements. Marcus Reid\'s NVDA position is at 9.2% of his portfolio (limit: 10%), and Sarah Chen\'s MSFT position is at 8.8% of her portfolio (limit: 10%).',
        'Both positions have grown through price appreciation rather than additional purchases. The automated monitoring system has flagged these as "amber" status, meaning they are within the 5% warning zone of their respective limits.',
        'If either position breaches the limit, a compliance notification must be filed within 48 hours and a remediation plan submitted within 5 business days per firm policy.',
      ],
      clients: [
        { name: 'Marcus Reid', impact: 'NVDA at 9.2% of portfolio, 10% limit, 0.8% buffer' },
        { name: 'Sarah Chen', impact: 'MSFT at 8.8% of portfolio, 10% limit, 1.2% buffer' },
      ],
      recommendations: [
        'Trim Marcus Reid\'s NVDA position by $38K to create a 2% buffer below the limit',
        'Set a limit order to trim Sarah Chen\'s MSFT if it appreciates another 5%',
        'Document the monitoring actions taken in the compliance log for audit trail',
      ],
      trend: 'Marcus Reid\'s NVDA concentration has grown from 6.5% (90 days ago) to 8.1% (60 days ago) to 9.2% today. Sarah Chen\'s MSFT has grown from 7.2% to 8.0% to 8.8% over the same period.',
    },
  },
  {
    id: 'ins-9',
    tone: 'info',
    icon: 'receipt',
    category: 'Portfolio',
    title: 'Dividend reinvestment: $12K uncaptured across 3 accounts',
    body: 'Three accounts have accumulated cash from dividend payments that has not been reinvested. Total idle cash: $12K over the past 45 days.',
    cta: 'Set up DRIP',
    affectedClients: ['Emily Duval', 'James Okafor', 'Priya Anand'],
    timestamp: '6 hr ago',
    drilldown: {
      analysis: [
        'Three client accounts have accumulated $12K in uninvested dividend income over the past 45 days. These accounts do not have automatic dividend reinvestment (DRIP) enabled, and the cash has been sitting idle in money market sweeps.',
        'Emily Duval\'s account has $5.2K in accumulated dividends from her equity income positions (VYM, SCHD, JNJ). James Okafor has $4.1K from his balanced portfolio dividends. Priya Anand has $2.7K from her conservative allocation.',
        'At current money market rates of 4.3%, this cash is earning approximately $1.40/day. If reinvested in their target allocations, the expected return differential is approximately 4-6% annually, representing $480-720 in opportunity cost.',
      ],
      clients: [
        { name: 'Emily Duval', impact: '$5.2K idle dividends, ~$260/yr opportunity cost' },
        { name: 'James Okafor', impact: '$4.1K idle dividends, ~$205/yr opportunity cost' },
        { name: 'Priya Anand', impact: '$2.7K idle dividends, ~$135/yr opportunity cost' },
      ],
      recommendations: [
        'Enable automatic DRIP for all three accounts to prevent future accumulation',
        'Invest the current $12K idle cash into each client\'s target allocation',
        'Review all other accounts in the book for DRIP enrollment status',
      ],
      trend: 'Idle dividend cash has grown from $3.2K (60 days ago) to $7.8K (30 days ago) to $12K today. The accumulation rate has increased due to higher dividend payouts in Q1.',
    },
  },
  {
    id: 'ins-10',
    tone: 'success',
    icon: 'compass',
    category: 'Performance',
    title: 'ESG score improvement: Lin Zhao portfolio up 8 points',
    body: 'Lin Zhao\'s portfolio ESG score improved from 72 to 80 after Q1 rebalance. Now in the top quartile of comparable portfolios at the firm.',
    cta: 'View ESG report',
    affectedClients: ['Lin Zhao'],
    timestamp: '8 hr ago',
    drilldown: {
      analysis: [
        'Lin Zhao\'s portfolio ESG composite score has improved from 72 to 80 (out of 100) following the Q1 rebalance that reduced exposure to three lower-rated holdings (XOM, CVX, MPC) and increased allocation to higher-rated alternatives (NEE, ENPH, FSLR).',
        'The improvement places Lin Zhao\'s portfolio in the top quartile (P78) of comparable Endowment Growth portfolios at the firm. This is significant because Lin Zhao specifically requested ESG improvement as a priority during her January review.',
        'The ESG score improvement was achieved without sacrificing risk-adjusted returns. The replacement positions have comparable expected returns and slightly lower volatility based on 3-year historical data.',
      ],
      clients: [
        { name: 'Lin Zhao', impact: 'ESG score 72 -> 80, top quartile at firm' },
      ],
      recommendations: [
        'Send Lin Zhao a personalized ESG progress report highlighting the improvement',
        'Identify two additional positions that could be swapped to push the score above 85',
        'Use this success story (anonymized) in marketing materials for ESG-conscious prospects',
      ],
      trend: 'Lin Zhao\'s ESG score has improved from 65 (90 days ago) to 72 (60 days ago, post-initial swap) to 80 today. Target of 85 is achievable by Q3 with two more position swaps.',
    },
  },
  {
    id: 'ins-11',
    tone: 'critical',
    icon: 'alert',
    category: 'Risk',
    title: 'Liquidity risk: Large withdrawal request from James Okafor',
    body: 'James Okafor has requested a $250K withdrawal within 10 business days. Current liquid holdings cover only 68% of the amount.',
    cta: 'Plan liquidation',
    affectedClients: ['James Okafor'],
    timestamp: '30 min ago',
    drilldown: {
      analysis: [
        'James Okafor has submitted a withdrawal request for $250K to be available within 10 business days. His current liquid holdings (cash, money market, and daily-liquid ETFs) total $170K, covering only 68% of the requested amount.',
        'The remaining $80K must be sourced from less liquid positions. The most tax-efficient liquidation path involves selling $50K of VCIT (2-day settlement) and $30K of VNQ (2-day settlement). However, VCIT is currently at a slight loss, which could be harvested.',
        'There is no margin of safety in the current liquid buffer after this withdrawal. A follow-up conversation is recommended to understand if additional withdrawals are anticipated and to rebuild the cash reserve.',
      ],
      clients: [
        { name: 'James Okafor', impact: '$250K withdrawal, $80K liquidity gap, 10-day deadline' },
      ],
      recommendations: [
        'Sell $50K VCIT (harvest the loss) and $30K VNQ to cover the gap',
        'Schedule an urgent call with James to confirm timeline and discuss future cash needs',
        'After withdrawal, rebuild the cash reserve to cover 3 months of estimated distributions',
      ],
      trend: 'This is the first large withdrawal request from James in 18 months. His previous withdrawal (90 days ago) was $25K and was covered entirely from cash. Portfolio cash buffer has declined from 12% to 4% over the past 60 days.',
    },
  },
];

const CATEGORIES: InsightCategory[] = ['Portfolio', 'Risk', 'Tax', 'Market', 'Compliance', 'Performance'];

/* ── Component ─────────────────────────────────────── */

export const InsightsView: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>('30D');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = activeCategory === 'All'
    ? ALL_INSIGHTS
    : ALL_INSIGHTS.filter(ins => ins.category === activeCategory);

  const criticalCount = ALL_INSIGHTS.filter(i => i.tone === 'critical').length;
  const successCount = ALL_INSIGHTS.filter(i => i.tone === 'success').length;
  const totalValue = '$26.2K';

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Insights</h1>
          <p className="text-slate-500 text-sm mt-1">
            Updated 8 min ago
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date range pills */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5">
            {(['7D', '30D', '90D', 'YTD'] as DateRange[]).map(range => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  dateRange === range
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button kind="secondary" icon={IconRefresh} size="sm">Refresh</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI label="Active Insights" value={ALL_INSIGHTS.length} delta="+3" deltaTone="neutral" sub="vs last week" accent="#2FA4F9" />
        <KPI label="Critical Alerts" value={criticalCount} delta={criticalCount > 0 ? 'Needs attention' : 'All clear'} deltaTone={criticalCount > 0 ? 'danger' : 'success'} accent="#EF4444" />
        <KPI label="Opportunities" value={successCount} delta="+2" deltaTone="success" sub="new this week" accent="#10B981" />
        <KPI label="Est. Value Impact" value={totalValue} delta="+$4.1K" deltaTone="success" sub="potential savings" accent="#7B5BFF" />
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {['All', ...CATEGORIES].map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition border ${
              activeCategory === cat
                ? 'bg-brand-50 text-brand-700 border-brand-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {cat}
          </button>
        ))}
        <span className="text-xs text-slate-400 ml-2">{filtered.length} insight{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Insight cards */}
      <div className="space-y-3">
        {filtered.map(ins => {
          const t = toneStyles[ins.tone] || toneStyles.info;
          const IconC = iconMap[ins.icon] || IconSparkles;
          const isExpanded = expandedId === ins.id;

          return (
            <Card key={ins.id} className="overflow-hidden">
              {/* Main row */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : ins.id)}
                className="w-full text-left p-5 flex items-start gap-4 ripple hover:bg-slate-50/50 transition"
              >
                {/* Tone bar */}
                <div className="absolute left-0 top-0 w-1 h-full" style={{ background: t.bar }} />

                {/* Icon */}
                <div className={`h-11 w-11 rounded-2xl ${t.bg} flex items-center justify-center shrink-0`}>
                  <IconC size={20} stroke={t.bar} sw={2} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge tone={toneBadge[ins.tone]}>
                      {ins.tone === 'critical' ? 'Critical' : ins.tone === 'warn' ? 'Warning' : ins.tone === 'success' ? 'Positive' : 'Info'}
                    </Badge>
                    <Badge tone={categoryBadgeTone[ins.category]}>{ins.category}</Badge>
                    <span className="text-[11px] text-slate-400 ml-auto shrink-0">{ins.timestamp}</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-[14px]">{ins.title}</div>
                  <div className="text-[13px] text-slate-600 mt-1 leading-relaxed">{ins.body}</div>

                  {/* Affected clients */}
                  {ins.affectedClients.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[11px] text-slate-400 font-medium">Affected:</span>
                      {ins.affectedClients.slice(0, 4).map(name => (
                        <span key={name} className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{name}</span>
                      ))}
                      {ins.affectedClients.length > 4 && (
                        <span className="text-[11px] text-slate-400">+{ins.affectedClients.length - 4} more</span>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA + expand */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-1.5 rounded-lg bg-brand-50">{ins.cta}</span>
                  {isExpanded
                    ? <IconChevronDown size={16} stroke="#94A3B8" />
                    : <IconChevronRight size={16} stroke="#94A3B8" />
                  }
                </div>
              </button>

              {/* Drill-down panel */}
              {isExpanded && (
                <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-5">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Detailed analysis */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Detailed Analysis</h4>
                      <div className="space-y-2.5">
                        {ins.drilldown.analysis.map((para, idx) => (
                          <p key={idx} className="text-[13px] text-slate-600 leading-relaxed">{para}</p>
                        ))}
                      </div>
                    </div>

                    {/* Affected clients with impact */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Client Impact</h4>
                      <div className="space-y-2">
                        {ins.drilldown.clients.map((client, idx) => (
                          <div key={idx} className="bg-white rounded-xl p-3 border border-slate-200">
                            <div className="font-medium text-slate-900 text-[13px]">{client.name}</div>
                            <div className="text-[12px] text-slate-500 mt-0.5">{client.impact}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Recommendations */}
                  <div className="mt-5">
                    <h4 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                      <IconSparkles size={14} stroke="#2FA4F9" sw={2} />
                      AI Recommendations
                    </h4>
                    <div className="space-y-2">
                      {ins.drilldown.recommendations.map((rec, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 bg-white rounded-xl p-3 border border-slate-200">
                          <div className="h-5 w-5 rounded-full bg-brand-50 flex items-center justify-center shrink-0 mt-0.5">
                            <span className="text-[10px] font-bold text-brand-700">{idx + 1}</span>
                          </div>
                          <span className="text-[13px] text-slate-700 leading-relaxed">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Historical trend */}
                  <div className="mt-5 bg-white rounded-xl p-4 border border-slate-200">
                    <h4 className="text-sm font-semibold text-slate-900 mb-2">Historical Trend (30 / 60 / 90 days)</h4>
                    <p className="text-[13px] text-slate-600 leading-relaxed">{ins.drilldown.trend}</p>
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
