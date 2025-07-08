// updateRegistry.ts

import { ZoneRegistry } from './zoneRegistry';

export function approveZone(zoneData) {
  ZoneRegistry.push({
    id: zoneData.slug,
    name: zoneData.name,
    path: `/dashboard/${zoneData.slug}`,
    approved: true,
    depth: 1 // default, or adjust as needed
  });

  // 🔁 Optional: Add persistence logic here (e.g. write to JSON, database, etc.)
}
