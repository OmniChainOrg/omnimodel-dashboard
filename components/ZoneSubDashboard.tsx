import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Core panel components
import SirrenaSimPanel from './SirrenaSimPanel';
import MemoryPanel from '../pages/memory';
import PosteriorPanel from './PosteriorPilotDashboard';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Tabs definition
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');

  // Generic mapping of tabs to panels
  const panelMap: Record<TabKey, React.ReactNode> = {
    Simulation: <SirrenaSimPanel zone={zone} />,
    Memory: <MemoryPanel zone={zone} />,
    Posterior: <PosteriorPanel zone={zone} />,
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
