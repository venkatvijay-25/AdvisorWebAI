/**
 * Household / Family grouping data
 * Links individual clients into family units for consolidated wealth views
 */

import { CLIENTS } from './clients';

export interface HouseholdMember {
  name: string;
  role: 'Primary' | 'Spouse' | 'Trust' | 'Entity';
  clientId: string | null;
  aum: number;
  ytd: number;
  drift: number;
  initials: string;
  color: string;
}

export interface Household {
  id: string;
  name: string;
  members: HouseholdMember[];
  combinedAum: number;
  consolidatedRisk: string;
  householdGoals: number;
  lastReview: string;
  portfolioAllocation: Array<{ label: string; pct: number; color: string }>;
  taxOpportunities: Array<{ title: string; description: string; potentialSavings: string }>;
}

// Helper to find a client by ID
const c = (id: string) => CLIENTS.find(cl => cl.id === id)!;

/**
 * All households in the book
 */
export const HOUSEHOLDS: Household[] = [
  {
    id: 'hh-chen',
    name: 'Chen Household',
    members: [
      {
        name: 'Sarah Chen',
        role: 'Primary',
        clientId: 'sc',
        aum: c('sc').aum,
        ytd: c('sc').ytd,
        drift: c('sc').drift,
        initials: 'SC',
        color: '#2FA4F9',
      },
      {
        name: 'Michael Chen',
        role: 'Spouse',
        clientId: null,
        aum: 3_250_000,
        ytd: 6.8,
        drift: 3.2,
        initials: 'MC',
        color: '#6366F1',
      },
      {
        name: 'Chen Family Trust',
        role: 'Trust',
        clientId: 'lz',
        aum: c('lz').aum - 7_825_000,
        ytd: c('lz').ytd,
        drift: c('lz').drift,
        initials: 'CT',
        color: '#EC4899',
      },
    ],
    combinedAum: 18_280_000,
    consolidatedRisk: 'Moderate',
    householdGoals: 5,
    lastReview: '2026-02-15',
    portfolioAllocation: [
      { label: 'US Equity', pct: 38, color: '#2FA4F9' },
      { label: 'Intl Equity', pct: 18, color: '#7B5BFF' },
      { label: 'Fixed Income', pct: 28, color: '#10B981' },
      { label: 'Alternatives', pct: 10, color: '#F97316' },
      { label: 'Cash', pct: 6, color: '#94A3B8' },
    ],
    taxOpportunities: [
      { title: 'Tax-loss harvest in trust account', description: 'Unrealized losses of $42K in VXUS position can offset capital gains in Sarah\'s individual account.', potentialSavings: '$12,600' },
      { title: 'Roth conversion opportunity', description: 'Michael\'s lower income this year creates a window for partial Roth conversion up to $85K.', potentialSavings: '$8,200' },
      { title: 'Charitable giving via trust', description: 'Donate appreciated NVDA shares from trust to avoid $18K in capital gains.', potentialSavings: '$5,400' },
    ],
  },
  {
    id: 'hh-reid',
    name: 'Reid Household',
    members: [
      {
        name: 'Marcus Reid',
        role: 'Primary',
        clientId: 'mr',
        aum: c('mr').aum,
        ytd: c('mr').ytd,
        drift: c('mr').drift,
        initials: 'MR',
        color: '#7B5BFF',
      },
      {
        name: 'Reid Ventures LLC',
        role: 'Entity',
        clientId: null,
        aum: 960_000,
        ytd: 11.2,
        drift: 4.8,
        initials: 'RV',
        color: '#0EA5E9',
      },
    ],
    combinedAum: 13_800_000,
    consolidatedRisk: 'Aggressive',
    householdGoals: 3,
    lastReview: '2026-03-22',
    portfolioAllocation: [
      { label: 'US Equity', pct: 48, color: '#2FA4F9' },
      { label: 'Intl Equity', pct: 22, color: '#7B5BFF' },
      { label: 'Fixed Income', pct: 12, color: '#10B981' },
      { label: 'Alternatives', pct: 14, color: '#F97316' },
      { label: 'Cash', pct: 4, color: '#94A3B8' },
    ],
    taxOpportunities: [
      { title: 'QBI deduction optimization', description: 'Restructure Reid Ventures distributions to maximize qualified business income deduction.', potentialSavings: '$22,400' },
      { title: 'Harvest losses in intl equity', description: 'VXUS position in entity account shows $28K unrealized loss — swap for similar exposure.', potentialSavings: '$8,400' },
    ],
  },
  {
    id: 'hh-goldberg',
    name: 'Goldberg Household',
    members: [
      {
        name: 'David Goldberg',
        role: 'Primary',
        clientId: 'dg',
        aum: c('dg').aum,
        ytd: c('dg').ytd,
        drift: c('dg').drift,
        initials: 'DG',
        color: '#10B981',
      },
      {
        name: 'Ruth Goldberg',
        role: 'Spouse',
        clientId: null,
        aum: 1_470_000,
        ytd: 3.1,
        drift: 2.1,
        initials: 'RG',
        color: '#F59E0B',
      },
    ],
    combinedAum: 9_000_000,
    consolidatedRisk: 'Conservative',
    householdGoals: 4,
    lastReview: '2026-03-01',
    portfolioAllocation: [
      { label: 'US Equity', pct: 22, color: '#2FA4F9' },
      { label: 'Intl Equity', pct: 10, color: '#7B5BFF' },
      { label: 'Fixed Income', pct: 45, color: '#10B981' },
      { label: 'Alternatives', pct: 8, color: '#F97316' },
      { label: 'Cash', pct: 15, color: '#94A3B8' },
    ],
    taxOpportunities: [
      { title: 'RMD tax strategy', description: 'Use qualified charitable distributions (QCDs) from David\'s IRA to satisfy $62K RMD without income tax.', potentialSavings: '$14,900' },
      { title: 'Municipal bond swap', description: 'Replace taxable bond positions with muni bonds in Ruth\'s account for after-tax income improvement.', potentialSavings: '$6,200' },
      { title: 'Gifting strategy', description: 'Annual exclusion gifts of appreciated securities to grandchildren\'s 529 plans.', potentialSavings: '$3,800' },
    ],
  },
  {
    id: 'hh-patel',
    name: 'Patel Household',
    members: [
      {
        name: 'Anika Patel',
        role: 'Primary',
        clientId: 'ap',
        aum: c('ap').aum,
        ytd: c('ap').ytd,
        drift: c('ap').drift,
        initials: 'AP',
        color: '#F97316',
      },
    ],
    combinedAum: 5_506_000,
    consolidatedRisk: 'Conservative',
    householdGoals: 2,
    lastReview: '2026-01-10',
    portfolioAllocation: [
      { label: 'US Equity', pct: 25, color: '#2FA4F9' },
      { label: 'Intl Equity', pct: 12, color: '#7B5BFF' },
      { label: 'Fixed Income', pct: 42, color: '#10B981' },
      { label: 'Alternatives', pct: 6, color: '#F97316' },
      { label: 'Cash', pct: 15, color: '#94A3B8' },
    ],
    taxOpportunities: [
      { title: 'Backdoor Roth IRA', description: 'High income prevents direct Roth contributions — execute backdoor Roth for $7K annual contribution.', potentialSavings: '$2,100' },
      { title: 'Mega backdoor Roth', description: 'Employer plan allows after-tax contributions with in-plan conversion up to $46K.', potentialSavings: '$9,200' },
    ],
  },
];

export const TOTAL_HOUSEHOLD_AUM = HOUSEHOLDS.reduce((a, h) => a + h.combinedAum, 0);
export const AVG_MEMBERS = +(HOUSEHOLDS.reduce((a, h) => a + h.members.length, 0) / HOUSEHOLDS.length).toFixed(1);
