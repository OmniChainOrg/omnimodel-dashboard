import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Core generic components
import SirrenaSimPanel from './SirrenaSimPanel';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Domain-specific panels
import BiotechSimPanel from './domain/BiotechSimPanel';
import BiotechMemoryExplorer from './domain/BiotechMemoryExplorer';
import BiotechPosteriorFeed from './domain/BiotechPosteriorFeed';
import BiotechEpistemicEngine from './domain/BiotechEpistemicEngine';
// Add other domain imports as needed

// Secure data fetching hook placeholder
// import useSecureFetch from '@/hooks/useSecureFetch';

// Tabs definition
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

// Domain-to-panel mapping
const domainViews: Record<string, Record<TabKey, React.FC<any>>> = {
  Biotech: {
    Simulation: BiotechSimPanel,
    Memory: BiotechMemoryExplorer,
    Posterior: BiotechPosteriorFeed,
    Epistemic: BiotechEpistemicEngine,
    Anchoring: ({ zoneId }: { zoneId: string }) => <AnchoringTimeline zoneId={zoneId} />,
  },
  // DeSci, Pharma, etc. fall back to generic
};

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');

  // Determine panel component based on domain
  const views = domainViews[zone.domain] || {
    Simulation: SirrenaSimPanel,
    Memory: ({ zone }: { zone: Zone }) => <AnchoringTimeline zoneId={zone.id} />, // placeholder
    Posterior: ({ zone }: { zone: Zone }) => <AnchoringTimeline zoneId={zone.id} />,
    Epistemic: EpistemicEngine,
    Anchoring: ({ zoneId }: { zoneId: string }) => <AnchoringTimeline zoneId={zoneId} />,
  };

  // Secure fetch context could be applied inside each panel
  // const secure = useSecureFetch();

  const Panel = views[selectedTab];

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
        {/* Render the panel, passing necessary props */}
        {selectedTab === 'Anchoring' ? (
          <Panel zoneId={zone.id} />
        ) : (
          <Panel zone={zone} />
        )}
      </div>
    </div>
  );
}
