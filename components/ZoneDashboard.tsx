import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Placeholder panels for all tabs
const SimulationPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Simulation panel for {zone.name}</div>
);
const MemoryPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Memory panel for {zone.name}</div>
);
const PosteriorPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Posterior panel for {zone.name}</div>
);
const EpistemicPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Epistemic panel for {zone.name}</div>
);
const AnchoringPlaceholder: React.FC<{ zoneId: string }> = ({ zoneId }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Anchoring timeline for {zoneId}</div>
);

// Tabs definition
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');

  // Determine content based on selected tab
  let content: React.ReactNode;
  switch (selectedTab) {
    case 'Simulation':
      content = <SimulationPlaceholder zone={zone} />;
      break;
    case 'Memory':
      content = <MemoryPlaceholder zone={zone} />;
      break;
    case 'Posterior':
      content = <PosteriorPlaceholder zone={zone} />;
      break;
    case 'Epistemic':
      content = <EpistemicPlaceholder zone={zone} />;
      break;
    case 'Anchoring':
      content = <AnchoringPlaceholder zoneId={zone.id} />;
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
      <div className="p-4">
        {content}
      </div>
    </div>
  );
}
