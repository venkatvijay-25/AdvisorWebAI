import React, { useState, useMemo } from 'react';
import { IconSparkles, IconPlus, IconEdit, IconCopy, IconX, IconCheck, IconSearch } from '@/components/icons';
import { iconMap } from '@/components/icons';
import { Button, Card, Badge } from '@/components/ui';
import { TEMPLATES } from '@/data/templates';
import type { Template } from '@/types';

/* ── Icon & color presets for the modal ── */
const ICON_OPTIONS = [
  'brief', 'scale', 'shield', 'newspaper', 'receipt', 'briefcase',
  'sparkles', 'brain', 'target', 'rocket', 'lightbulb', 'compass',
  'globe', 'flame', 'beaker', 'bar',
];

const COLOR_PRESETS = [
  { label: 'Blue', value: '#2FA4F9' },
  { label: 'Purple', value: '#7B5BFF' },
  { label: 'Orange', value: '#F97316' },
  { label: 'Emerald', value: '#10B981' },
  { label: 'Pink', value: '#EC4899' },
];

/* ── Categories ── */
type CategoryKey = 'All' | 'Portfolio' | 'Risk' | 'Tax' | 'Client' | 'Compliance' | 'Market' | 'Custom';

const CATEGORIES: CategoryKey[] = ['All', 'Portfolio', 'Risk', 'Tax', 'Client', 'Compliance', 'Market', 'Custom'];

const TEMPLATE_CATEGORIES: Record<string, CategoryKey> = {
  review: 'Portfolio',
  rebalance: 'Portfolio',
  risk: 'Risk',
  news: 'Market',
  tax: 'Tax',
  proposal: 'Client',
};

/* ── Additional built-in templates ── */
const EXTRA_TEMPLATES: (Template & { category: CategoryKey })[] = [
  {
    id: 'compliance-pretrade',
    icon: 'shield',
    title: 'Compliance pre-trade check',
    hint: 'Verify regulatory constraints, restricted lists, and concentration limits before executing trades',
    accent: '#F97316',
    sample: 'Run a pre-trade compliance check on the proposed Goldberg rebalance trades',
    category: 'Compliance',
  },
  {
    id: 'fee-schedule',
    icon: 'receipt',
    title: 'Fee schedule review',
    hint: 'Analyze fee structures across accounts, compare to benchmarks, and identify optimization opportunities',
    accent: '#7B5BFF',
    sample: 'Review fee schedules for all UHNI clients and flag any above 1.2% blended',
    category: 'Portfolio',
  },
  {
    id: 'estate-planning',
    icon: 'briefcase',
    title: 'Estate planning summary',
    hint: 'Compile estate plan overview including trusts, beneficiaries, and succession strategy',
    accent: '#0EA5E9',
    sample: 'Summarize the Goldberg estate plan and flag any documents expiring this year',
    category: 'Client',
  },
  {
    id: 'sector-rotation',
    icon: 'compass',
    title: 'Sector rotation analysis',
    hint: 'Analyze sector momentum, relative strength, and rotation signals across portfolios',
    accent: '#10B981',
    sample: 'Show sector rotation trends for Q2 and which client portfolios need adjustment',
    category: 'Market',
  },
  {
    id: 'client-onboarding',
    icon: 'tasks',
    title: 'Client onboarding checklist',
    hint: 'Generate a comprehensive onboarding checklist with KYC, account setup, and welcome materials',
    accent: '#EC4899',
    sample: 'Create an onboarding checklist for new prospect Aarav Singh with $3M in assets',
    category: 'Client',
  },
  {
    id: 'yearend-tax',
    icon: 'calendar',
    title: 'Year-end tax planning',
    hint: 'Comprehensive year-end tax strategy including harvesting, Roth conversions, and charitable giving',
    accent: '#F59E0B',
    sample: 'Build a year-end tax plan for the Chen household with estimated savings',
    category: 'Tax',
  },
];

/* ── Custom template type (extends Template with description) ── */
interface CustomTemplate extends Template {
  description: string;
}

interface ModalState {
  open: boolean;
  editingId: string | null;
  name: string;
  description: string;
  icon: string;
  accent: string;
  sample: string;
}

const emptyModal: ModalState = {
  open: false,
  editingId: null,
  name: '',
  description: '',
  icon: 'brief',
  accent: '#2FA4F9',
  sample: '',
};

interface LibraryViewProps {
  openTemplate: (id: string) => void;
}

export const LibraryView: React.FC<LibraryViewProps> = ({ openTemplate }) => {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [modal, setModal] = useState<ModalState>(emptyModal);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('All');

  /* ── All default templates (original + extras) ── */
  const allDefaultTemplates = useMemo(() => {
    const origWithCat = TEMPLATES.map(t => ({
      ...t,
      category: (TEMPLATE_CATEGORIES[t.id] || 'Portfolio') as CategoryKey,
    }));
    return [...origWithCat, ...EXTRA_TEMPLATES];
  }, []);

  /* ── Filtering logic ── */
  const filteredDefaults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return allDefaultTemplates.filter(t => {
      const matchesCategory = activeCategory === 'All' || t.category === activeCategory;
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [allDefaultTemplates, searchQuery, activeCategory]);

  const filteredCustom = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return customTemplates.filter(t => {
      const matchesCategory = activeCategory === 'All' || activeCategory === 'Custom';
      const matchesSearch = !q || t.title.toLowerCase().includes(q) || t.hint.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [customTemplates, searchQuery, activeCategory]);

  const totalCount = allDefaultTemplates.length + customTemplates.length;
  const shownCount = filteredDefaults.length + filteredCustom.length;

  /* ── Modal handlers ── */
  const openCreateModal = () => {
    setModal({ ...emptyModal, open: true });
  };

  const openEditModal = (tpl: CustomTemplate) => {
    setModal({
      open: true,
      editingId: tpl.id,
      name: tpl.title,
      description: tpl.description,
      icon: tpl.icon,
      accent: tpl.accent,
      sample: tpl.sample,
    });
  };

  const closeModal = () => setModal(emptyModal);

  const saveModal = () => {
    if (!modal.name.trim()) return;

    if (modal.editingId) {
      setCustomTemplates(prev =>
        prev.map(t =>
          t.id === modal.editingId
            ? { ...t, title: modal.name, description: modal.description, hint: modal.description, icon: modal.icon, accent: modal.accent, sample: modal.sample }
            : t
        )
      );
    } else {
      const newTpl: CustomTemplate = {
        id: `custom-${Date.now()}`,
        title: modal.name,
        hint: modal.description,
        description: modal.description,
        icon: modal.icon,
        accent: modal.accent,
        sample: modal.sample,
      };
      setCustomTemplates(prev => [...prev, newTpl]);
    }
    closeModal();
  };

  const duplicateTemplate = (tpl: CustomTemplate) => {
    const dup: CustomTemplate = {
      ...tpl,
      id: `custom-${Date.now()}`,
      title: `${tpl.title} (copy)`,
    };
    setCustomTemplates(prev => [...prev, dup]);
    setMenuOpenId(null);
  };

  const deleteTemplate = (id: string) => {
    setCustomTemplates(prev => prev.filter(t => t.id !== id));
    setMenuOpenId(null);
  };

  /* ── Template card renderer ── */
  const renderCard = (tpl: Template | CustomTemplate, isCustom: boolean) => {
    const IconC = iconMap[tpl.icon] || IconSparkles;

    return (
      <Card
        key={tpl.id}
        className="p-5 hover:elev-2 hover:-translate-y-0.5 transition cursor-pointer ripple relative group"
        onClick={() => openTemplate(tpl.id)}
      >
        {/* Icon */}
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center mb-3"
          style={{ background: `${tpl.accent}15` }}
        >
          <IconC size={18} stroke={tpl.accent} sw={2} />
        </div>

        {/* Title */}
        <div className="font-semibold text-slate-900 text-[14px] mb-1">
          {tpl.title}
        </div>

        {/* Hint */}
        <div className="text-[12.5px] text-slate-500 mb-3">
          {tpl.hint}
        </div>

        {/* Sample quote */}
        <div
          className="text-[12px] italic text-slate-400 border-l-2 pl-2"
          style={{ borderColor: `${tpl.accent}40` }}
        >
          &ldquo;{tpl.sample}&rdquo;
        </div>

        {/* Custom template actions */}
        {isCustom && (
          <div className="absolute top-3 right-3 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
            <button
              onClick={e => { e.stopPropagation(); openEditModal(tpl as CustomTemplate); }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Edit"
            >
              <IconEdit size={14} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); duplicateTemplate(tpl as CustomTemplate); }}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              title="Duplicate"
            >
              <IconCopy size={14} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); deleteTemplate(tpl.id); }}
              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600"
              title="Delete"
            >
              <IconX size={14} />
            </button>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Template library</h1>
          <p className="text-slate-500 text-sm mt-1">
            Curated AI workflows for advisors. Click any template to start a fresh conversation.
          </p>
        </div>
        <Button kind="primary" icon={IconPlus} size="sm" onClick={openCreateModal}>
          Create Template
        </Button>
      </div>

      {/* Search bar */}
      <div className="relative mb-4">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
          <IconSearch size={16} />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search templates by name or description..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-[#2FA4F9] focus:ring-2 focus:ring-brand-100 bg-white"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600"
          >
            <IconX size={14} />
          </button>
        )}
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition ${
              activeCategory === cat
                ? 'bg-[#2FA4F9] text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Match count */}
      <div className="text-xs text-slate-400 mb-4 font-medium">
        Showing {shownCount} of {totalCount} templates
      </div>

      {/* Empty state */}
      {shownCount === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-slate-400">
          <IconSearch size={36} stroke="#CBD5E1" />
          <p className="text-sm mt-3 font-medium text-slate-500">No templates match your search</p>
          <p className="text-xs mt-1 text-slate-400">Try a different keyword or category.</p>
          <button
            onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
            className="mt-4 text-xs font-medium text-[#2FA4F9] hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}

      {/* My Templates section */}
      {filteredCustom.length > 0 && (
        <div className="mb-8">
          <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-3">My Templates</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredCustom.map(tpl => renderCard(tpl, true))}
          </div>
        </div>
      )}

      {/* Default templates */}
      {filteredDefaults.length > 0 && (
        <>
          {filteredCustom.length > 0 && (
            <div className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 mb-3">Default Templates</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredDefaults.map(tpl => renderCard(tpl, false))}
          </div>
        </>
      )}

      {/* ── Create / Edit Modal ── */}
      {modal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeModal} />

          {/* Panel */}
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 fade-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-slate-900">
                {modal.editingId ? 'Edit Template' : 'Create Template'}
              </h2>
              <button onClick={closeModal} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                <IconX size={18} />
              </button>
            </div>

            {/* Name */}
            <label className="block mb-4">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Template name</span>
              <input
                value={modal.name}
                onChange={e => setModal(m => ({ ...m, name: e.target.value }))}
                placeholder="e.g. Monthly performance recap"
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
              />
            </label>

            {/* Description */}
            <label className="block mb-4">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Description</span>
              <textarea
                value={modal.description}
                onChange={e => setModal(m => ({ ...m, description: e.target.value }))}
                placeholder="What does this template do?"
                rows={2}
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
              />
            </label>

            {/* Icon selector */}
            <div className="mb-4">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Icon</span>
              <div className="mt-1.5 grid grid-cols-8 gap-1.5">
                {ICON_OPTIONS.map(key => {
                  const Ic = iconMap[key] || IconSparkles;
                  const selected = modal.icon === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setModal(m => ({ ...m, icon: key }))}
                      className={`p-2 rounded-lg flex items-center justify-center transition ${
                        selected
                          ? 'bg-brand-50 ring-2 ring-brand-400'
                          : 'bg-slate-50 hover:bg-slate-100'
                      }`}
                    >
                      <Ic size={18} stroke={selected ? '#2FA4F9' : '#64748B'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color picker */}
            <div className="mb-4">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Accent color</span>
              <div className="mt-1.5 flex items-center gap-2">
                {COLOR_PRESETS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setModal(m => ({ ...m, accent: c.value }))}
                    className={`w-8 h-8 rounded-full transition ${
                      modal.accent === c.value ? 'ring-2 ring-offset-2 ring-slate-400' : ''
                    }`}
                    style={{ background: c.value }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>

            {/* Sample prompt */}
            <label className="block mb-6">
              <span className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Sample prompt</span>
              <textarea
                value={modal.sample}
                onChange={e => setModal(m => ({ ...m, sample: e.target.value }))}
                placeholder="e.g. Summarize this month's top performers"
                rows={2}
                className="mt-1.5 w-full px-3 py-2 rounded-lg border border-slate-200 text-[14px] text-slate-900 placeholder:text-slate-400 outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 resize-none"
              />
            </label>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2">
              <Button kind="ghost" size="sm" onClick={closeModal}>Cancel</Button>
              <Button kind="primary" size="sm" icon={IconCheck} onClick={saveModal}>
                {modal.editingId ? 'Save Changes' : 'Create Template'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
