import React, { useState } from 'react';
import { IconX, IconShare, IconBrief, IconCheck, IconClock, IconLock, IconUsers, IconMail, IconDownload, IconCalendar, IconUser } from '@/components/icons';
import { Avatar, Badge, Button, Card, KPI } from '@/components/ui';

/* ── Types ─────────────────────────────────────────── */

type PortalStatus = 'active' | 'invited' | 'not-set-up';
type DocumentType = 'Portfolio Review' | 'Tax Report' | 'IPS' | 'Meeting Notes' | 'Statement' | 'Proposal';
type ExpiryOption = '7 days' | '30 days' | '90 days' | 'No expiry';

interface SharedDocument {
  id: string;
  name: string;
  type: DocumentType;
  sharedDate: string;
  viewed: boolean;
  viewedDate?: string;
  expiryDate: string | null;
}

interface PortalClient {
  id: string;
  name: string;
  initials: string;
  color: string;
  status: PortalStatus;
  lastLogin: string | null;
  documentsShared: number;
  email: string;
  documents: SharedDocument[];
}

/* ── Data ──────────────────────────────────────────── */

const PORTAL_CLIENTS: PortalClient[] = [
  {
    id: 'sc',
    name: 'Sarah Chen',
    initials: 'SC',
    color: '#2FA4F9',
    status: 'active',
    lastLogin: 'Apr 21, 2026 at 3:42 PM',
    documentsShared: 8,
    email: 'sarah.chen@heliolabs.com',
    documents: [
      { id: 'd1', name: 'Q1 2026 Portfolio Review', type: 'Portfolio Review', sharedDate: 'Apr 10, 2026', viewed: true, viewedDate: 'Apr 11, 2026', expiryDate: null },
      { id: 'd2', name: '2025 Tax Summary Report', type: 'Tax Report', sharedDate: 'Mar 15, 2026', viewed: true, viewedDate: 'Mar 16, 2026', expiryDate: null },
      { id: 'd3', name: 'Updated Investment Policy Statement', type: 'IPS', sharedDate: 'Feb 20, 2026', viewed: true, viewedDate: 'Feb 22, 2026', expiryDate: null },
      { id: 'd4', name: 'Q2 Meeting Notes - Rebalance Discussion', type: 'Meeting Notes', sharedDate: 'Apr 18, 2026', viewed: false, expiryDate: 'May 18, 2026' },
      { id: 'd5', name: 'Monthly Account Statement - March', type: 'Statement', sharedDate: 'Apr 5, 2026', viewed: true, viewedDate: 'Apr 6, 2026', expiryDate: null },
    ],
  },
  {
    id: 'mr',
    name: 'Marcus Reid',
    initials: 'MR',
    color: '#7B5BFF',
    status: 'active',
    lastLogin: 'Apr 20, 2026 at 11:18 AM',
    documentsShared: 5,
    email: 'marcus.reid@gmail.com',
    documents: [
      { id: 'd6', name: 'Q1 2026 Portfolio Review', type: 'Portfolio Review', sharedDate: 'Apr 12, 2026', viewed: true, viewedDate: 'Apr 14, 2026', expiryDate: null },
      { id: 'd7', name: 'Rebalance Proposal - Tech Trim', type: 'Proposal', sharedDate: 'Apr 15, 2026', viewed: false, expiryDate: 'May 15, 2026' },
      { id: 'd8', name: 'Risk Analysis Summary', type: 'Portfolio Review', sharedDate: 'Apr 8, 2026', viewed: true, viewedDate: 'Apr 9, 2026', expiryDate: null },
    ],
  },
  {
    id: 'lz',
    name: 'Lin Zhao',
    initials: 'LZ',
    color: '#10B981',
    status: 'active',
    lastLogin: 'Apr 19, 2026 at 9:05 AM',
    documentsShared: 6,
    email: 'lin.zhao@zhaoventures.com',
    documents: [
      { id: 'd9', name: 'ESG Portfolio Progress Report', type: 'Portfolio Review', sharedDate: 'Apr 16, 2026', viewed: true, viewedDate: 'Apr 17, 2026', expiryDate: null },
      { id: 'd10', name: 'Endowment Growth Model Update', type: 'IPS', sharedDate: 'Apr 1, 2026', viewed: true, viewedDate: 'Apr 3, 2026', expiryDate: null },
      { id: 'd11', name: 'Q1 Performance Attribution', type: 'Portfolio Review', sharedDate: 'Apr 10, 2026', viewed: false, expiryDate: 'May 10, 2026' },
    ],
  },
  {
    id: 'jo',
    name: 'James Okafor',
    initials: 'JO',
    color: '#F97316',
    status: 'invited',
    lastLogin: null,
    documentsShared: 0,
    email: 'james.okafor@okaforlaw.com',
    documents: [],
  },
  {
    id: 'ed',
    name: 'Emily Duval',
    initials: 'ED',
    color: '#EC4899',
    status: 'invited',
    lastLogin: null,
    documentsShared: 0,
    email: 'emily.duval@duvalfoundation.org',
    documents: [],
  },
  {
    id: 'rp',
    name: 'Raj Patel',
    initials: 'RP',
    color: '#0EA5E9',
    status: 'not-set-up',
    lastLogin: null,
    documentsShared: 0,
    email: 'raj.patel@patelholdings.com',
    documents: [],
  },
];

const AVAILABLE_DOCUMENTS = [
  'Q1 2026 Portfolio Review',
  'Q2 2026 Meeting Notes',
  '2025 Tax Summary Report',
  'Updated Investment Policy Statement',
  'Rebalance Proposal',
  'Risk Analysis Summary',
  'Monthly Account Statement - March',
  'ESG Portfolio Progress Report',
  'Performance Attribution Report',
  'Fee Schedule Update',
];

/* ── Helpers ───────────────────────────────────────── */

const statusConfig: Record<PortalStatus, { label: string; tone: 'success' | 'warn' | 'muted'; dotColor: string }> = {
  active:       { label: 'Active',      tone: 'success', dotColor: 'bg-emerald-500' },
  invited:      { label: 'Invited',     tone: 'warn',    dotColor: 'bg-amber-500' },
  'not-set-up': { label: 'Not Set Up',  tone: 'muted',   dotColor: 'bg-slate-400' },
};

const docTypeTone: Record<DocumentType, 'brand' | 'success' | 'purple' | 'neutral' | 'warn' | 'muted'> = {
  'Portfolio Review': 'brand',
  'Tax Report':       'purple',
  'IPS':              'success',
  'Meeting Notes':    'neutral',
  'Statement':        'muted',
  'Proposal':         'warn',
};

/* ── Share Modal ───────────────────────────────────── */

const ShareModal: React.FC<{
  clients: PortalClient[];
  preselectedClientId?: string;
  onClose: () => void;
}> = ({ clients, preselectedClientId, onClose }) => {
  const [selectedDoc, setSelectedDoc] = useState('');
  const [selectedClientId, setSelectedClientId] = useState(preselectedClientId || '');
  const [expiry, setExpiry] = useState<ExpiryOption>('30 days');
  const [message, setMessage] = useState('');
  const [shared, setShared] = useState(false);

  const handleShare = () => {
    setShared(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-brand-50 flex items-center justify-center">
              <IconShare size={16} stroke="#2FA4F9" sw={2} />
            </div>
            <h3 className="font-semibold text-slate-900">Share Document Securely</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <IconX size={18} stroke="#64748B" />
          </button>
        </div>

        {shared ? (
          <div className="px-6 py-12 text-center">
            <div className="h-14 w-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
              <IconCheck size={28} stroke="#10B981" sw={2.5} />
            </div>
            <h4 className="font-semibold text-slate-900 text-lg">Document Shared</h4>
            <p className="text-sm text-slate-500 mt-1">The client has been notified via email.</p>
          </div>
        ) : (
          <>
            <div className="px-6 py-5 space-y-4">
              {/* Select document */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Document</label>
                <select
                  value={selectedDoc}
                  onChange={e => setSelectedDoc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                >
                  <option value="">Select a document...</option>
                  {AVAILABLE_DOCUMENTS.map(doc => (
                    <option key={doc} value={doc}>{doc}</option>
                  ))}
                </select>
              </div>

              {/* Select client */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Client</label>
                <select
                  value={selectedClientId}
                  onChange={e => setSelectedClientId(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
                >
                  <option value="">Select a client...</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Set expiry */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Access Expiry</label>
                <div className="flex items-center gap-2">
                  {(['7 days', '30 days', '90 days', 'No expiry'] as ExpiryOption[]).map(opt => (
                    <button
                      key={opt}
                      onClick={() => setExpiry(opt)}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-semibold border transition ${
                        expiry === opt
                          ? 'bg-brand-50 text-brand-700 border-brand-200'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message to Client (optional)</label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Add a personal note to accompany the shared document..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
              <Button kind="secondary" size="sm" onClick={onClose}>Cancel</Button>
              <Button
                kind="primary"
                size="sm"
                icon={IconLock}
                onClick={handleShare}
                className={!selectedDoc || !selectedClientId ? 'opacity-50 pointer-events-none' : ''}
              >
                Share securely
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ── Client Preview Modal ─────────────────────────── */

const ClientPreviewModal: React.FC<{ client: PortalClient; onClose: () => void }> = ({ client, onClose }) => {
  // Mock portfolio data
  const totalValue = '$2,847,320';
  const ytdReturn = '+8.4%';
  const allocation = [
    { label: 'US Equities', pct: 42, color: '#2FA4F9' },
    { label: 'Int\'l Equities', pct: 18, color: '#7B5BFF' },
    { label: 'Fixed Income', pct: 25, color: '#10B981' },
    { label: 'Alternatives', pct: 10, color: '#F97316' },
    { label: 'Cash', pct: 5, color: '#94A3B8' },
  ];

  const meetings = [
    { title: 'Quarterly Portfolio Review', date: 'May 8, 2026 at 2:00 PM', type: 'Video Call' },
    { title: 'Tax Planning Check-in', date: 'May 22, 2026 at 10:30 AM', type: 'Phone Call' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-hidden flex flex-col">
        {/* Close bar */}
        <div className="shrink-0 px-5 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Client Portal Preview</span>
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 bg-white border border-slate-200 hover:bg-slate-100 transition flex items-center gap-1.5">
            <IconX size={14} stroke="#64748B" />
            Close Preview
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto scroll-thin">
          {/* Branded header */}
          <div className="bg-gradient-to-r from-[#2FA4F9] to-[#1B7FD4] px-8 py-8 text-white">
            <div className="flex items-center gap-2 mb-5">
              <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                <span className="text-sm font-bold text-white">F</span>
              </div>
              <span className="text-sm font-semibold tracking-wide opacity-90">FlyerFT Wealth</span>
            </div>
            <h2 className="text-xl font-bold">Welcome back, {client.name.split(' ')[0]}</h2>
            <p className="text-sm opacity-80 mt-1">Here is your latest portfolio summary and documents.</p>
          </div>

          <div className="px-8 py-6 space-y-6">
            {/* Portfolio Summary */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-brand-50 flex items-center justify-center">
                  <IconBrief size={12} stroke="#2FA4F9" sw={2} />
                </div>
                Portfolio Summary
              </h3>
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">Total Value</div>
                    <div className="text-2xl font-bold text-slate-900">{totalValue}</div>
                  </div>
                  <div>
                    <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-1">YTD Return</div>
                    <div className="text-2xl font-bold text-emerald-600">{ytdReturn}</div>
                  </div>
                </div>
                {/* Allocation bar */}
                <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-2">Asset Allocation</div>
                <div className="flex rounded-full overflow-hidden h-3 mb-2">
                  {allocation.map(a => (
                    <div key={a.label} style={{ width: `${a.pct}%`, backgroundColor: a.color }} className="h-full" />
                  ))}
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {allocation.map(a => (
                    <div key={a.label} className="flex items-center gap-1.5">
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                      <span className="text-[11px] text-slate-600">{a.label} ({a.pct}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Documents */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-brand-50 flex items-center justify-center">
                  <IconBrief size={12} stroke="#2FA4F9" sw={2} />
                </div>
                Recent Documents
              </h3>
              <div className="space-y-2">
                {(client.documents.length > 0 ? client.documents : [
                  { id: 'mock1', name: 'Q1 2026 Portfolio Review', type: 'Portfolio Review' as DocumentType, sharedDate: 'Apr 10, 2026', viewed: true, expiryDate: null },
                ]).map(doc => (
                  <div key={doc.id} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100 hover:border-slate-200 transition">
                    <div className="h-9 w-9 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                      <IconBrief size={16} stroke="#475569" sw={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-slate-900 truncate">{doc.name}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">Shared {doc.sharedDate}</div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-slate-50 transition" title="Download">
                      <IconDownload size={15} stroke="#64748B" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Meetings */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-brand-50 flex items-center justify-center">
                  <IconCalendar size={12} stroke="#2FA4F9" sw={2} />
                </div>
                Upcoming Meetings
              </h3>
              <div className="space-y-2">
                {meetings.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-slate-100">
                    <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center shrink-0">
                      <IconCalendar size={16} stroke="#7B5BFF" sw={1.8} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-slate-900">{m.title}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{m.date}</div>
                    </div>
                    <Badge tone="neutral">{m.type}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Your Advisor */}
            <div>
              <h3 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-brand-50 flex items-center justify-center">
                  <IconUser size={12} stroke="#2FA4F9" sw={2} />
                </div>
                Contact Your Advisor
              </h3>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div className="h-11 w-11 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold text-sm shrink-0">VV</div>
                <div className="flex-1">
                  <div className="text-[13px] font-semibold text-slate-900">Vijay Venkat</div>
                  <div className="text-[12px] text-slate-500">Senior Wealth Advisor</div>
                  <div className="text-[12px] text-brand-600 mt-0.5">venkat.vijay@flyerft.com</div>
                </div>
                <button className="px-3 py-2 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition flex items-center gap-1.5">
                  <IconMail size={13} stroke="#2FA4F9" />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main component ────────────────────────────────── */

export const ClientPortalView: React.FC = () => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [sharePreselect, setSharePreselect] = useState<string | undefined>(undefined);
  const [showPreview, setShowPreview] = useState(false);

  const selectedClient = selectedClientId
    ? PORTAL_CLIENTS.find(c => c.id === selectedClientId) || null
    : null;

  const activeCount = PORTAL_CLIENTS.filter(c => c.status === 'active').length;
  const totalDocs = PORTAL_CLIENTS.reduce((sum, c) => sum + c.documentsShared, 0);
  const pendingReviews = PORTAL_CLIENTS.reduce(
    (sum, c) => sum + c.documents.filter(d => !d.viewed).length, 0
  );
  const lastLogin = 'Apr 21, 3:42 PM';

  const openShareForClient = (clientId: string) => {
    setSharePreselect(clientId);
    setShowShareModal(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Share modal */}
      {showShareModal && (
        <ShareModal
          clients={PORTAL_CLIENTS}
          preselectedClientId={sharePreselect}
          onClose={() => { setShowShareModal(false); setSharePreselect(undefined); }}
        />
      )}

      {/* Client preview modal */}
      {showPreview && selectedClient && selectedClient.status === 'active' && (
        <ClientPreviewModal client={selectedClient} onClose={() => setShowPreview(false)} />
      )}

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Portal</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage secure document sharing and client access
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button kind="secondary" size="sm" icon={IconUsers}>Manage access</Button>
          <Button kind="primary" size="sm" icon={IconShare} onClick={() => setShowShareModal(true)}>Share document</Button>
        </div>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI label="Active Portals" value={activeCount} delta={`${PORTAL_CLIENTS.length} total`} deltaTone="neutral" accent="#2FA4F9" />
        <KPI label="Documents Shared" value={totalDocs} delta="+4" deltaTone="success" sub="this month" accent="#7B5BFF" />
        <KPI label="Pending Reviews" value={pendingReviews} delta={pendingReviews > 0 ? 'Awaiting view' : 'All viewed'} deltaTone={pendingReviews > 0 ? 'danger' : 'success'} accent="#F59E0B" />
        <KPI label="Last Client Login" value={lastLogin} sub="Sarah Chen" accent="#10B981" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portal list — left panel */}
        <div className={selectedClient ? 'lg:col-span-1' : 'lg:col-span-3'}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-slate-900 text-sm">Client Portals</h3>
            <span className="text-xs text-slate-400">{PORTAL_CLIENTS.length} clients</span>
          </div>

          <div className={selectedClient ? 'space-y-2' : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3'}>
            {PORTAL_CLIENTS.map(client => {
              const cfg = statusConfig[client.status];
              const isSelected = selectedClientId === client.id;

              return (
                <Card
                  key={client.id}
                  className={`p-4 cursor-pointer transition hover:elev-2 ${
                    isSelected ? 'ring-2 ring-brand-300 bg-brand-50/30' : ''
                  }`}
                  onClick={() => setSelectedClientId(isSelected ? null : client.id)}
                >
                  <div className="flex items-center gap-3">
                    <Avatar initials={client.initials} color={client.color} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-900 text-[13px] truncate">{client.name}</div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className={`h-1.5 w-1.5 rounded-full ${cfg.dotColor}`} />
                        <span className="text-[11px] text-slate-500">{cfg.label}</span>
                      </div>
                    </div>
                    {!selectedClient && (
                      <div className="text-right shrink-0">
                        {client.lastLogin && (
                          <div className="text-[10px] text-slate-400">Last login</div>
                        )}
                        <div className="text-[11px] text-slate-500">
                          {client.lastLogin ? client.lastLogin.split(' at ')[0] : '--'}
                        </div>
                      </div>
                    )}
                  </div>

                  {!selectedClient && (
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Badge tone={cfg.tone}>{cfg.label}</Badge>
                        {client.documentsShared > 0 && (
                          <span className="text-[11px] text-slate-500">{client.documentsShared} docs shared</span>
                        )}
                      </div>
                      <div>
                        {client.status === 'active' && (
                          <button
                            onClick={e => { e.stopPropagation(); openShareForClient(client.id); }}
                            className="text-xs font-semibold text-brand-600 hover:text-brand-700 px-2.5 py-1 rounded-lg bg-brand-50 hover:bg-brand-100 transition"
                          >
                            Open portal
                          </button>
                        )}
                        {client.status === 'invited' && (
                          <button
                            onClick={e => e.stopPropagation()}
                            className="text-xs font-semibold text-amber-600 hover:text-amber-700 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 transition"
                          >
                            Send invite
                          </button>
                        )}
                        {client.status === 'not-set-up' && (
                          <button
                            onClick={e => e.stopPropagation()}
                            className="text-xs font-semibold text-slate-600 hover:text-slate-700 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 transition"
                          >
                            Set up
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>

        {/* Document detail — right panel */}
        {selectedClient && (
          <div className="lg:col-span-2">
            {/* Client detail header */}
            <Card className="p-5 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials={selectedClient.initials} color={selectedClient.color} size="lg" />
                  <div>
                    <div className="font-semibold text-slate-900">{selectedClient.name}</div>
                    <div className="text-sm text-slate-500">{selectedClient.email}</div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge tone={statusConfig[selectedClient.status].tone}>
                        {statusConfig[selectedClient.status].label}
                      </Badge>
                      {selectedClient.lastLogin && (
                        <span className="text-[11px] text-slate-400 flex items-center gap-1">
                          <IconClock size={11} stroke="#94A3B8" />
                          Last login: {selectedClient.lastLogin}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {selectedClient.status === 'active' && (
                    <button
                      onClick={() => setShowPreview(true)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-200 transition flex items-center gap-1.5"
                    >
                      <IconUser size={13} stroke="#2FA4F9" />
                      Preview as client
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedClientId(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                  >
                    <IconX size={18} stroke="#64748B" />
                  </button>
                </div>
              </div>
            </Card>

            {/* Shared documents */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-slate-900 text-sm">
                Shared Documents ({selectedClient.documents.length})
              </h3>
              <Button
                kind="primary"
                size="sm"
                icon={IconShare}
                onClick={() => openShareForClient(selectedClient.id)}
              >
                Share new document
              </Button>
            </div>

            {selectedClient.documents.length === 0 ? (
              <Card className="p-8 text-center">
                <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
                  <IconBrief size={24} stroke="#94A3B8" />
                </div>
                <h4 className="font-semibold text-slate-900 text-sm">No documents shared yet</h4>
                <p className="text-[13px] text-slate-500 mt-1">
                  {selectedClient.status === 'invited'
                    ? 'This client has been invited but hasn\'t activated their portal yet.'
                    : 'Set up this client\'s portal to begin sharing documents.'}
                </p>
                <div className="mt-4">
                  {selectedClient.status === 'invited' ? (
                    <Button kind="secondary" size="sm" icon={IconMail}>Resend invitation</Button>
                  ) : (
                    <Button kind="primary" size="sm" icon={IconLock}>Set up portal</Button>
                  )}
                </div>
              </Card>
            ) : (
              <div className="space-y-2">
                {selectedClient.documents.map(doc => (
                  <Card key={doc.id} className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                        <IconBrief size={16} stroke="#475569" sw={1.8} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 text-[13px] truncate">{doc.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge tone={docTypeTone[doc.type]}>{doc.type}</Badge>
                          <span className="text-[11px] text-slate-400">Shared {doc.sharedDate}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {/* Viewed status */}
                        <div className="text-right">
                          {doc.viewed ? (
                            <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
                              <IconCheck size={12} stroke="#10B981" sw={2.5} />
                              Viewed {doc.viewedDate}
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 text-[11px] text-amber-600 font-medium">
                              <IconClock size={12} stroke="#F59E0B" sw={2} />
                              Not viewed
                            </span>
                          )}
                          {doc.expiryDate && (
                            <span className="text-[10px] text-slate-400 block mt-0.5">
                              Expires {doc.expiryDate}
                            </span>
                          )}
                        </div>
                        {/* Revoke button */}
                        <button className="text-[11px] font-medium text-rose-500 hover:text-rose-700 px-2 py-1 rounded-lg hover:bg-rose-50 transition">
                          Revoke
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
