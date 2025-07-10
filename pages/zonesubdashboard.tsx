// pages/zonesubdashboard.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ZoneSubDashboard from '@/components/ZoneSubDashboard';
import {
  ZoneRegistry,
  approveZone,
  declineZone,
  Zone
} from '@/lib/zoneRegistry';

export default function ZoneSubDashboardPage() {
  const router = useRouter();
  const rootZone = ZoneRegistry.find(z => z.id === 'root')!;

  // Pending top-level zones (depth 1, excluding root)
  const [pendingZones, setPendingZones] = useState<Zone[]>(
    ZoneRegistry.filter(z => z.depth === 1 && z.id !== 'root' && !z.approved)
  );
  // Pending sub-zones (depth > 1 under root)
  const [pendingSubZones, setPendingSubZones] = useState<Zone[]>(
    ZoneRegistry.filter(z => z.depth > 1 && z.path.startsWith(rootZone.path + '/') && !z.approved)
  );

  const handleApprove = (z: Zone) => {
    approveZone({ id: z.id, name: z.name, path: z.path, depth: z.depth });
    if (z.depth === 1) {
      setPendingZones(p => p.filter(x => x.id !== z.id));
    } else {
      setPendingSubZones(p => p.filter(x => x.id !== z.id));
    }
  };
  const handleDecline = (z: Zone) => {
    declineZone(z.id);
    if (z.depth === 1) {
      setPendingZones(p => p.filter(x => x.id !== z.id));
    } else {
      setPendingSubZones(p => p.filter(x => x.id !== z.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">🔄 Zones en attente d’approbation</h1>

      {pendingZones.length === 0 ? (
        <p className="text-gray-500 mb-4">Aucune zone en attente.</p>
      ) : (
        pendingZones.map(z => (
          <div key={z.id} className="bg-white p-4 mb-4 rounded-lg shadow">
            <h3 className="text-lg font-semibold">{z.name} (niveau {z.depth})</h3>
            <p className="text-sm text-gray-500">{z.path}</p>
            <div className="flex space-x-2 mt-3">
              <button
                onClick={() => handleApprove(z)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleDecline(z)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Decline
              </button>
            </div>
          </div>
        ))
      )}

      {pendingSubZones.length > 0 && (
        <>
          <h2 className="text-2xl font-bold mb-6">🗂️ Sous-zones en attente d’approbation</h2>
          {pendingSubZones.map(z => (
            <div key={z.id} className="bg-white p-4 mb-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{z.name} (niveau {z.depth})</h3>
              <p className="text-sm text-gray-500">{z.path}</p>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleApprove(z)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(z)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <div className="mt-8">
        <ZoneSubDashboard zone={rootZone} />
      </div>
    </div>
  );
}
