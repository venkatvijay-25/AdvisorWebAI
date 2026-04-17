import React, { useState, useMemo } from 'react';
import {
  IconCheck,
  IconBrain,
  IconChevronDown,
} from '@/components/icons';
import { useAgentSteps } from '@/hooks';

/**
 * Maps a step label to a tool name + fake latency
 */
const inferTool = (label: string): { name: string; ms: number } => {
  const l = label.toLowerCase();
  if (/custodi|pull|load|holdings|lot/i.test(l))
    return { name: 'custodian.fetch', ms: 320 + Math.floor(Math.random() * 120) };
  if (/model|benchmark|compare|attribut/i.test(l))
    return { name: 'portfolio.analyze', ms: 480 + Math.floor(Math.random() * 180) };
  if (/optimi|rebalanc|blotter|trade/i.test(l))
    return { name: 'optimizer.run', ms: 720 + Math.floor(Math.random() * 200) };
  if (/compliance|wash.?sale|pre.?check|rule/i.test(l))
    return { name: 'compliance.check', ms: 280 + Math.floor(Math.random() * 100) };
  if (/tax|tlh|bracket|harvest/i.test(l))
    return { name: 'tax_engine.calc', ms: 390 + Math.floor(Math.random() * 120) };
  if (/stress|scenari|var|monte/i.test(l))
    return { name: 'risk.simulate', ms: 890 + Math.floor(Math.random() * 250) };
  if (/news|wire|bloomberg|reuters/i.test(l))
    return { name: 'news.stream', ms: 220 + Math.floor(Math.random() * 80) };
  if (/draft|brief|email|memo|talking|compose/i.test(l))
    return { name: 'writer.compose', ms: 540 + Math.floor(Math.random() * 160) };
  if (/ips|allocation|projection|generat/i.test(l))
    return { name: 'doc.generate', ms: 610 + Math.floor(Math.random() * 170) };
  return { name: 'reason.step', ms: 260 + Math.floor(Math.random() * 140) };
};

export interface AgentTraceProps {
  steps: Array<string | { label: string; src?: string }>;
  accent?: string;
}

/**
 * AgentTrace - Agent reasoning trace with progressive reveal
 * Shows steps one at a time with status indicators, tool chips, and latency
 */
export const AgentTrace: React.FC<AgentTraceProps> = ({
  steps,
  accent = '#2FA4F9',
}) => {
  const [open, setOpen] = useState(true);
  const done = useAgentSteps(steps, { delay: 240 });
  const allDone = done >= steps.length;

  const toolMeta = useMemo(
    () => steps.map((s) => inferTool(typeof s === 'string' ? s : s.label)),
    [steps]
  );

  const totalMs = toolMeta.slice(0, done).reduce((acc, t) => acc + t.ms, 0);

  return (
    <div className="bg-slate-50/70 rounded-xl border border-slate-100 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-100/60 ripple text-left"
      >
        <div
          className="h-6 w-6 rounded-full flex items-center justify-center shrink-0"
          style={{ background: allDone ? '#ECFDF5' : `${accent}18` }}
        >
          {allDone ? (
            <IconCheck size={12} stroke="#10B981" sw={2.8} />
          ) : (
            <IconBrain size={12} stroke={accent} sw={2.2} />
          )}
        </div>
        <span className="text-[12px] font-semibold text-slate-700 flex-1">
          {allDone
            ? `Reasoning complete \u00B7 ${steps.length} tool calls`
            : `Thinking \u00B7 step ${done}/${steps.length}`}
        </span>
        {allDone && (
          <span className="tool-chip">
            <span className="dot" />
            {(totalMs / 1000).toFixed(1)}s
          </span>
        )}
        <IconChevronDown
          size={14}
          stroke="#94A3B8"
          className={`transition-transform duration-200 ml-1.5 ${open ? 'rotate-0' : '-rotate-90'}`}
        />
      </button>

      {open && (
        <ol className="px-3 pb-3 pt-1 space-y-1.5">
          {steps.map((s, i) => {
            const state = i < done ? 'done' : i === done ? 'active' : 'pending';
            const tool = toolMeta[i];
            const label = typeof s === 'string' ? s : s.label;
            const src = typeof s === 'string' ? undefined : s.src;

            return (
              <li key={i} className="flex items-start gap-2.5 text-[12.5px]">
                <div
                  className={`h-4 w-4 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    state === 'done'
                      ? 'bg-emerald-100'
                      : state === 'active'
                        ? 'bg-brand-100'
                        : 'bg-slate-100'
                  }`}
                >
                  {state === 'done' ? (
                    <IconCheck size={10} stroke="#10B981" sw={3} />
                  ) : state === 'active' ? (
                    <div className="h-1.5 w-1.5 rounded-full bg-brand-500 typing-dot" />
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                  )}
                </div>
                <div
                  className={`flex-1 flex flex-wrap items-center gap-2 ${
                    state === 'pending' ? 'text-slate-400' : 'text-slate-700'
                  }`}
                >
                  <span>{label}</span>
                  {state !== 'pending' && (
                    <span
                      className="tool-chip"
                      style={
                        state === 'active'
                          ? { background: '#DBEAFE', color: '#1D4ED8' }
                          : undefined
                      }
                    >
                      <span
                        className="dot"
                        style={state === 'active' ? { background: '#2FA4F9' } : undefined}
                      />
                      {tool.name}
                      {state === 'done' && (
                        <span className="opacity-60 ml-1">&middot; {tool.ms}ms</span>
                      )}
                    </span>
                  )}
                  {src && (
                    <span className="text-slate-400 text-[11px]">&middot; {src}</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
};
