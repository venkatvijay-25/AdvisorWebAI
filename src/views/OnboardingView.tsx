import React, { useState } from 'react';
import {
  IconUser, IconShield, IconScale, IconPie, IconCheckCircle,
  IconChevronLeft, IconChevronRight, IconCheck, IconBrief,
  IconArrowUp, IconDownload, IconAlert, IconTarget, IconGlobe,
} from '@/components/icons';
import { Badge, Button, Card } from '@/components/ui';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ClientInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  clientType: 'Individual' | 'Joint' | 'Trust' | 'Corporate';
  segment: 'HNI' | 'UHNI';
  referralSource: string;
}

interface KycInfo {
  idType: string;
  idNumber: string;
  idFileName: string;
  pep: boolean;
  sourceOfWealth: string;
}

interface RiskInfo {
  horizon: string;
  tolerance: string;
  experience: string;
  annualIncome: string;
  netWorth: string;
  q1: string;
  q2: string;
  q3: string;
  q4: string;
}

interface InvestmentInfo {
  modelPortfolio: string;
  assetClasses: string[];
  esg: boolean;
  restrictions: string;
  benchmark: string;
}

interface ComplianceChecks {
  termsAccepted: boolean;
  kycVerified: boolean;
  suitabilityConfirmed: boolean;
  ipsGenerated: boolean;
}

const STEPS = [
  { key: 'client', label: 'Client Information', icon: IconUser },
  { key: 'kyc', label: 'KYC Verification', icon: IconShield },
  { key: 'risk', label: 'Risk Assessment', icon: IconScale },
  { key: 'investment', label: 'Investment Preferences', icon: IconPie },
  { key: 'review', label: 'Review & Submit', icon: IconCheckCircle },
];

/* ------------------------------------------------------------------ */
/*  Reusable form helpers                                              */
/* ------------------------------------------------------------------ */

const inputCls =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#2FA4F9] focus:ring-2 focus:ring-[#2FA4F9]/20 outline-none transition';
const selectCls = inputCls + ' appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2394a3b8%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E")] bg-[length:16px] bg-[right_8px_center] bg-no-repeat pr-8';
const labelCls = 'block text-xs font-medium text-slate-600 mb-1.5';

const Label: React.FC<{ children: React.ReactNode; required?: boolean }> = ({ children, required }) => (
  <label className={labelCls}>
    {children}
    {required && <span className="text-rose-500 ml-0.5">*</span>}
  </label>
);

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

const OnboardingView: React.FC = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [client, setClient] = useState<ClientInfo>({
    firstName: '', lastName: '', email: '', phone: '', dob: '',
    clientType: 'Individual', segment: 'HNI', referralSource: '',
  });

  // Step 2
  const [kyc, setKyc] = useState<KycInfo>({
    idType: '', idNumber: '', idFileName: '', pep: false, sourceOfWealth: '',
  });

  // Step 3
  const [risk, setRisk] = useState<RiskInfo>({
    horizon: '', tolerance: '', experience: '',
    annualIncome: '', netWorth: '',
    q1: '', q2: '', q3: '', q4: '',
  });

  // Step 4
  const [investment, setInvestment] = useState<InvestmentInfo>({
    modelPortfolio: '', assetClasses: [], esg: false, restrictions: '', benchmark: '',
  });

  // Step 5
  const [compliance, setCompliance] = useState<ComplianceChecks>({
    termsAccepted: false, kycVerified: false, suitabilityConfirmed: false, ipsGenerated: false,
  });

  const goNext = () => setStep((s) => Math.min(s + 1, 4));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const toggleAssetClass = (cls: string) =>
    setInvestment((prev) => ({
      ...prev,
      assetClasses: prev.assetClasses.includes(cls)
        ? prev.assetClasses.filter((c) => c !== cls)
        : [...prev.assetClasses, cls],
    }));

  const progressPct = ((step + 1) / STEPS.length) * 100;

  /* ---------------------------------------------------------------- */
  /*  Success state                                                    */
  /* ---------------------------------------------------------------- */

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-8 py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-5">
          <IconCheckCircle size={32} stroke="#059669" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Client Onboarded Successfully</h1>
        <p className="text-slate-500 text-sm mb-6">
          {client.firstName} {client.lastName} has been created as a {client.segment} {client.clientType} client.
          KYC documents are under review and the IPS draft has been generated.
        </p>
        <div className="flex gap-3 justify-center">
          <Button kind="primary" onClick={() => { setSubmitted(false); setStep(0); resetAll(); }}>
            Onboard Another Client
          </Button>
          <Button kind="secondary" icon={IconBrief}>
            View Client Record
          </Button>
        </div>
      </div>
    );
  }

  function resetAll() {
    setClient({ firstName: '', lastName: '', email: '', phone: '', dob: '', clientType: 'Individual', segment: 'HNI', referralSource: '' });
    setKyc({ idType: '', idNumber: '', idFileName: '', pep: false, sourceOfWealth: '' });
    setRisk({ horizon: '', tolerance: '', experience: '', annualIncome: '', netWorth: '', q1: '', q2: '', q3: '', q4: '' });
    setInvestment({ modelPortfolio: '', assetClasses: [], esg: false, restrictions: '', benchmark: '' });
    setCompliance({ termsAccepted: false, kycVerified: false, suitabilityConfirmed: false, ipsGenerated: false });
  }

  /* ---------------------------------------------------------------- */
  /*  Step 1: Client Information                                       */
  /* ---------------------------------------------------------------- */

  const renderClientInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>First Name</Label>
          <input className={inputCls} placeholder="e.g. Sarah" value={client.firstName}
            onChange={(e) => setClient({ ...client, firstName: e.target.value })} />
        </div>
        <div>
          <Label required>Last Name</Label>
          <input className={inputCls} placeholder="e.g. Chen" value={client.lastName}
            onChange={(e) => setClient({ ...client, lastName: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Email Address</Label>
          <input type="email" className={inputCls} placeholder="sarah.chen@email.com" value={client.email}
            onChange={(e) => setClient({ ...client, email: e.target.value })} />
        </div>
        <div>
          <Label required>Phone Number</Label>
          <input type="tel" className={inputCls} placeholder="+1 (555) 000-0000" value={client.phone}
            onChange={(e) => setClient({ ...client, phone: e.target.value })} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Date of Birth</Label>
          <input type="date" className={inputCls} value={client.dob}
            onChange={(e) => setClient({ ...client, dob: e.target.value })} />
        </div>
        <div>
          <Label required>Referral Source</Label>
          <select className={selectCls} value={client.referralSource}
            onChange={(e) => setClient({ ...client, referralSource: e.target.value })}>
            <option value="">Select source...</option>
            <option>Existing Client Referral</option>
            <option>CPA / Accountant</option>
            <option>Attorney / Estate Planner</option>
            <option>Direct Inquiry</option>
            <option>Conference / Event</option>
            <option>Digital Marketing</option>
            <option>Other</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Client Type</Label>
          <div className="flex flex-wrap gap-2">
            {(['Individual', 'Joint', 'Trust', 'Corporate'] as const).map((t) => (
              <button key={t} onClick={() => setClient({ ...client, clientType: t })}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition ${
                  client.clientType === t
                    ? 'bg-[#2FA4F9]/10 border-[#2FA4F9] text-[#2FA4F9]'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
        <div>
          <Label required>Client Segment</Label>
          <div className="flex gap-2">
            {(['HNI', 'UHNI'] as const).map((s) => (
              <button key={s} onClick={() => setClient({ ...client, segment: s })}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition flex-1 ${
                  client.segment === s
                    ? 'bg-[#2FA4F9]/10 border-[#2FA4F9] text-[#2FA4F9]'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}>
                {s === 'HNI' ? 'HNI' : 'UHNI'}
                <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                  {s === 'HNI' ? '$1M - $30M' : '$30M+'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 2: KYC / Identity Verification                              */
  /* ---------------------------------------------------------------- */

  const renderKyc = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Government ID Type</Label>
          <select className={selectCls} value={kyc.idType}
            onChange={(e) => setKyc({ ...kyc, idType: e.target.value })}>
            <option value="">Select ID type...</option>
            <option>Passport</option>
            <option>Driver's License</option>
            <option>Aadhar</option>
            <option>PAN</option>
          </select>
        </div>
        <div>
          <Label required>ID Number</Label>
          <input className={inputCls} placeholder="Enter ID number" value={kyc.idNumber}
            onChange={(e) => setKyc({ ...kyc, idNumber: e.target.value })} />
        </div>
      </div>

      {/* Dropzone */}
      <div>
        <Label>Upload ID Document</Label>
        <div
          className={`border-2 border-dashed rounded-xl p-8 text-center transition cursor-pointer ${
            kyc.idFileName
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-slate-200 hover:border-[#2FA4F9]/50 hover:bg-slate-50'
          }`}
          onClick={() => setKyc({ ...kyc, idFileName: kyc.idFileName ? '' : 'Government_ID_scan.pdf' })}
        >
          {kyc.idFileName ? (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                <IconCheck size={20} stroke="#059669" />
              </div>
              <p className="text-sm font-medium text-emerald-700">{kyc.idFileName}</p>
              <p className="text-xs text-slate-400">Click to remove</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                <IconArrowUp size={20} stroke="#64748b" />
              </div>
              <p className="text-sm font-medium text-slate-600">Drop file here or click to browse</p>
              <p className="text-xs text-slate-400">PDF, JPG, or PNG up to 10 MB</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Politically Exposed Person (PEP)</Label>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setKyc({ ...kyc, pep: false })}
              className={`flex-1 px-3.5 py-2 rounded-lg text-sm font-medium border transition ${
                !kyc.pep ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              No
            </button>
            <button
              onClick={() => setKyc({ ...kyc, pep: true })}
              className={`flex-1 px-3.5 py-2 rounded-lg text-sm font-medium border transition ${
                kyc.pep ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              Yes
            </button>
          </div>
          {kyc.pep && (
            <p className="mt-2 text-xs text-amber-600 flex items-center gap-1">
              <IconAlert size={12} /> Enhanced due diligence will be required.
            </p>
          )}
        </div>
        <div>
          <Label required>Source of Wealth</Label>
          <select className={selectCls} value={kyc.sourceOfWealth}
            onChange={(e) => setKyc({ ...kyc, sourceOfWealth: e.target.value })}>
            <option value="">Select source...</option>
            <option>Employment</option>
            <option>Business</option>
            <option>Inheritance</option>
            <option>Investments</option>
            <option>Other</option>
          </select>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 3: Risk Assessment                                          */
  /* ---------------------------------------------------------------- */

  const RadioGroup: React.FC<{ label: string; options: string[]; value: string; onChange: (v: string) => void; required?: boolean }> =
    ({ label, options, value, onChange, required }) => (
      <div>
        <Label required={required}>{label}</Label>
        <div className="flex flex-wrap gap-2">
          {options.map((o) => (
            <button key={o} onClick={() => onChange(o)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition ${
                value === o
                  ? 'bg-[#2FA4F9]/10 border-[#2FA4F9] text-[#2FA4F9]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              {o}
            </button>
          ))}
        </div>
      </div>
    );

  const renderRisk = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RadioGroup label="Investment Horizon" required options={['Short (<3yr)', 'Medium (3-7yr)', 'Long (7+yr)']}
          value={risk.horizon} onChange={(v) => setRisk({ ...risk, horizon: v })} />
        <RadioGroup label="Risk Tolerance" required options={['Conservative', 'Moderate', 'Aggressive']}
          value={risk.tolerance} onChange={(v) => setRisk({ ...risk, tolerance: v })} />
        <RadioGroup label="Investment Experience" required options={['Beginner', 'Intermediate', 'Advanced']}
          value={risk.experience} onChange={(v) => setRisk({ ...risk, experience: v })} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Annual Income Range</Label>
          <select className={selectCls} value={risk.annualIncome}
            onChange={(e) => setRisk({ ...risk, annualIncome: e.target.value })}>
            <option value="">Select range...</option>
            <option>$100K - $250K</option>
            <option>$250K - $500K</option>
            <option>$500K - $1M</option>
            <option>$1M - $5M</option>
            <option>$5M+</option>
          </select>
        </div>
        <div>
          <Label required>Net Worth Range</Label>
          <select className={selectCls} value={risk.netWorth}
            onChange={(e) => setRisk({ ...risk, netWorth: e.target.value })}>
            <option value="">Select range...</option>
            <option>$1M - $5M</option>
            <option>$5M - $10M</option>
            <option>$10M - $30M</option>
            <option>$30M - $100M</option>
            <option>$100M+</option>
          </select>
        </div>
      </div>

      <div className="border-t border-slate-100 pt-5">
        <h3 className="text-sm font-semibold text-slate-800 mb-4">Risk Profiling Questions</h3>
        <div className="space-y-5">
          <div>
            <Label required>1. How would you react to a 20% decline in your portfolio value?</Label>
            <select className={selectCls} value={risk.q1} onChange={(e) => setRisk({ ...risk, q1: e.target.value })}>
              <option value="">Select response...</option>
              <option>Sell everything immediately to prevent further losses</option>
              <option>Sell some holdings to reduce risk</option>
              <option>Hold steady and wait for recovery</option>
              <option>Buy more to take advantage of lower prices</option>
            </select>
          </div>
          <div>
            <Label required>2. What is your primary investment goal?</Label>
            <select className={selectCls} value={risk.q2} onChange={(e) => setRisk({ ...risk, q2: e.target.value })}>
              <option value="">Select response...</option>
              <option>Capital preservation with minimal risk</option>
              <option>Steady income generation</option>
              <option>Balanced growth and income</option>
              <option>Aggressive capital appreciation</option>
            </select>
          </div>
          <div>
            <Label required>3. How much of your total net worth will this portfolio represent?</Label>
            <select className={selectCls} value={risk.q3} onChange={(e) => setRisk({ ...risk, q3: e.target.value })}>
              <option value="">Select response...</option>
              <option>Less than 25%</option>
              <option>25% - 50%</option>
              <option>50% - 75%</option>
              <option>More than 75%</option>
            </select>
          </div>
          <div>
            <Label required>4. If a speculative investment could double or lose 50%, would you invest?</Label>
            <select className={selectCls} value={risk.q4} onChange={(e) => setRisk({ ...risk, q4: e.target.value })}>
              <option value="">Select response...</option>
              <option>Absolutely not</option>
              <option>Maybe with a small allocation (&lt;5%)</option>
              <option>Yes, with a moderate allocation (5-15%)</option>
              <option>Yes, with a significant allocation (15%+)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 4: Investment Preferences                                   */
  /* ---------------------------------------------------------------- */

  const MODEL_PORTFOLIOS = [
    { id: 'conservative', name: 'Conservative', desc: 'Capital preservation focus. 70% fixed income, 20% equities, 10% cash.', risk: 'Low', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    { id: 'balanced', name: 'Balanced', desc: 'Growth and income blend. 50% equities, 35% fixed income, 15% alternatives.', risk: 'Moderate', color: 'bg-emerald-50 border-emerald-200 text-emerald-700' },
    { id: 'growth', name: 'Growth', desc: 'Long-term appreciation. 70% equities, 20% alternatives, 10% fixed income.', risk: 'Mod-High', color: 'bg-amber-50 border-amber-200 text-amber-700' },
    { id: 'aggressive', name: 'Aggressive Growth', desc: 'Maximum growth potential. 85% equities, 15% alternatives.', risk: 'High', color: 'bg-rose-50 border-rose-200 text-rose-700' },
    { id: 'income', name: 'Income Focus', desc: 'Yield-oriented. 60% fixed income, 25% dividend equities, 15% REITs.', risk: 'Low-Mod', color: 'bg-violet-50 border-violet-200 text-violet-700' },
  ];

  const ASSET_CLASSES = ['Equities', 'Fixed Income', 'Alternatives', 'Real Estate', 'Cash & Equivalents'];

  const renderInvestment = () => (
    <div className="space-y-6">
      <div>
        <Label required>Model Portfolio</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-1">
          {MODEL_PORTFOLIOS.map((mp) => (
            <div
              key={mp.id}
              onClick={() => setInvestment({ ...investment, modelPortfolio: mp.id })}
              className={`p-4 rounded-xl border-2 cursor-pointer transition ${
                investment.modelPortfolio === mp.id
                  ? 'border-[#2FA4F9] bg-[#2FA4F9]/5 ring-2 ring-[#2FA4F9]/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-800">{mp.name}</span>
                <Badge tone={mp.risk === 'Low' ? 'success' : mp.risk === 'High' ? 'danger' : 'warn'}>{mp.risk}</Badge>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{mp.desc}</p>
              {investment.modelPortfolio === mp.id && (
                <div className="mt-2 flex items-center gap-1 text-xs text-[#2FA4F9] font-medium">
                  <IconCheck size={14} /> Selected
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Asset Class Preferences</Label>
        <div className="flex flex-wrap gap-2 mt-1">
          {ASSET_CLASSES.map((ac) => (
            <button key={ac} onClick={() => toggleAssetClass(ac)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition flex items-center gap-2 ${
                investment.assetClasses.includes(ac)
                  ? 'bg-[#2FA4F9]/10 border-[#2FA4F9] text-[#2FA4F9]'
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}>
              <span className={`w-4 h-4 rounded border flex items-center justify-center text-white transition ${
                investment.assetClasses.includes(ac) ? 'bg-[#2FA4F9] border-[#2FA4F9]' : 'border-slate-300'
              }`}>
                {investment.assetClasses.includes(ac) && <IconCheck size={10} sw={3} />}
              </span>
              {ac}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>ESG / Responsible Investing</Label>
          <div className="flex items-center gap-3 mt-1">
            <button
              onClick={() => setInvestment({ ...investment, esg: !investment.esg })}
              className={`relative w-11 h-6 rounded-full transition-colors ${
                investment.esg ? 'bg-[#2FA4F9]' : 'bg-slate-200'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
                investment.esg ? 'translate-x-[22px]' : 'translate-x-0.5'
              }`} />
            </button>
            <span className="text-sm text-slate-600">
              {investment.esg ? 'ESG integration enabled' : 'No ESG preference'}
            </span>
          </div>
        </div>
        <div>
          <Label>Benchmark Preference</Label>
          <select className={selectCls} value={investment.benchmark}
            onChange={(e) => setInvestment({ ...investment, benchmark: e.target.value })}>
            <option value="">Select benchmark...</option>
            <option>S&P 500</option>
            <option>MSCI World</option>
            <option>Bloomberg US Aggregate Bond</option>
            <option>60/40 Blended</option>
            <option>Custom Blended</option>
          </select>
        </div>
      </div>

      <div>
        <Label>Restrictions / Exclusions</Label>
        <textarea
          className={inputCls + ' min-h-[80px] resize-y'}
          placeholder="List any tickers, sectors, or instruments to exclude (e.g. tobacco, firearms, TSLA, crypto)"
          value={investment.restrictions}
          onChange={(e) => setInvestment({ ...investment, restrictions: e.target.value })}
        />
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 5: Review & Submit                                          */
  /* ---------------------------------------------------------------- */

  const SummaryRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-1.5 text-sm">
      <span className="text-slate-500 shrink-0 mr-4">{label}</span>
      <span className="text-slate-800 font-medium text-right">{value || <span className="text-slate-300 italic">Not provided</span>}</span>
    </div>
  );

  const renderReview = () => {
    const selectedModel = MODEL_PORTFOLIOS.find((m) => m.id === investment.modelPortfolio);
    return (
      <div className="space-y-6">
        {/* Client Info Summary */}
        <div className="border border-slate-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconUser size={16} stroke="#2FA4F9" />
            <h3 className="text-sm font-semibold text-slate-800">Client Information</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <SummaryRow label="Name" value={`${client.firstName} ${client.lastName}`.trim()} />
            <SummaryRow label="Email" value={client.email} />
            <SummaryRow label="Phone" value={client.phone} />
            <SummaryRow label="Date of Birth" value={client.dob} />
            <SummaryRow label="Client Type" value={client.clientType} />
            <SummaryRow label="Segment" value={client.segment} />
            <SummaryRow label="Referral Source" value={client.referralSource} />
          </div>
        </div>

        {/* KYC Summary */}
        <div className="border border-slate-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconShield size={16} stroke="#2FA4F9" />
            <h3 className="text-sm font-semibold text-slate-800">KYC / Identity</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <SummaryRow label="ID Type" value={kyc.idType} />
            <SummaryRow label="ID Number" value={kyc.idNumber ? `****${kyc.idNumber.slice(-4)}` : ''} />
            <SummaryRow label="Document" value={kyc.idFileName || ''} />
            <SummaryRow label="PEP Status" value={kyc.pep ? <Badge tone="warn">Yes - PEP</Badge> : <Badge tone="success">No</Badge>} />
            <SummaryRow label="Source of Wealth" value={kyc.sourceOfWealth} />
          </div>
        </div>

        {/* Risk Summary */}
        <div className="border border-slate-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconScale size={16} stroke="#2FA4F9" />
            <h3 className="text-sm font-semibold text-slate-800">Risk Profile</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <SummaryRow label="Investment Horizon" value={risk.horizon} />
            <SummaryRow label="Risk Tolerance" value={risk.tolerance} />
            <SummaryRow label="Experience" value={risk.experience} />
            <SummaryRow label="Annual Income" value={risk.annualIncome} />
            <SummaryRow label="Net Worth" value={risk.netWorth} />
          </div>
        </div>

        {/* Investment Summary */}
        <div className="border border-slate-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconPie size={16} stroke="#2FA4F9" />
            <h3 className="text-sm font-semibold text-slate-800">Investment Preferences</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
            <SummaryRow label="Model Portfolio" value={selectedModel?.name || ''} />
            <SummaryRow label="Asset Classes" value={investment.assetClasses.join(', ')} />
            <SummaryRow label="ESG Preference" value={investment.esg ? 'Enabled' : 'Not selected'} />
            <SummaryRow label="Benchmark" value={investment.benchmark} />
            {investment.restrictions && <SummaryRow label="Restrictions" value={investment.restrictions} />}
          </div>
        </div>

        {/* Compliance Checklist */}
        <div className="border border-slate-100 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <IconCheckCircle size={16} stroke="#2FA4F9" />
            <h3 className="text-sm font-semibold text-slate-800">Compliance Checklist</h3>
          </div>
          <div className="space-y-3">
            {([
              { key: 'termsAccepted' as const, label: 'Client has accepted Terms & Conditions and Privacy Policy' },
              { key: 'kycVerified' as const, label: 'KYC documentation has been verified and is complete' },
              { key: 'suitabilityConfirmed' as const, label: 'Suitability assessment confirms appropriate risk profile match' },
              { key: 'ipsGenerated' as const, label: 'Investment Policy Statement (IPS) has been generated and reviewed' },
            ]).map((item) => (
              <label key={item.key} className="flex items-start gap-3 cursor-pointer group">
                <span
                  onClick={() => setCompliance({ ...compliance, [item.key]: !compliance[item.key] })}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition ${
                    compliance[item.key]
                      ? 'bg-[#2FA4F9] border-[#2FA4F9]'
                      : 'border-slate-300 group-hover:border-slate-400'
                  }`}
                >
                  {compliance[item.key] && <IconCheck size={12} sw={3} stroke="#fff" />}
                </span>
                <span className="text-sm text-slate-700">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  const stepContent = [renderClientInfo, renderKyc, renderRisk, renderInvestment, renderReview];
  const allComplianceChecked = compliance.termsAccepted && compliance.kycVerified && compliance.suitabilityConfirmed && compliance.ipsGenerated;

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Client Onboarding</h1>
        <p className="text-sm text-slate-500 mt-1">Complete all steps to onboard a new client into the platform.</p>
      </div>

      {/* Stepper */}
      <div className="mb-2">
        <div className="flex items-center justify-between">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const isActive = i === step;
            const isComplete = i < step;
            return (
              <button
                key={s.key}
                onClick={() => i <= step && setStep(i)}
                className={`flex items-center gap-2 text-xs font-medium transition ${
                  isActive ? 'text-[#2FA4F9]' : isComplete ? 'text-emerald-600 cursor-pointer' : 'text-slate-400'
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center transition ${
                    isActive
                      ? 'bg-[#2FA4F9] text-white'
                      : isComplete
                      ? 'bg-emerald-100 text-emerald-600'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {isComplete ? <IconCheck size={14} sw={2.5} /> : <Icon size={14} />}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-slate-100 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-[#2FA4F9] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {/* Step content */}
      <Card className="p-6 sm:p-8 mb-6">
        <div className="flex items-center gap-2 mb-5">
          {React.createElement(STEPS[step].icon, { size: 20, stroke: '#2FA4F9' })}
          <h2 className="text-lg font-semibold text-slate-900">{STEPS[step].label}</h2>
          <Badge tone="brand">Step {step + 1} of {STEPS.length}</Badge>
        </div>
        {stepContent[step]()}
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div>
          {step > 0 && (
            <Button kind="secondary" icon={IconChevronLeft} onClick={goBack}>
              Back
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button kind="ghost" onClick={() => {/* mock save draft */}}>
            Save as Draft
          </Button>
          {step < 4 ? (
            <Button kind="primary" icon={IconChevronRight} onClick={goNext}>
              Next
            </Button>
          ) : (
            <Button
              kind="primary"
              icon={IconCheckCircle}
              disabled={!allComplianceChecked}
              onClick={() => setSubmitted(true)}
              className={!allComplianceChecked ? 'opacity-50 cursor-not-allowed' : ''}
            >
              Submit & Create Client
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingView;
