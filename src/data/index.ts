/**
 * Data barrel export
 * Re-exports everything from all data modules for convenient importing
 */

export { CLIENTS, HOLDINGS, TOTAL_AUM, fmtMoney, fmtPct } from './clients';
export { TEMPLATES, HISTORY_ITEMS, SUGGESTIONS, INSIGHTS } from './templates';
export { MEETINGS, PULSE_EVENTS, SAVED_QUERIES, LIVE_TRANSCRIPT, runBookQuery } from './meetings';
export { SRC, SEED } from './trust';
export { FOLLOW_UP_INTENTS, resolveFollowUp } from './intents';
export { BRIEFING_ITEMS, DAILY_SUMMARY } from './briefing';
export { STAGED_ACTIONS } from './autopilot';
export { COMPLIANCE_CHECKS, COMPLIANCE_FILINGS, RESTRICTION_LIST, COMPLIANCE_SUMMARY } from './compliance';
export { MODEL_PORTFOLIOS } from './models';
export { CAMPAIGNS, CAMPAIGN_TEMPLATES } from './campaigns';
export { CLIENT_ACTIVITIES, CLIENT_ACTION_ITEMS } from './clientActivity';
