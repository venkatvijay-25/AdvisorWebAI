/**
 * Core TypeScript interfaces for Copilot by flyerft.com
 * Wealth management data layer types
 */

/**
 * A client in the book
 */
export interface Client {
  id: string;
  name: string;
  role: string;
  segment: 'HNI' | 'UHNI';
  aum: number;
  ytd: number;
  bench: number;
  risk: string;
  model: string;
  drift: number;
  lastReview: string;
  avatar: string;
  initials: string;
}

/**
 * A portfolio holding
 */
export interface Holding {
  tk: string;
  name: string;
  weight: number;
  value: number;
  day: number;
  ytd: number;
}

/**
 * A template for generating advice/analysis
 */
export interface Template {
  id: string;
  icon: string;
  title: string;
  hint: string;
  accent: string;
  sample: string;
}

/**
 * A historical query or action item
 */
export interface HistoryItem {
  id: string;
  when: string;
  title: string;
  template: string;
  client: string | null;
}

/**
 * A suggested query/action (just a string)
 */
export type Suggestion = string;

/**
 * A key insight/alert to show the advisor
 */
export interface Insight {
  tone: 'warn' | 'info' | 'success';
  icon: string;
  title: string;
  body: string;
  cta: string;
}

/**
 * Meeting preparation data
 */
export interface MeetingPrep {
  talking: string[];
  artifacts: Array<{
    icon: string;
    title: string;
    type: string;
    size: string;
  }>;
}

/**
 * Meeting capture (notes after the meeting)
 */
export interface MeetingCapture {
  decisions: string[];
  objections: string[];
  lifeEvents: string[];
  actions: Array<{
    id: string;
    text: string;
    owner: string;
    due: string;
    done: boolean;
  }>;
}

/**
 * A scheduled meeting
 */
export interface Meeting {
  id: string;
  client: string;
  clientId: string;
  title: string;
  when: string;
  whenISO: string;
  status: 'upcoming' | 'past';
  duration: string;
  channel: string;
  attendees: string[];
  prep?: MeetingPrep;
  capture?: MeetingCapture;
}

/**
 * A real-time market/business event alert
 */
export interface PulseEvent {
  id: string;
  severity: 'urgent' | 'worth' | 'fyi';
  icon: string;
  title: string;
  body: string;
  affected: string[];
  source: string;
  age: string;
  actions: string[];
}

/**
 * A saved, reusable query
 */
export interface SavedQuery {
  id: string;
  text: string;
  pinned: boolean;
}

/**
 * Result from running a book query
 */
export interface BookQueryResult {
  headline: string;
  subtitle: string;
  rows: Record<string, any>[];
  cols: string[];
}

/**
 * A live transcript entry during a meeting
 */
export interface LiveTranscriptEntry {
  who: string;
  text: string;
  t: number;
}

/**
 * A data source (custody system, risk engine, etc.)
 */
export interface Source {
  id: string;
  title: string;
  kind: 'feed' | 'model' | 'benchmark' | 'engine' | 'policy' | 'crm';
  freshness: string;
  verified?: boolean;
}

/**
 * Per-template seed content with steps and artifacts
 */
export interface SeedContent {
  steps: Array<{
    label: string;
    src?: string;
  }>;
  sources: Source[];
  confidence: number;
  artifacts: Array<{
    icon: string;
    title: string;
    type: string;
    size: string;
  }>;
}

/**
 * A follow-up intent that can be matched and rendered
 */
export interface FollowUpIntent {
  id: string;
  match: RegExp;
  label: string;
  accent: string;
  steps: string[];
  summary: (ctx?: any) => any[];
  sources: Source[];
  render: (ctx?: any) => any;
  /** Optional structured summary data for rich visual rendering */
  structured?: (ctx?: any) => any;
}

/* ─────────────────────────────────────────────
   Differentiation feature types
   ───────────────────────────────────────────── */

/** Morning briefing priority item */
export interface BriefingItem {
  id: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'drift' | 'meeting' | 'market' | 'compliance' | 'tax' | 'review';
  icon: string;
  title: string;
  subtitle: string;
  clientId?: string;
  clientName?: string;
  estimatedTime: string;
  action: string;
  templateId?: string;
  automatable: boolean;
}

/** Staged autonomous action (autopilot queue) */
export interface StagedAction {
  id: string;
  type: 'rebalance' | 'tlh' | 'email' | 'compliance-filing' | 'crm-update' | 'meeting-prep';
  status: 'pending-approval' | 'approved' | 'rejected' | 'executed';
  title: string;
  description: string;
  clientIds: string[];
  impact: string;
  confidence: number;
  createdAt: string;
  steps: string[];
  artifacts?: Array<{ icon: string; title: string; type: string; size: string }>;
}

/** Compliance check item */
export interface ComplianceCheck {
  id: string;
  status: 'pass' | 'fail' | 'warning' | 'pending';
  rule: string;
  description: string;
  clientId?: string;
  clientName?: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  detectedAt: string;
  resolution?: string;
}

/** Compliance filing */
export interface ComplianceFiling {
  id: string;
  type: string;
  description: string;
  dueDate: string;
  status: 'overdue' | 'due-soon' | 'on-track' | 'filed';
  assignee: string;
}

/** Restriction list entry */
export interface RestrictionEntry {
  ticker: string;
  name: string;
  type: 'hard-block' | 'soft-limit' | 'watchlist';
  reason: string;
  appliesTo: 'all' | string[];
  expiresAt?: string;
}

/** Model portfolio definition */
export interface ModelPortfolio {
  id: string;
  name: string;
  description: string;
  riskLevel: 'Conservative' | 'Moderate' | 'Aggressive';
  targetReturn: number;
  allocations: Array<{ asset: string; weight: number; color: string }>;
  clientCount: number;
  totalAum: number;
  lastUpdated: string;
  manager: string;
}

/** Campaign for outbound communications */
export interface CampaignLinkClick {
  label: string;
  pct: number;
}

export interface CampaignReplySentiment {
  positive: number;
  neutral: number;
  negative: number;
}

export interface CampaignABVariant {
  subject: string;
  openRate: number;
  ctr: number;
}

export interface CampaignABTest {
  variantA: CampaignABVariant;
  variantB: CampaignABVariant;
  winner: 'A' | 'B';
}

export interface Campaign {
  id: string;
  name: string;
  type: 'market-update' | 'review-reminder' | 'tax-alert' | 'custom';
  status: 'draft' | 'scheduled' | 'sent' | 'paused';
  template: string;
  recipientCount: number;
  recipientFilter: string;
  scheduledFor?: string;
  sentAt?: string;
  openRate?: number;
  clickRate?: number;
  replyCount?: number;
  replySentiment?: CampaignReplySentiment;
  unsubscribes?: number;
  linkClicks?: CampaignLinkClick[];
  abTest?: CampaignABTest;
  engagementTimeline?: string;
  personalized: boolean;
}

/** Client activity event (for 360° hub timeline) */
export interface ClientActivity {
  id: string;
  clientId: string;
  type: 'trade' | 'meeting' | 'email' | 'alert' | 'review' | 'rebalance' | 'deposit' | 'withdrawal';
  title: string;
  description: string;
  timestamp: string;
  icon: string;
}

/** Client action item (for 360° hub) */
export interface ClientActionItem {
  id: string;
  clientId: string;
  text: string;
  source: string;
  dueDate?: string;
  status: 'open' | 'completed' | 'overdue';
}
