import React, { useState, useMemo } from 'react';
import {
  IconLayers, IconPlus, IconDownload, IconChevronLeft, IconSparkles,
  IconUsers, IconTarget, IconTrendUp, IconCalendar, IconZap, IconEdit,
} from '@/components/icons';
import { Avatar, Badge, Button, Card, KPI, SectionTitle } from '@/components/ui';
import { MODEL_PORTFOLIOS } from '@/data/models';
import { CLIENTS, fmtMoney, fmtPct } from '@/data/clients';
import type { ModelPortfolio, Client } from '@/types';

const riskTone = (r: ModelPortfolio['riskLevel']): 'muted' | 'brand' | 'warn' =>
  r === 'Conservative' ? 'muted' : r === 'Moderate' ? 'brand' : 'warn';

const YTD_MOCK: Record<string, number> = {
  'Balanced Growth': 7.1, 'Aggressive Growth': 13.8, 'Income & Stability': 3.6,
  'Capital Preservation': 2.9, 'Endowment Growth': 10.2,
};

/* ── Allocation Bar ────────────────────────────── */
const AllocBar: React.FC<{ allocs: ModelPortfolio['allocations']; h?: number }> = ({ allocs, h = 10 }) => (
  <div className="flex w-full rounded-full overflow-hidden" style={{ height: h }}>
    {allocs.map((a) => (
      <div key={a.asset} title={`${a.asset} ${a.weight}%`}
        style={{ width: `${a.weight}%`, background: a.color }} />
    ))}
  </div>
);

/* ── Model Card ────────────────────────────────── */
const ModelCard: React.FC<{ m: ModelPortfolio; onSelect: () => void }> = ({ m, onSelect }) => (
  <Card className="fade-up flex flex-col gap-3 cursor-pointer hover:ring-2 hover:ring-[#2FA4F9]/30 transition-all"
    onClick={onSelect}>
    <div className="flex items-start justify-between">
      <div>
        <h3 className="font-semibold text-[15px] text-slate-900">{m.name}</h3>
        <Badge tone={riskTone(m.riskLevel)} className="mt-1">{m.riskLevel}</Badge>
      </div>
      <IconTarget size={18} stroke="#64748B" />
    </div>
    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{m.description}</p>
    <AllocBar allocs={m.allocations} />
    <div className="flex items-center gap-1 flex-wrap mt-auto">
      {m.allocations.slice(0, 4).map((a) => (
        <span key={a.asset} className="text-[10px] text-slate-400 flex items-center gap-1">
          <span className="w-2 h-2 rounded-full inline-block" style={{ background: a.color }} />
          {a.asset}
        </span>
      ))}
      {m.allocations.length > 4 && <span className="text-[10px] text-slate-400">+{m.allocations.length - 4}</span>}
    </div>
    <div className="grid grid-cols-3 gap-2 text-center border-t border-slate-100 pt-3">
      <div><div className="text-[11px] text-slate-400">Return</div><div className="text-sm font-semibold text-slate-800">{fmtPct(m.targetReturn)}</div></div>
      <div><div className="text-[11px] text-slate-400">Clients</div><div className="text-sm font-semibold text-slate-800">{m.clientCount}</div></div>
      <div><div className="text-[11px] text-slate-400">AUM</div><div className="text-sm font-semibold text-slate-800">{fmtMoney(m.totalAum)}</div></div>
    </div>
    <div className="flex items-center justify-between text-[11px] text-slate-400">
      <span className="flex items-center gap-1"><IconCalendar size={12} /> {m.lastUpdated}</span>
      <span>{m.manager}</span>
    </div>
    <Button kind="outline" size="sm" className="w-full mt-1" onClick={(e) => { e.stopPropagation(); onSelect(); }}>
      View details
    </Button>
  </Card>
);

/* ── Detail Panel ──────────────────────────────── */
const DetailPanel: React.FC<{
  model: ModelPortfolio; clients: Client[];
  onBack: () => void;
}> = ({ model, clients, onBack }) => {
  const [selectedAsset, setSelectedAsset] = useState(model.allocations[0].asset);
  const [delta, setDelta] = useState(0);

  const adjustedAllocs = useMemo(() => {
    if (delta === 0) return model.allocations;
    return model.allocations.map((a) => {
      if (a.asset === selectedAsset) return { ...a, weight: Math.max(0, Math.min(100, a.weight + delta)) };
      const others = model.allocations.filter((o) => o.asset !== selectedAsset);
      const otherTotal = others.reduce((s, o) => s + o.weight, 0);
      if (otherTotal === 0) return a;
      const redistribute = -delta * (a.weight / otherTotal);
      return { ...a, weight: Math.max(0, a.weight + redistribute) };
    });
  }, [model.allocations, selectedAsset, delta]);

  const impactedCount = clients.length;
  const estTrades = impactedCount * Math.abs(delta) * 2;

  return (
    <div className="space-y-6">
      {/* Back + header */}
      <button onClick={onBack} className="flex items-center gap-1 text-sm text-slate-500 hover:text-[#2FA4F9] transition-colors">
        <IconChevronLeft size={16} /> Back to models
      </button>

      <div className="fade-up flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{model.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge tone={riskTone(model.riskLevel)}>{model.riskLevel}</Badge>
            <span className="text-xs text-slate-400">Managed by {model.manager}</span>
          </div>
          <p className="text-sm text-slate-500 mt-2 max-w-xl">{model.description}</p>
        </div>
      </div>

      {/* Allocation table + bar */}
      <Card className="fade-up">
        <SectionTitle icon={IconLayers} title="Target Allocations" />
        <AllocBar allocs={adjustedAllocs} h={14} />
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
              <th className="pb-2 font-medium">Asset Class</th>
              <th className="pb-2 font-medium text-right">Current %</th>
              <th className="pb-2 font-medium text-right">Target %</th>
              <th className="pb-2 font-medium text-right">Diff</th>
            </tr></thead>
            <tbody>
              {model.allocations.map((a) => {
                const adj = adjustedAllocs.find((x) => x.asset === a.asset)!;
                const diff = +(adj.weight - a.weight).toFixed(1);
                const diffColor = diff > 0.5 ? 'text-rose-500' : diff < -0.5 ? 'text-amber-500' : 'text-emerald-500';
                return (
                  <tr key={a.asset} className="border-b border-slate-50">
                    <td className="py-2 flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm" style={{ background: a.color }} />
                      {a.asset}
                    </td>
                    <td className="py-2 text-right font-medium">{fmtPct(a.weight, 0)}</td>
                    <td className="py-2 text-right font-medium">{fmtPct(adj.weight, 1)}</td>
                    <td className={`py-2 text-right font-semibold ${diffColor}`}>
                      {delta === 0 ? '—' : (diff > 0 ? '+' : '') + diff.toFixed(1) + '%'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Client impact */}
      <Card className="fade-up">
        <SectionTitle icon={IconUsers} title={`Clients on this model (${impactedCount})`} />
        <div className="space-y-2 mt-3">
          {clients.map((c) => (
            <div key={c.id} className="row-in flex items-center justify-between p-3 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 transition-colors">
              <div className="flex items-center gap-3">
                <Avatar bg={c.avatar} initials={c.initials} size={32} />
                <div>
                  <div className="text-sm font-medium text-slate-800">{c.name}</div>
                  <div className="text-xs text-slate-400">{c.role}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-slate-700 font-medium">{fmtMoney(c.aum)}</span>
                <Badge tone={c.drift > 5 ? 'warn' : c.drift > 3 ? 'brand' : 'success'}>
                  {fmtPct(c.drift)} drift
                </Badge>
                <Button kind="ghost" size="sm">View</Button>
              </div>
            </div>
          ))}
          {clients.length === 0 && <p className="text-sm text-slate-400 text-center py-4">No clients on this model.</p>}
        </div>
      </Card>

      {/* Cascade simulator */}
      <Card className="fade-up border-2 border-[#2FA4F9]/20 bg-gradient-to-br from-sky-50/40 to-white">
        <SectionTitle icon={IconSparkles} title="What-if: Propose a change" />
        <p className="text-xs text-slate-500 mb-4">Adjust an allocation and instantly preview the cascade impact across all mapped clients.</p>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {model.allocations.map((a) => (
            <button key={a.asset} onClick={() => { setSelectedAsset(a.asset); setDelta(0); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                selectedAsset === a.asset
                  ? 'bg-[#2FA4F9] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {a.asset}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm text-slate-600 font-medium w-28">{selectedAsset}</span>
          <button onClick={() => setDelta((d) => d - 1)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 transition-colors">−</button>
          <div className="px-4 py-1.5 rounded-lg bg-white border border-slate-200 text-sm font-semibold min-w-[80px] text-center">
            {delta === 0 ? 'No change' : (delta > 0 ? '+' : '') + delta + '%'}
          </div>
          <button onClick={() => setDelta((d) => d + 1)}
            className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 transition-colors">+</button>
        </div>

        {delta !== 0 && (
          <div className="space-y-4 fade-up">
            <Card className="bg-white/80 border border-sky-100">
              <div className="flex items-center gap-2 mb-3">
                <IconZap size={16} stroke="#2FA4F9" />
                <span className="text-sm font-semibold text-slate-800">Impact Preview</span>
              </div>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div><div className="text-lg font-bold text-[#2FA4F9]">{impactedCount}</div><div className="text-[11px] text-slate-400">Clients affected</div></div>
                <div><div className="text-lg font-bold text-[#2FA4F9]">{estTrades}</div><div className="text-[11px] text-slate-400">Est. trades</div></div>
                <div><div className="text-lg font-bold text-[#2FA4F9]">{Math.abs(delta * 0.4).toFixed(1)}%</div><div className="text-[11px] text-slate-400">Avg drift change</div></div>
              </div>
            </Card>

            <div className="space-y-2">
              {clients.map((c) => {
                const newDrift = +(c.drift + Math.abs(delta) * 0.3).toFixed(1);
                return (
                  <div key={c.id} className="row-in flex items-center justify-between p-3 rounded-xl bg-white border border-slate-100">
                    <div className="flex items-center gap-3">
                      <Avatar bg={c.avatar} initials={c.initials} size={28} />
                      <span className="text-sm font-medium text-slate-800">{c.name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-slate-400">Drift: <span className="text-slate-600 font-medium">{fmtPct(c.drift)}</span></span>
                      <span className="text-slate-300">→</span>
                      <Badge tone={newDrift > 7 ? 'danger' : newDrift > 4 ? 'warn' : 'success'}>{fmtPct(newDrift)}</Badge>
                      <span className="text-slate-400">{Math.abs(delta) * 2} trades</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button kind="primary" size="md"><IconZap size={14} /> Apply to all clients</Button>
              <Button kind="secondary" size="md"><IconEdit size={14} /> Save as draft</Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

/* ── Comparison Table ──────────────────────────── */
const ComparisonTable: React.FC = () => (
  <Card className="fade-up">
    <SectionTitle icon={IconTrendUp} title="Model Comparison" />
    <div className="overflow-x-auto mt-3">
      <table className="w-full text-sm">
        <thead><tr className="text-left text-xs text-slate-400 border-b border-slate-100">
          <th className="pb-2 font-medium">Model</th><th className="pb-2 font-medium">Risk</th>
          <th className="pb-2 font-medium text-right">Clients</th><th className="pb-2 font-medium text-right">AUM</th>
          <th className="pb-2 font-medium text-right">Target</th><th className="pb-2 font-medium text-right">YTD</th>
        </tr></thead>
        <tbody>
          {MODEL_PORTFOLIOS.map((m) => (
            <tr key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
              <td className="py-2.5 font-medium text-slate-800">{m.name}</td>
              <td className="py-2.5"><Badge tone={riskTone(m.riskLevel)}>{m.riskLevel}</Badge></td>
              <td className="py-2.5 text-right">{m.clientCount}</td>
              <td className="py-2.5 text-right font-medium">{fmtMoney(m.totalAum)}</td>
              <td className="py-2.5 text-right">{fmtPct(m.targetReturn)}</td>
              <td className="py-2.5 text-right font-semibold text-emerald-600">{fmtPct(YTD_MOCK[m.name] ?? 0)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Card>
);

/* ── Main View ─────────────────────────────────── */
export const ModelPortfolioView: React.FC = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedModel = MODEL_PORTFOLIOS.find((m) => m.id === selectedId) ?? null;
  const modelClients = useMemo(
    () => (selectedModel ? CLIENTS.filter((c) => c.model === selectedModel.name) : []),
    [selectedModel],
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="fade-up flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2FA4F9]/10 flex items-center justify-center">
            <IconLayers size={20} stroke="#2FA4F9" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Model Portfolios</h1>
            <p className="text-sm text-slate-500">CIO model management &middot; cascade impact analysis</p>
          </div>
        </div>
        {!selectedModel && (
          <div className="flex items-center gap-2">
            <Button kind="secondary" size="sm"><IconDownload size={14} /> Import</Button>
            <Button kind="primary" size="sm"><IconPlus size={14} /> Create model</Button>
          </div>
        )}
      </div>

      {/* Grid or Detail */}
      {selectedModel ? (
        <DetailPanel model={selectedModel} clients={modelClients} onBack={() => setSelectedId(null)} />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MODEL_PORTFOLIOS.map((m) => (
              <ModelCard key={m.id} m={m} onSelect={() => setSelectedId(m.id)} />
            ))}
          </div>
          <ComparisonTable />
        </>
      )}
    </div>
  );
};
