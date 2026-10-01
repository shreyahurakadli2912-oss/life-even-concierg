import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Bot, 
  ArrowRight, 
  HelpCircle,
  Brain,
  SlidersHorizontal
} from 'lucide-react';
import type { EventType, ContextQuestion, Journey } from '../types';
import { api } from '../services/api';

interface NewLifeEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJourneyCreated: (journey: Journey) => void;
  presetEvent?: EventType;
}

export const NewLifeEventModal: React.FC<NewLifeEventModalProps> = ({
  isOpen,
  onClose,
  onJourneyCreated,
  presetEvent: _presetEvent,
}) => {
  const [userInput, setUserInput] = useState('');
  const [step, setStep] = useState<'INPUT' | 'CLASSIFYING' | 'CONTEXT'>('INPUT');
  const [classifiedEvent, setClassifiedEvent] = useState<EventType>('CHILD_BIRTH');
  const [confidence, setConfidence] = useState(0.98);
  const [questions, setQuestions] = useState<ContextQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const sampleInputs = [
    "We had a baby girl yesterday.",
    "My father passed away last week.",
    "My mother has turned 60 and I want to know what services are available."
  ];

  const handleClassify = async (overrideText?: string) => {
    const textToSubmit = overrideText || userInput;
    if (!textToSubmit.trim()) return;

    setLoading(true);
    setStep('CLASSIFYING');

    try {
      // Step 1: Call Classification API
      const res = await api.classifyEvent(textToSubmit);
      const ev: EventType = res.event_type || 'CHILD_BIRTH';
      setClassifiedEvent(ev);
      setConfidence(res.confidence || 0.96);

      // Step 2: Fetch Context Questions
      const contextRes = await api.getContextQuestions(ev, {});
      setQuestions(contextRes.questions || []);

      setTimeout(() => {
        setStep('CONTEXT');
        setLoading(false);
      }, 900);

    } catch (err) {
      console.error('Classification error:', err);
      setStep('CONTEXT');
      setLoading(false);
    }
  };

  const handleBuildJourney = async () => {
    setLoading(true);
    try {
      const journey = await api.createJourney(classifiedEvent, userInput || 'New Life Event', answers);
      onJourneyCreated(journey);
      onClose();
    } catch (err) {
      console.error('Create journey failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl glass-panel rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400">
              <Bot className="w-4 h-4 animate-agent-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Start New Life Event Journey</h3>
              <p className="text-[11px] text-slate-400">Tell us what happened in natural language</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {step === 'INPUT' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-slate-300">
                  What life event did you experience?
                </label>
                <textarea
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  placeholder="e.g. 'We had a baby girl yesterday' or 'My father passed away'"
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-800 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 transition-colors resize-none"
                />
              </div>

              {/* Sample Triggers */}
              <div className="space-y-2">
                <span className="text-[11px] text-slate-400 font-medium">Or select a quick example prompt:</span>
                <div className="flex flex-col gap-2">
                  {sampleInputs.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setUserInput(sample);
                        handleClassify(sample);
                      }}
                      className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-teal-300 transition-all flex items-center justify-between group"
                    >
                      <span>"{sample}"</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-1 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 'CLASSIFYING' && (
            <div className="py-12 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="relative w-16 h-16 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-teal-500/20 border-t-teal-400 animate-spin" />
                <Brain className="w-8 h-8 text-teal-400 animate-agent-pulse" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">Analyzing Life Event Context...</h4>
                <p className="text-xs text-slate-400">Classifying event intent & querying government knowledge layer</p>
              </div>
            </div>
          )}

          {step === 'CONTEXT' && (
            <div className="space-y-6">
              
              {/* Event Classification Result Badge */}
              <div className="p-4 rounded-xl bg-teal-950/40 border border-teal-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-900/60 flex items-center justify-center text-xl">
                    {classifiedEvent === 'CHILD_BIRTH' ? '👶' : classifiedEvent === 'DEATH_IN_FAMILY' ? '🕊️' : '👴'}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">Identified Life Event</span>
                    <h4 className="text-sm font-bold text-white">
                      {classifiedEvent === 'CHILD_BIRTH' ? 'CHILD BIRTH / NEWBORN' : classifiedEvent === 'DEATH_IN_FAMILY' ? 'DEATH IN FAMILY' : 'SENIOR CITIZENSHIP'}
                    </h4>
                  </div>
                </div>
                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-teal-900 text-teal-300 border border-teal-700/50">
                    Confidence: {(confidence * 100).toFixed(0)}%
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1">Grounding: FACT</p>
                </div>
              </div>

              {/* Dynamic Context Questions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-teal-400" />
                    Minimum Required Context
                  </h4>
                  <span className="text-[11px] text-slate-500">Only asking what's needed</span>
                </div>

                <div className="space-y-3">
                  {questions.map((q) => (
                    <div key={q.id} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
                      <label className="block text-xs font-medium text-slate-200">
                        {q.question} {q.required && <span className="text-rose-400">*</span>}
                      </label>

                      {q.type === 'select' ? (
                        <select
                          value={answers[q.field_key] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.field_key]: e.target.value })}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                        >
                          <option value="">Select option...</option>
                          {q.options?.map((opt, i) => (
                            <option key={i} value={opt}>{opt}</option>
                          ))}
                        </select>
                      ) : q.type === 'date' ? (
                        <input
                          type="date"
                          value={answers[q.field_key] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.field_key]: e.target.value })}
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                        />
                      ) : (
                        <input
                          type="text"
                          value={answers[q.field_key] || ''}
                          onChange={(e) => setAnswers({ ...answers, [q.field_key]: e.target.value })}
                          placeholder="Enter details..."
                          className="w-full p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-teal-500"
                        />
                      )}

                      {q.help_text && (
                        <p className="text-[10px] text-slate-400 flex items-center gap-1">
                          <HelpCircle className="w-3 h-3 text-teal-400" />
                          {q.help_text}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>

          {step === 'INPUT' ? (
            <button
              onClick={() => handleClassify()}
              disabled={!userInput.trim() || loading}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <span>Analyze & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleBuildJourney}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-indigo-600 text-white font-semibold text-xs shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Generate Guided Journey</span>
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
