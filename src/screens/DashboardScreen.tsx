import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  CheckSquare, 
  Clock, 
  TrendingUp, 
  UserCheck, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  Users
} from 'lucide-react';
import { Project, AIInsight, Task, TeamMember } from '../types';

interface DashboardScreenProps {
  project: Project;
  insights: AIInsight[];
  tasks: Task[];
  team: TeamMember[];
  onNavigate: (screen: string) => void;
  onResolveInsight: (id: string) => void;
  onDismissInsight: (id: string) => void;
  onSelectTask: (task: Task) => void;
}

export default function DashboardScreen({
  project,
  insights,
  tasks,
  team,
  onNavigate,
  onResolveInsight,
  onDismissInsight,
  onSelectTask,
}: DashboardScreenProps) {
  
  const [localFeedback, setLocalFeedback] = useState<string | null>(null);

  // Derive counts
  const pendingInsights = insights.filter(ins => ins.status === 'pending');
  const activeRisks = pendingInsights.filter(ins => ins.type === 'risk');
  const activeRecs = pendingInsights.filter(ins => ins.type === 'recommendation');
  
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;
  const backlogTasks = tasks.filter(t => t.status === 'backlog').length;

  const percentComplete = Math.round((completedTasks / totalTasks) * 100);

  // Handle local simulation of quick reallocate
  const handleQuickAssign = (insightId: string, actionDesc: string) => {
    onResolveInsight(insightId);
    setLocalFeedback(`AI Action approved! "${actionDesc}"`);
    setTimeout(() => setLocalFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Simulation success feedback toast */}
      {localFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800">
          <Sparkles className="h-4 w-4 text-sky-400 animate-pulse" />
          <span>{localFeedback}</span>
        </div>
      )}

      {/* Hero Welcome Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-sky-50 px-2.5 py-0.5 text-xs font-semibold text-sky-600 border border-sky-100">
              Active Project
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: PM-LAUNCH-2026</span>
          </div>
          <h1 className="mt-1 font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            {project.name}
          </h1>
          <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-xl">
            {project.description}
          </p>
        </div>

        {/* Quick stat chips */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('copilot-chat')}
            className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition active:scale-95 shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-sky-500" />
            Launch AI Assistant
          </button>
          <button 
            onClick={() => onNavigate('reports')}
            className="flex items-center gap-1.5 rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition active:scale-95 shadow-sm"
          >
            Generate Update
          </button>
        </div>
      </div>

      {/* Grid of Health Indicators & Status Metrics */}
      <div className="grid gap-5 md:grid-cols-3">
        
        {/* Project Health Score Card */}
        <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Project Health</span>
            <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
              STABLE
            </span>
          </div>
          
          <div className="mt-4 flex items-center gap-4">
            {/* Health Score Gauge (Pure Custom SVG) */}
            <div className="relative h-20 w-20 shrink-0">
              <svg className="h-full w-full" viewBox="0 0 36 36">
                <path
                  className="text-slate-100"
                  strokeWidth="3"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-sky-500 transition-all duration-1000"
                  strokeDasharray={`${project.healthScore}, 100`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-slate-800">{project.healthScore}%</span>
                <span className="text-[8px] font-medium text-slate-400 uppercase">Healthy</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-xs font-semibold text-slate-700">Timeline: {project.timelineStatus}</p>
              <p className="text-[11px] text-slate-500 leading-normal">{project.teamActivity}</p>
              <p className="text-[10px] text-slate-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-sky-500 shrink-0" />
                AI confidence rating: {project.aiConfidenceScore}%
              </p>
            </div>
          </div>
        </div>

        {/* Task Progress Distribution Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Sprint Progress</span>
            <span className="text-xs font-semibold text-slate-700">{percentComplete}% Complete</span>
          </div>
          
          <div className="mt-4 space-y-3">
            {/* Beautiful Progress Bar Stack */}
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 flex">
              <div className="h-full bg-sky-500" style={{ width: `${(completedTasks/totalTasks)*100}%` }} title="Completed" />
              <div className="h-full bg-indigo-400" style={{ width: `${(inProgressTasks/totalTasks)*100}%` }} title="In Progress" />
              <div className="h-full bg-amber-400" style={{ width: `${(reviewTasks/totalTasks)*100}%` }} title="In Review" />
            </div>

            {/* Legend grids */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-sky-500 shrink-0"></span>
                <span>Completed: <strong>{completedTasks}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-indigo-400 shrink-0"></span>
                <span>Active Work: <strong>{inProgressTasks}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0"></span>
                <span>In Review: <strong>{reviewTasks}</strong></span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-600">
                <span className="h-2 w-2 rounded-full bg-slate-300 shrink-0"></span>
                <span>Backlog: <strong>{backlogTasks}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Analytics Brief Card */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">AI Active Watch</span>
              <Sparkles className="h-4 w-4 text-sky-500" />
            </div>
            
            <div className="mt-2.5 space-y-1">
              <p className="text-sm font-semibold text-slate-800">
                {activeRisks.length} critical risks & {activeRecs.length} suggestions
              </p>
              <p className="text-xs text-slate-500 leading-normal">
                Continuous analysis of sprint velocity, Github commits, and capacity indexes.
              </p>
            </div>
          </div>

          <button 
            onClick={() => onNavigate('insights')}
            className="mt-3 flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:text-sky-700 transition self-start"
          >
            Open Analytics Center
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* Main Grid: Today's AI Brief & SVG Charts */}
      <div className="grid gap-6 lg:grid-cols-5">
        
        {/* Today's AI Brief Section (3 columns) */}
        <div className="space-y-4 lg:col-span-3">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-sans text-base font-bold text-slate-900">
              <Sparkles className="h-4 w-4 text-sky-500" />
              Today's AI Brief
            </h2>
            <span className="text-[11px] text-slate-400 font-medium">Updated live</span>
          </div>

          {/* AI Suggestion/Risk alert listing */}
          <div className="space-y-4">
            {pendingInsights.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
                <p className="mt-2 text-xs font-semibold text-slate-800">All Systems Golden</p>
                <p className="mt-1 text-[11px] text-slate-500">FlowAI has cleared all risks and warnings.</p>
              </div>
            ) : (
              pendingInsights.slice(0, 2).map((insight) => (
                <div 
                  key={insight.id} 
                  className={`rounded-xl border bg-white p-4.5 shadow-sm transition-all hover:shadow-md ${
                    insight.impactLevel === 'high' 
                      ? 'border-l-4 border-l-red-500 border-slate-200' 
                      : 'border-l-4 border-l-sky-500 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {insight.type === 'risk' ? (
                          <span className="flex items-center gap-1 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold text-red-700">
                            <ShieldAlert className="h-3 w-3" />
                            RISK DETECTED
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 rounded bg-sky-50 px-1.5 py-0.5 text-[10px] font-bold text-sky-700">
                            <Sparkles className="h-3 w-3" />
                            RECOMMENDATION
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-medium">
                          Confidence: <strong>{insight.confidence}%</strong>
                        </span>
                      </div>
                      
                      <h3 className="font-sans text-sm font-semibold text-slate-900">{insight.title}</h3>
                      <p className="text-xs text-slate-600 leading-normal">{insight.description}</p>
                      
                      {insight.reason && (
                        <div className="mt-2 rounded bg-slate-50 p-2 text-[11px] font-mono text-slate-500 leading-relaxed border border-slate-100">
                          <strong>Reason:</strong> {insight.reason}
                        </div>
                      )}
                    </div>

                    <span className="text-[11px] font-bold shrink-0 text-slate-400">
                      Impact: <span className={insight.impactLevel === 'high' ? 'text-red-500' : 'text-amber-500'}>{insight.impactLevel.toUpperCase()}</span>
                    </span>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
                    <p className="text-[11px] text-slate-400 italic">
                      Recommended: {insight.suggestedAction || 'Review active parameters.'}
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => onDismissInsight(insight.id)}
                        className="rounded px-2.5 py-1 text-xs font-medium text-slate-500 hover:bg-slate-100 transition"
                      >
                        Ignore
                      </button>
                      <button 
                        onClick={() => onNavigate('insights')}
                        className="rounded px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 border border-slate-200 transition"
                      >
                        Review
                      </button>
                      {insight.suggestedAction && (
                        <button 
                          onClick={() => handleQuickAssign(insight.id, insight.suggestedAction!)}
                          className="rounded bg-sky-500 px-3 py-1 text-xs font-semibold text-white hover:bg-sky-600 transition shadow-sm"
                        >
                          Approve Action
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Quick task activities shortcut */}
          <div className="rounded-xl border border-slate-200/80 bg-white p-4.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Task Performance Benchmarks</h3>
              <button onClick={() => onNavigate('tasks')} className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-0.5">
                Go to Kanban Board <ChevronRight className="h-3 w-3" />
              </button>
            </div>
            <div className="space-y-3">
              {tasks.slice(0, 3).map(task => {
                const owner = team.find(m => m.id === task.ownerId);
                return (
                  <div key={task.id} className="flex items-center justify-between text-xs hover:bg-slate-50/50 p-1.5 rounded transition">
                    <div className="flex items-center gap-2">
                      <div className="flex h-5 w-5 items-center justify-center rounded bg-slate-100 font-bold text-[9px] text-slate-500">
                        {task.id.toUpperCase()}
                      </div>
                      <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px]">{task.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] bg-sky-50 text-sky-600 font-bold px-1.5 rounded" title="AI priority impact score">
                        Impact: {task.aiImpactScore}%
                      </span>
                      {owner && (
                        <img 
                          src={owner.avatarUrl} 
                          alt={owner.name} 
                          className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200" 
                          title={owner.name}
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Charts & Interactive Visualization (2 columns) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-sans text-base font-bold text-slate-900">Velocity & Workload Trends</h2>
            <span className="text-[11px] text-slate-400 font-medium">Sprint 4 tracking</span>
          </div>

          {/* SVG Burn-down chart */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Burn-down Progress</p>
                <p className="text-xs font-bold text-slate-800">18 / 26 tasks resolved</p>
              </div>
              <TrendingUp className="h-4 w-4 text-emerald-500" />
            </div>

            {/* Custom Interactive SVG Burn down */}
            <div className="relative h-44 w-full">
              <svg className="h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none">
                {/* Grid guidelines */}
                <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.5" />
                <line x1="0" y1="40" x2="100" y2="40" stroke="#f1f5f9" strokeWidth="0.5" />
                
                {/* Ideal burn down line */}
                <line x1="5" y1="5" x2="95" y2="45" stroke="#cbd5e1" strokeWidth="0.8" strokeDasharray="2,2" />
                
                {/* Actual burn down area gradient */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.2"/>
                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0"/>
                  </linearGradient>
                </defs>
                <path 
                  d="M 5 5 L 20 12 L 35 12 L 50 25 L 65 30 L 80 40 L 95 42 L 95 50 L 5 50 Z" 
                  fill="url(#chartGrad)" 
                />
                
                {/* Actual progress stroke */}
                <path 
                  d="M 5 5 L 20 12 L 35 12 L 50 25 L 65 30 L 80 40 L 95 42" 
                  fill="none" 
                  stroke="#0ea5e9" 
                  strokeWidth="1.5" 
                  strokeLinecap="round"
                />

                {/* Point indicators */}
                <circle cx="5" cy="5" r="1.2" fill="#0ea5e9" />
                <circle cx="50" cy="25" r="1.5" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.5" />
                <circle cx="80" cy="40" r="1.2" fill="#0ea5e9" />
                <circle cx="95" cy="42" r="1.5" fill="#10b981" stroke="#ffffff" strokeWidth="0.5" />
              </svg>

              {/* Labels on SVG */}
              <div className="absolute left-2 top-0 text-[8px] font-mono text-slate-400">Start (26)</div>
              <div className="absolute right-2 bottom-6 text-[8px] font-mono text-emerald-600 font-bold bg-emerald-50 px-1 rounded">On track</div>
              <div className="absolute left-1/2 bottom-1 -translate-x-1/2 text-[8px] font-mono text-slate-400">Day 10 (Today)</div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100 pt-2.5">
              <span>-- Ideal Linear Path</span>
              <span className="text-sky-500 font-semibold">● FlowAI Monitored Burn</span>
            </div>
          </div>

          {/* Team capacity list snapshot */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Active Team Capacity</span>
              <Users className="h-3.5 w-3.5 text-slate-400" />
            </div>

            <div className="space-y-3">
              {team.slice(0, 3).map((member) => (
                <div key={member.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <img src={member.avatarUrl} alt={member.name} className="h-5 w-5 rounded-full object-cover" />
                      <span className="font-semibold text-slate-700">{member.name}</span>
                    </div>
                    <span className={`font-mono text-[11px] font-bold ${member.status === 'overloaded' ? 'text-red-600' : 'text-slate-600'}`}>
                      {member.workload}%
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div 
                      className={`h-full rounded-full ${member.status === 'overloaded' ? 'bg-red-500' : 'bg-sky-500'}`} 
                      style={{ width: `${member.workload}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={() => onNavigate('team')}
              className="mt-4 w-full rounded-lg border border-slate-100 bg-slate-50/50 py-1.5 text-center text-xs font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-800 transition"
            >
              Reallocate Workloads
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
