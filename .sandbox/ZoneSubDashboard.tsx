import React, { useState } from 'react';
import { approveZone, declineZone } from '@/lib/zoneRegistry';
import { Zone } from '@/lib/zoneRegistry';

interface ZoneSubDashboardProps {
  zone: Zone;
}

const ZoneSubDashboard: React.FC<ZoneSubDashboardProps> = ({ zone }) => {
  const [activeTab, setActiveTab] = useState<string>('Memory');
  const [isApproved, setIsApproved] = useState<boolean>(zone.approved);

  const handleApprove = () => {
    approveZone(zone);
    setIsApproved(true);
  };

  const handleDecline = () => {
    declineZone(zone.id);
    setIsApproved(false);
  };

  let panelContent: React.ReactNode;
  switch (activeTab) {
    case 'Memory':
      // panelContent = <MemoryPanel zone={zone} />;
      break;
    default:
      panelContent = null;
  }

  return (
    <div className="bg-white rounded shadow p-6">
      <h2 className="text-xl font-bold mb-2">🔹 SubZone Dashboard: {zone.name}</h2>

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

      <div className="flex space-x-2 border-b mb-4">
        <button
          onClick={() => setActiveTab('Memory')}
          className={`px-4 py-2 rounded-t-lg ${
            activeTab === 'Memory' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Memory
        </button>
      </div>

      <div>{panelContent}</div>
    </div>
  );
};

export default ZoneSubDashboard;
