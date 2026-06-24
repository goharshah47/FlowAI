import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  Clock, 
  Users, 
  CheckCircle,
  HelpCircle,
  BarChart,
  LineChart,
  ChevronDown
} from 'lucide-react';
import { AIInsight, TeamMember } from '../types';

interface InsightsCenterProps {
  insights: AIInsight[];
  team: TeamMember[];
}

export default function InsightsCenter({ insights, team }: InsightsCenterProps) {
  
  const [activeCategory, setActiveCategory] = useState<'all' | 'risk' | 'workload' | 'deadline'>('all');

  const filteredInsights = activeCategory === 'all' 
    ? insights 
    : insights.filter(ins => ins.type === activeCategory);

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600">
          <Sparkles className="h-4 w-4 text-sky-500" />
          <span>FlowAI Deep Predictive Analytics</span>
        </div>
        <h1 className="mt-1 font-sans text-xl font-bold text-slate-900 sm:text-2xl">
          AI Insights & Risk Center
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Calculates team capacities and deadline bottlenecks using repository metrics and historical speeds.
        </p>
      </div>

      {/* Metrics Cards Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Sprint Health</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">82%</p>
          <p className="mt-1 text-[10px] text-red-500 font-medium leading-relaxed flex gap-1">
            <ShieldAlert className="h-3 w-3 shrink-0 mt-0.5" />
            <span>3 blockers are increasing sprint risk</span>
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team Utilization</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">90%</p>
          <p className="mt-1 text-[10px] text-amber-600 font-medium leading-relaxed">
            Frontend team capacity is 90% utilized
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Avg. PR Review Time</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">1.8 Days</p>
          <p className="mt-1 text-[10px] text-slate-500 font-medium">
            Review latency increased by 14%
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Release Probability</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">91.4%</p>
          <p className="mt-1 text-[10px] text-emerald-600 font-medium">
            Sufficient buffer for late QA stages
          </p>
        </div>

      </div>

      {/* Twin charts: Workload capacity & Code trend line */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Capacity utilization pure SVG bar graph */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Resource Utilization index</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Identifies who has bandwidth and who requires immediate tasks offloaded.</p>
          </div>

          {/* SVG capacity bars layout */}
          <div className="space-y-4 pt-2">
            {team.map((member) => (
              <div key={member.id} className="grid grid-cols-12 gap-3 items-center text-xs">
                <span className="col-span-3 font-semibold text-slate-700 truncate">{member.name}</span>
                <div className="col-span-7 h-3 bg-slate-100 rounded-full overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      member.workload > 90 
                        ? 'bg-red-500' 
                        : member.workload > 70 
                          ? 'bg-amber-500' 
                          : 'bg-sky-500'
                    }`}
                    style={{ width: `${member.workload}%` }} 
                  />
                </div>
                <span className={`col-span-2 font-mono font-bold text-right ${
                  member.workload > 90 ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {member.workload}%
                </span>
              </div>
            ))}
          </div>
          
          <div className="text-[10px] text-slate-400 leading-normal border-t border-slate-100 pt-3">
            ● Available (&lt;50%) &nbsp; ● Balanced (50-80%) &nbsp; ● Overloaded (&gt;80%)
          </div>
        </div>

        {/* Code Commit/Productivity trends line graph */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Commit Frequency Trends</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Weekly commits checked into repository branches.</p>
            </div>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </div>

          {/* Productivity trend line */}
          <div className="relative h-44 w-full">
            <svg className="h-full w-full" viewBox="0 0 100 50" preserveAspectRatio="none">
              {/* Guidelines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="#f8fafc" strokeWidth="0.8" />
              <line x1="0" y1="25" x2="100" y2="25" stroke="#f1f5f9" strokeWidth="0.8" />
              <line x1="0" y1="40" x2="100" y2="40" stroke="#f1f5f9" strokeWidth="0.8" />
              
              {/* Trend path */}
              <path 
                d="M 5 45 Q 20 25 35 30 T 65 15 T 80 18 T 95 10" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
              />
              
              {/* Dot markers */}
              <circle cx="5" cy="45" r="1" fill="#6366f1" />
              <circle cx="35" cy="30" r="1" fill="#6366f1" />
              <circle cx="65" cy="15" r="1.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="0.5" />
              <circle cx="95" cy="10" r="1.5" fill="#4f46e5" stroke="#ffffff" strokeWidth="0.5" />
            </svg>
            
            {/* Legend indicators */}
            <div className="absolute left-2 top-0 text-[8px] font-mono text-slate-400">Peak commits</div>
            <div className="absolute right-2 top-2 text-[9px] font-semibold text-indigo-600 bg-indigo-50 px-1 rounded">Velocity: high</div>
          </div>

          <div className="flex items-center justify-between text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-3">
            <span>Week 1</span>
            <span>Week 2</span>
            <span>Week 3</span>
            <span>Week 4 (Active)</span>
          </div>
        </div>

      </div>

      {/* Categories Filter + Deep AI Insights stream */}
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Warning Signals</h3>
          
          {/* Quick tab switcher */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-lg bg-slate-100 p-1">
            {(['all', 'risk', 'workload', 'deadline'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`rounded px-2.5 py-1 text-[10px] font-bold uppercase transition ${
                  activeCategory === cat 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Render warnings stream list */}
        <div className="grid gap-4 sm:grid-cols-2">
          {filteredInsights.map((insight) => (
            <div key={insight.id} className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                  insight.type === 'risk' 
                    ? 'bg-red-50 text-red-700' 
                    : insight.type === 'workload'
                      ? 'bg-amber-50 text-amber-700'
                      : 'bg-sky-50 text-sky-700'
                }`}>
                  {insight.type.toUpperCase()}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Confidence: {insight.confidence}%</span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800">{insight.title}</h4>
                <p className="mt-1 text-[11px] text-slate-500 leading-normal">{insight.description}</p>
              </div>

              {insight.reason && (
                <div className="rounded bg-slate-50 p-2 text-[10px] font-mono text-slate-500 leading-relaxed border border-slate-100">
                  <strong>Trigger:</strong> {insight.reason}
                </div>
              )}

              <div className="border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Resolution priority:</span>
                <span className={`font-bold ${insight.impactLevel === 'high' ? 'text-red-600' : 'text-amber-600'}`}>
                  {insight.impactLevel.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
