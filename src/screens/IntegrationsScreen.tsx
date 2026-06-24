import React, { useState } from 'react';
import { Sparkles, Layers, Check, RefreshCw, PlusCircle, AlertCircle, ToggleLeft, ToggleRight, HelpCircle } from 'lucide-react';
import { Integration } from '../types';

interface IntegrationsScreenProps {
  integrations: Integration[];
  onToggleIntegration: (id: string) => void;
}

export default function IntegrationsScreen({ integrations, onToggleIntegration }: IntegrationsScreenProps) {
  
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const handleManualSync = (name: string) => {
    setSyncFeedback(`Triggered re-indexing on connected pipelines for ${name}...`);
    setTimeout(() => {
      setSyncFeedback(`Successfully synchronized data parameters for ${name}!`);
    }, 1200);
    setTimeout(() => {
      setSyncFeedback(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      
      {/* Toast Sync message */}
      {syncFeedback && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl bg-slate-900 px-4 py-3 text-xs font-medium text-white shadow-xl border border-slate-800">
          <RefreshCw className="h-4 w-4 text-sky-400 animate-spin" />
          <span>{syncFeedback}</span>
        </div>
      )}

      {/* Header Info */}
      <div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-sky-600">
          <Sparkles className="h-4 w-4 text-sky-500" />
          <span>FlowAI Core Data Feeds</span>
        </div>
        <h1 className="mt-1 font-sans text-xl font-bold text-slate-900 sm:text-2xl">
          Connected Intelligence Pipelines
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          FlowAI reads active parameters across your standard tools to construct risk graphs and workloads automatically.
        </p>
      </div>

      {/* Integrations Grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {integrations.map((app) => (
          <div 
            key={app.id} 
            className={`rounded-2xl border bg-white p-5 shadow-sm flex flex-col justify-between transition-all hover:shadow-md ${
              app.connected ? 'border-sky-100' : 'border-slate-200/80 opacity-80'
            }`}
          >
            {/* Top row: Brand & toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-50 p-2 border border-slate-100">
                  <img src={app.logo} alt={app.name} className="h-full w-full object-contain" />
                </div>
                
                {/* Connect Toggle Button */}
                <button
                  onClick={() => onToggleIntegration(app.id)}
                  className="transition active:scale-95 cursor-pointer text-slate-400 hover:text-sky-600"
                  title={app.connected ? 'Disconnect pipeline' : 'Connect pipeline'}
                >
                  {app.connected ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      CONNECTED
                      <Check className="h-4 w-4 text-emerald-600 fill-emerald-50" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      DISCONNECTED
                    </span>
                  )}
                </button>
              </div>

              {/* Title & Description */}
              <div>
                <h3 className="font-sans text-xs font-bold text-slate-800">{app.name}</h3>
                <p className="mt-1.5 text-[11px] leading-relaxed text-slate-500">{app.description}</p>
              </div>
            </div>

            {/* Sync Status / Data indicators footer */}
            <div className="mt-5 border-t border-slate-100 pt-3.5 space-y-2 text-[11px]">
              {app.connected ? (
                <div className="space-y-1.5 text-[10px] text-slate-500 font-medium">
                  <div className="flex items-center justify-between">
                    <span>Sync status:</span>
                    <span className="text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                      {app.syncStatus}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Signals imported:</span>
                    <span className="font-mono text-slate-800 font-bold">{app.dataPointsImported} nodes</span>
                  </div>
                  <button 
                    onClick={() => handleManualSync(app.name)}
                    className="mt-2 text-sky-600 hover:text-sky-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="h-3 w-3" />
                    <span>Sync feed manually</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => onToggleIntegration(app.id)}
                  className="w-full rounded-lg bg-sky-50 py-1 text-center text-[10px] font-bold text-sky-600 hover:bg-sky-100 transition"
                >
                  Authorize Pipeline
                </button>
              )}
            </div>

          </div>
        ))}
      </div>

    </div>
  );
}
