import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  HelpCircle, 
  Compass
} from 'lucide-react';
import type { NextBestAction } from '../types';

interface NextBestActionWidgetProps {
  action: NextBestAction | null | undefined;
  onProposeAction: () => void;
}

export const NextBestActionWidget: React.FC<NextBestActionWidgetProps> = ({
  action,
  onProposeAction,
}) => {
  if (!action) {
    return (
      <div className="p-5 rounded-2xl glass-panel border border-slate-800 space-y-2 text-center">
        <Sparkles className="w-6 h-6 text-teal-400 mx-auto animate-agent-pulse" />
        <h4 className="text-sm font-bold text-white">Calculating Next Best Action...</h4>
        <p className="text-xs text-slate-400">Agent is parsing task dependencies and context updates</p>
      </div>
    );
  }

  return (
    <div className="p-5 rounded-2xl glass-panel border border-teal-500/50 bg-gradient-to-br from-teal-950/40 via-slate-900/80 to-slate-950 space-y-4 shadow-xl shadow-teal-950/30 relative overflow-hidden">
      
      {/* Background glow accent */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-teal-500 text-slate-950 flex items-center justify-center font-bold">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Agent Recommendation</span>
            <h3 className="text-xs font-bold text-white">NEXT BEST ACTION</h3>
          </div>
        </div>

        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          action.urgency === 'High' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-teal-950 text-teal-300 border border-teal-800'
        }`}>
          {action.urgency} Urgency
        </span>
      </div>

      {/* Action Title & Description */}
      <div className="space-y-1.5 pt-1">
        <h4 className="text-base font-extrabold text-white tracking-tight">
          {action.action_title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed">
          {action.description}
        </p>
      </div>

      {/* WHY Reasoning Callout */}
      <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
        <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1">
          <HelpCircle className="w-3 h-3 text-teal-400" />
          Why This Action?
        </span>
        <p className="text-xs text-slate-300 leading-relaxed italic">
          "{action.reasoning}"
        </p>
      </div>

      {/* Human Approval CTA */}
      <div className="pt-2 flex items-center justify-between gap-4">
        <span className="text-[11px] text-amber-300 flex items-center gap-1 font-medium">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          Requires Human Approval
        </span>

        <button
          onClick={onProposeAction}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs shadow-md shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
        >
          <span>Review & Approve Action</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
