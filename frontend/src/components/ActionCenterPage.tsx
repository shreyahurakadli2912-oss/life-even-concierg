import React, { useState } from 'react';
import { 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Check
} from 'lucide-react';
import type { Journey } from '../types';
import { api } from '../services/api';

interface ActionCenterPageProps {
  journey: Journey | null;
  onJourneyUpdated: (journey: Journey) => void;
}

export const ActionCenterPage: React.FC<ActionCenterPageProps> = ({
  journey,
  onJourneyUpdated,
}) => {
  const [approvedResult, setApprovedResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const activeTask = journey?.tasks.find(t => t.status === 'READY') || journey?.tasks[0];

  const handleApproveAction = async () => {
    setLoading(true);
    try {
      // Approve action
      const res = await api.approveAction('act_demo_1');
      setApprovedResult(res.result || 'SIMULATED EXECUTION SUCCESSFUL: Issued receipt REC-94821');

      // Refresh journey
      if (journey && activeTask) {
        const updated = await api.completeTask(journey.id, activeTask.task_id);
        onJourneyUpdated(updated);
      }
    } catch (err) {
      console.error('Action approval error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto py-6 px-4">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl font-bold text-white">Human-In-The-Loop Action Center</h2>
        </div>
        <p className="text-xs text-slate-400">
          The agent requests citizen approval before performing any consequential action or preparing municipal applications.
        </p>
      </div>

      {/* Action Approval Card */}
      <div className="glass-panel p-6 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Banner header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-950 text-amber-300 border border-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              ACTION REQUIRES YOUR APPROVAL
            </span>
          </div>
          <span className="text-xs text-slate-400 font-mono">ID: ACT-2026-0929</span>
        </div>

        {/* Proposed Action Body */}
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider block">Proposed Action</span>
            <h3 className="text-xl font-extrabold text-white">
              Prepare Municipal Birth Registration Application & Document Checklist
            </h3>
            <p className="text-xs text-slate-300 mt-1">
              Assemble verified hospital discharge slip, parents' identity credentials, and form parameters for municipal filing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reason for Action</span>
              <p className="text-xs text-slate-300 italic">
                "Hospital birth slip has been verified. Registration within 21 days is required under Section 8 of the RBD Act."
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Expected Outcome</span>
              <p className="text-xs text-slate-300">
                Simulate official receipt creation, unlock Birth Certificate task, and update active journey progress.
              </p>
            </div>
          </div>
        </div>

        {/* Execution Result Banner */}
        {approvedResult && (
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/60 text-xs text-emerald-200 space-y-2 animate-fade-in">
            <div className="flex items-center gap-2 font-bold text-emerald-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span>SIMULATED ACTION EXECUTED SUCCESSFULLY</span>
            </div>
            <p className="font-mono text-[11px] bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-teal-300">
              {approvedResult}
            </p>
            <p className="text-[11px] text-slate-300">
              ✓ Task graph updated. Dependent task unlocked automatically.
            </p>
          </div>
        )}

        {/* Approval CTAs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            Source Grounding: Civil Registration System (CRS) Portal
          </span>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleApproveAction()}
              disabled={loading || !!approvedResult}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-teal-500/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {loading ? (
                <Sparkles className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>Approve & Execute Action</span>
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
