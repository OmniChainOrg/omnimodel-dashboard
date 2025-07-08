// updateRegistry.ts

import { ZoneRegistry } from './zoneRegistry';

export function approveZone(zoneData: { name: string; slug: string }) {
  ZoneRegistry.push({
    name: zoneData.name,
    path: `/dashboard/${zoneData.slug}`,
    approved: true
  });

  // 🔁 Optional: Add persistence logic here (e.g. write to JSON, database, etc.)
}
