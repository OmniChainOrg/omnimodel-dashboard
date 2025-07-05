// pages/zonedashboard.tsx
import React from 'react';
import { useZoneArchetype, Zone } from '../hooks/useZoneArchetype';
import { motion } from 'framer-motion';

// Debug banner to confirm this page loads
const DebugBanner: React.FC = () => (
  <div className="bg-red-500 text-white text-center py-2 font-bold">
    DEBUG: zonedashboard.tsx loaded
  </div>
);

// Recursive ZoneNode with styling
const ZoneNode: React.FC<{ zone: Zone }> = ({ zone }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="mb-6"
  >
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-2xl font-semibold text-blue-600">{zone.name}</h3>
      <p className="text-sm text-gray-500">Depth: {zone.depth}</p>
    </div>
    {zone.children && (
      <div className="ml-10 mt-4 border-l-2 border-blue-200 pl-8">
        {zone.children.map(child => (
          <ZoneNode key={child.id} zone={child} />
        ))}
      </div>
    )}
  </motion.div>
);

const ZoneDashboardPage: React.FC = () => {
  const { tree, loading, error, refresh } = useZoneArchetype({
    archetypeId: 'root',
    archetypeName: 'Root Zone Archetype',
    depth: 4,
  });

  React.useEffect(() => {
    console.log('📡 zonedashboard.tsx rendered, loading=', loading);
  }, [loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <DebugBanner />
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Zone Archetype</h1>
          <button
            onClick={refresh}
            className="px-5 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition"
          >
            Refresh Zones
          </button>
        </div>
        {loading && <p className="text-center text-gray-600">Loading zone archetype...</p>}
        {error && <p className="text-center text-red-600">Error: {error}</p>}
        {tree && <ZoneNode zone={tree} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
