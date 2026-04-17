'use client';

import React from 'react';
import { Avatar, Badge, Button } from '@/components/ui';
import {
  IconHome,
  IconCalendar,
  IconRadar,
  IconSearch,
  IconUsers,
  IconLayers,
  IconPulse,
  IconHistory,
  IconShield,
  IconRocket,
  IconBook,
  IconChat,
  IconCompass,
  IconChevronDown,
  IconPlus,
  IconTarget,
  IconBrain,
  IconMail,
  IconSparkles,
  IconStar,
} from '@/components/icons';
import type { HistoryItem } from '@/types';

export interface SidebarProps {
  view: string;
  setView: (view: string) => void;
  openTemplate: (templateId: string, client?: any, title?: string) => void;
  recents: HistoryItem[];
  currentChatId?: string;
  onNewChat: () => void;
  onOpenPalette: () => void;
}

/**
 * NavItem sub-component for consistent nav styling
 */
const NavItem: React.FC<{
  id: string;
  icon: React.ComponentType<any>;
  label: string;
  badge?: string | number;
  active?: boolean;
  onClick: () => void;
}> = ({ id, icon: IconC, label, badge, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full ripple flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
        active
          ? 'bg-brand-50 text-brand-700 font-semibold'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      <IconC
        size={18}
        stroke={active ? '#1B8AD8' : '#475569'}
        sw={active ? 2.2 : 1.8}
      />
      <span className="flex-1 text-left">{label}</span>
      {badge && <Badge tone="brand">{badge}</Badge>}
    </button>
  );
};

/**
 * Sidebar component
 * Left navigation panel with logo, nav items, recent conversations, and user profile
 */
export const Sidebar: React.FC<SidebarProps> = ({
  view,
  setView,
  openTemplate,
  recents,
  currentChatId,
  onNewChat,
  onOpenPalette,
}) => {
  return (
    <aside className="w-[260px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-full overflow-hidden">
      {/* Logo header */}
      <div className="shrink-0 px-4 pt-4 pb-3 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-lg shadow-brand-500/40">
          <IconPulse size={18} stroke="#fff" sw={2.4} />
        </div>
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <div className="font-bold text-slate-900 text-[15px]">Copilot</div>
            <span className="inline-flex items-center gap-1 px-1.5 py-[1px] rounded-md bg-gradient-to-r from-brand-500 to-violet-500 text-white text-[9.5px] font-bold tracking-wide uppercase shadow-lg shadow-brand-500/30">
              v4
            </span>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">
            flyerft · wealth
          </div>
        </div>
      </div>

      {/* New conversation button */}
      <div className="shrink-0 px-3 pb-2">
        <Button
          kind="primary"
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2"
          size="sm"
        >
          <IconPlus size={16} sw={2.4} />
          New conversation
        </Button>
      </div>

      {/* Quick find button */}
      <div className="shrink-0 px-3 pb-3">
        <button
          onClick={onOpenPalette}
          className="w-full ripple flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-600"
        >
          <IconSearch size={14} />
          <span className="flex-1 text-left">Quick find…</span>
          <kbd className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-white border border-slate-200">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Scrollable nav section */}
      <div className="flex-1 min-h-0 overflow-y-auto scroll-thin">
        {/* Main navigation */}
        <nav className="px-2 space-y-0.5">
          <NavItem
            id="home"
            icon={IconHome}
            label="Home"
            active={view === 'home'}
            onClick={() => setView('home')}
          />
          <NavItem
            id="meetings"
            icon={IconCalendar}
            label="Meetings"
            badge="3"
            active={view === 'meetings'}
            onClick={() => setView('meetings')}
          />
          <NavItem
            id="pulse"
            icon={IconRadar}
            label="Book pulse"
            badge="2"
            active={view === 'pulse'}
            onClick={() => setView('pulse')}
          />
          <NavItem
            id="askbook"
            icon={IconSearch}
            label="Ask my book"
            active={view === 'askbook'}
            onClick={() => setView('askbook')}
          />
          <NavItem
            id="clients"
            icon={IconUsers}
            label="Clients"
            badge="6"
            active={view === 'clients'}
            onClick={() => setView('clients')}
          />
          <NavItem
            id="library"
            icon={IconLayers}
            label="Template library"
            active={view === 'library'}
            onClick={() => setView('library')}
          />
          <NavItem
            id="insights"
            icon={IconPulse}
            label="Insights"
            badge="3"
            active={view === 'insights'}
            onClick={() => setView('insights')}
          />
          <NavItem
            id="history"
            icon={IconHistory}
            label="History"
            active={view === 'history'}
            onClick={() => setView('history')}
          />
        </nav>

        {/* Power tools */}
        <div className="px-3 mt-4">
          <div className="px-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Power tools
          </div>
          <div className="space-y-0.5">
            <NavItem
              id="briefing"
              icon={IconTarget}
              label="Morning briefing"
              active={view === 'briefing'}
              onClick={() => setView('briefing')}
            />
            <NavItem
              id="autopilot"
              icon={IconBrain}
              label="AutoPilot"
              badge="4"
              active={view === 'autopilot'}
              onClick={() => setView('autopilot')}
            />
            <NavItem
              id="batch"
              icon={IconLayers}
              label="Batch actions"
              active={view === 'batch'}
              onClick={() => setView('batch')}
            />
            <NavItem
              id="campaigns"
              icon={IconMail}
              label="Campaigns"
              active={view === 'campaigns'}
              onClick={() => setView('campaigns')}
            />
            <NavItem
              id="models"
              icon={IconStar}
              label="Model portfolios"
              active={view === 'models'}
              onClick={() => setView('models')}
            />
            <NavItem
              id="compliance"
              icon={IconShield}
              label="Compliance"
              active={view === 'compliance'}
              onClick={() => setView('compliance')}
            />
          </div>
        </div>

        {/* Recent conversations */}
        <div className="px-3 mt-5 pb-2">
          <div className="px-1 text-[10px] uppercase tracking-wider font-semibold text-slate-400 mb-1.5">
            Recent
          </div>
          <div className="space-y-0.5">
            {recents.slice(0, 5).map((r) => (
              <button
                key={r.id}
                onClick={() => openTemplate(r.template, r.client, r.title)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-[12.5px] truncate transition ${
                  currentChatId === r.id
                    ? 'bg-slate-100 text-slate-900'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {r.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* User profile at bottom */}
      <div className="shrink-0 border-t border-slate-200 px-3 py-3">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-slate-50 cursor-pointer ripple">
          <Avatar initials="VV" color="#0F172A" size="sm" />
          <div className="flex-1 min-w-0 leading-tight">
            <div className="text-[13px] font-semibold text-slate-900 truncate">
              Vijay Venkat
            </div>
            <div className="text-[11px] text-slate-500 truncate">
              Sr. Wealth Advisor · MUM-04
            </div>
          </div>
          <IconChevronDown size={14} stroke="#94A3B8" />
        </div>
      </div>
    </aside>
  );
};
