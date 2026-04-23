import { useState, useEffect } from 'react';
import { Card, Badge, Button } from '@/components/ui';
import {
  IconBrief,
  IconCheck,
  IconCheckCircle,
  IconChevronDown,
  IconChevronLeft,
  IconClock,
  IconDownload,
  IconMail,
  IconSearch,
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

  // Preview state
  const [showPreview, setShowPreview] = useState(false);
  const [previewPage, setPreviewPage] = useState(1);

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
  /*  Preview modal data                                               */
  /* ---------------------------------------------------------------- */
  const PREVIEW_TOTAL_PAGES = 5;

  const monthlyReturns = [
    { month: 'Jan', value: 3.2 },
    { month: 'Feb', value: 1.8 },
    { month: 'Mar', value: -0.9 },
    { month: 'Apr', value: 2.5 },
    { month: 'May', value: 4.1 },
    { month: 'Jun', value: -1.3 },
    { month: 'Jul', value: 2.8 },
    { month: 'Aug', value: 1.5 },
    { month: 'Sep', value: -0.4 },
    { month: 'Oct', value: 3.6 },
    { month: 'Nov', value: 2.1 },
    { month: 'Dec', value: 1.9 },
  ];

  const allocationData = [
    { label: 'US Equities', pct: 42, color: '#2FA4F9' },
    { label: 'Intl Equities', pct: 18, color: '#6366F1' },
    { label: 'Fixed Income', pct: 22, color: '#10B981' },
    { label: 'Alternatives', pct: 12, color: '#F59E0B' },
    { label: 'Cash', pct: 6, color: '#94A3B8' },
  ];

  const PreviewModal = () => {
    const renderPage = () => {
      switch (previewPage) {
        /* --- Page 1: Cover --- */
        case 1:
          return (
            <div className="flex flex-col h-full">
              <div
                className="px-10 py-14 text-white relative flex-1 flex flex-col justify-center"
                style={{ backgroundColor: themeHex }}
              >
                <div className="absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-10 bg-white" />
                {coverStyle === 'Premium' && (
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-tr-full opacity-10 bg-white" />
                )}
                {firmLogo && (
                  <div className="flex items-center gap-2 mb-8">
                    <div className="w-9 h-9 rounded-md bg-white/20 flex items-center justify-center">
                      <span className="text-sm font-bold text-white">F</span>
                    </div>
                    <span className="text-sm font-semibold tracking-wide uppercase opacity-80">
                      FlyerFT Wealth
                    </span>
                  </div>
                )}
                <p className="text-xs font-medium uppercase tracking-wider opacity-70 mb-2">{reportType}</p>
                <h2 className="text-3xl font-bold tracking-tight">{clientName}</h2>
                <p className="text-base opacity-80 mt-2">
                  {period === 'Custom' ? `${customFrom} to ${customTo}` : period}
                </p>
                {coverStyle !== 'Minimal' && (
                  <div className="mt-10 pt-5 border-t border-white/20 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold">VV</div>
                    <div>
                      <p className="text-sm font-semibold">Vijay Venkat</p>
                      <p className="text-xs opacity-70">Sr. Wealth Advisor</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-10 py-4 text-xs text-slate-400 border-t border-slate-100">
                Confidential — Prepared by FlyerFT Wealth Management
              </div>
            </div>
          );

        /* --- Page 2: Executive Summary --- */
        case 2:
          return (
            <div className="px-10 py-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: themeHex }} />
                <h2 className="text-xl font-bold text-slate-900">Executive Summary</h2>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                During {period === 'Custom' ? `the custom period` : period}, the portfolio delivered strong
                risk-adjusted returns, outpacing the blended benchmark by 1.4%. Equity allocations contributed
                the majority of alpha, while fixed income provided stability amid rising rate expectations.
                We recommend a modest rebalance toward international equities to capture emerging-market momentum.
              </p>

              {/* KPI Boxes */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Total AUM', value: '$48.2M', delta: '+$2.1M', positive: true },
                  { label: 'YTD Return', value: '+12.4%', delta: 'vs. 10.8% benchmark', positive: true },
                  { label: 'Benchmark Delta', value: '+1.4%', delta: 'above blended index', positive: true },
                  { label: 'Risk Score', value: '6.2 / 10', delta: 'moderate risk', positive: false },
                ].map((kpi, i) => (
                  <div key={i} className="rounded-xl border border-slate-200 p-4">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1">{kpi.label}</div>
                    <div className="text-lg font-bold text-slate-900">{kpi.value}</div>
                    <div className={`text-xs mt-0.5 ${kpi.positive ? 'text-emerald-600' : 'text-slate-500'}`}>{kpi.delta}</div>
                  </div>
                ))}
              </div>

              <div className="bg-brand-50/60 rounded-xl p-4">
                <div className="flex items-center gap-1.5 mb-2">
                  <IconSparkles size={14} stroke="#2FA4F9" sw={2} />
                  <span className="text-xs font-semibold text-brand-700">Key Highlights</span>
                </div>
                <ul className="text-sm text-slate-700 space-y-1.5">
                  <li className="flex items-start gap-2"><span className="text-brand-500 mt-1">•</span>Portfolio up 12.4% YTD, exceeding benchmark by 160bps</li>
                  <li className="flex items-start gap-2"><span className="text-brand-500 mt-1">•</span>Sharpe ratio improved to 1.38 from 1.21 last quarter</li>
                  <li className="flex items-start gap-2"><span className="text-brand-500 mt-1">•</span>Tax-loss harvesting captured $320K in realized losses</li>
                </ul>
              </div>
            </div>
          );

        /* --- Page 3: Portfolio Performance --- */
        case 3: {
          const maxAbsVal = Math.max(...monthlyReturns.map(m => Math.abs(m.value)));
          return (
            <div className="px-10 py-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: themeHex }} />
                <h2 className="text-xl font-bold text-slate-900">Portfolio Performance</h2>
              </div>
              <p className="text-sm text-slate-500 mb-4">Monthly returns (%) — {period}</p>

              {/* Bar chart mockup */}
              <div className="border border-slate-200 rounded-xl p-5 mb-6">
                <div className="flex items-end gap-2 h-48">
                  {monthlyReturns.map((m, i) => {
                    const barHeight = Math.abs(m.value) / maxAbsVal * 100;
                    const isNeg = m.value < 0;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center justify-end h-full relative">
                        {/* Positive bars grow up from center, negative grow down */}
                        <div className="flex-1 flex items-end justify-center w-full" style={{ paddingBottom: '50%' }}>
                          {!isNeg && (
                            <div
                              className="w-full max-w-[28px] rounded-t-md transition-all"
                              style={{
                                height: `${barHeight}%`,
                                backgroundColor: themeHex,
                                minHeight: '4px',
                              }}
                            />
                          )}
                        </div>
                        {isNeg && (
                          <div className="flex items-start justify-center w-full">
                            <div
                              className="w-full max-w-[28px] rounded-b-md"
                              style={{
                                height: `${barHeight * 0.5}%`,
                                backgroundColor: '#F43F5E',
                                minHeight: '4px',
                              }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
                {/* X-axis labels */}
                <div className="flex gap-2 mt-2">
                  {monthlyReturns.map((m, i) => (
                    <div key={i} className="flex-1 text-center text-[10px] text-slate-400 font-medium">{m.month}</div>
                  ))}
                </div>
                {/* Value labels */}
                <div className="flex gap-2 mt-1">
                  {monthlyReturns.map((m, i) => (
                    <div key={i} className={`flex-1 text-center text-[10px] font-semibold ${m.value >= 0 ? 'text-slate-600' : 'text-rose-500'}`}>
                      {m.value > 0 ? '+' : ''}{m.value}%
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Cumulative Return', value: '+21.8%' },
                  { label: 'Best Month', value: '+4.1% (May)' },
                  { label: 'Worst Month', value: '-1.3% (Jun)' },
                ].map((s, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 text-center">
                    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">{s.label}</div>
                    <div className="text-sm font-bold text-slate-900 mt-1">{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          );
        }

        /* --- Page 4: Asset Allocation --- */
        case 4: {
          let cumDeg = 0;
          return (
            <div className="px-10 py-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: themeHex }} />
                <h2 className="text-xl font-bold text-slate-900">Asset Allocation</h2>
              </div>

              <div className="flex gap-8 mb-6">
                {/* Pie chart mockup using conic gradient */}
                <div className="shrink-0">
                  <div
                    className="w-44 h-44 rounded-full"
                    style={{
                      background: (() => {
                        const stops: string[] = [];
                        let deg = 0;
                        allocationData.forEach(a => {
                          const end = deg + (a.pct / 100) * 360;
                          stops.push(`${a.color} ${deg}deg ${end}deg`);
                          deg = end;
                        });
                        return `conic-gradient(${stops.join(', ')})`;
                      })(),
                    }}
                  />
                </div>

                {/* Legend */}
                <div className="flex-1 space-y-2.5 pt-2">
                  {allocationData.map((a, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: a.color }} />
                      <span className="text-sm text-slate-700 flex-1">{a.label}</span>
                      <span className="text-sm font-semibold text-slate-900">{a.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Holdings table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50">
                      <th className="text-left px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-slate-400">Holding</th>
                      <th className="text-right px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-slate-400">Value</th>
                      <th className="text-right px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-slate-400">Weight</th>
                      <th className="text-right px-4 py-2.5 text-[11px] uppercase tracking-wider font-semibold text-slate-400">Return</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: 'Vanguard S&P 500 ETF', value: '$12.8M', weight: '26.6%', ret: '+14.2%' },
                      { name: 'iShares Core Agg Bond', value: '$10.6M', weight: '22.0%', ret: '+3.1%' },
                      { name: 'MSCI EAFE Fund', value: '$8.7M', weight: '18.0%', ret: '+9.8%' },
                      { name: 'US Growth Fund', value: '$7.4M', weight: '15.4%', ret: '+18.6%' },
                      { name: 'Real Assets & Alts', value: '$5.8M', weight: '12.0%', ret: '+7.4%' },
                      { name: 'Money Market', value: '$2.9M', weight: '6.0%', ret: '+4.8%' },
                    ].map((h, i) => (
                      <tr key={i} className="border-t border-slate-100">
                        <td className="px-4 py-2.5 text-slate-800 font-medium">{h.name}</td>
                        <td className="px-4 py-2.5 text-right text-slate-700">{h.value}</td>
                        <td className="px-4 py-2.5 text-right text-slate-500">{h.weight}</td>
                        <td className="px-4 py-2.5 text-right text-emerald-600 font-medium">{h.ret}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        }

        /* --- Page 5: Recommendations --- */
        case 5:
          return (
            <div className="px-10 py-8">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 rounded-full" style={{ backgroundColor: themeHex }} />
                <h2 className="text-xl font-bold text-slate-900">Recommendations & Next Steps</h2>
              </div>

              <div className="flex items-center gap-1.5 mb-4">
                <IconSparkles size={14} stroke="#2FA4F9" sw={2} />
                <span className="text-xs font-semibold text-brand-700">AI-Generated Insights</span>
                <Badge tone="purple">GPT-Enhanced</Badge>
              </div>

              <div className="space-y-3 mb-8">
                {[
                  { priority: 'High', text: 'Rebalance international equity allocation from 18% to 22% to capture EM momentum and reduce concentration in US large-cap growth.' },
                  { priority: 'High', text: 'Execute tax-loss harvesting on international small-cap positions before year-end — estimated $180K in harvestable losses.' },
                  { priority: 'Medium', text: 'Increase allocation to short-duration TIPS by 3% as a hedge against persistent above-trend inflation.' },
                  { priority: 'Medium', text: 'Review covered call strategy on concentrated tech holdings to generate additional income while reducing downside exposure.' },
                  { priority: 'Low', text: 'Consider adding a 2% allocation to digital assets (Bitcoin/Ethereum ETF) for portfolio diversification.' },
                  { priority: 'Low', text: 'Schedule mid-year estate planning review to evaluate gifting strategy given potential changes to exemption limits.' },
                ].map((rec, i) => (
                  <div key={i} className="flex gap-3 rounded-xl border border-slate-200 p-4">
                    <Badge tone={rec.priority === 'High' ? 'danger' : rec.priority === 'Medium' ? 'warn' : 'muted'}>
                      {rec.priority}
                    </Badge>
                    <p className="text-sm text-slate-700 leading-relaxed flex-1">{rec.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-slate-50 rounded-xl p-4">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Next Scheduled Review</h4>
                <p className="text-sm text-slate-700">
                  Quarterly review meeting scheduled for <span className="font-semibold">July 15, 2026</span>.
                  Updated projections and rebalancing recommendations will be prepared 5 business days prior.
                </p>
              </div>
            </div>
          );

        default:
          return null;
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Report Preview</h3>
              <p className="text-xs text-slate-500 mt-0.5">{reportType} — {clientName} — {period}</p>
            </div>
            <button
              onClick={() => { setShowPreview(false); setPreviewPage(1); }}
              className="p-1.5 rounded-lg hover:bg-slate-100 transition"
            >
              <IconX size={18} stroke="#64748B" />
            </button>
          </div>

          {/* Page content */}
          <div className="flex-1 overflow-y-auto scroll-thin bg-slate-50">
            <div className="max-w-2xl mx-auto my-6 bg-white rounded-xl shadow-sm border border-slate-200 min-h-[500px]">
              {renderPage()}
            </div>
          </div>

          {/* Footer — page navigation */}
          <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200">
            <Button
              kind="ghost"
              size="sm"
              icon={IconChevronLeft}
              disabled={previewPage <= 1}
              onClick={() => setPreviewPage(p => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <span className="text-sm text-slate-500 font-medium">
              Page {previewPage} of {PREVIEW_TOTAL_PAGES}
            </span>
            <Button
              kind="ghost"
              size="sm"
              disabled={previewPage >= PREVIEW_TOTAL_PAGES}
              onClick={() => setPreviewPage(p => Math.min(PREVIEW_TOTAL_PAGES, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    );
  };

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

        {/* Preview Report */}
        <Button
          kind="secondary"
          size="lg"
          icon={IconSearch}
          onClick={() => { setShowPreview(true); setPreviewPage(1); }}
          className="min-w-[160px]"
        >
          Preview Report
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

      {/* Preview modal */}
      {showPreview && <PreviewModal />}
    </div>
  );
};

export default ReportBuilderView;
