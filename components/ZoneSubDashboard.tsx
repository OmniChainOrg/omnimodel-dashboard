import React, { useState } from 'react';
import MemoryPanel from './MemoryPanel';
import { approveZone, declineZone } from '@/lib/zoneRegistry';

// Zone type (should match your registry)
interface ZoneSubDashboardProps {
  zone: Zone;

const ZoneSubDashboard: React.FC<ZoneSubDashboardProps> = ({ zone }) => {
  const [activeTab, setActiveTab] = useState<string>('Memory');
  const [isApproved, setIsApproved] = useState<boolean>(zone.approved);

  const handleApprove = () => {
    approveZone({ id: zone.id, name: zone.name, path: zone.path, depth: zone.depth });
    setIsApproved(true);
  };

  const handleDecline = () => {
    declineZone(zone.id);
    setIsApproved(false);
  };

  // Choose which panel to render
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
      panelContent = <div>Welcome to the subzone dashboard</div>;
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold mb-4">🔹 SubZone Dashboard: {zone.name}</h2>

      {/* Approval Controls */}
      {!isApproved && (
        <div className="mb-4 flex space-x-2">
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Approve Zone
          </button>
          <button
            onClick={handleDecline}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Decline Zone
          </button>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-2 border-b mb-4">
        {['Memory', 'PosteriorPilot', 'OmniLog', 'NeuroBridge'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-t-lg transition ${
              activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Active Panel */}
      <div>{panelContent}</div>
    </div>
  );
};

export default ZoneSubDashboard;
