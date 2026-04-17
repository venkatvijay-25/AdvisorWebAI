/**
 * Compliance data
 * Checks, filings, restriction list, and summary stats
 */

import type { ComplianceCheck, ComplianceFiling, RestrictionEntry } from '@/types';

/**
 * Compliance check results across all clients
 */
export const COMPLIANCE_CHECKS: ComplianceCheck[] = [
  {
    id: 'cc-1',
    status: 'fail',
    rule: 'Concentration limit (10% single name)',
    description: 'Marcus Reid holds 14.3% NVDA — exceeds 10% single-name limit.',
    clientId: 'mr',
    clientName: 'Marcus Reid',
    severity: 'critical',
    detectedAt: '2026-04-16T22:00:00Z',
    resolution: 'Rebalance staged — pending advisor approval.',
  },
  {
    id: 'cc-2',
    status: 'fail',
    rule: 'Review cadence (90-day max)',
    description: 'Anika Patel last review was Jan 10 — 96 days ago, exceeds 90-day policy.',
    clientId: 'ap',
    clientName: 'Anika Patel',
    severity: 'high',
    detectedAt: '2026-04-16T22:00:00Z',
    resolution: 'Schedule review call within 5 business days.',
  },
  {
    id: 'cc-3',
    status: 'warning',
    rule: 'Drift threshold (7%)',
    description: 'Lin Zhao drift at 5.7% — approaching 7% rebalance trigger.',
    clientId: 'lz',
    clientName: 'Lin Zhao',
    severity: 'medium',
    detectedAt: '2026-04-17T03:00:00Z',
  },
  {
    id: 'cc-4',
    status: 'warning',
    rule: 'Suitability alignment',
    description: 'Rohan Mehta risk profile changed to Moderate — IPS still references Aggressive targets.',
    clientId: 'rm',
    clientName: 'Rohan Mehta',
    severity: 'medium',
    detectedAt: '2026-04-15T10:00:00Z',
    resolution: 'Update IPS document and obtain client signature.',
  },
  {
    id: 'cc-5',
    status: 'pass',
    rule: 'Best execution verification',
    description: 'All Q1 trades executed within acceptable spread parameters.',
    severity: 'low',
    detectedAt: '2026-04-14T09:00:00Z',
  },
  {
    id: 'cc-6',
    status: 'pass',
    rule: 'ADV disclosure delivery',
    description: 'Annual ADV Part 2B delivered to all 6 clients within required window.',
    severity: 'low',
    detectedAt: '2026-03-31T12:00:00Z',
  },
  {
    id: 'cc-7',
    status: 'pass',
    rule: 'Restriction list compliance',
    description: 'No restricted securities held in any client account.',
    severity: 'low',
    detectedAt: '2026-04-17T05:00:00Z',
  },
  {
    id: 'cc-8',
    status: 'pending',
    rule: 'Quarterly trade review',
    description: 'Q1 2026 trade review awaiting chief compliance officer sign-off.',
    severity: 'medium',
    detectedAt: '2026-04-10T08:00:00Z',
  },
];

/**
 * Upcoming compliance filings
 */
export const COMPLIANCE_FILINGS: ComplianceFiling[] = [
  {
    id: 'cf-1',
    type: 'ADV Amendment',
    description: 'Annual ADV Part 2A amendment — material changes update.',
    dueDate: '2026-04-17',
    status: 'overdue',
    assignee: 'Vijay Venkat',
  },
  {
    id: 'cf-2',
    type: 'Form 13F',
    description: 'Quarterly 13F institutional holdings report for Q1 2026.',
    dueDate: '2026-04-30',
    status: 'due-soon',
    assignee: 'Ana Silva',
  },
  {
    id: 'cf-3',
    type: 'Form ADV-E',
    description: 'Annual surprise custody examination report.',
    dueDate: '2026-06-30',
    status: 'on-track',
    assignee: 'External Auditor',
  },
  {
    id: 'cf-4',
    type: 'Annual Compliance Review',
    description: 'Rule 206(4)-7 annual compliance program review.',
    dueDate: '2026-09-30',
    status: 'on-track',
    assignee: 'Vijay Venkat',
  },
];

/**
 * Firm restriction list
 */
export const RESTRICTION_LIST: RestrictionEntry[] = [
  {
    ticker: 'DWAC',
    name: 'Digital World Acquisition',
    type: 'hard-block',
    reason: 'Firm policy — heightened regulatory and reputational risk.',
    appliesTo: 'all',
  },
  {
    ticker: 'GME',
    name: 'GameStop Corp',
    type: 'hard-block',
    reason: 'Firm policy — excessive volatility and suitability concerns.',
    appliesTo: 'all',
  },
  {
    ticker: 'TSLA',
    name: 'Tesla Inc',
    type: 'soft-limit',
    reason: 'Max 5% portfolio weight. Concentration risk for single-stock exposure.',
    appliesTo: 'all',
  },
  {
    ticker: 'COIN',
    name: 'Coinbase Global',
    type: 'soft-limit',
    reason: 'Max 3% weight for conservative/moderate profiles. Crypto-correlated volatility.',
    appliesTo: ['ap', 'dg', 'sc', 'rm'],
  },
  {
    ticker: 'SMCI',
    name: 'Super Micro Computer',
    type: 'watchlist',
    reason: 'Under monitoring — accounting restatement concerns. No new positions until cleared.',
    appliesTo: 'all',
    expiresAt: '2026-06-30',
  },
];

/**
 * Compliance dashboard summary
 */
export const COMPLIANCE_SUMMARY = {
  passRate: 62.5,
  openIssues: 4,
  criticalIssues: 1,
  nextAudit: '2026-06-30',
};
