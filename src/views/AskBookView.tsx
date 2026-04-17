import React, { useState } from 'react';
import { IconSearch, IconSparkles, IconDownload, IconRefresh } from '@/components/icons';
import { Badge, Button, Card, SectionTitle } from '@/components/ui';
import { SAVED_QUERIES, runBookQuery } from '@/data/meetings';
import type { BookQueryResult } from '@/types';

export const AskBookView: React.FC = () => {
  const [q, setQ] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<BookQueryResult | null>(null);

  const run = (text: string) => {
    if (!text.trim()) return;
    setRunning(true);
    setResult(null);
    setTimeout(() => {
      setResult(runBookQuery(text));
      setRunning(false);
    }, 1200);
  };

  const pinned = SAVED_QUERIES.filter(s => s.pinned);
  const other = SAVED_QUERIES.filter(s => !s.pinned);

  return (
    <div className="max-w-4xl mx-auto px-8 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-900">Ask my book</h1>
          <Badge tone="purple">v4</Badge>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Ask anything about your clients in plain English. Copilot queries the live book and shows you the answer.
        </p>
      </div>

      <Card className="p-5 mb-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
            <IconSearch size={18} stroke="#2FA4F9" />
          </div>
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run(q)}
            placeholder="e.g. Which clients beat their benchmark YTD?"
            className="flex-1 border-0 outline-none text-[15px] text-slate-900 placeholder:text-slate-400 bg-transparent"
          />
          <Button kind="primary" icon={IconSparkles} onClick={() => run(q)}>Ask</Button>
        </div>
      </Card>

      {!result && !running && (
        <div className="space-y-4">
          {pinned.length > 0 && (
            <div>
              <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">Pinned queries</div>
              <div className="flex flex-wrap gap-2">
                {pinned.map(s => (
                  <button key={s.id} onClick={() => { setQ(s.text); run(s.text); }} className="ripple px-3 py-1.5 rounded-lg bg-brand-50 text-brand-700 border border-brand-100 text-[12.5px] font-medium hover:bg-brand-100">
                    {s.text}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div>
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">Recent & saved</div>
            <div className="flex flex-wrap gap-2">
              {other.map(s => (
                <button key={s.id} onClick={() => { setQ(s.text); run(s.text); }} className="ripple px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12.5px] hover:bg-slate-50">
                  {s.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {running && (
        <Card className="p-5 fade-up">
          <div className="flex items-center gap-2 mb-3">
            <IconSparkles size={16} stroke="#2FA4F9" />
            <div className="font-semibold text-slate-900 text-sm">Thinking…</div>
          </div>
          <div className="flex items-center gap-2 text-[12.5px] text-slate-500">
            <span className="caret" /> Querying your book across 6 clients…
          </div>
        </Card>
      )}

      {result && !running && (
        <div className="space-y-4 fade-up">
          <Card className="p-5">
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400">Answer</div>
                <div className="text-xl font-bold text-slate-900 mt-1">{result.headline}</div>
                <div className="text-[13px] text-slate-500 mt-1">{result.subtitle}</div>
              </div>
              <Badge tone="success">92% confidence</Badge>
            </div>
            <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-[13px]">
                <thead className="bg-slate-50/60 text-[11px] uppercase tracking-wider text-slate-400">
                  <tr>
                    {result.cols.map((c, i) => (
                      <th key={i} className="text-left font-semibold px-4 py-2.5">{c}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.rows.map((r, i) => {
                    const vals = Object.values(r);
                    return (
                      <tr key={i} className="border-t border-slate-100 hover:bg-slate-50/60">
                        {vals.map((v, j) => (
                          <td key={j} className={`px-4 py-2.5 ${j === 0 ? 'font-medium text-slate-900' : 'text-slate-700 tabular-nums'}`}>
                            {String(v)}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex items-center gap-2 mt-4">
              <Button kind="secondary" size="sm" icon={IconDownload}>Export CSV</Button>
              <Button kind="ghost" size="sm" icon={IconRefresh} onClick={() => { setResult(null); setQ(''); }}>New question</Button>
            </div>
          </Card>

          <Card className="p-5">
            <SectionTitle icon={IconSparkles} title="Copilot suggestions" />
            <div className="flex flex-wrap gap-2">
              {['Draft outreach email to top 3', 'Compare against last quarter', 'Bucket by risk profile', 'Turn into a meeting agenda'].map(s => (
                <button key={s} className="ripple px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-[12.5px] hover:bg-slate-50">
                  {s}
                </button>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
