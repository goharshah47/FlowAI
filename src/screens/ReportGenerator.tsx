import React, { useState } from 'react';
import { 
  Sparkles, 
  FileText, 
  Share2, 
  Download, 
  Edit, 
  Check, 
  RefreshCw, 
  Info,
  Calendar,
  CheckCircle,
  HelpCircle
} from 'lucide-react';

export default function ReportGenerator() {
  
  // Controls
  const [audience, setAudience] = useState<'executive' | 'client' | 'team'>('executive');
  const [style, setStyle] = useState<'summary' | 'detailed' | 'technical'>('summary');
  const [isCompiling, setIsCompiling] = useState(false);
  const [reportText, setReportText] = useState('');
  const [showNotification, setShowNotification] = useState<string | null>(null);

  // Quick preset data based on toggles
  const getCompiledReport = (aud: typeof audience, st: typeof style) => {
    let title = "WEEKLY STATUS REPORT";
    let scope = "Mobile App Launch";
    let date = "June 23, 2026";
    
    if (aud === 'executive') {
      if (st === 'summary') {
        return `### 📊 ${title} — EXECUTIVE BRIEFING
**Project**: ${scope}
**Compiled**: ${date} by FlowAI

---

#### 1. Executive Summary
The project remains **Stable (82% Healthy)** with steady progress in frontend tasks. There is moderate schedule risk centered around payment gateway API integrations. Standard mitigations have been proposed to offload backend resources.

#### 2. Highlights & Achievements
*   **OAuth Redirect Loops**: 100% resolved and verified in Sandbox.
*   **UI Polish**: Completed sprint 4 design transitions using Motion components.
*   **Stripe Integration**: Code is draft complete; awaiting final schema approvals.

#### 3. Core KPI Telemetry
*   **Completed tasks**: 18
*   **Blocked / Delayed**: 3 tasks
*   **Upcoming Priorities**: 5 critical targets
*   **Resource load**: Balanced (Except Backend tracks at 92%)

---
*Recommended Action*: Authorize Dave K. tasks transfer to lower backend workload immediately.`;
      } else if (st === 'detailed') {
        return `### 📊 ${title} — DETAILED EXECUTIVE REPORT
**Project**: ${scope}
**Date**: ${date}
**Security Level**: Confidential

---

#### Section 1: Detailed Milestone Analytics
*   **Milestone 1: Secure OAuth Integration**
    *   *Status*: Completed
    *   *SLA Verified*: 100% compliant. Redirect loop issues resolved without breaking existing Apple/Google session tokens.
*   **Milestone 2: Payment Gateway setup**
    *   *Status*: Warning (Delayed 5 days)
    *   *Probability of Delay*: 72%
    *   *Root Cause*: John Doe carries 7 active tasks, causing schema reviews to bottleneck.

#### Section 2: Detailed Task Telemetry
*   **Resolved Sprints count**: 18 tasks completed.
*   **Active Blocks**: 3 tasks blocked by Database index delays.
*   **Upcoming Priorities**: 5 targets (QA Automation test parallel runs and stripe error logging).

#### Section 3: Recommendations
1. Reallocate "Integrate Stripe Error Loggers" task to Dave K. (saves 12 hours).
2. Pre-schedule automated qa tests 4 days earlier (wednesday morning).`;
      } else {
        return `### 📊 ${title} — TECHNICAL EXECUTIVE OVERVIEW
**Project**: ${scope}
**Compiler Engine**: FlowAI v2.5

---

#### Section 1: DB & Service Layer Telemetry
*   **Active Database Migrations**: \`v4_checkout_indices\` applied.
*   **Schema lock status**: Free.
*   **Avg Query performance**: composite indexes on activities table reduced JOIN queries from 4.2s to 120ms.

#### Section 2: Pipeline Integrations
*   **E2E Cypress automation suites**: Cypress pipeline runs on 2 parallel runners on GitHub Actions.
*   **OAuth redirect nested scopes**: Handled window communication loops within security rules constraint.
*   **Sync velocity**: Mapped 1,420 Jira issues and 5,820 Slack chat parameters.`;
      }
    } else if (aud === 'client') {
      return `### 🤝 CLIENT UPDATE REPORT
**Project**: ${scope} Customer App
**Date**: ${date}

---

#### Dear Partners,
Here is your weekly update regarding the development of the **${scope}** mobile app. We are running on-schedule and ready to demo our latest milestone.

#### Completed Milestones this week:
1.  **Fully Secure Sign-In**: Finished integrating Google and Apple authentication options for quick account creation.
2.  **Polished App Transitions**: Designed seamless screen movements for a premium, fast feeling across all devices.

#### Active Focus Areas:
*   We are currently finalising the payment module with Stripe to allow secure credit card transactions. 
*   Our testing pipeline is being configured early to ensure no delays as we approach the final release target of August 15th.

Thank you for your continued collaboration. Let us know if you would like to test the latest Sandbox build.`;
    } else {
      // Team report
      return `### ⚡ TEAM BOARD UPDATE & VELOCITY
**Sprint 4 Dashboard Briefing**
**Compiled**: ${date}

---

#### Team Summary:
Great job on wrapping up the **OAuth Sign-in** issues! Let's keep our speed high to hit the Sprint 4 target.

#### Sprint metrics:
*   **Completed tasks**: 18 resolved.
*   **Active Sprints**: 3 tasks delayed.
*   **Remaining points**: 12 points total.

#### Capacity notes:
*   John is currently overloaded (92% load). Dave has volunteered to help with stripe error loggers. Let's make sure John gets reviews back within our target 4-hour SLA.
*   Alex is ready to pull QA Cypress testing forward starting Wednesday. Let's support him by merging PRs quickly.`;
    }
  };

  // Run a quick compile simulation animation
  const handleCompile = (aud: typeof audience, st: typeof style) => {
    setIsCompiling(true);
    setTimeout(() => {
      setIsCompiling(false);
      setReportText(getCompiledReport(aud, st));
      triggerNotification("Report synthesized and re-compiled using latest repository telemetry.");
    }, 800);
  };

  const triggerNotification = (text: string) => {
    setShowNotification(text);
    setTimeout(() => setShowNotification(null), 4000);
  };

  // Initial trigger
  React.useEffect(() => {
    setReportText(getCompiledReport(audience, style));
  }, [audience, style]);

  return (
    <div className="grid h-[calc(100vh-8.5rem)] gap-5 lg:grid-cols-5 animate-fade-in">
      
      {/* Toast notification */}
      {showNotification && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800">
          <Sparkles className="h-4 w-4 text-sky-400 animate-pulse" />
          <span>{showNotification}</span>
        </div>
      )}

      {/* 1. Configuration Panel (Left - 2 columns) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-6 lg:col-span-2 flex flex-col justify-between">
        
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600">
              <Sparkles className="h-4 w-4" />
              <span>AI Compilation Engine</span>
            </div>
            <h1 className="font-sans text-lg font-bold text-slate-900 mt-1">AI Report Generator</h1>
            <p className="text-xs text-slate-500 mt-0.5">Synthesize professional status updates using live parameters.</p>
          </div>

          {/* Selector 1: Audience */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Target Audience</label>
            <div className="grid grid-cols-3 gap-2">
              {(['executive', 'client', 'team'] as const).map((aud) => (
                <button
                  key={aud}
                  onClick={() => { setAudience(aud); }}
                  className={`rounded-xl border p-3 text-center text-xs font-semibold capitalize transition ${
                    audience === aud 
                      ? 'border-sky-500 bg-sky-50/50 text-sky-700 font-bold' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {aud}
                </button>
              ))}
            </div>
          </div>

          {/* Selector 2: Report Style */}
          <div className="space-y-2.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Report Style</label>
            <div className="grid grid-cols-3 gap-2">
              {(['summary', 'detailed', 'technical'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => { setStyle(st); }}
                  className={`rounded-xl border p-3 text-center text-xs font-semibold capitalize transition ${
                    style === st 
                      ? 'border-sky-500 bg-sky-50/50 text-sky-700 font-bold' 
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Compilation Information Card */}
          <div className="rounded-xl bg-slate-50 border border-slate-100 p-3.5 space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
              <Info className="h-4 w-4 text-sky-500" />
              <span>Synthesis Metrics</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-normal">
              Reports automatically summarize commit frequencies, block percentages, and active risk mitigation actions.
            </p>
          </div>
        </div>

        {/* Generate Trigger */}
        <button
          onClick={() => handleCompile(audience, style)}
          disabled={isCompiling}
          className="w-full rounded-xl bg-slate-950 py-3 text-center text-xs font-bold text-white hover:bg-slate-800 transition shadow-md active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isCompiling ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Analyzing repositories...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span>Re-Compile with Latest Data</span>
            </>
          )}
        </button>

      </div>

      {/* 2. Interactive Report Preview Panel (Right - 3 columns) */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm lg:col-span-3 flex flex-col overflow-hidden">
        
        {/* Preview Titlebar */}
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-slate-500" />
            <span className="text-xs font-bold text-slate-800">Generated Markdown Preview</span>
          </div>
          
          {/* Metadata */}
          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
            <span>Encoding: UTF-8</span>
          </div>
        </div>

        {/* Report Content Scroll */}
        <div className="flex-1 overflow-y-auto p-6 font-sans text-slate-800">
          {isCompiling ? (
            <div className="flex flex-col h-full items-center justify-center text-slate-400 space-y-3">
              <RefreshCw className="h-8 w-8 animate-spin text-sky-500" />
              <p className="text-xs font-medium text-slate-500">Compiling database tables and Git commit nodes...</p>
            </div>
          ) : (
            <div className="space-y-4 text-xs max-w-2xl leading-relaxed whitespace-pre-wrap font-sans">
              {/* Split Markdown manually into basic elements for maximum custom styling */}
              {reportText.split('\n').map((line, idx) => {
                if (line.startsWith('### ')) {
                  return <h3 key={idx} className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2 mt-4">{line.replace('### ', '')}</h3>;
                }
                if (line.startsWith('#### ')) {
                  return <h4 key={idx} className="text-xs font-bold uppercase tracking-wider text-slate-500 mt-4 mb-2">{line.replace('#### ', '')}</h4>;
                }
                if (line.startsWith('*   ') || line.startsWith('* ')) {
                  return <div key={idx} className="flex gap-2 pl-4 text-slate-600"><span className="text-sky-500">•</span><span>{line.replace(/^\*\s+/, '')}</span></div>;
                }
                if (line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                  return <div key={idx} className="pl-4 text-slate-600 font-medium">{line}</div>;
                }
                if (line.startsWith('---')) {
                  return <div key={idx} className="h-px bg-slate-100 my-4" />;
                }
                return <p key={idx} className="text-slate-600">{line}</p>;
              })}
            </div>
          )}
        </div>

        {/* Action Button Footer bar */}
        <div className="border-t border-slate-200 bg-slate-50/50 p-4 flex items-center justify-between gap-3">
          <button 
            onClick={() => triggerNotification("Edit mode activated. Direct report customization enabled.")}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <Edit className="h-3.5 w-3.5" />
            <span>Edit Report</span>
          </button>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => triggerNotification("Status update shared to Slack channel #announcements.")}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Share to Slack</span>
            </button>
            <button 
              onClick={() => triggerNotification("Weekly Status Report exported to local PDF.")}
              className="flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Export PDF</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
