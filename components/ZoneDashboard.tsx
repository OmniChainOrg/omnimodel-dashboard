import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Core panel components
import SirrenaSimPanel from './SirrenaSimPanel';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Inline placeholders for Memory and Posterior panels until actual components exist
const MemoryPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Memory panel for {zone.name}</div>
);
const PosteriorPlaceholder: React.FC<{ zone: Zone }> = ({ zone }) => (
  <div className="p-4 bg-gray-50 rounded-lg">Posterior panel for {zone.name}</div>
);

// Tabs definition
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');

  // Determine content based on selected tab
  let content: React.ReactNode = null;
  switch (selectedTab) {
    case 'Simulation':
      content = <SirrenaSimPanel zone={zone} />;
      break;
    case 'Memory':
      content = <MemoryPlaceholder zone={zone} />;
      break;
    case 'Posterior':
      content = <PosteriorPlaceholder zone={zone} />;
      break;
    case 'Epistemic':
      content = <EpistemicEngine zone={zone} />;
      break;
    case 'Anchoring':
      content = <AnchoringTimeline zoneId={zone.id} />;
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
