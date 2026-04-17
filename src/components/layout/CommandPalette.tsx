'use client';

import React, { useEffect, useRef, useState, useMemo } from 'react';
import { IconSearch, IconArrowRight, IconHistory } from '@/components/icons';
import { iconMap } from '@/components/icons';
import { CLIENTS } from '@/data/clients';
import { TEMPLATES, HISTORY_ITEMS } from '@/data/templates';
import { HOLDINGS } from '@/data/clients';
import type { Client, Template, HistoryItem, Holding } from '@/types';

export interface CommandPaletteResult {
  group: string;
  icon: string | React.ComponentType<any>;
  title: string;
  hint?: string;
  kind: 'client' | 'template' | 'history' | 'holding';
  client?: Client;
  template?: Template;
  history?: HistoryItem;
  holding?: Holding;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onPick: (result: CommandPaletteResult) => void;
}

/**
 * CommandPalette component
 * Modal ⌘K search for clients, templates, history items, and holdings
 * Supports keyboard navigation (arrows, enter, escape)
 */
export const CommandPalette: React.FC<CommandPaletteProps> = ({
  open,
  onClose,
  onPick,
}) => {
  const [q, setQ] = useState('');
  const [idx, setIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when palette opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 30);
      setQ('');
      setIdx(0);
    }
  }, [open]);

  // Compute filtered results
  const results = useMemo(() => {
    const ql = q.toLowerCase();
    const matches = (s: string) => !ql || s.toLowerCase().includes(ql);

    // Search clients
    const clients: CommandPaletteResult[] = CLIENTS.filter(
      (c) => matches(c.name) || matches(c.role) || matches(c.model)
    ).map((c) => ({
      group: 'Clients',
      icon: 'user',
      title: c.name,
      hint: `${c.role} · ${c.model}`,
      kind: 'client' as const,
      client: c,
    }));

    // Search templates
    const tpls: CommandPaletteResult[] = TEMPLATES.filter(
      (t) => matches(t.title) || matches(t.sample)
    ).map((t) => ({
      group: 'Templates',
      icon: t.icon,
      title: t.title,
      hint: t.sample,
      kind: 'template' as const,
      template: t,
    }));

    // Search history
    const hist: CommandPaletteResult[] = HISTORY_ITEMS.filter(
      (h) => matches(h.title) || matches(h.client || '')
    ).map((h) => ({
      group: 'History',
      icon: 'history',
      title: h.title,
      hint: h.when + (h.client ? ` · ${h.client}` : ''),
      kind: 'history' as const,
      history: h,
    }));

    // Search holdings
    const holdings: CommandPaletteResult[] = HOLDINGS.filter(
      (h) => matches(h.tk) || matches(h.name)
    ).map((h) => ({
      group: 'Holdings',
      icon: 'briefcase',
      title: `${h.tk} · ${h.name}`,
      hint: `${h.weight}% · $${(h.value / 1000).toFixed(0)}K`,
      kind: 'holding' as const,
      holding: h,
    }));

    // Combine and limit to 14 results
    return [...tpls, ...clients, ...hist, ...holdings].slice(0, 14);
  }, [q]);

  // Reset index when search changes
  useEffect(() => {
    setIdx(0);
  }, [q]);

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setIdx((i) => Math.min(i + 1, results.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setIdx((i) => Math.max(i - 1, 0));
      }
      if (e.key === 'Enter' && results[idx]) {
        e.preventDefault();
        onPick(results[idx]);
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, results, idx, onClose, onPick]);

  if (!open) return null;

  // Group results by category
  const groups: Record<string, CommandPaletteResult[]> = {};
  results.forEach((r) => {
    if (!groups[r.group]) groups[r.group] = [];
    groups[r.group].push(r);
  });

  let flatIdx = 0;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" />

      {/* Palette container */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-lg shadow-slate-900/20 overflow-hidden slide-down"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100">
          <IconSearch size={18} stroke="#2FA4F9" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search clients, templates, holdings, history…"
            className="flex-1 text-[15px] outline-none placeholder:text-slate-400 bg-transparent"
          />
          <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-500">
            esc
          </kbd>
        </div>

        {/* Results list */}
        <div className="max-h-[60vh] overflow-auto scroll-thin">
          {results.length === 0 ? (
            <div className="p-10 text-center text-[13px] text-slate-500">
              <div className="text-2xl mb-2">🔍</div>
              No results. Try a client name, template, or ticker.
            </div>
          ) : (
            Object.entries(groups).map(([group, items]) => (
              <div key={group} className="py-1">
                {/* Group header */}
                <div className="px-4 pt-2 pb-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400">
                  {group}
                </div>

                {/* Group items */}
                {items.map((r) => {
                  const myIdx = flatIdx++;
                  const active = myIdx === idx;
                  const IconComponent =
                    typeof r.icon === 'string'
                      ? iconMap[r.icon as keyof typeof iconMap]
                      : r.icon;

                  return (
                    <button
                      key={myIdx}
                      onMouseEnter={() => setIdx(myIdx)}
                      onClick={() => {
                        onPick(r);
                        onClose();
                      }}
                      className={`w-full text-left flex items-center gap-3 px-4 py-2 transition ${
                        active
                          ? 'bg-brand-50'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Icon background */}
                      <div
                        className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                          active
                            ? 'bg-brand-100'
                            : 'bg-slate-100'
                        }`}
                      >
                        {IconComponent && (
                          <IconComponent
                            size={14}
                            stroke={active ? '#1B8AD8' : '#475569'}
                          />
                        )}
                      </div>

                      {/* Title and hint */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[13.5px] font-medium text-slate-900 truncate">
                          {r.title}
                        </div>
                        {r.hint && (
                          <div className="text-[11.5px] text-slate-500 truncate">
                            {r.hint}
                          </div>
                        )}
                      </div>

                      {/* Arrow indicator */}
                      {active && (
                        <IconArrowRight size={14} stroke="#1B8AD8" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer with keyboard hints */}
        <div className="flex items-center gap-3 px-4 py-2 border-t border-slate-100 bg-slate-50 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px]">
              ↑
            </kbd>
            <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px]">
              ↓
            </kbd>
            navigate
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px]">
              ↵
            </kbd>
            open
          </span>
          <span className="inline-flex items-center gap-1">
            <kbd className="px-1 py-0.5 rounded bg-white border border-slate-200 text-[9px]">
              esc
            </kbd>
            close
          </span>
          <span className="flex-1" />
          <span>Powered by GPT-Copilot v4</span>
        </div>
      </div>
    </div>
  );
};
