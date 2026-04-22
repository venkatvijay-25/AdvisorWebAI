import React, { useState, useMemo } from 'react';
import { Avatar, Badge, Button, Card, KPI } from '@/components/ui';
import {
  IconPlus,
  IconFilter,
  IconCheck,
  IconCheckCircle,
  IconX,
  IconChevronRight,
  IconChevronLeft,
  IconClock,
  IconShield,
  IconBrain,
  IconSparkles,
  IconEdit,
  IconReceipt,
  IconScale,
  IconAlert,
} from '@/components/icons';
import type { IcoProps } from '@/components/icons';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type OrderStatus = 'Pending Approval' | 'Approved' | 'Executing' | 'Filled' | 'Partially Filled' | 'Rejected' | 'Cancelled';
type OrderAction = 'BUY' | 'SELL';
type OrderType = 'Market' | 'Limit' | 'Stop';
type OrderSource = 'Manual' | 'AutoPilot' | 'Rebalance';

interface Order {
  id: string;
  timestamp: string;
  clientId: string;
  clientName: string;
  clientInitials: string;
  clientColor: string;
  action: OrderAction;
  ticker: string;
  securityName: string;
  quantity: number;
  estimatedValue: number;
  orderType: OrderType;
  status: OrderStatus;
  source: OrderSource;
  compliancePass: boolean;
  complianceNote?: string;
  limitPrice?: number;
  stopPrice?: number;
  rebalanceBatchId?: string;
  tlhFlag?: boolean;
  timeline?: TimelineStep[];
  auditTrail?: AuditEntry[];
}

interface TimelineStep {
  label: string;
  time: string;
  done: boolean;
}

interface AuditEntry {
  time: string;
  action: string;
  by: string;
}

/* ------------------------------------------------------------------ */
/*  Status filter type                                                 */
/* ------------------------------------------------------------------ */

type StatusFilter = 'All' | 'Pending' | 'Approved' | 'Executing' | 'Filled' | 'Rejected' | 'Cancelled';

const STATUS_FILTERS: StatusFilter[] = ['All', 'Pending', 'Approved', 'Executing', 'Filled', 'Rejected', 'Cancelled'];

/* ------------------------------------------------------------------ */
/*  Mock data (12-15 orders)                                           */
/* ------------------------------------------------------------------ */

const MOCK_ORDERS: Order[] = [
  // AutoPilot rebalance trades for Marcus Reid
  {
    id: 'ORD-2026-0422-001',
    timestamp: '2026-04-22 09:12:34',
    clientId: 'mr',
    clientName: 'Marcus Reid',
    clientInitials: 'MR',
    clientColor: '#7B5BFF',
    action: 'SELL',
    ticker: 'NVDA',
    securityName: 'NVIDIA Corp',
    quantity: 120,
    estimatedValue: 108_600,
    orderType: 'Market',
    status: 'Filled',
    source: 'Rebalance',
    compliancePass: true,
    rebalanceBatchId: 'RB-MR-0422',
    timeline: [
      { label: 'Submitted', time: '09:12:34', done: true },
      { label: 'Compliance Check', time: '09:12:38', done: true },
      { label: 'Approved', time: '09:13:01', done: true },
      { label: 'Sent to OMS', time: '09:13:05', done: true },
      { label: 'Filled', time: '09:14:22', done: true },
    ],
    auditTrail: [
      { time: '09:12:34', action: 'Order submitted by AutoPilot rebalance engine', by: 'System' },
      { time: '09:12:38', action: 'Compliance check passed - no restrictions', by: 'Compliance Engine' },
      { time: '09:13:01', action: 'Auto-approved (within advisor pre-approval limits)', by: 'System' },
      { time: '09:14:22', action: 'Order filled at $905.00 avg price', by: 'OMS' },
    ],
  },
  {
    id: 'ORD-2026-0422-002',
    timestamp: '2026-04-22 09:12:35',
    clientId: 'mr',
    clientName: 'Marcus Reid',
    clientInitials: 'MR',
    clientColor: '#7B5BFF',
    action: 'BUY',
    ticker: 'VTI',
    securityName: 'Vanguard Total Stock Market ETF',
    quantity: 85,
    estimatedValue: 22_865,
    orderType: 'Market',
    status: 'Filled',
    source: 'Rebalance',
    compliancePass: true,
    rebalanceBatchId: 'RB-MR-0422',
    timeline: [
      { label: 'Submitted', time: '09:12:35', done: true },
      { label: 'Compliance Check', time: '09:12:39', done: true },
      { label: 'Approved', time: '09:13:01', done: true },
      { label: 'Sent to OMS', time: '09:13:06', done: true },
      { label: 'Filled', time: '09:14:45', done: true },
    ],
    auditTrail: [
      { time: '09:12:35', action: 'Order submitted by AutoPilot rebalance engine', by: 'System' },
      { time: '09:13:01', action: 'Auto-approved (within advisor pre-approval limits)', by: 'System' },
      { time: '09:14:45', action: 'Order filled at $269.00 avg price', by: 'OMS' },
    ],
  },
  {
    id: 'ORD-2026-0422-003',
    timestamp: '2026-04-22 09:12:36',
    clientId: 'mr',
    clientName: 'Marcus Reid',
    clientInitials: 'MR',
    clientColor: '#7B5BFF',
    action: 'BUY',
    ticker: 'BND',
    securityName: 'Vanguard Total Bond Market ETF',
    quantity: 200,
    estimatedValue: 14_400,
    orderType: 'Market',
    status: 'Executing',
    source: 'Rebalance',
    compliancePass: true,
    rebalanceBatchId: 'RB-MR-0422',
    timeline: [
      { label: 'Submitted', time: '09:12:36', done: true },
      { label: 'Compliance Check', time: '09:12:40', done: true },
      { label: 'Approved', time: '09:13:01', done: true },
      { label: 'Sent to OMS', time: '09:13:07', done: true },
      { label: 'Partially Filled', time: '—', done: false },
      { label: 'Filled', time: '—', done: false },
    ],
    auditTrail: [
      { time: '09:12:36', action: 'Order submitted by AutoPilot rebalance engine', by: 'System' },
      { time: '09:13:07', action: 'Sent to OMS for execution', by: 'System' },
    ],
  },
  // Manual buy for Sarah Chen
  {
    id: 'ORD-2026-0422-004',
    timestamp: '2026-04-22 10:05:18',
    clientId: 'sc',
    clientName: 'Sarah Chen',
    clientInitials: 'SC',
    clientColor: '#2FA4F9',
    action: 'BUY',
    ticker: 'AAPL',
    securityName: 'Apple Inc',
    quantity: 50,
    estimatedValue: 11_250,
    orderType: 'Limit',
    limitPrice: 225.0,
    status: 'Pending Approval',
    source: 'Manual',
    compliancePass: true,
    timeline: [
      { label: 'Submitted', time: '10:05:18', done: true },
      { label: 'Compliance Check', time: '10:05:22', done: true },
      { label: 'Approved', time: '—', done: false },
      { label: 'Sent to OMS', time: '—', done: false },
      { label: 'Filled', time: '—', done: false },
    ],
    auditTrail: [
      { time: '10:05:18', action: 'Order manually submitted by advisor', by: 'Vijay Venkat' },
      { time: '10:05:22', action: 'Compliance check passed', by: 'Compliance Engine' },
    ],
  },
  {
    id: 'ORD-2026-0422-005',
    timestamp: '2026-04-22 10:08:42',
    clientId: 'sc',
    clientName: 'Sarah Chen',
    clientInitials: 'SC',
    clientColor: '#2FA4F9',
    action: 'BUY',
    ticker: 'MSFT',
    securityName: 'Microsoft Corp',
    quantity: 30,
    estimatedValue: 12_900,
    orderType: 'Market',
    status: 'Approved',
    source: 'Manual',
    compliancePass: true,
    timeline: [
      { label: 'Submitted', time: '10:08:42', done: true },
      { label: 'Compliance Check', time: '10:08:45', done: true },
      { label: 'Approved', time: '10:10:12', done: true },
      { label: 'Sent to OMS', time: '—', done: false },
      { label: 'Filled', time: '—', done: false },
    ],
    auditTrail: [
      { time: '10:08:42', action: 'Order manually submitted by advisor', by: 'Vijay Venkat' },
      { time: '10:10:12', action: 'Approved by senior advisor', by: 'Vijay Venkat' },
    ],
  },
  // TLH sells flagged by Copilot
  {
    id: 'ORD-2026-0422-006',
    timestamp: '2026-04-22 08:45:10',
    clientId: 'ap',
    clientName: 'Anika Patel',
    clientInitials: 'AP',
    clientColor: '#F97316',
    action: 'SELL',
    ticker: 'XLE',
    securityName: 'Energy Select Sector SPDR',
    quantity: 300,
    estimatedValue: 26_700,
    orderType: 'Market',
    status: 'Filled',
    source: 'AutoPilot',
    compliancePass: true,
    tlhFlag: true,
    timeline: [
      { label: 'Submitted', time: '08:45:10', done: true },
      { label: 'Compliance Check', time: '08:45:14', done: true },
      { label: 'Approved', time: '08:46:01', done: true },
      { label: 'Sent to OMS', time: '08:46:05', done: true },
      { label: 'Filled', time: '08:47:33', done: true },
    ],
    auditTrail: [
      { time: '08:45:10', action: 'TLH opportunity flagged by Copilot - unrealized loss of $4,200', by: 'Copilot AI' },
      { time: '08:46:01', action: 'Approved by advisor', by: 'Vijay Venkat' },
      { time: '08:47:33', action: 'Order filled at $89.00 avg price', by: 'OMS' },
    ],
  },
  {
    id: 'ORD-2026-0422-007',
    timestamp: '2026-04-22 08:45:12',
    clientId: 'ap',
    clientName: 'Anika Patel',
    clientInitials: 'AP',
    clientColor: '#F97316',
    action: 'BUY',
    ticker: 'VDE',
    securityName: 'Vanguard Energy ETF',
    quantity: 280,
    estimatedValue: 25_480,
    orderType: 'Market',
    status: 'Filled',
    source: 'AutoPilot',
    compliancePass: true,
    tlhFlag: true,
    timeline: [
      { label: 'Submitted', time: '08:45:12', done: true },
      { label: 'Compliance Check', time: '08:45:16', done: true },
      { label: 'Approved', time: '08:46:01', done: true },
      { label: 'Sent to OMS', time: '08:46:06', done: true },
      { label: 'Filled', time: '08:48:01', done: true },
    ],
    auditTrail: [
      { time: '08:45:12', action: 'TLH replacement buy generated by Copilot', by: 'Copilot AI' },
      { time: '08:46:01', action: 'Approved by advisor', by: 'Vijay Venkat' },
      { time: '08:48:01', action: 'Order filled at $91.00 avg price', by: 'OMS' },
    ],
  },
  // Rejected order - compliance block
  {
    id: 'ORD-2026-0422-008',
    timestamp: '2026-04-22 11:22:05',
    clientId: 'dg',
    clientName: 'David Goldberg',
    clientInitials: 'DG',
    clientColor: '#10B981',
    action: 'BUY',
    ticker: 'PLTR',
    securityName: 'Palantir Technologies',
    quantity: 500,
    estimatedValue: 14_500,
    orderType: 'Market',
    status: 'Rejected',
    source: 'Manual',
    compliancePass: false,
    complianceNote: 'Restricted ticker - firm employee conflict of interest',
    timeline: [
      { label: 'Submitted', time: '11:22:05', done: true },
      { label: 'Compliance Check', time: '11:22:08', done: true },
      { label: 'Rejected', time: '11:22:08', done: true },
    ],
    auditTrail: [
      { time: '11:22:05', action: 'Order manually submitted by advisor', by: 'Vijay Venkat' },
      { time: '11:22:08', action: 'REJECTED - Restricted ticker per firm compliance policy', by: 'Compliance Engine' },
    ],
  },
  // Lin Zhao - large order partially filled
  {
    id: 'ORD-2026-0422-009',
    timestamp: '2026-04-22 09:30:00',
    clientId: 'lz',
    clientName: 'Lin Zhao',
    clientInitials: 'LZ',
    clientColor: '#EC4899',
    action: 'BUY',
    ticker: 'AMZN',
    securityName: 'Amazon.com Inc',
    quantity: 200,
    estimatedValue: 39_400,
    orderType: 'Limit',
    limitPrice: 197.0,
    status: 'Partially Filled',
    source: 'Manual',
    compliancePass: true,
    timeline: [
      { label: 'Submitted', time: '09:30:00', done: true },
      { label: 'Compliance Check', time: '09:30:04', done: true },
      { label: 'Approved', time: '09:31:15', done: true },
      { label: 'Sent to OMS', time: '09:31:18', done: true },
      { label: 'Partially Filled', time: '09:45:22', done: true },
      { label: 'Filled', time: '—', done: false },
    ],
    auditTrail: [
      { time: '09:30:00', action: 'Order manually submitted by advisor', by: 'Vijay Venkat' },
      { time: '09:31:15', action: 'Approved by advisor', by: 'Vijay Venkat' },
      { time: '09:45:22', action: '140 of 200 shares filled at $196.85 avg', by: 'OMS' },
    ],
  },
  // Rohan Mehta - pending approval
  {
    id: 'ORD-2026-0422-010',
    timestamp: '2026-04-22 11:45:30',
    clientId: 'rm',
    clientName: 'Rohan Mehta',
    clientInitials: 'RM',
    clientColor: '#0EA5E9',
    action: 'SELL',
    ticker: 'TSLA',
    securityName: 'Tesla Inc',
    quantity: 40,
    estimatedValue: 10_400,
    orderType: 'Stop',
    stopPrice: 260.0,
    status: 'Pending Approval',
    source: 'AutoPilot',
    compliancePass: true,
    timeline: [
      { label: 'Submitted', time: '11:45:30', done: true },
      { label: 'Compliance Check', time: '11:45:34', done: true },
      { label: 'Approved', time: '—', done: false },
      { label: 'Sent to OMS', time: '—', done: false },
      { label: 'Filled', time: '—', done: false },
    ],
    auditTrail: [
      { time: '11:45:30', action: 'Stop-loss order generated by AutoPilot risk monitor', by: 'Copilot AI' },
      { time: '11:45:34', action: 'Compliance check passed', by: 'Compliance Engine' },
    ],
  },
  // Cancelled order
  {
    id: 'ORD-2026-0421-011',
    timestamp: '2026-04-21 15:30:00',
    clientId: 'lz',
    clientName: 'Lin Zhao',
    clientInitials: 'LZ',
    clientColor: '#EC4899',
    action: 'SELL',
    ticker: 'GOOGL',
    securityName: 'Alphabet Inc Class A',
    quantity: 60,
    estimatedValue: 10_380,
    orderType: 'Limit',
    limitPrice: 173.0,
    status: 'Cancelled',
    source: 'Manual',
    compliancePass: true,
    timeline: [
      { label: 'Submitted', time: '15:30:00', done: true },
      { label: 'Compliance Check', time: '15:30:04', done: true },
      { label: 'Approved', time: '15:31:10', done: true },
      { label: 'Cancelled', time: '16:00:00', done: true },
    ],
    auditTrail: [
      { time: '15:30:00', action: 'Order manually submitted', by: 'Vijay Venkat' },
      { time: '16:00:00', action: 'Order cancelled by advisor - client changed direction', by: 'Vijay Venkat' },
    ],
  },
  // Another TLH for David Goldberg
  {
    id: 'ORD-2026-0422-012',
    timestamp: '2026-04-22 08:50:22',
    clientId: 'dg',
    clientName: 'David Goldberg',
    clientInitials: 'DG',
    clientColor: '#10B981',
    action: 'SELL',
    ticker: 'IWM',
    securityName: 'iShares Russell 2000 ETF',
    quantity: 150,
    estimatedValue: 31_050,
    orderType: 'Market',
    status: 'Filled',
    source: 'AutoPilot',
    compliancePass: true,
    tlhFlag: true,
    timeline: [
      { label: 'Submitted', time: '08:50:22', done: true },
      { label: 'Compliance Check', time: '08:50:26', done: true },
      { label: 'Approved', time: '08:51:10', done: true },
      { label: 'Sent to OMS', time: '08:51:14', done: true },
      { label: 'Filled', time: '08:52:45', done: true },
    ],
    auditTrail: [
      { time: '08:50:22', action: 'TLH opportunity flagged - unrealized loss of $2,800', by: 'Copilot AI' },
      { time: '08:51:10', action: 'Approved by advisor', by: 'Vijay Venkat' },
      { time: '08:52:45', action: 'Order filled at $207.00 avg price', by: 'OMS' },
    ],
  },
  // Pending rebalance for Rohan Mehta
  {
    id: 'ORD-2026-0422-013',
    timestamp: '2026-04-22 12:01:05',
    clientId: 'rm',
    clientName: 'Rohan Mehta',
    clientInitials: 'RM',
    clientColor: '#0EA5E9',
    action: 'BUY',
    ticker: 'QQQ',
    securityName: 'Invesco QQQ Trust',
    quantity: 45,
    estimatedValue: 22_050,
    orderType: 'Market',
    status: 'Pending Approval',
    source: 'Rebalance',
    compliancePass: true,
    rebalanceBatchId: 'RB-RM-0422',
    timeline: [
      { label: 'Submitted', time: '12:01:05', done: true },
      { label: 'Compliance Check', time: '12:01:09', done: true },
      { label: 'Approved', time: '—', done: false },
      { label: 'Sent to OMS', time: '—', done: false },
      { label: 'Filled', time: '—', done: false },
    ],
    auditTrail: [
      { time: '12:01:05', action: 'Rebalance order generated - portfolio drift exceeds 4.5% threshold', by: 'System' },
      { time: '12:01:09', action: 'Compliance check passed', by: 'Compliance Engine' },
    ],
  },
  // Filled manual trade for Anika Patel
  {
    id: 'ORD-2026-0422-014',
    timestamp: '2026-04-22 10:20:15',
    clientId: 'ap',
    clientName: 'Anika Patel',
    clientInitials: 'AP',
    clientColor: '#F97316',
    action: 'BUY',
    ticker: 'AGG',
    securityName: 'iShares Core US Aggregate Bond',
    quantity: 100,
    estimatedValue: 9_800,
    orderType: 'Market',
    status: 'Filled',
    source: 'Manual',
    compliancePass: true,
    timeline: [
      { label: 'Submitted', time: '10:20:15', done: true },
      { label: 'Compliance Check', time: '10:20:19', done: true },
      { label: 'Approved', time: '10:21:30', done: true },
      { label: 'Sent to OMS', time: '10:21:33', done: true },
      { label: 'Filled', time: '10:22:45', done: true },
    ],
    auditTrail: [
      { time: '10:20:15', action: 'Order manually submitted - conservative allocation increase', by: 'Vijay Venkat' },
      { time: '10:22:45', action: 'Order filled at $98.00 avg price', by: 'OMS' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const fmtValue = (v: number) => {
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}K`;
  return `$${v.toFixed(0)}`;
};

const statusTone = (s: OrderStatus): 'warn' | 'success' | 'brand' | 'danger' | 'neutral' | 'purple' | 'muted' => {
  switch (s) {
    case 'Pending Approval': return 'warn';
    case 'Approved': return 'brand';
    case 'Executing': return 'purple';
    case 'Filled': return 'success';
    case 'Partially Filled': return 'brand';
    case 'Rejected': return 'danger';
    case 'Cancelled': return 'muted';
  }
};

const sourceBadgeTone = (s: OrderSource): 'neutral' | 'purple' | 'brand' => {
  switch (s) {
    case 'Manual': return 'neutral';
    case 'AutoPilot': return 'purple';
    case 'Rebalance': return 'brand';
  }
};

const SOURCE_ICONS: Record<OrderSource, React.ComponentType<IcoProps>> = {
  Manual: IconEdit,
  AutoPilot: IconBrain,
  Rebalance: IconScale,
};

const matchesStatusFilter = (status: OrderStatus, filter: StatusFilter): boolean => {
  if (filter === 'All') return true;
  if (filter === 'Pending') return status === 'Pending Approval';
  if (filter === 'Filled') return status === 'Filled' || status === 'Partially Filled';
  return status === filter;
};

const CLIENT_NAMES = [...new Set(MOCK_ORDERS.map(o => o.clientName))];

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

/** Status pill filter bar */
const StatusPills: React.FC<{ active: StatusFilter; onChange: (f: StatusFilter) => void }> = ({ active, onChange }) => (
  <div className="flex items-center gap-1.5 flex-wrap">
    {STATUS_FILTERS.map(f => (
      <button
        key={f}
        onClick={() => onChange(f)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
          active === f
            ? 'bg-brand-500 text-white shadow-sm'
            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
        }`}
      >
        {f}
      </button>
    ))}
  </div>
);

/** Order detail slide-over panel */
const OrderDetailPanel: React.FC<{ order: Order; onClose: () => void }> = ({ order, onClose }) => {
  const relatedOrders = order.rebalanceBatchId
    ? MOCK_ORDERS.filter(o => o.rebalanceBatchId === order.rebalanceBatchId && o.id !== order.id)
    : [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right">
        {/* Header */}
        <div className="shrink-0 px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold text-slate-900">{order.id}</div>
            <div className="text-xs text-slate-500 mt-0.5">{order.timestamp}</div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <IconX size={18} stroke="#64748B" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto scroll-thin px-6 py-5 space-y-6">
          {/* Order summary */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Order Details</h3>
            <div className="grid grid-cols-2 gap-3">
              <DetailItem label="Client" value={order.clientName} />
              <DetailItem label="Action">
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${order.action === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {order.action}
                </span>
              </DetailItem>
              <DetailItem label="Security" value={`${order.ticker} - ${order.securityName}`} />
              <DetailItem label="Quantity" value={order.quantity.toLocaleString()} />
              <DetailItem label="Est. Value" value={fmtValue(order.estimatedValue)} />
              <DetailItem label="Order Type" value={order.orderType} />
              {order.limitPrice && <DetailItem label="Limit Price" value={`$${order.limitPrice.toFixed(2)}`} />}
              {order.stopPrice && <DetailItem label="Stop Price" value={`$${order.stopPrice.toFixed(2)}`} />}
              <DetailItem label="Status">
                <Badge tone={statusTone(order.status)}>{order.status}</Badge>
              </DetailItem>
              <DetailItem label="Source">
                <Badge tone={sourceBadgeTone(order.source)}>{order.source}</Badge>
              </DetailItem>
              <DetailItem label="Compliance">
                {order.compliancePass ? (
                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                    <IconCheckCircle size={14} stroke="#059669" /> Pass
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-xs text-rose-600 font-medium">
                    <IconAlert size={14} stroke="#DC2626" /> Fail
                  </span>
                )}
              </DetailItem>
              {order.tlhFlag && (
                <DetailItem label="Flag">
                  <span className="inline-flex items-center gap-1 text-xs text-violet-600 font-medium">
                    <IconReceipt size={14} stroke="#7C3AED" /> Tax-Loss Harvest
                  </span>
                </DetailItem>
              )}
            </div>
            {order.complianceNote && (
              <div className="mt-3 p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                <span className="font-semibold">Compliance note:</span> {order.complianceNote}
              </div>
            )}
          </div>

          {/* Execution timeline */}
          {order.timeline && (
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Execution Timeline</h3>
              <div className="relative pl-4">
                {order.timeline.map((step, i) => (
                  <div key={i} className="flex items-start gap-3 pb-4 last:pb-0">
                    {/* Connector line */}
                    <div className="relative flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full shrink-0 ${step.done ? 'bg-brand-500' : 'bg-slate-200'}`} />
                      {i < order.timeline!.length - 1 && (
                        <div className={`w-0.5 flex-1 min-h-[20px] ${step.done ? 'bg-brand-200' : 'bg-slate-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 -mt-0.5">
                      <div className={`text-sm font-medium ${step.done ? 'text-slate-900' : 'text-slate-400'}`}>{step.label}</div>
                      <div className="text-xs text-slate-500">{step.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit trail */}
          {order.auditTrail && (
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">Audit Trail</h3>
              <div className="space-y-2.5">
                {order.auditTrail.map((entry, i) => (
                  <div key={i} className="flex gap-3 text-xs">
                    <div className="text-slate-400 shrink-0 w-16 font-medium tabular-nums">{entry.time}</div>
                    <div className="flex-1">
                      <div className="text-slate-700">{entry.action}</div>
                      <div className="text-slate-400 mt-0.5">by {entry.by}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Related orders */}
          {relatedOrders.length > 0 && (
            <div>
              <h3 className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-3">
                Related Orders (Batch: {order.rebalanceBatchId})
              </h3>
              <div className="space-y-2">
                {relatedOrders.map(ro => (
                  <div key={ro.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${ro.action === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {ro.action}
                    </span>
                    <span className="text-sm font-semibold text-slate-900">{ro.ticker}</span>
                    <span className="text-xs text-slate-500 flex-1">{ro.quantity} shares</span>
                    <Badge tone={statusTone(ro.status)}>{ro.status}</Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/** Detail row helper */
const DetailItem: React.FC<{ label: string; value?: string; children?: React.ReactNode }> = ({ label, value, children }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-0.5">{label}</div>
    {children || <div className="text-sm text-slate-900">{value}</div>}
  </div>
);

/* ------------------------------------------------------------------ */
/*  Main view                                                          */
/* ------------------------------------------------------------------ */

/* ------------------------------------------------------------------ */
/*  New Order Modal                                                    */
/* ------------------------------------------------------------------ */

interface NewOrderForm {
  clientName: string;
  action: OrderAction;
  ticker: string;
  securityName: string;
  quantity: string;
  orderType: OrderType;
  limitPrice: string;
  notes: string;
}

const EMPTY_FORM: NewOrderForm = {
  clientName: '',
  action: 'BUY',
  ticker: '',
  securityName: '',
  quantity: '',
  orderType: 'Market',
  limitPrice: '',
  notes: '',
};

const NewOrderModal: React.FC<{ onSubmit: (order: Order) => void; onClose: () => void }> = ({ onSubmit, onClose }) => {
  const [form, setForm] = useState<NewOrderForm>(EMPTY_FORM);

  const set = <K extends keyof NewOrderForm>(key: K, value: NewOrderForm[K]) =>
    setForm(prev => ({ ...prev, [key]: value }));

  const showLimitPrice = form.orderType === 'Limit' || form.orderType === 'Stop';

  const clientInfo = MOCK_ORDERS.find(o => o.clientName === form.clientName);

  const handleSubmit = () => {
    if (!form.clientName || !form.ticker || !form.quantity) return;
    const qty = parseInt(form.quantity, 10);
    if (isNaN(qty) || qty <= 0) return;

    const now = new Date();
    const ts = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    const orderId = `ORD-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 900) + 100)}`;

    const newOrder: Order = {
      id: orderId,
      timestamp: ts,
      clientId: clientInfo?.clientId || form.clientName.toLowerCase().replace(/\s/g, ''),
      clientName: form.clientName,
      clientInitials: clientInfo?.clientInitials || form.clientName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      clientColor: clientInfo?.clientColor || '#2FA4F9',
      action: form.action,
      ticker: form.ticker.toUpperCase(),
      securityName: form.securityName || form.ticker.toUpperCase(),
      quantity: qty,
      estimatedValue: qty * (showLimitPrice && form.limitPrice ? parseFloat(form.limitPrice) : 100),
      orderType: form.orderType,
      status: 'Pending Approval',
      source: 'Manual',
      compliancePass: true,
      ...(form.orderType === 'Limit' && form.limitPrice ? { limitPrice: parseFloat(form.limitPrice) } : {}),
      ...(form.orderType === 'Stop' && form.limitPrice ? { stopPrice: parseFloat(form.limitPrice) } : {}),
      timeline: [
        { label: 'Submitted', time: ts.split(' ')[1], done: true },
        { label: 'Compliance Check', time: '\u2014', done: false },
        { label: 'Approved', time: '\u2014', done: false },
        { label: 'Sent to OMS', time: '\u2014', done: false },
        { label: 'Filled', time: '\u2014', done: false },
      ],
      auditTrail: [
        { time: ts.split(' ')[1], action: 'Order manually submitted by advisor', by: 'Vijay Venkat' },
      ],
    };

    onSubmit(newOrder);
  };

  const inputClass = 'w-full text-sm border border-slate-200 rounded-lg px-3 py-2 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400 font-[Inter,sans-serif]';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto scroll-thin" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">New Order</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 transition">
            <IconX size={18} stroke="#64748B" />
          </button>
        </div>

        {/* Form */}
        <div className="px-6 py-5 space-y-4">
          {/* Client selector */}
          <div>
            <label className={labelClass}>Client</label>
            <select value={form.clientName} onChange={e => set('clientName', e.target.value)} className={inputClass}>
              <option value="">Select client...</option>
              {CLIENT_NAMES.map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>

          {/* Action toggle */}
          <div>
            <label className={labelClass}>Action</label>
            <div className="flex rounded-lg border border-slate-200 overflow-hidden w-fit">
              <button
                onClick={() => set('action', 'BUY')}
                className={`px-5 py-2 text-sm font-semibold transition ${
                  form.action === 'BUY'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                BUY
              </button>
              <button
                onClick={() => set('action', 'SELL')}
                className={`px-5 py-2 text-sm font-semibold transition ${
                  form.action === 'SELL'
                    ? 'bg-rose-500 text-white'
                    : 'bg-white text-slate-500 hover:bg-slate-50'
                }`}
              >
                SELL
              </button>
            </div>
          </div>

          {/* Ticker + Security name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Ticker</label>
              <input
                type="text"
                value={form.ticker}
                onChange={e => set('ticker', e.target.value.toUpperCase())}
                placeholder="e.g. AAPL"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Security Name</label>
              <input
                type="text"
                value={form.securityName}
                onChange={e => set('securityName', e.target.value)}
                placeholder="e.g. Apple Inc"
                className={inputClass}
              />
            </div>
          </div>

          {/* Quantity */}
          <div>
            <label className={labelClass}>Quantity</label>
            <input
              type="number"
              value={form.quantity}
              onChange={e => set('quantity', e.target.value)}
              placeholder="Number of shares"
              min="1"
              className={inputClass}
            />
          </div>

          {/* Order type */}
          <div>
            <label className={labelClass}>Order Type</label>
            <select value={form.orderType} onChange={e => set('orderType', e.target.value as OrderType)} className={inputClass}>
              <option value="Market">Market</option>
              <option value="Limit">Limit</option>
              <option value="Stop">Stop</option>
            </select>
          </div>

          {/* Limit / Stop price */}
          {showLimitPrice && (
            <div>
              <label className={labelClass}>{form.orderType === 'Limit' ? 'Limit Price' : 'Stop Price'}</label>
              <input
                type="number"
                value={form.limitPrice}
                onChange={e => set('limitPrice', e.target.value)}
                placeholder="$0.00"
                step="0.01"
                min="0"
                className={inputClass}
              />
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              className={inputClass + ' resize-none'}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-end gap-2">
          <Button kind="secondary" size="sm" onClick={onClose}>Cancel</Button>
          <Button
            kind="primary"
            size="sm"
            icon={IconPlus}
            onClick={handleSubmit}
          >
            Submit Order
          </Button>
        </div>
      </div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/*  Main view                                                          */
/* ------------------------------------------------------------------ */

export const TradeBlotterView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [clientFilter, setClientFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);

  const allClientNames = useMemo(() => [...new Set(orders.map(o => o.clientName))], [orders]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      if (!matchesStatusFilter(o.status, statusFilter)) return false;
      if (clientFilter !== 'All' && o.clientName !== clientFilter) return false;
      return true;
    });
  }, [orders, statusFilter, clientFilter]);

  // KPI calculations
  const ordersToday = orders.filter(o => o.timestamp.startsWith('2026-04-22')).length;
  const pendingCount = orders.filter(o => o.status === 'Pending Approval').length;
  const executedCount = orders.filter(o => o.status === 'Filled' || o.status === 'Partially Filled').length;
  const rejectedCancelledCount = orders.filter(o => o.status === 'Rejected' || o.status === 'Cancelled').length;

  const handleNewOrderSubmit = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setShowNewOrderModal(false);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Trade Blotter</h1>
          <p className="text-sm text-slate-500 mt-0.5">Order management and execution tracking</p>
        </div>
        <Button kind="primary" size="md" icon={IconPlus} onClick={() => setShowNewOrderModal(true)}>
          New Order
        </Button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <KPI label="Orders Today" value={ordersToday} sub="across all clients" accent="#2FA4F9" />
        <KPI label="Pending Approval" value={pendingCount} sub="awaiting review" accent="#F59E0B" />
        <KPI label="Executed" value={executedCount} sub="filled or partially filled" accent="#10B981" />
        <KPI label="Rejected / Cancelled" value={rejectedCancelledCount} sub="blocked or withdrawn" accent="#EF4444" />
      </div>

      {/* Filter bar */}
      <Card className="p-4 mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <StatusPills active={statusFilter} onChange={setStatusFilter} />
          <div className="flex items-center gap-3">
            {/* Client dropdown */}
            <div className="flex items-center gap-2">
              <IconFilter size={14} stroke="#94A3B8" />
              <select
                value={clientFilter}
                onChange={e => setClientFilter(e.target.value)}
                className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-200 focus:border-brand-400"
              >
                <option value="All">All Clients</option>
                {allClientNames.map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            {/* Date range mock */}
            <div className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm text-slate-600 bg-white">
              <IconClock size={14} stroke="#94A3B8" />
              <span>Apr 21 - Apr 22, 2026</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Orders table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/80">
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Order ID</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Time</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Client</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Action</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Security</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Qty</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Est. Value</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Type</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Status</th>
                <th className="text-left px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Source</th>
                <th className="text-center px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Compl.</th>
                <th className="text-right px-4 py-3 text-[11px] uppercase tracking-wider font-semibold text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className="border-b border-slate-100 hover:bg-slate-50/60 cursor-pointer transition"
                >
                  <td className="px-4 py-3">
                    <span className="text-xs font-medium text-brand-600 tabular-nums">{order.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-500 tabular-nums">{order.timestamp.split(' ')[1]}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Avatar initials={order.clientInitials} color={order.clientColor} size="sm" />
                      <span className="text-sm font-medium text-slate-900">{order.clientName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                      order.action === 'BUY' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                    }`}>
                      {order.action}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <span className="font-semibold text-slate-900">{order.ticker}</span>
                      <span className="text-xs text-slate-500 ml-1.5">{order.securityName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums text-slate-700">{order.quantity.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right tabular-nums font-medium text-slate-900">{fmtValue(order.estimatedValue)}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-slate-600">{order.orderType}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={statusTone(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge tone={sourceBadgeTone(order.source)}>
                      {order.source}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {order.compliancePass ? (
                      <IconCheckCircle size={16} stroke="#059669" />
                    ) : (
                      <IconAlert size={16} stroke="#DC2626" />
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center gap-1 justify-end" onClick={e => e.stopPropagation()}>
                      {order.status === 'Pending Approval' && (
                        <>
                          <button className="p-1.5 rounded-lg hover:bg-emerald-50 transition" title="Approve">
                            <IconCheck size={15} stroke="#059669" sw={2.2} />
                          </button>
                          <button className="p-1.5 rounded-lg hover:bg-rose-50 transition" title="Reject">
                            <IconX size={15} stroke="#DC2626" sw={2.2} />
                          </button>
                        </>
                      )}
                      <button
                        className="p-1.5 rounded-lg hover:bg-slate-100 transition"
                        title="View details"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <IconChevronRight size={15} stroke="#64748B" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={12} className="px-4 py-12 text-center text-slate-400 text-sm">
                    No orders match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer */}
        <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div className="text-xs text-slate-500">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
          <div className="text-xs text-slate-400">
            Last refreshed: Apr 22, 2026 12:05 PM
          </div>
        </div>
      </Card>

      {/* Order detail panel */}
      {selectedOrder && (
        <OrderDetailPanel order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}

      {/* New order modal */}
      {showNewOrderModal && (
        <NewOrderModal onSubmit={handleNewOrderSubmit} onClose={() => setShowNewOrderModal(false)} />
      )}
    </div>
  );
};

export default TradeBlotterView;
