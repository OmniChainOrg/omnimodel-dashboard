// lib/zoneRegistry.ts

export interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
  children: Zone[];
}

// In-memory registry seeded with a root prototype
export const ZoneRegistry: Zone[] = [
  {
    id: 'root',
    name: 'Root Zone Prototype',
    path: '',
    approved: false,
    depth: 0,
    children: [],
  },
];

/**
 * Persist the in-memory registry to localStorage.
 * Internal helper used by registry operations.
 */
function persistRegistry(): void {
  try {
    localStorage.setItem('zoneRegistry', JSON.stringify(ZoneRegistry));
  } catch (e) {
    console.error('Failed to persist registry:', e);
  }
}

/**
 * Add a new zone to the registry.
 * Skips if a zone with the same id already exists.
 * Persists the updated registry and notifies listeners.
 */
export function addZone(zone: Zone): void {
  // Prevent duplicate zones
  if (ZoneRegistry.some((z) => z.id === zone.id)) {
    return;
  }

  // Append and persist
  ZoneRegistry.push(zone);
  persistRegistry();

  // Dispatch change event for subscribers
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('zoneRegistryChange'));
  }
}

/**
 * Mark an existing zone as approved.
 * Updates the registry in-place, persists, and notifies listeners.
 */
export function approveZone(zone: Zone): void {
  const target = ZoneRegistry.find((z) => z.id === zone.id);
  if (target) {
    target.approved = true;
    persistRegistry();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('zoneRegistryChange'));
    }
  }
}

/**
 * Remove a zone by its identifier.
 * Persists the updated registry and notifies listeners.
 */
export function declineZone(zoneId: string): void {
  const index = ZoneRegistry.findIndex((z) => z.id === zoneId);
  if (index !== -1) {
    ZoneRegistry.splice(index, 1);
    persistRegistry();

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('zoneRegistryChange'));
    }
  }
}

/**
 * Load and initialize the registry from localStorage.
 * Returns the loaded array or an empty array on errors.
 * Also seeds the in-memory registry for further operations.
 */
export function loadRegistryFromStorage(): Zone[] {
  // SSR / non-browser safety
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem('zoneRegistry');
    const parsed: Zone[] = stored ? JSON.parse(stored) : [];

    // Replace in-memory contents
    ZoneRegistry.splice(0, ZoneRegistry.length, ...parsed);

    return parsed;
  } catch (e) {
    console.error('Failed to load registry from storage:', e);
    return [];
  }
}
