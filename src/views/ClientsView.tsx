import React, { useState, useMemo } from 'react';
import { IconFilter, IconPlus, IconBrief, IconScale, IconShield, IconDownload, IconStar, IconArrowUp, IconArrowDown, IconLayers, IconTasks } from '@/components/icons';
import { Avatar, Badge, Button, Card } from '@/components/ui';
import { CLIENTS, TOTAL_AUM, fmtMoney, fmtPct } from '@/data/clients';
import type { Client } from '@/types';

/* ── Sort types ── */
type SortField = 'name' | 'aum' | 'ytd' | 'bench' | 'drift';
type SortDir = 'asc' | 'desc';
type ViewMode = 'table' | 'card';

interface ClientsViewProps {
  openTemplate: (id: string, client?: Client | null, title?: string) => void;
  openClientHub?: (clientId: string) => void;
  setView?: (view: string) => void;
}

export const ClientsView: React.FC<ClientsViewProps> = ({ openTemplate, openClientHub, setView }) => {
  const [filter, setFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [starred, setStarred] = useState<Set<string>>(new Set());
  const [showWatchlistOnly, setShowWatchlistOnly] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  const uhniCount = CLIENTS.filter(c => c.segment === 'UHNI').length;
  const hniCount = CLIENTS.filter(c => c.segment === 'HNI').length;

  /* ── Toggle star ── */
  const toggleStar = (id: string) => {
    setStarred(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  /* ── Toggle sort ── */
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir(field === 'name' ? 'asc' : 'desc');
    }
  };

  /* ── Sort arrow component ── */
  const SortArrow: React.FC<{ field: SortField }> = ({ field }) => {
    if (sortField !== field) return <span className="ml-1 text-slate-300">&#8597;</span>;
    return sortDir === 'asc'
      ? <IconArrowUp size={12} className="ml-1 inline" />
      : <IconArrowDown size={12} className="ml-1 inline" />;
  };

  /* ── Filter + sort ── */
  const processed = useMemo(() => {
    let list =
      filter === 'all'
        ? CLIENTS
        : CLIENTS.filter(c => c.segment.toLowerCase() === filter);

    if (showWatchlistOnly) {
      list = list.filter(c => starred.has(c.id));
    }

    const sorted = [...list].sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'name': cmp = a.name.localeCompare(b.name); break;
        case 'aum': cmp = a.aum - b.aum; break;
        case 'ytd': cmp = a.ytd - b.ytd; break;
        case 'bench': cmp = (a.ytd - a.bench) - (b.ytd - b.bench); break;
        case 'drift': cmp = a.drift - b.drift; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [filter, sortField, sortDir, showWatchlistOnly, starred]);

  /* ── Export CSV ── */
  const handleExport = () => {
    const header = 'Name,Segment,Model,AUM,YTD,Benchmark,vs Bench,Risk,Drift,Last Review';
    const rows = CLIENTS.map(c =>
      [c.name, c.segment, c.model, c.aum, `${c.ytd}%`, `${c.bench}%`, `${(c.ytd - c.bench).toFixed(1)}%`, c.risk, `${c.drift}%`, c.lastReview].join(',')
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'client-list.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

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
          <Button kind="secondary" icon={IconDownload} size="sm" onClick={handleExport}>Export</Button>
          <Button kind="secondary" icon={IconFilter} size="sm">Filters</Button>
          <Button kind="primary" icon={IconPlus} size="sm" onClick={() => setView?.('onboarding')}>Add client</Button>
        </div>
      </div>

      {/* Controls row: segment tabs, watchlist toggle, view toggle */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        {/* Segment filter tabs */}
        <div className="flex items-center gap-1 bg-white rounded-xl border border-slate-200 p-1 w-fit">
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

        <div className="flex items-center gap-2">
          {/* Watchlist toggle */}
          <button
            onClick={() => setShowWatchlistOnly(prev => !prev)}
            className={`inline-flex items-center gap-1.5 text-[12.5px] px-3 py-1.5 rounded-lg border transition ${
              showWatchlistOnly
                ? 'bg-amber-50 border-amber-200 text-amber-700 font-semibold'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
            }`}
          >
            <IconStar size={14} fill={showWatchlistOnly ? '#F59E0B' : 'none'} stroke={showWatchlistOnly ? '#F59E0B' : 'currentColor'} />
            Watchlist{starred.size > 0 ? ` (${starred.size})` : ''}
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-white rounded-xl border border-slate-200 p-0.5">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg ${viewMode === 'table' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Table view"
            >
              <IconTasks size={16} />
            </button>
            <button
              onClick={() => setViewMode('card')}
              className={`p-1.5 rounded-lg ${viewMode === 'card' ? 'bg-brand-50 text-brand-600' : 'text-slate-400 hover:text-slate-600'}`}
              title="Card view"
            >
              <IconLayers size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* ── Table view ── */}
      {viewMode === 'table' && (
        <Card className="overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/40">
                <th className="px-5 py-3 font-semibold w-8"></th>
                <th className="py-3 font-semibold cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort('name')}>
                  Client<SortArrow field="name" />
                </th>
                <th className="py-3 font-semibold">Model</th>
                <th className="py-3 font-semibold text-right cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort('aum')}>
                  AUM<SortArrow field="aum" />
                </th>
                <th className="py-3 font-semibold text-right cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort('ytd')}>
                  YTD<SortArrow field="ytd" />
                </th>
                <th className="py-3 font-semibold text-right cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort('bench')}>
                  vs Bench<SortArrow field="bench" />
                </th>
                <th className="py-3 font-semibold">Risk</th>
                <th className="py-3 font-semibold cursor-pointer select-none hover:text-slate-600" onClick={() => handleSort('drift')}>
                  Drift<SortArrow field="drift" />
                </th>
                <th className="py-3 font-semibold">Last review</th>
                <th className="py-3 px-5 font-semibold">AI actions</th>
              </tr>
            </thead>
            <tbody>
              {processed.map(c => (
                <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/50 group">
                  {/* Star */}
                  <td className="pl-5 py-3">
                    <button
                      onClick={() => toggleStar(c.id)}
                      className="p-1 rounded hover:bg-amber-50 transition"
                      title={starred.has(c.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                    >
                      <IconStar
                        size={14}
                        fill={starred.has(c.id) ? '#F59E0B' : 'none'}
                        stroke={starred.has(c.id) ? '#F59E0B' : '#CBD5E1'}
                      />
                    </button>
                  </td>

                  {/* Client name + avatar */}
                  <td className="py-3">
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
                  <td className={`py-3 text-right font-semibold tabular-nums ${c.ytd >= c.bench ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {fmtPct(c.ytd, 1, true)}
                  </td>

                  {/* vs Bench */}
                  <td className={`py-3 text-right tabular-nums ${c.ytd >= c.bench ? 'text-emerald-600' : 'text-rose-600'}`}>
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
                            background: c.drift > 8 ? '#F97316' : c.drift > 5 ? '#F59E0B' : '#10B981',
                          }}
                        />
                      </div>
                      <span className="text-[12px] tabular-nums text-slate-600">{c.drift}%</span>
                    </div>
                  </td>

                  {/* Last review */}
                  <td className="py-3 text-slate-600 text-[12.5px]">{c.lastReview}</td>

                  {/* AI action buttons */}
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-1 opacity-60 group-hover:opacity-100 transition">
                      <button onClick={() => openTemplate('review', c)} className="p-1.5 rounded hover:bg-brand-50 text-brand-600" title="Review">
                        <IconBrief size={14} />
                      </button>
                      <button onClick={() => openTemplate('rebalance', c)} className="p-1.5 rounded hover:bg-violet-50 text-violet-600" title="Rebalance">
                        <IconScale size={14} />
                      </button>
                      <button onClick={() => openTemplate('risk', c)} className="p-1.5 rounded hover:bg-amber-50 text-amber-600" title="Risk">
                        <IconShield size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      {/* ── Card view ── */}
      {viewMode === 'card' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {processed.map(c => (
            <Card key={c.id} className="p-5 hover:elev-2 hover:-translate-y-0.5 transition relative group">
              {/* Star button */}
              <button
                onClick={() => toggleStar(c.id)}
                className="absolute top-4 right-4 p-1 rounded hover:bg-amber-50 transition"
                title={starred.has(c.id) ? 'Remove from watchlist' : 'Add to watchlist'}
              >
                <IconStar
                  size={16}
                  fill={starred.has(c.id) ? '#F59E0B' : 'none'}
                  stroke={starred.has(c.id) ? '#F59E0B' : '#CBD5E1'}
                />
              </button>

              {/* Avatar + name */}
              <div className="flex items-center gap-3 mb-4">
                <Avatar initials={c.initials} color={c.avatar} />
                <div>
                  <button
                    onClick={() => openClientHub?.(c.id)}
                    className="font-semibold text-slate-900 hover:text-brand-600 hover:underline text-left text-[14px]"
                  >
                    {c.name}
                  </button>
                  <div className="text-[11.5px] text-slate-500">{c.role}</div>
                </div>
              </div>

              {/* Metrics grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">AUM</div>
                  <div className="text-[14px] font-semibold text-slate-900 tabular-nums">{fmtMoney(c.aum)}</div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">YTD</div>
                  <div className={`text-[14px] font-semibold tabular-nums ${c.ytd >= c.bench ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {fmtPct(c.ytd, 1, true)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">vs Bench</div>
                  <div className={`text-[14px] font-semibold tabular-nums ${c.ytd >= c.bench ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {fmtPct(c.ytd - c.bench, 1, true)}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Drift</div>
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(c.drift * 8, 100)}%`,
                          background: c.drift > 8 ? '#F97316' : c.drift > 5 ? '#F59E0B' : '#10B981',
                        }}
                      />
                    </div>
                    <span className="text-[12px] tabular-nums text-slate-600">{c.drift}%</span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1.5 mb-3">
                <Badge tone="brand">{c.model}</Badge>
                <span className="text-[11px] text-slate-400">{c.risk}</span>
              </div>

              {/* AI actions */}
              <div className="flex items-center gap-1 pt-3 border-t border-slate-100 opacity-60 group-hover:opacity-100 transition">
                <button onClick={() => openTemplate('review', c)} className="p-1.5 rounded hover:bg-brand-50 text-brand-600" title="Review">
                  <IconBrief size={14} />
                </button>
                <button onClick={() => openTemplate('rebalance', c)} className="p-1.5 rounded hover:bg-violet-50 text-violet-600" title="Rebalance">
                  <IconScale size={14} />
                </button>
                <button onClick={() => openTemplate('risk', c)} className="p-1.5 rounded hover:bg-amber-50 text-amber-600" title="Risk">
                  <IconShield size={14} />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Empty state for watchlist filter */}
      {processed.length === 0 && showWatchlistOnly && (
        <Card className="p-8 text-center">
          <IconStar size={32} stroke="#CBD5E1" className="mx-auto mb-3" />
          <div className="text-[14px] font-semibold text-slate-700 mb-1">No starred clients</div>
          <div className="text-[13px] text-slate-500">Click the star icon on any client to add them to your watchlist.</div>
        </Card>
      )}
    </div>
  );
};
