// lib/zoneRegistry.ts

// Definition of a Zone, now including its recursive children
export interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
  children: Zone[];            // ← added so we can push and flatMap safely
}

// Initial registry of zones (modify/add to taste)
export const ZoneRegistry: Zone[] = [
  {
    id: 'root',
    name: 'Root Zone Prototype',
    path: '/dashboard/root',
    approved: false,
    depth: 1,
    children: [],              // ← every Zone must now declare its children array
  },
  {
    id: 'omnitwin',
    name: 'OmniTwin',
    path: '/dashboard/omnitwin',
    approved: true,
    depth: 1,
    children: [],
  },
  {
    id: 'hopechain',
    name: 'HOPEChain',
    path: '/dashboard/hopechain',
    approved: true,
    depth: 1,
    children: [],
  },
  // …add any other pre-approved “root” zones here…
];

/**
 * Pushes a newly-generated zone into the registry as pending approval.
 * Does nothing if an entry with the same id already exists.
 */
export function addZone(zoneData: {
  id: string;
  name: string;
  path: string;
  depth: number;
}) {
  // Avoid duplicates
  if (!ZoneRegistry.some(z => z.id === zoneData.id)) {
    ZoneRegistry.push({
      id:       zoneData.id,
      name:     zoneData.name,
      path:     zoneData.path,
      depth:    zoneData.depth,
      approved: false,
      children: []       // ensure you have this field in your Zone type
    });
  }

/**
 * Approve (or re-approve) a zone.
 * If it already exists, flip its flag; otherwise push a new one—with an empty children array.
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
      children: [],            // ← required by our updated interface
    });
  }
}

/**
 * Decline (remove) a zone by its ID entirely.
 */
export function declineZone(zoneId: string) {
  const idx = ZoneRegistry.findIndex(z => z.id === zoneId);
  if (idx !== -1) {
    ZoneRegistry.splice(idx, 1);
  }
}
