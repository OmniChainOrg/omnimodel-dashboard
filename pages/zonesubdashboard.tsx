// pages/zonesubdashboard.tsx
import React, { useState, useEffect } from 'react';
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

  const [pendingZones, setPendingZones] = useState<Zone[]>([]);
  const [pendingSubZones, setPendingSubZones] = useState<Zone[]>([]);

  useEffect(() => {
    setPendingZones(
      ZoneRegistry.filter(z => z.depth === 1 && z.id !== 'root' && !z.approved)
    );
    setPendingSubZones(
      ZoneRegistry.filter(z => z.depth > 1 && z.path.startsWith(rootZone.path + '/') && !z.approved)
    );
  }, [ZoneRegistry.length]);

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

  const allPending = [...pendingZones, ...pendingSubZones];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-6">🔄 Zones en attente d’approbation</h1>

      {allPending.length === 0 ? (
        <p className="text-gray-500 mb-4">Aucune zone en attente.</p>
      ) : (
        <>
          <h2 className="text-xl font-semibold mt-2 mb-3">🧭 All Pending Zones (Merged View)</h2>
          <p className="text-sm text-gray-500 mb-4">Includes all unapproved Zones and SubZones.</p>

          {allPending.map(z => (
            <div key={z.id} className="bg-white p-4 mb-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">
                {z.name}
                <span className={`ml-2 text-xs text-white px-2 py-1 rounded ${z.depth === 1 ? 'bg-indigo-500' : 'bg-blue-600'}`}>
                  {z.depth === 1 ? 'Zone' : 'SubZone'}
                </span>
              </h3>
              <p className="text-sm text-gray-500">Path: {z.path}</p>
              {"createdAt" in z && z["createdAt"] && (
                <p className="text-sm text-gray-400">🕓 Created: {new Date((z as any).createdAt).toLocaleString()}</p>
              )}
              {"twinCount" in z && z["twinCount"] && (
                <p className="text-sm text-gray-400">🧬 Twins: {(z as any).twinCount}</p>
              )}
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

      <div className="mt-12">
        <ZoneSubDashboard zone={rootZone} />
      </div>
    </div>
  );
}
