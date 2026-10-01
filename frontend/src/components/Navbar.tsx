import React from 'react';
import { 
  Sparkles, 
  Layers, 
  FileCheck, 
  ShieldAlert, 
  BarChart3, 
  History, 
  Bot, 
  Compass
} from 'lucide-react';
import type { Journey } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  activeJourney?: Journey | null;
  onQuickDemo: (event_type: 'CHILD_BIRTH' | 'DEATH_IN_FAMILY' | 'SENIOR_CITIZEN') => void;
  onOpenNewEvent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  activeJourney: _activeJourney,
  onQuickDemo,
  onOpenNewEvent,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('landing')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 p-0.5 shadow-lg shadow-teal-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-teal-400 animate-agent-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  LIFE-EVENT CONCIERGE
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-teal-950 text-teal-300 border border-teal-800/60 rounded-full tracking-wider">
                  AGENTIC AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                One life event. One guided journey. Zero confusion.
              </p>
            </div>
          </div>

          {/* Quick Demo Event Selectors */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
              <Bot className="w-3.5 h-3.5 text-teal-400" />
              Quick Demos:
            </span>
            <button
              onClick={() => onQuickDemo('CHILD_BIRTH')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-teal-950 hover:text-teal-300 hover:border-teal-700/50 text-slate-200 border border-transparent transition-all flex items-center gap-1.5"
            >
              <span>👶</span> Child Birth
            </button>
            <button
              onClick={() => onQuickDemo('DEATH_IN_FAMILY')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-teal-950 hover:text-teal-300 hover:border-teal-700/50 text-slate-200 border border-transparent transition-all flex items-center gap-1.5"
            >
              <span>🕊️</span> Family Death
            </button>
            <button
              onClick={() => onQuickDemo('SENIOR_CITIZEN')}
              className="px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-teal-950 hover:text-teal-300 hover:border-teal-700/50 text-slate-200 border border-transparent transition-all flex items-center gap-1.5"
            >
              <span>👴</span> Senior Citizen
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('workspace')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'workspace' 
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Layers className="w-4 h-4" />
              Workspace
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'services' 
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              Services & Grounding
            </button>

            <button
              onClick={() => setActiveTab('documents')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'documents' 
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              Docs Intelligence
            </button>

            <button
              onClick={() => setActiveTab('action-center')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 relative ${
                activeTab === 'action-center' 
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Action Center
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping absolute top-1 right-1" />
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'analytics' 
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Analytics
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'history' 
                  ? 'bg-teal-500/10 text-teal-300 border border-teal-500/30' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <History className="w-4 h-4" />
              History
            </button>
          </nav>

          {/* Right Action CTA & Demo Indicator */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenNewEvent}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white shadow-lg shadow-teal-500/20 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Journey</span>
            </button>

            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-amber-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>DEMO MODE</span>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
