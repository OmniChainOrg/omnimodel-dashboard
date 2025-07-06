import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { Zone } from '../hooks/useZoneArchetype';
import SirrenaSimControl from './SirrenaSimControl';
import MemoryView from './MemoryView';
import PosteriorFeed from './PosteriorFeed';
import EpistemicEngine from './EpistemicEngine';

const tabs = ['Simulation', 'Memory', 'Posterior', 'Epistemic'] as const;

type TabKey = typeof tabs[number];

export const ZoneSubDashboard: React.FC<{ zone: Zone }> = ({ zone }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Details for {zone.name}</h2>
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
          <Tab.Panel>
            <SirrenaSimControl zone={zone} />
          </Tab.Panel>
          <Tab.Panel>
            <MemoryView zone={zone} />
          </Tab.Panel>
          <Tab.Panel>
            <PosteriorFeed zone={zone} />
          </Tab.Panel>
          <Tab.Panel>
            <EpistemicEngine
              /* pass in zone-specific metrics here */
            />
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
