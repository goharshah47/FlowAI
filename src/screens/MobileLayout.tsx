import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  CheckCircle, 
  MessageSquare, 
  CheckSquare, 
  User, 
  ChevronRight, 
  Send, 
  Check, 
  X, 
  ThumbsUp, 
  ThumbsDown, 
  Calendar, 
  Info, 
  RefreshCw,
  TrendingUp,
  Sliders,
  Folder,
  FileText,
  Lock,
  Compass
} from 'lucide-react';
import { Task, TeamMember, AIInsight, Project, CopilotMessage } from '../types';

interface MobileLayoutProps {
  tasks: Task[];
  team: TeamMember[];
  insights: AIInsight[];
  project: Project;
  onSendMessage: (text: string) => void;
  messages: CopilotMessage[];
  onActionApprove: (actionDesc: string) => void;
}

export default function MobileLayout({
  tasks,
  team,
  insights,
  project,
  onSendMessage,
  messages,
  onActionApprove
}: MobileLayoutProps) {
  
  // Navigation active tab inside Mobile Environment
  const [activeTab, setActiveTab] = useState<'home' | 'projects' | 'assistant' | 'tasks' | 'reports'>('home');
  
  // Local active states
  const [localComments, setLocalComments] = useState<{[key: string]: string}>({});
  const [feedbackRates, setFeedbackRates] = useState<{[key: string]: 'helpful' | 'not_helpful' | null}>({});
  const [activeBottomSheet, setActiveBottomSheet] = useState<{title: string; reason: string; confidence: number; action: string; id: string} | null>(null);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedReport, setSelectedReport] = useState<'weekly' | 'executive' | 'client'>('weekly');
  const [isCompilingReport, setIsCompilingReport] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Privacy toggles
  const [anonymize, setAnonymize] = useState(true);
  const [slackContext, setSlackContext] = useState(true);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Human feedback handler
  const handleFeedback = (insightId: string, type: 'helpful' | 'not_helpful') => {
    setFeedbackRates(prev => ({
      ...prev,
      [insightId]: prev[insightId] === type ? null : type
    }));
    triggerToast(`Thanks! Your feedback helps train our PM-SLA models.`);
  };

  // Send message in mobile assistant
  const handleSendMobileMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');
    
    // Add message
    onSendMessage(userText);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      let aiResponseText = "";
      let confidence = 90;
      let reasoning: string[] = [];
      let suggestedActions: string[] = [];

      const query = userText.toLowerCase();
      if (query.includes('attention') || query.includes('need') || query.includes('alert')) {
        aiResponseText = "There are **3 critical items** demanding attention:\n\n1. **Stripe Backend delay**: Schema migration is 5 days behind schedule.\n2. **John Doe is overloaded**: Assigned 7 active tasks (92% load).\n3. **Late QA Testing**: Currently scheduled on day 12/14. I suggest moving it 4 days earlier.";
        confidence = 94;
        reasoning = [
          "Historical commit frequencies on backend branches are down 18%.",
          "QA testing requires minimum 2.4 days for standard Cypress runs."
        ];
        suggestedActions = [
          "Shift QA testing 4 days earlier",
          "Reallocate Stripe logger to Dave K."
        ];
      } else if (query.includes('tasks') || query.includes('sprint')) {
        aiResponseText = "Your Sprint 4 consists of **7 tasks**.\n\n- **1 Done**: OAuth redirect loops verified.\n- **3 Active**: Payment API, Query Tuning, Caching.\n- **3 Backlog/Review**: QA automation test, stripe logging setup.\n\nWould you like me to suggest optimal resource shifts?";
        confidence = 88;
        reasoning = ["Jira task statuses synced 2 minutes ago."];
        suggestedActions = ["Balance sprint workload"];
      } else {
        aiResponseText = `I have completed an AI scan regarding "${userText}". All metrics look stable. The team average speed is 4.2 points per day. Keep an eye on checkout tasks.`;
        confidence = 82;
        reasoning = ["Compared current velocity against previous sprint historical data."];
      }

      onSendMessage(JSON.stringify({
        text: aiResponseText,
        confidence,
        reasoning,
        suggestedActions
      }));
    }, 1200);
  };

  // Quick action from AI focus
  const handleFocusAction = (actionDesc: string) => {
    onActionApprove(actionDesc);
    triggerToast(`Approved: "${actionDesc}"`);
  };

  // Generate mobile report
  const compileMobileReport = () => {
    setIsCompilingReport(true);
    setTimeout(() => {
      setIsCompilingReport(false);
      triggerToast(`Successfully compiled ${selectedReport.toUpperCase()} report!`);
    }, 800);
  };

  return (
    <div className="relative mx-auto my-3 h-[680px] w-[350px] overflow-hidden rounded-[40px] border-[10px] border-slate-900 bg-slate-50 shadow-2xl ring-4 ring-slate-300 flex flex-col font-sans">
      
      {/* 1. iOS Top Notch & Speaker Bar */}
      <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 z-50 flex items-center justify-between px-6 text-white text-[9px] font-mono">
        <span>9:41 AM</span>
        <div className="h-4 w-20 bg-slate-900 rounded-b-xl mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>5G</span>
        </div>
      </div>

      {/* Toast notifications */}
      {toastMessage && (
        <div className="absolute top-8 inset-x-3 z-50 rounded-xl bg-slate-900 px-3 py-2 text-[10px] font-medium text-white shadow-xl flex items-center gap-2 border border-slate-800 animate-slide-in">
          <Sparkles className="h-3 w-3 text-sky-400 shrink-0" />
          <span className="flex-1 leading-normal">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">
            <X className="h-3 w-3" />
          </button>
        </div>
      )}

      {/* Main Viewport */}
      <div className="flex-1 overflow-y-auto pt-7 pb-16 bg-slate-50 text-slate-800">
        
        {/* TAB 1: HOME (MOBILE AI DASHBOARD) */}
        {activeTab === 'home' && (
          <div className="p-4 space-y-4 animate-fade-in">
            {/* Header Greeting */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Workspace Host</span>
                <h1 className="text-base font-bold text-slate-900">Good Morning Alex</h1>
              </div>
              <div className="relative h-8 w-8 rounded-full bg-sky-100 ring-2 ring-sky-200 overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                  alt="Avatar" 
                  className="h-full w-full object-cover" 
                />
              </div>
            </div>

            {/* Project Health Gauge Card */}
            <div className="rounded-2xl border border-sky-100 bg-white p-3.5 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Project Health</span>
                <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-bold text-emerald-700">
                  82% HEALTHY
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0">
                  <svg className="h-full w-full" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-sky-500"
                      strokeDasharray="82, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">
                    82%
                  </div>
                </div>
                <div className="text-[11px] text-slate-500 leading-snug">
                  <p className="font-semibold text-slate-800">Timeline: On Track with warnings</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Continuous analysis score • 94% SLA</p>
                </div>
              </div>
            </div>

            {/* AI FOCUS TODAY (Alert cards) */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-sky-500 animate-pulse" />
                  AI Focus Today
                </h2>
                <span className="text-[9px] text-sky-600 font-bold">1 Active Risk</span>
              </div>

              {/* Focus alert card */}
              <div className="rounded-2xl border-l-4 border-l-red-500 border border-slate-200 bg-white p-3.5 shadow-sm space-y-3.5">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="rounded bg-red-50 px-1.5 py-0.5 text-[8px] font-bold text-red-700 uppercase tracking-wide">
                      Risk Detected
                    </span>
                    <span className="text-[9px] text-slate-400 font-medium">Confidence: <strong>87%</strong></span>
                  </div>
                  <h3 className="text-xs font-bold text-slate-900">Backend API Latency Delay</h3>
                  <p className="text-[11px] leading-relaxed text-slate-500">
                    Database schema update is 5 days delayed, threatening Sprint 4 launch milestones.
                  </p>
                </div>

                {/* Suggested Action inside alert card */}
                <div className="rounded-xl bg-slate-50 border border-slate-100 p-2.5 text-[10px] text-slate-600 leading-relaxed space-y-2">
                  <div className="flex items-start gap-1">
                    <Info className="h-3 w-3 text-sky-500 shrink-0 mt-0.5" />
                    <span><strong>Recommendation:</strong> Reallocate Stripe logging task to Dave K.</span>
                  </div>
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-100 mt-1">
                    <button 
                      onClick={() => handleFocusAction("Reallocate Stripe logging to Dave K.")}
                      className="flex-1 rounded bg-sky-500 py-1 text-center font-bold text-white hover:bg-sky-600 transition"
                    >
                      Fix Now
                    </button>
                    <button 
                      onClick={() => triggerToast("Insight ignored. AI won't show this notification again.")}
                      className="rounded bg-slate-200 px-2 py-1 text-slate-600 font-semibold hover:bg-slate-300 transition"
                    >
                      Ignore
                    </button>
                  </div>
                </div>
              </div>

              {/* AI UX Requirements: High-fidelity recommendation block */}
              <div className="rounded-2xl border border-sky-100 bg-sky-50/20 p-3.5 space-y-3">
                <div className="flex items-center justify-between border-b border-sky-50 pb-2">
                  <span className="text-[9px] font-bold text-sky-800 uppercase tracking-widest flex items-center gap-1">
                    <Compass className="h-3.5 w-3.5 text-sky-500" />
                    AI Advisory Block
                  </span>
                  <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-bold text-sky-700">
                    Confidence: 91%
                  </span>
                </div>

                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-slate-800">Pre-schedule QA Integration</h4>
                  <p className="text-[11px] text-slate-600 leading-normal">
                    Pull checkout automation tests 4 days earlier to clear potential bottlenecks on Stripe integration.
                  </p>
                </div>

                {/* AI UX Requirement: Explanation (Why AI suggested this) */}
                <div className="rounded-xl bg-white p-2 text-[10px] text-slate-500 leading-normal border border-sky-50">
                  <p className="font-semibold text-sky-700 mb-0.5">Why FlowAI suggested this:</p>
                  "Based on sprint deadline, team workload factors, and downstream payment API dependencies."
                </div>

                {/* AI UX Requirement: Human control Actions */}
                <div className="flex items-center justify-between pt-1 text-[10px]">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleFocusAction("Shift QA testing 4 days earlier")}
                      className="rounded bg-sky-500 px-2.5 py-1 font-bold text-white hover:bg-sky-600 transition"
                    >
                      Accept
                    </button>
                    <button 
                      onClick={() => triggerToast("Edit mode activated on mobile.")}
                      className="rounded bg-slate-100 border border-slate-200 px-2 py-1 font-semibold text-slate-600 hover:bg-slate-200 transition"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => triggerToast("Recommendation ignored.")}
                      className="rounded bg-slate-100 border border-slate-200 px-2 py-1 font-semibold text-slate-600 hover:bg-slate-200 transition"
                    >
                      Ignore
                    </button>
                  </div>

                  {/* AI UX Requirement: Helpfulness Feedback */}
                  <div className="flex items-center gap-1 border-l border-slate-200 pl-2">
                    <button 
                      onClick={() => handleFeedback('ins-2', 'helpful')}
                      className={`p-1 rounded transition hover:bg-slate-100 ${feedbackRates['ins-2'] === 'helpful' ? 'text-sky-500 bg-sky-50' : 'text-slate-400'}`}
                      title="Helpful"
                    >
                      <ThumbsUp className="h-3 w-3" />
                    </button>
                    <button 
                      onClick={() => handleFeedback('ins-2', 'not_helpful')}
                      className={`p-1 rounded transition hover:bg-slate-100 ${feedbackRates['ins-2'] === 'not_helpful' ? 'text-red-500 bg-red-50' : 'text-slate-400'}`}
                      title="Not helpful"
                    >
                      <ThumbsDown className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Load snapshot mobile */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-3.5 space-y-2.5 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Team load factor</span>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between">
                  <span>John Doe (Backend)</span>
                  <span className="text-red-600 font-bold">92% load</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-red-500" style={{ width: '92%' }} />
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PROJECTS (MOBILE PROJECT LIST) */}
        {activeTab === 'projects' && (
          <div className="p-4 space-y-4 animate-fade-in">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Milestones</span>
              <h1 className="text-base font-bold text-slate-900">Project Overview</h1>
            </div>

            {/* Project status cards */}
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">Sprint 4 Demo Release</span>
                  <span className="text-emerald-600 font-semibold">Active</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  Milestone includes Payment API configuration and OAuth redirect verification.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Due: June 30, 2026</span>
                  <span>18/26 Tasks Complete</span>
                </div>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-800">Security Penetration Check</span>
                  <span className="text-slate-400">Scheduled</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal">
                  E2E testing parallel runners setups across OAuth redirect layers.
                </p>
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span>Due: July 15, 2026</span>
                  <span>0/5 Tasks Complete</span>
                </div>
              </div>
            </div>

            {/* Active team members mobile avatar stacked */}
            <div className="rounded-xl bg-slate-100 border border-slate-200 p-3 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Project Team</span>
              <div className="flex items-center gap-1.5">
                {team.map((m) => (
                  <img 
                    key={m.id} 
                    src={m.avatarUrl} 
                    alt={m.name} 
                    className="h-6 w-6 rounded-full object-cover ring-2 ring-white" 
                    title={m.name}
                  />
                ))}
                <span className="text-[10px] text-slate-500 font-semibold pl-1">+{team.length} specialists</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MOBILE AI ASSISTANT (COPILOT CHAT) */}
        {activeTab === 'assistant' && (
          <div className="h-full flex flex-col justify-between animate-fade-in">
            {/* Assistant Header */}
            <div className="bg-white border-b border-slate-100 px-4 py-2.5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-sky-50 text-sky-600">
                  <MessageSquare className="h-3.5 w-3.5" />
                </div>
                <div>
                  <h2 className="text-xs font-bold text-slate-800">AI Copilot</h2>
                  <p className="text-[9px] text-slate-400 font-medium">Binds real repository telemetry</p>
                </div>
              </div>

              <span className="rounded bg-sky-50 px-1.5 py-0.2 text-[8px] font-mono text-sky-600">
                Gemini-2.5
              </span>
            </div>

            {/* Chat Conversation Scroll area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3.5 text-xs">
              {messages.map((msg) => {
                const isUser = msg.sender === 'user';
                let renderedText = msg.text;
                let parsedJson: any = null;
                
                if (!isUser && msg.text.startsWith('{')) {
                  try {
                    parsedJson = JSON.parse(msg.text);
                    renderedText = parsedJson.text;
                  } catch(e) {}
                }

                return (
                  <div key={msg.id} className={`flex gap-2 max-w-[90%] ${isUser ? 'ml-auto flex-row-reverse' : ''}`}>
                    <div className={`h-6 w-6 shrink-0 rounded-lg flex items-center justify-center text-[10px] ${
                      isUser ? 'bg-slate-100 text-slate-600' : 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white'
                    }`}>
                      {isUser ? <User className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
                    </div>

                    <div className="space-y-1.5">
                      <div className={`rounded-xl p-3 leading-relaxed text-[11px] shadow-sm ${
                        isUser ? 'bg-slate-900 text-white rounded-tr-none' : 'bg-white border border-slate-200 rounded-tl-none text-slate-800'
                      }`}>
                        <p className="whitespace-pre-line">
                          {renderedText.split('**').map((chunk, i) => 
                            i % 2 === 1 ? <strong key={i} className="font-bold text-slate-950 underline decoration-sky-300">{chunk}</strong> : chunk
                          )}
                        </p>
                      </div>

                      {/* Display mobile custom rationale details */}
                      {!isUser && (msg.confidence || parsedJson) && (
                        <div className="rounded-xl border border-slate-100 bg-white p-2.5 space-y-2 shadow-sm text-[10px]">
                          <div className="flex items-center justify-between font-semibold text-slate-700">
                            <span>Rationale Matrix</span>
                            <span className="text-sky-600 text-[9px] bg-sky-50 px-1 rounded">
                              Confidence: {msg.confidence || parsedJson.confidence}%
                            </span>
                          </div>

                          <ul className="space-y-1 text-[10px] text-slate-500 list-disc pl-3">
                            {(msg.reasoning || parsedJson.reasoning || []).map((reason: string, rIdx: number) => (
                              <li key={rIdx}>{reason}</li>
                            ))}
                          </ul>

                          {/* Quick Suggested Mobile buttons */}
                          {(msg.suggestedActions || parsedJson.suggestedActions) && (
                            <div className="pt-2 border-t border-slate-100 space-y-1">
                              {(msg.suggestedActions || parsedJson.suggestedActions).map((act: string, aIdx: number) => (
                                <button 
                                  key={aIdx}
                                  onClick={() => handleFocusAction(act)}
                                  className="w-full flex items-center justify-between rounded bg-slate-50 p-1.5 text-left text-[10px] text-slate-700 hover:bg-sky-50 transition"
                                >
                                  <span className="truncate">{act}</span>
                                  <Check className="h-3 w-3 text-sky-500 shrink-0" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center">
                    <Sparkles className="h-3 w-3 animate-pulse" />
                  </div>
                  <div className="rounded-xl bg-slate-100 p-2.5 text-[10px] text-slate-500 flex items-center gap-1.5 border border-slate-200">
                    <RefreshCw className="h-3 w-3 animate-spin text-sky-500" />
                    <span>FlowAI is calculating...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Form mobile */}
            <form onSubmit={handleSendMobileMessage} className="border-t border-slate-200 p-2 bg-white flex items-center gap-1.5 shrink-0">
              <input
                type="text"
                placeholder="Ask who has bandwidth..."
                className="flex-1 outline-none text-[11px] border border-slate-200 rounded-lg px-2.5 py-1.5 bg-slate-50 focus:bg-white"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button 
                type="submit" 
                className="h-7 w-7 rounded-lg bg-slate-900 text-white flex items-center justify-center hover:bg-slate-800 transition disabled:opacity-40"
                disabled={!inputText.trim()}
              >
                <Send className="h-3 w-3" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 4: TASKS (MOBILE TASK MANAGEMENT) */}
        {activeTab === 'tasks' && (
          <div className="p-4 space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Sprint 4 Sprintboard</span>
                <h1 className="text-base font-bold text-slate-900">Smart Task Cards</h1>
              </div>
              <span className="rounded bg-sky-50 px-2 py-0.5 text-[10px] font-bold text-sky-700">
                {tasks.length} Total
              </span>
            </div>

            {/* Mobile Adaption: Multi-column Kanban transformed into Stacked vertical cards list */}
            <div className="space-y-3">
              {tasks.map((task) => {
                const owner = team.find(m => m.id === task.ownerId);
                return (
                  <div key={task.id} className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm space-y-3 hover:border-sky-400 transition">
                    
                    {/* Header line */}
                    <div className="flex items-center justify-between text-[9px] font-bold">
                      <span className={`uppercase tracking-wider ${
                        task.priority === 'high' ? 'text-red-600' : 'text-amber-600'
                      }`}>
                        {task.priority} PRIORITY
                      </span>
                      <span className="text-slate-400">{task.dueDate}</span>
                    </div>

                    {/* Task Title */}
                    <div>
                      <h3 className="text-xs font-bold text-slate-800 leading-snug">{task.title}</h3>
                      <p className="text-[10px] text-slate-400 mt-1 uppercase font-mono">ID: {task.id.toUpperCase()}</p>
                    </div>

                    {/* AI Impact Segment */}
                    <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100 space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 font-medium">AI Impact score:</span>
                        <span className="text-sky-600 font-bold bg-sky-50 px-1 rounded">{task.aiImpactScore}% score</span>
                      </div>
                      
                      {/* AI UX requirement: Show Recommendation & Explanation */}
                      <div className="text-[9px] text-slate-500 italic leading-relaxed">
                        <strong>Recommendation:</strong> {task.aiReason}
                      </div>
                    </div>

                    {/* Owner detail & actions footer */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-[10px]">
                      {owner ? (
                        <div className="flex items-center gap-1.5">
                          <img src={owner.avatarUrl} alt={owner.name} className="h-5 w-5 rounded-full object-cover ring-1 ring-slate-200" />
                          <span className="font-semibold text-slate-600">{owner.name.split(' ')[0]}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">Unassigned</span>
                      )}

                      {/* Status select dropdown */}
                      <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase ${
                        task.status === 'completed' ? 'bg-emerald-50 text-emerald-700' :
                        task.status === 'review' ? 'bg-amber-50 text-amber-700' :
                        'bg-sky-50 text-sky-700'
                      }`}>
                        {task.status.replace('_', ' ')}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 5: REPORTS & PRIVACY (MOBILE REPORTS PREVIEW) */}
        {activeTab === 'reports' && (
          <div className="p-4 space-y-4 animate-fade-in">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Compiler Engine</span>
              <h1 className="text-base font-bold text-slate-900">Mobile Report Gen</h1>
            </div>

            {/* Category selection */}
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Report Category</label>
              <div className="grid grid-cols-3 gap-1 text-[10px] font-semibold">
                {[
                  { id: 'weekly', label: 'Weekly' },
                  { id: 'executive', label: 'Exec Summary' },
                  { id: 'client', label: 'Client' }
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => { setSelectedReport(item.id as any); compileMobileReport(); }}
                    className={`rounded-lg border p-1.5 text-center transition ${
                      selectedReport === item.id 
                        ? 'border-sky-500 bg-sky-50 text-sky-700 font-bold' 
                        : 'border-slate-200 text-slate-600 bg-white hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Report preview compiled screen */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2 shadow-sm text-[10px] leading-relaxed">
              <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                <span className="font-bold text-slate-800 uppercase text-[9px]">Compiled Output Preview</span>
                <span className="text-slate-400 text-[8px] font-mono">Format: MD</span>
              </div>

              {isCompilingReport ? (
                <div className="py-8 flex flex-col items-center justify-center text-slate-400 space-y-1">
                  <RefreshCw className="h-4 w-4 animate-spin text-sky-500" />
                  <span>Synthesizing logs...</span>
                </div>
              ) : (
                <div className="space-y-2 font-mono text-slate-600 text-[9px] max-h-48 overflow-y-auto">
                  {selectedReport === 'weekly' ? (
                    <>
                      <p className="font-bold text-slate-900"># WEEKLY UPDATE REPORT</p>
                      <p>Project: Mobile App Launch</p>
                      <p>Health: 82% Stable with warnings</p>
                      <p>---</p>
                      <p>* OAuth Redirect loop: 100% complete.</p>
                      <p>* Stripe payment loggers: Draft completed.</p>
                      <p>* DB Index Bottleneck: 1 active risk.</p>
                    </>
                  ) : selectedReport === 'executive' ? (
                    <>
                      <p className="font-bold text-slate-900"># EXECUTIVE BRIEFING SUMMARY</p>
                      <p>Compiled: June 23, 2026</p>
                      <p>Status: Healthy with caution.</p>
                      <p>---</p>
                      <p>* john Doe overloaded (92% load).</p>
                      <p>* Proposed shift of QA 4 days earlier.</p>
                      <p>* Potential schedule slippage calculated at 8.2%.</p>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-slate-900"># CLIENT ENGAGEMENT BRIEFING</p>
                      <p>Hi team, progress is steady and on-target.</p>
                      <p>---</p>
                      <p>* Custom motion interactions built.</p>
                      <p>* Fully sandbox tested on Apple/Google secure OAuth.</p>
                      <p>* Demo sandbox build is prepared.</p>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-2">
              <button 
                onClick={() => triggerToast("Shared report markdown straight to Slack!")}
                className="flex-1 rounded-xl bg-slate-900 py-2 text-center text-[10px] font-bold text-white hover:bg-slate-800 transition"
              >
                Share Slack
              </button>
              <button 
                onClick={() => triggerToast("PDF downloaded successfully.")}
                className="flex-1 rounded-xl bg-slate-100 border border-slate-200 py-2 text-center text-[10px] font-bold text-slate-700 hover:bg-slate-200 transition"
              >
                Export PDF
              </button>
            </div>

            {/* Privacy Trust controls mobile version */}
            <div className="rounded-xl border border-slate-200 bg-white p-3 space-y-2.5">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Lock className="h-3 w-3 text-sky-500" />
                Mobile Privacy Shield
              </span>
              
              <div className="space-y-2 text-[10px]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Anonymize Logs</p>
                    <p className="text-[8px] text-slate-400">Scrub developer email tags.</p>
                  </div>
                  <button 
                    onClick={() => { setAnonymize(!anonymize); triggerToast(`Anonymization toggled ${!anonymize ? 'ON' : 'OFF'}`); }}
                    className={`relative flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors ${anonymize ? 'bg-sky-500' : 'bg-slate-200'}`}
                  >
                    <span className={`h-3 w-3 rounded-full bg-white shadow transition-transform ${anonymize ? 'translate-x-3' : ''}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Utilize Slack context</p>
                    <p className="text-[8px] text-slate-400">Read daily updates funnels.</p>
                  </div>
                  <button 
                    onClick={() => { setSlackContext(!slackContext); triggerToast(`Slack Context analysis toggled ${!slackContext ? 'ON' : 'OFF'}`); }}
                    className={`relative flex h-4 w-7 shrink-0 items-center rounded-full p-0.5 transition-colors ${slackContext ? 'bg-sky-500' : 'bg-slate-200'}`}
                  >
                    <span className={`h-3 w-3 rounded-full bg-white shadow transition-transform ${slackContext ? 'translate-x-3' : ''}`} />
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 4. Native iOS Bottom Navigation bar */}
      <div className="absolute bottom-0 inset-x-0 h-14 bg-white border-t border-slate-200/90 z-50 flex items-center justify-around px-2 pb-2">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'home' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Compass className="h-4.5 w-4.5" />
          <span className="text-[8px] mt-1">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('projects')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'projects' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Folder className="h-4.5 w-4.5" />
          <span className="text-[8px] mt-1">Projects</span>
        </button>

        <button 
          onClick={() => setActiveTab('assistant')}
          className={`relative flex flex-col items-center justify-center transition ${
            activeTab === 'assistant' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <div className="absolute -top-4 bg-sky-500 text-white rounded-full p-1.5 shadow-md shadow-sky-200 border-2 border-white">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-[8px] mt-5">AI Assistant</span>
        </button>

        <button 
          onClick={() => setActiveTab('tasks')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'tasks' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <CheckSquare className="h-4.5 w-4.5" />
          <span className="text-[8px] mt-1">Tasks</span>
        </button>

        <button 
          onClick={() => setActiveTab('reports')}
          className={`flex flex-col items-center justify-center transition ${
            activeTab === 'reports' ? 'text-sky-600 font-bold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <FileText className="h-4.5 w-4.5" />
          <span className="text-[8px] mt-1">Reports</span>
        </button>
      </div>

      {/* 5. iOS Home Indicator bar at the very bottom */}
      <div className="absolute bottom-1 inset-x-0 h-1 bg-slate-300 rounded-full w-24 mx-auto z-50 pointer-events-none" />

    </div>
  );
}
