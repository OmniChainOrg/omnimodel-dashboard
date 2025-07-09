import React, { useState } from 'react';
import MemoryPanel from './MemoryPanel';

// Zone type
interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
}

interface ZoneSubDashboardProps {
  zone: Zone;
}

const ZoneSubDashboard: React.FC<ZoneSubDashboardProps> = ({ zone }) => {
  const [activeTab, setActiveTab] = useState<string>('Memory');

  let panelContent: React.ReactNode;
  switch (activeTab) {
    case 'Memory':
      panelContent = <MemoryPanel zone={zone} />;
      break;
    case 'PosteriorPilot':
      panelContent = <div>PosteriorPilot content placeholder</div>;
      break;
    case 'OmniLog':
      panelContent = <div>OmniLog content placeholder</div>;
      break;
    case 'NeuroBridge':
      panelContent = <div>NeuroBridge content placeholder</div>;
      break;
    default:
      panelContent = <div>Welcome to the zone dashboard</div>;
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-4">🔹 SubZone Dashboard: {zone.name}</h2>
      <div className="flex space-x-4 mb-4">
        {['Memory', 'PosteriorPilot', 'OmniLog', 'NeuroBridge'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="mt-4">{panelContent}</div>
    </div>
  );
};

export default ZoneSubDashboard;
