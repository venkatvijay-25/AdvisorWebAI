import React from 'react';
import { ComingSoonView } from './ComingSoonView';
import { IconShield, IconRocket, IconBook, IconChat, IconCompass } from '@/components/icons';

export { ComplianceView } from '../ComplianceView';

export const OnboardingView: React.FC = () => (
  <ComingSoonView icon={IconRocket} title="Client onboarding" pitch="Turn a 3-hour onboarding call into a 20-minute conversation. Copilot does the paperwork." bullets={[
    'Guided risk profiling conversation — plain English in, IPS draft out.',
    'Auto-drafted IPS, KYC pack, and custody forms from the conversation.',
    'Live portfolio proposal with projections and fee disclosure.',
    'Handoff pack sent to ops — signatures and custody setup in one flow.',
  ]} />
);

export const PlaybooksView: React.FC = () => (
  <ComingSoonView icon={IconBook} title="Playbooks" pitch="Your best move, repeatable across the book. Save a sequence once, run it on every matching client." bullets={[
    'Record a sequence (e.g. "rebalance + TLH + recap email") as a playbook.',
    'Match a playbook against filter criteria and preview impact across clients.',
    'Run in bulk with per-client review — nothing fires without your nod.',
    'Version & share playbooks with your team; track usage and outcomes.',
  ]} />
);

export const CollaborationView: React.FC = () => (
  <ComingSoonView icon={IconChat} title="Team threads" pitch="Bring tax, estate, and ops into the same Copilot thread — context and decisions in one place." bullets={[
    'Mention teammates in a Copilot thread; they see the full context and artifacts.',
    'Tax, estate, and ops can contribute without duplicating the client record.',
    'Thread resolves into a decision log on the client timeline.',
    'Integrates with your existing messaging; no new inbox to watch.',
  ]} />
);

export const ExplainView: React.FC = () => (
  <ComingSoonView icon={IconCompass} title="Explainability center" pitch="See exactly why Copilot said what it said — and tune its behavior to your voice." bullets={[
    'Open any answer and see the model, prompts, tool calls, and source freshness.',
    'Adjust tone, verbosity, and risk language to match your advisory style.',
    'Side-by-side diff when you retry with different constraints or benchmarks.',
    'Firm-level guardrails your admin can lock down across all advisors.',
  ]} />
);
