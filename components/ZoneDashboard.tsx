import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Core panel components
import SirrenaSimPanel from './SirrenaSimPanel';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Placeholder components for Memory and Posterior until real ones are available
const MemoryView: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Memory data for {zone.name}</div>
);
const PosteriorFeed: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Posterior feed for {zone.name}</div>
);

// Tabs definition
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');

  // Map each tab to its panel component
  const panelMap: Record<TabKey, React.ReactNode> = {
    Simulation: <SirrenaSimPanel zone={zone} />,  // expects zone prop
    Memory: <MemoryView zone={zone} />,           // placeholder
    Posterior: <PosteriorFeed zone={zone} />,    // placeholder
    Epistemic: <EpistemicEngine />,               // generic
    Anchoring: <AnchoringTimeline zoneId={zone.id} />,  // expects zoneId
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
