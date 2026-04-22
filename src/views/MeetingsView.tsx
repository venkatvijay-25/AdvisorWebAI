import React, { useState, useEffect } from 'react';
import {
  IconCalendar,
  IconCheck2,
  IconChevronRight,
  IconChevronLeft,
  IconTarget,
  IconPaperclip,
  IconDownload,
  IconVideoOn,
  IconBrief,
  IconSparkles,
  IconWaveform,
  IconZap,
  IconUsers,
  IconScale,
  IconAlert,
  IconTasks,
  IconPlus,
  IconMail,
  IconEdit,
  IconClock,
  IconBell,
  IconPulse,
  IconLayers,
  IconWand,
  IconShield,
  IconX,
} from '@/components/icons';
import { Avatar, Badge, Button, Card, SectionTitle } from '@/components/ui';
import { MEETINGS, LIVE_TRANSCRIPT } from '@/data/meetings';

/* ================================================================================
   MeetingListCard
   ================================================================================ */
interface MeetingListCardProps {
  m: (typeof MEETINGS)[0];
  onOpen: (m: (typeof MEETINGS)[0]) => void;
}

const MeetingListCard: React.FC<MeetingListCardProps> = ({ m, onOpen }) => {
  const isPast = m.status === 'past';
  return (
    <button onClick={() => onOpen(m)} className="w-full text-left">
      <Card className="p-4 flex items-center gap-4 hover:elev-2 hover:-translate-y-0.5 transition">
        <div
          className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
            isPast ? 'bg-slate-100' : 'bg-brand-50'
          }`}
        >
          {isPast ? (
            <IconCheck2 size={18} stroke="#64748B" strokeWidth={2} />
          ) : (
            <IconCalendar size={18} stroke="#1B8AD8" strokeWidth={2} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <div className="font-semibold text-slate-900 truncate">{m.title}</div>
            {m.prep && (
              <Badge tone="success">AI Brief &#10003;</Badge>
            )}
            {isPast && m.capture && (
              <Badge tone="brand">Auto-captured</Badge>
            )}
            {m.status === 'upcoming' && m.when.startsWith('Today') && (
              <Badge tone="warn">Today</Badge>
            )}
            {isPast && <Badge tone="neutral">Captured</Badge>}
          </div>
          <div className="text-[12.5px] text-slate-500 mt-0.5">
            {m.client} · {m.when} · {m.duration} · {m.channel}
          </div>
        </div>
        <IconChevronRight size={16} stroke="#94A3B8" />
      </Card>
    </button>
  );
};

/* ================================================================================
   PrepTab
   ================================================================================ */
interface PrepTabProps {
  m: (typeof MEETINGS)[0];
}

const PrepTab: React.FC<PrepTabProps> = ({ m }) => {
  if (!m.prep) {
    return (
      <div className="text-center py-10 text-slate-500 text-sm">
        <div className="mx-auto h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center mb-3">
          <IconWand size={20} stroke="#94A3B8" />
        </div>
        Copilot will generate prep talking points 30 min before the meeting.
        <div className="mt-4">
          <Button kind="soft" size="sm">
            <IconSparkles size={14} />
            Generate prep now
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Auto-generation info banner */}
      <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-brand-50/60 border border-brand-100 text-[12px] text-slate-600">
        <IconSparkles size={14} stroke="#2FA4F9" />
        <span>
          This brief was auto-generated <span className="font-semibold text-slate-700">24h before the meeting</span> and updated <span className="font-semibold text-slate-700">2h ago</span>. Last data refresh: <span className="font-semibold text-slate-700">6 min ago</span>.
        </span>
      </div>
      <Card className="p-5">
        <SectionTitle
          icon={IconTarget}
          title="Suggested talking points"
          action={<Badge tone="brand">AI-drafted</Badge>}
        />
        <ol className="space-y-2.5">
          {m.prep.talking.map((t, i) => (
            <li
              key={i}
              className="flex items-start gap-2.5 text-[13.5px] text-slate-700 leading-relaxed"
            >
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
              <span>{t}</span>
            </li>
          ))}
        </ol>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={IconPaperclip} title="Pre-read artifacts" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
          {m.prep.artifacts.map((a, i) => {
            // Map icon string to icon component
            const iconMap: Record<string, React.ComponentType<any>> = {
              brief: IconBrief,
              bar: (props: any) => <IconWaveform {...props} />,
            };
            const IconComponent = iconMap[a.icon] || IconBrief;

            return (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
              >
                <div className="h-9 w-9 rounded-xl bg-brand-50 flex items-center justify-center">
                  <IconComponent size={16} stroke="#1B8AD8" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-slate-900 truncate">
                    {a.title}
                  </div>
                  <div className="text-[11.5px] text-slate-500">
                    {a.type} · {a.size}
                  </div>
                </div>
                <IconDownload size={14} stroke="#64748B" />
              </div>
            );
          })}
        </div>
      </Card>
      <div className="flex gap-2">
        <Button kind="primary">
          <IconVideoOn size={14} />
          Start meeting
        </Button>
        <Button kind="secondary">
          <IconBrief size={14} />
          Open brief
        </Button>
        <Button kind="ghost">
          <IconSparkles size={14} />
          Regenerate prep
        </Button>
      </div>
    </div>
  );
};

/* ================================================================================
   LiveTab
   ================================================================================ */
interface LiveTabProps {
  m: (typeof MEETINGS)[0];
}

const LiveTab: React.FC<LiveTabProps> = ({ m }) => {
  const [elapsed, setElapsed] = useState(0);
  const [recording, setRecording] = useState(true);

  useEffect(() => {
    if (!recording) return;
    const h = setInterval(() => setElapsed((e) => e + 500), 500);
    return () => clearInterval(h);
  }, [recording]);

  const visible = LIVE_TRANSCRIPT.filter((l) => l.t <= elapsed);
  const mmss = `${String(Math.floor(elapsed / 60000)).padStart(2, '0')}:${String(
    Math.floor((elapsed / 1000) % 60)
  ).padStart(2, '0')}`;

  // Live AI assistance based on what's been said
  const assist: Array<{ icon: React.ComponentType<any>; tone: string; text: string }> = [];
  if (visible.length >= 2)
    assist.push({ icon: IconTarget, tone: 'brand', text: 'Lead with YTD +8.2% vs +6.4% benchmark.' });
  if (visible.length >= 4)
    assist.push({
      icon: IconScale,
      tone: 'purple',
      text: 'Rebalance: trim NVDA, VTI → add BND. 3 trades.',
    });
  if (visible.length >= 6)
    assist.push({ icon: IconZap, tone: 'warn', text: '$11K TLH opportunity in AAPL lot offsets gains.' });
  if (visible.length >= 7)
    assist.push({
      icon: IconUsers,
      tone: 'success',
      text: 'Life event: Maya, college in 2027. Queue 529 review.',
    });

  return (
    <div className="grid grid-cols-5 gap-5">
      <div className="col-span-3 space-y-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <span
                className={`relative h-2.5 w-2.5 rounded-full ${
                  recording ? 'bg-rose-500' : 'bg-slate-400'
                }`}
              />
              <span className="text-sm font-semibold text-slate-900">
                {recording ? 'Recording' : 'Paused'}
              </span>
              <span className="text-xs text-slate-500 tabular-nums">{mmss}</span>
            </div>
            <div className="flex items-center gap-2">
              <Button kind="ghost" size="sm" onClick={() => setRecording((r) => !r)}>
                {recording ? 'Pause' : 'Resume'}
              </Button>
              <Button kind="secondary" size="sm">
                <IconCheck2 size={14} />
                End & capture
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-1.5 mb-4">
            {Array.from({ length: 48 }).map((_, i) => (
              <div
                key={i}
                className="w-1 rounded-full bg-brand-500/70"
                style={{
                  height: `${6 + Math.abs(Math.sin(i + elapsed / 500) * 14)}px`,
                }}
              />
            ))}
          </div>
          <div className="space-y-3 max-h-[360px] overflow-y-auto scroll-thin pr-1">
            {visible.map((l, i) => (
              <div key={i} className="flex items-start gap-3">
                <Avatar
                  initials={l.who === 'Sarah' ? 'SC' : 'VV'}
                  color={l.who === 'Sarah' ? '#8B5CF6' : '#0F172A'}
                  size="sm"
                />
                <div className="flex-1">
                  <div className="text-[11px] text-slate-500 font-medium">{l.who}</div>
                  <div className="text-[13.5px] text-slate-800 leading-relaxed">{l.text}</div>
                </div>
              </div>
            ))}
            {visible.length < LIVE_TRANSCRIPT.length && recording && (
              <div className="flex items-center gap-2 text-xs text-slate-400 pl-10">
                <span>Listening…</span>
              </div>
            )}
          </div>
        </Card>
      </div>
      <div className="col-span-2 space-y-4">
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconSparkles size={16} stroke="#2FA4F9" />
            <div className="font-semibold text-slate-900 text-sm">Live copilot nudges</div>
          </div>
          {assist.length === 0 ? (
            <div className="text-[12.5px] text-slate-500">
              Copilot will surface nudges as the conversation unfolds…
            </div>
          ) : (
            <div className="space-y-2">
              {assist.map((a, i) => {
                const IconC = a.icon;
                const bgMap: Record<string, string> = {
                  brand: 'bg-brand-50',
                  purple: 'bg-violet-50',
                  warn: 'bg-amber-50',
                  success: 'bg-emerald-50',
                };
                const colMap: Record<string, string> = {
                  brand: '#1B8AD8',
                  purple: '#7C3AED',
                  warn: '#B45309',
                  success: '#059669',
                };
                const bg = bgMap[a.tone];
                const col = colMap[a.tone];

                return (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl border border-slate-100 hover:bg-slate-50/60"
                  >
                    <div className={`h-7 w-7 rounded-lg ${bg} flex items-center justify-center shrink-0`}>
                      <IconC size={14} stroke={col} strokeWidth={2} />
                    </div>
                    <div className="flex-1 text-[12.5px] text-slate-700">{a.text}</div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconWaveform size={16} stroke="#475569" />
            <div className="font-semibold text-slate-900 text-sm">Auto-detected signals</div>
          </div>
          <div className="space-y-2 text-[12.5px]">
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Tone</span>
              <Badge tone="success">Collaborative</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Sentiment</span>
              <Badge tone="brand">Positive 0.72</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Topics</span>
              <span className="text-slate-800">Performance · Tax · Education</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-600">Open questions</span>
              <span className="text-slate-800">0</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

/* ================================================================================
   CaptureTab
   ================================================================================ */
interface CaptureTabProps {
  m: (typeof MEETINGS)[0];
}

const CaptureTab: React.FC<CaptureTabProps> = ({ m }) => {
  const [manualNotes, setManualNotes] = useState('');
  const [manualDecisions, setManualDecisions] = useState<string[]>([]);
  const [manualActions, setManualActions] = useState<string[]>([]);
  const [manualObjections, setManualObjections] = useState<string[]>([]);
  const [manualLifeEvents, setManualLifeEvents] = useState<string[]>([]);

  const addEntry = (
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => [...prev, '']);
  };

  const updateEntry = (
    setter: React.Dispatch<React.SetStateAction<string[]>>,
    index: number,
    value: string
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const editableInputClass =
    'w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 font-[Inter,sans-serif]';

  if (!m.capture) {
    return (
      <div className="space-y-5">
        {/* Manual notes area */}
        <Card className="p-5">
          <SectionTitle icon={IconEdit} title="Meeting notes" />
          <textarea
            value={manualNotes}
            onChange={(e) => setManualNotes(e.target.value)}
            placeholder="Add meeting notes, decisions, or action items..."
            rows={5}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none font-[Inter,sans-serif]"
          />
          <div className="flex flex-wrap gap-2 mt-3">
            <Button kind="soft" size="sm" onClick={() => addEntry(setManualDecisions)}>
              <IconCheck2 size={13} />
              Add Decision
            </Button>
            <Button kind="soft" size="sm" onClick={() => addEntry(setManualActions)}>
              <IconTasks size={13} />
              Add Action Item
            </Button>
            <Button kind="soft" size="sm" onClick={() => addEntry(setManualObjections)}>
              <IconAlert size={13} />
              Add Objection
            </Button>
            <Button kind="soft" size="sm" onClick={() => addEntry(setManualLifeEvents)}>
              <IconUsers size={13} />
              Add Life Event
            </Button>
          </div>
        </Card>

        {/* Manual decisions */}
        {manualDecisions.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={IconCheck2} title="Decisions" />
            <div className="space-y-2">
              {manualDecisions.map((d, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <input
                    type="text"
                    value={d}
                    onChange={(e) => updateEntry(setManualDecisions, i, e.target.value)}
                    placeholder="Describe the decision..."
                    className={editableInputClass}
                    autoFocus
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Manual action items */}
        {manualActions.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={IconTasks} title="Action items" />
            <div className="space-y-2">
              {manualActions.map((a, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                  <input
                    type="text"
                    value={a}
                    onChange={(e) => updateEntry(setManualActions, i, e.target.value)}
                    placeholder="Describe the action item..."
                    className={editableInputClass}
                    autoFocus
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Manual objections */}
        {manualObjections.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={IconAlert} title="Objections & concerns" />
            <div className="space-y-2">
              {manualObjections.map((o, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                  <input
                    type="text"
                    value={o}
                    onChange={(e) => updateEntry(setManualObjections, i, e.target.value)}
                    placeholder="Describe the objection or concern..."
                    className={editableInputClass}
                    autoFocus
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Manual life events */}
        {manualLifeEvents.length > 0 && (
          <Card className="p-5">
            <SectionTitle icon={IconUsers} title="Life events" />
            <div className="space-y-2">
              {manualLifeEvents.map((e, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="mt-[10px] h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                  <input
                    type="text"
                    value={e}
                    onChange={(ev) => updateEntry(setManualLifeEvents, i, ev.target.value)}
                    placeholder="Describe the life event..."
                    className={editableInputClass}
                    autoFocus
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Secondary auto-capture message */}
        <div className="flex items-center gap-2 justify-center text-[12px] text-slate-400 pt-2">
          <IconWaveform size={14} stroke="#CBD5E1" />
          <span>Capture is also populated automatically after the meeting ends.</span>
        </div>
      </div>
    );
  }

  const { decisions, objections, lifeEvents, actions } = m.capture;

  return (
    <div className="space-y-5">
      <Card className="p-5">
        <SectionTitle
          icon={IconCheck2}
          title="Decisions"
          action={<Badge tone="success">AI-captured</Badge>}
        />
        <ul className="space-y-2">
          {decisions.map((d, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-[13.5px] text-slate-700"
            >
              <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
              <span>{d}</span>
            </li>
          ))}
        </ul>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5">
          <SectionTitle icon={IconAlert} title="Objections & concerns" />
          <ul className="space-y-2">
            {objections.map((o, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[13.5px] text-slate-700"
              >
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-amber-500 shrink-0" />
                <span>{o}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="p-5">
          <SectionTitle icon={IconUsers} title="Life events" />
          <ul className="space-y-2">
            {lifeEvents.map((e, i) => (
              <li
                key={i}
                className="flex items-start gap-2 text-[13.5px] text-slate-700"
              >
                <span className="mt-[6px] h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                <span>{e}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card className="p-5">
        <SectionTitle
          icon={IconTasks}
          title="Action items"
          action={
            <Button kind="soft" size="sm">
              <IconPlus size={14} />
              Add action
            </Button>
          }
        />
        <div className="divide-y divide-slate-100">
          {actions.map((a) => (
            <div key={a.id} className="flex items-center gap-3 py-2.5">
              <input type="checkbox" defaultChecked={a.done} className="h-4 w-4 accent-brand-500" />
              <div className="flex-1">
                <div
                  className={`text-[13.5px] ${
                    a.done ? 'text-slate-400 line-through' : 'text-slate-800'
                  }`}
                >
                  {a.text}
                </div>
                <div className="text-[11.5px] text-slate-500 mt-0.5">
                  Owner: {a.owner} · Due {a.due}
                </div>
              </div>
              {a.done ? <Badge tone="success">Done</Badge> : <Badge tone="warn">Open</Badge>}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/* ================================================================================
   FollowThroughTab
   ================================================================================ */
interface FollowThroughTabProps {
  m: (typeof MEETINGS)[0];
}

const FollowThroughTab: React.FC<FollowThroughTabProps> = ({ m }) => {
  if (!m.capture) {
    return (
      <div className="text-center py-10 text-slate-500 text-sm">
        Follow-through emails and reminders will appear here after capture.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="p-5">
        <SectionTitle
          icon={IconMail}
          title="Drafted recap email"
          action={<Badge tone="brand">AI-drafted</Badge>}
        />
        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/40 text-[13.5px] text-slate-700 leading-relaxed">
          <div className="text-[12px] text-slate-500 mb-2">
            To: david.goldberg@gmail.com · Subject: Recap — Apr 08 annual review
          </div>
          <p>Hi David,</p>
          <p className="mt-2">Great conversation today. To recap what we agreed:</p>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Holding at the Capital Preservation model this quarter.</li>
            <li>Stepping the muni-bond sleeve up from 22% to 25% at our next rebalance.</li>
            <li>I'll send the ladder proposal by Apr 20 and set up a 529 intro call with our CPA.</li>
          </ul>
          <p className="mt-2">
            Warm regards,
            <br />
            Vijay
          </p>
        </div>
        <div className="flex gap-2 mt-4">
          <Button kind="primary">
            <IconMail size={14} />
            Send via Outlook
          </Button>
          <Button kind="secondary">
            <IconEdit size={14} />
            Edit draft
          </Button>
          <Button kind="ghost">
            <IconSparkles size={14} />
            Regenerate
          </Button>
        </div>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={IconClock} title="Scheduled follow-ups" />
        <div className="space-y-2 text-[13px]">
          <div className="flex items-center gap-3">
            <IconBell size={14} stroke="#2FA4F9" />
            <span className="text-slate-700">Reminder to send ladder proposal</span>
            <span className="text-slate-500 ml-auto">Apr 20</span>
          </div>
          <div className="flex items-center gap-3">
            <IconCalendar size={14} stroke="#7C3AED" />
            <span className="text-slate-700">529 intro call with CPA</span>
            <span className="text-slate-500 ml-auto">Apr 25</span>
          </div>
          <div className="flex items-center gap-3">
            <IconPulse size={14} stroke="#059669" />
            <span className="text-slate-700">Next review prompt</span>
            <span className="text-slate-500 ml-auto">Jul 08</span>
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <SectionTitle icon={IconLayers} title="CRM updates" />
        <div className="space-y-2 text-[13px] text-slate-700">
          <div className="flex items-center gap-2">
            <IconCheck2 size={14} stroke="#059669" /> Meeting logged to CRM timeline
          </div>
          <div className="flex items-center gap-2">
            <IconCheck2 size={14} stroke="#059669" /> 1 new life event tagged (grandchild born)
          </div>
          <div className="flex items-center gap-2">
            <IconCheck2 size={14} stroke="#059669" /> 3 action items synced to task engine
          </div>
        </div>
      </Card>

      {/* Automated follow-ups */}
      <Card className="p-5">
        <SectionTitle
          icon={IconZap}
          title="Automated follow-ups"
          action={<Badge tone="brand">Copilot</Badge>}
        />
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/40">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <IconCheck2 size={14} stroke="#059669" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">CRM updated</div>
              <div className="text-[11.5px] text-slate-500">Meeting notes and action items synced</div>
            </div>
            <Badge tone="success">Done</Badge>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/40">
            <div className="h-8 w-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
              <IconCalendar size={14} stroke="#1B8AD8" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">Follow-up meeting scheduled</div>
              <div className="text-[11.5px] text-slate-500">529 intro call with CPA</div>
            </div>
            <span className="text-[12px] text-slate-500 font-medium">Apr 25</span>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/40">
            <div className="h-8 w-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <IconTasks size={14} stroke="#059669" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">Action items pushed to task manager</div>
              <div className="text-[11.5px] text-slate-500">3 items synced to your task engine</div>
            </div>
            <Badge tone="success">Done</Badge>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50/40">
            <div className="h-8 w-8 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
              <IconShield size={14} stroke="#B45309" strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold text-slate-900">Compliance notes filed</div>
              <div className="text-[11.5px] text-slate-500">Awaiting compliance officer review</div>
            </div>
            <Badge tone="warn">Pending</Badge>
          </div>
        </div>
      </Card>
    </div>
  );
};

/* ================================================================================
   MeetingDetail
   ================================================================================ */
interface MeetingDetailProps {
  m: (typeof MEETINGS)[0];
  onBack: () => void;
}

const MeetingDetail: React.FC<MeetingDetailProps> = ({ m, onBack }) => {
  const [tab, setTab] = useState<'prep' | 'live' | 'capture' | 'follow'>(
    m.status === 'past' ? 'capture' : 'prep'
  );

  const tabs: Array<{
    id: 'prep' | 'live' | 'capture' | 'follow';
    label: string;
    icon: React.ComponentType<any>;
  }> = [
    { id: 'prep', label: 'Prep', icon: IconTarget },
    { id: 'live', label: 'Live', icon: IconWaveform },
    { id: 'capture', label: 'Capture', icon: IconCheck2 },
    { id: 'follow', label: 'Follow-through', icon: IconMail },
  ];

  return (
    <div className="max-w-6xl mx-auto px-8 py-6">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900 mb-4"
      >
        <IconChevronLeft size={16} /> Back to meetings
      </button>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{m.title}</h1>
            {m.status === 'upcoming' && m.when.startsWith('Today') && (
              <Badge tone="warn">Today</Badge>
            )}
          </div>
          <p className="text-slate-500 text-sm mt-1">
            {m.client} · {m.whenISO} · {m.duration} · {m.channel}
          </p>
          <div className="flex items-center gap-1.5 mt-3">
            {m.attendees.map((a, i) => (
              <Badge key={i} tone="neutral">
                {a}
              </Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {m.status === 'upcoming' ? (
            <Button kind="primary">
              <IconVideoOn size={14} />
              Start meeting
            </Button>
          ) : (
            <Button kind="secondary">
              <IconBrief size={14} />
              Open capture PDF
            </Button>
          )}
        </div>
      </div>
      <div className="border-b border-slate-200 mb-6">
        <div className="flex items-center gap-0.5">
          {tabs.map((t) => {
            const IconC = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-medium border-b-2 -mb-px ${
                  active
                    ? 'border-brand-500 text-brand-700'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                <IconC
                  size={14}
                  strokeWidth={active ? 2.2 : 1.8}
                  stroke={active ? '#1B8AD8' : '#64748B'}
                />
                {t.label}
              </button>
            );
          })}
        </div>
      </div>
      {tab === 'prep' && <PrepTab m={m} />}
      {tab === 'live' && <LiveTab m={m} />}
      {tab === 'capture' && <CaptureTab m={m} />}
      {tab === 'follow' && <FollowThroughTab m={m} />}
    </div>
  );
};

/* ================================================================================
   ScheduleMeetingModal
   ================================================================================ */
interface ScheduleMeetingModalProps {
  open: boolean;
  onClose: () => void;
}

const CLIENT_NAMES = ['Sarah Chen', 'Marcus Reid', 'Lin Zhao', 'David Goldberg', 'Anika Patel'];

const ScheduleMeetingModal: React.FC<ScheduleMeetingModalProps> = ({ open, onClose }) => {
  const [client, setClient] = useState('');
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState('30 min');
  const [channel, setChannel] = useState('Video');
  const [attendees, setAttendees] = useState('');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!open) return null;

  const handleSubmit = () => {
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setClient('');
      setTitle('');
      setDate('');
      setTime('');
      setDuration('30 min');
      setChannel('Video');
      setAttendees('');
      setNotes('');
      onClose();
    }, 1500);
  };

  const handleCancel = () => {
    setClient('');
    setTitle('');
    setDate('');
    setTime('');
    setDuration('30 min');
    setChannel('Video');
    setAttendees('');
    setNotes('');
    onClose();
  };

  const labelClass = 'block text-[13px] font-medium text-slate-700 mb-1';
  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-[13.5px] text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 font-[Inter,sans-serif]';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleCancel} />
      <div className="relative w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-brand-50 flex items-center justify-center">
              <IconCalendar size={16} stroke="#1B8AD8" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Schedule meeting</h2>
          </div>
          <button
            onClick={handleCancel}
            className="h-8 w-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition"
          >
            <IconX size={16} stroke="#64748B" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-16 px-6">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
              <IconCheck2 size={24} stroke="#059669" strokeWidth={2} />
            </div>
            <div className="text-lg font-semibold text-slate-900 mb-1">Meeting scheduled</div>
            <div className="text-sm text-slate-500">
              Copilot will generate a prep brief 30 minutes before the meeting.
            </div>
          </div>
        ) : (
          <>
            {/* Body */}
            <div className="px-6 py-5 space-y-4 max-h-[60vh] overflow-y-auto scroll-thin">
              {/* Client selector */}
              <div>
                <label className={labelClass}>Client</label>
                <select
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select a client...</option>
                  {CLIENT_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className={labelClass}>Meeting title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q2 Portfolio Review"
                  className={inputClass}
                />
              </div>

              {/* Date & Time row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Date</label>
                  <input
                    type="text"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="e.g. 2026-05-01"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Time</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 2:30 PM"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* Duration & Channel row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className={inputClass}
                  >
                    <option value="15 min">15 min</option>
                    <option value="30 min">30 min</option>
                    <option value="45 min">45 min</option>
                    <option value="1 hr">1 hr</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Channel</label>
                  <select
                    value={channel}
                    onChange={(e) => setChannel(e.target.value)}
                    className={inputClass}
                  >
                    <option value="Video">Video</option>
                    <option value="In-person">In-person</option>
                    <option value="Phone">Phone</option>
                  </select>
                </div>
              </div>

              {/* Attendees */}
              <div>
                <label className={labelClass}>Attendees</label>
                <input
                  type="text"
                  value={attendees}
                  onChange={(e) => setAttendees(e.target.value)}
                  placeholder="e.g. Vijay Venkat, Sarah Chen, Ana Silva"
                  className={inputClass}
                />
              </div>

              {/* Notes / Agenda */}
              <div>
                <label className={labelClass}>Notes / Agenda</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add agenda items, topics to discuss, or preparation notes..."
                  rows={3}
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-100 bg-slate-50/40">
              <Button kind="ghost" onClick={handleCancel}>
                Cancel
              </Button>
              <Button kind="primary" onClick={handleSubmit}>
                <IconCalendar size={14} />
                Schedule
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ================================================================================
   MeetingsView
   ================================================================================ */
const MeetingsView: React.FC = () => {
  const [open, setOpen] = useState<(typeof MEETINGS)[0] | null>(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  if (open) return <MeetingDetail m={open} onBack={() => setOpen(null)} />;

  const upcoming = MEETINGS.filter((m) => m.status === 'upcoming');
  const past = MEETINGS.filter((m) => m.status === 'past');

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      <ScheduleMeetingModal open={showScheduleModal} onClose={() => setShowScheduleModal(false)} />
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">Meetings</h1>
            <Badge tone="purple">v3</Badge>
          </div>
          <p className="text-slate-500 text-sm mt-1">
            Prep, capture, and follow through — automatically.
          </p>
        </div>
        <Button kind="primary" onClick={() => setShowScheduleModal(true)}>
          <IconPlus size={14} />
          Schedule meeting
        </Button>
      </div>
      <Card className="p-4 mb-6 bg-gradient-to-r from-brand-50 to-violet-50 border border-brand-100">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center">
            <IconSparkles size={18} stroke="#2FA4F9" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-slate-900 text-sm">
              Copilot handles every meeting end-to-end
            </div>
            <div className="text-[12.5px] text-slate-600 mt-0.5">
              Generates prep 30 min before · listens live with nudges · auto-captures decisions &
              actions · drafts recap email.
            </div>
          </div>
        </div>
      </Card>
      <div className="mb-8">
        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2.5">
          Upcoming · {upcoming.length}
        </div>
        <div className="space-y-2.5">
          {upcoming.map((m) => (
            <MeetingListCard key={m.id} m={m} onOpen={setOpen} />
          ))}
        </div>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2.5">
          Recently completed · {past.length}
        </div>
        <div className="space-y-2.5">
          {past.map((m) => (
            <MeetingListCard key={m.id} m={m} onOpen={setOpen} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingsView;
