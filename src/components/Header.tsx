import React, { useState } from 'react';
import { Search, Bell, Sparkles, User, HelpCircle, ChevronDown, CheckCircle2, ShieldAlert } from 'lucide-react';

interface HeaderProps {
  onNavigate: (screen: string) => void;
  activeScreen: string;
}

export default function Header({ onNavigate, activeScreen }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample alerts for notification dropdown
  const alerts = [
    {
      id: 'a1',
      title: 'High Risk Alert: Backend delay',
      desc: 'Database optimization milestone is 5 days late.',
      time: '10m ago',
      unread: true,
      type: 'risk',
    },
    {
      id: 'a2',
      title: 'AI Workload Recommendation',
      desc: 'John Doe is overloaded. Suggested reallocating 2 tasks.',
      time: '1h ago',
      unread: true,
      type: 'workload',
    },
    {
      id: 'a3',
      title: 'Report Compiled',
      desc: 'AI synthesized the executive status update.',
      time: '4h ago',
      unread: false,
      type: 'success',
    }
  ];

  const unreadCount = alerts.filter(a => a.unread).length;

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-6 backdrop-blur-md">
      {/* Brand Logo & Current View Title */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 shadow-sm">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="font-sans font-bold text-xl tracking-tight text-slate-900">
            Flow<span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">AI</span>
          </span>
          <span className="hidden rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-medium text-slate-600 sm:inline-block">
            Enterprise
          </span>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        {/* Dynamic Navigation indicator */}
        <div className="hidden items-center gap-2 sm:flex">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Workspace</span>
          <span className="text-xs text-slate-400">/</span>
          <span className="text-sm font-medium text-slate-700 capitalize">
            {activeScreen.replace('-', ' ')}
          </span>
        </div>
      </div>

      {/* Center Omnisearch Bar */}
      <div className="relative mx-4 max-w-md flex-1">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <Search className="h-4 w-4 text-slate-400" />
        </div>
        <input
          type="text"
          placeholder="Search projects, AI insights, tasks, team (Cmd + K)..."
          className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-1.5 pl-9 pr-4 text-xs font-sans text-slate-800 placeholder-slate-400 outline-none transition-all focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <div className="absolute top-11 right-0 left-0 rounded-lg border border-slate-200 bg-white p-2 shadow-lg z-50">
            <p className="text-[11px] font-medium text-slate-400 px-2 pb-1.5 border-b border-slate-100">SIMULATED SEARCH RESULTS</p>
            <div className="mt-1 space-y-1">
              <div className="flex items-center justify-between rounded p-1.5 hover:bg-slate-50 cursor-pointer text-xs" onClick={() => { onNavigate('tasks'); setSearchQuery(''); }}>
                <span className="font-medium text-slate-700">Payment API Integration</span>
                <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-500">Task</span>
              </div>
              <div className="flex items-center justify-between rounded p-1.5 hover:bg-slate-50 cursor-pointer text-xs" onClick={() => { onNavigate('insights'); setSearchQuery(''); }}>
                <span className="font-medium text-slate-700">Database bottleneck and capacity risk</span>
                <span className="text-[10px] bg-sky-50 text-sky-600 px-1.5 py-0.5 rounded">AI Insight</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right User Actions */}
      <div className="flex items-center gap-4">
        {/* Help docs */}
        <button className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition" title="Documentation">
          <HelpCircle className="h-5 w-5" />
        </button>

        {/* Notifications alert portal */}
        <div className="relative">
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
            className={`relative rounded-lg p-1.5 transition ${showNotifications ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
              </span>
            )}
          </button>

          {/* Dynamic Notifications Dropdown */}
          {showNotifications && (
            <div className="absolute right-0 mt-2.5 w-80 rounded-xl border border-slate-200 bg-white shadow-xl z-50">
              <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <h3 className="font-semibold text-slate-900 text-xs">AI Insights & Notifications</h3>
                <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-medium text-sky-600">
                  {unreadCount} Active
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {alerts.map((alert) => (
                  <div key={alert.id} className={`flex gap-3 px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-b-0 cursor-pointer ${alert.unread ? 'bg-slate-50/50' : ''}`}>
                    <div className="mt-0.5">
                      {alert.type === 'risk' ? (
                        <ShieldAlert className="h-4 w-4 text-red-500" />
                      ) : alert.type === 'workload' ? (
                        <Sparkles className="h-4 w-4 text-sky-500" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className={`text-xs ${alert.unread ? 'font-semibold text-slate-900' : 'text-slate-700'}`}>{alert.title}</p>
                        <span className="text-[10px] text-slate-400 shrink-0">{alert.time}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{alert.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 p-2.5 text-center">
                <button
                  onClick={() => { onNavigate('insights'); setShowNotifications(false); }}
                  className="w-full text-xs font-semibold text-sky-600 hover:text-sky-700 transition"
                >
                  View all AI Insights in Center
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Identity Details & Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
            className="flex items-center gap-2 rounded-lg p-1 hover:bg-slate-100 transition text-left"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-800 font-bold text-xs ring-2 ring-sky-50">
              GS
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-semibold text-slate-800">Gohar Shah</p>
              <p className="text-[10px] font-medium text-slate-400">Enterprise Admin</p>
            </div>
            <ChevronDown className="h-4 w-4 text-slate-400" />
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2.5 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl z-50">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-800">Gohar Shah</p>
                <p className="text-[10px] text-slate-500">goharshah3@gmail.com</p>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  onClick={() => { onNavigate('settings'); setShowProfileMenu(false); }}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                >
                  <Sparkles className="h-3.5 w-3.5 text-sky-500" />
                  AI Preferences
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <div className="px-3 py-1.5 text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
                  Preview Actions
                </div>
                <div className="px-3 py-1 text-xs text-slate-500 font-mono leading-tight bg-slate-50 rounded m-1">
                  Server Port: 3000<br />
                  Local System: 2026
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
