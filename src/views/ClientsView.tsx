import React, { useState } from 'react';
import { IconFilter, IconPlus, IconBrief, IconScale, IconShield } from '@/components/icons';
import { Avatar, Badge, Button, Card } from '@/components/ui';
import { CLIENTS, TOTAL_AUM, fmtMoney, fmtPct } from '@/data/clients';
import type { Client } from '@/types';

interface ClientsViewProps {
  openTemplate: (id: string, client?: Client | null, title?: string) => void;
  openClientHub?: (clientId: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ openTemplate, openClientHub }) => {
  const [filter, setFilter] = useState('all');

  const filtered =
    filter === 'all'
      ? CLIENTS
      : CLIENTS.filter(c => c.segment.toLowerCase() === filter);

  const uhniCount = CLIENTS.filter(c => c.segment === 'UHNI').length;
  const hniCount = CLIENTS.filter(c => c.segment === 'HNI').length;

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Clients</h1>
          <p className="text-slate-500 text-sm mt-1">
            {CLIENTS.length} active &middot; {fmtMoney(TOTAL_AUM, 1)} AUM
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button kind="secondary" icon={IconFilter} size="sm">Filters</Button>
          <Button kind="primary" icon={IconPlus} size="sm">Add client</Button>
        </div>
      </div>

      {/* Segment filter tabs */}
      <div className="flex items-center gap-1 mb-4 bg-white rounded-xl border border-slate-200 p-1 w-fit">
        {[
          { id: 'all', label: `All (${CLIENTS.length})` },
          { id: 'uhni', label: `UHNI (${uhniCount})` },
          { id: 'hni', label: `HNI (${hniCount})` },
        ].map(f => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`text-[12.5px] px-3 py-1.5 rounded-lg ${
              filter === f.id
                ? 'bg-brand-50 text-brand-700 font-semibold'
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Client table */}
      <Card className="overflow-hidden">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/40">
              <th className="px-5 py-3 font-semibold">Client</th>
              <th className="py-3 font-semibold">Model</th>
              <th className="py-3 font-semibold text-right">AUM</th>
              <th className="py-3 font-semibold text-right">YTD</th>
              <th className="py-3 font-semibold text-right">vs Bench</th>
              <th className="py-3 font-semibold">Risk</th>
              <th className="py-3 font-semibold">Drift</th>
              <th className="py-3 font-semibold">Last review</th>
              <th className="py-3 px-5 font-semibold">AI actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr
                key={c.id}
                className="border-b border-slate-50 hover:bg-slate-50/50 group"
              >
                {/* Client name + avatar */}
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={c.initials} color={c.avatar} />
                    <div>
                      <button
                        onClick={() => openClientHub?.(c.id)}
                        className="font-semibold text-slate-900 hover:text-brand-600 hover:underline text-left"
                      >
                        {c.name}
                      </button>
                      <div className="text-[11.5px] text-slate-500">{c.role}</div>
                    </div>
                  </div>
                </td>

                {/* Model */}
                <td className="py-3">
                  <Badge tone="brand">{c.model}</Badge>
                </td>

                {/* AUM */}
                <td className="py-3 text-right font-medium tabular-nums">
                  {fmtMoney(c.aum)}
                </td>

                {/* YTD */}
                <td
                  className={`py-3 text-right font-semibold tabular-nums ${
                    c.ytd >= c.bench ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {fmtPct(c.ytd, 1, true)}
                </td>

                {/* vs Bench */}
                <td
                  className={`py-3 text-right tabular-nums ${
                    c.ytd >= c.bench ? 'text-emerald-600' : 'text-rose-600'
                  }`}
                >
                  {fmtPct(c.ytd - c.bench, 1, true)}
                </td>

                {/* Risk */}
                <td className="py-3 text-slate-600">{c.risk}</td>

                {/* Drift progress bar */}
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(c.drift * 8, 100)}%`,
                          background:
                            c.drift > 8
                              ? '#F97316'
                              : c.drift > 5
                                ? '#F59E0B'
                                : '#10B981',
                        }}
                      />
                    </div>
                    <span className="text-[12px] tabular-nums text-slate-600">
                      {c.drift}%
                    </span>
                  </div>
                </td>

                {/* Last review */}
                <td className="py-3 text-slate-600 text-[12.5px]">{c.lastReview}</td>

                {/* AI action buttons */}
                <td className="py-3 px-5">
                  <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                    <button
                      onClick={() => openTemplate('review', c)}
                      className="p-1.5 rounded hover:bg-brand-50 text-brand-600"
                      title="Review"
                    >
                      <IconBrief size={14} />
                    </button>
                    <button
                      onClick={() => openTemplate('rebalance', c)}
                      className="p-1.5 rounded hover:bg-violet-50 text-violet-600"
                      title="Rebalance"
                    >
                      <IconScale size={14} />
                    </button>
                    <button
                      onClick={() => openTemplate('risk', c)}
                      className="p-1.5 rounded hover:bg-amber-50 text-amber-600"
                      title="Risk"
                    >
                      <IconShield size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};
