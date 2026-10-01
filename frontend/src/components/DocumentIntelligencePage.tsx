import React, { useState } from 'react';
import { 
  FileCheck, 
  Upload, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  FileText, 
  ArrowRight
} from 'lucide-react';
import type { DocumentAnalysisResponse } from '../types';
import { api } from '../services/api';

export const DocumentIntelligencePage: React.FC = () => {
  const [selectedDemo, setSelectedDemo] = useState<string>('hospital_slip.pdf');
  const [analysis, setAnalysis] = useState<DocumentAnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const demoDocPresets = [
    { name: 'Hospital_Birth_Discharge_Slip.pdf', hint: 'birth', label: '👶 Hospital Birth Slip' },
    { name: 'Medical_Death_Cause_Report.pdf', hint: 'death', label: '🕊️ Medical Death Record' },
    { name: 'Senior_Aadhaar_Age_Proof.pdf', hint: 'senior', label: '👴 Senior Citizen Age Proof' }
  ];

  const handleAnalyze = async (fileName: string, hint: string) => {
    setSelectedDemo(fileName);
    setLoading(true);
    try {
      const res = await api.analyzeDocument(fileName, hint);
      setAnalysis(res);
    } catch (err) {
      console.error('Doc analysis error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-teal-400" />
          <h2 className="text-xl font-bold text-white">Document Intelligence & Readiness Engine</h2>
        </div>
        <p className="text-xs text-slate-400">
          Upload demo certificates to extract field metadata, verify readiness, and unlock journey tasks.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload & Select Box */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6 h-fit">
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-teal-400" />
              Upload Demo Document
            </h3>
            <p className="text-xs text-slate-400">
              Select a preset sample certificate for OCR field parsing.
            </p>
          </div>

          <div className="space-y-2.5">
            {demoDocPresets.map((preset, idx) => (
              <button
                key={idx}
                onClick={() => handleAnalyze(preset.name, preset.hint)}
                className={`w-full p-3 rounded-xl text-left border transition-all flex items-center justify-between ${
                  selectedDemo === preset.name 
                    ? 'bg-teal-950/60 border-teal-500 text-teal-300 shadow-md shadow-teal-500/10' 
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850'
                }`}
              >
                <span className="text-xs font-semibold">{preset.label}</span>
                <ArrowRight className="w-4 h-4 text-teal-400" />
              </button>
            ))}
          </div>

          {/* Privacy Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-800/40 text-[11px] text-amber-300 space-y-1">
            <strong className="block font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Hackathon Demo Privacy Notice
            </strong>
            <p className="text-amber-200/80">
              Use demo documents during evaluation. Do not upload actual sensitive personal identity files.
            </p>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <Sparkles className="w-8 h-8 text-teal-400 animate-spin mx-auto" />
              <h4 className="text-sm font-bold text-white">Running Vision OCR Field Extraction...</h4>
              <p className="text-xs text-slate-400">Comparing extracted fields against municipal schema requirements</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              
              {/* Document Readiness Header */}
              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Document Type</span>
                  <h3 className="text-base font-bold text-white">{analysis.document_type}</h3>
                  <p className="text-xs text-slate-400">{analysis.file_name}</p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Document Readiness</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    analysis.readiness_status === 'READY' 
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' 
                      : 'bg-amber-950 text-amber-300 border border-amber-800'
                  }`}>
                    {analysis.readiness_status === 'READY' ? '✓ DOCUMENT READINESS VERIFIED' : '⚠ NEEDS REVIEW'}
                  </span>
                </div>
              </div>

              {/* Extracted Fields Table */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-400" />
                  Extracted Document Fields
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-800">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                      <tr>
                        <th className="p-3">Field Label</th>
                        <th className="p-3">Extracted Value</th>
                        <th className="p-3">OCR Confidence</th>
                        <th className="p-3">Validation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 bg-slate-950/60">
                      {analysis.detected_fields.map((field, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50">
                          <td className="p-3 font-semibold text-white">{field.label}</td>
                          <td className="p-3 font-mono text-teal-300">{field.value}</td>
                          <td className="p-3">{(field.confidence * 100).toFixed(0)}%</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                              VALID
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Journey Impact Note */}
              <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/60 text-xs text-teal-200 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-teal-400" />
                  <span>{analysis.notes}</span>
                </span>
                <span className="font-mono text-[11px] bg-teal-900 px-2.5 py-1 rounded text-teal-300 border border-teal-700">
                  Target Task: {analysis.target_task_ids.join(', ')}
                </span>
              </div>

            </div>
          ) : (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <FileCheck className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-xs">Click any demo document preset on the left to run readiness analysis.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
