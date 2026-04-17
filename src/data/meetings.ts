/**
 * Meetings, pulse events, saved queries, and the book query function
 * Real-time engagement data and query engine
 */

import type { Meeting, PulseEvent, SavedQuery, LiveTranscriptEntry, BookQueryResult } from '@/types';
import { CLIENTS } from './clients';

/**
 * Scheduled meetings with the advisor
 */
export const MEETINGS: Meeting[] = [
  {
    id: 'm1',
    client: 'Sarah Chen',
    clientId: 'sc',
    title: 'Q2 Portfolio Review',
    when: 'Today · 2:30 PM',
    whenISO: 'Apr 15 · 14:30',
    status: 'upcoming',
    duration: '30 min',
    channel: 'Zoom',
    attendees: ['Vijay Venkat', 'Sarah Chen', 'Ana Silva (tax)'],
    prep: {
      talking: [
        'YTD +8.2% (+180bps vs benchmark) — lead with this',
        'US tech drift: 6.4% above target. Propose a 3-trade rebalance.',
        'TLH opportunity: ~$11K from AAPL lot — ask for consent.',
        "Life event check-in: daughter's college fund (mentioned Feb 15).",
      ],
      artifacts: [
        { icon: 'brief', title: '1-page meeting brief', type: 'PDF', size: '420 KB' },
        { icon: 'bar', title: 'Performance attribution', type: 'XLSX', size: '180 KB' },
      ],
    },
  },
  {
    id: 'm2',
    client: 'Marcus Reid',
    clientId: 'mr',
    title: 'Rebalance review',
    when: 'Tomorrow · 11:00 AM',
    whenISO: 'Apr 16 · 11:00',
    status: 'upcoming',
    duration: '45 min',
    channel: 'In-person',
    attendees: ['Vijay Venkat', 'Marcus Reid'],
  },
  {
    id: 'm3',
    client: 'Lin Zhao',
    clientId: 'lz',
    title: 'Trust distribution planning',
    when: 'Fri · 3:00 PM',
    whenISO: 'Apr 18 · 15:00',
    status: 'upcoming',
    duration: '60 min',
    channel: 'Zoom',
    attendees: ['Vijay Venkat', 'Lin Zhao', 'Estate attorney'],
  },
  {
    id: 'm4',
    client: 'David Goldberg',
    clientId: 'dg',
    title: 'Annual review',
    when: 'Apr 08',
    whenISO: 'Apr 08 · 10:00',
    status: 'past',
    duration: '45 min',
    channel: 'Zoom',
    attendees: ['Vijay Venkat', 'David Goldberg'],
    capture: {
      decisions: [
        'Keep allocation at Capital Preservation model; no changes this quarter.',
        'Increase muni-bond sleeve from 22% to 25% next rebalance.',
      ],
      objections: [
        'David is nervous about rate cuts — wants downside protection discussed next time.',
      ],
      lifeEvents: [
        'Grandchild born in March — wants to explore a 529 for her.',
      ],
      actions: [
        { id: 'a1', text: 'Send muni-bond ladder proposal', owner: 'Vijay', due: 'Apr 20', done: false },
        { id: 'a2', text: 'Schedule 529 call with CPA', owner: 'Vijay', due: 'Apr 25', done: true },
        { id: 'a3', text: 'Share annual performance deck', owner: 'Copilot', due: 'Apr 10', done: true },
      ],
    },
  },
  {
    id: 'm5',
    client: 'Anika Patel',
    clientId: 'ap',
    title: 'Year-end check-in',
    when: 'Apr 03',
    whenISO: 'Apr 03 · 16:00',
    status: 'past',
    duration: '30 min',
    channel: 'Phone',
    attendees: ['Vijay Venkat', 'Anika Patel'],
  },
];

/**
 * Real-time pulse events / alerts
 */
export const PULSE_EVENTS: PulseEvent[] = [
  {
    id: 'p1',
    severity: 'urgent',
    icon: 'alert',
    title: 'Fed cut 25bps overnight — 3 clients with >15% duration need review',
    body: 'Rate move impacts BND-heavy portfolios. Sarah Chen, David Goldberg, Anika Patel are most exposed. Estimated portfolio lift: +0.8 to +1.4%.',
    affected: ['Sarah Chen', 'David Goldberg', 'Anika Patel'],
    source: 'Bloomberg · 02:14 ET',
    age: '42 min ago',
    actions: ['Draft outreach email', 'Re-run risk review'],
  },
  {
    id: 'p2',
    severity: 'urgent',
    icon: 'trendDown',
    title: 'NVDA down 6% premarket — Marcus Reid concentration alert',
    body: 'NVDA is 18% of Marcus Reid\'s book. Pre-market move of −6% implies a $1.4M unrealized drawdown. Consider a protective put.',
    affected: ['Marcus Reid'],
    source: 'Reuters wire',
    age: '1 hr ago',
    actions: ['Suggest hedge', 'Draft notice to Marcus'],
  },
  {
    id: 'p3',
    severity: 'worth',
    icon: 'flame',
    title: 'Drift alert: 2 clients crossed 5% threshold',
    body: 'Rohan Mehta and Lin Zhao both tipped past the 5% drift threshold this week. Both align to the same rebalance pattern as Sarah Chen.',
    affected: ['Rohan Mehta', 'Lin Zhao'],
    source: 'Risk engine · daily sweep',
    age: '3 hr ago',
    actions: ['Bulk rebalance', 'Snooze'],
  },
  {
    id: 'p4',
    severity: 'fyi',
    icon: 'zap',
    title: 'TLH window closes in 4 days',
    body: '$48K in harvestable losses across 7 clients. Est. tax savings: $17.8K. Copilot can stage the trades and queue the compliance check.',
    affected: ['7 clients'],
    source: 'Tax engine',
    age: '6 hr ago',
    actions: ['Stage TLH trades', 'Review opportunities'],
  },
  {
    id: 'p5',
    severity: 'fyi',
    icon: 'newspaper',
    title: 'RBI policy review next Tuesday — prep talking points?',
    body: 'Copilot can pre-draft a client-ready commentary that you can publish after the RBI decision. Takes ~2 min.',
    affected: ['All HNI clients'],
    source: 'RBI calendar',
    age: 'Today',
    actions: ['Draft commentary template', 'Mark reviewed'],
  },
];

/**
 * Saved, reusable queries
 */
export const SAVED_QUERIES: SavedQuery[] = [
  { id: 'q1', text: 'Clients with >10% US tech I haven\'t spoken to in 60 days', pinned: true },
  { id: 'q2', text: 'Which clients beat their benchmark YTD?', pinned: true },
  { id: 'q3', text: 'Clients with drift > 5% in the last week', pinned: false },
  { id: 'q4', text: 'Unrealized losses over $5K by client', pinned: false },
  { id: 'q5', text: 'UHNI clients without an updated IPS in 12 months', pinned: false },
];

/**
 * Live transcript from a meeting (streams in over time)
 */
export const LIVE_TRANSCRIPT: LiveTranscriptEntry[] = [
  { who: 'Sarah', text: "Thanks for jumping on. I saw the note — we're ahead of the benchmark?", t: 0 },
  { who: 'Vijay', text: "Yes — up 8.2% year-to-date versus 6.4% for a 60/40 blend. Most of the outperformance is tech.", t: 2500 },
  { who: 'Sarah', text: "Great. That actually worries me a bit — is it too much tech now?", t: 6000 },
  { who: 'Vijay', text: "You're right to ask. Tech drifted about 6 points above target. I'd like to trim NVDA and VTI and move into BND.", t: 9000 },
  { who: 'Sarah', text: "Okay. Will there be tax impact?", t: 13500 },
  { who: 'Vijay', text: "Short-term gains on NVDA would hit. But there's a $11K loss in your Apple lot we can harvest to offset.", t: 16500 },
  { who: 'Sarah', text: "Perfect. Do it. Oh — and Maya starts looking at colleges next year. Can we talk 529s at our next call?", t: 22000 },
  { who: 'Vijay', text: "Absolutely. I'll set up a 529 review and loop in our tax partner.", t: 27500 },
];

/**
 * Run a query against the "book" (all client data)
 * This is a deterministic demo function that returns appropriate results based on query text
 */
export const runBookQuery = (q: string): BookQueryResult => {
  const ql = q.toLowerCase();

  if (/tech|nvda|aapl|contact|spoken|60.?day/.test(ql)) {
    return {
      headline: '4 of 6 clients match',
      subtitle: 'Tech weight > 10% and last contact > 60 days',
      rows: [
        { name: 'Marcus Reid', tech: '32.1%', lastContact: '73 days ago', action: 'High' },
        { name: 'Priya Nair', tech: '24.8%', lastContact: '61 days ago', action: 'High' },
        { name: 'Sarah Chen', tech: '18.4%', lastContact: '58 days ago', action: 'Watch' },
        { name: 'Rohan Mehta', tech: '15.2%', lastContact: '67 days ago', action: 'Watch' },
      ],
      cols: ['Client', 'Tech %', 'Last contact', 'Priority'],
    };
  }

  if (/beat|benchmark|ytd|outperform/.test(ql)) {
    return {
      headline: '6 of 6 clients beat their benchmark YTD',
      subtitle: 'Across Balanced Growth, Aggressive Growth, and Endowment blends',
      rows: [
        { name: 'Marcus Reid', ytd: '+14.6%', bench: '+9.1%', delta: '+5.5pp' },
        { name: 'Lin Zhao', ytd: '+11.8%', bench: '+8.6%', delta: '+3.2pp' },
        { name: 'Rohan Mehta', ytd: '+9.4%', bench: '+6.4%', delta: '+3.0pp' },
        { name: 'Sarah Chen', ytd: '+8.2%', bench: '+6.4%', delta: '+1.8pp' },
        { name: 'Anika Patel', ytd: '+4.1%', bench: '+5.2%', delta: '−1.1pp' },
        { name: 'David Goldberg', ytd: '+3.4%', bench: '+4.0%', delta: '−0.6pp' },
      ],
      cols: ['Client', 'YTD', 'Benchmark', 'Excess'],
    };
  }

  if (/drift|above.?5|threshold/.test(ql)) {
    return {
      headline: '3 clients crossed drift threshold',
      subtitle: 'Drift > 5% vs target allocation',
      rows: [
        { name: 'Marcus Reid', drift: '11.2%', model: 'Aggressive Growth' },
        { name: 'Rohan Mehta', drift: '5.7%', model: 'Balanced Growth' },
        { name: 'Lin Zhao', drift: '5.2%', model: 'Endowment Growth' },
      ],
      cols: ['Client', 'Drift', 'Model'],
    };
  }

  if (/loss|unreali|tlh|harvest/.test(ql)) {
    return {
      headline: '$48K total harvestable losses across 7 lots',
      subtitle: 'Estimated net-of-fee tax savings: $17.8K',
      rows: [
        { name: 'Sarah Chen', loss: '$11,240', lot: 'AAPL · 2024 lot' },
        { name: 'Marcus Reid', loss: '$14,802', lot: 'META · 2023 lot' },
        { name: 'Priya Nair', loss: '$8,610', lot: 'NFLX · 2024 lot' },
        { name: 'Rohan Mehta', loss: '$6,420', lot: 'TSLA · 2023 lot' },
        { name: 'Lin Zhao', loss: '$7,120', lot: 'AMD · 2024 lot' },
      ],
      cols: ['Client', 'Unrealized loss', 'Lot'],
    };
  }

  if (/ips|prospectus|document|outdated|12.?month/.test(ql)) {
    return {
      headline: '2 UHNI clients have outdated IPS',
      subtitle: 'Last updated more than 12 months ago',
      rows: [
        { name: 'Marcus Reid', updated: '14 months ago', segment: 'UHNI' },
        { name: 'Lin Zhao', updated: '18 months ago', segment: 'UHNI' },
      ],
      cols: ['Client', 'Last IPS update', 'Segment'],
    };
  }

  // Fallback result
  return {
    headline: `${Math.min(CLIENTS.length, 3)} clients match`,
    subtitle: 'Based on the current book snapshot',
    rows: CLIENTS.slice(0, 3).map((c) => ({
      name: c.name,
      aum: `$${(c.aum / 1e6).toFixed(1)}M`,
      model: c.model,
    })),
    cols: ['Client', 'AUM', 'Model'],
  };
};
