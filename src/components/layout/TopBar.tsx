'use client';

import React from 'react';
import { Avatar, Badge } from '@/components/ui';
import { IconSearch, IconBell, IconSettings } from '@/components/icons';

export interface TopBarProps {
  onOpenPalette: () => void;
}

/**
 * TopBar component
 * Header with search/command palette, markets badge, notifications, and settings
 */
export const TopBar: React.FC<TopBarProps> = ({ onOpenPalette }) => {
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
      <div className="flex items-center gap-2">
        {/* Notification bell with dot */}
        <button className="p-2 rounded-lg hover:bg-slate-100 ripple relative">
          <IconBell size={18} stroke="#475569" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-slate-100 ripple">
          <IconSettings size={18} stroke="#475569" />
        </button>

        {/* User avatar */}
        <Avatar initials="VV" color="#0F172A" size="sm" />
      </div>
    </header>
  );
};
