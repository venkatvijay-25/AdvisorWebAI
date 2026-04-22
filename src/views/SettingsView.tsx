import React, { useState } from 'react';
import { Card, Badge, Button, SectionTitle, Avatar } from '@/components/ui';
import {
  IconUser, IconLink, IconBell, IconZap, IconMoon,
  IconDatabase, IconCalendar, IconMail, IconCheckCircle,
  IconAlert, IconShield, IconTrendUp, IconSettings,
  IconChevronRight,
} from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface Integration {
  id: string;
  name: string;
  provider: string;
  options: string[];
  connected: boolean;
  selectedOption: string;
}

interface NotifPref {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

interface AutoPilotRule {
  id: string;
  label: string;
  description: string;
  value: string;
  unit: string;
}

/* ------------------------------------------------------------------ */
/*  Toggle switch                                                      */
/* ------------------------------------------------------------------ */

const Toggle: React.FC<{ enabled: boolean; onToggle: () => void }> = ({ enabled, onToggle }) => (
  <button
    onClick={onToggle}
    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
      enabled ? 'bg-[#2FA4F9]' : 'bg-slate-200'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

/* ------------------------------------------------------------------ */
/*  SettingsView                                                       */
/* ------------------------------------------------------------------ */

const SettingsView: React.FC = () => {
  /* Integrations state */
  const [integrations, setIntegrations] = useState<Integration[]>([
    { id: 'custodian', name: 'Custodian', provider: 'custodian', options: ['Schwab', 'Fidelity', 'Pershing'], connected: true, selectedOption: 'Schwab' },
    { id: 'crm', name: 'CRM', provider: 'crm', options: ['Salesforce', 'Redtail'], connected: true, selectedOption: 'Salesforce' },
    { id: 'calendar', name: 'Calendar', provider: 'calendar', options: ['Google', 'Outlook'], connected: false, selectedOption: 'Google' },
    { id: 'market', name: 'Market Data', provider: 'market', options: ['Bloomberg', 'Refinitiv'], connected: false, selectedOption: 'Bloomberg' },
  ]);

  /* Notification preferences state */
  const [notifPrefs, setNotifPrefs] = useState<NotifPref[]>([
    { id: 'drift', label: 'Drift alerts', description: 'Get notified when client portfolios drift beyond thresholds', enabled: true },
    { id: 'meetings', label: 'Meeting reminders', description: 'Reminders 30 min before scheduled client meetings', enabled: true },
    { id: 'compliance', label: 'Compliance deadlines', description: 'Alerts for upcoming regulatory filings and reviews', enabled: true },
    { id: 'market', label: 'Market alerts', description: 'Significant market movements affecting client portfolios', enabled: false },
    { id: 'autopilot', label: 'AutoPilot actions', description: 'Notifications when AutoPilot executes or recommends trades', enabled: true },
  ]);

  /* AutoPilot rules state */
  const [rules, setRules] = useState<AutoPilotRule[]>([
    { id: 'drift', label: 'Max drift % before alert', description: 'Trigger a notification when any asset class drifts beyond this threshold', value: '5', unit: '%' },
    { id: 'tlh', label: 'TLH minimum loss', description: 'Minimum unrealized loss before tax-loss harvesting is suggested', value: '2500', unit: '$' },
    { id: 'rebalance', label: 'Rebalance frequency', description: 'How often to automatically check and rebalance portfolios', value: 'Quarterly', unit: '' },
  ]);

  const [approvalMode, setApprovalMode] = useState<'Auto' | 'Manual'>('Manual');

  /* Handlers */
  const toggleIntegration = (id: string) => {
    setIntegrations(prev =>
      prev.map(i => (i.id === id ? { ...i, connected: !i.connected } : i))
    );
  };

  const toggleNotif = (id: string) => {
    setNotifPrefs(prev =>
      prev.map(n => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  };

  const updateRule = (id: string, value: string) => {
    setRules(prev =>
      prev.map(r => (r.id === id ? { ...r, value } : r))
    );
  };

  const integrationIcon = (id: string) => {
    switch (id) {
      case 'custodian': return IconDatabase;
      case 'crm': return IconUser;
      case 'calendar': return IconCalendar;
      case 'market': return IconTrendUp;
      default: return IconLink;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-10">
      {/* Page header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <IconSettings size={20} stroke="#475569" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500">Manage your profile, integrations, and preferences</p>
        </div>
      </div>

      {/* ---- 1. Profile ---- */}
      <section className="mb-8">
        <SectionTitle title="Profile" icon={IconUser} />
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <Avatar initials="VV" color="#0F172A" size="lg" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-slate-900 text-sm">Venkat Vijay</h4>
              <p className="text-sm text-slate-500">venkat.vijay@flyerft.com</p>
            </div>
            <Badge tone="brand">Advisor</Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Role</p>
              <p className="text-sm text-slate-700">Senior Wealth Advisor</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Team</p>
              <p className="text-sm text-slate-700">West Coast Private Clients</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">AUM</p>
              <p className="text-sm text-slate-700">$142M</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold mb-1">Clients</p>
              <p className="text-sm text-slate-700">47 households</p>
            </div>
          </div>
        </Card>
      </section>

      {/* ---- 2. Integrations ---- */}
      <section className="mb-8">
        <SectionTitle title="Integrations" icon={IconLink} />
        <div className="grid grid-cols-2 gap-4">
          {integrations.map(integ => {
            const IIcon = integrationIcon(integ.id);
            return (
              <Card key={integ.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                      <IIcon size={18} stroke="#475569" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900">{integ.name}</p>
                      <p className="text-[12px] text-slate-500">{integ.selectedOption}</p>
                    </div>
                  </div>
                  <Badge tone={integ.connected ? 'success' : 'muted'}>
                    {integ.connected ? 'Connected' : 'Not connected'}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={integ.selectedOption}
                    onChange={e =>
                      setIntegrations(prev =>
                        prev.map(i =>
                          i.id === integ.id ? { ...i, selectedOption: e.target.value } : i
                        )
                      )
                    }
                    className="flex-1 text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2FA4F9]/30 focus:border-[#2FA4F9]"
                  >
                    {integ.options.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  <Button
                    kind={integ.connected ? 'ghost' : 'primary'}
                    size="sm"
                    onClick={() => toggleIntegration(integ.id)}
                  >
                    {integ.connected ? 'Disconnect' : 'Connect'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ---- 3. Notification Preferences ---- */}
      <section className="mb-8">
        <SectionTitle title="Notification Preferences" icon={IconBell} />
        <Card className="divide-y divide-slate-100">
          {notifPrefs.map(pref => (
            <div key={pref.id} className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0 mr-4">
                <p className="text-sm font-medium text-slate-900">{pref.label}</p>
                <p className="text-[12px] text-slate-500 mt-0.5">{pref.description}</p>
              </div>
              <Toggle enabled={pref.enabled} onToggle={() => toggleNotif(pref.id)} />
            </div>
          ))}
        </Card>
      </section>

      {/* ---- 4. AutoPilot Rules ---- */}
      <section className="mb-8">
        <SectionTitle title="AutoPilot Rules" icon={IconZap} />
        <Card className="divide-y divide-slate-100">
          {rules.map(rule => (
            <div key={rule.id} className="flex items-center justify-between px-5 py-4">
              <div className="min-w-0 mr-4 flex-1">
                <p className="text-sm font-medium text-slate-900">{rule.label}</p>
                <p className="text-[12px] text-slate-500 mt-0.5">{rule.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {rule.unit === '' ? (
                  <select
                    value={rule.value}
                    onChange={e => updateRule(rule.id, e.target.value)}
                    className="text-sm border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2FA4F9]/30 focus:border-[#2FA4F9] w-32"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Semi-Annual">Semi-Annual</option>
                    <option value="Annual">Annual</option>
                  </select>
                ) : (
                  <div className="flex items-center gap-1">
                    {rule.unit === '$' && <span className="text-sm text-slate-400">$</span>}
                    <input
                      type="text"
                      value={rule.value}
                      onChange={e => updateRule(rule.id, e.target.value)}
                      className="w-20 text-sm text-right border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#2FA4F9]/30 focus:border-[#2FA4F9]"
                    />
                    {rule.unit === '%' && <span className="text-sm text-slate-400">%</span>}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Approval mode */}
          <div className="flex items-center justify-between px-5 py-4">
            <div className="min-w-0 mr-4 flex-1">
              <p className="text-sm font-medium text-slate-900">Approval mode</p>
              <p className="text-[12px] text-slate-500 mt-0.5">Choose whether AutoPilot executes automatically or waits for your approval</p>
            </div>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden">
              {(['Auto', 'Manual'] as const).map(mode => (
                <button
                  key={mode}
                  onClick={() => setApprovalMode(mode)}
                  className={`px-3.5 py-1.5 text-sm font-medium transition-colors ${
                    approvalMode === mode
                      ? 'bg-[#2FA4F9] text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </section>

      {/* ---- 5. Appearance ---- */}
      <section className="mb-8">
        <SectionTitle title="Appearance" icon={IconMoon} />
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center">
                <IconMoon size={18} stroke="#475569" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">Theme</p>
                <p className="text-[12px] text-slate-500">Choose your preferred appearance</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex rounded-lg border border-slate-200 overflow-hidden">
                <button className="px-3.5 py-1.5 text-sm font-medium bg-[#2FA4F9] text-white">
                  Light
                </button>
                <button className="px-3.5 py-1.5 text-sm font-medium bg-white text-slate-400 cursor-not-allowed" disabled>
                  Dark
                </button>
              </div>
              <Badge tone="purple">Coming soon</Badge>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default SettingsView;
