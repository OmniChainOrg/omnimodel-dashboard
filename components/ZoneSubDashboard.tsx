import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Core panel components
import SirrenaSimPanel from './SirrenaSimPanel';
import MemoryPanel from './MemoryPanel';
import PosteriorPilotDashboard from './PosteriorPilotDashboard';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Map each tab to its panel component
const SimulationPanel: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">SirrenaSimPanel for {zone.name} (replace with real component)</div>
);
const MemoryPanel: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Memory data for {zone.name} (replace with real MemoryPanel)</div>
);
const PosteriorPanel: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Posterior feed for {zone.name} (replace with PosteriorPilotDashboard)</div>
);
const EpistemicPanel: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">EpistemicEngine for {zone.name}</div>
);
const AnchoringPanel: React.FC<{ zoneId: string }> = ({ zoneId }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Anchoring timeline for {zoneId}</div>
);

// Tabs
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

// ZoneSubDashboard
export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');
  
  // Render chosen panel
  let panelContent: React.ReactNode;
  switch (selectedTab) {
    case 'Simulation':
      panelContent = <SimulationPanel zone={zone} />;
      break;
    case 'Memory':
      panelContent = <MemoryPanel zone={zone} />;
      break;
    case 'Posterior':
      panelContent = <PosteriorPanel zone={zone} />;
      break;
    case 'Epistemic':
      panelContent = <EpistemicPanel zone={zone} />;
      break;
    case 'Anchoring':
      panelContent = <AnchoringPanel zoneId={zone.id} />;
      break;
  }

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Zone: {zone.name}</h2>
      <div className="flex space-x-2 mb-4">
        {tabs.map(tab => (
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
}
