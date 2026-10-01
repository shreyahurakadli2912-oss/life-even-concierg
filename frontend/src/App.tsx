import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { NewLifeEventModal } from './components/NewLifeEventModal';
import { WorkspacePage } from './components/WorkspacePage';
import { ServicesList } from './components/ServicesList';
import { DocumentIntelligencePage } from './components/DocumentIntelligencePage';
import { ActionCenterPage } from './components/ActionCenterPage';
import { MonitoringPage } from './components/MonitoringPage';
import { FrictionAnalyticsPage } from './components/FrictionAnalyticsPage';
import { HistoryPage } from './components/HistoryPage';
import { PrivacySettingsPage } from './components/PrivacySettingsPage';
import type { EventType, Journey } from './types';
import { api } from './services/api';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [activeJourney, setActiveJourney] = useState<Journey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [presetEvent, setPresetEvent] = useState<EventType | undefined>();

  // Pre-load default Child Birth demo journey on mount
  useEffect(() => {
    loadDefaultDemo('CHILD_BIRTH');
  }, []);

  const loadDefaultDemo = async (event_type: EventType) => {
    try {
      const inputs: Record<string, string> = {
        CHILD_BIRTH: 'We had a baby girl yesterday.',
        DEATH_IN_FAMILY: 'My father passed away last week.',
        SENIOR_CITIZEN: 'My mother has turned 60 and retired.'
      };
      const journey = await api.createJourney(event_type, inputs[event_type] || 'New Event', { state: 'Maharashtra' });
      setActiveJourney(journey);
    } catch (err) {
      console.error('Failed to load demo journey:', err);
    }
  };

  const handleStartJourney = (type?: EventType) => {
    if (type) {
      loadDefaultDemo(type);
      setActiveTab('workspace');
    } else {
      setPresetEvent(type);
      setIsModalOpen(true);
    }
  };

  const handleQuickDemo = (type: EventType) => {
    loadDefaultDemo(type);
    setActiveTab('workspace');
  };

  const handleJourneyCreated = (journey: Journey) => {
    setActiveJourney(journey);
    setActiveTab('workspace');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeJourney={activeJourney}
        onQuickDemo={handleQuickDemo}
        onOpenNewEvent={() => handleStartJourney()}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'landing' && (
          <LandingPage onStartJourney={handleStartJourney} />
        )}

        {activeTab === 'workspace' && activeJourney && (
          <WorkspacePage 
            journey={activeJourney} 
            onJourneyUpdated={setActiveJourney}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'services' && (
          <ServicesList context={activeJourney?.context} />
        )}

        {activeTab === 'documents' && (
          <DocumentIntelligencePage />
        )}

        {activeTab === 'action-center' && (
          <ActionCenterPage 
            journey={activeJourney} 
            onJourneyUpdated={setActiveJourney} 
          />
        )}

        {activeTab === 'monitoring' && (
          <MonitoringPage journey={activeJourney} />
        )}

        {activeTab === 'analytics' && (
          <FrictionAnalyticsPage />
        )}

        {activeTab === 'history' && (
          <HistoryPage 
            onSelectJourney={(j) => {
              setActiveJourney(j);
              setActiveTab('workspace');
            }} 
          />
        )}

        {activeTab === 'privacy' && (
          <PrivacySettingsPage />
        )}
      </main>

      {/* Footer */}
      <footer className="glass-panel border-t border-slate-800/80 py-6 px-4 text-center text-xs text-slate-400 space-y-2">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-200">LIFE-EVENT CONCIERGE</span> — Agentic AI Citizen-Service Orchestration Platform
          </p>

          <div className="flex items-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('privacy')} className="hover:text-teal-300 transition-colors">
              Privacy & Responsible AI
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('analytics')} className="hover:text-teal-300 transition-colors">
              Impact Metrics
            </button>
            <span>•</span>
            <button onClick={() => setActiveTab('monitoring')} className="hover:text-teal-300 transition-colors">
              Agent Logs
            </button>
          </div>
        </div>
      </footer>

      {/* New Life Event Drawer Modal */}
      <NewLifeEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJourneyCreated={handleJourneyCreated}
        presetEvent={presetEvent}
      />

    </div>
  );
}
export default App;
