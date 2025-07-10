import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ZoneRegistry, approveZone, declineZone, Zone } from '@/lib/zoneRegistry';
import MemoryPanel from '@/components/MemoryPanel';

export default function ZoneSubDashboardPage() {
  const router = useRouter();
  const zoneId = (router.query.zone as string) || 'root';

  // Find the root zone by ID
  const rootZone = ZoneRegistry.find(z => z.id === zoneId);

  // Pending sub-zones under this root (not yet approved)
  const [pendingZones, setPendingZones] = useState<Zone[]>([]);

  useEffect(() => {
    if (!rootZone) return;
    const pendings = ZoneRegistry.filter(z =>
      z.path.startsWith(rootZone.path + '/') && !z.approved
    );
    setPendingZones(pendings);
  }, [rootZone]);

  if (!rootZone) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-red-600">Zone not found</h1>
      </div>
    );
  }

  const handleApprove = (z: Zone) => {
    approveZone(z);
    setPendingZones(prev => prev.filter(item => item.id !== z.id));
  };

  const handleDecline = (z: Zone) => {
    declineZone(z);
    setPendingZones(prev => prev.filter(item => item.id !== z.id));
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">🔹 SubZone Dashboard: {rootZone.name}</h1>

      {pendingZones.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">⏳ Zones en attente d’approbation</h2>
          <ul className="space-y-4">
            {pendingZones.map(z => (
              <li key={z.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="font-medium text-gray-800">{z.name}</p>
                  <p className="text-sm text-gray-500">Level: {z.depth}</p>
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleApprove(z)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(z)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Memory panel for the selected root zone */}
      <MemoryPanel zone={rootZone} />
    </div>
  );
}
