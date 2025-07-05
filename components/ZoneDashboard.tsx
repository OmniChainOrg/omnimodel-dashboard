import React from 'react';
import { useZoneArchetype, Zone } from '@/hooks/useZoneArchetype';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

// Recursive Zone Node component with styled cards
const ZoneNode: React.FC<{ zone: Zone }> = ({ zone }) => (
  <Card className="mb-4">
    <CardContent>
      <div className="flex justify-between items-center">
        <div>
          <p className="text-lg font-semibold">{zone.name}</p>
          <p className="text-xs text-gray-500">Depth: {zone.depth}</p>
        </div>
      </div>
      {zone.children && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="pl-4 mt-3 border-l border-gray-200"
        >
          {zone.children.map(child => (
            <ZoneNode key={child.id} zone={child} />
          ))}
        </motion.div>
      )}
    </CardContent>
  </Card>
);

export const ZoneDashboard: React.FC<{ archetypeId: string; archetypeName: string }> = ({ archetypeId, archetypeName }) => {
  const { tree, loading, error, refresh } = useZoneArchetype({ archetypeId, archetypeName, depth: 4 });

  if (loading) return <p className="text-center py-8">Loading zone archetype...</p>;
  if (error) return <p className="text-red-500 text-center py-8">Error: {error}</p>;

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-2xl font-bold">Zone Archetype: {archetypeName}</h2>
        <Button onClick={refresh} className="mt-4 md:mt-0">
          Refresh
        </Button>
      </div>
      {tree && <ZoneNode zone={tree} />}
    </div>
  );
};
