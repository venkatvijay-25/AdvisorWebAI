'use client';

import React, { useState, useEffect, useCallback } from 'react';
import * as I from '@/components/icons';
import { Avatar, Badge, Button, Card, SectionTitle } from '@/components/ui';
import { CLIENTS, TEMPLATES, fmtMoney, fmtPct } from '@/data';
import type { Client, Template } from '@/types';

interface BatchActionsViewProps {
  openTemplate: (templateId: string, client?: Client | null, title?: string) => void;
}

type BatchState = 'idle' | 'running' | 'complete';
type QuickFilter = 'all' | 'uhni' | 'hni' | 'high-drift' | 'underperforming';

const FILTERS: { key: QuickFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'uhni', label: 'UHNI only' },
  { key: 'hni', label: 'HNI only' },
  { key: 'high-drift', label: 'High drift (>5%)' },
  { key: 'underperforming', label: 'Underperforming' },
];

function filterClients(filter: QuickFilter): Client[] {
  switch (filter) {
    case 'uhni': return CLIENTS.filter(c => c.segment === 'UHNI');
    case 'hni': return CLIENTS.filter(c => c.segment === 'HNI');
    case 'high-drift': return CLIENTS.filter(c => c.drift > 5);
    case 'underperforming': return CLIENTS.filter(c => c.ytd < c.bench);
    default: return CLIENTS;
  }
}

function previewLine(tplId: string, c: Client): string {
  switch (tplId) {
    case 'rebalance':
      return `Drift ${c.drift}% → target 1.5% · ${Math.round(c.drift * 0.8)} trades`;
    case 'review':
      return `YTD ${fmtPct(c.ytd, 1, true)} vs bench ${fmtPct(c.bench, 1, true)} · ${Math.ceil(c.aum / 2_000_000) + 1} talking points`;
    case 'risk':
      return `Risk score ${Math.round(40 + c.drift * 4)}/100 · NVDA ${(c.aum / 800_000).toFixed(1)}% concentration`;
    case 'news':
      return `${Math.ceil(c.aum / 3_000_000) + 1} holdings impacted · ${c.ytd > c.bench ? 'net positive' : 'net negative'} exposure`;
    case 'tax':
      return `$${Math.round(c.aum * 0.012 / 1000)}K harvestable · ${Math.round(c.drift * 0.5) + 1} swap candidates`;
    case 'proposal':
      return `${c.model} model · ${c.risk} risk · ${fmtMoney(c.aum)} target AUM`;
    default:
      return `${fmtMoney(c.aum)} AUM · ${c.model}`;
  }
}

export const BatchActionsView: React.FC<BatchActionsViewProps> = ({ openTemplate }) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('all');
  const [batchState, setBatchState] = useState<BatchState>('idle');

  const filtered = filterClients(activeFilter);
  const tpl = TEMPLATES.find(t => t.id === selectedTemplate) ?? null;

  useEffect(() => {
    if (batchState === 'running') {
      const timer = setTimeout(() => setBatchState('complete'), 2000);
      return () => clearTimeout(timer);
    }
  }, [batchState]);

  const toggle = useCallback((id: string) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const selectAll = () => setSelected(new Set(filtered.map(c => c.id)));
  const clearAll = () => setSelected(new Set());

  const handleFilter = (f: QuickFilter) => {
    setActiveFilter(f);
    setSelected(new Set());
  };

  const execute = () => {
    if (!selectedTemplate || selected.size === 0) return;
    setBatchState('running');
  };

  const selectedClients = CLIENTS.filter(c => selected.has(c.id));
  const showPreview = selected.size > 0 && selectedTemplate !== null && batchState === 'idle';

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-12">
      {/* Header */}
      <div className="fade-up">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center">
            <I.IconLayers size={22} stroke="#2FA4F9" sw={2} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Batch Actions</h1>
            <p className="text-sm text-slate-500">
              Run AI-powered actions across multiple clients simultaneously
            </p>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left: Client Selection (60%) */}
        <div className="lg:col-span-3 fade-up fade-up-1 space-y-4">
          <Card className="p-5">
            <div className="flex items-center justify-between mb-4">
              <SectionTitle icon={I.IconUsers} title="Select clients" />
              <span className="text-xs font-medium text-slate-500">
                {selected.size} of {CLIENTS.length} selected
              </span>
            </div>

            {/* Quick filters */}
            <div className="flex flex-wrap gap-2 mb-4">
              {FILTERS.map(f => (
                <button
                  key={f.key}
                  onClick={() => handleFilter(f.key)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    activeFilter === f.key
                      ? 'bg-brand-500 text-white elev-brand'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Select all / Clear */}
            <div className="flex gap-2 mb-3">
              <button onClick={selectAll} className="text-xs text-brand-600 font-medium hover:underline">
                Select all
              </button>
              <span className="text-slate-300">|</span>
              <button onClick={clearAll} className="text-xs text-slate-500 font-medium hover:underline">
                Clear
              </button>
            </div>

            {/* Client list */}
            <div className="space-y-2 max-h-[380px] overflow-y-auto scroll-thin">
              {filtered.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => toggle(c.id)}
                  className={`row-in w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                    selected.has(c.id)
                      ? 'bg-brand-50 ring-1 ring-brand-200'
                      : 'bg-white hover:bg-slate-50'
                  }`}
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {/* Checkbox */}
                  <div className={`h-5 w-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected.has(c.id)
                      ? 'bg-brand-500 border-brand-500'
                      : 'border-slate-300'
                  }`}>
                    {selected.has(c.id) && <I.IconCheck size={13} stroke="white" sw={2.5} />}
                  </div>
                  <Avatar initials={c.initials} color={c.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-slate-900 truncate">{c.name}</span>
                      <Badge tone={c.segment === 'UHNI' ? 'brand' : 'muted'}>{c.segment}</Badge>
                    </div>
                    <span className="text-xs text-slate-500">
                      {fmtMoney(c.aum)} · Drift {fmtPct(c.drift)}
                    </span>
                  </div>
                  <span className={`text-xs font-semibold ${c.ytd >= c.bench ? 'text-emerald-600' : 'text-red-500'}`}>
                    {fmtPct(c.ytd, 1, true)} YTD
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-sm text-slate-400 text-center py-6">No clients match this filter</p>
              )}
            </div>
          </Card>
        </div>

        {/* Right: Action Panel (40%) */}
        <div className="lg:col-span-2 fade-up fade-up-2 space-y-4">
          <Card className="p-5">
            <SectionTitle icon={I.IconZap} title="Choose action" className="mb-4" />
            <div className="space-y-2">
              {TEMPLATES.map(t => {
                const IconC = I.iconMap[t.icon] || I.IconSparkles;
                const active = selectedTemplate === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTemplate(active ? null : t.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
                      active
                        ? 'bg-brand-50 ring-2 ring-brand-400'
                        : 'bg-white hover:bg-slate-50 ring-1 ring-slate-100'
                    }`}
                  >
                    <div
                      className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${t.accent}18` }}
                    >
                      <IconC size={18} stroke={t.accent} sw={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-900 truncate">{t.title}</p>
                      <p className="text-[11px] text-slate-500 truncate">{t.hint}</p>
                    </div>
                    {active && (
                      <div className="h-5 w-5 rounded-full bg-brand-500 flex items-center justify-center shrink-0">
                        <I.IconCheck size={12} stroke="white" sw={2.5} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </Card>
        </div>
      </div>

      {/* Preview Panel */}
      {showPreview && tpl && (
        <div className="fade-up space-y-4">
          <Card className="p-5">
            <SectionTitle icon={I.IconTarget} title="Batch preview" className="mb-3" />
            <p className="text-sm text-slate-600 mb-5">
              Run <span className="font-semibold text-slate-900">{tpl.title}</span> for{' '}
              <span className="font-semibold text-brand-600">{selected.size} clients</span>
              {' '}— estimated{' '}
              <span className="font-semibold">{selected.size * 3} min</span> AI processing
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
              {selectedClients.map(c => (
                <div
                  key={c.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 ring-1 ring-slate-100"
                >
                  <Avatar initials={c.initials} color={c.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                    <p className="text-xs text-slate-500">{fmtMoney(c.aum)}</p>
                    <p className="text-xs text-brand-600 mt-1 font-medium">
                      {previewLine(tpl.id, c)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button kind="primary" size="lg" icon={I.IconSparkles} onClick={execute}>
                Execute batch
              </Button>
              <Button kind="secondary" size="lg" icon={I.IconClock}>
                Schedule for later
              </Button>
            </div>
          </Card>
        </div>
      )}

      {/* Running State */}
      {batchState === 'running' && tpl && (
        <div className="fade-up">
          <Card className="p-8 text-center">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-brand-50 mb-4">
              <I.IconSpin size={24} stroke="#2FA4F9" sw={2} className="animate-spin" />
            </div>
            <p className="text-base font-semibold text-slate-900 mb-1">
              Processing {selected.size} clients...
            </p>
            <p className="text-sm text-slate-500">
              Running {tpl.title} — this may take a few moments
            </p>
            <div className="mt-4 w-48 mx-auto h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full animate-pulse" style={{ width: '60%' }} />
            </div>
          </Card>
        </div>
      )}

      {/* Complete State */}
      {batchState === 'complete' && tpl && (
        <div className="fade-up space-y-4">
          <Card className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-9 w-9 rounded-full bg-emerald-50 flex items-center justify-center">
                <I.IconCheckCircle size={20} stroke="#10B981" sw={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Batch complete — {selected.size} results ready
                </p>
                <p className="text-xs text-slate-500">{tpl.title}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mb-5">
              {selectedClients.map((c, i) => (
                <div
                  key={c.id}
                  className="row-in flex items-start gap-3 p-3 rounded-xl bg-white ring-1 ring-slate-100 elev-1"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <Avatar initials={c.initials} color={c.avatar} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-semibold text-slate-900 truncate">{c.name}</p>
                      <Badge tone="success">Done</Badge>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{previewLine(tpl.id, c)}</p>
                    <button
                      onClick={() => openTemplate(tpl.id, c, `${tpl.title} — ${c.name}`)}
                      className="text-xs font-semibold text-brand-600 hover:text-brand-700 inline-flex items-center gap-1 transition"
                    >
                      View result <I.IconArrowRight size={12} sw={2} />
                    </button>
                  </div>
                  <I.IconCheckCircle size={16} stroke="#10B981" sw={2} className="shrink-0 mt-0.5" />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                kind="primary"
                size="md"
                icon={I.IconDownload}
                onClick={() => {}}
              >
                Export all results
              </Button>
              <Button
                kind="secondary"
                size="md"
                onClick={() => {
                  setBatchState('idle');
                  setSelected(new Set());
                  setSelectedTemplate(null);
                }}
              >
                New batch
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
