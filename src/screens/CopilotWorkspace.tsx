import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  ShieldAlert, 
  Check, 
  X, 
  RefreshCw, 
  Database, 
  GitBranch, 
  Users, 
  MessageSquare,
  User,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { CopilotMessage, Task, TeamMember } from '../types';

interface CopilotWorkspaceProps {
  messages: CopilotMessage[];
  onSendMessage: (text: string) => void;
  tasks: Task[];
  team: TeamMember[];
  onActionApprove: (actionDesc: string) => void;
}

export default function CopilotWorkspace({
  messages,
  onSendMessage,
  tasks,
  team,
  onActionApprove,
}: CopilotWorkspaceProps) {
  
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'context'>('all');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new messages
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Suggested preset questions
  const quickQuestions = [
    { text: 'Who has bandwidth for backend help?', label: 'Team bandwidth' },
    { text: 'Analyze checkout integration risks', label: 'Risk assessment' },
    { text: 'Draft a sprint status report for Executive board', label: 'Report generator' },
  ];

  // Handle standard submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    executeUserQuery(inputText);
  };

  const executeUserQuery = (text: string) => {
    onSendMessage(text);
    setInputText('');
    setIsTyping(true);

    // Simulate custom replies based on keyword match
    setTimeout(() => {
      setIsTyping(false);
      let reply = '';
      let confidence = 85;
      let reasoning: string[] = [];
      let actions: string[] = [];

      const normalized = text.toLowerCase();
      if (normalized.includes('bandwidth') || normalized.includes('who')) {
        reply = "Looking at active workloads for Sprint 4, John Doe is overloaded at 92% capacity. However, **Dave K.** and **Alex Rivera** are highly available.\n\nDave is currently at 30% utilization with only 1 active DevOps task. He has previous full-stack Node.js experience, making him the optimal peer to assist with API bottlenecks.";
        confidence = 95;
        reasoning = [
          "Dave's current ticket allocation takes less than 8 hours of expected sprint capacity.",
          "Alex Rivera has some bandwidth (45%), but is specialized in frontend Cypress test automation.",
          "Sarah Chen is at 65% utilization and busy with high priority UI motion polishes."
        ];
        actions = [
          "Reallocate 'Integrate Stripe Error Loggers' task to Dave K.",
          "Schedule a 15-minute sync sync between John and Dave"
        ];
      } else if (normalized.includes('risk') || normalized.includes('checkout')) {
        reply = "I detected **2 high-impact risks** in your active checkout workflow:\n\n1. **Payment API Integration latency**: Schema reviews are blocked, impacting downstream validation code.\n2. **QA test lag**: Checkout automation testing is scheduled too late in the sprint, risking last-minute hotfixes.\n\nI recommend establishing an SLA on Github reviews and pulling QA testing forward.";
        confidence = 89;
        reasoning = [
          "Payment API task has stayed in 'In Progress' with 0 commits for 5 days.",
          "QA Cypress tests require 3 full days to cover edge cases, but current sprint timeline has QA beginning on day 12 of 14."
        ];
        actions = [
          "Shift QA Automation Testing 4 days earlier",
          "Set 4-hour review SLA for backend Pull Requests"
        ];
      } else if (normalized.includes('report') || normalized.includes('draft')) {
        reply = "I have drafted a professional **Executive Weekly Status Report** based on your Sprint 4 telemetry:\n\n- **Project Status**: Stable with manageable risk warnings.\n- **Completed**: 18 tasks, including critical OAuth redirect loop resolutions.\n- **Active Bottlenecks**: Payment API Integration and Database indexing.\n- **Action Taken**: Suggested task reallocations to offload John Doe (92% capacity).\n\nWould you like me to export this to your Report Generator tab?";
        confidence = 94;
        reasoning = [
          "Sprint backlog items synchronized up to 4 minutes ago.",
          "Velocity and burn-down trend lines mapped successfully."
        ];
        actions = [
          "Export Draft Report to Generator screen",
          "Send briefing email to Executive team directly"
        ];
      } else {
        reply = `I have scanned your active repository branches and tasks regarding "${text}".\n\nAll signals show high development momentum with an average sprint speed of 4.2 points per day. I recommend regular check-ins on 'Payment API Integration' as it holds a high downstream impact score of 91%.`;
        confidence = 82;
        reasoning = [
          "Calculated using historical average velocity for team members.",
          "No major external API downtime detected."
        ];
      }

      // Append AI Response
      onSendMessage(JSON.stringify({
        isAI: true,
        text: reply,
        confidence,
        reasoning,
        suggestedActions: actions
      }));

    }, 1500);
  };

  return (
    <div className="grid h-[calc(100vh-8.5rem)] gap-5 lg:grid-cols-4 animate-fade-in">
      
      {/* 1. Left Context Panel */}
      <div className="hidden flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 lg:flex">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Active AI Context</h3>
        
        <div className="space-y-4">
          {/* DB telemetry status */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Database className="h-4 w-4 text-sky-500" />
              <span>Database Sync</span>
            </div>
            <div className="mt-2 space-y-1 text-[11px] text-slate-500">
              <p>Active Schema: <strong className="font-mono text-slate-700 text-[10px]">v4_checkout_indices</strong></p>
              <p>Jira Sync: <strong className="text-emerald-600 font-semibold">Live (100%)</strong></p>
              <p>Github Hook: <strong className="text-emerald-600 font-semibold">Active</strong></p>
            </div>
          </div>

          {/* Connected Streams */}
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <GitBranch className="h-4 w-4 text-indigo-500" />
              <span>Repository Status</span>
            </div>
            <div className="mt-2 space-y-1.5 text-[11px] text-slate-500">
              <div className="flex items-center justify-between">
                <span>Branch: <code className="rounded bg-slate-200/60 px-1 font-mono text-[9px] text-slate-800">main</code></span>
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              </div>
              <div className="flex items-center justify-between">
                <span>PR Queue size</span>
                <strong className="text-slate-800 font-semibold">3 Pending</strong>
              </div>
              <div className="flex items-center justify-between">
                <span>Avg. Review latency</span>
                <strong className="text-amber-600 font-semibold">1.8 days</strong>
              </div>
            </div>
          </div>

          {/* AI Observation Checklist */}
          <div className="space-y-2">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Current Scope Targets</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 rounded bg-slate-50/50 p-2 text-[11px] text-slate-600">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-50 text-[9px] font-bold text-amber-600">1</span>
                <span>Offload Backend Workloads</span>
              </div>
              <div className="flex items-center gap-2 rounded bg-slate-50/50 p-2 text-[11px] text-slate-600">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-amber-50 text-[9px] font-bold text-amber-600">2</span>
                <span>Accelerate Checkout QA track</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Middle Main Conversational Pane (Takes 2 cols) */}
      <div className="flex flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-2">
        {/* Chat Title bar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-sky-50 text-sky-600">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-slate-800">AI Copilot Companion</h2>
              <p className="text-[10px] text-slate-500 font-medium">Binds server telemetry & task status parameters</p>
            </div>
          </div>

          {/* Status indicators */}
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-mono font-medium text-slate-400">Gemini-2.5-PM</span>
          </div>
        </div>

        {/* Conversation flow container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            
            // Render custom UI if the AI payload is JSON formatted
            let parsedText = msg.text;
            let aiDetails: any = null;
            if (!isUser && msg.text.startsWith('{')) {
              try {
                aiDetails = JSON.parse(msg.text);
                parsedText = aiDetails.text;
              } catch(e) {}
            }

            return (
              <div 
                key={msg.id} 
                className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${
                  isUser ? 'bg-slate-100 text-slate-600' : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white'
                }`}>
                  {isUser ? <User className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                </div>

                {/* Message Body Bubble */}
                <div className="space-y-2">
                  <div className={`rounded-2xl p-4.5 text-xs shadow-sm leading-relaxed ${
                    isUser 
                      ? 'bg-slate-900 text-white rounded-tr-none' 
                      : 'bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-none'
                  }`}>
                    {/* Render text with basic markdown highlights */}
                    <p className="whitespace-pre-line">
                      {parsedText.split('**').map((chunk, i) => 
                        i % 2 === 1 ? <strong key={i} className="font-bold text-slate-950 underline decoration-sky-400 decoration-2">{chunk}</strong> : chunk
                      )}
                    </p>
                    
                    {/* Timestamp */}
                    <div className={`mt-2 text-[9px] text-right font-medium ${isUser ? 'text-slate-400' : 'text-slate-400'}`}>
                      {msg.timestamp}
                    </div>
                  </div>

                  {/* Render confidence & reasoning details if available */}
                  {!isUser && (msg.confidence || aiDetails) && (
                    <div className="rounded-xl border border-slate-100 bg-white p-3 space-y-2.5 shadow-sm">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="flex items-center gap-1 font-semibold text-slate-700">
                          <Info className="h-3.5 w-3.5 text-sky-500" />
                          AI Rationale Matrix
                        </span>
                        <span className="rounded-full bg-sky-50 px-2 py-0.5 font-bold text-sky-700 text-[10px]">
                          Confidence: {msg.confidence || aiDetails?.confidence}%
                        </span>
                      </div>

                      {/* Reasoning stack */}
                      <ul className="space-y-1.5 text-[11px] text-slate-500 list-disc pl-4 leading-normal">
                        {(msg.reasoning || aiDetails?.reasoning || []).map((reason: string, rIdx: number) => (
                          <li key={rIdx}>{reason}</li>
                        ))}
                      </ul>

                      {/* Interactive suggested items */}
                      {(msg.suggestedActions || aiDetails?.suggestedActions) && (
                        <div className="border-t border-slate-100 pt-2 space-y-1.5">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Recommended actions:</p>
                          <div className="flex flex-col gap-1">
                            {(msg.suggestedActions || aiDetails?.suggestedActions).map((act: string, aIdx: number) => (
                              <button 
                                key={aIdx}
                                onClick={() => onActionApprove(act)}
                                className="flex items-center justify-between rounded bg-slate-50 p-2 text-left text-[11px] font-semibold text-slate-700 hover:bg-sky-50 hover:text-sky-700 transition"
                              >
                                <span>{act}</span>
                                <Check className="h-3 w-3 shrink-0" />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="flex h-7 w-7 animate-pulse items-center justify-center rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-sky-500" />
                FlowAI is analyzing repositories and workloads...
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Quick action preset prompts */}
        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-bold text-slate-400 uppercase mr-1">Ask AI:</span>
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => executeUserQuery(q.text)}
              className="rounded-full bg-white border border-slate-200 px-2.5 py-1 text-[10px] font-medium text-slate-600 hover:border-sky-400 hover:text-sky-600 transition"
            >
              {q.label}
            </button>
          ))}
        </div>

        {/* Conversation Input bar */}
        <form onSubmit={handleSubmit} className="border-t border-slate-200/80 p-3 flex items-center gap-2.5 bg-white rounded-b-2xl">
          <input
            type="text"
            placeholder="Type a workflow query or ask to reallocate tasks..."
            className="flex-1 outline-none text-xs text-slate-800 placeholder-slate-400 border border-slate-200 rounded-xl px-4 py-2.5 bg-slate-55 focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!inputText.trim()}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>

      {/* 3. Right Approvals & Action Items */}
      <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-sm">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Human Approval Gate</h3>
          <p className="text-[10px] text-slate-400 mt-1">Accept or reject pending recommendations before implementation.</p>
        </div>

        {/* List of approvals */}
        <div className="space-y-3 flex-1 overflow-y-auto">
          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-3.5">
            <div className="space-y-1">
              <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700">WORKLOAD BALANCE</span>
              <h4 className="text-xs font-bold text-slate-800">Reallocate "Payment API error logging" to Dave K.</h4>
              <p className="text-[11px] text-slate-500">Would decrease John Doe workload by 12% and level-out sprint capacity parameters.</p>
            </div>
            <div className="flex items-center gap-2 border-t border-slate-200/60 pt-2.5">
              <button 
                onClick={() => onActionApprove('Reallocate Payment API error logging to Dave K.')}
                className="flex-1 rounded bg-sky-500 py-1 text-center text-[10px] font-bold text-white hover:bg-sky-600 transition"
              >
                Accept
              </button>
              <button className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-300 transition">
                Dismiss
              </button>
            </div>
          </div>

          <div className="rounded-xl border border-slate-100 bg-slate-50 p-3 space-y-3.5">
            <div className="space-y-1">
              <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700">TIMELINE PREDICTION</span>
              <h4 className="text-xs font-bold text-slate-800">Shift checkout QA track 4 days earlier</h4>
              <p className="text-[11px] text-slate-500">Pre-schedules complex security Cypress verification loops to avoid sprint release blockers.</p>
            </div>
            <div className="flex items-center gap-2 border-t border-slate-200/60 pt-2.5">
              <button 
                onClick={() => onActionApprove('Shift checkout QA track 4 days earlier')}
                className="flex-1 rounded bg-sky-500 py-1 text-center text-[10px] font-bold text-white hover:bg-sky-600 transition"
              >
                Accept
              </button>
              <button className="rounded bg-slate-200 px-2 py-1 text-[10px] font-bold text-slate-600 hover:bg-slate-300 transition">
                Dismiss
              </button>
            </div>
          </div>
        </div>

        {/* Safe AI Compliance guidelines block */}
        <div className="border-t border-slate-100 pt-3 text-[10px] text-slate-400">
          <p className="leading-normal flex gap-1 items-start">
            <Info className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
            <span>AI operations require explicitly approved credentials and follow localized GDPR security bounds.</span>
          </p>
        </div>
      </div>

    </div>
  );
}
