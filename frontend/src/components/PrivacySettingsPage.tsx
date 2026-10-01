import React from 'react';
import { ShieldCheck, Lock, AlertTriangle, Cpu } from 'lucide-react';

export const PrivacySettingsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto py-6 px-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-bold text-white">Privacy & Responsible AI Guidelines</h2>
        </div>
        <p className="text-xs text-slate-400">
          Governance disclosures, zero-retention data policies, and non-authoritative AI boundaries.
        </p>
      </div>

      <div className="space-y-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Responsible AI & Legal Notice
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            This platform provides assistance and guidance. It is not a government authority. The system uses certainty labels (FACT, PROBABLE, POSSIBLE, UNKNOWN) and never guarantees eligibility, legal outcome, or government processing timelines.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
            <Lock className="w-4 h-4 text-teal-400" />
            Data Protection & Hackathon Demo Mode
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            All data processed in DEMO MODE uses local deterministic simulations. No personal identity files are uploaded to external LLM providers or third-party servers.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-sm font-bold text-teal-300 flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            System Architecture Status
          </h3>
          <div className="grid grid-cols-2 gap-4 text-xs text-slate-300 pt-2">
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Engine Status</span>
              <span className="text-emerald-400 font-bold">ONLINE (DEMO MODE)</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] uppercase">Gemini Fallback</span>
              <span className="text-teal-300 font-bold">ACTIVE & READY</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
