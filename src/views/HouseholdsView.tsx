import React, { useState } from 'react';
import { IconPlus, IconUsers, IconChevronLeft, IconEdit, IconArrowRight, IconLightbulb } from '@/components/icons';
import { Avatar, Badge, Button, Card, KPI } from '@/components/ui';
import { HOUSEHOLDS, TOTAL_HOUSEHOLD_AUM, AVG_MEMBERS } from '@/data/households';
import { fmtMoney, fmtPct } from '@/data/clients';
import type { Household } from '@/data/households';

const riskTone = (risk: string) => {
  if (risk === 'Aggressive') return 'danger';
  if (risk === 'Moderate') return 'warn';
  return 'success';
};

const roleTone = (role: string) => {
  if (role === 'Primary') return 'brand';
  if (role === 'Spouse') return 'purple';
  if (role === 'Trust') return 'success';
  return 'neutral';
};

// Days since a date string (YYYY-MM-DD) relative to 2026-04-22
const daysSince = (d: string) => {
  const diff = new Date('2026-04-22').getTime() - new Date(d).getTime();
  return Math.floor(diff / 86_400_000);
};

const needsReviewCount = HOUSEHOLDS.filter(h => daysSince(h.lastReview) > 60).length;

/**
 * Detail panel shown when a household is selected
 */
const HouseholdDetail: React.FC<{ household: Household; onBack: () => void }> = ({ household, onBack }) => {
  const h = household;

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-brand-600 mb-6 group"
      >
        <IconChevronLeft size={16} stroke="#64748B" />
        <span className="group-hover:underline">Back to all households</span>
      </button>

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="h-12 w-12 rounded-2xl bg-brand-50 flex items-center justify-center">
          <IconUsers size={24} stroke="#2FA4F9" sw={2} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{h.name}</h1>
          <p className="text-slate-500 text-sm">
            {h.members.length} member{h.members.length > 1 ? 's' : ''} · {fmtMoney(h.combinedAum)} combined AUM · Last reviewed {h.lastReview}
          </p>
        </div>
        <div className="ml-auto">
          <Badge tone={riskTone(h.consolidatedRisk)}>{h.consolidatedRisk}</Badge>
        </div>
      </div>

      {/* Consolidated Portfolio Allocation */}
      <Card className="p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-4">Consolidated Portfolio Allocation</h2>
        {/* Allocation bar */}
        <div className="flex h-8 rounded-lg overflow-hidden mb-4">
          {h.portfolioAllocation.map((a, i) => (
            <div
              key={i}
              style={{ width: `${a.pct}%`, background: a.color }}
              className="relative group"
              title={`${a.label}: ${a.pct}%`}
            >
              {a.pct >= 12 && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-[11px] font-semibold">
                  {a.pct}%
                </span>
              )}
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex flex-wrap gap-4">
          {h.portfolioAllocation.map((a, i) => (
            <div key={i} className="flex items-center gap-2 text-[12.5px] text-slate-600">
              <div className="w-2.5 h-2.5 rounded-sm" style={{ background: a.color }} />
              <span>{a.label}</span>
              <span className="font-semibold text-slate-900">{a.pct}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Member table */}
      <Card className="overflow-hidden mb-6">
        <div className="px-5 py-4 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900">Members</h2>
        </div>
        <table className="w-full text-[13px]">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-100 bg-slate-50/40">
              <th className="px-5 py-3 font-semibold">Member</th>
              <th className="py-3 font-semibold">Role</th>
              <th className="py-3 font-semibold text-right">AUM</th>
              <th className="py-3 font-semibold text-right">YTD</th>
              <th className="py-3 px-5 font-semibold">Drift</th>
            </tr>
          </thead>
          <tbody>
            {h.members.map((m, i) => (
              <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar initials={m.initials} color={m.color} />
                    <div>
                      <div className="font-semibold text-slate-900">{m.name}</div>
                      {m.clientId ? (
                        <div className="text-[11px] text-brand-600">Linked account</div>
                      ) : (
                        <div className="text-[11px] text-slate-400">External / reference</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <Badge tone={roleTone(m.role)}>{m.role}</Badge>
                </td>
                <td className="py-3 text-right font-medium tabular-nums">{fmtMoney(m.aum)}</td>
                <td className={`py-3 text-right font-semibold tabular-nums ${m.ytd >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {fmtPct(m.ytd, 1, true)}
                </td>
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${Math.min(m.drift * 8, 100)}%`,
                          background: m.drift > 8 ? '#F97316' : m.drift > 5 ? '#F59E0B' : '#10B981',
                        }}
                      />
                    </div>
                    <span className="text-[12px] tabular-nums text-slate-600">{m.drift}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Shared Goals */}
      <Card className="p-6 mb-6">
        <h2 className="text-sm font-semibold text-slate-900 mb-3">Shared Goals</h2>
        <div className="space-y-2">
          {[
            { label: 'Retirement readiness', progress: 72, target: '2038' },
            { label: 'Education funding (2 children)', progress: 45, target: '$320K' },
            { label: 'Estate planning completion', progress: 88, target: 'Q2 2026' },
          ].slice(0, Math.min(h.householdGoals, 3)).map((g, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12.5px] text-slate-700 font-medium">{g.label}</span>
                  <span className="text-[11px] text-slate-400">Target: {g.target}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-500"
                    style={{ width: `${g.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-[12px] font-semibold text-slate-900 w-10 text-right">{g.progress}%</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Cross-account tax optimization */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <IconLightbulb size={18} stroke="#F59E0B" sw={2} />
          <h2 className="text-sm font-semibold text-slate-900">Cross-Account Tax Optimization</h2>
        </div>
        <div className="space-y-3">
          {h.taxOpportunities.map((opp, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
              <div className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-[11px] font-bold text-amber-700">
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-slate-900">{opp.title}</div>
                <div className="text-[12px] text-slate-600 mt-0.5">{opp.description}</div>
              </div>
              <div className="shrink-0 text-right">
                <div className="text-[11px] text-slate-400">Est. savings</div>
                <div className="text-[13px] font-bold text-emerald-600">{opp.potentialSavings}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

/**
 * HouseholdsView
 * Household / family grouping view for consolidated wealth management
 */
export const HouseholdsView: React.FC = () => {
  const [selected, setSelected] = useState<Household | null>(null);

  if (selected) {
    return <HouseholdDetail household={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="max-w-6xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Households</h1>
          <p className="text-slate-500 text-sm mt-1">
            {HOUSEHOLDS.length} households · {fmtMoney(TOTAL_HOUSEHOLD_AUM)} combined AUM
          </p>
        </div>
        <Button kind="primary" icon={IconPlus} size="sm">
          Create household
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPI
          label="Total households"
          value={HOUSEHOLDS.length}
          sub="active family groups"
          accent="#2FA4F9"
        />
        <KPI
          label="Total combined AUM"
          value={fmtMoney(TOTAL_HOUSEHOLD_AUM)}
          sub="across all households"
          accent="#7B5BFF"
        />
        <KPI
          label="Avg members"
          value={AVG_MEMBERS}
          sub="per household"
          accent="#10B981"
        />
        <KPI
          label="Needs review"
          value={needsReviewCount}
          sub="last review > 60 days"
          accent={needsReviewCount > 0 ? '#F97316' : '#10B981'}
        />
      </div>

      {/* Household cards grid */}
      <div className="grid grid-cols-2 gap-5">
        {HOUSEHOLDS.map(h => (
          <Card key={h.id} className="p-5">
            {/* Card header */}
            <div className="flex items-center gap-3 mb-4">
              <Avatar initials={h.members[0].initials} color={h.members[0].color} />
              <div className="flex-1 min-w-0">
                <h3 className="text-[15px] font-bold text-slate-900">{h.name}</h3>
                <p className="text-[12px] text-slate-500">
                  {h.members.length} member{h.members.length > 1 ? 's' : ''} · Last reviewed {h.lastReview}
                </p>
              </div>
              <Badge tone={riskTone(h.consolidatedRisk)}>{h.consolidatedRisk}</Badge>
            </div>

            {/* Members list */}
            <div className="space-y-2 mb-4">
              {h.members.map((m, i) => (
                <div key={i} className="flex items-center gap-2.5">
                  <Avatar initials={m.initials} color={m.color} size="sm" />
                  <span className="text-[13px] text-slate-700 font-medium flex-1">{m.name}</span>
                  <Badge tone={roleTone(m.role)}>{m.role}</Badge>
                </div>
              ))}
            </div>

            {/* Combined AUM + goals */}
            <div className="flex items-end justify-between pt-3 border-t border-slate-100 mb-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Combined AUM</div>
                <div className="text-xl font-bold text-slate-900 mt-0.5">{fmtMoney(h.combinedAum)}</div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Goals</div>
                <div className="text-lg font-bold text-slate-900 mt-0.5">{h.householdGoals}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                kind="soft"
                size="sm"
                icon={IconArrowRight}
                onClick={() => setSelected(h)}
                className="flex-1"
              >
                View household
              </Button>
              <Button
                kind="secondary"
                size="sm"
                icon={IconEdit}
              >
                Edit members
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default HouseholdsView;
