// components/ZoneSubDashboard.tsx
import React, { useState } from 'react';
import MemoryPanel from './MemoryPanel';
import { Zone, addZone, approveZone, declineZone } from '@/lib/zoneRegistry';  // ← import shared Zone

interface ZoneSubDashboardProps {
  zone: Zone;    // ← now matches registry’s Zone (with children)
}

const ZoneSubDashboard: React.FC<ZoneSubDashboardProps> = ({ zone }) => {
  const [activeTab, setActiveTab] = useState<'Memory' | 'Approve' | 'Decline'>('Memory');

  // Pending sub-zones are those under this zone’s path and not yet approved
  const pending = ZoneRegistry.filter(z =>
    z.path.startsWith(zone.path + '/') && !z.approved
  );

  let panelContent: React.ReactNode;
  switch (activeTab) {
    case 'Memory':
      panelContent = <MemoryPanel zone={zone} />;
      break;
    case 'Approve':
      panelContent = (
        <div>
          <h3>Pending Sub-Zones</h3>
          {pending.map(z => (
            <div key={z.id} className="flex space-x-2">
              <span>{z.name}</span>
              <button onClick={() => approveZone(z.id)}>✅ Approve</button>
              <button onClick={() => declineZone(z.id)}>❌ Decline</button>
            </div>
          ))}
          {!pending.length && <p>No pending zones.</p>}
        </div>
      );
      break;
    case 'Decline':
      panelContent = <p>Use the Approve tab to manage pending zones.</p>;
      break;
    default:
      panelContent = null;
  }

  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-bold mb-4">🔹 SubZone Dashboard: {zone.name}</h2>
      <div className="flex space-x-4 mb-4">
        {['Memory', 'Approve', 'Decline'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
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
