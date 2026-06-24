import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  ArrowRight, 
  ChevronRight,
  PlusCircle,
  HelpCircle,
  TrendingDown
} from 'lucide-react';
import { Project, Task, TeamMember } from '../types';

interface ProjectOverviewScreenProps {
  project: Project;
  tasks: Task[];
  team: TeamMember[];
  onNavigate: (screen: string) => void;
}

export default function ProjectOverviewScreen({
  project,
  tasks,
  team,
  onNavigate,
}: ProjectOverviewScreenProps) {
  
  // Local state to simulate toggling or creating milestones
  const [milestones, setMilestones] = useState([
    { id: 'm1', name: 'Secure OAuth Integration', date: 'June 25, 2026', status: 'completed', probability: 100 },
    { id: 'm2', name: 'Payment API & Gateway Hookup', date: 'June 30, 2026', status: 'delayed-risk', probability: 28, aiWarning: 'AI detected: This milestone has a 72% chance of delay due to backend capacity.' },
    { id: 'm3', name: 'UI Polish & Transition Approval', date: 'July 10, 2026', status: 'pending', probability: 85 },
    { id: 'm4', name: 'QA Test Automations', date: 'July 25, 2026', status: 'pending', probability: 91 },
    { id: 'm5', name: 'Enterprise App Store Release', date: 'August 15, 2026', status: 'pending', probability: 94 },
  ]);

  const toggleMilestone = (id: string) => {
    setMilestones(prev => prev.map(m => {
      if (m.id === id) {
        const nextStatus = m.status === 'completed' ? 'pending' : 'completed';
        return { ...m, status: nextStatus, probability: nextStatus === 'completed' ? 100 : 85 };
      }
      return m;
    }));
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Page Title Row */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-sans text-xl font-bold text-slate-900 sm:text-2xl">Project Timeline & Scope Overview</h1>
          <p className="text-xs text-slate-500 mt-1">
            Gives managers an immediate prediction graph for Sprint 4 milestones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Launch Window: May - August 2026</span>
        </div>
      </div>

      {/* Modern Visual Timeline Roadmap (Gantt Phase representation) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">Gantt Phase Breakdown</h3>
        
        {/* Interactive Gantt visual */}
        <div className="space-y-3.5">
          {/* Timeline phase rows */}
          <div className="grid grid-cols-12 gap-2 text-xs items-center">
            <span className="col-span-3 font-semibold text-slate-700">1. Discovery & Design</span>
            <div className="col-span-9 h-6 bg-slate-100 rounded-lg overflow-hidden relative">
              <div className="absolute left-0 w-1/4 h-full bg-slate-300 rounded-lg flex items-center px-2 text-[10px] font-bold text-slate-700">100% DONE</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 text-xs items-center">
            <span className="col-span-3 font-semibold text-slate-700">2. OAuth & Foundation</span>
            <div className="col-span-9 h-6 bg-slate-100 rounded-lg overflow-hidden relative">
              <div className="absolute left-1/4 w-1/4 h-full bg-emerald-500 text-white rounded-lg flex items-center px-2 text-[10px] font-bold">100% DONE</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 text-xs items-center">
            <span className="col-span-3 font-semibold text-slate-700">3. Sprint 4 Integrations</span>
            <div className="col-span-9 h-6 bg-slate-100 rounded-lg overflow-hidden relative">
              <div className="absolute left-2/4 w-1/3 h-full bg-sky-500 text-white rounded-lg flex items-center justify-between px-2 text-[10px] font-bold">
                <span>ACTIVE PHASE</span>
                <span className="bg-sky-600 px-1 py-0.2 rounded text-[8px] animate-pulse">82% HEALTHY</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 text-xs items-center">
            <span className="col-span-3 font-semibold text-slate-700">4. QA & Staging</span>
            <div className="col-span-9 h-6 bg-slate-100 rounded-lg overflow-hidden relative">
              <div className="absolute left-[70%] w-1/5 h-full bg-slate-200 text-slate-500 rounded-lg flex items-center px-2 text-[10px] font-bold">UPCOMING</div>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-2 text-xs items-center">
            <span className="col-span-3 font-semibold text-slate-700">5. App Store Release</span>
            <div className="col-span-9 h-6 bg-slate-100 rounded-lg overflow-hidden relative">
              <div className="absolute right-0 w-1/6 h-full bg-slate-200 text-slate-500 rounded-lg flex items-center px-2 text-[10px] font-bold">AUGUST 15</div>
            </div>
          </div>
        </div>

        {/* Timeline bottom labels */}
        <div className="grid grid-cols-12 gap-2 mt-4 text-[9px] font-mono text-slate-400 border-t border-slate-100 pt-3">
          <span className="col-span-3">Core Phases</span>
          <span className="col-span-2">May 1</span>
          <span className="col-span-2">June 1</span>
          <span className="col-span-2">July 1 (Today)</span>
          <span className="col-span-2">August 1</span>
          <span className="col-span-1 text-right">August 15</span>
        </div>
      </div>

      {/* Twin grid layout: Milestones with AI Alerts, and Dependencies */}
      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Milestones list with AI Alert Warning highlights */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Milestone Predictor</h3>
            <button className="flex items-center gap-1 text-xs text-sky-600 hover:text-sky-700 font-semibold">
              <PlusCircle className="h-3.5 w-3.5" />
              <span>Add Target</span>
            </button>
          </div>

          <div className="space-y-3">
            {milestones.map((milestone) => (
              <div 
                key={milestone.id} 
                onClick={() => toggleMilestone(milestone.id)}
                className={`group flex flex-col p-3 rounded-xl border transition cursor-pointer ${
                  milestone.status === 'completed' 
                    ? 'bg-slate-50/50 border-slate-100' 
                    : milestone.status === 'delayed-risk' 
                      ? 'bg-red-50/30 border-red-200' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center shrink-0 ${
                      milestone.status === 'completed' 
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-600' 
                        : milestone.status === 'delayed-risk'
                          ? 'bg-red-50 border-red-300 text-red-500'
                          : 'border-slate-300 text-transparent'
                    }`}>
                      <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <div>
                      <p className={`text-xs font-semibold ${milestone.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {milestone.name}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                        <Calendar className="h-3 w-3" />
                        Target: {milestone.date}
                      </p>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                    milestone.status === 'completed' 
                      ? 'bg-slate-100 text-slate-500' 
                      : milestone.status === 'delayed-risk'
                        ? 'bg-red-50 text-red-600'
                        : 'bg-sky-50 text-sky-600'
                  }`}>
                    {milestone.status === 'completed' ? 'Done' : `AI Confidence: ${milestone.probability}%`}
                  </span>
                </div>

                {/* Critical AI Detected warning card */}
                {milestone.status === 'delayed-risk' && milestone.aiWarning && (
                  <div className="mt-3.5 rounded-lg bg-red-50/70 border border-red-100 p-3 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-red-700">
                      <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                      <span>{milestone.aiWarning}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-red-600">
                      Why: Backend API review cycles increased from 4 hours to 1.8 days.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); onNavigate('copilot-chat'); }}
                        className="rounded bg-red-600 px-2 py-0.5 text-[9px] font-bold text-white hover:bg-red-700 transition"
                      >
                        Ask Copilot for Fix
                      </button>
                      <span className="text-[9px] text-red-400">Clicking triggers Copilot mitigation.</span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dependencies and Blockers Graph visualization */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Work Blockage Graph</h3>
            <p className="text-[10px] text-slate-400 mt-0.5">Visualizes bottlenecks impacting subsequent deployment dates.</p>
          </div>

          {/* Graphical flow boxes representation */}
          <div className="space-y-4 pt-2">
            
            {/* Blocker item */}
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-red-100 bg-red-50/20 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-red-600 uppercase">BLOCKING ELEMENT</span>
                  <span className="text-[10px] text-slate-400 font-medium">Owner: John</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-800 mt-1">Payment API Configuration</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Delays in defining schema endpoints for Stripe tokens.</p>
              </div>

              {/* Connecting arrow */}
              <ArrowRight className="h-5 w-5 text-red-300 shrink-0" />

              {/* Impacted item */}
              <div className="flex-1 rounded-xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">IMPACTED PATHWAY</span>
                  <span className="text-[10px] text-slate-400 font-medium">Owner: Sarah</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-700 mt-1">Stripe Checkout Page UI</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Ready to bind API tokens but cannot complete tests.</p>
              </div>
            </div>

            {/* Standard non-blocked dependency */}
            <div className="flex items-center gap-3">
              <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-emerald-600 uppercase">RESOLVED ELEMENT</span>
                  <span className="text-[10px] text-slate-400 font-medium">Owner: Sarah</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-500 mt-1 line-through">OAuth Redirect Loops</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Redirect callbacks resolved and verified in staging.</p>
              </div>

              <ArrowRight className="h-5 w-5 text-slate-300 shrink-0" />

              <div className="flex-1 rounded-xl border border-slate-100 bg-slate-50 p-3 opacity-60">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">SUBSEQUENT ELEMENT</span>
                  <span className="text-[10px] text-slate-400 font-medium">Owner: Alex</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-700 mt-1">Cypress Authentication tests</h4>
                <p className="text-[10px] text-slate-400 mt-0.5">Waiting for OAuth completion to run end-to-end loops.</p>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex items-center gap-2.5">
            <Sparkles className="h-4 w-4 text-sky-500 shrink-0" />
            <p className="text-[10px] leading-relaxed text-slate-600">
              <strong>AI Suggestion:</strong> Resolving "Payment API Configuration" will automatically release 3 high-impact downstream frontend issues.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
