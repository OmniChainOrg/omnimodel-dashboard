// lib/zoneRegistry.ts

// Central Zone interface with recursive children
export interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
  children: Zone[];
}

// Initial registry: define your root and any pre-approved zones
export const ZoneRegistry: Zone[] = [
  {
    id: 'root',
    name: 'Root Zone Prototype',
    path: '/dashboard/root',
    approved: false,
    depth: 1,
    children: []
  },
  {
    id: 'omnitwin',
    name: 'OmniTwin',
    path: '/dashboard/omnitwin',
    approved: true,
    depth: 1,
    children: []
  },
  {
    id: 'hopechain',
    name: 'HOPEChain',
    path: '/dashboard/hopechain',
    approved: true,
    depth: 1,
    children: []
  }
  // …autres zones prêtes à l’emploi
];

/**
 * Add a new zone as pending approval (approved=false)
 * If the id already exists, do nothing
 */
export function addZone(zoneData: {
  id: string;
  name: string;
  path: string;
  depth: number;
}) {
  if (!ZoneRegistry.some(z => z.id === zoneData.id)) {
    ZoneRegistry.push({
      id:       zoneData.id,
      name:     zoneData.name,
      path:     zoneData.path,
      approved: false,
      depth:    zoneData.depth,
      children: []
    });
  }
}

/**
 * Approve an existing zone (or add+approve if missing)
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
      id:       zoneData.id,
      name:     zoneData.name,
      path:     zoneData.path,
      approved: true,
      depth:    zoneData.depth,
      children: []
    });
  }
}

/**
 * Remove a zone by id (decline)
 */
export function declineZone(zoneId: string) {
  const idx = ZoneRegistry.findIndex(z => z.id === zoneId);
  if (idx !== -1) {
    ZoneRegistry.splice(idx, 1);
  }
}
