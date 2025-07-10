// pages/zonesubdashboard.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import ZoneSubDashboard from '@/components/ZoneSubDashboard';
import {
  useZoneRegistry,
  Zone
} from '@/lib/zoneRegistry';

export default function ZoneSubDashboardPage() {
  const router = useRouter();
  const { approveZone, declineZone, zones } = useZoneRegistry();

  // always show root for approvals
  const rootZone = zones.find(z => z.id === 'root')!;

  // any sub-zone under root that's not yet approved
  const [pending, setPending] = useState<Zone[]>(
    zones.filter(z => z.path.startsWith(rootZone.path + '/') && !z.approved)
  );

  // split pending into root vs child zones
  const rootOnes  = pending.filter(z => z.depth === 1);
  const childOnes = pending.filter(z => z.depth >  1);

  const handleApprove = (z: Zone) => {
    approveZone(z.id);
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
      <div className="mt-8 space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-4">🔹 Root Zones à valider</h2>
          <div className="bg-blue-50 p-4 rounded-lg">
            {rootOnes.length === 0 ? (
              <p className="text-gray-500">Aucun root zone en attente.</p>
            ) : (
              rootOnes.map(z => (
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
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">🔸 Child Zones à valider</h2>
          <div className="bg-yellow-50 p-4 rounded-lg">
            {childOnes.length === 0 ? (
              <p className="text-gray-500">Aucune child zone en attente.</p>
            ) : (
              childOnes.map(z => (
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
        </section>
      </div>
    </div>
  );
}
