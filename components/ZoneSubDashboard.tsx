import React, { useState } from 'react';
import { Zone } from '../hooks/useZoneArchetype';

// Default generic components
import SirrenaSim from './SirrenaSim';
import MemoryView from './MemoryView';
import PosteriorFeed from './PosteriorFeed';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Domain-specific overrides (add your domain panels here)
import BiotechSimPanel from './domain/BiotechSimPanel';
import BiotechMemoryExplorer from './domain/BiotechMemoryExplorer';
import BiotechPosteriorFeed from './domain/BiotechPosteriorFeed';
import BiotechEpistemicEngine from './domain/BiotechEpistemicEngine';

// Map each domain to its contextually relevant panels
const domainViews: Record<string, Record<string, React.FC<any>>> = {
  Biotech: {
    Simulation: BiotechSimPanel,
    Memory: BiotechMemoryExplorer,
    Posterior: BiotechPosteriorFeed,
    Epistemic: BiotechEpistemicEngine,
  },
  DeSci: {
    Simulation: SirrenaSim,
    Memory: MemoryView,
    Posterior: PosteriorFeed,
    Epistemic: EpistemicEngine,
  },
};

const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;

type TabKey = typeof tabs[number];

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedTab, setSelectedTab] = useState<TabKey>('Simulation');

  // Pick domain-specific or generic views
  const views = domainViews[zone.domain] || {
    Simulation: SirrenaSimControl,
    Memory: MemoryView,
    Posterior: PosteriorFeed,
    Epistemic: EpistemicEngine,
  };

  const renderPanel = () => {
    switch (selectedTab) {
      case 'Simulation':
        return <views.Simulation zone={zone} />;
      case 'Memory':
        return <views.Memory zone={zone} />;
      case 'Posterior':
        return <views.Posterior zone={zone} />;
      case 'Epistemic':
        return <views.Epistemic zone={zone} />;
      case 'Anchoring':
        return <AnchoringTimeline zoneId={zone.id} />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Zone: {zone.name}</h2>
      <div className="flex space-x-2 mb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`px-4 py-2 font-medium rounded-t-lg transition ${
              selectedTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">
        {renderPanel()}
      </div>
    </div>
  );
}
