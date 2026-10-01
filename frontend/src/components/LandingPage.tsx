import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Bot, 
  CheckCircle2, 
  GitBranch, 
  FileSearch, 
  ShieldCheck, 
  Baby, 
  UserCheck, 
  Layers
} from 'lucide-react';
import type { EventType } from '../types';

interface LandingPageProps {
  onStartJourney: (presetEvent?: EventType) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartJourney }) => {
  return (
    <div className="relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-20">
      
      {/* Hero Header */}
      <div className="text-center space-y-6 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-800/60 text-teal-300 text-xs font-semibold tracking-wide uppercase shadow-lg shadow-teal-950/50">
          <Bot className="w-4 h-4 text-teal-400 animate-agent-pulse" />
          <span>Agentic AI Citizen-Service Orchestration Platform</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
          One life event.{' '}
          <span className="bg-gradient-to-r from-teal-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            One guided journey.
          </span>{' '}
          Zero confusion.
        </h1>

        <p className="text-lg sm:text-xl text-slate-300 font-normal max-w-3xl mx-auto leading-relaxed">
          Tell us what happened in your life. We figure out what needs to happen next — discovering government services, reasoning about eligibility, parsing documents, managing dependencies, and guiding your next best action.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onStartJourney()}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-base shadow-xl shadow-teal-500/25 hover:shadow-teal-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 group"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Start My Journey</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-slate-400 pt-2">
          <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> Source-Grounded Evidence</span>
          <span className="flex items-center gap-1.5"><GitBranch className="w-4 h-4 text-sky-400" /> Dependency Engine</span>
          <span className="flex items-center gap-1.5"><UserCheck className="w-4 h-4 text-amber-400" /> Human Approval First</span>
        </div>
      </div>

      {/* 3 Supported MVP Life Events Cards */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Supported Life Events (MVP Scope)
          </h2>
          <p className="text-sm text-slate-400">
            Select a life event to launch an intelligent, dependency-aware agent workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Child Birth */}
          <div 
            onClick={() => onStartJourney('CHILD_BIRTH')}
            className="glass-panel-interactive p-6 rounded-2xl cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Baby className="w-24 h-24 text-teal-400" />
            </div>

            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-teal-950/80 border border-teal-800/80 flex items-center justify-center text-2xl">
                👶
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Primary Demo Workflow</span>
                <h3 className="text-xl font-bold text-white group-hover:text-teal-300 transition-colors">
                  Child Birth / New Baby
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Birth registration, municipal birth certificate issuance, maternity grant eligibility (PMMVY), and child healthcare registration.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>CRS Municipal Registration</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>PMMVY Maternity Benefit (₹6,000)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                  <span>Hospital Slip Document OCR</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between text-xs font-semibold text-teal-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Child Birth Journey</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Family Death */}
          <div 
            onClick={() => onStartJourney('DEATH_IN_FAMILY')}
            className="glass-panel-interactive p-6 rounded-2xl cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-sky-950/80 border border-sky-800/80 flex items-center justify-center text-2xl">
                🕊️
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">Sensitive Administration</span>
                <h3 className="text-xl font-bold text-white group-hover:text-sky-300 transition-colors">
                  Death in the Family
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Respectful guidance for medical death recording, official death certificates, spouse pension transfer, and survivor benefits.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Municipal Death Certificate</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Family Pension & EPFO Settlement</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>Legal Heir Checklist</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between text-xs font-semibold text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Family Death Journey</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* Senior Citizen */}
          <div 
            onClick={() => onStartJourney('SENIOR_CITIZEN')}
            className="glass-panel-interactive p-6 rounded-2xl cursor-pointer group flex flex-col justify-between relative overflow-hidden"
          >
            <div className="space-y-4 relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-800/80 flex items-center justify-center text-2xl">
                👴
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">Age Transition Welfare</span>
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">
                  Senior Citizenship / Retirement
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Official Senior Citizen Identity Card, transport & healthcare concessions, and IGNOAPS social security pension discovery.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Senior Citizen ID Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>IGNOAPS Social Pension Scheme</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Age & Residency Verification</span>
                </div>
              </div>
            </div>

            <div className="pt-6 relative z-10 flex items-center justify-between text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Senior Citizen Journey</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

        </div>

        {/* Future Extensibility Callout */}
        <div className="p-4 rounded-xl glass-panel border border-slate-800 flex items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-teal-400" />
            <span>
              <strong className="text-slate-200">Extensible Architecture:</strong> Future life events (Marriage, Job Loss, Business Registration, College Admission) can be added via backend JSON configuration without modifying core orchestrator code.
            </span>
          </div>
          <span className="hidden sm:inline px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
            CONFIG-DRIVEN
          </span>
        </div>
      </div>

      {/* Why Life-Event Concierge vs Legacy Chatbots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center">
            <GitBranch className="w-5 h-5 text-teal-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Dependency-Aware Engine</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Tasks automatically unlock as prerequisites (e.g. Birth Registration → Birth Certificate → Benefits Check) are completed in real time.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-950 border border-sky-800 flex items-center justify-center">
            <FileSearch className="w-5 h-5 text-sky-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Source Grounding & Evidence</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every eligibility decision and recommendation links directly to official government portals with verified dates and certainty labels (FACT, PROBABLE, POSSIBLE).
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl space-y-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-950 border border-indigo-800 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-lg font-bold text-white">Human Approval First</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Consequential actions (e.g. submitting applications or generating checklists) require explicit human review & approval before simulated execution.
          </p>
        </div>
      </div>

    </div>
  );
};
