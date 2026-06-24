import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  AlertTriangle, 
  Check, 
  UserMinus, 
  UserPlus, 
  ArrowRight,
  TrendingUp,
  Clock,
  HelpCircle
} from 'lucide-react';
import { TeamMember, Task } from '../types';

interface TeamScreenProps {
  team: TeamMember[];
  tasks: Task[];
  onReallocateTask: (fromId: string, toId: string) => void;
  onUpdateTeam: (updatedTeam: TeamMember[]) => void;
}

export default function TeamScreen({
  team,
  tasks,
  onReallocateTask,
  onUpdateTeam,
}: TeamScreenProps) {
  
  const [feedback, setFeedback] = useState<string | null>(null);

  // Reallocate task simulation handler
  const handleQuickRebalance = () => {
    // Reallocate standard task from john (overloaded) to dave (available)
    onReallocateTask('john', 'dave');

    // Update team capacities locally for high-fidelity response
    const updatedTeam = team.map(m => {
      if (m.id === 'john') {
        return { ...m, workload: 78, status: 'active' as const, tasksCount: m.tasksCount - 1 };
      }
      if (m.id === 'dave') {
        return { ...m, workload: 48, tasksCount: m.tasksCount + 1 };
      }
      return m;
    });
    onUpdateTeam(updatedTeam);

    setFeedback('Task "Integrate Stripe Error Loggers" successfully reallocated to Dave K.! John\'s workload dropped to 78%.');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Toast notifications */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header Row */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600">
          <Sparkles className="h-4 w-4 text-sky-500" />
          <span>FlowAI Resource Planner</span>
        </div>
        <h1 className="mt-1 font-sans text-xl font-bold text-slate-900 sm:text-2xl">
          Team Capacity & Workloads
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Reviews member capacity allocations and flags burnout risks.
        </p>
      </div>

      {/* AI Recommendation Alert Panel */}
      <div className="rounded-2xl border border-amber-200 bg-amber-50/40 p-4.5 space-y-3 shadow-sm">
        <div className="flex items-start gap-2.5">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h3 className="text-xs font-bold text-amber-900">Critical Resource Allocation Warnings</h3>
            <p className="text-xs text-amber-700 leading-normal">
              John Doe (Backend Architect) has a high workload this sprint, carrying 7 active tasks. He is currently at **92% total capacity** which historically indicates a 38% likelihood of sprint leakage.
            </p>
          </div>
        </div>

        {/* Action Button inside alert */}
        <div className="border-t border-amber-200/60 pt-3 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] text-amber-600 italic">
            Recommended Action: Reallocate "Integrate Stripe Error Loggers" task to Dave K. (currently underallocated at 30%).
          </p>
          <button
            onClick={handleQuickRebalance}
            className="rounded-lg bg-slate-900 px-3.5 py-1.5 text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95 shadow"
          >
            Execute AI Rebalance
          </button>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid gap-5 md:grid-cols-2">
        {team.map((member) => (
          <div 
            key={member.id} 
            className={`rounded-2xl border bg-white p-5 shadow-sm transition-all hover:shadow-md ${
              member.status === 'overloaded' 
                ? 'border-red-200 bg-red-50/5' 
                : 'border-slate-200/80'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              {/* Profile Image & Name details */}
              <div className="flex gap-3">
                <img 
                  src={member.avatarUrl} 
                  alt={member.name} 
                  className="h-12 w-12 rounded-xl object-cover ring-2 ring-slate-100" 
                />
                <div>
                  <h3 className="font-sans text-xs font-bold text-slate-800">{member.name}</h3>
                  <p className="text-[11px] text-slate-400 font-medium">{member.role}</p>
                  
                  {/* Status pills */}
                  <span className={`mt-2 inline-block rounded-full px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                    member.status === 'overloaded'
                      ? 'bg-red-50 text-red-600'
                      : member.status === 'active'
                        ? 'bg-sky-50 text-sky-600'
                        : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {member.status}
                  </span>
                </div>
              </div>

              {/* Performance numbers */}
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Task Allocation</p>
                <p className="text-sm font-bold text-slate-800">{member.tasksCount} Sprints</p>
              </div>
            </div>

            {/* Capacity slider representation */}
            <div className="mt-4 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Sprint Capacity:</span>
                <span className={`font-mono font-bold ${member.status === 'overloaded' ? 'text-red-600' : 'text-slate-700'}`}>
                  {member.workload}%
                </span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${
                    member.status === 'overloaded' 
                      ? 'bg-red-500' 
                      : 'bg-sky-500'
                  }`} 
                  style={{ width: `${member.workload}%` }} 
                />
              </div>
            </div>

            {/* Biography details & contributions */}
            <div className="mt-4 border-t border-slate-100 pt-3.5 space-y-1">
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Recent Check-in</p>
              <p className="text-[11px] text-slate-500 leading-normal italic">
                "{member.recentContribution}"
              </p>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
