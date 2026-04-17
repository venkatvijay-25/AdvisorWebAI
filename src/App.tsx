import { useState, useEffect, useCallback } from 'react';
import { Sidebar, TopBar, CommandPalette } from '@/components/layout';
import { ErrorBoundary } from '@/components/ui';
import HomeView from '@/views/HomeView';
import MeetingsView from '@/views/MeetingsView';
import { PulseView } from '@/views/PulseView';
import { AskBookView } from '@/views/AskBookView';
import { OnboardingView, PlaybooksView, CollaborationView, ExplainView } from '@/views/stubs';
import { ClientsView } from '@/views/ClientsView';
import { HistoryView } from '@/views/HistoryView';
import { LibraryView } from '@/views/LibraryView';
import { InsightsView } from '@/views/InsightsView';
import ResultView from '@/views/ResultView';
import type { TurnData } from '@/views/ResultView';
import MorningBriefingView from '@/views/MorningBriefingView';
import ClientHubView from '@/views/ClientHubView';
import { ComplianceView } from '@/views/ComplianceView';
import { BatchActionsView } from '@/views/BatchActionsView';
import { CampaignsView } from '@/views/CampaignsView';
import { ModelPortfolioView } from '@/views/ModelPortfolioView';
import { AutoPilotView } from '@/views/AutoPilotView';
import { CLIENTS } from '@/data/clients';
import { TEMPLATES, HISTORY_ITEMS } from '@/data/templates';
import { resolveFollowUp } from '@/data/intents';
import type { Client, HistoryItem, Template } from '@/types';

type ViewId =
  | 'home' | 'meetings' | 'pulse' | 'askbook'
  | 'clients' | 'library' | 'insights' | 'history' | 'result'
  | 'compliance' | 'onboarding' | 'playbooks' | 'collab' | 'explain'
  | 'briefing' | 'clienthub' | 'batch' | 'campaigns' | 'models' | 'autopilot';

// Placeholder stubs for views not yet migrated
const PlaceholderView = ({ title }: { title: string }) => (
  <div className="max-w-3xl mx-auto px-8 py-10 text-center">
    <div className="text-4xl mb-4">🚧</div>
    <h1 className="text-2xl font-bold text-slate-900 mb-2">{title}</h1>
    <p className="text-slate-500 text-sm">This view will be migrated from the prototype in the next iteration.</p>
  </div>
);

function App() {
  const [view, setView] = useState<ViewId>('home');
  const [prompt, setPrompt] = useState('');
  const [recents, setRecents] = useState<HistoryItem[]>(HISTORY_ITEMS);
  const [currentChatId, setChatId] = useState<string | null>(null);
  const [paletteOpen, setPalette] = useState(false);

  // ResultView state
  const [turns, setTurns] = useState<TurnData[]>([]);
  const [activeTemplate, setActiveTemplate] = useState<Template>(TEMPLATES[0]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  // ClientHub state
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const openClientHub = useCallback((clientId: string) => {
    setSelectedClientId(clientId);
    setView('clienthub');
  }, []);

  const openTemplate = useCallback((templateId: string, client?: Client | null, titleOverride?: string) => {
    const tpl = TEMPLATES.find(t => t.id === templateId);
    if (!tpl) return;
    let c = client ?? null;
    if (!c && (templateId === 'review' || templateId === 'rebalance')) c = CLIENTS[0];
    const newId = 'h' + Date.now();
    setRecents(prev => [{
      id: newId,
      when: 'Just now',
      title: titleOverride || tpl.sample,
      template: tpl.id,
      client: c?.name || null,
    }, ...prev]);
    setChatId(newId);
    setActiveTemplate(tpl);
    setActiveClient(c);
    // Build initial turn sequence: user message + AI initial response
    setTurns([
      { id: 'u0', kind: 'user', text: titleOverride || tpl.sample },
      { id: 'a0', kind: 'ai-initial' },
    ]);
    setView('result');
  }, []);

  const openTemplateFromPrompt = useCallback((text: string) => {
    const lc = text.toLowerCase();
    let tplId = 'review';
    if (lc.includes('rebalance')) tplId = 'rebalance';
    else if (lc.includes('risk') || lc.includes('stress')) tplId = 'risk';
    else if (lc.includes('news') || lc.includes('moving') || lc.includes('today')) tplId = 'news';
    else if (lc.includes('tax') || lc.includes('harvest')) tplId = 'tax';
    else if (lc.includes('proposal') || lc.includes('ips') || lc.includes('prospect')) tplId = 'proposal';
    openTemplate(tplId, null, text);
  }, [openTemplate]);

  const openHistory = useCallback((h: HistoryItem) => {
    setChatId(h.id);
    const tpl = TEMPLATES.find(t => t.id === h.template) || TEMPLATES[0];
    const c = h.client ? CLIENTS.find(cl => cl.name === h.client) || null : null;
    setActiveTemplate(tpl);
    setActiveClient(c);
    setTurns([
      { id: 'u0', kind: 'user', text: h.title },
      { id: 'a0', kind: 'ai-initial' },
    ]);
    setView('result');
  }, []);

  const handleFollowUp = useCallback((text: string) => {
    const intent = resolveFollowUp(text);
    setTurns(prev => [
      ...prev,
      { id: 'u' + Date.now(), kind: 'user', text },
      { id: 'a' + Date.now(), kind: 'ai-followup', intent },
    ]);
  }, []);

  const handleRegenerate = useCallback(() => {
    setTurns([
      { id: 'u0', kind: 'user', text: activeTemplate.sample },
      { id: 'a0-regen', kind: 'ai-initial' },
    ]);
  }, [activeTemplate]);

  const newConversation = useCallback(() => {
    setView('home');
    setChatId(null);
    setPrompt('');
    setTurns([]);
  }, []);

  // ⌘K keyboard shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setPalette(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handlePalettePick = useCallback((r: { kind: string; client?: Client; template?: typeof TEMPLATES[0]; history?: HistoryItem; holding?: { tk: string } }) => {
    if (r.kind === 'client' && r.client) openTemplate('review', r.client, `Review ${r.client.name}`);
    if (r.kind === 'template' && r.template) openTemplate(r.template.id);
    if (r.kind === 'history' && r.history) openHistory(r.history);
    if (r.kind === 'holding' && r.holding) openTemplate('risk', null, `Exposure to ${r.holding.tk}`);
  }, [openTemplate, openHistory]);

  const renderView = () => {
    switch (view) {
      case 'home':
        return <HomeView openTemplate={openTemplate} setPrompt={setPrompt} prompt={prompt} recents={recents} openHistory={openHistory} openTemplateFromPrompt={openTemplateFromPrompt} setView={setView} />;
      case 'meetings':
        return <MeetingsView />;
      case 'pulse':
        return <PulseView />;
      case 'askbook':
        return <AskBookView />;
      case 'clients':
        return <ClientsView openTemplate={openTemplate} openClientHub={openClientHub} />;
      case 'library':
        return <LibraryView openTemplate={openTemplate} />;
      case 'insights':
        return <InsightsView />;
      case 'history':
        return <HistoryView recents={recents} openHistory={openHistory} />;
      case 'result':
        return <ResultView turns={turns} template={activeTemplate} client={activeClient} onFollowUp={handleFollowUp} onRegenerate={handleRegenerate} />;
      case 'briefing':
        return <MorningBriefingView openTemplate={openTemplate} />;
      case 'clienthub':
        return <ClientHubView clientId={selectedClientId || 'sc'} onBack={() => setView('clients')} openTemplate={openTemplate} />;
      case 'batch':
        return <BatchActionsView openTemplate={openTemplate} />;
      case 'campaigns':
        return <CampaignsView />;
      case 'models':
        return <ModelPortfolioView />;
      case 'autopilot':
        return <AutoPilotView />;
      case 'compliance':
        return <ComplianceView />;
      case 'onboarding':
        return <OnboardingView />;
      case 'playbooks':
        return <PlaybooksView />;
      case 'collab':
        return <CollaborationView />;
      case 'explain':
        return <ExplainView />;
      default:
        return <PlaceholderView title="Unknown View" />;
    }
  };

  return (
    <div className="flex h-full bg-slate-50">
      <CommandPalette open={paletteOpen} onClose={() => setPalette(false)} onPick={handlePalettePick} />
      <Sidebar
        view={view}
        setView={(v: string) => { setView(v as ViewId); setChatId(null); }}
        openTemplate={openTemplate}
        recents={recents}
        currentChatId={currentChatId}
        onNewChat={newConversation}
        onOpenPalette={() => setPalette(true)}
      />
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar onOpenPalette={() => setPalette(true)} />
        <div className="flex-1 overflow-hidden bg-slate-50 flex">
          <ErrorBoundary key={view}>
            <div className="flex-1 overflow-y-auto scroll-thin">
              {renderView()}
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

export default App;
