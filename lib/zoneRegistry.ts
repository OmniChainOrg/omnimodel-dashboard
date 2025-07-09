// lib/zoneRegistry.ts

// Definition of Zone with all required fields
export interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
}

// Initial registry of zones
export const ZoneRegistry: Zone[] = [
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
  // Add other initial zones here
];

/**
 * Approve a new zone or re-approve an existing one.
 * If the zone ID already exists, only the 'approved' flag is set to true.
 * Otherwise, the zone is pushed into the registry with approved = true.
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
    ZoneRegistry.push({
      id: zoneData.id,
      name: zoneData.name,
      path: zoneData.path,
      approved: true,
      depth: zoneData.depth,
    });
  }
}

/**
 * Decline (remove) a zone by its ID.
 * If the zone is found, it is spliced out of the registry.
 */
export function declineZone(zoneId: string) {
  const idx = ZoneRegistry.findIndex(z => z.id === zoneId);
  if (idx !== -1) {
    ZoneRegistry.splice(idx, 1);
  }
}
