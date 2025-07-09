// pages/zonesubdashboard.tsx
import React from 'react';
import ZoneSubDashboard from '../components/ZoneSubDashboard';
import { Zone } from '../hooks/useZoneArchetype';

// On définit la zone de test avec tous les champs requis
const rootZone = {
  id: 'root',
  name: 'Root Zone Prototype',
  path: '/dashboard/root',
  approved: true,
  depth: 1,
};

export default function ZoneSubDashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-4">Zone Sub Dashboard</h1>
      <ZoneSubDashboard zone={rootZone} />
    </div>
  );
}
