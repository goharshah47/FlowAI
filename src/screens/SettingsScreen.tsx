import React, { useState } from 'react';
import { Sparkles, Shield, Eye, Settings, HelpCircle, Check, BookOpen, AlertCircle } from 'lucide-react';

export default function SettingsScreen() {
  
  // States
  const [automationLevel, setAutomationLevel] = useState<'low' | 'balanced' | 'high'>('balanced');
  const [anonymizeData, setAnonymizeData] = useState(true);
  const [useSlackContext, setUseSlackContext] = useState(true);
  const [useCommitLogs, setUseCommitLogs] = useState(true);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleSave = () => {
    setFeedback('AI Preferences successfully saved and updated on active models.');
    setTimeout(() => setFeedback(null), 4000);
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl animate-fade-in">
      
      {/* Toast */}
      {feedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* Header Info */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600">
          <Sparkles className="h-4 w-4 text-sky-500" />
          <span>FlowAI Trust Center</span>
        </div>
        <h1 className="mt-1 font-sans text-xl font-bold text-slate-900 sm:text-2xl">
          AI Governance & Trust Controls
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Manage AI learning preferences, data security parameters, and transparency rules.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        
        {/* Settings options (3 columns) */}
        <div className="md:col-span-3 space-y-6">
          
          {/* Section 1: Automation Thresholds */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Automation Threshold</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Controls how proactively the AI suggests and executes reallocations.</p>
            </div>

            <div className="space-y-3">
              
              {/* Level 1: Low */}
              <div 
                onClick={() => setAutomationLevel('low')}
                className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  automationLevel === 'low' 
                    ? 'border-sky-500 bg-sky-50/20' 
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-300">
                  {automationLevel === 'low' && <div className="h-2 w-2 rounded-full bg-sky-500"></div>}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-800">Low (Manual Approvals Only)</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">AI only flags risk and highlights issues. Project managers must explicitly assign tasks and schedule reviews.</p>
                </div>
              </div>

              {/* Level 2: Balanced */}
              <div 
                onClick={() => setAutomationLevel('balanced')}
                className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  automationLevel === 'balanced' 
                    ? 'border-sky-500 bg-sky-50/20' 
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-300">
                  {automationLevel === 'balanced' && <div className="h-2 w-2 rounded-full bg-sky-500"></div>}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-800">Balanced (Recommended)</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">AI suggests task reallocations and provides single-click "Approve" buttons inside briefings to streamline workflows.</p>
                </div>
              </div>

              {/* Level 3: High */}
              <div 
                onClick={() => setAutomationLevel('high')}
                className={`flex gap-3 p-3 rounded-xl border cursor-pointer transition ${
                  automationLevel === 'high' 
                    ? 'border-sky-500 bg-sky-50/20' 
                    : 'border-slate-100 hover:bg-slate-50'
                }`}
              >
                <div className="mt-1 flex h-4 w-4 items-center justify-center rounded-full border border-slate-300">
                  {automationLevel === 'high' && <div className="h-2 w-2 rounded-full bg-sky-500"></div>}
                </div>
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-800">High (Co-Pilot Assistant Mode)</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">AI auto-assigns unallocated backlog items to team members with free capacity and alerts Slack channel immediately.</p>
                </div>
              </div>

            </div>
          </div>

          {/* Section 2: Privacy and context controls */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Data & Privacy Controls</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Control how context data feeds from connected pipelines are processed.</p>
            </div>

            <div className="space-y-3.5">
              
              <div className="flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800">Anonymize Personal Contributor Logs</h4>
                  <p className="text-[10px] text-slate-400">Scrubs developer emails and usernames from git commit histories before processing.</p>
                </div>
                <button 
                  onClick={() => setAnonymizeData(!anonymizeData)}
                  className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${anonymizeData ? 'bg-sky-500' : 'bg-slate-200'}`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${anonymizeData ? 'translate-x-4' : ''}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800">Utilize Slack Conversational Context</h4>
                  <p className="text-[10px] text-slate-400">AI reads channel updates to identify blockages or out-of-office alerts.</p>
                </div>
                <button 
                  onClick={() => setUseSlackContext(!useSlackContext)}
                  className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${useSlackContext ? 'bg-sky-500' : 'bg-slate-200'}`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${useSlackContext ? 'translate-x-4' : ''}`}></span>
                </button>
              </div>

              <div className="flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-semibold text-slate-800">Analyze Commit Code Logs</h4>
                  <p className="text-[10px] text-slate-400">Calculates task progress by scanning active pull requests and test outputs.</p>
                </div>
                <button 
                  onClick={() => setUseCommitLogs(!useCommitLogs)}
                  className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${useCommitLogs ? 'bg-sky-500' : 'bg-slate-200'}`}
                >
                  <span className={`h-4 w-4 rounded-full bg-white shadow transition-transform ${useCommitLogs ? 'translate-x-4' : ''}`}></span>
                </button>
              </div>

            </div>
          </div>

          <button
            onClick={handleSave}
            className="w-full rounded-xl bg-slate-900 py-2.5 text-center text-xs font-bold text-white hover:bg-slate-800 transition active:scale-95 shadow"
          >
            Save AI Preferences
          </button>

        </div>

        {/* AI Transparency guidelines (2 columns) */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Transparency Section */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <BookOpen className="h-4 w-4 text-sky-500" />
              <span>How FlowAI works</span>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500">
              FlowAI utilizes decentralized machine learning parameters. It converts task activity timelines and commit speeds into a custom **directed dependency graph**. 
            </p>

            {/* Ingested parameters list */}
            <div className="space-y-3.5 pt-2 border-t border-slate-100">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Data Feeds used:</h4>
              
              <div className="space-y-2.5 text-[11px]">
                <div className="flex gap-2">
                  <span className="text-sky-500 font-bold shrink-0">✔</span>
                  <div>
                    <span className="font-semibold text-slate-800">Task Activity Logs</span>
                    <p className="text-[10px] text-slate-400">Scans status updates, time-in-lane, and comments.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-sky-500 font-bold shrink-0">✔</span>
                  <div>
                    <span className="font-semibold text-slate-800">Deadline Milestones</span>
                    <p className="text-[10px] text-slate-400">Maps sprint days left against historical issue durations.</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <span className="text-sky-500 font-bold shrink-0">✔</span>
                  <div>
                    <span className="font-semibold text-slate-800">Team Workload Factors</span>
                    <p className="text-[10px] text-slate-400">Sum of active story points and open reviews.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Compliance seal */}
            <div className="rounded-xl bg-slate-50 p-3 border border-slate-100 flex gap-2">
              <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[10px] font-bold text-slate-800">Enterprise Compliant</p>
                <p className="text-[9px] text-slate-400 mt-0.5">Decentralized processing ensures raw code parameters never train external models.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
