/**
 * Autopilot staged actions
 * Autonomous actions the copilot has prepared for advisor approval
 */

import type { StagedAction } from '@/types';

/**
 * Queued actions staged by the copilot agent overnight
 */
export const STAGED_ACTIONS: StagedAction[] = [
  {
    id: 'sa-1',
    type: 'rebalance',
    status: 'pending-approval',
    title: 'Rebalance Marcus Reid → Aggressive Growth model',
    description:
      'Portfolio drift reached 11.2% driven by NVDA and AAPL overweight positions after Q1 tech rally. Staged a 4-trade rebalance to bring allocation within 1.5% of target.',
    clientIds: ['mr'],
    impact: 'Reduces drift from 11.2% → 1.4%',
    confidence: 91,
    createdAt: '2026-04-17T03:22:00Z',
    steps: [
      'Pulled current holdings from custody feed (Schwab)',
      'Compared against Aggressive Growth model targets',
      'Identified 2 overweight positions (NVDA +4.1%, AAPL +2.8%) and 2 underweight (VXUS -3.6%, BND -2.1%)',
      'Generated 4 trades: sell $52K NVDA, sell $36K AAPL, buy $48K VXUS, buy $40K BND',
      'Verified no wash-sale conflicts or restriction-list violations',
    ],
    artifacts: [
      { icon: 'doc', title: 'Rebalance Trade Blotter', type: 'PDF', size: '84 KB' },
      { icon: 'chart', title: 'Drift Analysis Chart', type: 'PNG', size: '142 KB' },
    ],
  },
  {
    id: 'sa-2',
    type: 'tlh',
    status: 'pending-approval',
    title: 'Tax-loss harvest batch — Reid, Zhao, Mehta',
    description:
      'Identified $48K in harvestable losses across 3 clients before the Apr 15 window closes. Wash-sale-safe swap pairs selected for each position.',
    clientIds: ['mr', 'lz', 'rm'],
    impact: 'Est. tax savings ~$17.8K across 3 clients',
    confidence: 96,
    createdAt: '2026-04-17T03:45:00Z',
    steps: [
      'Scanned all taxable lots with unrealized losses > $2K',
      'Filtered for 30-day wash-sale clearance on each lot',
      'Matched swap pairs: AAPL → MSFT, GOOGL → META, VTI → ITOT',
      "Calculated estimated tax impact at each client's marginal rate",
      'Staged trade pairs for batch execution',
    ],
    artifacts: [
      { icon: 'doc', title: 'TLH Opportunity Report', type: 'PDF', size: '96 KB' },
      { icon: 'spreadsheet', title: 'Lot-Level Detail', type: 'XLSX', size: '38 KB' },
    ],
  },
  {
    id: 'sa-3',
    type: 'email',
    status: 'pending-approval',
    title: 'Meeting recap email — David Goldberg (Mar 1)',
    description:
      'Auto-drafted a post-meeting recap from the Mar 1 portfolio review. Includes decisions made, action items, and next steps.',
    clientIds: ['dg'],
    impact: 'Closes open follow-up from 47 days ago',
    confidence: 88,
    createdAt: '2026-04-17T04:10:00Z',
    steps: [
      'Retrieved meeting notes and transcript from Mar 1 session',
      'Extracted 3 decisions, 2 action items, and 1 life-event note',
      'Generated personalized email draft with professional tone',
      'Attached updated portfolio summary PDF',
    ],
    artifacts: [
      { icon: 'mail', title: 'Email Draft Preview', type: 'HTML', size: '12 KB' },
      { icon: 'doc', title: 'Portfolio Summary', type: 'PDF', size: '68 KB' },
    ],
  },
  {
    id: 'sa-4',
    type: 'meeting-prep',
    status: 'pending-approval',
    title: 'Meeting brief — Sarah Chen Q2 review (today 2:30 PM)',
    description:
      "Pre-built comprehensive meeting brief for today's Sarah Chen call. Includes performance summary, talking points, risk analysis, and TLH opportunity.",
    clientIds: ['sc'],
    impact: 'Saves ~20 min of manual prep',
    confidence: 94,
    createdAt: '2026-04-17T04:30:00Z',
    steps: [
      'Pulled latest portfolio data and YTD performance (+8.2%)',
      'Compared vs Balanced Growth benchmark (+6.4%)',
      'Identified TLH opportunity in AAPL lot (~$11K harvestable)',
      'Flagged college fund discussion from Feb 15 meeting notes',
      'Compiled 4 talking points and 2 recommended actions',
    ],
    artifacts: [
      { icon: 'brief', title: 'Meeting Brief', type: 'PDF', size: '156 KB' },
      { icon: 'chart', title: 'Performance Dashboard', type: 'PNG', size: '210 KB' },
    ],
  },
  {
    id: 'sa-5',
    type: 'crm-update',
    status: 'executed',
    title: 'CRM update — Rohan Mehta review completed',
    description:
      'Automatically logged the Mar 18 review completion in CRM. Updated next-review date, risk profile, and contact notes.',
    clientIds: ['rm'],
    impact: 'CRM record current; next review flagged for Sep 18',
    confidence: 99,
    createdAt: '2026-04-16T18:05:00Z',
    steps: [
      'Detected review completion event from meeting system',
      'Updated CRM contact record: last review → 2026-03-18',
      'Set next review reminder for 2026-09-18 (6-month cycle)',
      'Appended meeting summary to contact notes',
    ],
  },
  {
    id: 'sa-6',
    type: 'compliance-filing',
    status: 'pending-approval',
    title: 'Pre-trade compliance check — pending orders',
    description:
      'Scanned 6 pending rebalance orders against restriction list, concentration limits, and suitability rules. All orders clear.',
    clientIds: ['mr', 'lz'],
    impact: 'All 6 orders pass pre-trade checks',
    confidence: 97,
    createdAt: '2026-04-17T05:00:00Z',
    steps: [
      'Loaded pending order queue (4 Reid trades, 2 Zhao trades)',
      'Checked each ticker against firm restriction list — no conflicts',
      'Validated post-trade concentration limits (max 10% single name)',
      "Confirmed suitability alignment with each client's IPS",
      'Generated compliance clearance report',
    ],
    artifacts: [
      { icon: 'shield', title: 'Pre-Trade Clearance Report', type: 'PDF', size: '44 KB' },
    ],
  },
];
