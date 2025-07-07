import React from 'react';
import ZoneSubDashboard from '../components/ZoneSubDashboard';
import { Zone } from '../hooks/useZoneArchetype';

// Dummy or real root zone definition
const rootZone: Zone = {
  id: 'root',
  name: 'Root Zone',
  depth: 0,
  children: [],
};

export default function ZoneSubDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Zone Sub Dashboard</h1>
      <ZoneSubDashboard zone={rootZone} />
    </div>
  );
}
