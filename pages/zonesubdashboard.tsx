// pages/zonesubdashboard.tsx
import React from 'react';
import { useRouter } from 'next/router';
import ZoneSubDashboard from '@/components/ZoneSubDashboard';
import { ZoneRegistry } from '@/lib/zoneRegistry';

export default function ZoneSubDashPage() {
  const router = useRouter();
  const zoneId = router.query.zone as string;

  // Find the zone in the registry
  const zone = ZoneRegistry.find(z => z.id === zoneId);

  if (!zone) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-100">
        <p className="text-gray-500">Aucune zone sélectionnée pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <ZoneSubDashboard zone={zone} />
    </div>
  );
}
