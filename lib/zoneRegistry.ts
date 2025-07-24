// lib/zoneRegistry.ts
import type { Zone } from '@/types/Zone';

// In-memory registry seeded with a root prototype
// Default root zone used when no registry is persisted yet
let ZoneRegistry: Zone[] = [
  {
    id: 'root',
    name: 'Root Zone Prototype',
    path: '/dashboard/root',
    archetype: 'root',
    approved: false,
    depth: 1,
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
    console.log('Registry persisted to localStorage:', ZoneRegistry);
  } catch (e) {
    console.error('Failed to persist registry:', e);
  }
}

/**
 * Load and initialize the registry from localStorage.
 * Returns the loaded array or an empty array on errors.
 * Also seeds the in-memory registry for further operations.
 */
export function loadRegistryFromStorage(): Zone[] {
  // SSR/ non-browser safety
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem('zoneRegistry');
    console.log('Loading from localStorage:', stored);
    const parsed: Zone[] = stored ? JSON.parse(stored) : [];
    // Replace in-memory contents
    ZoneRegistry = parsed;
    return parsed;
  } catch (e) {
    console.error('Failed to load registry from storage:', e);
    return [];
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
  ZoneRegistry.push(zone);
  persistRegistry();
  window.dispatchEvent(new Event('zoneRegistryChange'));
}

/**
 * Get the zone registry based on the provided parameters.
 * This is a placeholder implementation. Replace with actual logic to fetch zones.
 */
export async function getZoneRegistry({
  archetypeId,
  archetypeName,
  depth,
}: {
  archetypeId: string;
  archetypeName: string;
  depth: number;
}): Promise<Zone | null> {
  try {
    // Placeholder logic to simulate fetching zones
    // Replace with actual API call or data fetching logic
    const response = await fetch(`/api/ce2/zoneGen`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ archetypeId, archetypeName, depth }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched zone tree:', data);

    // Ensure path is set for all zones
    const ensurePath = (z: Zone): Zone => ({
      ...z,
      path: z.path || `/default/path/${z.id}`,
      children: z.children?.map(child => ensurePath(child)),
    });

    const treeWithPaths = ensurePath(data);
    return treeWithPaths;
  } catch (error) {
    console.error('Failed to fetch zone tree:', error);
    return null;
  }
}

// Other functions like approveZone, declineZone, etc.
export function approveZone(zone: Zone): void {
  const index = ZoneRegistry.findIndex((z) => z.id === zone.id);
  if (index !== -1) {
    ZoneRegistry[index].approved = true;
    persistRegistry();
    window.dispatchEvent(new Event('zoneRegistryChange'));
  }
}

export function declineZone(zoneId: string): void {
  const index = ZoneRegistry.findIndex((z) => z.id === zoneId);
  if (index !== -1) {
    ZoneRegistry.splice(index, 1);
    persistRegistry();
    window.dispatchEvent(new Event('zoneRegistryChange'));
  }
}
