// pages/zonesubdashboard.tsx
import React, { useState } from 'react';
import { Zone } from '@/lib/zoneRegistry';
import ZoneSubDashboard from '@/components/ZoneSubDashboard';
import { ZoneRegistry, approveZone, declineZone } from '@/lib/zoneRegistry';

export default function ZoneSubDashPage() {
  const router = useRouter();

  // Always show the root zone dashboard
  const rootZone: Zone = ZoneRegistry.find(z => z.id === 'root')!;

  // Pending sub-zones are those under root path and not yet approved
  const [pending, setPending] = useState<Zone[]>(
    ZoneRegistry.filter(z => z.path.startsWith(rootZone.path + '/') && !z.approved)
  );

  const handleApprove = (zone: Zone) => {
    approveZone({ id: zone.id, name: zone.name, path: zone.path, depth: zone.depth });
    setPending(p => p.filter(z => z.id !== zone.id));
  };
  const handleDecline = (zone: Zone) => {
    declineZone(zone.id);
    setPending(p => p.filter(z => z.id !== zone.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Root Zone Memory */}
      <ZoneSubDashboard zone={rootZone} />

      {/* Pending Approvals */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">🔄 Zones en attente d’approbation</h2>
        {pending.length === 0 ? (
          <p className="text-gray-500">Aucune zone en attente.</p>
        ) : (
          pending.map(zone => (
            <div key={zone.id} className="bg-white p-4 mb-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">{zone.name} (level {zone.depth})</h3>
              <div className="flex space-x-2 mt-3">
                <button
                  onClick={() => handleApprove(zone)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >Approver</button>
                <button
                  onClick={() => handleDecline(zone)}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >Refuser</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
