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
  // always show root for approvals
  const rootZone = ZoneRegistry.find(z => z.id === 'root')!;

  // any sub-zone under root that's not yet approved
  const [pending, setPending] = useState<Zone[]>(
    ZoneRegistry.filter(z => z.path.startsWith(rootZone.path + '/') && !z.approved)
  );

  const handleApprove = (z: Zone) => {
    approveZone({ id: z.id, name: z.name, path: z.path, depth: z.depth });
    setPending(p => p.filter(x => x.id !== z.id));
  };
  const handleDecline = (z: Zone) => {
    declineZone(z.id);
    setPending(p => p.filter(x => x.id !== z.id));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* 1️⃣ Sub-zone dashboard with tabs including Memory etc. */}
      <ZoneSubDashboard zone={rootZone} />

      {/* 2️⃣ Pending approvals list */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">🔄 Zones en attente d’approbation</h2>

        {pending.length === 0 ? (
          <p className="text-gray-500">Aucune sous-zone en attente.</p>
        ) : (
          pending.map(z => (
            <div key={z.id} className="bg-white p-4 mb-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">
                {z.name} (niveau {z.depth})
              </h3>
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
      </div>
    </div>
  );
}
