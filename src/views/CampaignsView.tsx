import React, { useState, useMemo } from 'react';
import {
  IconMail,
  IconPlus,
  IconSparkles,
  IconUsers,
  IconSend,
  IconEdit,
  IconCopy,
  IconTarget,
  IconClock,
  IconLayers,
  IconZap,
  IconChevronDown,
} from '@/components/icons';
import { Badge, Button, Card, KPI } from '@/components/ui';
import { CAMPAIGNS, CAMPAIGN_TEMPLATES } from '@/data/campaigns';
import { CLIENTS } from '@/data/clients';
import type { Campaign } from '@/types';

/* ---------- helpers ---------- */
const statusTone = (s: Campaign['status']) =>
  ({ draft: 'neutral', scheduled: 'brand', sent: 'success', paused: 'warn' } as const)[s];

const typeTone = (t: Campaign['type']) =>
  ({ 'market-update': 'brand', 'review-reminder': 'purple', 'tax-alert': 'danger', custom: 'neutral' } as const)[t];

const typeLabel = (t: Campaign['type']) =>
  ({ 'market-update': 'Market Update', 'review-reminder': 'Review Reminder', 'tax-alert': 'Tax Alert', custom: 'Custom' } as const)[t];

const fmtDate = (iso?: string) => iso ? new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '';

/* ---------- sample AI personalizations ---------- */
const PERSONALIZATIONS: Record<string, Array<{ name: string; preview: string }>> = {
  'cmp-1': [
    { name: 'Sarah Chen', preview: 'Dear Sarah, your portfolio returned +8.2% YTD, outperforming the benchmark by 1.8pp. With Helio Labs\u2019 upcoming IPO timeline, we see an opportunity to diversify your concentrated tech position into tax-efficient municipal bonds...' },
    { name: 'Marcus Reid', preview: 'Dear Marcus, exceptional quarter \u2014 your aggressive growth allocation delivered +14.6% YTD, beating the benchmark by 5.5pp. Given Northwind\u2019s recent Series C, let\u2019s discuss hedging strategies for your founder shares...' },
    { name: 'Lin Zhao', preview: 'Dear Lin, the Zhao Family Trust returned +11.8% YTD. With the endowment model\u2019s 5.7% drift, I recommend a rebalance into international equities to capture the emerging market recovery...' },
  ],
  'cmp-2': [
    { name: 'Anika Patel', preview: 'Hi Anika, it\u2019s been 97 days since our last portfolio review. Your conservative allocation has been steady at +4.1%, and I\u2019d love to discuss adjusting your bond ladder ahead of the rate decision...' },
    { name: 'David Goldberg', preview: 'Hi David, it\u2019s been 47 days since our annual review. With your capital preservation focus and the new grandchild, let\u2019s revisit the 529 plan setup we discussed...' },
  ],
  'cmp-3': [
    { name: 'Sarah Chen', preview: 'Dear Sarah, our analysis found approximately $18K in tax-loss harvesting opportunities in your AAPL position. Acting before Dec 31 could offset your Helio Labs RSU gains...' },
    { name: 'Rohan Mehta', preview: 'Dear Rohan, we identified ~$12K in harvestable losses across your international holdings. Combined with your business income timing, this could save an estimated $4,200 in taxes...' },
  ],
};

/* ---------- filter tabs ---------- */
type StatusFilter = 'all' | Campaign['status'];
const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all', label: 'All' }, { id: 'draft', label: 'Draft' },
  { id: 'scheduled', label: 'Scheduled' }, { id: 'sent', label: 'Sent' }, { id: 'paused', label: 'Paused' },
];

/* ================================================================
   CampaignCard
   ================================================================ */
const CampaignCard: React.FC<{
  c: Campaign;
  expanded: boolean;
  onToggle: () => void;
  onStatusChange: (id: string, s: Campaign['status']) => void;
}> = ({ c, expanded, onToggle, onStatusChange }) => {
  const tpl = CAMPAIGN_TEMPLATES.find((t) => t.id === c.template);
  const personalizations = PERSONALIZATIONS[c.id];

  return (
    <Card className="p-0 overflow-hidden fade-up">
      {/* main row */}
      <button onClick={onToggle} className="w-full text-left p-4 hover:bg-slate-50/60 transition">
        <div className="flex items-center gap-4">
          <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 ${c.status === 'sent' ? 'bg-emerald-50' : 'bg-brand-50'}`}>
            <IconMail size={18} stroke={c.status === 'sent' ? '#059669' : '#1B8AD8'} strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900">{c.name}</span>
              <Badge tone={typeTone(c.type)}>{typeLabel(c.type)}</Badge>
              <Badge tone={statusTone(c.status)}>{c.status}</Badge>
              {c.personalized && (
                <Badge tone="brand" className="gap-1">
                  <IconSparkles size={10} stroke="currentColor" /> AI Personalized
                </Badge>
              )}
            </div>
            <div className="text-[12.5px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <IconUsers size={12} stroke="#94A3B8" />
              <span>{c.recipientCount} clients</span>
              <span className="text-slate-300">&middot;</span>
              <span>{c.recipientFilter}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            {c.status === 'sent' && c.openRate != null && (
              <div className="text-right">
                <div className="text-[11px] text-slate-500">Open rate</div>
                <div className="flex items-center gap-2">
                  <div className="w-20 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${c.openRate}%` }} />
                  </div>
                  <span className="text-xs font-semibold text-slate-700">{c.openRate.toFixed(1)}%</span>
                </div>
              </div>
            )}
            {c.status === 'scheduled' && c.scheduledFor && (
              <div className="flex items-center gap-1.5 text-xs text-brand-600">
                <IconClock size={13} stroke="currentColor" />
                {fmtDate(c.scheduledFor)}
              </div>
            )}
            <IconChevronDown size={16} stroke="#94A3B8" className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </div>
        </div>
      </button>

      {/* action bar */}
      <div className="flex items-center gap-2 px-4 pb-3 -mt-1">
        <Button kind="ghost" size="sm"><IconEdit size={13} /> Edit</Button>
        <Button kind="ghost" size="sm"><IconCopy size={13} /> Duplicate</Button>
        {(c.status === 'draft' || c.status === 'scheduled') && (
          <Button kind="primary" size="sm" onClick={(e) => { e.stopPropagation(); onStatusChange(c.id, 'sent'); }}>
            <IconSend size={13} /> Send now
          </Button>
        )}
        {c.status === 'scheduled' && (
          <Button kind="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onStatusChange(c.id, 'paused'); }}>
            Pause
          </Button>
        )}
      </div>

      {/* expanded detail */}
      {expanded && (
        <div className="border-t border-slate-100 p-5 bg-slate-50/40 space-y-4 fade-up">
          {tpl && (
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Template</div>
              <div className="text-sm font-medium text-slate-800">{tpl.name}</div>
              <div className="text-[12.5px] text-slate-500 mt-0.5">Subject: {tpl.subject}</div>
              <div className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">{tpl.bodyPreview}</div>
            </div>
          )}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Recipients preview</div>
            <div className="text-[13px] text-slate-700">
              {CLIENTS.slice(0, 3).map((cl) => cl.name).join(', ')}
              {c.recipientCount > 3 && <span className="text-slate-500"> and {c.recipientCount - 3} more</span>}
            </div>
          </div>

          {/* AI personalization showcase */}
          {c.personalized && personalizations && (
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <IconSparkles size={14} stroke="#2FA4F9" />
                <span className="text-[11px] uppercase tracking-wider font-semibold text-brand-600">
                  AI writes unique content per client
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {personalizations.map((p) => (
                  <div key={p.name} className="rounded-xl border border-brand-200 bg-white p-3.5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-brand-400 to-violet-400" />
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <IconSparkles size={11} stroke="#2FA4F9" />
                      <span className="text-[11.5px] font-semibold text-brand-700">For {p.name}</span>
                    </div>
                    <div className="text-[12.5px] text-slate-600 leading-relaxed">{p.preview}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

/* ================================================================
   CampaignsView
   ================================================================ */
export const CampaignsView: React.FC = () => {
  const [tab, setTab] = useState<'campaigns' | 'templates'>('campaigns');
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [campaigns, setCampaigns] = useState(CAMPAIGNS);

  const handleStatusChange = (id: string, status: Campaign['status']) => {
    setCampaigns((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status, ...(status === 'sent' ? { sentAt: new Date().toISOString(), openRate: 0 } : {}) } : c)),
    );
  };

  const filtered = useMemo(
    () => (filter === 'all' ? campaigns : campaigns.filter((c) => c.status === filter)),
    [campaigns, filter],
  );

  /* KPIs */
  const active = campaigns.filter((c) => c.status !== 'draft').length;
  const reached = campaigns.filter((c) => c.status === 'sent').reduce((a, c) => a + c.recipientCount, 0);
  const sentWithRate = campaigns.filter((c) => c.status === 'sent' && c.openRate != null);
  const avgOpen = sentWithRate.length ? sentWithRate.reduce((a, c) => a + (c.openRate ?? 0), 0) / sentWithRate.length : 0;
  const aiCount = campaigns.filter((c) => c.personalized).length;

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* header */}
      <div className="flex items-center justify-between mb-6 fade-up">
        <div>
          <div className="flex items-center gap-2">
            <IconMail size={22} stroke="#2FA4F9" strokeWidth={2} />
            <h1 className="text-2xl font-bold text-slate-900">Campaigns</h1>
          </div>
          <p className="text-slate-500 text-sm mt-1">AI-personalized outbound communications</p>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="secondary"><IconLayers size={14} /> Templates</Button>
          <Button kind="primary"><IconPlus size={14} /> New campaign</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6 fade-up">
        <KPI label="Active campaigns" value={active} sub="non-draft" accent="#2FA4F9" />
        <KPI label="Recipients reached" value={reached} sub="sent campaigns" accent="#10B981" />
        <KPI label="Avg open rate" value={`${avgOpen.toFixed(1)}%`} sub="across sent" accent="#F59E0B" />
        <KPI label="AI personalized" value={aiCount} sub={`of ${campaigns.length} campaigns`} accent="#2FA4F9" />
      </div>

      {/* tab bar */}
      <div className="border-b border-slate-200 mb-5 fade-up">
        <div className="flex items-center gap-0.5">
          {(['campaigns', 'templates'] as const).map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px capitalize ${
                  active ? 'border-brand-500 text-brand-700' : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>
      </div>

      {/* CAMPAIGNS TAB */}
      {tab === 'campaigns' && (
        <div className="space-y-4 fade-up">
          {/* status filter */}
          <div className="flex items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`px-3 py-1.5 rounded-full text-[12px] font-medium transition ${
                  filter === f.id ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* campaign list */}
          <div className="space-y-3">
            {filtered.map((c) => (
              <CampaignCard
                key={c.id}
                c={c}
                expanded={expandedId === c.id}
                onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
                onStatusChange={handleStatusChange}
              />
            ))}
            {filtered.length === 0 && (
              <div className="text-center py-12 text-slate-500 text-sm">
                No campaigns match this filter.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEMPLATES TAB */}
      {tab === 'templates' && (
        <div className="grid grid-cols-2 gap-4 fade-up">
          {CAMPAIGN_TEMPLATES.map((t) => (
            <Card key={t.id} className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-slate-900 text-sm">{t.name}</span>
                <Badge tone={typeTone(t.type as Campaign['type'])}>{typeLabel(t.type as Campaign['type'])}</Badge>
              </div>
              <div className="text-[12.5px] text-slate-500 mb-1">Subject: {t.subject}</div>
              <div className="text-[12.5px] text-slate-600 leading-relaxed line-clamp-2">{t.bodyPreview}</div>
              <div className="mt-3">
                <Button kind="secondary" size="sm"><IconZap size={13} /> Use template</Button>
              </div>
            </Card>
          ))}
          {/* create template card */}
          <button className="rounded-2xl border-2 border-dashed border-slate-200 p-5 flex flex-col items-center justify-center gap-2 hover:border-brand-300 hover:bg-brand-50/30 transition min-h-[140px]">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <IconPlus size={18} stroke="#64748B" />
            </div>
            <span className="text-sm font-medium text-slate-600">Create template</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default CampaignsView;
