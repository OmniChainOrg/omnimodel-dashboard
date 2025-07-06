import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Zone } from '../hooks/useZoneArchetype';

// Default generic components
import SirrenaSimControl from './SirrenaSimControl';
import MemoryView from './MemoryView';
import PosteriorFeed from './PosteriorFeed';
import EpistemicEngine from './EpistemicEngine';
import AnchoringTimeline from './AnchoringTimeline';

// Domain-specific overrides (add your domain panels here)
import BiotechSimPanel from './domain/BiotechSimPanel';
import BiotechMemoryExplorer from './domain/BiotechMemoryExplorer';
import BiotechPosteriorFeed from './domain/BiotechPosteriorFeed';
import BiotechEpistemicEngine from './domain/BiotechEpistemicEngine';
// import DeSciSimPanel from './domain/DeSciSimPanel';
// import PublicHealthSimPanel from './domain/PublicHealthSimPanel';

// Map each domain to its contextually relevant panels
const domainViews: Record<string, any> = {
  Biotech: {
    Simulation: BiotechSimPanel,
    Memory: BiotechMemoryExplorer,
    Posterior: BiotechPosteriorFeed,
    Epistemic: BiotechEpistemicEngine,
  },
  DeSci: {
    Simulation: SirrenaSimControl,
    Memory: MemoryView,
    Posterior: PosteriorFeed,
    Epistemic: EpistemicEngine,
  },
  // PublicHealth: { Simulation: PublicHealthSimPanel, ... }
};

// Tabs including anchoring trace
const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic', 'Anchoring'] as const;
type TabKey = typeof tabs[number];

export default function ZoneSubDashboard({ zone }: { zone: Zone }) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Pick domain-specific or generic views
  const views = domainViews[zone.domain] || {
    Simulation: SirrenaSimControl,
    Memory: MemoryView,
    Posterior: PosteriorFeed,
    Epistemic: EpistemicEngine,
  };

  const PanelComponent = (key: TabKey) => {
    switch (key) {
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
      <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
        <Tab.List className="flex space-x-2 border-b border-gray-200">
          {tabs.map((tab) => (
            <Tab
              key={tab}
              className={({ selected }) =>
                `px-4 py-2 font-medium rounded-t-lg ${
                  selected ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                }`
              }
            >
              {tab}
            </Tab>
          ))}
        </Tab.List>
        <Tab.Panels className="mt-4">
          {tabs.map((tab) => (
            <Tab.Panel key={tab}>{PanelComponent(tab)}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}
