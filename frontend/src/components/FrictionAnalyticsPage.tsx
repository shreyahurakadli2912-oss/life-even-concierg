import React, { useState, useEffect } from 'react';
import { BarChart3, AlertCircle, FileX, Clock } from 'lucide-react';
import { api } from '../services/api';

export const FrictionAnalyticsPage: React.FC = () => {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    api.getFrictionAnalytics().then(setData).catch(console.error);
  }, []);

  const metrics = data?.impact_metrics || {
    events_processed: 14,
    tasks_identified: 56,
    tasks_completed: 38,
    documents_analyzed: 22,
    services_discovered: 6,
    blocked_resolved: 5,
    avg_time_to_action: '1.2 minutes'
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Friction Insights & Prototype Impact Metrics</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Anonymized system interaction analytics identifying citizen bottlenecks and administrative delay points.
          </p>
        </div>

        <span className="px-3 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          PROTOTYPE DATA
        </span>
      </div>

      {/* Impact Metric Stat Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Life Events Processed</span>
          <div className="text-2xl font-extrabold text-white">{metrics.events_processed}</div>
          <span className="text-[11px] text-teal-400 font-medium">100% Guided Journeys</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tasks Identified & Managed</span>
          <div className="text-2xl font-extrabold text-white">{metrics.tasks_identified}</div>
          <span className="text-[11px] text-sky-400 font-medium">{metrics.tasks_completed} Tasks Completed</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Documents Parsed (OCR)</span>
          <div className="text-2xl font-extrabold text-white">{metrics.documents_analyzed}</div>
          <span className="text-[11px] text-indigo-400 font-medium">Readiness Assessed</span>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Avg Time to Next Action</span>
          <div className="text-2xl font-extrabold text-teal-300">{metrics.avg_time_to_action}</div>
          <span className="text-[11px] text-emerald-400 font-medium">vs 3+ hours manual search</span>
        </div>
      </div>

      {/* Friction Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
            <FileX className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Most Missing Document</h3>
          <p className="text-xs text-amber-300 font-semibold">{data?.most_missing_document || 'Hospital Birth Slip / Discharge Record'}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Causes initial delay in birth certificate issuance and maternity grant eligibility.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-950 border border-rose-800 flex items-center justify-center text-rose-400">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Most Frequently Blocked Task</h3>
          <p className="text-xs text-rose-300 font-semibold">{data?.most_blocked_task || 'Maternity Benefit Scheme Application'}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Blocked until official birth certificate is issued and uploaded.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Most Clarified Requirement</h3>
          <p className="text-xs text-teal-300 font-semibold">{data?.most_requested_clarification || 'Child birth order eligibility threshold'}</p>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Citizens frequently ask if 2nd girl child qualifies for PMMVY ₹6,000 grant.
          </p>
        </div>
      </div>

    </div>
  );
};
