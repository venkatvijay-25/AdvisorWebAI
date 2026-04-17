/**
 * Trust layer: Data sources, confidence scores, and per-template seed content
 * Tracks which sources back which claims and how confident we are in the results
 */

import type { Source, SeedContent } from '@/types';

/**
 * All data sources that power the system
 */
export const SRC: Record<string, Source> = {
  custodian: {
    id: 'c1',
    title: 'Schwab custodian feed',
    kind: 'feed',
    freshness: '6 min ago',
    verified: true,
  },
  model_bg: {
    id: 'c2',
    title: 'Model portfolio: Balanced Growth v4.2',
    kind: 'model',
    freshness: '2 days ago',
  },
  bench_6040: {
    id: 'c3',
    title: 'Benchmark: 60/40 + 5% Alts blend',
    kind: 'benchmark',
    freshness: '1 day ago',
  },
  risk_engine: {
    id: 'c4',
    title: 'Flyer Risk Engine · VaR 99% 1d',
    kind: 'engine',
    freshness: 'Just now',
  },
  news_feed: {
    id: 'c5',
    title: 'Bloomberg + Reuters wire',
    kind: 'feed',
    freshness: 'Live',
  },
  compliance: {
    id: 'c6',
    title: 'Compliance ruleset · Apr 2026',
    kind: 'policy',
    freshness: '3 days ago',
  },
  tax_engine: {
    id: 'c7',
    title: 'Tax engine · 37% federal + 5% state',
    kind: 'engine',
    freshness: 'Just now',
  },
  client_meta: {
    id: 'c8',
    title: 'Client CRM record',
    kind: 'crm',
    freshness: '1 hour ago',
  },
};

/**
 * Per-template seed content with steps, sources, confidence, and artifacts
 * This is the "foundation" data that backs each template's output
 */
export const SEED: Record<string, SeedContent> = {
  review: {
    steps: [
      { label: 'Loaded holdings & cash flows from custodian', src: SRC.custodian.title },
      { label: 'Compared to target allocation in Balanced Growth v4.2' },
      { label: 'Ran 12-month attribution vs blended benchmark' },
      { label: 'Identified drift drivers and concentration' },
      { label: 'Generated talking points and 1-page brief' },
    ],
    sources: [SRC.custodian, SRC.model_bg, SRC.bench_6040, SRC.client_meta],
    confidence: 94,
    artifacts: [
      { icon: 'brief', title: '1-page meeting brief', type: 'PDF', size: '420 KB' },
      { icon: 'bar', title: 'Performance attribution', type: 'XLSX', size: '180 KB' },
    ],
  },
  rebalance: {
    steps: [
      { label: 'Pulled current holdings and cost basis from custodian' },
      { label: 'Computed drift vs Balanced Growth v4.2' },
      { label: 'Optimized trades under tax + compliance constraints' },
      { label: 'Pre-checked wash-sale and concentration rules' },
      { label: 'Staged blotter ready for OMS' },
    ],
    sources: [SRC.custodian, SRC.model_bg, SRC.compliance, SRC.tax_engine],
    confidence: 91,
    artifacts: [
      { icon: 'scale', title: 'Trade blotter (5 trades)', type: 'CSV', size: '6 KB' },
      { icon: 'brief', title: 'Client rationale memo', type: 'PDF', size: '210 KB' },
    ],
  },
  risk: {
    steps: [
      { label: 'Aggregated exposures across all 6 clients' },
      { label: 'Computed book-level concentration & factor loadings' },
      { label: 'Ran 6 stress scenarios (GFC, COVID, rate shock, …)' },
      { label: 'Computed VaR 99% (1-day, 10-day) & Sharpe' },
    ],
    sources: [SRC.custodian, SRC.risk_engine, SRC.bench_6040],
    confidence: 88,
    artifacts: [
      { icon: 'shield', title: 'Risk dashboard snapshot', type: 'PDF', size: '340 KB' },
      { icon: 'beaker', title: 'Stress scenario detail', type: 'XLSX', size: '220 KB' },
    ],
  },
  news: {
    steps: [
      { label: 'Scanned overnight wire (Bloomberg, Reuters, WSJ, CNBC, FT)' },
      { label: 'Mapped tickers to book exposures' },
      { label: 'Computed per-client P&L impact' },
      { label: 'Drafted client-email variants' },
    ],
    sources: [SRC.news_feed, SRC.custodian, SRC.client_meta],
    confidence: 82,
    artifacts: [
      { icon: 'newspaper', title: 'Today-in-markets brief', type: 'PDF', size: '180 KB' },
      { icon: 'brief', title: 'Drafted client email (x4)', type: 'DOCX', size: '90 KB' },
    ],
  },
  tax: {
    steps: [
      { label: 'Pulled all tax lots from custodian' },
      { label: 'Identified lots with unrealized losses' },
      { label: 'Filtered wash-sale-ineligible replacements' },
      { label: 'Computed net-of-fee tax savings at 37% bracket' },
    ],
    sources: [SRC.custodian, SRC.tax_engine, SRC.compliance],
    confidence: 96,
    artifacts: [
      { icon: 'receipt', title: 'TLH opportunities report', type: 'PDF', size: '160 KB' },
      { icon: 'scale', title: 'Staged TLH trade list', type: 'CSV', size: '5 KB' },
    ],
  },
  proposal: {
    steps: [
      { label: 'Parsed prospect profile (age, horizon, risk)' },
      { label: 'Selected model portfolio: Balanced Growth' },
      { label: 'Drafted IPS sections' },
      { label: 'Generated allocation chart and projections' },
    ],
    sources: [SRC.model_bg, SRC.compliance, SRC.bench_6040],
    confidence: 89,
    artifacts: [
      { icon: 'brief', title: 'IPS draft (4 pages)', type: 'DOCX', size: '85 KB' },
      { icon: 'briefcase', title: 'Proposal deck', type: 'PPTX', size: '2.1 MB' },
    ],
  },
};
