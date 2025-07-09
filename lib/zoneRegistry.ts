// lib/zoneRegistry.ts
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

export function declineZone(zoneId: string) {
  const idx = ZoneRegistry.findIndex(z => z.id === zoneId);
  if (idx !== -1) ZoneRegistry.splice(idx, 1);
}


// Définition de ton type Zone
export interface Zone {
  id: string;
  name: string;
  path: string;
  approved: boolean;
  depth: number;
}

// Ton registre initial
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
  // … autres zones initiales
];

// Approuve (ou re-approuve) une zone
export function approveZone(zoneData: {
  id: string;
  name: string;
  path: string;
  depth: number;
}) {
  const existing = ZoneRegistry.find((z) => z.id === zoneData.id);
  if (existing) {
    // Si déjà présente, on bascule simplement le flag
    existing.approved = true;
  } else {
    // Sinon on l’ajoute avec approved = true
    ZoneRegistry.push({
      ...zoneData,
      approved: true,
    });
  }
}

// Décline (supprime) une zone par son id
export function declineZone(zoneId: string) {
  const idx = ZoneRegistry.findIndex((z) => z.id === zoneId);
  if (idx !== -1) {
    ZoneRegistry.splice(idx, 1);
  }
}
