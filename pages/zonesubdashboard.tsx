// pages/zonesubdashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  ZoneRegistry,
  approveZone,
  declineZone,
  Zone
} from '@/lib/zoneRegistry';

export default function ZoneSubDashboardPage() {
  // force re-render on registry updates
  const [tick, setTick] = useState(0);

// On mount: load any saved registry
  useEffect(() => {
    loadRegistryFromStorage();
    // trigger initial render
    setTick(t => t + 1);

    // listen for subsequent changes
    const onChange = () => setTick(t => t + 1);
    window.addEventListener('zoneRegistryChange', onChange);
    return () => window.removeEventListener('zoneRegistryChange', onChange);
  }, []);

  // fetch latest pending zones each render
  const pending = ZoneRegistry.filter(
    z => z.path.startsWith(ZoneRegistry.find(r => r.id === 'root')!.path + '/') && !z.approved
  );

  // split pending into root vs child zones
  const rootOnes  = pending.filter(z => z.depth === 1);
  const childOnes = pending.filter(z => z.depth >  1);

  const refresh = () => setTick(t => t + 1);

  const handleApprove = (z: Zone) => {
    approveZone({ id: z.id, name: z.name, path: z.path, depth: z.depth });
    refresh();
  };

  const handleDecline = (z: Zone) => {
    declineZone(z.id);
    refresh();
  };

  const handleApproveAllRoot = () => {
    rootOnes.forEach(z => approveZone({ id: z.id, name: z.name, path: z.path, depth: z.depth }));
    refresh();
  };

  const handleDeclineAllRoot = () => {
    rootOnes.forEach(z => declineZone(z.id));
    refresh();
  };

  const handleApproveAllChild = () => {
    childOnes.forEach(z => approveZone({ id: z.id, name: z.name, path: z.path, depth: z.depth }));
    refresh();
  };

  const handleDeclineAllChild = () => {
    childOnes.forEach(z => declineZone(z.id));
    refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Pending approvals list per section */}
      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-bold mb-2">🔹 Root Zones à valider</h2>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleApproveAllRoot}
              disabled={rootOnes.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Approve All
            </button>
            <button
              onClick={handleDeclineAllRoot}
              disabled={rootOnes.length === 0}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Decline All
            </button>
          </div>
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
          <h2 className="text-2xl font-bold mb-2">🔸 Child Zones à valider</h2>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleApproveAllChild}
              disabled={childOnes.length === 0}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              Approve All
            </button>
            <button
              onClick={handleDeclineAllChild}
              disabled={childOnes.length === 0}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              Decline All
            </button>
          </div>
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
