import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Generic panel components for all tabs
import SirrenaSimPanel from './SirrenaSimPanel';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Inline placeholder panels for Memory and Posterior tabs
const MemoryPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Memory data for {zone.name}</div>
);
const PosteriorPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Posterior data for {zone.name}</div>
);

// Tabs definition
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');

  // Map each tab to its panel component
  const panelMap: Record<TabKey, React.ReactNode> = {
    Simulation: <SirrenaSimPanel zone={zone} />,
    Memory: <MemoryPlaceholder zone={zone} />,
    Posterior: <PosteriorPlaceholder zone={zone} />,
    Epistemic: <EpistemicEngine zone={zone} />,
    Anchoring: <AnchoringTimeline zoneId={zone.id} />,
  };

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
        {panelMap[selectedTab]}
      </div>
    </div>
  );
}
