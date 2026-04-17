/**
 * Campaign data
 * Outbound communication campaigns and templates
 */

import type { Campaign } from '@/types';

/**
 * Active and past campaigns
 */
export const CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-1',
    name: 'Q1 2026 Market Commentary',
    type: 'market-update',
    status: 'sent',
    template: 'ct-1',
    recipientCount: 6,
    recipientFilter: 'All active clients',
    sentAt: '2026-04-02T09:00:00Z',
    openRate: 83.3,
    personalized: true,
  },
  {
    id: 'cmp-2',
    name: 'Q2 Review Scheduling',
    type: 'review-reminder',
    status: 'scheduled',
    template: 'ct-2',
    recipientCount: 4,
    recipientFilter: 'Clients with last review > 60 days ago',
    scheduledFor: '2026-04-21T08:00:00Z',
    personalized: true,
  },
  {
    id: 'cmp-3',
    name: 'Year-End Tax Planning Alert',
    type: 'tax-alert',
    status: 'draft',
    template: 'ct-3',
    recipientCount: 3,
    recipientFilter: 'Clients with harvestable losses > $5K',
    personalized: true,
  },
  {
    id: 'cmp-4',
    name: 'New Alternative Investment Offering',
    type: 'custom',
    status: 'sent',
    template: 'ct-4',
    recipientCount: 3,
    recipientFilter: 'UHNI clients + AUM > $5M',
    sentAt: '2026-03-20T10:00:00Z',
    openRate: 66.7,
    personalized: false,
  },
  {
    id: 'cmp-5',
    name: 'Retirement Planning Webinar Invite',
    type: 'custom',
    status: 'paused',
    template: 'ct-4',
    recipientCount: 2,
    recipientFilter: 'Clients age 55+ or with retirement goal',
    scheduledFor: '2026-04-14T08:00:00Z',
    personalized: false,
  },
];

/**
 * Reusable campaign templates
 */
export const CAMPAIGN_TEMPLATES = [
  {
    id: 'ct-1',
    name: 'Market Commentary',
    subject: 'Your Q{{quarter}} Market Update — {{advisorName}}',
    bodyPreview:
      'Dear {{clientName}}, here is your personalized market overview for the quarter. Your portfolio returned {{ytdReturn}} YTD, and we see several opportunities ahead...',
    type: 'market-update',
  },
  {
    id: 'ct-2',
    name: 'Review Reminder',
    subject: 'Time for Your Portfolio Check-In',
    bodyPreview:
      'Hi {{clientName}}, it has been {{daysSinceReview}} days since our last review. I would love to schedule 30 minutes to discuss your portfolio performance and any changes in your goals...',
    type: 'review-reminder',
  },
  {
    id: 'ct-3',
    name: 'Tax Planning Alert',
    subject: 'Tax-Saving Opportunity in Your Portfolio',
    bodyPreview:
      'Dear {{clientName}}, our analysis identified approximately {{harvestableAmount}} in tax-loss harvesting opportunities in your portfolio. Acting before the deadline could save you...',
    type: 'tax-alert',
  },
  {
    id: 'ct-4',
    name: 'General Announcement',
    subject: '{{subject}}',
    bodyPreview:
      'Dear {{clientName}}, I wanted to share an important update with you regarding {{topic}}. As your advisor, I believe this is relevant to your financial plan...',
    type: 'custom',
  },
];
