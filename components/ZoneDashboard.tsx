import React from 'react';
import { motion } from 'framer-motion';
import { useZoneArchetype, Zone } from '../hooks/useZoneArchetype';

// Recursive Zone Node with explicit Tailwind styling
const ZoneNode: React.FC<{ zone: Zone }> = ({ zone }) => (
  <motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.2 }}
    className="mb-4"
  >
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold text-gray-800">{zone.name}</p>
          <p className="text-xs text-gray-500">Depth: {zone.depth}</p>
        </div>
      </div>
    </div>
    {zone.children && (
      <div className="ml-6 mt-2 border-l-2 border-gray-200 pl-4">
        {zone.children.map(child => (
          <ZoneNode key={child.id} zone={child} />
        ))}
      </div>
    )}
  </motion.div>
);

export const ZoneDashboard: React.FC<{ archetypeId: string; archetypeName: string }> = ({ archetypeId, archetypeName }) => {
  const { tree, loading, error, refresh } = useZoneArchetype({ archetypeId, archetypeName, depth: 4 });

  if (loading) return <p className="text-center py-8 text-gray-600">Loading zone archetype...</p>;
  if (error) return <p className="text-center py-8 text-red-500">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 md:mb-0">Zone Archetype: {archetypeName}</h2>
        <button
          onClick={refresh}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Refresh
        </button>
      </div>
      <div>
        {tree && <ZoneNode zone={tree} />}
      </div>
    </div>
  );
};
