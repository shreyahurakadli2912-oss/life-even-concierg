import React, { useState, useEffect } from 'react';
import { History, Search, ArrowRight } from 'lucide-react';
import type { Journey } from '../types';
import { api } from '../services/api';

interface HistoryPageProps {
  onSelectJourney: (j: Journey) => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({ onSelectJourney }) => {
  const [history, setHistory] = useState<Journey[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.getHistory().then(setHistory).catch(console.error);
  }, []);

  const filtered = history.filter(j => 
    j.title.toLowerCase().includes(search.toLowerCase()) || 
    j.user_input.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Journey History Archive</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Review past citizen journeys, completed tasks, and recorded evidence.
          </p>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search past journeys..."
            className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500 w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((j) => (
          <div 
            key={j.id} 
            onClick={() => onSelectJourney(j)}
            className="glass-panel-interactive p-5 rounded-2xl cursor-pointer space-y-3 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800 uppercase">
                  {j.event_type}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {new Date(j.created_at).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-snug">{j.title}</h3>
              <p className="text-xs text-slate-300 italic">"{j.user_input}"</p>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="w-16 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div className="bg-teal-400 h-full" style={{ width: `${j.progress_percentage}%` }} />
                </div>
                <span className="text-teal-300 font-semibold">{j.progress_percentage}%</span>
              </div>

              <span className="text-teal-400 font-medium flex items-center gap-1">
                Open Journey <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
