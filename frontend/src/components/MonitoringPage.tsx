import React from 'react';
import { Activity } from 'lucide-react';
import type { Journey } from '../types';

interface MonitoringPageProps {
  journey: Journey | null;
}

export const MonitoringPage: React.FC<MonitoringPageProps> = ({ journey }) => {
  const activities = journey?.activities || [
    { id: '1', timestamp: '10:42:01', agent_name: 'Life Event Classification Agent', message: 'Identified event CHILD_BIRTH (Confidence 98%)', status: 'COMPLETED' },
    { id: '2', timestamp: '10:42:03', agent_name: 'Context Collection Agent', message: 'Gathered state, DOB, hospital parameters', status: 'COMPLETED' },
    { id: '3', timestamp: '10:42:05', agent_name: 'Life Event Planner', message: 'Generated 5 dependency-aware tasks', status: 'COMPLETED' },
    { id: '4', timestamp: '10:42:07', agent_name: 'Dependency Engine', message: 'Evaluated initial task graph status', status: 'COMPLETED' },
    { id: '5', timestamp: '10:42:09', agent_name: 'Next Best Action Agent', message: 'Selected top action: Hospital Birth Slip Verification', status: 'READY' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6 px-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Agent Activity & Monitoring Engine</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time high-level agent execution logs and adaptive replanning triggers.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-teal-950 text-teal-300 border border-teal-800 text-xs font-mono flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-teal-400 animate-ping" />
          AGENT ACTIVE
        </span>
      </div>

      <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {activities.map((act) => (
            <div key={act.id} className="relative flex items-start justify-between gap-4">
              <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-teal-400 border-2 border-slate-950 shadow-md shadow-teal-500/50" />
              
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-teal-300">{act.agent_name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{act.timestamp}</span>
                </div>
                <p className="text-xs text-slate-200">{act.message}</p>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800">
                {act.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
