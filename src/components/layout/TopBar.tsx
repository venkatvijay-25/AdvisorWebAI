'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, Badge } from '@/components/ui';
import { IconSearch, IconBell, IconSettings, IconAlert, IconCalendar, IconShield, IconTrendDown, IconCheck } from '@/components/icons';

export interface TopBarProps {
  onOpenPalette: () => void;
  onOpenSettings?: () => void;
}

interface Notification {
  id: string;
  icon: React.ComponentType<any>;
  iconColor: string;
  iconBg: string;
  title: string;
  description: string;
  timeAgo: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    icon: IconAlert,
    iconColor: '#DC2626',
    iconBg: '#FEF2F2',
    title: 'Drift alert: Chen portfolio',
    description: 'US Equity allocation drifted 4.2% above target',
    timeAgo: '12 min ago',
    read: false,
  },
  {
    id: 'n2',
    icon: IconCalendar,
    iconColor: '#2FA4F9',
    iconBg: '#EFF6FF',
    title: 'Meeting in 30 minutes',
    description: 'Quarterly review with Sarah & David Martinez',
    timeAgo: '28 min ago',
    read: false,
  },
  {
    id: 'n3',
    icon: IconShield,
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
    title: 'Compliance deadline approaching',
    description: 'ADV Part 2 annual amendment due in 3 days',
    timeAgo: '1 hr ago',
    read: false,
  },
  {
    id: 'n4',
    icon: IconTrendDown,
    iconColor: '#7C3AED',
    iconBg: '#F5F3FF',
    title: 'Market alert: Tech sector',
    description: 'NASDAQ down 2.1% — 6 client portfolios may be impacted',
    timeAgo: '2 hr ago',
    read: true,
  },
  {
    id: 'n5',
    icon: IconCheck,
    iconColor: '#059669',
    iconBg: '#ECFDF5',
    title: 'AutoPilot: Rebalance completed',
    description: 'Thompson Family Trust rebalanced successfully',
    timeAgo: '3 hr ago',
    read: true,
  },
];

/**
 * TopBar component
 * Header with search/command palette, markets badge, notifications, and settings
 */
export const TopBar: React.FC<TopBarProps> = ({ onOpenPalette, onOpenSettings }) => {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const panelRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close panel on click outside
  useEffect(() => {
    if (!notificationsOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        bellRef.current && !bellRef.current.contains(e.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [notificationsOpen]);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleNotification = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  return (
    <header className="h-14 px-6 border-b border-slate-200 bg-white flex items-center gap-4 shrink-0">
      {/* Search bar / Command palette trigger */}
      <button
        onClick={onOpenPalette}
        className="flex-1 max-w-xl relative ripple"
      >
        <div className="flex items-center gap-2 pl-3 pr-2 py-2 text-sm rounded-lg bg-slate-100 border border-transparent hover:bg-slate-50 hover:border-slate-200 text-slate-500 text-left">
          <IconSearch size={15} stroke="#94A3B8" />
          <span className="flex-1">Search clients, holdings, conversations…</span>
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white border border-slate-200 text-[10px] font-semibold text-slate-500">
            <span>⌘</span>
            <span>K</span>
          </span>
        </div>
      </button>

      {/* Markets open badge */}
      <Badge tone="success">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block mr-1" />
        Markets open
      </Badge>

      {/* Right section: notifications, settings, avatar */}
      <div className="flex items-center gap-2 relative">
        {/* Notification bell with dot */}
        <button
          ref={bellRef}
          onClick={() => setNotificationsOpen(prev => !prev)}
          className="p-2 rounded-lg hover:bg-slate-100 ripple relative"
        >
          <IconBell size={18} stroke="#475569" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
          )}
        </button>

        {/* Notification dropdown panel */}
        {notificationsOpen && (
          <div
            ref={panelRef}
            className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl border border-slate-200 shadow-lg z-50 overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900 text-sm">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-rose-100 text-rose-600 text-[11px] font-semibold">
                    {unreadCount}
                  </span>
                )}
              </div>
              <button
                onClick={markAllRead}
                className="text-[12px] font-medium text-[#2FA4F9] hover:text-[#1a8ad8] transition-colors"
              >
                Mark all as read
              </button>
            </div>

            {/* Notification list */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => {
                const NIcon = n.icon;
                return (
                  <button
                    key={n.id}
                    onClick={() => toggleNotification(n.id)}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-b-0 ${
                      !n.read ? 'bg-blue-50/40' : ''
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: n.iconBg }}
                    >
                      <NIcon size={16} stroke={n.iconColor} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm leading-tight truncate ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2FA4F9] shrink-0" />
                        )}
                      </div>
                      <p className="text-[12px] text-slate-500 leading-snug mt-0.5 truncate">
                        {n.description}
                      </p>
                      <p className="text-[11px] text-slate-400 mt-1">{n.timeAgo}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-4 py-3 border-t border-slate-100 text-center">
              <button className="text-[12px] font-medium text-[#2FA4F9] hover:text-[#1a8ad8] transition-colors">
                View all notifications
              </button>
            </div>
          </div>
        )}

        {/* Settings */}
        <button
          onClick={onOpenSettings}
          className="p-2 rounded-lg hover:bg-slate-100 ripple"
        >
          <IconSettings size={18} stroke="#475569" />
        </button>

        {/* User avatar */}
        <Avatar initials="VV" color="#0F172A" size="sm" />
      </div>
    </header>
  );
};
