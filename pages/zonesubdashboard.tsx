// pages/zonesubdashboard.tsx
import React, { useState, useEffect } from 'react';
import { approveZone, declineZone, loadRegistryFromStorage, Zone } from '@/lib/zoneRegistry';
import type { Zone } from '@/types/Zone';

export default function ZoneSubDashboardPage() {
  // local zones state, initialized from storage
  const [zones, setZones] = useState<Zone[]>(() => loadRegistryFromStorage());

  // listen for registry updates across tabs via the browser storage event
  useEffect(() => {
    console.log('Adding storage event listener');
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'zoneRegistry') {
        const updatedZones = loadRegistryFromStorage();
        setZones(updatedZones);
        console.log('Storage event triggered:', updatedZones);
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // On mount: listen for registry changes within the current tab
  useEffect(() => {
    console.log('Adding zoneRegistryChange event listener');
    const onChange = () => {
      const updatedZones = loadRegistryFromStorage();
      setZones(updatedZones);
      console.log('Custom event triggered:', updatedZones);
    };
    window.addEventListener('zoneRegistryChange', onChange);
    // initial pending computation
    onChange();
    return () => window.removeEventListener('zoneRegistryChange', onChange);
  }, []);

  // pending list, updated when zones change
  const [pending, setPending] = useState<Zone[]>([]);
  useEffect(() => {
    const root = zones.find(z => z.depth === 1);
    console.log('Root zone found:', root);
    const rootPath = root?.path || '/default/path'; // Provide a default path
    console.log('Root path:', rootPath);
    const safeZones = zones.filter(
      z => typeof z.path === 'string' && z.path.startsWith(rootPath) && !z.approved
    );
    setPending(safeZones);
    console.log('Pending zones calculated:', safeZones);
  }, [zones]);

  // split pending
  const rootOnes = pending.filter(z => z.depth === 1);
  const childOnes = pending.filter(z => z.depth > 1);

  console.log('Root zones:', rootOnes);
  console.log('Child zones:', childOnes);

  // handlers
  const handleApprove = (z: Zone) => {
    approveZone(z);
    setPending(prev => prev.filter(zone => zone.id !== z.id));
  };

  const handleDecline = (z: Zone) => {
    declineZone(z.id);
    setPending(prev => prev.filter(zone => zone.id !== z.id));
  };

  const handleApproveAllRoot = () => {
    rootOnes.forEach(z => approveZone(z));
    setPending(prev => prev.filter(zone => !rootOnes.includes(zone)));
  };

  const handleDeclineAllRoot = () => {
    rootOnes.forEach(z => declineZone(z.id));
    setPending(prev => prev.filter(zone => !rootOnes.includes(zone)));
  };

  const handleApproveAllChild = () => {
    childOnes.forEach(z => approveZone(z));
    setPending(prev => prev.filter(zone => !childOnes.includes(zone)));
  };

  const handleDeclineAllChild = () => {
    childOnes.forEach(z => declineZone(z.id));
    setPending(prev => prev.filter(zone => !childOnes.includes(zone)));
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="space-y-8">
        {/* Root zones section */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Root Zones à valider</h2>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleApproveAllRoot}
              disabled={rootOnes.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              data-id="approve-all-root"
            >
              Approve All
            </button>
            <button
              onClick={handleDeclineAllRoot}
              disabled={rootOnes.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              data-id="decline-all-root"
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
                  <h3 className="text-lg font-semibold">{z.name} (niveau {z.depth})</h3>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleApprove(z)}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      data-id={`approve-${z.id}`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(z)}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      data-id={`decline-${z.id}`}
                    >
                      Decline
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Child zones section */}
        <section>
          <h2 className="text-2xl font-bold mb-2">Child Zones à valider</h2>
          <div className="flex space-x-2 mb-4">
            <button
              onClick={handleApproveAllChild}
              disabled={childOnes.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              data-id="approve-all-child"
            >
              Approve All
            </button>
            <button
              onClick={handleDeclineAllChild}
              disabled={childOnes.length === 0}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              data-id="decline-all-child"
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
                  <h3 className="text-lg font-semibold">{z.name} (niveau {z.depth})</h3>
                  <div className="flex space-x-2 mt-3">
                    <button
                      onClick={() => handleApprove(z)}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      data-id={`approve-${z.id}`}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDecline(z)}
                      className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                      data-id={`decline-${z.id}`}
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
