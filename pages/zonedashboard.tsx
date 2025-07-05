// pages/zonedashboard.tsx
import React, { useState } from 'react';
import { useZoneArchetype, Zone } from '../hooks/useZoneArchetype';
import { motion } from 'framer-motion';

// Recursive ZoneNode with Tailwind styling + motion
const ZoneNode: React.FC<{ zone: Zone }> = ({ zone }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.3 }}
    className="mb-6"
  >
    <div className="p-6 bg-white rounded-2xl shadow-lg">
      <h3 className="text-xl font-semibold text-blue-600">{zone.name}</h3>
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
  // Form state
  const [archetypeId, setArchetypeId] = useState('root');
  const [archetypeName, setArchetypeName] = useState('Root Zone Archetype');
  const [depth, setDepth] = useState(4);

  // Fetch / regenerate on submit
  const { tree, loading, error, refresh } = useZoneArchetype({ archetypeId, archetypeName, depth });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-8">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">CE² Zone Archetype Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Archetype ID</label>
            <input
              type="text"
              value={archetypeId}
              onChange={e => setArchetypeId(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Archetype Name</label>
            <input
              type="text"
              value={archetypeName}
              onChange={e => setArchetypeName(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Depth</label>
            <input
              type="number"
              min={1}
              max={6}
              value={depth}
              onChange={e => setDepth(Number(e.target.value))}
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
        {tree && <ZoneNode zone={tree} />}
      </div>
    </div>
  );
};

export default ZoneDashboardPage;
