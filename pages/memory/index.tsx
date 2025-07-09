// /pages/memory/index.tsx
import React, { useState, useEffect } from 'react';
import MemoryPanel from '../../components/MemoryPanel';
import { ZoneRegistry } from '../../lib/zoneRegistry';
import { approveZone, declineZone } from '../../lib/updateRegistry';

export default function MemoryPage() {
  const [pendingZones, setPendingZones] = useState<typeof ZoneRegistry>([]);

  // On récupère les zones en attente (approved === false)
  useEffect(() => {
    setPendingZones(ZoneRegistry.filter(z => !z.approved));
  }, []);

  const handleApprove = (zone: typeof ZoneRegistry[0]) => {
    approveZone(zone);
    setPendingZones(p => p.filter(z => z.id !== zone.id));
  };

  const handleDecline = (zone: typeof ZoneRegistry[0]) => {
    declineZone(zone.id);
    setPendingZones(p => p.filter(z => z.id !== zone.id));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Memory Panel</h1>

      {/* 🧠 Le panel mémoire pour une zone fixe (existant) */}
      <MemoryPanel zone={ZoneRegistry.find(z => z.id === 'root')!} />

      {/* Liste des zones fraîchement générées */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-2">🔄 Zones en attente d’approbation</h2>
        {pendingZones.length === 0 ? (
          <p className="text-gray-600">Aucune zone en attente.</p>
        ) : (
          <ul className="space-y-4">
            {pendingZones.map(zone => (
              <li key={zone.id} className="p-4 bg-white rounded shadow flex justify-between items-center">
                <div>
                  <span className="font-medium">{zone.name}</span> (level {zone.depth})
                </div>
                <div className="space-x-2">
                  <button
                    onClick={() => handleApprove(zone)}
                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDecline(zone)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
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

