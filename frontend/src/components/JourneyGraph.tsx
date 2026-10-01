import React from 'react';
import { 
  CheckCircle2, 
  Lock, 
  Play, 
  AlertCircle, 
  ShieldCheck, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import type { TaskItem, TaskStatus, CertaintyLevel } from '../types';

interface JourneyGraphProps {
  tasks: TaskItem[];
  activeTaskId?: string;
  onSelectTask: (task: TaskItem) => void;
  onCompleteTask: (taskId: string) => void;
}

export const JourneyGraph: React.FC<JourneyGraphProps> = ({
  tasks,
  activeTaskId,
  onSelectTask,
  onCompleteTask,
}) => {
  const statusStyles: Record<TaskStatus, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    READY: {
      bg: 'bg-teal-950/70',
      border: 'border-teal-500/80 shadow-lg shadow-teal-500/20',
      text: 'text-teal-300',
      icon: <Play className="w-4 h-4 text-teal-400 fill-teal-400/20 animate-agent-pulse" />
    },
    COMPLETED: {
      bg: 'bg-emerald-950/70',
      border: 'border-emerald-500/60',
      text: 'text-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-400" />
    },
    LOCKED: {
      bg: 'bg-slate-900/60',
      border: 'border-slate-800',
      text: 'text-slate-400',
      icon: <Lock className="w-4 h-4 text-slate-500" />
    },
    IN_PROGRESS: {
      bg: 'bg-sky-950/70',
      border: 'border-sky-500/70',
      text: 'text-sky-300',
      icon: <Sparkles className="w-4 h-4 text-sky-400 animate-spin" />
    },
    NEEDS_REVIEW: {
      bg: 'bg-amber-950/70',
      border: 'border-amber-500/70',
      text: 'text-amber-300',
      icon: <AlertCircle className="w-4 h-4 text-amber-400" />
    },
    BLOCKED: {
      bg: 'bg-rose-950/70',
      border: 'border-rose-500/70',
      text: 'text-rose-300',
      icon: <AlertCircle className="w-4 h-4 text-rose-400" />
    }
  };

  const certaintyBadge: Record<CertaintyLevel, { color: string; label: string }> = {
    FACT: { color: 'bg-teal-950 text-teal-300 border-teal-800', label: 'FACT' },
    PROBABLE: { color: 'bg-sky-950 text-sky-300 border-sky-800', label: 'PROBABLE' },
    POSSIBLE: { color: 'bg-indigo-950 text-indigo-300 border-indigo-800', label: 'POSSIBLE' },
    UNKNOWN: { color: 'bg-slate-900 text-slate-400 border-slate-800', label: 'UNKNOWN' }
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Legend Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 rounded-xl glass-panel text-xs">
        <div className="flex items-center gap-2 text-slate-300 font-semibold">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Interactive Dependency Graph</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-teal-400" /> READY</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-400" /> COMPLETED</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-600" /> LOCKED</span>
        </div>
      </div>

      {/* Vertical Node Timeline Flow */}
      <div className="relative space-y-4 before:absolute before:left-6 before:top-6 before:bottom-6 before:w-0.5 before:bg-gradient-to-b before:from-teal-500 before:via-indigo-500 before:to-slate-800">
        {tasks.map((task) => {
          const style = statusStyles[task.status] || statusStyles.LOCKED;
          const certainty = certaintyBadge[task.certainty] || certaintyBadge.PROBABLE;
          const isSelected = activeTaskId === task.task_id;

          return (
            <div 
              key={task.task_id}
              onClick={() => onSelectTask(task)}
              className={`relative pl-12 transition-all cursor-pointer group`}
            >
              {/* Node Bullet Status Marker */}
              <div className={`absolute left-3.5 top-5 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 flex items-center justify-center backdrop-blur-md transition-transform group-hover:scale-110 ${style.border} ${style.bg}`}>
                {style.icon}
              </div>

              {/* Node Card */}
              <div className={`p-4 rounded-2xl glass-panel border transition-all ${style.border} ${isSelected ? 'ring-2 ring-teal-400/50' : ''}`}>
                <div className="flex items-start justify-between gap-4">
                  
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text} border ${style.border}`}>
                        {task.status}
                      </span>
                      
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${certainty.color}`}>
                        {certainty.label}
                      </span>

                      {task.priority === 1 && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800">
                          PRIORITY 1
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                      {task.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed">
                      {task.description}
                    </p>

                    {/* Reasoning callout */}
                    <p className="text-[11px] text-slate-400 italic bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                      <strong className="text-slate-300 not-italic">Why: </strong>
                      {task.reason}
                    </p>
                  </div>

                  {/* Actions & Unlock Button */}
                  <div className="flex flex-col items-end gap-2">
                    {task.status === 'READY' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onCompleteTask(task.task_id);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 hover:scale-[1.03] transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Complete Step</span>
                      </button>
                    )}

                    {task.status === 'COMPLETED' && (
                      <span className="px-3 py-1 rounded-xl bg-emerald-950 text-emerald-300 border border-emerald-800/60 text-xs font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Done
                      </span>
                    )}

                    {task.dependencies.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        Depends on: {task.dependencies.join(', ')}
                      </span>
                    )}
                  </div>

                </div>

                {/* Service Grounding Footer */}
                {task.relevant_service_name && (
                  <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                      Relevant Service: <strong className="text-slate-200 font-medium">{task.relevant_service_name}</strong>
                    </span>
                    <span className="flex items-center gap-1 text-teal-400 hover:underline">
                      Grounding Evidence <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
