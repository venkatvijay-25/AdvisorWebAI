/**
 * Client and holding data
 * Extracted from prototype with exact demo values
 */

import type { Client, Holding } from '@/types';

/**
 * Format a number as currency (USD)
 * Examples: 1000000 -> $1.0M, 50000 -> $50K, 100 -> $100
 */
export const fmtMoney = (n: number, d: number = 0): string => {
  const v = n == null || Number.isNaN(+n) ? null : +n;
  if (v == null) return '—';
  if (Math.abs(v) >= 1e6) return `$${(v / 1e6).toFixed(d || 2)}M`;
  if (Math.abs(v) >= 1e3) return `$${(v / 1e3).toFixed(d || 1)}K`;
  return `$${v.toFixed(d)}`;
};

/**
 * Format a number as a percentage
 * Examples: 8.2 -> 8.2%, -3.4 -> -3.4%, with optional + sign
 */
export const fmtPct = (n: number, d: number = 1, sign: boolean = false): string => {
  const v = n == null || Number.isNaN(+n) ? null : +n;
  if (v == null) return '—';
  return `${sign && v > 0 ? '+' : ''}${v.toFixed(d)}%`;
};

/**
 * All clients in the book
 */
export const CLIENTS: Client[] = [
  {
    id: 'sc',
    name: 'Sarah Chen',
    role: 'CFO, Helio Labs',
    segment: 'HNI',
    aum: 4_215_000,
    ytd: 8.2,
    bench: 6.4,
    risk: 'Moderate',
    model: 'Balanced Growth',
    drift: 6.4,
    lastReview: '2026-02-15',
    avatar: '#2FA4F9',
    initials: 'SC',
  },
  {
    id: 'mr',
    name: 'Marcus Reid',
    role: 'Founder, Northwind',
    segment: 'UHNI',
    aum: 12_840_000,
    ytd: 14.6,
    bench: 9.1,
    risk: 'Aggressive',
    model: 'Aggressive Growth',
    drift: 11.2,
    lastReview: '2026-03-22',
    avatar: '#7B5BFF',
    initials: 'MR',
  },
  {
    id: 'ap',
    name: 'Anika Patel',
    role: 'Surgeon',
    segment: 'HNI',
    aum: 2_106_000,
    ytd: 4.1,
    bench: 5.2,
    risk: 'Conservative',
    model: 'Income & Stability',
    drift: 3.1,
    lastReview: '2026-01-10',
    avatar: '#F97316',
    initials: 'AP',
  },
  {
    id: 'dg',
    name: 'David Goldberg',
    role: 'Retired',
    segment: 'HNI',
    aum: 7_530_000,
    ytd: 3.4,
    bench: 4.0,
    risk: 'Conservative',
    model: 'Capital Preservation',
    drift: 2.8,
    lastReview: '2026-03-01',
    avatar: '#10B981',
    initials: 'DG',
  },
  {
    id: 'lz',
    name: 'Lin Zhao',
    role: 'Family Trust',
    segment: 'UHNI',
    aum: 18_640_000,
    ytd: 11.8,
    bench: 8.6,
    risk: 'Moderate',
    model: 'Endowment Growth',
    drift: 5.7,
    lastReview: '2026-02-28',
    avatar: '#EC4899',
    initials: 'LZ',
  },
  {
    id: 'rm',
    name: 'Rohan Mehta',
    role: 'Entrepreneur',
    segment: 'HNI',
    aum: 5_410_000,
    ytd: 9.4,
    bench: 6.4,
    risk: 'Moderate',
    model: 'Balanced Growth',
    drift: 4.5,
    lastReview: '2026-03-18',
    avatar: '#0EA5E9',
    initials: 'RM',
  },
];

/**
 * Total AUM across all clients
 */
export const TOTAL_AUM = CLIENTS.reduce((a, c) => a + c.aum, 0);

/**
 * Holdings in the book
 */
export const HOLDINGS: Holding[] = [
  {
    tk: 'NVDA',
    name: 'NVIDIA Corp',
    weight: 6.2,
    value: 261_330,
    day: 2.4,
    ytd: 32.1,
  },
  {
    tk: 'MSFT',
    name: 'Microsoft Corp',
    weight: 5.8,
    value: 244_470,
    day: 0.8,
    ytd: 14.6,
  },
  {
    tk: 'AAPL',
    name: 'Apple Inc',
    weight: 4.4,
    value: 185_460,
    day: -1.2,
    ytd: -3.4,
  },
  {
    tk: 'GOOGL',
    name: 'Alphabet Inc',
    weight: 3.9,
    value: 164_385,
    day: 1.1,
    ytd: 11.2,
  },
  {
    tk: 'BRK.B',
    name: 'Berkshire Hathaway',
    weight: 3.2,
    value: 134_880,
    day: 0.4,
    ytd: 6.8,
  },
  {
    tk: 'VTI',
    name: 'Vanguard Total Stock',
    weight: 8.1,
    value: 341_415,
    day: 0.7,
    ytd: 8.9,
  },
  {
    tk: 'VXUS',
    name: 'Vanguard Intl Stock',
    weight: 9.0,
    value: 379_350,
    day: 0.3,
    ytd: 5.1,
  },
  {
    tk: 'BND',
    name: 'Vanguard Total Bond',
    weight: 14.2,
    value: 598_530,
    day: 0.1,
    ytd: 1.6,
  },
  {
    tk: 'GLD',
    name: 'SPDR Gold Shares',
    weight: 4.8,
    value: 202_320,
    day: 0.6,
    ytd: 9.3,
  },
];
