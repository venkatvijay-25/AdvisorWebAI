/**
 * Model portfolio definitions
 * Target allocations and metadata for each investment model
 */

import type { ModelPortfolio } from '@/types';

/**
 * Model portfolios available in the practice
 * Client counts and AUM align with existing client data
 */
export const MODEL_PORTFOLIOS: ModelPortfolio[] = [
  {
    id: 'mp-bg',
    name: 'Balanced Growth',
    description:
      'Core 60/40 blend with tilt toward US large-cap growth. Designed for moderate-risk clients seeking steady appreciation with downside protection.',
    riskLevel: 'Moderate',
    targetReturn: 7.5,
    allocations: [
      { asset: 'US Equity', weight: 35, color: '#2FA4F9' },
      { asset: 'Intl Equity', weight: 15, color: '#7B5BFF' },
      { asset: 'Fixed Income', weight: 30, color: '#10B981' },
      { asset: 'Alternatives', weight: 10, color: '#F97316' },
      { asset: 'Real Estate', weight: 5, color: '#EC4899' },
      { asset: 'Cash', weight: 5, color: '#94A3B8' },
    ],
    clientCount: 2,
    totalAum: 9_625_000,
    lastUpdated: '2026-03-15',
    manager: 'Vijay Venkat',
  },
  {
    id: 'mp-ag',
    name: 'Aggressive Growth',
    description:
      'High-conviction equity portfolio with concentrated tech and innovation exposure. Suitable for long time horizons and high risk tolerance.',
    riskLevel: 'Aggressive',
    targetReturn: 12.0,
    allocations: [
      { asset: 'US Equity', weight: 50, color: '#2FA4F9' },
      { asset: 'Intl Equity', weight: 20, color: '#7B5BFF' },
      { asset: 'Alternatives', weight: 15, color: '#F97316' },
      { asset: 'Fixed Income', weight: 8, color: '#10B981' },
      { asset: 'Real Estate', weight: 5, color: '#EC4899' },
      { asset: 'Cash', weight: 2, color: '#94A3B8' },
    ],
    clientCount: 1,
    totalAum: 12_840_000,
    lastUpdated: '2026-03-22',
    manager: 'Vijay Venkat',
  },
  {
    id: 'mp-is',
    name: 'Income & Stability',
    description:
      'Income-oriented portfolio emphasizing investment-grade bonds, dividend equities, and low-volatility alternatives. Prioritizes capital preservation and yield.',
    riskLevel: 'Conservative',
    targetReturn: 4.5,
    allocations: [
      { asset: 'Fixed Income', weight: 45, color: '#10B981' },
      { asset: 'US Equity', weight: 20, color: '#2FA4F9' },
      { asset: 'Intl Equity', weight: 5, color: '#7B5BFF' },
      { asset: 'Real Estate', weight: 10, color: '#EC4899' },
      { asset: 'Alternatives', weight: 10, color: '#F97316' },
      { asset: 'Cash', weight: 10, color: '#94A3B8' },
    ],
    clientCount: 1,
    totalAum: 2_106_000,
    lastUpdated: '2026-02-28',
    manager: 'Vijay Venkat',
  },
  {
    id: 'mp-cp',
    name: 'Capital Preservation',
    description:
      'Ultra-conservative allocation focused on wealth preservation and inflation protection. Short-duration bonds, TIPS, and minimal equity exposure.',
    riskLevel: 'Conservative',
    targetReturn: 3.5,
    allocations: [
      { asset: 'Fixed Income', weight: 50, color: '#10B981' },
      { asset: 'TIPS/I-Bonds', weight: 15, color: '#0EA5E9' },
      { asset: 'US Equity', weight: 10, color: '#2FA4F9' },
      { asset: 'Real Estate', weight: 5, color: '#EC4899' },
      { asset: 'Alternatives', weight: 5, color: '#F97316' },
      { asset: 'Cash', weight: 15, color: '#94A3B8' },
    ],
    clientCount: 1,
    totalAum: 7_530_000,
    lastUpdated: '2026-03-01',
    manager: 'Vijay Venkat',
  },
  {
    id: 'mp-eg',
    name: 'Endowment Growth',
    description:
      'Endowment-style model blending public equities with alternatives, private credit, and real assets. Designed for multi-generational wealth with long horizons.',
    riskLevel: 'Moderate',
    targetReturn: 9.0,
    allocations: [
      { asset: 'US Equity', weight: 25, color: '#2FA4F9' },
      { asset: 'Intl Equity', weight: 20, color: '#7B5BFF' },
      { asset: 'Alternatives', weight: 20, color: '#F97316' },
      { asset: 'Fixed Income', weight: 15, color: '#10B981' },
      { asset: 'Real Estate', weight: 10, color: '#EC4899' },
      { asset: 'Private Credit', weight: 7, color: '#0EA5E9' },
      { asset: 'Cash', weight: 3, color: '#94A3B8' },
    ],
    clientCount: 1,
    totalAum: 18_640_000,
    lastUpdated: '2026-03-10',
    manager: 'Vijay Venkat',
  },
];
