import React, { useState } from 'react';
import { 
  initialTasks, 
  initialTeamMembers, 
  initialProject, 
  initialAIInsights, 
  initialIntegrations, 
  initialCopilotMessages 
} from './data/mockData';
import { Task, TeamMember, AIInsight, Integration, CopilotMessage } from './types';
import Header from './components/Header';
import Sidebar from './components/Sidebar';

// Screens
import DashboardScreen from './screens/DashboardScreen';
import CopilotWorkspace from './screens/CopilotWorkspace';
import ProjectOverviewScreen from './screens/ProjectOverviewScreen';
import TaskBoardScreen from './screens/TaskBoardScreen';
import InsightsCenter from './screens/InsightsCenter';
import ReportGenerator from './screens/ReportGenerator';
import TeamScreen from './screens/TeamScreen';
import IntegrationsScreen from './screens/IntegrationsScreen';
import SettingsScreen from './screens/SettingsScreen';

// Extra mobile navigation imports
import { Sparkles, Menu, X, RefreshCw, Monitor, Tablet, Smartphone, Compass } from 'lucide-react';
import MobileLayout from './screens/MobileLayout';

export default function App() {
  
  // App navigation state
  const [activeScreen, setActiveScreen] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  // Global persistent states
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>(initialTeamMembers);
  const [project, setProject] = useState(initialProject);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>(initialAIInsights);
  const [integrations, setIntegrations] = useState<Integration[]>(initialIntegrations);
  const [copilotMessages, setCopilotMessages] = useState<CopilotMessage[]>(initialCopilotMessages);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Quick sync animation trigger
  const triggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      
      // Update a small stat on sync to showcase dynamic UI updates
      setProject(prev => ({
        ...prev,
        healthScore: Math.min(prev.healthScore + 1, 95),
        timelineStatus: 'On Track (Synced Live)'
      }));
    }, 1500);
  };

  // Reallocate task action (lowers sender workload, increases receiver workload)
  const handleReallocateTask = (fromId: string, toId: string) => {
    setTasks(prevTasks => {
      return prevTasks.map(t => {
        if (t.ownerId === fromId && t.priority === 'low') {
          return { ...t, ownerId: toId };
        }
        return t;
      });
    });

    setAiInsights(prevInsights => {
      // Mark resource workloads insight as resolved
      return prevInsights.map(ins => {
        if (ins.type === 'workload') {
          return { ...ins, status: 'resolved' as const };
        }
        return ins;
      });
    });
  };

  // Handle approving human-in-the-loop actions
  const handleActionApprove = (actionDesc: string) => {
    // Check what action was approved and execute accordingly
    if (actionDesc.toLowerCase().includes('reallocate') || actionDesc.toLowerCase().includes('dave')) {
      handleReallocateTask('john', 'dave');
      setTeamMembers(prev => prev.map(m => {
        if (m.id === 'john') return { ...m, workload: 78, tasksCount: Math.max(m.tasksCount - 1, 0), status: 'active' };
        if (m.id === 'dave') return { ...m, workload: 48, tasksCount: m.tasksCount + 1 };
        return m;
      }));
    } else if (actionDesc.toLowerCase().includes('qa') || actionDesc.toLowerCase().includes('shift')) {
      setAiInsights(prev => prev.map(ins => {
        if (ins.id === 'ins-2') return { ...ins, status: 'resolved' };
        return ins;
      }));
    }
  };

  // Dismissing an insight from dashboard or center
  const handleDismissInsight = (id: string) => {
    setAiInsights(prev => prev.map(ins => ins.id === id ? { ...ins, status: 'dismissed' } : ins));
  };

  // Resolving an insight
  const handleResolveInsight = (id: string) => {
    setAiInsights(prev => prev.map(ins => ins.id === id ? { ...ins, status: 'resolved' } : ins));
  };

  // Toggling integrations
  const handleToggleIntegration = (id: string) => {
    setIntegrations(prev => prev.map(app => {
      if (app.id === id) {
        const nextConnected = !app.connected;
        return { 
          ...app, 
          connected: nextConnected,
          syncStatus: nextConnected ? 'Synced just now' : undefined,
          dataPointsImported: nextConnected ? 250 : undefined
        };
      }
      return app;
    }));
  };

  // Handling copilot user questions
  const handleSendMessage = (text: string) => {
    // If text is JSON, it is an AI response payload
    if (text.startsWith('{')) {
      try {
        const parsedAI = JSON.parse(text);
        const nextMsg: CopilotMessage = {
          id: `m-ai-${Date.now()}`,
          sender: 'ai',
          text: parsedAI.text,
          timestamp: 'Just now',
          confidence: parsedAI.confidence,
          reasoning: parsedAI.reasoning,
          suggestedActions: parsedAI.suggestedActions
        };
        setCopilotMessages(prev => [...prev, nextMsg]);
        return;
      } catch(e) {}
    }

    // Standard user message
    const userMsg: CopilotMessage = {
      id: `m-usr-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now'
    };
    setCopilotMessages(prev => [...prev, userMsg]);
  };

  // Screen selection mapping
  const renderActiveScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return (
          <DashboardScreen 
            project={project}
            insights={aiInsights}
            tasks={tasks}
            team={teamMembers}
            onNavigate={(screen) => { setActiveScreen(screen); }}
            onDismissInsight={handleDismissInsight}
            onResolveInsight={handleResolveInsight}
            onSelectTask={(task) => { setSelectedTask(task); setActiveScreen('tasks'); }}
          />
        );
      case 'copilot-chat':
        return (
          <CopilotWorkspace 
            messages={copilotMessages}
            onSendMessage={handleSendMessage}
            tasks={tasks}
            team={teamMembers}
            onActionApprove={handleActionApprove}
          />
        );
      case 'project-overview':
        return (
          <ProjectOverviewScreen 
            project={project}
            tasks={tasks}
            team={teamMembers}
            onNavigate={(screen) => { setActiveScreen(screen); }}
          />
        );
      case 'tasks':
        return (
          <TaskBoardScreen 
            tasks={tasks}
            team={teamMembers}
            onUpdateTasks={setTasks}
            onSelectTask={setSelectedTask}
            selectedTask={selectedTask}
          />
        );
      case 'insights':
        return (
          <InsightsCenter 
            insights={aiInsights}
            team={teamMembers}
          />
        );
      case 'reports':
        return <ReportGenerator />;
      case 'team':
        return (
          <TeamScreen 
            team={teamMembers}
            tasks={tasks}
            onReallocateTask={handleReallocateTask}
            onUpdateTeam={setTeamMembers}
          />
        );
      case 'integrations':
        return (
          <IntegrationsScreen 
            integrations={integrations}
            onToggleIntegration={handleToggleIntegration}
          />
        );
      case 'settings':
        return <SettingsScreen />;
      default:
        return <div className="text-center py-10 font-mono text-xs">Page Not Found</div>;
    }
  };

  // Pending insights to highlight in the sidebar warning badge
  const pendingInsightsCount = aiInsights.filter(ins => ins.status === 'pending').length;

  return (
    <div className="flex min-h-screen flex-col bg-slate-50/50 text-slate-800">
      
      {/* Top Toolbar: Premium Device Preview Switcher */}
      <div className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-900 px-6 py-2.5 text-white shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500 shadow-inner">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans font-bold text-xs uppercase tracking-wider text-white">FlowAI Design Studio</span>
              <span className="rounded-full bg-sky-500/20 px-1.5 py-0.2 text-[8px] font-bold text-sky-400">v2.5</span>
            </div>
            <p className="text-[10px] text-slate-400">Verify responsive layouts & client-side AI components</p>
          </div>
        </div>

        {/* Viewport Switcher Toggles */}
        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700/80">
          {[
            { id: 'desktop', label: 'Desktop View', icon: Monitor },
            { id: 'tablet', label: 'Tablet View', icon: Tablet },
            { id: 'mobile', label: 'Mobile App', icon: Smartphone }
          ].map((mode) => {
            const Icon = mode.icon;
            const isSelected = deviceMode === mode.id;
            return (
              <button
                key={mode.id}
                onClick={() => setDeviceMode(mode.id as any)}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[11px] font-bold tracking-tight transition ${
                  isSelected 
                    ? 'bg-sky-500 text-white shadow-sm' 
                    : 'text-slate-300 hover:bg-slate-700/50 hover:text-white'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{mode.label}</span>
              </button>
            );
          })}
        </div>

        {/* Dynamic Resolution details */}
        <div className="hidden items-center gap-4 text-[10px] font-mono text-slate-400 sm:flex">
          <div className="flex flex-col text-right">
            <span>Viewport: <strong className="text-white">{deviceMode === 'desktop' ? '1440 × 900' : deviceMode === 'tablet' ? '1024 × 768' : '350 × 680'}</strong></span>
            <span>Target: <strong className="text-white">{deviceMode === 'mobile' ? 'Native Mobile App' : 'Web SaaS Container'}</strong></span>
          </div>
        </div>
      </div>

      {/* RENDER THE LAYOUT ACCORDING TO DEVICEMODE */}
      {deviceMode === 'mobile' ? (
        <div className="flex flex-1 items-center justify-center bg-slate-100 p-4 min-h-[calc(100vh-3.5rem)]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
          <div className="flex flex-col items-center space-y-3">
            <MobileLayout 
              tasks={tasks}
              team={teamMembers}
              insights={aiInsights}
              project={project}
              messages={copilotMessages}
              onSendMessage={handleSendMessage}
              onActionApprove={handleActionApprove}
            />
            <div className="text-center">
              <span className="rounded bg-sky-100 px-2.5 py-0.5 text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                Active Mobile Preview
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Fully interactive iOS/Android Touch App simulation</p>
            </div>
          </div>
        </div>
      ) : deviceMode === 'tablet' ? (
        <div className="flex flex-1 items-center justify-center bg-slate-100 p-6 min-h-[calc(100vh-3.5rem)]" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '16px 16px' }}>
          <div className="w-full max-w-4xl rounded-[32px] border-[10px] border-slate-900 bg-white shadow-2xl overflow-hidden flex flex-col h-[720px] ring-4 ring-slate-300">
            {/* Tablet view header */}
            <Header 
              onNavigate={(screen) => { setActiveScreen(screen); }} 
              activeScreen={activeScreen} 
            />
            
            <div className="flex flex-1 overflow-hidden">
              <Sidebar 
                activeScreen={activeScreen}
                onNavigate={(screen) => { setActiveScreen(screen); }}
                pendingInsightsCount={pendingInsightsCount}
                onSyncTrigger={triggerSync}
                isSyncing={isSyncing}
              />
              <main className="flex-1 overflow-y-auto px-4 py-5 bg-slate-50/50">
                {isSyncing ? (
                  <div className="flex h-64 flex-col items-center justify-center text-slate-400 space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
                    <p className="text-xs font-medium text-slate-500">Connecting to repositories and updating metrics...</p>
                  </div>
                ) : (
                  <div>{renderActiveScreen()}</div>
                )}
              </main>
            </div>
          </div>
        </div>
      ) : (
        /* Native Full Desktop Experience */
        <>
          <Header 
            onNavigate={(screen) => { setActiveScreen(screen); setIsMobileMenuOpen(false); }} 
            activeScreen={activeScreen} 
          />

          {/* Mobile/Tablet fallback toggle inside Desktop View */}
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-2 lg:hidden">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase">Screen:</span>
              <span className="rounded bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-700 capitalize">
                {activeScreen.replace('-', ' ')}
              </span>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded p-1.5 hover:bg-slate-100 text-slate-600 transition"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {isMobileMenuOpen && (
            <div className="bg-white border-b border-slate-200 p-3 space-y-1 lg:hidden">
              {[
                { id: 'dashboard', label: 'AI Dashboard' },
                { id: 'project-overview', label: 'Project Status' },
                { id: 'tasks', label: 'Smart Tasks' },
                { id: 'insights', label: 'Insights Center' },
                { id: 'reports', label: 'AI Report Gen' },
                { id: 'team', label: 'Team Workloads' },
                { id: 'integrations', label: 'Integrations' },
                { id: 'settings', label: 'Settings & Trust' },
                { id: 'copilot-chat', label: 'Copilot Assistant' }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveScreen(item.id); setIsMobileMenuOpen(false); }}
                  className={`w-full rounded-lg px-3.5 py-2 text-left text-xs font-medium transition ${
                    activeScreen === item.id ? 'bg-sky-50 text-sky-700 font-bold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="flex flex-1 overflow-hidden">
            <Sidebar 
              activeScreen={activeScreen}
              onNavigate={(screen) => { setActiveScreen(screen); }}
              pendingInsightsCount={pendingInsightsCount}
              onSyncTrigger={triggerSync}
              isSyncing={isSyncing}
            />

            <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 bg-slate-50/50">
              {isSyncing ? (
                <div className="flex h-64 flex-col items-center justify-center text-slate-400 space-y-3">
                  <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
                  <p className="text-xs font-medium text-slate-500">Connecting to repositories and updating metrics...</p>
                </div>
              ) : (
                <div className="mx-auto max-w-7xl">
                  {renderActiveScreen()}
                </div>
              )}
            </main>
          </div>
        </>
      )}

    </div>
  );
}
