// pages/memory/index.tsx
import React, { useEffect, useState } from 'react';
import { Zone } from '../../hooks/useZoneArchetype';
import MemoryPanel from '../../components/MemoryPanel';

// Dummy zone for standalone memory page
const dummyZone = {
  id: 'root',
  name: 'Root Zone Prototype',
  path: '/dashboard/root',
  approved: true,
  depth: 1,
};

export default function MemoryPage() {
  const [zone, setZone] = useState<Zone>(dummyZone);

  // You could fetch a real zone here via query or context
  useEffect(() => {
    // Example: load zone from URL? For now, dummy
    setZone(dummyZone);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Memory Panel</h1>
      <MemoryPanel zone={zone} />
    </div>
  );
}
