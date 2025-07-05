import React from 'react';
import { useZoneArchetype } from '@/hooks/useZoneArchetype';

interface ZoneProps {
  zone: {
    id: string;
    name: string;
    depth: number;
    children?: any[];
  };
}

const ZoneNode: React.FC<ZoneProps> = ({ zone }) => (
  <ul className="ml-4 border-l border-gray-300 pl-2">
    <li>
      <strong>{zone.name}</strong> (Depth: {zone.depth})
      {zone.children && zone.children.map((child) => (
        <ZoneNode key={child.id} zone={child} />
      ))}
    </li>
  </ul>
);

export const ZoneDashboard: React.FC<{ archetypeId: string; archetypeName: string }> = ({ archetypeId, archetypeName }) => {
  const { tree, loading, error, refresh } = useZoneArchetype({ archetypeId, archetypeName, depth: 4 });

  if (loading) return <p>Loading zone archetype...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-xl font-bold mb-2">Zone Archetype: {archetypeName}</h2>
      <button onClick={refresh} className="mb-4 px-3 py-1 bg-blue-600 text-white rounded">Refresh</button>
      {tree ? <ZoneNode zone={tree} /> : <p>No data</p>}
    </div>
  );
};
