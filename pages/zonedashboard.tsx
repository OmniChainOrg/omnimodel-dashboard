// pages/zonedashboard.tsx
import React, { useState, useEffect } from 'react';
import { useZoneArchetype, Zone as ArchetypeZone } from '../hooks/useZoneArchetype';
import { motion } from 'framer-motion';
import { addZone, loadRegistryFromStorage } from '@/lib/zoneRegistry';
import { useRouter } from 'next/router';

// Zone type, derived from archetype hook
export type ZoneType = ArchetypeZone;

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
          <ZoneNode key={child.id} zone={child} />
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

  // Load saved registry on mount
  useEffect(() => {
    loadRegistryFromStorage();
    // trigger initial render after loading
    setTick(t => t + 1);
  }, []);

  // Generate or fetch zone tree
  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: zoneDomain,
    archetypeName: prototypeZoneName,
    depth: recursionLevel,
  });

  // When a new tree is fetched, add zones and navigate
  useEffect(() => {
    if (!tree) return;
    const traverseAndAdd = (z: ZoneType) => {
      if (z.path) {
        addZone({ id: z.id, name: z.name, path: z.path, depth: z.depth });
      }
      z.children?.forEach(child => traverseAndAdd(child));
    };
    traverseAndAdd(tree);
    // navigate then dispatch change
    router.push('/zonesubdashboard').then(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('zoneRegistryChange'));
      }
    });
  }, [tree, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refresh();
  };

  // Fallback tree if none
  const dummyTree: ZoneType = {
    id: 'root',
    name: prototypeZoneName,
    path: '/dashboard/root',
    approved: true,
    depth: 1,
    children: [
      { id: 'sub1', name: 'SubZone A', path: '/dashboard/root/sub1', approved: true, depth: 2, children: [] },
      { id: 'sub2', name: 'SubZone B', path: '/dashboard/root/sub2', approved: true, depth: 2, children: [] },
    ],
  };

  const displayTree = tree ?? dummyTree;

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
              Prototype Zone Name
              <span className="text-xs text-gray-500"> (shown in main dashboard)</span>
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
          <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition">
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
