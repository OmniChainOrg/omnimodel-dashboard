// lib/zoneRegistry.ts

export interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
  children: Zone[];
}

// 🧠 Declare once. Export once. Do not re-declare later.
export const ZoneRegistry: Zone[] = [
  {
    id: 'root',
    name: 'Root Zone Prototype',
    path: '',
    approved: false,
    depth: 0,
    children: [],
  }
];

// ✅ Add zone if it doesn't exist
export function addZone(zone: Zone) {
  const exists = ZoneRegistry.find(z => z.id === zone.id);
  if (!exists) {
    ZoneRegistry.push(zone);
    persistRegistry();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('zoneRegistryChange'));
    }
  }
}

// ✅ Approve zone in-place
export function approveZone(zone: Zone) {
  const target = ZoneRegistry.find(z => z.id === zone.id);
  if (target) {
    target.approved = true;
    persistRegistry();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('zoneRegistryChange'));
    }
  }
}

// ✅ Decline = remove
export function declineZone(zoneId: string) {
  const index = ZoneRegistry.findIndex(z => z.id === zoneId);
  if (index !== -1) {
    ZoneRegistry.splice(index, 1);
    persistRegistry();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('zoneRegistryChange'));
    }
  }
}

// ✅ Save to localStorage
function persistRegistry() {
  localStorage.setItem('zoneRegistry', JSON.stringify(ZoneRegistry));
}

// ⛽ Optional: load from localStorage (up to you)
export function loadRegistryFromStorage(): Zone[] {
  // SSR / non-browser guard
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem('zoneRegistry');
    const parsed: Zone[] = stored ? JSON.parse(stored) : [];

    // Update the in-memory registry
    ZoneRegistry.splice(0, ZoneRegistry.length, ...parsed);

    return parsed;
  } catch (e) {
    console.error('Failed to load registry from storage:', e);
    return [];
  }
}
