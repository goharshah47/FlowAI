import React from 'react';
import { 
  LayoutDashboard, 
  FolderGit2, 
  CheckSquare, 
  Sparkles, 
  FileBarChart2, 
  Users, 
  Layers, 
  Settings,
  ShieldAlert,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface SidebarProps {
  activeScreen: string;
  onNavigate: (screen: string) => void;
  pendingInsightsCount: number;
  onSyncTrigger: () => void;
  isSyncing: boolean;
}

export default function Sidebar({ 
  activeScreen, 
  onNavigate, 
  pendingInsightsCount, 
  onSyncTrigger, 
  isSyncing 
}: SidebarProps) {
  
  // Sidebar navigation options
  const menuItems = [
    { id: 'dashboard', label: 'AI Dashboard', icon: LayoutDashboard, badge: 0 },
    { id: 'project-overview', label: 'Project Status', icon: FolderGit2, badge: 0 },
    { id: 'tasks', label: 'Smart Tasks', icon: CheckSquare, badge: 0 },
    { id: 'insights', label: 'Insights Center', icon: Sparkles, badge: pendingInsightsCount },
    { id: 'reports', label: 'AI Report Gen', icon: FileBarChart2, badge: 0 },
    { id: 'team', label: 'Team Workloads', icon: Users, badge: 0 },
    { id: 'integrations', label: 'Integrations', icon: Layers, badge: 0 },
    { id: 'settings', label: 'Settings & Trust', icon: Settings, badge: 0 },
  ];

  return (
    <aside className="hidden h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white p-4 justify-between lg:flex">
      {/* Context Area (Project selection) */}
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span>Scope selector</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" title="Active"></span>
          </div>
          
          {/* Active Project card in sidebar */}
          <div 
            onClick={() => onNavigate('project-overview')}
            className="group flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-2.5 hover:bg-slate-50 cursor-pointer transition"
          >
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-50 text-sky-600 font-bold text-xs group-hover:scale-105 transition-transform">
                M
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-800">Mobile App Launch</p>
                <p className="text-[10px] text-slate-500 font-medium">Enterprise Track</p>
              </div>
            </div>
            <ChevronRight className="h-3.5 w-3.5 text-slate-400 transition-transform group-hover:translate-x-0.5" />
          </div>
        </div>

        {/* Menu Navigation items */}
        <nav className="space-y-1">
          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            Navigation
          </div>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`group flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition ${
                  isActive
                    ? 'bg-sky-50 text-sky-700 shadow-sm shadow-sky-100/50'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`h-4 w-4 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-sky-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`} />
                  <span className="font-sans font-medium">{item.label}</span>
                </div>
                
                {/* Insights alert badge in sidebar menu */}
                {item.badge > 0 ? (
                  <span className="flex h-5 items-center justify-center rounded-full bg-red-50 px-1.5 text-[9px] font-bold text-red-600 ring-1 ring-red-100/50">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Sync Status, Quick Prompt Action & AI Status */}
      <div className="space-y-4">
        {/* Core Live Data Sync Panel */}
        <div className="rounded-xl bg-slate-50 p-3 border border-slate-100">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-700">
            <span className="flex items-center gap-1.5">
              <RefreshCw className={`h-3 w-3 text-sky-500 ${isSyncing ? 'animate-spin' : ''}`} />
              AI Engines Online
            </span>
            <button 
              onClick={onSyncTrigger}
              disabled={isSyncing}
              className="text-[10px] text-sky-600 hover:text-sky-700 font-semibold cursor-pointer disabled:text-slate-400"
            >
              {isSyncing ? 'Syncing...' : 'Sync'}
            </button>
          </div>
          <p className="mt-1 text-[10px] text-slate-500 leading-normal">
            Feeding parameters from connected GitHub repository & Jira sprint backlogs.
          </p>
          <div className="mt-2.5 flex items-center justify-between border-t border-slate-200/50 pt-2.5">
            <span className="text-[9px] font-mono font-medium text-slate-400 uppercase">Confidence SLA</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
              94% Target
            </span>
          </div>
        </div>

        {/* Custom Quick Copilot Launch Button */}
        <button
          onClick={() => onNavigate('copilot-chat')}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 py-2.5 text-xs font-semibold text-white shadow-md shadow-sky-100 hover:opacity-95 active:scale-95 transition-all"
        >
          <Sparkles className="h-4 w-4 text-sky-200" />
          Talk to Copilot
        </button>
      </div>
    </aside>
  );
}
