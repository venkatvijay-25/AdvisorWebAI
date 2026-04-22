import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import {
  IconBrief,
  IconCheck,
  IconCheckCircle,
  IconChevronDown,
  IconClock,
  IconDownload,
  IconMail,
  IconSparkles,
  IconX,
} from '@/components/icons';
import { CLIENTS } from '@/data/clients';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type ReportPeriod = 'Q1 2026' | 'Q2 2026' | 'YTD' | '1 Year' | 'Custom';
type ReportType = 'Performance Summary' | 'Detailed Attribution' | 'Quarterly Review' | 'Annual Report';
type CoverStyle = 'Minimal' | 'Standard' | 'Premium';
type ColorTheme = 'Brand Blue' | 'Navy' | 'Forest Green' | 'Charcoal';

interface Section {
  key: string;
  label: string;
  detail?: string;
  locked?: boolean;
  pages: number;
}

const ALL_SECTIONS: Section[] = [
  { key: 'exec', label: 'Executive Summary', locked: true, pages: 1 },
  { key: 'perf', label: 'Portfolio Performance', detail: 'with benchmark comparison', pages: 2 },
  { key: 'alloc', label: 'Asset Allocation', detail: 'breakdown', pages: 1 },
  { key: 'attrib', label: 'Attribution Analysis', detail: 'sector / security level', pages: 2 },
  { key: 'holdings', label: 'Holdings Detail', pages: 2 },
  { key: 'risk', label: 'Risk Metrics', detail: 'volatility, Sharpe, max drawdown', pages: 1 },
  { key: 'txn', label: 'Transaction Summary', pages: 1 },
  { key: 'fees', label: 'Fee Summary', pages: 1 },
  { key: 'commentary', label: 'Market Commentary', pages: 1 },
  { key: 'recs', label: 'Recommendations & Next Steps', pages: 1 },
];

const REPORT_TYPES: ReportType[] = [
  'Performance Summary',
  'Detailed Attribution',
  'Quarterly Review',
  'Annual Report',
];

const COVER_STYLES: CoverStyle[] = ['Minimal', 'Standard', 'Premium'];

const COLOR_THEMES: { label: ColorTheme; hex: string }[] = [
  { label: 'Brand Blue', hex: '#2FA4F9' },
  { label: 'Navy', hex: '#1E3A5F' },
  { label: 'Forest Green', hex: '#2D6A4F' },
  { label: 'Charcoal', hex: '#374151' },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export const ReportBuilderView = () => {
  // Config state
  const [selectedClient, setSelectedClient] = useState('all');
  const [period, setPeriod] = useState<ReportPeriod>('Q1 2026');
  const [customFrom, setCustomFrom] = useState('2026-01-01');
  const [customTo, setCustomTo] = useState('2026-04-22');
  const [reportType, setReportType] = useState<ReportType>('Performance Summary');
  const [enabledSections, setEnabledSections] = useState<Set<string>>(
    new Set(ALL_SECTIONS.map(s => s.key)),
  );
  const [firmLogo, setFirmLogo] = useState(true);
  const [coverStyle, setCoverStyle] = useState<CoverStyle>('Standard');
  const [colorTheme, setColorTheme] = useState<ColorTheme>('Brand Blue');

  // Action state
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [recurDropdown, setRecurDropdown] = useState(false);
  const [recurChoice, setRecurChoice] = useState<string | null>(null);
  const [emailModal, setEmailModal] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const toggleSection = (key: string) => {
    setEnabledSections(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const estimatedPages = ALL_SECTIONS.filter(s => enabledSections.has(s.key)).reduce(
    (sum, s) => sum + s.pages,
    1, // cover page
  );

  const clientName =
    selectedClient === 'all'
      ? 'All Clients'
      : CLIENTS.find(c => c.id === selectedClient)?.name ?? 'Client';

  const themeHex = COLOR_THEMES.find(t => t.label === colorTheme)?.hex ?? '#2FA4F9';

  const handleGenerate = () => {
    setGenerating(true);
    setGenerated(false);
    setTimeout(() => {
      setGenerating(false);
      setGenerated(true);
    }, 2200);
  };

  // Reset generated state on config change
  useEffect(() => {
    setGenerated(false);
  }, [selectedClient, period, reportType, enabledSections, coverStyle, colorTheme]);

  /* ---------------------------------------------------------------- */
  /*  Email modal                                                      */
  /* ---------------------------------------------------------------- */
  const clientEmail =
    selectedClient === 'all'
      ? 'team@flyerft.com'
      : `${clientName.toLowerCase().replace(/\s+/g, '.')}@email.com`;

  const EmailModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <Card className="w-full max-w-md p-6 relative">
        <button
          onClick={() => { setEmailModal(false); setEmailSent(false); }}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <IconX size={18} />
        </button>
        <h3 className="text-lg font-semibold text-slate-900 mb-1">Email Report to Client</h3>
        <p className="text-sm text-slate-500 mb-5">
          The generated report will be attached as a PDF.
        </p>

        {emailSent ? (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
              <IconCheckCircle size={28} stroke="#10B981" sw={2} />
            </div>
            <p className="text-sm font-medium text-emerald-700">Email sent successfully</p>
          </div>
        ) : (
          <>
            <label className="block text-xs font-medium text-slate-600 mb-1">To</label>
            <input
              type="email"
              defaultValue={clientEmail}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            />
            <label className="block text-xs font-medium text-slate-600 mb-1">Subject</label>
            <input
              type="text"
              defaultValue={`${reportType} - ${period}${selectedClient !== 'all' ? ` | ${clientName}` : ''}`}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 mb-4 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
            />
            <label className="block text-xs font-medium text-slate-600 mb-1">Message</label>
            <textarea
              rows={3}
              defaultValue={`Hi ${clientName === 'All Clients' ? 'Team' : clientName.split(' ')[0]},\n\nPlease find your ${reportType.toLowerCase()} for ${period} attached.\n\nBest regards,\nVijay Venkat`}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 mb-5 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <Button kind="ghost" size="sm" onClick={() => setEmailModal(false)}>
                Cancel
              </Button>
              <Button kind="primary" size="sm" icon={IconMail} onClick={() => setEmailSent(true)}>
                Send email
              </Button>
            </div>
          </>
        )}
      </Card>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
  return (
    <div className="max-w-7xl mx-auto px-6 py-8 font-[Inter]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Report Builder</h1>
        <p className="text-sm text-slate-500 mt-1">
          Generate customized performance reports for client delivery
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* ============ LEFT: Configuration Panel (~60%) ============ */}
        <div className="flex-[3] min-w-0 space-y-6">
          {/* Client Selector */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Client</h2>
            <div className="relative">
              <select
                value={selectedClient}
                onChange={e => setSelectedClient(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white pl-3 pr-9 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 cursor-pointer"
              >
                <option value="all">All clients</option>
                {CLIENTS.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.segment}
                  </option>
                ))}
              </select>
              <IconChevronDown
                size={16}
                stroke="#94A3B8"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2"
              />
            </div>
          </Card>

          {/* Report Period */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Report Period</h2>
            <div className="flex flex-wrap gap-2 mb-3">
              {(['Q1 2026', 'Q2 2026', 'YTD', '1 Year', 'Custom'] as ReportPeriod[]).map(p => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium transition ${
                    period === p
                      ? 'bg-brand-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
            {period === 'Custom' && (
              <div className="flex gap-3 mt-2">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">From</label>
                  <input
                    type="date"
                    value={customFrom}
                    onChange={e => setCustomFrom(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-slate-500 mb-1">To</label>
                  <input
                    type="date"
                    value={customTo}
                    onChange={e => setCustomTo(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                  />
                </div>
              </div>
            )}
          </Card>

          {/* Report Type */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Report Type</h2>
            <div className="grid grid-cols-2 gap-2">
              {REPORT_TYPES.map(rt => (
                <button
                  key={rt}
                  onClick={() => setReportType(rt)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium text-left transition border ${
                    reportType === rt
                      ? 'border-brand-400 bg-brand-50 text-brand-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {rt}
                </button>
              ))}
            </div>
          </Card>

          {/* Sections Toggle */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-3">Sections to Include</h2>
            <div className="space-y-1.5">
              {ALL_SECTIONS.map(s => {
                const checked = enabledSections.has(s.key);
                return (
                  <label
                    key={s.key}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition ${
                      checked ? 'bg-slate-50' : 'hover:bg-slate-50'
                    } ${s.locked ? 'opacity-90' : ''}`}
                  >
                    <span
                      className={`w-5 h-5 rounded flex items-center justify-center border transition shrink-0 ${
                        checked
                          ? 'bg-brand-500 border-brand-500'
                          : 'border-slate-300 bg-white'
                      }`}
                    >
                      {checked && <IconCheck size={14} stroke="#fff" sw={2.5} />}
                    </span>
                    <input
                      type="checkbox"
                      className="sr-only"
                      checked={checked}
                      disabled={s.locked}
                      onChange={() => !s.locked && toggleSection(s.key)}
                    />
                    <span className="flex-1 min-w-0">
                      <span className="text-sm text-slate-800 font-medium">{s.label}</span>
                      {s.detail && (
                        <span className="text-xs text-slate-400 ml-1.5">({s.detail})</span>
                      )}
                    </span>
                    {s.locked && (
                      <Badge tone="muted">Always on</Badge>
                    )}
                  </label>
                );
              })}
            </div>
          </Card>

          {/* Branding Options */}
          <Card className="p-5">
            <h2 className="text-sm font-semibold text-slate-900 mb-4">Branding Options</h2>

            {/* Firm logo toggle */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-sm text-slate-700 font-medium">Include firm logo</span>
              <button
                onClick={() => setFirmLogo(!firmLogo)}
                className={`relative w-11 h-6 rounded-full transition ${
                  firmLogo ? 'bg-brand-500' : 'bg-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                    firmLogo ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </div>

            {/* Cover page style */}
            <div className="mb-5">
              <span className="block text-xs font-medium text-slate-500 mb-2">Cover page style</span>
              <div className="flex gap-2">
                {COVER_STYLES.map(cs => (
                  <button
                    key={cs}
                    onClick={() => setCoverStyle(cs)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition border ${
                      coverStyle === cs
                        ? 'border-brand-400 bg-brand-50 text-brand-700'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cs}
                  </button>
                ))}
              </div>
            </div>

            {/* Color theme */}
            <div>
              <span className="block text-xs font-medium text-slate-500 mb-2">Color theme</span>
              <div className="flex gap-3">
                {COLOR_THEMES.map(ct => (
                  <button
                    key={ct.label}
                    onClick={() => setColorTheme(ct.label)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition border ${
                      colorTheme === ct.label
                        ? 'border-brand-400 bg-brand-50 text-slate-800'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full shrink-0 border border-white shadow-sm"
                      style={{ backgroundColor: ct.hex }}
                    />
                    {ct.label}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* ============ RIGHT: Preview Panel (~40%) ============ */}
        <div className="flex-[2] min-w-0 sticky top-6 space-y-5">
          {/* Cover page mockup */}
          <Card className="overflow-hidden">
            <div
              className="px-6 py-8 text-white relative"
              style={{ backgroundColor: themeHex }}
            >
              {/* Decorative geometry */}
              <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10 bg-white" />
              {coverStyle === 'Premium' && (
                <div className="absolute bottom-0 left-0 w-24 h-24 rounded-tr-full opacity-10 bg-white" />
              )}

              {firmLogo && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-7 h-7 rounded-md bg-white/20 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">F</span>
                  </div>
                  <span className="text-xs font-semibold tracking-wide uppercase opacity-80">
                    FlyerFT Wealth
                  </span>
                </div>
              )}

              <p className="text-xs font-medium uppercase tracking-wider opacity-70 mb-1">
                {reportType}
              </p>
              <h3
                className={`font-bold tracking-tight ${
                  coverStyle === 'Minimal' ? 'text-lg' : coverStyle === 'Premium' ? 'text-2xl' : 'text-xl'
                }`}
              >
                {clientName}
              </h3>
              <p className="text-sm opacity-80 mt-1">
                {period === 'Custom' ? `${customFrom} to ${customTo}` : period}
              </p>

              {coverStyle !== 'Minimal' && (
                <div className="mt-5 pt-4 border-t border-white/20 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                    VV
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Vijay Venkat</p>
                    <p className="text-[10px] opacity-70">Sr. Wealth Advisor</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sections list */}
            <div className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Report contents
                </span>
                <span className="text-xs text-slate-400">
                  ~{estimatedPages} pages
                </span>
              </div>
              <div className="space-y-1">
                {ALL_SECTIONS.map(s => {
                  const included = enabledSections.has(s.key);
                  return (
                    <div
                      key={s.key}
                      className={`flex items-center gap-2 px-2 py-1.5 rounded text-sm transition ${
                        included ? 'text-slate-700' : 'text-slate-300 line-through'
                      }`}
                    >
                      {included ? (
                        <IconCheckCircle size={14} stroke="#2FA4F9" sw={2} />
                      ) : (
                        <span className="w-3.5 h-3.5 rounded-full border border-slate-200" />
                      )}
                      <span className="flex-1 text-[13px]">{s.label}</span>
                      {s.key === 'commentary' && included && (
                        <Badge tone="purple">
                          <IconSparkles size={10} /> AI Commentary
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Quick stats */}
          <Card className="p-4 flex items-center gap-4 text-center divide-x divide-slate-100">
            <div className="flex-1">
              <p className="text-lg font-bold text-slate-900">~{estimatedPages}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Est. pages</p>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-slate-900">
                {ALL_SECTIONS.filter(s => enabledSections.has(s.key)).length}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">Sections</p>
            </div>
            <div className="flex-1">
              <p className="text-lg font-bold text-slate-900">{coverStyle}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Cover style</p>
            </div>
          </Card>
        </div>
      </div>

      {/* ============ ACTION BUTTONS ============ */}
      <div className="mt-8 flex items-center gap-3 border-t border-slate-200 pt-6">
        {/* Generate PDF */}
        <Button
          kind="primary"
          size="lg"
          icon={generating ? undefined : generated ? IconCheckCircle : IconDownload}
          onClick={handleGenerate}
          disabled={generating}
          className="min-w-[180px]"
        >
          {generating ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Generating...
            </span>
          ) : generated ? (
            'Report ready'
          ) : (
            'Generate PDF'
          )}
        </Button>

        {/* Schedule recurring */}
        <div className="relative">
          <Button
            kind="secondary"
            size="lg"
            icon={IconClock}
            onClick={() => setRecurDropdown(!recurDropdown)}
          >
            {recurChoice ? `Scheduled: ${recurChoice}` : 'Schedule recurring'}
          </Button>
          {recurDropdown && (
            <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-xl border border-slate-200 shadow-lg py-1 z-20">
              {['Monthly', 'Quarterly', 'Annually'].map(freq => (
                <button
                  key={freq}
                  onClick={() => { setRecurChoice(freq); setRecurDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 transition ${
                    recurChoice === freq ? 'text-brand-600 font-medium' : 'text-slate-700'
                  }`}
                >
                  {freq}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Email to client */}
        <Button kind="ghost" size="lg" icon={IconMail} onClick={() => setEmailModal(true)}>
          Email to client
        </Button>
      </div>

      {/* Email modal */}
      {emailModal && <EmailModal />}
    </div>
  );
};

export default ReportBuilderView;
