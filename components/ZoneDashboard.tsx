import React from 'react';
import { useZoneArchetype, Zone } from '../hooks/useZoneArchetype';
import { motion } from 'framer-motion';

// Recursive Zone Node with Tailwind styling
const ZoneNode: React.FC<{ zone: Zone }> = ({ zone }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2 }}
    className="mb-6"
  >
    <div className="p-5 bg-white rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-gray-800">{zone.name}</h3>
      <p className="text-sm text-gray-500">Depth: {zone.depth}</p>
    </div>
    {zone.children && (
      <div className="ml-8 mt-4 border-l-2 border-gray-200 pl-6">
        {zone.children.map(child => (
          <ZoneNode key={child.id} zone={child} />
        ))}
      </div>
    )}
  </motion.div>
);

const ZoneDashboardPage: React.FC = () => {
  const { tree, loading, error, refresh } = useZoneArchetype({ archetypeId: 'root', archetypeName: 'Root Zone Archetype', depth: 4 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Zone Archetype: Root Zone Archetype</h1>
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
          >
            Refresh Zones
          </button>
        </div>
        {loading && <p className="text-center text-gray-600">Loading zone archetype...</p>}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {tree && <ZoneNode zone={tree} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
