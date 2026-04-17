import React, { useState } from 'react';
import type { SeedContent, Client } from '@/types';
import { Badge, SectionTitle } from '@/components/ui';
import {
  IconShield,
  IconWand,
  IconArrowRight,
  IconDatabase,
  IconCheckCircle,
  IconChevronRight,
  IconHistory,
  IconBrief,
  IconPin,
  IconShare,
  IconDownload,
  IconSparkles,
  IconUser,
  IconBookmark,
  IconClock,
  iconMap,
} from '@/components/icons';
import { Button } from '@/components/ui';

type TabId = 'trust' | 'sources' | 'audit' | 'artifacts';

export interface RightRailProps {
  seed: SeedContent;
  client?: Client | null;
  onRefineAction: (text: string) => void;
}

/**
 * RightRail - Trust layer panel with 4 tabs
 * Trust: confidence bar + breakdown + refine actions
 * Sources: list of sources with verified badges
 * Audit: timeline of actions
 * Files: generated artifacts with download/pin actions
 */
export const RightRail: React.FC<RightRailProps> = ({
  seed,
  client,
  onRefineAction,
}) => {
  const [tab, setTab] = useState<TabId>('trust');

  if (!seed) return null;

  // Build a deterministic "audit trail" for the current answer
  const now = new Date();
  const stamp = (mAgo: number): string => {
    const d = new Date(now.getTime() - mAgo * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const auditLog = [
    {
      t: stamp(3),
      who: 'Copilot',
      what: 'Generated initial answer',
      Icon: IconSparkles,
      tone: 'brand' as const,
    },
    {
      t: stamp(3),
      who: 'compliance.check',
      what: 'Wash-sale rule — passed',
      Icon: IconShield,
      tone: 'success' as const,
    },
    {
      t: stamp(3),
      who: 'compliance.check',
      what: 'Concentration rule — passed',
      Icon: IconShield,
      tone: 'success' as const,
    },
    {
      t: stamp(3),
      who: 'custodian.fetch',
      what: `${seed.sources.length} sources pulled, signatures verified`,
      Icon: IconDatabase,
      tone: 'success' as const,
    },
    {
      t: stamp(2),
      who: 'Vijay Venkat',
      what: 'Reviewed and accepted',
      Icon: IconUser,
      tone: 'neutral' as const,
    },
  ];

  const toneMap: Record<string, string> = {
    brand: '#2FA4F9',
    success: '#10B981',
    neutral: '#94A3B8',
  };

  const tabs: { id: TabId; label: string }[] = [
    { id: 'trust', label: 'Trust' },
    { id: 'sources', label: 'Sources' },
    { id: 'audit', label: 'Audit' },
    { id: 'artifacts', label: 'Files' },
  ];

  return (
    <aside className="w-[320px] shrink-0 border-l border-slate-200 bg-white/40 overflow-y-auto scroll-thin">
      <div className="p-4 space-y-4">
        {/* Tab bar */}
        <div className="bg-white rounded-2xl elev-1 p-1 flex items-center gap-0.5">
          {tabs.map((t) => (
            <button
              key={t.id}
              className={`trust-tab flex-1 ${tab === t.id ? 'active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Trust tab */}
        {tab === 'trust' && (
          <>
            <div className="bg-white rounded-2xl elev-1 p-4 fade-up">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                  Confidence
                </span>
                <Badge
                  tone={
                    seed.confidence >= 90
                      ? 'success'
                      : seed.confidence >= 80
                        ? 'brand'
                        : 'warn'
                  }
                >
                  {seed.confidence}/100
                </Badge>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${seed.confidence}%`,
                    background:
                      seed.confidence >= 90
                        ? '#10B981'
                        : seed.confidence >= 80
                          ? '#2FA4F9'
                          : '#F59E0B',
                  }}
                />
              </div>
              <div className="mt-3 space-y-1.5">
                {[
                  { label: 'Data freshness', v: 96, hint: 'Custodian feed \u00B7 2 min ago' },
                  {
                    label: 'Source agreement',
                    v: 92,
                    hint: `${seed.sources.length} sources concur`,
                  },
                  { label: 'Compliance', v: 100, hint: 'All rules passed' },
                  {
                    label: 'Model certainty',
                    v: seed.confidence,
                    hint: 'Within base-case band',
                  },
                ].map((r, i) => (
                  <div key={i} className="flex items-center gap-2 text-[11.5px]">
                    <span className="w-[100px] text-slate-500 truncate">{r.label}</span>
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${r.v}%`,
                          background:
                            r.v >= 90 ? '#10B981' : r.v >= 80 ? '#2FA4F9' : '#F59E0B',
                        }}
                      />
                    </div>
                    <span className="font-semibold text-slate-700 tabular-nums">{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center gap-2 text-[11.5px] text-slate-500">
                <IconShield size={12} stroke="#10B981" sw={2.2} />
                <span>
                  Every number has an auditable source.{' '}
                  <a className="text-brand-600 font-semibold cursor-pointer">
                    Explain this answer
                  </a>
                </span>
              </div>
            </div>

            {/* Refine actions */}
            <div className="bg-white rounded-2xl elev-1 p-4">
              <SectionTitle icon={IconWand} title="Refine" />
              <div className="space-y-1.5">
                {[
                  'Make it shorter',
                  'Show after-tax return',
                  'Compare to 60/40',
                  'Project 5-year IRR',
                  'Client-friendly email',
                ].map((a, i) => (
                  <button
                    key={i}
                    onClick={() => onRefineAction(a)}
                    className="w-full text-left text-[12.5px] px-3 py-2 rounded-lg bg-slate-50 hover:bg-brand-50 hover:text-brand-700 text-slate-700 ripple flex items-center justify-between"
                  >
                    <span>{a}</span>
                    <IconArrowRight size={12} stroke="#94A3B8" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Sources tab */}
        {tab === 'sources' && (
          <div className="bg-white rounded-2xl elev-1 p-4 fade-up">
            <SectionTitle icon={IconDatabase} title={`${seed.sources.length} sources`} />
            <ul className="space-y-2">
              {seed.sources.map((s, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-[12.5px] p-2 -mx-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                >
                  <span className="h-5 min-w-[20px] px-1.5 rounded bg-brand-50 text-brand-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-slate-800 flex items-center gap-1">
                      {s.title}
                      {s.verified && (
                        <IconCheckCircle size={11} stroke="#10B981" sw={2.4} />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                      <span>{s.kind}</span>
                      <span className="h-0.5 w-0.5 rounded-full bg-slate-300" />
                      <span>{s.freshness}</span>
                    </div>
                  </div>
                  <IconChevronRight size={12} stroke="#94A3B8" />
                </li>
              ))}
            </ul>
            <div className="mt-3 pt-3 border-t border-slate-100 text-[11.5px] text-slate-500">
              All sources digitally signed &middot; cryptographic provenance on every
              citation.
            </div>
          </div>
        )}

        {/* Audit tab */}
        {tab === 'audit' && (
          <div className="bg-white rounded-2xl elev-1 p-4 fade-up">
            <SectionTitle icon={IconHistory} title="Audit trail" />
            <ol className="relative pl-5 space-y-3 before:content-[''] before:absolute before:left-1.5 before:top-1 before:bottom-1 before:w-px before:bg-slate-200">
              {auditLog.map((e, i) => {
                const c = toneMap[e.tone] || '#64748B';
                return (
                  <li key={i} className="relative">
                    <span
                      className="absolute -left-5 top-0 h-3 w-3 rounded-full ring-2 ring-white"
                      style={{ background: c }}
                    />
                    <div className="flex items-center gap-2 text-[12px] text-slate-800">
                      <e.Icon size={12} stroke={c} sw={2.2} />
                      <span className="font-semibold">{e.who}</span>
                      <span className="text-slate-400 ml-auto text-[11px]">{e.t}</span>
                    </div>
                    <div className="text-[11.5px] text-slate-600 mt-0.5">{e.what}</div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11.5px]">
              <span className="text-slate-500">Immutable &middot; SOC-2 compliant</span>
              <button className="text-brand-600 font-semibold">Export log</button>
            </div>
          </div>
        )}

        {/* Files tab */}
        {tab === 'artifacts' && (
          <div className="bg-white rounded-2xl elev-1 p-4 fade-up">
            <SectionTitle
              icon={IconBrief}
              title="Generated files"
              action={
                <button className="text-[11px] text-slate-500 hover:text-brand-600">
                  Pin all
                </button>
              }
            />
            <ul className="space-y-2">
              {seed.artifacts.map((a, i) => {
                const ArtifactIcon = iconMap[a.icon] || IconBrief;
                return (
                  <li
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 ripple cursor-pointer group"
                  >
                    <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
                      <ArtifactIcon size={14} stroke="#2FA4F9" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-medium text-slate-800 truncate">
                        {a.title}
                      </div>
                      <div className="text-[10.5px] text-slate-500">
                        {a.type} &middot; {a.size}
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition">
                      <button className="p-1 rounded hover:bg-white" title="Pin">
                        <IconPin size={12} stroke="#475569" />
                      </button>
                      <button className="p-1 rounded hover:bg-white" title="Share">
                        <IconShare size={12} stroke="#475569" />
                      </button>
                      <button className="p-1 rounded hover:bg-white" title="Download">
                        <IconDownload size={12} stroke="#475569" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Save / schedule */}
        <div className="bg-white rounded-2xl elev-1 p-4 space-y-2">
          <Button kind="primary" icon={IconBookmark} size="sm" className="w-full">
            {client ? `Save to ${client.name.split(' ')[0]}` : 'Save to workspace'}
          </Button>
          <Button kind="secondary" icon={IconClock} size="sm" className="w-full">
            Schedule weekly re-run
          </Button>
        </div>
      </div>
    </aside>
  );
};
