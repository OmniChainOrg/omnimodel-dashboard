// lib/zoneRegistry.ts

export interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
}

export const ZoneRegistry: Zone[] = [
  // Root “Memory Panel” zone
  {
    id: 'root',
    name: 'Root Zone Prototype',
    path: '/dashboard/root',
    approved: true,
    depth: 1,
  },

  // Built-in zones
  {
    id: 'omnitwin',
    name: 'OmniTwin',
    path: '/dashboard/omnitwin',
    approved: true,
    depth: 1,
  },
  {
    id: 'hopechain',
    name: 'HOPEChain',
    path: '/dashboard/hopechain',
    approved: true,
    depth: 1,
  },

  // … add more defaults here as needed …
];

/**
 * Mark a zone as approved (or insert it if new)
 */
export function approveZone(zoneData: {
  id: string;
  name: string;
  path: string;
  depth: number;
}) {
  const existing = ZoneRegistry.find(z => z.id === zoneData.id);
  if (existing) {
    existing.approved = true;
  } else {
    ZoneRegistry.push({ ...zoneData, approved: true });
  }
}

/**
 * Remove a zone by ID
 */
export function declineZone(zoneId: string) {
  const idx = ZoneRegistry.findIndex(z => z.id === zoneId);
  if (idx !== -1) {
    ZoneRegistry.splice(idx, 1);
  }
}
