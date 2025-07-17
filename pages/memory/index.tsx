// pages/memory/index.tsx
import React, { useState, useEffect } from 'react';
import { loadRegistryFromStorage, approveZone, declineZone, Zone } from '@/lib/zoneRegistry';

export default function MemoryPage() {
  const [pendingZones, setPendingZones] = useState<Zone[]>([]);

  useEffect(() => {
    console.log('Adding zoneRegistryChange event listener');
    const handleZoneRegistryChange = () => {
      const zones = loadRegistryFromStorage();
      console.log('Loading from localStorage:', zones);
      const safeZones = zones.filter(z => !z.approved);
      setPendingZones(safeZones);
      console.log('ZoneRegistryChange event triggered:', safeZones);
    };

    // Initial load
    handleZoneRegistryChange();

    window.addEventListener('zoneRegistryChange', handleZoneRegistryChange);
    return () => {
      window.removeEventListener('zoneRegistryChange', handleZoneRegistryChange);
    };
  }, []);

  const handleApprove = (zone: Zone) => {
    approveZone(zone);
    setPendingZones(prev => prev.filter(z => z.id !== zone.id));
  };

  const handleDecline = (zone: Zone) => {
    declineZone(zone.id);
    setPendingZones(prev => prev.filter(z => z.id !== zone.id));
  };

  // Always show root in the MemoryPanel
  const rootZone = loadRegistryFromStorage().find(z => z.id === 'root');

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Memory Panel</h1>
      {/*
      Temporarily removing MemoryPanel for debugging.
      <MemoryPanel zone={rootZone}/>
      */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">Zones en attente d’approbation</h2>
        {!pendingZones.length ? (
          <p className="text-gray-600">Aucune zone en attente.</p>
        ) : (
          <ul className="space-y-4">
            {pendingZones.map(z => (
              <li key={z.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <span className="font-medium">{z.name}</span> (Level {z.depth})
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleApprove(z)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                    data-id={`approve-${z.id}`}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(z)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    data-id={`decline-${z.id}`}
                  >
                    Decline
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
