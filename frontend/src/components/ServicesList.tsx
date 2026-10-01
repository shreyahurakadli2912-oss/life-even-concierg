import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  FileText, 
  X,
  Search
} from 'lucide-react';
import type { GovernmentService, SourceEvidence } from '../types';
import { api } from '../services/api';

interface ServicesListProps {
  context?: Record<string, any>;
}

export const ServicesList: React.FC<ServicesListProps> = ({ context: _context = {} }) => {
  const [services, setServices] = useState<GovernmentService[]>([]);
  const [selectedEvidence, setSelectedEvidence] = useState<SourceEvidence | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [_loading, setLoading] = useState(false);

  useEffect(() => {
    loadServices();
  }, [searchQuery]);

  const loadServices = async () => {
    setLoading(true);
    try {
      const data = await api.searchServices(searchQuery);
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load services:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-6 px-4">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <h2 className="text-xl font-bold text-white">Government Knowledge Engine & Source Grounding</h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Every service & eligibility rule is directly grounded in official government portals. Never fabricated.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search services or schemes..."
              className="pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-teal-500 w-64"
            />
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((srv) => (
          <div key={srv.id} className="glass-panel p-6 rounded-2xl border border-slate-800/80 space-y-4 flex flex-col justify-between">
            
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-950 text-teal-300 border border-teal-800 uppercase tracking-wider">
                  {srv.category}
                </span>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Verified: {srv.verified_date}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-white leading-snug">{srv.name}</h3>
                <p className="text-[11px] text-slate-400 font-medium mt-0.5">{srv.authority}</p>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {srv.description}
              </p>

              {/* Conditions */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Eligibility Conditions</span>
                <ul className="space-y-1">
                  {srv.eligibility_conditions.map((cond, idx) => (
                    <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-teal-400 shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Required Docs */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Documents</span>
                <div className="flex flex-wrap gap-1.5">
                  {srv.required_documents.map((doc, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded text-[11px] bg-slate-900 text-slate-300 border border-slate-800">
                      📄 {doc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Evidence Drawer Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-4">
              <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                POTENTIALLY ELIGIBLE
              </span>

              <button
                onClick={() => setSelectedEvidence({
                  source_name: srv.source_name,
                  official_url: srv.official_url,
                  verified_date: srv.verified_date,
                  snippet: srv.evidence_snippet,
                  authority: srv.authority
                })}
                className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-teal-300 text-xs font-medium transition-all flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Source Evidence</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Evidence Drawer Modal */}
      {selectedEvidence && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-xl glass-panel rounded-2xl border border-slate-800 p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Government Source Grounding</h3>
              </div>
              <button onClick={() => setSelectedEvidence(null)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Official Authority</span>
                <p className="text-white font-medium">{selectedEvidence.authority}</p>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Source Name</span>
                <p className="text-teal-300 font-medium">{selectedEvidence.source_name}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">Verified Extract Snippet</span>
                <p className="text-slate-200 italic leading-relaxed">
                  "{selectedEvidence.snippet}"
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-400 font-mono">Last Verified: {selectedEvidence.verified_date}</span>
                <a
                  href={selectedEvidence.official_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 hover:bg-teal-400 transition-colors"
                >
                  <span>Visit Official Portal</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
