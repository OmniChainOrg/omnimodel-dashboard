// pages/zonedashboard.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { useZoneArchetype, Zone as ArchetypeZone } from '../hooks/useZoneArchetype';
import { addZone, loadRegistryFromStorage } from '@/lib/zoneRegistry';

// Merge the archetype hook's Zone with registry-specific fields
export type ZoneType = ArchetypeZone & {
  path: string;
  approved?: boolean;
};

// Recursive node component for displaying zones
const ZoneNode: React.FC<{ zone: ZoneType }> = ({ zone }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="mb-4"
  >
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-800">{zone.name}</h3>
      <p className="text-sm text-gray-500">Level: {zone.depth}</p>
    </div>
    {zone.children && zone.children.length > 0 && (
      <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-4">
        {zone.children.map(child => (
          <ZoneNode key={child.id} zone={child as ZoneType} />
        ))}
      </div>
    )}
  </motion.div>
);

const ZoneDashboardPage: React.FC = () => {
  const router = useRouter();

  // Form state
  const [zoneDomain, setZoneDomain] = useState('Biotech');
  const [prototypeZoneName, setPrototypeZoneName] = useState('Root Zone Prototype');
  const [recursionLevel, setRecursionLevel] = useState(4);
  const [tick, setTick] = useState(0);

  // On mount: load saved registry and listen for updates
  useEffect(() => {
    loadRegistryFromStorage();
    setTick(t => t + 1);
    const onChange = () => setTick(t => t + 1);
    window.addEventListener('zoneRegistryChange', onChange);
    return () => window.removeEventListener('zoneRegistryChange', onChange);
  }, []);

  // Fetch or generate the zone tree
  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: zoneDomain,
    archetypeName: prototypeZoneName,
    depth: recursionLevel,
  });

  // When a new tree arrives, clear old registry, add new zones, then navigate
  useEffect(() => {
    if (!tree) return;

    // Clear existing zones so we only show the new set
    localStorage.removeItem('zoneRegistry');

    // Recursively add zones as "pending"
    const addAll = (z: ZoneType) => {
      addZone({ id: z.id, name: z.name, path: z.path, depth: z.depth, approved: false });
      z.children?.forEach(child => addAll(child as ZoneType));
    };
    addAll(tree as ZoneType);

    // Log out the stored registry for verification
    console.log('Zones added:', JSON.parse(localStorage.getItem('zoneRegistry') || '[]'));

    // Navigate and notify subdashboard to reload
    router.push('/zonesubdashboard').then(() => {
      window.dispatchEvent(new Event('zoneRegistryChange'));
    });
  }, [tree, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refresh();
  };

  // Fallback dummy tree including path and approved
  const dummyTree: ZoneType = {
    id: 'root',
    name: prototypeZoneName,
    path: '/dashboard/root',
    approved: false,
    depth: 1,
    children: [
      {
        id: 'sub1',
        name: 'SubZone A',
        path: '/dashboard/root/sub1',
        approved: false,
        depth: 2,
        children: []
      },
      {
        id: 'sub2',
        name: 'SubZone B',
        path: '/dashboard/root/sub2',
        approved: false,
        depth: 2,
        children: []
      }
    ] as ZoneType[],
  };

  const displayTree = (tree as ZoneType) ?? dummyTree;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">CE² Zone Prototype Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zone Domain</label>
            <select
              value={zoneDomain}
              onChange={e => setZoneDomain(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option>Biotech</option>
              <option>RegOps</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Prototype Zone Name <span className="text-xs text-gray-500">(shown in main dashboard)</span>
            </label>
            <input
              type="text"
              value={prototypeZoneName}
              onChange={e => setPrototypeZoneName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Level of Recursion</label>
            <input
              type="number"
              min={1}
              max={6}
              value={recursionLevel}
              onChange={e => setRecursionLevel(Number(e.target.value))}
              className="mt-1 block w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Generate Zones
          </button>
        </form>

        {loading && <p className="text-center text-gray-600">Generating zone tree...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        <ZoneNode zone={displayTree} />
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
