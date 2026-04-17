'use client';

import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

import * as I from '@/components/icons';
import { Badge, Card, SectionTitle, Avatar } from '@/components/ui';
import { CLIENTS, HOLDINGS, TEMPLATES, SUGGESTIONS, INSIGHTS, TOTAL_AUM, fmtMoney, fmtPct } from '@/data';
import type { Client, HistoryItem } from '@/types';

/**
 * Template card component
 */
interface TemplateCardProps {
  tpl: (typeof TEMPLATES)[0];
  idx: number;
  onClick: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ tpl, idx, onClick }) => {
  const IconC = I.iconMap[tpl.icon] || I.IconSparkles;

  return (
    <button
      onClick={onClick}
      className={`fade-up fade-up-${idx + 1} bg-white rounded-2xl elev-1 p-4 text-left hover:elev-2 hover:-translate-y-0.5 transition-all ripple group`}
    >
      <div
        className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0 mb-3"
        style={{ background: `${tpl.accent}18` }}
      >
        <IconC size={20} stroke={tpl.accent} sw={2} />
      </div>
      <h3 className="text-[13.5px] font-semibold text-slate-900 group-hover:text-brand-700 transition">
        {tpl.title}
      </h3>
      <p className="text-[12px] text-slate-500 mt-1">{tpl.hint}</p>
    </button>
  );
};

/**
 * Prompt input with context chips and slash command support
 */
interface PromptInputProps {
  value: string;
  setValue: (v: string) => void;
  onSubmit: (text: string, chips: any[]) => void;
  contextChips: any[];
  setContextChips: (chips: any[]) => void;
}

const PromptInput: React.FC<PromptInputProps> = ({
  value,
  setValue,
  onSubmit,
  contextChips,
  setContextChips,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim()) {
      onSubmit(value.trim(), contextChips);
      setValue('');
    }
  };

  const handleContextChipClick = (index: number) => {
    // Open chip editor (simplified for now)
    const chip = contextChips[index];
    const newValue = prompt(`Edit ${chip.label}:`, chip.value);
    if (newValue) {
      const updated = [...contextChips];
      updated[index].value = newValue;
      setContextChips(updated);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 elev-1 overflow-hidden">
      <div className="flex items-center px-4 py-2 border-b border-slate-100">
        {contextChips.map((chip, i) => (
          <button
            key={i}
            onClick={() => handleContextChipClick(i)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-50 hover:bg-slate-100 text-[10.5px] text-slate-600 mr-2 transition"
          >
            <span className="text-slate-400">{chip.label}:</span>
            <span className="font-medium">{chip.value}</span>
          </button>
        ))}
      </div>
      <div className="flex items-center px-4 py-3 gap-3">
        <I.IconSparkles size={16} stroke="#2FA4F9" />
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything — or start with / for templates…"
          className="flex-1 text-[14px] outline-none placeholder:text-slate-400 bg-transparent"
        />
      </div>
    </div>
  );
};

/**
 * KPI card component
 */
interface KPICardProps {
  label: string;
  value: string | number;
  delta?: string;
  accent: string;
}

const KPICard: React.FC<KPICardProps> = ({ label, value, delta, accent }) => (
  <Card className="p-4">
    <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">{label}</div>
    <div className="text-2xl font-bold text-slate-900 mt-2">{value}</div>
    {delta && <div className="text-[12px] text-slate-500 mt-1">{delta}</div>}
  </Card>
);

/**
 * Client leaderboard row
 */
interface LeaderboardRowProps {
  client: Client;
  idx: number;
}

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ client, idx }) => {
  const diff = client.ytd - client.bench;
  const diffSign = diff >= 0 ? '+' : '';

  return (
    <tr className="border-b border-slate-50 hover:bg-slate-50/60 transition">
      <td className="py-3 pl-0">
        <div className="flex items-center gap-3">
          <div className="text-[12px] font-semibold text-slate-400 w-6 text-right">{idx + 1}</div>
          <Avatar initials={client.initials} color={client.avatar} />
          <div className="flex-1 min-w-0">
            <div className="text-[13px] font-semibold text-slate-900">{client.name}</div>
            <div className="text-[11px] text-slate-500">{client.role}</div>
          </div>
        </div>
      </td>
      <td className="py-3 text-right tabular-nums">
        <div className="text-[13px] font-semibold text-slate-900">{fmtPct(client.ytd, 1)}</div>
      </td>
      <td className="py-3 text-right tabular-nums">
        <div className="text-[13px] text-slate-500">{fmtPct(client.bench, 1)}</div>
      </td>
      <td className="py-3 text-right tabular-nums">
        <div className={`text-[13px] font-semibold ${diff >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {diffSign}{fmtPct(diff, 1)}
        </div>
      </td>
    </tr>
  );
};

/**
 * Holding heatmap item
 */
interface HoldingGridItemProps {
  holding: (typeof HOLDINGS)[0];
}

const HoldingGridItem: React.FC<HoldingGridItemProps> = ({ holding }) => {
  const isPositive = holding.day >= 0;
  const bgIntensity = Math.min(Math.abs(holding.day) * 10, 100) / 100;
  const bgColor = isPositive
    ? `rgba(16, 185, 129, ${bgIntensity * 0.3 + 0.1})`
    : `rgba(244, 63, 94, ${bgIntensity * 0.3 + 0.1})`;

  return (
    <div
      className="rounded-xl p-3 ripple cursor-pointer transition border border-slate-100 hover:border-slate-200"
      style={{ background: bgColor }}
    >
      <div className="text-[12px] font-semibold text-slate-800">{holding.tk}</div>
      <div className="text-[11px] text-slate-600 mt-0.5">{holding.weight.toFixed(1)}%</div>
      <div
        className={`text-[14px] font-bold mt-1 ${isPositive ? 'text-emerald-700' : 'text-rose-700'}`}
      >
        {isPositive ? '+' : ''}{fmtPct(holding.day, 1)}
      </div>
    </div>
  );
};

/**
 * HomeView Props
 */
interface HomeViewProps {
  openTemplate: (templateId: string, client?: Client | null, titleOverride?: string) => void;
  setPrompt: (p: string) => void;
  prompt: string;
  recents: HistoryItem[];
  openHistory: (h: HistoryItem) => void;
  openTemplateFromPrompt: (text: string, chips: any[]) => void;
  setView: (view: string) => void;
}

/**
 * HomeView component
 */
const HomeView: React.FC<HomeViewProps> = ({
  openTemplate,
  setPrompt,
  prompt,
  recents,
  openHistory,
  openTemplateFromPrompt,
  setView,
}) => {
  const [contextChips, setContextChips] = useState([
    { label: 'Period', value: 'YTD 2026' },
    { label: 'Book', value: 'My clients (6)' },
  ]);

  const handlePromptSubmit = (text: string) => {
    openTemplateFromPrompt(text, contextChips);
  };

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  })();

  // Calculate KPIs
  const avgYtd = (CLIENTS.reduce((sum, c) => sum + c.ytd, 0) / CLIENTS.length).toFixed(1);
  const largestDrift = Math.max(...CLIENTS.map((c) => c.drift));
  const activeAlerts = INSIGHTS.filter((i) => i.tone === 'warn').length;

  // Prepare pie chart data for AUM distribution
  const pieData = CLIENTS.map((c) => ({
    name: c.initials,
    value: c.aum,
    color: c.avatar,
  }));

  return (
    <div className="max-w-5xl mx-auto px-8 py-10">
      {/* Morning Briefing Banner */}
      <div className="mb-5">
        <div className="rounded-xl bg-brand-50 border border-brand-200 px-4 py-3 flex items-center gap-3">
          <I.IconSparkles size={16} stroke="#2FA4F9" />
          <span className="text-[13px] text-slate-700 flex-1">
            Your morning briefing is ready <span className="text-slate-400 mx-1">&middot;</span> <span className="font-semibold text-slate-900">2 critical items</span>, <span className="font-semibold text-slate-900">6 automatable</span>
          </span>
          <button onClick={() => setView('briefing')} className="text-[12.5px] font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white/60 transition">
            Open briefing <I.IconArrowRight size={12} sw={2.4} />
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="fade-up fade-up-1 mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-[34px] font-bold tracking-tight text-slate-900">
            {greeting}, <span className="gradient-text">Vijay</span>
          </h1>
          <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100 text-[10.5px] font-bold tracking-wide uppercase text-brand-700">
            <span className="relative h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
            v3 is live
          </span>
        </div>
        <p className="text-slate-500 mt-1">What would you like Copilot to help you with today?</p>
      </div>

      {/* What's New Banner */}
      <div className="fade-up fade-up-1 mb-6">
        <div className="rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50/50 to-violet-50/30 p-4 flex items-start gap-4">
          <div className="h-10 w-10 rounded-xl bg-white elev-1 flex items-center justify-center shrink-0">
            <I.IconSparkles size={18} stroke="#2FA4F9" sw={2.2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[13px] font-semibold text-slate-900">What's new in v3</span>
              <Badge tone="brand">beta</Badge>
            </div>
            <div className="text-[12.5px] text-slate-600 mt-1 leading-relaxed">
              Meetings workflow (Prep → Live → Capture → Follow-through) · Ask my Book · Book Pulse ·
              Compliance co-pilot · Onboarding · Playbooks · Explainability.
            </div>
          </div>
          <button className="text-[12px] font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white ripple shrink-0">
            Take a tour <I.IconArrowRight size={12} sw={2.4} />
          </button>
        </div>
      </div>

      {/* Prompt Input & Suggestions */}
      <div className="fade-up fade-up-2 mb-8">
        <PromptInput
          value={prompt}
          setValue={setPrompt}
          onSubmit={handlePromptSubmit}
          contextChips={contextChips}
          setContextChips={setContextChips}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {SUGGESTIONS.map((s, i) => (
            <button
              key={i}
              onClick={() => setPrompt(s)}
              className="text-[12px] px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-600 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 ripple transition"
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Copilot Predictions */}
      <div className="mt-10 mb-10">
        <SectionTitle
          icon={I.IconSparkles}
          title="Copilot predictions"
          action={<Badge tone="brand">AI-powered</Badge>}
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Prediction 1 */}
          <Card className="p-4 border-l-4 border-l-brand-500">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                <I.IconSparkles size={16} stroke="#2FA4F9" sw={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-slate-900">Sarah Chen's annual review is in 18 days</div>
                <div className="text-[12px] text-slate-500 mt-1">Brief is 60% pre-built &middot; 3 talking points ready</div>
                <button className="mt-3 text-[12px] font-semibold text-brand-700 hover:text-brand-800 inline-flex items-center gap-1">
                  Preview brief <I.IconArrowRight size={11} sw={2.4} />
                </button>
              </div>
            </div>
          </Card>
          {/* Prediction 2 */}
          <Card className="p-4 border-l-4 border-l-violet-500">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-violet-50 flex items-center justify-center shrink-0">
                <I.IconSparkles size={16} stroke="#7C3AED" sw={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-slate-900">Fed meeting next Wednesday</div>
                <div className="text-[12px] text-slate-500 mt-1">May impact 4 clients in your book &middot; Hedges pre-analyzed</div>
                <button className="mt-3 text-[12px] font-semibold text-violet-700 hover:text-violet-800 inline-flex items-center gap-1">
                  View analysis <I.IconArrowRight size={11} sw={2.4} />
                </button>
              </div>
            </div>
          </Card>
          {/* Prediction 3 */}
          <Card className="p-4 border-l-4 border-l-emerald-500">
            <div className="flex items-start gap-3">
              <div className="h-9 w-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                <I.IconSparkles size={16} stroke="#059669" sw={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13.5px] font-semibold text-slate-900">Q2 compliance filing due in 11 days</div>
                <div className="text-[12px] text-slate-500 mt-1">3 of 5 sections auto-filled by Copilot</div>
                <button className="mt-3 text-[12px] font-semibold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1">
                  Review filing <I.IconArrowRight size={11} sw={2.4} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Template Cards */}
      <div className="mt-10 mb-10">
        <SectionTitle
          icon={I.IconLayers}
          title="Start from a template"
          action={
            <button className="text-xs text-slate-500 hover:text-brand-600 inline-flex items-center gap-1">
              View all <I.IconArrowRight size={11} />
            </button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {TEMPLATES.map((t, i) => (
            <TemplateCard key={t.id} tpl={t} idx={i} onClick={() => openTemplate(t.id)} />
          ))}
        </div>
      </div>

      {/* Book Snapshot KPIs */}
      <div className="mt-10 mb-10">
        <SectionTitle icon={I.IconPulse} title="Book snapshot" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <KPICard label="Total AUM" value={fmtMoney(TOTAL_AUM)} accent="#2FA4F9" />
          <KPICard label="Avg YTD" value={fmtPct(parseFloat(avgYtd), 1)} accent="#10B981" />
          <KPICard label="Largest drift" value={`${largestDrift}%`} accent="#F59E0B" />
          <KPICard label="Active alerts" value={activeAlerts} accent="#EC4899" />
        </div>
      </div>

      {/* Main Grid: Leaderboard + Insights + History */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Leaderboard + Heatmap */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Leaderboard */}
          <div>
            <SectionTitle
              icon={I.IconUsers}
              title="Top performers YTD"
              action={<Badge tone="brand">Top 6 clients</Badge>}
            />
            <Card className="overflow-hidden">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50">
                    <th className="py-3 px-4 font-semibold">Client</th>
                    <th className="py-3 px-4 font-semibold text-right">YTD</th>
                    <th className="py-3 px-4 font-semibold text-right">Bench</th>
                    <th className="py-3 px-4 font-semibold text-right">Excess</th>
                  </tr>
                </thead>
                <tbody>
                  {CLIENTS.map((c, i) => (
                    <LeaderboardRow key={c.id} client={c} idx={i} />
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Holdings Heatmap */}
          <div>
            <SectionTitle
              icon={I.IconFlame}
              title="Holdings heatmap (daily)"
              action={<span className="text-xs text-slate-500">Green = up, Red = down</span>}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
              {HOLDINGS.map((h) => (
                <HoldingGridItem key={h.tk} holding={h} />
              ))}
            </div>
          </div>
        </div>

        {/* Right: Ring Chart + Insights */}
        <div className="space-y-6">
          {/* AUM Ring Chart */}
          <div>
            <SectionTitle icon={I.IconPie} title="AUM by client" />
            <Card className="p-4">
              <div className="relative h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={2}
                      isAnimationActive={false}
                    >
                      {pieData.map((d, i) => (
                        <Cell key={i} fill={d.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: any) => {
                        const pct = ((value / TOTAL_AUM) * 100).toFixed(0);
                        return `${pct}%`;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-3 space-y-1.5">
                {CLIENTS.map((c) => {
                  const pct = ((c.aum / TOTAL_AUM) * 100).toFixed(0);
                  return (
                    <div key={c.id} className="flex items-center text-[12px]">
                      <span
                        className="h-2 w-2 rounded-sm mr-2 shrink-0"
                        style={{ background: c.avatar }}
                      />
                      <span className="text-slate-600 flex-1 truncate">{c.initials}</span>
                      <span className="font-semibold text-slate-900 w-10 text-right">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Insights */}
          <div>
            <SectionTitle
              icon={I.IconPulse}
              title="Insights for you"
              action={<Badge tone="brand">Updated 6 min ago</Badge>}
            />
            <div className="space-y-2">
              {INSIGHTS.map((ins, i) => {
                const tones = {
                  warn: { bar: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700' },
                  info: { bar: '#2FA4F9', bg: 'bg-brand-50', text: 'text-brand-700' },
                  success: { bar: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700' },
                };
                const t = tones[ins.tone];
                const IconC = I.iconMap[ins.icon] || I.IconAlert;

                return (
                  <div
                    key={i}
                    className={`fade-up fade-up-${i + 1} bg-white rounded-2xl elev-1 p-4 flex items-start gap-3 ripple hover:elev-2 hover:-translate-y-0.5 transition-all cursor-pointer`}
                  >
                    <div className={`h-10 w-10 rounded-xl ${t.bg} flex items-center justify-center shrink-0`}>
                      <IconC size={18} stroke={t.bar} sw={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-[13.5px]">{ins.title}</div>
                      <div className="text-[12.5px] text-slate-500 mt-0.5">{ins.body}</div>
                    </div>
                    <button
                      className={`text-[12px] font-semibold ${t.text} inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg hover:bg-white ripple shrink-0`}
                    >
                      {ins.cta} <I.IconArrowRight size={12} sw={2.4} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* History / Continue Where You Left Off */}
          <div>
            <SectionTitle icon={I.IconHistory} title="Continue where you left off" />
            <Card className="p-1.5">
              {recents.slice(0, 5).map((r) => (
                <button
                  key={r.id}
                  onClick={() => openHistory(r)}
                  className="w-full text-left px-3 py-2.5 rounded-xl hover:bg-slate-50 ripple group"
                >
                  <div className="text-[13px] font-medium text-slate-800 truncate group-hover:text-brand-700">
                    {r.title}
                  </div>
                  <div className="text-[11.5px] text-slate-400 mt-0.5">
                    {r.when}
                    {r.client ? ` · ${r.client}` : ''}
                  </div>
                </button>
              ))}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeView;
