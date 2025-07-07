import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Real panel components (commented out due to prop mismatch)
// import SirrenaSimPanel from './SirrenaSimPanel';
// import RealMemoryPanel from './MemoryPanel';
// import PosteriorPilotDashboard from './PosteriorPilotDashboard';
// import EpistemicEngine from './EpistemicEngine';
// import AnchoringTimeline from './AnchoringTimeline';

// Dummy/fallback panel components with correct prop signature
const SimulationPanel: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    SirrenaSimPanel for {zone.name} (dummy fallback)
  </div>
);
const MemoryPanelFallback: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    Memory data for {zone.name} (dummy fallback)
  </div>
);
const PosteriorPilotDashboardFallback: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    PosteriorPilotDashboard for {zone.name} (dummy fallback)
  </div>
);
const EpistemicEngineFallback: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    EpistemicEngine for {zone.name} (dummy fallback)
  </div>
);
const AnchoringTimelineFallback: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">
    AnchoringTimeline for {zone.name} (dummy fallback)
  </div>
);

// Main dashboard component
const ZoneSubDashboard: React.FC<{ zone: Zone }> = ({ zone }) => {
  const [selectedTab, setSelectedTab] = useState<string>('Simulation');
  const tabs = ['Simulation', 'Memory', 'PosteriorPilot', 'EpistemicEngine', 'AnchoringTimeline'];

  let panelContent: React.ReactNode;
  switch (selectedTab) {
    case 'Simulation':
      panelContent = <SimulationPanel zone={zone} />;
      break;
    case 'Memory':
      panelContent = <MemoryPanelFallback zone={zone} />;
      break;
    case 'PosteriorPilot':
      panelContent = <PosteriorPilotDashboardFallback zone={zone} />;
      break;
    case 'EpistemicEngine':
      panelContent = <EpistemicEngineFallback zone={zone} />;
      break;
    case 'AnchoringTimeline':
      panelContent = <AnchoringTimelineFallback zone={zone} />;
      break;
    default:
      panelContent = null;
  }

  return (
    <div>
      <div className="flex space-x-2 border-b">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              selectedTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">{panelContent}</div>
    </div>
  );
};

export default ZoneSubDashboard;
