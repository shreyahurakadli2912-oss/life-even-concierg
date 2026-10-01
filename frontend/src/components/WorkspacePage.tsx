import React, { useState } from 'react';
import { 
  Bot, 
  Layers, 
  FileText, 
  SlidersHorizontal, 
  Clock
} from 'lucide-react';
import type { Journey, TaskItem } from '../types';
import { JourneyGraph } from './JourneyGraph';
import { NextBestActionWidget } from './NextBestActionWidget';
import { api } from '../services/api';

interface WorkspacePageProps {
  journey: Journey;
  onJourneyUpdated: (journey: Journey) => void;
  onNavigateTab: (tab: string) => void;
}

export const WorkspacePage: React.FC<WorkspacePageProps> = ({
  journey,
  onJourneyUpdated,
  onNavigateTab,
}) => {
  const [selectedTask, setSelectedTask] = useState<TaskItem | null>(null);

  const handleCompleteTask = async (taskId: string) => {
    try {
      const updated = await api.completeTask(journey.id, taskId);
      onJourneyUpdated(updated);
    } catch (err) {
      console.error('Task completion error:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-6 px-4 space-y-6">
      
      {/* Workspace Header Banner */}
      <div className="p-6 rounded-2xl glass-panel border border-slate-800/80 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800 uppercase tracking-wider">
              {journey.event_type}
            </span>
            <span className="text-xs font-mono text-slate-400">ID: {journey.id}</span>
          </div>

          <h1 className="text-2xl font-extrabold text-white tracking-tight">{journey.title}</h1>
          <p className="text-xs text-slate-300 italic">"{journey.user_input}"</p>
        </div>

        {/* Progress gauge */}
        <div className="flex items-center gap-4 bg-slate-900/90 p-4 rounded-xl border border-slate-800">
          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Journey Progress</span>
            <span className="text-xl font-extrabold text-teal-400">{journey.progress_percentage}%</span>
          </div>
          <div className="w-16 h-16 relative flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" className="text-slate-800" fill="transparent" />
              <circle 
                cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="6" 
                className="text-teal-400 transition-all duration-700" 
                fill="transparent" 
                strokeDasharray={163} 
                strokeDashoffset={163 - (163 * journey.progress_percentage) / 100} 
              />
            </svg>
            <Bot className="w-5 h-5 text-teal-400 absolute animate-agent-pulse" />
          </div>
        </div>
      </div>

      {/* 3-Column Visual Agent Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: User Context & State Parameters (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
              Collected Context
            </h3>

            <div className="space-y-3">
              {Object.entries(journey.context).map(([k, v]) => (
                <div key={k} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 space-y-0.5 text-xs">
                  <span className="text-[10px] text-slate-400 capitalize font-medium">{k.replace(/_/g, ' ')}</span>
                  <p className="font-semibold text-white">{String(v)}</p>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-800">
              <button 
                onClick={() => onNavigateTab('services')}
                className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-teal-300 text-xs font-medium border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Explore Grounded Services</span>
              </button>
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Interactive Journey Visualizer (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-teal-400" />
                <h3 className="text-sm font-bold text-white">Dependency Graph Workflow</h3>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">{journey.tasks.length} Total Tasks</span>
            </div>

            <JourneyGraph 
              tasks={journey.tasks}
              activeTaskId={selectedTask?.task_id}
              onSelectTask={setSelectedTask}
              onCompleteTask={handleCompleteTask}
            />
          </div>
        </div>

        {/* RIGHT COLUMN: Next Best Action & Agent Activity Timeline (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Next Best Action Widget */}
          <NextBestActionWidget 
            action={journey.next_best_action}
            onProposeAction={() => onNavigateTab('action-center')}
          />

          {/* Agent Activity Timeline */}
          <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800 pb-3">
              <Clock className="w-3.5 h-3.5 text-teal-400" />
              Agent Timeline
            </h3>

            <div className="space-y-3">
              {journey.activities.slice(-4).map((act) => (
                <div key={act.id} className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-teal-400">{act.agent_name}</span>
                    <span className="text-[9px] text-slate-500 font-mono">{act.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{act.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
